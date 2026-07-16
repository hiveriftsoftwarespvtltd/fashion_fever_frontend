import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Heart, Star, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts } from '../api/productService';
import { addToCart } from '../api/cartService';
import { addToWishlist, getWishlist, removeFromWishlist } from '../api/wishlistService';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '../utils/toast';
import { useCart } from '../context/CartContext';
import ProductCard from './shared/ProductCard';

const ProductSection = () => {
  const navigate = useNavigate();
  const { cart, addToCart: addGlobalCart, removeFromCart, updateQty } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  const scrollRef    = useRef(null);
  const rafRef       = useRef(null);
  const isPausedRef  = useRef(false);

  const scrollBy = (dir) => {
    isPausedRef.current = true;
    const el = scrollRef.current;
    if (el) {
      // Scroll by one viewport page width (adjusted slightly)
      const offset = el.clientWidth * 0.8 * dir;
      el.scrollBy({ left: offset, behavior: 'smooth' });
    }
    setTimeout(() => { isPausedRef.current = false; }, 1000);
  };

  // ── Smooth auto-scroll via RAF ──────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const tick = () => {
      if (!isPausedRef.current && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += 0.7;
        // Loop back to start when reaching the end
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
          el.scrollLeft = 0;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [products]); // restart when products load

  // ── Pause on touch ──────────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pause  = () => { isPausedRef.current = true; };
    const resume = () => { setTimeout(() => { isPausedRef.current = false; }, 1200); };
    el.addEventListener('touchstart', pause,  { passive: true });
    el.addEventListener('touchend',   resume, { passive: true });
    return () => {
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend',   resume);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardContent = async () => {
      try {
        // Fetch products without token dependency
        const prodRes = await getProducts({ limit: 10 });
        if (isMounted && prodRes.success) {
          let extractedProducts = [];
          const rawData = prodRes.data;
          
          if (Array.isArray(rawData)) {
            extractedProducts = rawData;
          } else if (rawData) {
            if (Array.isArray(rawData.products)) {
              extractedProducts = rawData.products;
            } else if (Array.isArray(rawData.data)) {
              extractedProducts = rawData.data;
            } else if (rawData.data && Array.isArray(rawData.data.products)) {
              extractedProducts = rawData.data.products;
            } else if (rawData.data && Array.isArray(rawData.data.data)) {
              extractedProducts = rawData.data.data;
            }
          }
          setProducts(extractedProducts);
        }

        // Fetch wishlist only if user is logged in
        const sessionStr = localStorage.getItem('user_session');
        if (sessionStr) {
          try {
            const wishRes = await getWishlist();
            if (isMounted && wishRes.success) {
              const ids = wishRes.data?.items?.map(item => item.variant?._id || item.variant) || [];
              setWishlistIds(ids);
            }
          } catch (wishErr) {
            console.warn("Could not load authenticated wishlist:", wishErr);
          }
        }
      } catch (err) {
        console.error("Error synchronizing customer home view data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardContent();
    return () => { isMounted = false; }; // Clean up reference tree unmounting state triggers
  }, []);

  const handleAddToCart = async (productId, variantId) => {
    if (!variantId || !productId) {
      toast.error("Product configuration parameters missing.");
      return;
    }
    
    setAddingId(variantId);
    try {
      const response = await addToCart(productId, variantId);
      if (!response.success) {
        toast.error(response.message || "Failed to sync cart data to cloud server.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddingId(null);
    }
  };

  const handleAddToWishlist = async (productId, variantId) => {
    if (!productId || !variantId) {
      toast.error("Product identifier references missing.");
      return;
    }

    const isWishlisted = wishlistIds.includes(variantId);
    try {
      if (isWishlisted) {
        setWishlistIds(prev => prev.filter(id => id !== variantId));
        const response = await removeFromWishlist(variantId);
        if (response.success) {
          toast.success("Removed from Wishlist!");
        } else {
          setWishlistIds(prev => [...prev, variantId]); // Rollback on error
          toast.error(response.message || "Failed to clear item.");
        }
      } else {
        setWishlistIds(prev => [...prev, variantId]);
        const response = await addToWishlist(productId, variantId);
        if (response.success) {
          toast.success("Saved to Wishlist!");
        } else {
          setWishlistIds(prev => prev.filter(id => id !== variantId)); // Rollback on error
          toast.error(response.message || "Failed to update wishlist.");
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const getImageUrl = (variant, product) => {
    if (variant?.thumbnail?.url) return variant.thumbnail.url;
    if (typeof variant?.thumbnail === 'string') return variant.thumbnail;
    if (product?.images?.[0]?.url) return product.images[0].url;
    if (typeof product?.images?.[0] === 'string') return product.images[0];
    return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=500&fit=crop';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-normal">Discovering Beauty...</p>
      </div>
    );
  }

  return (
    <section className="bg-white py-16 font-outfit">
      <style>{`.ps-track::-webkit-scrollbar{display:none}`}</style>
      <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div className="text-left">
            <span className="text-xs font-bold text-primary uppercase mb-2 block tracking-normal">Our Curated Collection</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 uppercase italic">Best Sellers For You</h2>
          </div>
          <Link to="/shop" className="text-xs font-bold text-gray-400 hover:text-primary transition-all uppercase border-b-2 border-gray-100 hover:border-primary pb-1 tracking-normal">
            View All Products
          </Link>
        </div>

        {/* ── Carousel strip ─────────────────────────────── */}
        <div className="relative">

          {/* ← Prev */}
          <button
            onClick={() => scrollBy(-1)}
            className="absolute left-0 top-1/2 -translate-y-6 z-20 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all duration-200 hover:scale-105 cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* → Next */}
          <button
            onClick={() => scrollBy(1)}
            className="absolute right-0 top-1/2 -translate-y-6 z-20 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all duration-200 hover:scale-105 cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="ps-track flex gap-4 overflow-x-auto px-10 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => { isPausedRef.current = true; }}
            onMouseLeave={() => { isPausedRef.current = false; }}
          >
            {products.map((product) => {
              const firstVariant = product.variants?.[0];
              return (
                <div
                  key={product._id}
                  className="flex-shrink-0 w-[calc((100%-1rem)/2)] sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] xl:w-[calc((100%-4rem)/5)]"
                >
                  <ProductCard
                    product={product}
                    isWishlisted={wishlistIds.includes(firstVariant?._id)}
                    onWishlistToggle={() => handleAddToWishlist(product._id, firstVariant?._id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;