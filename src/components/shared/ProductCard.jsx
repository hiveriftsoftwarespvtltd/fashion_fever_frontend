import React from 'react';
import { ShoppingBag, Heart, Star, Truck, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../utils/toast';

const ProductCard = ({ product, isWishlisted, onWishlistToggle }) => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQty } = useCart();

  // Extract keys dynamically to support all formats from listing APIs
  const productId = product._id || product.id;
  const name = product.name || 'Unnamed Product';
  
  // Category resolution
  const getCategoryName = () => {
    if (product.category && typeof product.category === 'object') {
      return product.category.name || product.category.label || 'Skincare';
    }
    if (product.categoryId && typeof product.categoryId === 'object') {
      return product.categoryId.name || product.categoryId.label || 'Skincare';
    }
    return product.category || 'Skincare';
  };
  const categoryName = typeof getCategoryName() === 'object' ? 'Skincare' : String(getCategoryName());
  
  // Vendor resolution
  const getVendorName = () => {
    if (product.vendor && typeof product.vendor === 'object') {
      return product.vendor.businessName || product.vendor.name || 'WakeUp Luxe';
    }
    if (product.vendorId && typeof product.vendorId === 'object') {
      return product.vendorId.businessName || product.vendorId.name || 'WakeUp Luxe';
    }
    return product.brand || 'WakeUp Luxe';
  };
  const vendorName = typeof getVendorName() === 'object' ? 'WakeUp Luxe' : String(getVendorName());
  
  // Variants extraction
  const variants = product.variants || [];
  const firstVariant = variants[0] || {};
  const variantId = firstVariant._id || productId;
  
  // Pricing resolution
  const offeredPrice = firstVariant.offeredPrice !== undefined ? firstVariant.offeredPrice : (firstVariant.salesPrice !== undefined ? firstVariant.salesPrice : (product.price || 0));
  const salesPrice = firstVariant.salesPrice !== undefined ? firstVariant.salesPrice : (product.price || 0);
  
  // Stock and shipping
  const stock = firstVariant.stock !== undefined ? firstVariant.stock : 10;
  const isShippingApply = product.isShippingApply === true;
  
  // Image URL resolution
  const imageUrl = firstVariant.thumbnail?.url || (product.images?.[0]?.url || product.images?.[0]) || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop';
  
  // Rating and reviews resolution
  const averageRating = product.averageRating || product.rating || 0;
  const totalReviews = product.totalReviews || 0;

  // Calculate discount percentage
  const discountPercent = salesPrice > offeredPrice ? Math.round(((salesPrice - offeredPrice) / salesPrice) * 100) : 0;

  // Check if item is already in the cart
  const cartItem = cart?.find(item => item.id === variantId);
  const isInCart = !!cartItem;

  const handleCardClick = () => {
    navigate(`/product/${productId}`);
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    if (!isInCart) {
      const cartItemLocal = {
        id: variantId,
        name: `${name} ${firstVariant?.attributes?.color ? `(${firstVariant.attributes.color})` : ''}`,
        price: offeredPrice,
        image: imageUrl,
      };
      await addToCart(cartItemLocal, variantId, productId);
    }
    navigate('/checkout');
  };

  const renderStars = (rating) => {
    const stars = [];
    const displayRating = rating || 5;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={10}
          className={`${
            i <= displayRating
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-200 fill-gray-200'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 w-full cursor-pointer h-full font-outfit"
    >
      {/* Product Image Section */}
      <div className="relative w-full h-[150px] sm:h-[200px] overflow-hidden bg-gray-50 flex items-center justify-center">
        {/* Hover Zoom Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop'; }}
        />

        {/* Discount Badge on Top Left */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-rose-500 text-white text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Heart Icon on Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(productId, variantId);
          }}
          className={`absolute top-2.5 right-2.5 z-20 w-7.5 h-7.5 rounded-full flex items-center justify-center shadow-md backdrop-blur-md border transition-all active:scale-90 ${
            isWishlisted
              ? 'bg-rose-500 border-rose-500 text-white'
              : 'bg-white/80 border-white/50 text-gray-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart size={12} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Floating Add Button on Mobile */}
        <div className="absolute bottom-2.5 right-2.5 z-20 sm:hidden" onClick={(e) => e.stopPropagation()}>
          {isInCart ? (
            <div className="flex items-center bg-rose-500 text-white h-7.5 rounded-full px-1.5 gap-1 shadow-lg shadow-rose-500/20">
              <button
                onClick={() => {
                  if (cartItem.qty === 1) {
                    removeFromCart(cartItem.id);
                    toast.success(`${name} removed from bag`);
                  } else {
                    updateQty(cartItem.id, -1, productId);
                  }
                }}
                className="w-4 h-4 flex items-center justify-center hover:bg-white/10 rounded-full text-xs font-bold"
              >
                <Minus size={8} />
              </button>
              <span className="text-[9px] font-extrabold">{cartItem.qty}</span>
              <button
                onClick={() => {
                  if (stock && cartItem.qty >= stock) {
                    toast.error("Maximum available stock reached!");
                  } else {
                    updateQty(cartItem.id, 1, productId);
                  }
                }}
                className="w-4 h-4 flex items-center justify-center hover:bg-white/10 rounded-full text-xs font-bold"
              >
                <Plus size={8} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                const cartItemLocal = {
                  id: variantId,
                  name: `${name} ${firstVariant?.attributes?.color ? `(${firstVariant.attributes.color})` : ''}`,
                  price: offeredPrice,
                  image: imageUrl,
                };
                addToCart(cartItemLocal, variantId, productId);
                toast.success(`${name} added to bag`);
              }}
              disabled={stock === 0}
              className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 border border-rose-400/20"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Product Information Section */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-grow text-left">
        {/* Category & Vendor */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[8px] sm:text-[9px] font-extrabold uppercase text-rose-500 tracking-wider truncate max-w-[45%]">
            {categoryName}
          </span>
          <span className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase truncate max-w-[50%]">
            {vendorName}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-gray-900 font-extrabold text-sm sm:text-xs uppercase tracking-tight line-clamp-2 leading-snug min-h-[1.6rem] sm:min-h-[2rem] group-hover:text-rose-500 transition-colors mb-1">
          {name}
        </h3>

        {/* Rating Section */}
        <div className="mb-1">
          {totalReviews > 0 ? (
            <div className="flex items-center gap-1">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-gray-400">({totalReviews})</span>
            </div>
          ) : (
            <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 italic">No Reviews Yet</span>
          )}
        </div>

        {/* Shipping Badge */}
        {isShippingApply && (
          <div className="flex items-center gap-1 bg-emerald-50 text-[7px] sm:text-[8px] font-extrabold text-emerald-700 px-1.5 py-0.5 rounded w-fit mb-1">
            <Truck size={8} />
            <span>Free Shipping</span>
          </div>
        )}

        {/* Pricing Section */}
        <div className="flex items-baseline flex-wrap gap-1 mb-1.5">
          <span className="text-xs sm:text-sm font-black text-gray-900">₹{offeredPrice}</span>
          {salesPrice > offeredPrice && (
            <>
              <span className="text-[9px] sm:text-sm text-gray-400 line-through font-medium">₹{salesPrice}</span>
              <span className="text-[7px] sm:text-[8px] font-extrabold text-rose-500 bg-rose-50 px-1 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        {/* Stock Indicator */}
        <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-extrabold uppercase mb-2 mt-auto">
          {stock > 10 ? (
            <span className="text-emerald-600 flex items-center gap-0.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block"></span> In Stock
            </span>
          ) : stock > 0 ? (
            <span className="text-amber-600 flex items-center gap-0.5">
              <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse inline-block"></span> Few Left
            </span>
          ) : (
            <span className="text-rose-600 flex items-center gap-0.5">
              <span className="w-1 h-1 rounded-full bg-rose-500 inline-block"></span> Out of Stock
            </span>
          )}
        </div>

        {/* Action Buttons (Desktop Only) */}
        <div className="hidden sm:flex items-center gap-1.5 pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
          <div className="w-1/2">
            {isInCart ? (
              <div className="w-full h-7.5 border border-rose-500/20 rounded-lg flex items-center justify-between overflow-hidden bg-rose-500/5 text-rose-500 text-[9px] font-black uppercase select-none">
                <button
                  onClick={() => {
                    if (cartItem.qty === 1) {
                      removeFromCart(cartItem.id);
                      toast.success(`${name} removed from bag`);
                    } else {
                      updateQty(cartItem.id, -1, productId);
                    }
                  }}
                  className="px-1.5 h-full flex items-center justify-center hover:bg-rose-500/10 transition-colors"
                >
                  <Minus size={8} />
                </button>
                <span className="font-extrabold text-[8px]">{cartItem.qty} BAG</span>
                <button
                  onClick={() => {
                    if (stock && cartItem.qty >= stock) {
                      toast.error("Maximum available stock reached!");
                    } else {
                      updateQty(cartItem.id, 1, productId);
                    }
                  }}
                  className="px-1.5 h-full flex items-center justify-center hover:bg-rose-500/10 transition-colors"
                >
                  <Plus size={8} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  const cartItemLocal = {
                    id: variantId,
                    name: `${name} ${firstVariant?.attributes?.color ? `(${firstVariant.attributes.color})` : ''}`,
                    price: offeredPrice,
                    image: imageUrl,
                  };
                  addToCart(cartItemLocal, variantId, productId);
                  toast.success(`${name} added to bag`);
                }}
                disabled={stock === 0}
                className="w-full bg-gray-900 hover:bg-rose-500 text-white py-1.5 rounded-lg font-bold uppercase text-[8px] tracking-wider transition-all duration-300 flex items-center justify-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed h-7.5 cursor-pointer shadow-sm"
              >
                <ShoppingBag size={8} /> Add
              </button>
            )}
          </div>

          <button
            onClick={handleBuyNow}
            disabled={stock === 0}
            className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white py-1.5 rounded-lg font-bold uppercase text-[8px] tracking-wider transition-all duration-300 flex items-center justify-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed h-7.5 cursor-pointer shadow-sm"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
