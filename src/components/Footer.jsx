import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Sparkles, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png.jpeg';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer className={`pt-20 pb-10 border-t transition-colors duration-300 font-outfit ${
      isDarkMode 
        ? 'border-green-900/40 text-green-300/70' 
        : 'border-green-900/40 text-green-200/70'
    }`} style={{ backgroundColor: 'hsl(150, 38%, 11%)' }}>
      <div className="container mx-auto px-4 max-w-[1600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 text-left">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="WakeUp MakeUp" className="h-[80px] w-auto object-contain" />
            </Link>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-green-300/60' : 'text-green-200/60'}`}>
              India's premier destination for luxury beauty bookings and curated cosmetics. Connecting you with elite salon professionals and high-performance products for an unmatched glow.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-green-900/40 text-green-300/60 hover:text-primary hover:bg-green-800/50' : 'bg-green-900/40 text-green-300/60 hover:text-primary hover:bg-green-800/50'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-green-900/40 text-green-300/60 hover:text-primary hover:bg-green-800/50' : 'bg-green-900/40 text-green-300/60 hover:text-primary hover:bg-green-800/50'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-green-900/40 text-green-300/60 hover:text-primary hover:bg-green-800/50' : 'bg-green-900/40 text-green-300/60 hover:text-primary hover:bg-green-800/50'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="text-left">
            <h4 className="text-base font-bold uppercase tracking-wider mb-8 text-white">
              Discover
            </h4>
            <ul className="flex flex-col gap-4 text-xs font-semibold uppercase tracking-wider">
              <li><Link to="/shop" className="hover:text-primary transition-colors">Shop Cosmetics</Link></li>
              <li><Link to="/booking" className="hover:text-primary transition-colors">Book Salon & Spa</Link></li>
              <li><Link to="/auth?tab=register" className="hover:text-primary transition-colors">Partner With Us</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Creator Program</Link></li>
            </ul>
          </div>

          {/* Services & Categories */}
          <div className="text-left">
            <h4 className="text-base font-bold uppercase tracking-wider mb-8 text-white">
              Popular Services
            </h4>
            <ul className="flex flex-col gap-4 text-xs font-bold uppercase tracking-wider text-primary">
              <li className="flex items-center gap-2">
                <Sparkles size={12} /> Bridal Makeovers
              </li>
              <li className="flex items-center gap-2">
                <Sparkles size={12} /> Hair Styling & Color
              </li>
              <li className="flex items-center gap-2">
                <Sparkles size={12} /> Advanced Skin Facials
              </li>
              <li className="flex items-center gap-2">
                <Sparkles size={12} /> Salon at Home
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-left">
            <h4 className="text-base font-bold uppercase tracking-wider mb-8 text-white">
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-6 text-sm">
              <li className="flex items-start gap-4">
                <div className="text-primary mt-1 flex-shrink-0"><MapPin size={18} /></div>
                <span className="text-green-200/80">WakeUp MakeUp Plaza, Bandra West, Mumbai, MH 400050</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="text-primary flex-shrink-0"><Phone size={18} /></div>
                <span className="text-green-200/80">+91 99999 88888</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="text-primary flex-shrink-0"><Mail size={18} /></div>
                <span className="text-green-200/80">support@wakeupmakeup.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 border-t border-green-900/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider text-green-400/50">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} WAKEUP MAKEUP. Crafted with <Heart size={10} className="text-primary fill-primary animate-pulse" /> in India.
          </p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
