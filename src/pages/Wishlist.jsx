import React, { useState, useEffect } from 'react';
import { 
  User, 
  Ticket, 
  Wallet, 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  LogOut, 
  X, 
  Star,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist, clearWishlist } from '../api/wishlistService';
import { addToCart } from '../api/cartService';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [clearing, setClearing] = useState(false);

  const fetchWishlist = async () => {
    try {
      const response = await getWishlist();
      if (response.success) {
        setItems(response.data.items || []);
      }
    } catch (error) {
      console.error("Fetch wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (variantId) => {
    setActionId(variantId);
    try {
      const response = await removeFromWishlist(variantId);
      if (response.success) {
        toast.success("Removed from wishlist");
        setItems(prev => prev.filter(item => item.variant._id !== variantId));
      }
    } catch (error) {
      toast.error("Failed to remove");
    } finally {
      setActionId(null);
    }
  };

  const handleMoveToBag = async (productId, variantId) => {
    setActionId(variantId);
    try {
      const cartResponse = await addToCart(productId, variantId);
      if (cartResponse.success) {
        const removeResponse = await removeFromWishlist(variantId);
        if (removeResponse.success) {
          toast.success("Moved to Bag!");
          setItems(prev => prev.filter(item => item.variant._id !== variantId));
        }
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setActionId(null);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear your entire wishlist?")) return;
    
    setClearing(true);
    try {
      const response = await clearWishlist();
      if (response.success) {
        toast.success("Wishlist cleared!");
        setItems([]);
      }
    } catch (error) {
      toast.error("Failed to clear wishlist");
    } finally {
      setClearing(false);
    }
  };

  const sidebarLinks = [
    { icon: <User size={18} />, label: 'My Profile', path: '/profile' },
    { icon: <Ticket size={18} />, label: 'My Coupons', path: '/coupons' },
    { icon: <Wallet size={18} />, label: 'My Wallet', path: '/wallet' },
    { icon: <ShoppingBag size={18} />, label: 'My Orders', path: '/my-appointments' },
    { icon: <Heart size={18} />, label: 'My Wishlist', path: '/wishlist', active: true },
    { icon: <CreditCard size={18} />, label: 'My Saved Payment', path: '/payments' },
    { icon: <LogOut size={18} />, label: 'Log Out', path: '/logout', danger: true },
  ];

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-10 font-outfit">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 italic">My Wishlist</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col">
                {sidebarLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className={`flex items-center justify-between px-6 py-4 transition-all border-b border-gray-50 last:border-0 group ${
                      link.active 
                      ? 'bg-white text-primary border-r-4 border-r-primary' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`${link.active ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>
                        {link.icon}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-tight">{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden">
              {/* Header */}
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  My Wishlist <span className="text-primary font-bold">({items.length})</span>
                </h1>
                {items.length > 0 && (
                  <button 
                    onClick={handleClear}
                    disabled={clearing}
                    className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {clearing ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                    Clear Wishlist
                  </button>
                )}
              </div>

              {/* Grid */}
              <div className="p-8">
                {loading ? (
                  <div className="flex items-center justify-center py-40">
                    <Loader2 className="animate-spin text-primary" size={40} />
                  </div>
                ) : items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {items.map((item) => (
                      <div key={item.product._id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col relative bg-white">
                        {/* Delete icon */}
                        <button 
                          onClick={() => handleRemove(item.variant._id)}
                          disabled={actionId === item.variant._id}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-md z-10 transition-colors disabled:opacity-50"
                        >
                          {actionId === item.variant._id ? <Loader2 size={14} className="animate-spin" /> : <X size={16} />}
                        </button>

                        {/* Image */}
                        <div className="aspect-[3/2] bg-gray-50 overflow-hidden relative">
                          <img 
                            src={item.variant?.thumbnail?.url || item.product?.variants?.[0]?.thumbnail?.url} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>

                        {/* Details */}
                        <div className="p-3 flex-grow flex flex-col">
                          <h3 className="text-xs font-bold text-gray-800 leading-tight mb-1.5 line-clamp-1 uppercase">
                            {item.product.name}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-1.5">
                             {item.variant?.salesPrice < item.variant?.price && (
                               <span className="text-[10px] font-bold text-gray-400 line-through">₹{item.variant.price}</span>
                             )}
                             <span className="text-xs font-bold text-gray-900">₹{item.variant?.salesPrice || item.variant?.price}</span>
                             {item.variant?.salesPrice < item.variant?.price && (
                               <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase">
                                 {Math.round(((item.variant.price - item.variant.salesPrice) / item.variant.price) * 100)}% Off
                               </span>
                             )}
                          </div>

                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < 4 ? "fill-gray-900 text-gray-900" : "text-gray-300"} />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 ml-1">(120)</span>
                          </div>

                          <button 
                            onClick={() => handleMoveToBag(item.product._id, item.variant._id)}
                            disabled={actionId === item.variant._id}
                            className="w-full py-2.5 border border-primary/10 rounded-lg text-xs font-bold text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all mt-auto flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {actionId === item.variant._id ? <Loader2 size={12} className="animate-spin" /> : "Move to Bag"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <Heart size={32} className="text-gray-200" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Your wishlist is empty</h2>
                    <Link to="/" className="mt-8 bg-primary text-white px-10 py-4 rounded-xl font-bold uppercase text-xs shadow-xl shadow-primary/20">
                      Go Shopping
                    </Link>
                  </div>
                )}

                {/* Footer text */}
                <div className="mt-20 border-t border-gray-50 pt-10 text-center">
                   <p className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">No More Products to Show</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
