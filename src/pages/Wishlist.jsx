import React from 'react';
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
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const wishlistItems = [
    { 
      id: 1, 
      name: "La Roche-Posay Anthelios UV MUNE 400 Anti Dark", 
      price: 1499, 
      salesPrice: 1424, 
      discount: "5%",
      rating: 4.8,
      reviews: 703,
      image: "https://res.cloudinary.com/dn2rvjcpu/raw/upload/v1778569233/product/ixrnc6vglqfi4wo2cisg", 
      category: "Skincare" 
    }
  ];

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
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase mb-8">
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
              <div className="p-8 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">
                  My Wishlist <span className="text-primary font-bold">({wishlistItems.length})</span>
                </h1>
              </div>

              {/* Grid */}
              <div className="p-8">
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col relative">
                        {/* Delete icon */}
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-md z-10 transition-colors">
                          <X size={16} />
                        </button>

                        {/* Image */}
                        <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>

                        {/* Details */}
                        <div className="p-4 flex-grow flex flex-col">
                          <h3 className="text-xs font-bold text-gray-800 leading-tight mb-2 line-clamp-2 uppercase h-8">
                            {item.name}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-xs font-bold text-gray-400 line-through">₹{item.price}</span>
                             <span className="text-sm font-bold text-gray-900">₹{item.salesPrice}</span>
                             <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase">{item.discount} Off</span>
                          </div>

                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className={i < 4 ? "fill-gray-900 text-gray-900" : "text-gray-300"} />
                            ))}
                            <span className="text-[10px] font-bold text-gray-400 ml-1">({item.reviews})</span>
                          </div>

                          <button className="w-full py-3 border-t border-gray-100 text-[11px] font-bold text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all mt-auto rounded-b-xl border-x-0 border-b-0">
                            Move to Bag
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
                    <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Your wishlist is empty</h2>
                    <Link to="/shop" className="mt-8 bg-primary text-white px-10 py-4 rounded-xl font-bold uppercase text-xs shadow-xl shadow-primary/20">
                      Go Shopping
                    </Link>
                  </div>
                )}

                {/* Footer text */}
                <div className="mt-20 border-t border-gray-50 pt-10 text-center">
                   <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">No More Products to Show</p>
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
