import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Star, Loader2 } from 'lucide-react';
import { getProducts } from '../api/productService';
import { addToCart } from '../api/cartService';
import { addToWishlist, getWishlist, removeFromWishlist } from '../api/wishlistService';
import { Link } from 'react-router-dom';
import { toast } from '../utils/toast';
import { useCart } from '../context/CartContext';

const ProductSection = () => {
  const { cart, addToCart: addGlobalCart, removeFromCart, updateQty } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

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
    // Multi-dimensional array structures image dynamic fallbacks paths checks
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => {
            const firstVariant = product.variants?.[0];
            const uniqueId = firstVariant?._id || product._id;
            const isItemWishlisted = wishlistIds.includes(firstVariant?._id);

            return (
              <div key={product._id} className="group flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                {/* Image Wrapper Block */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-gray-50">
                  <Link to={`/product/${product._id}`}>
                    <img 
                      src={getImageUrl(firstVariant, product)} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=500&fit=crop'; }}
                    />
                  </Link>
                  
                  {/* Floating Action Badge */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <button 
                      onClick={() => handleAddToWishlist(product._id, firstVariant?._id)}
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 bg-white/90 backdrop-blur-md cursor-pointer ${
                        isItemWishlisted ? 'text-primary' : 'text-gray-400 hover:text-primary'
                      }`}
                    >
                      <Heart 
                        size={14} 
                        fill={isItemWishlisted ? "currentColor" : "none"} 
                        className={isItemWishlisted ? "fill-primary animate-bounce-short" : ""}
                      />
                    </button>
                  </div>
                </div>

                {/* Content Details Grid */}
                <div className="p-2.5 sm:p-4 flex-grow flex flex-col justify-between text-left bg-white">
                  <div>
                    <div className="flex justify-between items-start mb-1 sm:mb-1.5">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary/80">
                        {product.brand || 'WakeUp Luxe'}
                      </span>
                      {/* Ratings Star Row */}
                      <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-50 px-1 sm:px-1.5 py-0.5 rounded-md border border-gray-100">
                        <Star size={9} fill="currentColor" className="text-yellow-500" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-700">{product.rating || '4.2'}</span>
                      </div>
                    </div>
                    
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 hover:text-primary transition-colors leading-snug mb-1 sm:mb-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Pricing Fields */}
                    <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                      <span className="text-sm sm:text-lg font-black text-gray-900">₹{firstVariant?.salesPrice || firstVariant?.price || 0}</span>
                      {firstVariant?.salesPrice < firstVariant?.price && (
                        <>
                          <span className="text-[10px] sm:text-xs font-medium text-gray-400 line-through">₹{firstVariant.price}</span>
                          <span className="text-[8px] sm:text-[10px] font-bold text-green-700 bg-green-100/80 px-1 sm:px-1.5 py-0.5 rounded uppercase tracking-wide ml-0 sm:ml-1">
                            {Math.round(((firstVariant.price - firstVariant.salesPrice) / firstVariant.price) * 100)}% Off
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity In-Bag Management Controls Toggle */}
                  <div className="mt-auto">
                    {(() => {
                      const cartItem = cart?.find(item => item.id === firstVariant?._id);
                      const isInCart = !!cartItem;
                      
                      return isInCart ? (
                        <div className="w-full h-10 border border-primary/20 rounded-lg flex items-center justify-between overflow-hidden bg-primary/5 text-primary text-xs font-bold uppercase select-none shadow-sm">
                          <button
                            onClick={() => {
                              if (cartItem.qty === 1) {
                                removeFromCart(cartItem.id);
                                toast.success("Removed from Bag");
                              } else {
                                updateQty(cartItem.id, -1, product._id);
                              }
                            }}
                            className="w-10 h-full flex items-center justify-center hover:bg-primary/10 text-lg transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="flex-grow text-center text-[11px] tracking-normal font-bold">
                            {cartItem.qty} IN BAG
                          </span>
                          <button
                            onClick={() => {
                              if (firstVariant?.stock && cartItem.qty >= firstVariant.stock) {
                                toast.error("Maximum available stock reached!");
                              } else {
                                updateQty(cartItem.id, 1, product._id);
                              }
                            }}
                            className="w-10 h-full flex items-center justify-center hover:bg-primary/10 text-lg transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={async () => {
                            const cartItemLocal = {
                              id: firstVariant?._id,
                              name: `${product.name} ${firstVariant?.attributes?.color ? `(${firstVariant.attributes.color})` : ''}`,
                              price: firstVariant?.salesPrice || firstVariant?.price || 0,
                              image: firstVariant?.thumbnail?.url || (product.images?.[0]?.url || product.images?.[0]) || '',
                            };
                            addGlobalCart(cartItemLocal, firstVariant?._id, product._id);
                            toast.success("Added to Bag!");
                            await handleAddToCart(product._id, firstVariant?._id);
                          }}
                          disabled={addingId === firstVariant?._id || (firstVariant?.stock !== undefined && firstVariant.stock <= 0)}
                          className="w-full bg-gray-900 text-white hover:bg-primary py-2.5 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider shadow-md hover:shadow-lg cursor-pointer"
                        >
                          {addingId === firstVariant?._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (firstVariant?.stock !== undefined && firstVariant.stock <= 0) ? (
                            "Out of Stock"
                          ) : (
                            "Add to Bag"
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;