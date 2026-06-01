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
  Share2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Info
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useCart } from '../context/CartContext';
import { addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../api/wishlistService';
import { toast } from '../utils/toast';
import { useUser } from '../context/UserContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQty } = useCart();
  const { isAuthenticated } = useUser();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/public-user/product-details/${id}`);
        const fetchedProduct = response?.data?.data?.data || response?.data?.data;
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setIsWishlisted(!!fetchedProduct.isWishlisted);
        } else {
          setError("Product configuration parameters mismatch.");
        }
      } catch (err) {
        console.error("Failed loading product detail page:", err);
        setError("Something went wrong while fetching the product details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-[#fafafa] min-h-screen flex items-center justify-center font-outfit">
        <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square bg-gray-200 rounded-3xl w-full" />
            <div className="flex gap-3"><div className="w-16 h-16 bg-gray-200 rounded-xl" /><div className="w-16 h-16 bg-gray-200 rounded-xl" /></div>
          </div>
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="h-4 w-24 bg-gray-200 rounded-md" />
            <div className="h-10 w-3/4 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#fcfcfc] min-h-screen flex flex-col items-center justify-center p-6 text-center font-outfit">
        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl max-w-sm w-full">
          <AlertCircle size={40} className="text-primary mx-auto mb-4" />
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Payload Missing</h2>
          <p className="text-xs font-medium text-gray-400 uppercase mt-1 leading-relaxed">{error || "Product identity not found."}</p>
          <Link to="/shop" className="mt-6 block w-full bg-primary text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/25 hover:scale-[1.01] transition-all">
            Return To Shop
          </Link>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants?.[selectedVariantIndex] || product.variants?.[0] || {};
  const cartItem = cart?.find(item => item.id === currentVariant._id);
  const isInCart = !!cartItem;
  const variantImages = currentVariant.images?.length > 0 
    ? currentVariant.images 
    : (currentVariant.thumbnail ? [currentVariant.thumbnail] : []);

  const hasDiscount = currentVariant.salesPrice && currentVariant.offeredPrice && (currentVariant.salesPrice > currentVariant.offeredPrice);
  const discountPercent = hasDiscount ? Math.round(((currentVariant.salesPrice - currentVariant.offeredPrice) / currentVariant.salesPrice) * 100) : 0;

  const handleAddProductToBag = () => {
    if (!isAuthenticated) {
      toast.error("Please login for shopping");
      return;
    }
    if (!currentVariant || currentVariant.stock <= 0) {
      toast.error("This option is currently out of stock!");
      return;
    }

    const itemPayload = {
      id: currentVariant._id || product._id,
      name: `${product.name} ${currentVariant.attributes?.Color || currentVariant.attributes?.color ? `(${currentVariant.attributes.Color || currentVariant.attributes.color})` : ''}`,
      price: currentVariant.offeredPrice || currentVariant.salesPrice || 0,
      image: currentVariant.thumbnail?.url || variantImages?.[0]?.url || '',
    };

    addToCart(itemPayload, currentVariant._id, product._id);
    toast.success(`In Bag! Added successfully.`);
  };

  const handleDirectPurchase = async () => {
    if (!isAuthenticated) {
      toast.error("Please login for shopping");
      return;
    }
    if (!currentVariant || currentVariant.stock <= 0) {
      toast.error("Option out of inventory.");
      return;
    }

    const itemPayload = {
      id: currentVariant._id || product._id,
      name: `${product.name}`,
      price: currentVariant.offeredPrice || currentVariant.salesPrice || 0,
      image: currentVariant.thumbnail?.url || '',
    };

    await addToCart(itemPayload, currentVariant._id, product._id);
    navigate("/checkout");
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login for shopping");
      return;
    }
    if (!product || !currentVariant) return;
    const previousState = isWishlisted;
    setIsWishlisted(!previousState);

    try {
      if (previousState) {
        const res = await apiRemoveFromWishlist(currentVariant._id);
        if (res.success) toast.success("Removed from Wishlist");
        else { setIsWishlisted(previousState); toast.error(res.message); }
      } else {
        const res = await apiAddToWishlist(product._id, currentVariant._id);
        if (res.success) toast.success("Added to Wishlist!");
        else { setIsWishlisted(previousState); toast.error(res.message); }
      }
    } catch (err) {
      setIsWishlisted(previousState);
      toast.error("System linkage sync failed.");
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen flex flex-col font-outfit text-gray-800">
      
      {/* Dynamic Navigation Line Map (Breadcrumbs) */}
      <div className="bg-white border-b border-gray-100 py-3.5 sticky top-0 z-30">
        <div className="container max-w-[1500px] mx-auto px-4 md:px-8 flex items-center">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <Link to="/shop" className="hover:text-primary transition-colors">Catalog</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-primary font-black">{product.categoryId?.name || 'Luxe Grid'}</span>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-gray-900 truncate max-w-[150px] font-bold">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Structural Splitting Grid */}
      <div className="container max-w-[1500px] mx-auto px-4 md:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ──► LEFT ASPECT PANEL: Image Stage Controls (Fixed 5 Columns) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-[100px]">
            <div className="w-full max-w-[320px] sm:max-w-[450px] lg:max-w-none mx-auto relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center group/stage">
              {variantImages[selectedImage] ? (
                <img 
                  src={variantImages[selectedImage].url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover/stage:scale-102"
                />
              ) : (
                <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">Image Pool Empty</div>
              )}

              {/* Float Category Micro-badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-gray-900/90 text-white backdrop-blur-md text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">
                  {product.brand || 'WakeUp Luxe'}
                </span>
              </div>
            </div>

            {/* Micro Gallery Track Row */}
            {variantImages.length > 1 && (
              <div className="flex flex-wrap gap-2.5 pt-1 justify-center lg:justify-start">
                {variantImages.map((img, i) => (
                  <button
                    key={img._id || i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white cursor-pointer ${
                      selectedImage === i ? 'border-primary shadow-md scale-95' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ──► RIGHT ASPECT PANEL: Core Metadata Content Info (7 Columns) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Title Summary Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase">
                  <span>4.8</span> <Star size={10} fill="currentColor" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">(1,240 Verified Reviews)</span>
              </div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-wide leading-tight pt-1">
                {product.name}
              </h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Vendor Node: <span className="text-gray-700 font-extrabold">{product.vendorId?.businessName || 'Platform Luxe Origin'}</span>
              </p>
            </div>

            {/* ──► MORPHIC PRICING BLOCKS MATRIX */}
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 flex-wrap relative overflow-hidden group">
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
                    ₹{(currentVariant.offeredPrice || currentVariant.salesPrice || 0).toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs md:text-sm font-bold text-gray-300 line-through">
                      ₹{currentVariant.salesPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-green-600 uppercase tracking-wider">
                  <ShieldCheck size={12} className="stroke-[2.5]" /> Price Inclusive of GST Architecture 
                </div>
              </div>

              {hasDiscount && (
                <div className="bg-primary/5 text-primary border border-primary/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {discountPercent}% SAVED
                </div>
              )}
            </div>

            {/* Spec Attributes Strip Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded-xl border border-gray-100 flex items-center gap-3">
                <Truck size={16} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Item weight</p>
                  <p className="text-xs font-extrabold text-gray-800 mt-0.5">{currentVariant.weight ? `${currentVariant.weight} kg` : '0.15 kg'}</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-100 flex items-center gap-3">
                <RotateCcw size={16} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Box Dimensions</p>
                  <p className="text-xs font-extrabold text-gray-800 mt-0.5">{currentVariant.length || '5'}×{currentVariant.width || '5'}×{currentVariant.height || '10'} cm</p>
                </div>
              </div>
            </div>

            {/* Description Overview Section */}
            <div className="space-y-2 pt-2 border-t border-gray-50">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                <Info size={12} /> Formulation Details
              </h3>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed max-w-2xl uppercase tracking-wide">
                {product.description || "Premium skin-compatible formulation curated specifically under certified diagnostic guidelines."}
              </p>
            </div>

            {/* ──► PREMIUM COMPACT SELECTION SWATCH MATRIX */}
            {product.variants?.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available Variants</h3>
                  {currentVariant.stock <= 3 && currentVariant.stock > 0 && (
                    <span className="text-[8px] font-black text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded border border-red-100 animate-pulse tracking-wider">
                      Stock Alert: Only {currentVariant.stock} Items Left!
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                        className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-primary bg-primary/[0.01] ring-2 ring-primary/5' 
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-black uppercase truncate ${isSelected ? 'text-primary' : 'text-gray-800'}`}>
                            {color || 'Standard Code'} {size ? `• ${size}` : ''}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                            Cost: ₹{(v.offeredPrice || v.salesPrice || 0).toLocaleString()} • {v.stock > 0 ? `In Stock (${v.stock})` : 'Out of Stock'}
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-gray-200'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ──► STICKY / STREAMLINED ACTION CONTROLS TIMELINE */}
            <div className="flex flex-row items-center gap-3 pt-4 border-t border-gray-50 w-full max-w-xl">
              
              {/* Add / Count Increment Toggles */}
              {isInCart ? (
                <div className="flex-1 h-12 border border-primary/20 rounded-xl flex items-center justify-between overflow-hidden bg-primary text-white text-[10px] font-black uppercase shadow-md shadow-primary/10 select-none">
                  <button 
                    onClick={() => cartItem.qty === 1 ? removeFromCart(cartItem.id) : updateQty(cartItem.id, -1, product._id)}
                    className="w-12 h-full flex items-center justify-center bg-black/10 hover:bg-black/25 text-xs font-bold cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="tracking-widest">Added ({cartItem.qty})</span>
                  <button 
                    onClick={() => updateQty(cartItem.id, 1, product._id)}
                    className="w-12 h-full flex items-center justify-center bg-black/10 hover:bg-black/25 text-xs font-bold cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddProductToBag}
                  disabled={currentVariant.stock <= 0}
                  className="flex-1 bg-white hover:bg-gray-50 border border-primary text-primary h-12 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <ShoppingBag size={14} /> Add to Bag
                </button>
              )}

              {/* Direct Buy Trigger Action */}
              <button
                onClick={handleDirectPurchase}
                disabled={currentVariant.stock <= 0}
                className="flex-1 bg-primary hover:bg-primary/95 text-white h-12 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Instant Buy
              </button>

              {/* Wishlist Controller Node Button */}
              <button 
                onClick={toggleWishlist}
                className={`w-12 h-12 border rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
                  isWishlisted ? 'bg-primary/5 border-primary text-primary' : 'border-gray-100 text-gray-400 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;