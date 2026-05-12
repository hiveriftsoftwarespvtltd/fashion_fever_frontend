import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Star, Loader2 } from 'lucide-react';
import { getProducts } from '../api/productService';
import { addToCart } from '../api/cartService';
import { addToWishlist, getWishlist, removeFromWishlist } from '../api/wishlistService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts({ limit: 10 });
      if (response.success) {
        setProducts(response.data.data || []);
      }
      setLoading(false);
    };

    const fetchWishlist = async () => {
      const response = await getWishlist();
      if (response.success) {
        const ids = response.data.items?.map(item => item.variant?._id) || [];
        setWishlistIds(ids);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, []);

  const handleAddToCart = async (productId, variantId) => {
    if (!variantId || !productId) {
      toast.error("Product information missing.");
      return;
    }
    
    setAddingId(variantId);
    try {
      const response = await addToCart(productId, variantId);
      if (response.success) {
        toast.success("Added to Bag!");
      } else {
        toast.error(response.message || "Failed to add to bag.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setAddingId(null);
    }
  };

  const handleAddToWishlist = async (productId, variantId) => {
    if (!productId || !variantId) {
      toast.error("Product information missing.");
      return;
    }

    const isWishlisted = wishlistIds.includes(variantId);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await removeFromWishlist(variantId);
        if (response.success) {
          toast.success("Removed from Wishlist!");
          setWishlistIds(prev => prev.filter(id => id !== variantId));
        } else {
          toast.error(response.message || "Failed to remove.");
        }
      } else {
        // Add to wishlist
        const response = await addToWishlist(productId, variantId);
        if (response.success) {
          toast.success("Saved to Wishlist!");
          setWishlistIds(prev => [...prev, variantId]);
        } else {
          toast.error(response.message || "Failed to save.");
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const getImageUrl = (variant) => {
    return variant?.thumbnail?.url || 'https://via.placeholder.com/400x500?text=No+Image';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Discovering Beauty...</p>
      </div>
    );
  }

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2 block">Our Curated Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase italic">Best Sellers For You</h2>
          </div>
          <Link to="/shop" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase border-b border-gray-200 pb-1">
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => {
            const firstVariant = product.variants?.[0];
            return (
              <div key={product._id} className="group flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                  <Link to={`/product/${product._id}`}>
                    <img 
                      src={getImageUrl(firstVariant)} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                  </Link>
                  
                  <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => handleAddToWishlist(product._id, firstVariant?._id)}
                      className={`w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        wishlistIds.includes(firstVariant?._id) ? 'text-primary' : 'text-gray-800 hover:text-primary'
                      }`}
                    >
                      <Heart 
                        size={14} 
                        className={wishlistIds.includes(firstVariant?._id) ? "fill-primary" : ""} 
                      />
                    </button>
                  </div>
                </div>

                {/* Info Container */}
                <div className="px-4 py-4 flex-grow flex flex-col gap-2">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1 uppercase hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-sm font-bold text-gray-900">₹{firstVariant?.salesPrice || firstVariant?.price}</span>
                    {firstVariant?.salesPrice < firstVariant?.price && (
                      <>
                        <span className="text-xs font-bold text-gray-400 line-through">₹{firstVariant.price}</span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                          {Math.round(((firstVariant.price - firstVariant.salesPrice) / firstVariant.price) * 100)}% Off
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < 4 ? "fill-gray-900 text-gray-900" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">(120)</span>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product._id, firstVariant?._id)}
                    disabled={addingId === firstVariant?._id}
                    className="mt-4 w-full border border-gray-100 hover:border-primary py-3 rounded-xl text-xs font-bold text-primary uppercase tracking-widest transition-all hover:bg-primary hover:text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingId === firstVariant?._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Move to Bag"
                    )}
                  </button>
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
