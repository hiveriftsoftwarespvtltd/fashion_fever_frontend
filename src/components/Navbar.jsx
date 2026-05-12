import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, ChevronDown, Wallet, User, LogOut, Settings, UserCircle, X, Heart } from 'lucide-react';
import { getUserDetails } from '../api/authService';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Fetch user details if logged in
  useEffect(() => {
    const fetchUser = async () => {
      const session = localStorage.getItem('user_session');
      if (session) {
        try {
          const response = await getUserDetails();
          if (response.success) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
      setLoading(false);
    };

    fetchUser();

    // Listen for storage changes (for login/logout in other tabs)
    window.addEventListener('storage', fetchUser);
    return () => window.removeEventListener('storage', fetchUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    window.location.href = '/';
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
  ];

  const dashboardLinks = [
    { name: 'Admin Panel', path: '/admin' },
    { name: 'Vendor Portal', path: '/vendor/dashboard' },
    { name: 'Influencer Portal', path: '/influencer/dashboard' },
    { name: 'Distributor Portal', path: '/distributor/dashboard' },
    { name: 'My Learning', path: '/my-learning' },
    { name: 'My Appointments', path: '/my-appointments' },
    { name: 'My Wishlist', path: '/wishlist' },
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
                <span className="text-[24px] lg:text-[32px] font-bold text-primary uppercase">
                  WAKEUP
                </span>
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

                {/* Portals Dropdown */}
                <div className="relative group">
                  <button className="text-[13px] font-bold text-[#3f414d] hover:text-primary transition-all uppercase flex items-center gap-1">
                    Portals <ChevronDown size={14} />
                  </button>
                  <div className="absolute top-full left-0 bg-white shadow-2xl rounded-2xl border border-gray-50 p-4 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-[200]">
                    <div className="flex flex-col gap-1">
                      {dashboardLinks.map((link) => (
                        <Link key={link.name} to={link.path} className="px-4 py-3 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 hover:text-primary transition-all">
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
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
                  placeholder="Search products, brands..."
                  className="w-full bg-[#f4f4f4] border border-[#e0e0e0] rounded-xl h-[44px] pl-4 pr-11 text-[13px] outline-none placeholder:text-gray-400 font-bold"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 lg:gap-5">
                <Link to="/wallet" className="text-[#3f414d] hover:text-primary transition-colors p-1 relative group">
                  <Wallet size={22} strokeWidth={2} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
                </Link>

                <Link to="/wishlist" className="text-[#3f414d] hover:text-primary transition-colors p-1 relative group">
                  <Heart size={22} strokeWidth={2} />
                </Link>

                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="text-[#3f414d] hover:text-primary transition-colors p-1 relative"
                >
                  <ShoppingBag size={22} strokeWidth={2} />
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">2</span>
                </button>

                <div className="w-[1px] h-6 bg-gray-100 hidden sm:block"></div>

                <div className="hidden sm:flex items-center gap-3">
                  {!loading && user ? (
                    <div className="relative group">
                      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border-2 border-transparent hover:border-primary/30 transition-all duration-300">
                        <UserCircle size={24} strokeWidth={1.5} />
                      </button>

                      {/* Profile Dropdown */}
                      <div className="absolute top-full right-0 mt-3 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-[500] before:content-[''] before:absolute before:-top-2 before:right-4 before:w-4 before:h-4 before:bg-white before:rotate-45 before:border-l before:border-t before:border-gray-100">
                        <div className="flex flex-col gap-1 text-left relative z-10 bg-white rounded-xl overflow-hidden">
                          {/* User Info Header */}
                          <div className="px-4 py-4 bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm uppercase shadow-lg shadow-primary/20">
                                {user.name?.charAt(0) || 'U'}
                              </div>
                              <div className="flex flex-col leading-none">
                                <p className="text-[13px] font-bold text-gray-900 uppercase truncate max-w-[140px]">
                                  {user.name}
                                </p>
                                <p className="text-[10px] font-bold text-primary uppercase mt-0.5">
                                  {user.role}
                                </p>
                              </div>
                            </div>
                            <p className="text-[11px] font-medium text-gray-500 truncate">{user.email}</p>
                          </div>

                          <div className="p-1.5 flex flex-col gap-0.5">
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
              <span className="text-[24px] font-bold text-primary uppercase">WAKEUP</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-400">
                <Menu size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto py-6">
              <div className="px-6 space-y-6 text-left">
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

                <div className="pt-4 space-y-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Portals</span>
                  {dashboardLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-[14px] font-bold text-gray-600 hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex flex-col gap-3">
              {user ? (
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold uppercase">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 uppercase">{user.name}</p>
                      <p className="text-[10px] font-bold text-gray-400">{user.email}</p>
                    </div>
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
