import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopStrip from './components/TopStrip';
import AnnouncementBar from './components/AnnouncementBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import VendorDashboard from './pages/VendorDashboard';
import InfluencerDashboard from './pages/InfluencerDashboard';
import Booking from './pages/Booking';
import AdminPanel from './pages/AdminPanel';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wallet from './pages/Wallet';
import CourseCatalog from './pages/CourseCatalog';
import DistributorDashboard from './pages/DistributorDashboard';
import CoursePlayer from './pages/CoursePlayer';
import MyAppointments from './pages/MyAppointments';
import Wishlist from './pages/Wishlist';
import MyLearning from './pages/MyLearning';
import VendorRegistration from './pages/VendorRegistration';
import Profile from './pages/Profile';
import Address from './pages/Address';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { SearchProvider } from './context/SearchContext';
import { RoleGuard } from './components/AuthGuards';
import { MessageCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/vendor') ||
    location.pathname.startsWith('/influencer') ||
    location.pathname.startsWith('/distributor');

  return (
    <UserProvider>
      <SearchProvider>
        <CartProvider>
          <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Toaster position="bottom-center" reverseOrder={false} />
          <ScrollToTop />

          {!isDashboard && <TopStrip />}
          {!isDashboard && <Navbar />}

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />

              {/* Protected Dashboards */}
              <Route path="/admin/*" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminPanel />
                </RoleGuard>
              } />

              <Route path="/vendor/dashboard" element={
                <RoleGuard allowedRoles={['vendor', 'admin']}>
                  <VendorDashboard />
                </RoleGuard>
              } />

              <Route path="/vendor/register" element={
                <RoleGuard allowedRoles={['vendor', 'admin']}>
                  <VendorRegistration />
                </RoleGuard>
              } />

              <Route path="/influencer/dashboard" element={
                <RoleGuard allowedRoles={['influencer', 'admin']}>
                  <InfluencerDashboard />
                </RoleGuard>
              } />

              <Route path="/distributor/dashboard" element={
                <RoleGuard allowedRoles={['distributor', 'admin']}>
                  <DistributorDashboard />
                </RoleGuard>
              } />

              {/* Customer Routes */}
              <Route path="/booking" element={<Booking />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/academy" element={<CourseCatalog />} />
              <Route path="/academy/course/:id" element={<CoursePlayer />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/address" element={<Address />} />

              <Route path="/services" element={<Booking />} />
              <Route path="/about" element={<Home />} />
              <Route path="/contact" element={<Home />} />
            </Routes>
          </main>
          {/* 
          {!isDashboard && (
            <button className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-[0_10px_40px_rgba(252,155,201,0.4)] flex items-center justify-center hover:scale-110 transition-all z-[500] group">
              <MessageCircle size={28} />
              <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl shadow-xl text-xs font-bold uppercase text-gray-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none border border-gray-50">
                Chat with Beauty AI
              </div>
            </button>
          )} */}

          {!isDashboard && <Footer />}
        </div>
      </ThemeProvider>
    </CartProvider>
      </SearchProvider>
    </UserProvider>
  );
};

export default App;
