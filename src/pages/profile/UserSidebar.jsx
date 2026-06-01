import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Ticket, 
  Wallet, 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  LogOut,
  Package,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

const sidebarLinks = [
  { icon: <User size={18} />,        label: 'My Profile',       path: '/profile' },
  { icon: <Package size={18} />,     label: 'My Orders',        path: '/orders' },
  { icon: <MapPin size={18} />,      label: 'My Addresses',     path: '/address' },
  { icon: <Ticket size={18} />,      label: 'My Coupons',       path: '/coupons' },
  { icon: <Wallet size={18} />,      label: 'My Wallet',        path: '/wallet' },
  { icon: <ShoppingBag size={18} />, label: 'My booking',       path: '/my-appointments' },
  { icon: <Heart size={18} />,       label: 'My Wishlist',      path: '/wishlist' },
  { icon: <CreditCard size={18} />,  label: 'My Saved Payment', path: '/payments' },
];

const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Find the active link details
  const activeLink = sidebarLinks.find(link => location.pathname === link.path);

  return (
    <div className="w-full lg:w-80 lg:sticky lg:top-28 self-start flex-shrink-0 z-30 font-outfit">
      
      {/* Mobile Toggle Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm cursor-pointer lg:hidden hover:border-primary/20 transition-all"
      >
        <div className="flex items-center gap-3 text-primary font-black text-xs uppercase">
          {activeLink?.icon || <Menu size={18} />}
          <span>{activeLink?.label || 'Account Menu'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase">
          <span>{isOpen ? 'Close' : 'Menu'}</span>
          {isOpen ? <X size={14} className="text-primary stroke-[3]" /> : <ChevronDown size={14} className="stroke-[3]" />}
        </div>
      </button>

      {/* Sidebar Links Menu (Expandable on Mobile, Always Block on Desktop) */}
      <div className={`mt-3 lg:mt-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
        isOpen ? 'block animate-in fade-in slide-in-from-top-4 duration-300' : 'hidden lg:block'
      }`}>
        <div className="flex flex-col">
          {sidebarLinks.map((link, idx) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setIsOpen(false)} // Close drawer on link click on mobile
                className={`flex items-center gap-4 px-6 py-4 transition-all border-b border-gray-50 last:border-0 group ${
                  isActive
                    ? 'bg-white text-primary border-r-4 border-r-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <span className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}>
                  {link.icon}
                </span>
                <span className="text-xs font-bold uppercase">{link.label}</span>
              </Link>
            );
          })}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 w-full text-left transition-all border-t border-gray-50 cursor-pointer"
          >
            <LogOut size={18} />
            <span className="text-xs font-bold uppercase">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;

