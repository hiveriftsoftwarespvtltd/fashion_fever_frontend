import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowLeft, Heart, ShoppingBag, Trash2, Plus, Minus, Info, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, isLoading, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const [updatingId, setUpdatingId] = useState(null);

  const totalOriginal = cart.reduce((acc, item) => {
    const price = item.originalPrice || item.price || 0;
    return acc + (price * item.qty);
  }, 0);

  const totalSales = cartTotal;
  const discount = totalOriginal - totalSales;

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
              <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded-full transition-colors text-gray-800 cursor-pointer">
                <ArrowLeft size={22} />
              </button>
              <h2 className="text-xl font-bold text-gray-900 uppercase">Bag</h2>
              {cart.length > 0 && (
                <button 
                  onClick={() => {
                    toast((t) => (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-bold text-gray-800">Empty your entire bag?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={async () => { toast.dismiss(t.id); await clearCart(); toast.success("Bag cleared!"); }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                          >Yes, Clear</button>
                          <button
                            onClick={() => toast.dismiss(t.id)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                          >Cancel</button>
                        </div>
                      </div>
                    ), { duration: 8000 });
                  }}
                  className="ml-2 text-xs font-bold text-gray-300 hover:text-red-500 uppercase transition-colors cursor-pointer"
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
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : cart.length > 0 ? (
              <div className="p-4 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 relative group">
                    <div className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2 uppercase">
                          {item.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.attributes && Object.entries(item.attributes).map(([k, v]) => (
                            <p key={k} className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded">
                              {k}: {v}
                            </p>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-xs font-bold text-gray-400 line-through">₹{item.originalPrice}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                          <button 
                            onClick={async () => {
                              setUpdatingId(item.id);
                              if (item.qty === 1) {
                                await removeFromCart(item.id);
                                toast.success("Item removed from bag");
                              } else {
                                await updateQty(item.id, -1, item.productId);
                              }
                              setUpdatingId(null);
                            }}
                            disabled={updatingId === item.id}
                            className="px-2 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-30 cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-800 border-x border-gray-200 h-full flex items-center">
                            {updatingId === item.id ? <Loader2 size={10} className="animate-spin" /> : item.qty}
                          </span>
                          <button 
                            onClick={async () => {
                              setUpdatingId(item.id);
                              await updateQty(item.id, 1, item.productId);
                              setUpdatingId(null);
                            }}
                            disabled={updatingId === item.id}
                            className="px-2 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-30 cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={async () => {
                        setUpdatingId(item.id);
                        await removeFromCart(item.id);
                        toast.success("Item removed from bag");
                        setUpdatingId(null);
                      }}
                      disabled={updatingId === item.id}
                      className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50 cursor-pointer"
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
                    {discount > 0 && (
                      <div className="flex justify-between text-xs font-bold uppercase">
                        <span className="text-gray-500">Bag Discount</span>
                        <span className="text-green-600">- ₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-gray-800">Free</span>
                    </div>
                    <div className="h-[1px] bg-gray-50 my-2"></div>
                    <div className="flex justify-between text-sm font-bold uppercase">
                      <span className="text-gray-900">Total Payable</span>
                      <span className="text-primary font-extrabold">₹{totalSales}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
                <div className="w-48 h-48 mb-8 relative flex items-center justify-center">
                  <ShoppingBag size={80} className="text-gray-200" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">Your Shopping Bag is Empty</h3>
                <p className="text-xs font-bold text-gray-400 uppercase leading-relaxed max-w-[240px]">
                  This feels too light! Go on, add all your favourites
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {cart.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] sticky bottom-0 z-20">
              <div className="flex items-center justify-between mb-4 px-2">
                 <div className="flex flex-col">
                   <span className="text-sm font-bold text-gray-900">₹{totalSales}</span>
                   <span className="text-xs font-bold text-primary uppercase">View Details</span>
                 </div>
                 <button className="bg-primary text-white px-10 py-3.5 rounded-xl font-bold uppercase text-xs shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2 cursor-pointer">
                   Proceed <ArrowLeft size={16} className="rotate-180" />
                 </button>
              </div>
            </div>
          )}
          
          {!cart.length && (
             <div className="p-6">
                <button 
                  onClick={onClose}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all cursor-pointer"
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
