import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Camera,
  Share2,
  AlertCircle
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useCart } from '../context/CartContext';
import { addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../api/wishlistService';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQty } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isTryOnActive, setIsTryOnActive] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Dynamic Product Hydration from Endpoint
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/user/product-details/${id}`);
        // Endpoint unpacks: response.data.data.data
        const fetchedProduct = response?.data?.data?.data || response?.data?.data;
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setIsWishlisted(!!fetchedProduct.isWishlisted);
        } else {
          setError("Product details could not be found.");
        }
      } catch (err) {
        console.error("Failed loading product detail page:", err);
        setError("Something went wrong while fetching the product details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        {/* Shimmering Loading Skeleton */}
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8 space-y-12">
          <div className="h-6 w-48 bg-gray-100 rounded-lg animate-pulse" />
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/2 flex gap-4">
              <div className="flex flex-col gap-4 w-20">
                {[1, 2, 3].map(n => (
                  <div key={n} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
              <div className="flex-grow aspect-[4/5] rounded-3xl bg-gray-100 animate-pulse" />
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 w-3/4 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-24 w-full bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-12 w-1/2 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase">Failed to load product</h2>
        <p className="text-gray-500 mb-6 max-w-md">{error || "Product not found."}</p>
        <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase text-xs shadow-lg shadow-primary/20">
          Back to Shop
        </Link>
      </div>
    );
  }

  // Active Variant computed securely
  const currentVariant = product.variants?.[selectedVariantIndex] || product.variants?.[0] || {};
  const cartItem = cart?.find(item => item.id === currentVariant._id);
  const isInCart = !!cartItem;
  const variantImages = currentVariant.images?.length > 0 
    ? currentVariant.images 
    : (currentVariant.thumbnail ? [currentVariant.thumbnail] : []);

  // Compute discount percentage dynamically
  const hasDiscount = currentVariant.price && currentVariant.salesPrice && (currentVariant.price > currentVariant.salesPrice);
  const discountPercent = hasDiscount 
    ? Math.round(((currentVariant.price - currentVariant.salesPrice) / currentVariant.price) * 100)
    : 0;

  const handleAddProductToBag = () => {
    if (!currentVariant || currentVariant.stock <= 0) {
      toast.error("This variant is currently out of stock!");
      return;
    }

    const cartItem = {
      id: currentVariant._id || product._id,
      name: `${product.name} ${currentVariant.attributes?.Color ? `(${currentVariant.attributes.Color})` : ''}`,
      price: currentVariant.salesPrice || currentVariant.price,
      image: currentVariant.thumbnail?.url || variantImages?.[0]?.url || 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=100&h=100&fit=crop',
    };

    // Add selected quantity times
    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem, currentVariant._id, product._id);
    }
    
    toast.success(`Successfully added ${quantity} item(s) to your bag!`);
  };

  const handleShareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Product link copied to clipboard!");
  };

  const handleDirectPurchase = async () => {
    if (!currentVariant || currentVariant.stock <= 0) {
      toast.error("This variant is currently out of stock!");
      return;
    }

    const cartItem = {
      id: currentVariant._id || product._id,
      name: `${product.name} ${currentVariant.attributes?.Color ? `(${currentVariant.attributes.Color})` : ''}`,
      price: currentVariant.salesPrice || currentVariant.price,
      image: currentVariant.thumbnail?.url || variantImages?.[0]?.url || 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=100&h=100&fit=crop',
    };

    // Add selected quantity to cart
    for (let i = 0; i < quantity; i++) {
      await addToCart(cartItem, currentVariant._id, product._id);
    }
    
    toast.success("Proceeding to checkout...");
    navigate("/checkout");
  };

  const toggleWishlist = async () => {
    if (!product || !currentVariant) return;

    const previousState = isWishlisted;
    setIsWishlisted(!previousState);

    try {
      if (previousState) {
        const res = await apiRemoveFromWishlist(currentVariant._id);
        if (res.success) {
          toast.success("Removed from your Wishlist");
        } else {
          setIsWishlisted(previousState);
          toast.error(res.message || "Failed to remove from wishlist.");
        }
      } else {
        const res = await apiAddToWishlist(product._id, currentVariant._id);
        if (res.success) {
          toast.success("Added to your Wishlist!");
        } else {
          setIsWishlisted(previousState);
          toast.error(res.message || "Failed to add to wishlist.");
        }
      }
    } catch (err) {
      setIsWishlisted(previousState);
      toast.error("Wishlist operation failed.");
      console.error("Wishlist error:", err);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs (Responsive) */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4 border-b border-gray-50">
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="hover:text-primary transition-colors">{product.categoryId?.name || 'Category'}</span>
          <ChevronRight size={10} />
          <span className="text-gray-900 truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Spacious 1600px Layout */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

          {/* Left Column: Image Section */}
          <div className="w-full lg:w-1/2 max-w-[480px] flex flex-col gap-4">
            
            {/* Main Stage Image */}
            <div className="w-full relative aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
              {variantImages[selectedImage] ? (
                <img 
                  src={variantImages[selectedImage].url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold bg-gray-50">
                  No Image Available
                </div>
              )}

              {/* AI Try-On Trigger Button */}
              {currentVariant.attributes?.Color && (
                <button
                  onClick={() => setIsTryOnActive(true)}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2.5 shadow-2xl hover:bg-white transition-all group/btn border border-gray-100"
                >
                  <div className="bg-primary p-2 rounded-full text-white group-hover/btn:scale-110 transition-all shadow-md shadow-primary/25">
                    <Camera size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase text-gray-800 tracking-wider">Virtual Try-On</span>
                </button>
              )}
            </div>

            {/* Gallery Thumbnails List (Moved to Bottom) */}
            {variantImages.length > 0 && (
              <div className="flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {variantImages.map((img, i) => (
                  <button
                    key={img._id || i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all p-0.5 bg-white ${
                      selectedImage === i ? 'border-primary shadow-md scale-95' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info Details Section */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                {product.categoryId?.name || 'WAKEUP Luxe'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg">
                  <span className="text-xs font-bold text-green-600">4.8</span>
                  <Star size={12} className="fill-green-600 text-green-600" />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">1.2K reviews</span>
                <div className="h-4 w-[1px] bg-gray-200 hidden sm:block"></div>
                <button 
                  onClick={handleShareProduct} 
                  className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>

            {/* Price Container */}
            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                    ₹{currentVariant.salesPrice || currentVariant.price || '0'}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg font-semibold text-gray-300 line-through">
                      ₹{currentVariant.price}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Price Inclusive of all taxes
                </p>
              </div>

              {hasDiscount && (
                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1.5 rounded-full shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Product Info</h3>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                {product.description || "No description provided for this product."}
              </p>
            </div>

            {/* Dynamic Variant Selector Grid */}
            {product.variants?.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                    Select Option
                  </h3>
                  {currentVariant.stock <= 3 && currentVariant.stock > 0 && (
                    <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded">
                      Only {currentVariant.stock} left in stock!
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.variants.map((v, i) => {
                    const isSelected = selectedVariantIndex === i;
                    const color = v.attributes?.Color || v.attributes?.color;
                    const size = v.attributes?.Size || v.attributes?.size;
                    
                    return (
                      <button
                        key={v._id || i}
                        onClick={() => {
                          setSelectedVariantIndex(i);
                          setSelectedImage(0);
                        }}
                        className={`px-4 py-3.5 rounded-2xl border-2 text-left transition-all relative ${
                          isSelected 
                            ? 'border-primary bg-primary/[0.01] shadow-sm' 
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 uppercase">
                            {color || 'Variant'} {size ? `/ ${size}` : ''}
                          </span>
                          {isSelected && (
                            <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                          )}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1 flex justify-between uppercase">
                          <span>₹{v.salesPrice || v.price}</span>
                          <span>{v.stock > 0 ? `Stock: ${v.stock}` : 'Out of Stock'}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions Group Container */}
            <div className="flex items-center gap-3 pt-6 w-full">
              {/* Add to Bag (Morphic Button with Inline Count) */}
              {isInCart ? (
                <div className="flex-1 flex items-center border-2 border-primary text-primary h-14 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all overflow-hidden bg-white">
                  <button 
                    onClick={() => {
                      if (cartItem.qty === 1) {
                        removeFromCart(cartItem.id);
                        toast.success("Removed from your bag.");
                      } else {
                        updateQty(cartItem.id, -1, product._id);
                      }
                    }}
                    className="w-12 h-full flex items-center justify-center bg-primary/5 hover:bg-primary/10 text-base font-bold transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-grow text-center font-extrabold select-none text-[10px] tracking-wider">
                    Added to Bag ({cartItem.qty})
                  </span>
                  <button 
                    onClick={() => {
                      if (currentVariant.stock && cartItem.qty >= currentVariant.stock) {
                        toast.error("Not enough stock available!");
                      } else {
                        updateQty(cartItem.id, 1, product._id);
                      }
                    }}
                    className="w-12 h-full flex items-center justify-center bg-primary/5 hover:bg-primary/10 text-base font-bold transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddProductToBag}
                  className="flex-1 bg-white hover:bg-gray-50 text-primary border-2 border-primary h-14 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart size={16} /> Add to Bag
                </button>
              )}

              {/* Direct Purchase Button */}
              <button
                onClick={handleDirectPurchase}
                className="flex-1 bg-primary text-white h-14 rounded-xl font-bold uppercase text-[11px] tracking-wider shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-hover transition-all cursor-pointer"
              >
                Buy Now
              </button>

              {/* Wishlist Button */}
              <button 
                onClick={toggleWishlist}
                className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                  isWishlisted 
                    ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100/50' 
                    : 'border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100'
                }`}
              >
                <Heart size={20} className={isWishlisted ? 'fill-red-500' : ''} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50/50 rounded-2xl border border-gray-50">
                <ShieldCheck className="text-primary" size={20} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-600">100% Genuine</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50/50 rounded-2xl border border-gray-50">
                <RotateCcw className="text-primary" size={20} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-600">15 Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50/50 rounded-2xl border border-gray-50">
                <Truck className="text-primary" size={20} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-600">Free Delivery</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-20 pt-12 border-t border-gray-100 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4].map(i => <Star key={i} size={14} fill="currentColor" />)}
                <Star size={14} className="text-gray-200" fill="currentColor" />
              </div>
              <span className="text-xs font-bold text-gray-800">4.2 Out of 5</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">(128 Reviews)</span>
            </div>
          </div>
          <button 
            onClick={() => toast("Reviews are currently in read-only mode.")}
            className="bg-gray-900 text-white px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
          >
            Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50/60 p-6 sm:p-8 rounded-3xl space-y-4 border border-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase text-gray-800">Anita Sharma</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase">Verified Buyer • 2 days ago</p>
              </div>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="currentColor" />)}
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              "The product texture is wonderful! It stays on all day long without drying out. Will absolutely buy again."
            </p>
          </div>

          <div className="bg-gray-50/60 p-6 sm:p-8 rounded-3xl space-y-4 border border-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase text-gray-800">Rohit Mehta</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase">Verified Buyer • 1 week ago</p>
              </div>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4].map(s => <Star key={s} size={10} fill="currentColor" />)}
                <Star size={10} className="text-gray-200" fill="currentColor" />
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              "Exceeded expectations, very premium finish and excellent delivery speed. Value for money."
            </p>
          </div>
        </div>
      </div>

      {/* AI Try-On Overlay */}
      {isTryOnActive && (
        <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center p-4">
          <div className="absolute top-6 right-6">
            <button 
              onClick={() => setIsTryOnActive(false)} 
              className="w-12 h-12 bg-white/10 hover:bg-white/20 transition-all rounded-full flex items-center justify-center text-white text-lg border border-white/5 shadow"
            >
              ✕
            </button>
          </div>

          <div className="relative w-full max-w-lg aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=600&h=800&fit=crop" 
              alt="Face" 
              className="w-full h-full object-cover opacity-60" 
            />

            <div className="absolute inset-0 border-4 border-primary/20 rounded-3xl pointer-events-none" />

            <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-6 px-4">
              <div className="flex gap-3 p-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 overflow-x-auto max-w-full">
                {product.variants.map((v, i) => (
                  <button
                    key={v._id || i}
                    onClick={() => {
                      setSelectedVariantIndex(i);
                      setSelectedImage(0);
                    }}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 ${
                      selectedVariantIndex === i ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: v.attributes?.Color === 'Red' ? '#b91c1c' : '#C9A96E' }}
                  />
                ))}
              </div>
              <p className="text-white font-bold uppercase text-[10px] tracking-widest bg-primary px-5 py-2 rounded-full shadow-lg">
                Applying {currentVariant.attributes?.Color || 'shade'}
              </p>
            </div>
          </div>

          <p className="mt-6 text-white/40 text-[9px] font-bold uppercase tracking-widest">
            AI Vision Technology • Real-time Shade Overlay
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
