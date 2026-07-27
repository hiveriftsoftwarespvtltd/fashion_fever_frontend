import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, ChevronDown, Wallet, User, LogOut, Settings, UserCircle, X, Heart, LayoutDashboard, Bookmark, Bell, Loader2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useWallet } from '../context/WalletContext';
import CartDrawer from './CartDrawer';
import logo from '../assets/logo.png.jpeg';
import { getMyNotifications, markNotificationRead } from '../api/notificationService';
import { toast } from '../utils/toast';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getMyNotifications(1, 10);
      if (res?.success) {
        // Extract notifications list depending on API response format
        const list = res.data?.data ?? res.data ?? [];
        setNotifications(list);

        // Count unread
        const unread = list.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await markNotificationRead(id);
      if (res?.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    try {
      await Promise.all(unreadNotifications.map(n => markNotificationRead(n._id)));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            fetchNotifications();
          }
        }}
        className="text-[#3f414d] hover:text-primary transition-colors p-1 relative flex items-center justify-center cursor-pointer"
        title="Notifications"
      >
        <Bell size={22} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 bg-white shadow-2xl rounded-2xl border border-gray-100 w-80 max-h-[400px] overflow-hidden flex flex-col z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
            <span className="text-xs font-black uppercase tracking-wider text-gray-800">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[9px] font-black uppercase tracking-wider text-primary hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List content */}
          <div className="flex-grow overflow-y-auto divide-y divide-gray-55 scrollbar-thin">
            {loading && notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-primary" size={20} />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <Bell className="mx-auto mb-2 text-gray-300 stroke-[1.5]" size={28} />
                <p className="text-[10px] font-bold uppercase tracking-wider">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id)}
                  className={`p-4 text-left transition-colors cursor-pointer flex gap-3 ${n.isRead ? 'hover:bg-gray-50/60' : 'bg-primary/5 hover:bg-primary/10'
                    }`}
                >
                  <div className="flex-grow space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[11px] font-extrabold text-gray-800 uppercase truncate">
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 font-semibold leading-relaxed break-words">
                      {n.body}
                    </p>
                    <span className="text-[8px] text-gray-450 font-bold uppercase block mt-1">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const getDashboardLink = (user) => {
  if (!user) return null;
  const roles = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : []);
  const activeRole = roles.find(r => r && String(r).toLowerCase() !== 'user') || user.role || 'user';
  const role = String(activeRole).toLowerCase();

  if (role === 'admin' || role === 'super_admin') {
    return { path: '/admin?tab=dashboard', label: 'Admin Panel' };
  }
  if (role === 'vendor') {
    return { path: user.vendorId || user.vendor ? '/vendor/dashboard' : '/vendor/register', label: 'Vendor Dashboard' };
  }
  if (role === 'service_provider') {
    return { path: '/service-provider/panel', label: 'Service Provider Panel' };
  }
  if (role === 'educator' || role === 'tutor') {
    return { path: '/educator/onboard', label: 'Educator Portal' };
  }
  if (role === 'influencer') {
    return { path: user.influencerId || user.influencer ? '/influencer/dashboard' : '/influencer/register', label: 'Influencer Portal' };
  }
  if (role === 'delivery_person' || role === 'rider' || role === 'driver') {
    return { path: '/quick-commerce/rider', label: 'Rider Portal' };
  }
  if (role === 'distributor') {
    return { path: '/distributor/dashboard', label: 'Distributor Portal' };
  }
  return null;
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const { searchQuery, setSearchQuery } = useSearch();
  const { cart } = useCart();

  const isQuickCommPage = location.pathname.startsWith('/quick-commerce');
  const activeCartCount = isQuickCommPage
    ? cart.filter(item => item.isQuickDelivery).reduce((acc, item) => acc + item.qty, 0)
    : cart.filter(item => !item.isQuickDelivery).reduce((acc, item) => acc + item.qty, 0);

  const { wishlistCount } = useWishlist();
  const { balanceData } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Bookings', path: '/booking' },
    { name: 'Academy', path: '/academy' },
    { name: 'Luxe', path: '/luxe' },
    { name: 'Beauty Advice', path: '/advice' },
    { name: 'Quick Delivery ⚡', path: '/quick-commerce' },
  ];



  return (
    <div className="sticky top-0 z-[100] bg-white w-full border-b border-gray-100">
      {/* Main Navbar Row */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-[60px] lg:h-[80px] gap-4 lg:gap-8">

            {/* Logo & Links Group */}
            <div className="flex items-center gap-4 lg:gap-10">
              <Link to="/" className="flex-shrink-0">
                <img src={logo} alt="Fashion Fever" className="h-[60px] lg:h-[80px] w-auto object-contain" />
              </Link>

              {/* Nav Links (Desktop) */}
              <div className="hidden xl:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-[13px] font-bold text-[#3f414d] hover:text-primary transition-all uppercase"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search & Actions Group */}
            <div className="flex items-center gap-2 lg:gap-6 flex-grow justify-end max-w-4xl">
              {/* Search Bar */}
              <div className="hidden md:block relative flex-grow max-w-[300px]">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands..."
                  className="w-full bg-[#f4f4f4] border border-[#e0e0e0] rounded-xl h-[44px] pl-4 pr-11 text-[13px] outline-none placeholder:text-gray-400 placeholder:font-normal placeholder:text-[11px] font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 lg:gap-5">
                <Link to="/wishlist" className="text-[#3f414d] hover:text-primary transition-colors p-1 relative group">
                  <Heart size={22} strokeWidth={2} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm transition-all duration-300 scale-100">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="text-[#3f414d] hover:text-primary transition-colors p-1 relative"
                >
                  <ShoppingBag size={22} strokeWidth={2} />
                  {activeCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm transition-all duration-300 scale-100">
                      {activeCartCount}
                    </span>
                  )}
                </button>

                <div className="w-[1px] h-6 bg-gray-100 hidden sm:block"></div>

                <div className="hidden sm:flex items-center gap-3">
                  {user ? (
                    <div className="flex items-center gap-3">
                      {/* Wallet Balance Badge */}
                      {user.role === 'user' && (
                        <Link
                          to="/wallet"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 rounded-xl text-[11px] font-bold text-gray-700 hover:text-primary transition-all duration-300 shadow-sm"
                          title="Wallet Balance"
                        >
                          <Wallet size={14} className="text-primary" />
                          <span>₹{balanceData.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </Link>
                      )}

                      {/* Notification Bell Dropdown */}
                      <NotificationBell />

                      <div className="relative group">
                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border-2 border-transparent hover:border-primary/30 overflow-hidden transition-all duration-300">
                          {user.avatar ? (
                            <img
                              src={typeof user.avatar === 'string' ? user.avatar : (user.avatar.url || '')}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCircle size={24} strokeWidth={1.5} />
                          )}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="absolute top-full right-0 mt-3 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-[500] before:content-[''] before:absolute before:-top-2 before:right-4 before:w-4 before:h-4 before:bg-white before:rotate-45 before:border-l before:border-t before:border-gray-100 after:absolute after:-top-3 after:left-0 after:right-0 after:h-3 after:content-['']">
                          <div className="flex flex-col gap-1 text-left relative z-10 bg-white rounded-xl overflow-hidden">
                            {/* User Info Header */}
                            <div className="px-4 py-4 bg-gray-50/50 border-b border-gray-100">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm uppercase shadow-lg shadow-primary/20 overflow-hidden">
                                  {user.avatar ? (
                                    <img
                                      src={typeof user.avatar === 'string' ? user.avatar : (user.avatar.url || '')}
                                      alt={user.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    user.name?.charAt(0) || 'U'
                                  )}
                                </div>
                                <div className="flex flex-col leading-none">
                                  <p className="text-[13px] font-bold text-gray-800 uppercase truncate max-w-[140px]">
                                    {user.name}
                                  </p>
                                  {user.role === 'user' && (
                                    <div className="flex items-center gap-1 mt-1 text-sm font-bold text-gray-500">
                                      <Wallet size={10} className="text-primary" />
                                      <span>₹{balanceData.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                  )}
                                  <p className="text-sm font-bold text-primary uppercase mt-0.5">
                                    {(() => {
                                      const roles = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : []);
                                      const activeRole = roles.find(r => r && String(r).toLowerCase() !== 'user') || user.role || 'user';
                                      return String(activeRole).toUpperCase();
                                    })()}
                                  </p>
                                </div>
                              </div>
                              <p className="text-[11px] font-medium text-gray-500 truncate">{user.email}</p>
                            </div>

                            <div className="p-1.5 flex flex-col gap-0.5">
                              {(() => {
                                const dashInfo = getDashboardLink(user);
                                return dashInfo ? (
                                  <Link to={dashInfo.path} className="flex items-center gap-3 px-3.5 py-2.5 bg-primary/5 hover:bg-primary/10 rounded-xl text-[12px] font-bold text-primary transition-all">
                                    <LayoutDashboard size={16} /> {dashInfo.label}
                                  </Link>
                                ) : null;
                              })()}
                              <Link to="/profile" className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-gray-50 rounded-xl text-[12px] font-bold text-gray-600 hover:text-primary transition-all">
                                <User size={16} /> My Profile
                              </Link>
                              <Link to="/settings" className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-gray-50 rounded-xl text-[12px] font-bold text-gray-600 hover:text-primary transition-all">
                                <Settings size={16} /> Settings
                              </Link>
                              <div className="h-[1px] bg-gray-50 my-1 mx-2"></div>
                              <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-red-50 rounded-xl text-[12px] font-bold text-red-600 transition-all text-left w-full"
                              >
                                <LogOut size={16} /> Logout
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      className="bg-primary text-white h-[40px] px-8 rounded-xl font-bold text-[12px] uppercase hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Toggle */}
            <button
              className="xl:hidden text-[#3f414d] p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[1000] xl:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <img src={logo} alt="WakeUp MakeUp" className="h-[36px] w-auto object-contain" />
              </Link>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-primary transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto py-6">
              <div className="px-6 space-y-6 text-left">
                {/* Mobile Search Bar */}
                <div className="relative w-full">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={16} strokeWidth={1.5} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands..."
                    className="w-full bg-[#f4f4f4] border border-[#e0e0e0] rounded-xl h-[40px] pl-4 pr-11 text-[12px] outline-none placeholder:text-gray-400 font-medium"
                  />
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-[16px] font-bold text-[#3f414d] hover:text-primary uppercase"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Dynamic Logged-in User Account Menu (Excludes other portals) */}
                {user && (
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest">My Account</span>
                    <div className="space-y-3.5">
                      {(() => {
                        const dashInfo = getDashboardLink(user);
                        return dashInfo ? (
                          <Link
                            to={dashInfo.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2.5 text-[14px] font-bold text-primary hover:text-primary-hover uppercase tracking-wide mb-1"
                          >
                            <LayoutDashboard size={14} className="text-primary" /> {dashInfo.label}
                          </Link>
                        ) : null;
                      })()}

                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 text-[14px] font-bold text-gray-600 hover:text-primary uppercase tracking-wide"
                      >
                        <User size={14} /> My Profile
                      </Link>
                      <Link
                        to="/my-learning"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 text-[14px] font-bold text-gray-600 hover:text-primary uppercase tracking-wide"
                      >
                        <Bookmark size={14} /> My Learning
                      </Link>
                      <Link
                        to="/my-appointments"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 text-[14px] font-bold text-gray-600 hover:text-primary uppercase tracking-wide"
                      >
                        <Settings size={14} /> My Appointments
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 text-[14px] font-bold text-gray-600 hover:text-primary uppercase tracking-wide"
                      >
                        <Heart size={14} /> My Wishlist
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex flex-col gap-3">
              {user ? (
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold uppercase flex-shrink-0">
                        {user.name?.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-bold text-gray-800 uppercase truncate" title={user.name}>{user.name}</p>
                        <p className="text-sm font-bold text-gray-400 truncate" title={user.email}>{user.email}</p>
                      </div>
                    </div>
                    {/* Wallet balance mobile drawer */}
                    {user.role === 'user' && (
                      <Link
                        to="/wallet"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-150 rounded-lg text-sm font-bold text-gray-700 hover:text-primary transition-all duration-300 flex-shrink-0"
                      >
                        <Wallet size={12} className="text-primary" />
                        <span>₹{balanceData.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full border border-red-100 text-red-600 h-[48px] rounded-xl font-bold uppercase text-[12px] flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-primary text-white h-[48px] rounded-xl font-bold uppercase text-[12px] flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Navbar;
