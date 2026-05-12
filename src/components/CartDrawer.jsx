import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowLeft, Heart, ShoppingBag, Trash2, Plus, Minus, Info, Loader2 } from 'lucide-react';
import { getUserCart, updateCartQuantity, removeFromCart, clearCart, decrementCartQuantity } from '../api/cartService';
import toast from 'react-hot-toast';

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await getUserCart();
      if (response.success) {
        setCartItems(response.data?.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const handleUpdateQuantity = async (productId, variantId, action) => {
    setUpdatingId(variantId);
    try {
      let response;
      if (action === 'increment') {
        response = await updateCartQuantity(productId, variantId);
      } else {
        response = await decrementCartQuantity(variantId);
      }

      if (response.success) {
        setCartItems(prev => prev.map(item => 
          item.variant?._id === variantId 
            ? { ...item, quantity: action === 'increment' ? item.quantity + 1 : item.quantity - 1 } 
            : item
        ).filter(item => item.quantity > 0)); // Filter out items with 0 quantity if needed
      } else {
        toast.error(response.message || "Failed to update quantity");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (variantId) => {
    setUpdatingId(variantId);
    try {
      const response = await removeFromCart(variantId);
      if (response.success) {
        toast.success("Item removed from bag");
        setCartItems(prev => prev.filter(item => item.variant?._id !== variantId));
      } else {
        toast.error(response.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to empty your bag?")) return;
    
    setLoading(true);
    try {
      const response = await clearCart();
      if (response.success) {
        toast.success("Bag cleared!");
        setCartItems([]);
      }
    } catch (error) {
      toast.error("Failed to clear bag");
    } finally {
      setLoading(false);
    }
  };

  const totalOriginal = cartItems.reduce((acc, item) => {
    const price = item.variant?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  const totalSales = cartItems.reduce((acc, item) => {
    const price = item.variant?.salesPrice || 0;
    return acc + (price * item.quantity);
  }, 0);

  const discount = totalOriginal - totalSales;

  const getImageUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    return '';
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[1001] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded-full transition-colors text-gray-800">
                <ArrowLeft size={22} />
              </button>
              <h2 className="text-xl font-bold text-gray-900 uppercase">Bag</h2>
              {cartItems.length > 0 && (
                <button 
                  onClick={handleClearCart}
                  className="ml-2 text-xs font-bold text-gray-300 hover:text-red-500 uppercase transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            <Link 
              to="/wishlist" 
              onClick={onClose}
              className="text-xs font-bold text-primary uppercase hover:underline"
            >
              View Wishlist
            </Link>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto bg-gray-50/30">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : cartItems.length > 0 ? (
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 relative group">
                    <div className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={getImageUrl(item.variant?.thumbnail)} 
                        alt={item.product?.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2 uppercase">
                          {item.product?.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.variant?.attributes && Object.entries(item.variant.attributes).map(([k, v]) => (
                            <p key={k} className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded">
                              {k}: {v}
                            </p>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">₹{item.variant?.salesPrice}</span>
                          <span className="text-xs font-bold text-gray-400 line-through">₹{item.variant?.price}</span>
                        </div>
                        
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                          <button 
                            onClick={() => handleUpdateQuantity(item.product?._id, item.variant?._id, 'decrement')}
                            disabled={updatingId === item.variant?._id || item.quantity <= 1}
                            className="px-2 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-30"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-800 border-x border-gray-200 h-full flex items-center">
                            {updatingId === item.variant?._id ? <Loader2 size={10} className="animate-spin" /> : item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.product?._id, item.variant?._id, 'increment')}
                            disabled={updatingId === item.variant?._id}
                            className="px-2 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-30"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleRemoveItem(item.variant?._id)}
                      disabled={updatingId === item.variant?._id}
                      className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                {/* Bill Details */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mt-6">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                    <Info size={16} className="text-primary" />
                    <h5 className="text-xs font-bold text-gray-800 uppercase">Bill Details</h5>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-gray-500">Bag Total</span>
                      <span className="text-gray-800">₹{totalOriginal}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-gray-500">Bag Discount</span>
                      <span className="text-green-600">- ₹{discount}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-gray-800">Free</span>
                    </div>
                    <div className="h-[1px] bg-gray-50 my-2"></div>
                    <div className="flex justify-between text-sm font-bold uppercase">
                      <span className="text-gray-900">Total Payable</span>
                      <span className="text-primary">₹{totalSales}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-48 h-48 mb-8 relative">
                  <img 
                    src="/empty_cart_illustration_1778583793297.png" 
                    alt="Empty Cart" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Shopping Bag is Empty</h3>
                <p className="text-sm font-bold text-gray-400 uppercase leading-relaxed max-w-[240px]">
                  This feels too light! Go on, add all your favourites
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] sticky bottom-0 z-20">
              <div className="flex items-center justify-between mb-4 px-2">
                 <div className="flex flex-col">
                   <span className="text-sm font-bold text-gray-900">₹{totalSales}</span>
                   <span className="text-xs font-bold text-primary uppercase">View Details</span>
                 </div>
                 <button className="bg-primary text-white px-10 py-3.5 rounded-xl font-bold uppercase text-xs shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2">
                   Proceed <ArrowLeft size={16} className="rotate-180" />
                 </button>
              </div>
            </div>
          )}
          
          {!cartItems.length && !loading && (
             <div className="p-6">
                <button 
                  onClick={onClose}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
                >
                  Start Shopping
                </button>
             </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
