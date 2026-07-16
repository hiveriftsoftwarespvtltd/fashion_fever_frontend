import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Star, Loader2 } from 'lucide-react';
import { getTopSellingProducts } from '../api/productService';
import { addToCart } from '../api/cartService';
import { addToWishlist, getWishlist, removeFromWishlist } from '../api/wishlistService';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '../utils/toast';
import { useCart } from '../context/CartContext';
import ProductCard from './shared/ProductCard';


const TopSellingProducts = () => {
  const navigate = useNavigate();
  const { cart, addToCart: addGlobalCart, removeFromCart, updateQty } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchTopSelling = async () => {
      try {
        const response = await getTopSellingProducts();
        if (response.success && isMounted) {
          const payload = response.data ?? response;
          if (Array.isArray(payload)) {
            // Extract product from { totalQuantitySold, product }
            const productsList = payload.map(item => item.product).filter(Boolean);
            setProducts(productsList);
          }
        }

        // Fetch wishlist only if logged in
        const sessionStr = localStorage.getItem('user_session');
        if (sessionStr && isMounted) {
          try {
            const wishRes = await getWishlist();
            if (wishRes.success) {
              const ids = wishRes.data?.items?.map(item => item.variant?._id || item.variant) || [];
              setWishlistIds(ids);
            }
          } catch (wishErr) {
            console.warn("Could not load authenticated wishlist:", wishErr);
          }
        }
      } catch (error) {
        console.error("Error fetching top selling products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTopSelling();
    return () => { isMounted = false; };
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
        toast.error(response.message || "Failed to sync cart data.");
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
          setWishlistIds(prev => [...prev, variantId]);
          toast.error(response.message || "Failed to remove item.");
        }
      } else {
        setWishlistIds(prev => [...prev, variantId]);
        const response = await addToWishlist(productId, variantId);
        if (response.success) {
          toast.success("Saved to Wishlist!");
        } else {
          setWishlistIds(prev => prev.filter(id => id !== variantId));
          toast.error(response.message || "Failed to add to wishlist.");
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
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-2" size={30} />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Top Products...</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50/50 py-16 font-outfit border-t border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div className="text-left">
            <span className="text-xs font-bold text-primary uppercase mb-2 block tracking-normal">Customer Favorites</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase italic">Top Products</h2>
          </div>
          <Link to="/shop" className="text-xs font-bold text-gray-400 hover:text-primary transition-all uppercase border-b-2 border-gray-100 hover:border-primary pb-1 tracking-normal">
            View All Products
          </Link>
        </div>

        {/* Grid: 4 columns on desktop, 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product) => {
            const firstVariant = product.variants?.[0];
            return (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={wishlistIds.includes(firstVariant?._id)}
                onWishlistToggle={() => handleAddToWishlist(product._id, firstVariant?._id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopSellingProducts;
