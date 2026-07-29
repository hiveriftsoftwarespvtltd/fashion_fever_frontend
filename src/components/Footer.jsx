import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import feverlogo from '../assets/feverlogo.png';

const Footer = () => {
  return (
    <footer className="bg-pink-50/60 border-t border-pink-100 text-gray-700 font-outfit pt-16 pb-10 text-left">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: 4 Columns (Download App section removed as requested) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-pink-100/80">
          
          {/* Col 1: Brand Info & Logo */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-block">
              <img 
                src={feverlogo}
                alt="Fashion Fever " 
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm font-medium">
              India's premier destination for luxury beauty bookings and curated cosmetics. Connecting you with elite salon professionals and high-performance products for an unmatched glow.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3.5 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-pink-200 flex items-center justify-center text-gray-700 hover:text-[#ff4d6d] hover:border-[#ff4d6d] transition-all shadow-sm hover:scale-105"
                title="Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-pink-200 flex items-center justify-center text-gray-700 hover:text-[#ff4d6d] hover:border-[#ff4d6d] transition-all shadow-sm hover:scale-105"
                title="Facebook"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-pink-200 flex items-center justify-center text-gray-700 hover:text-[#ff4d6d] hover:border-[#ff4d6d] transition-all shadow-sm hover:scale-105"
                title="YouTube"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>

              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-pink-200 flex items-center justify-center text-gray-700 hover:text-[#ff4d6d] hover:border-[#ff4d6d] transition-all shadow-sm hover:scale-105"
                title="Pinterest"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.2-2.42.04-3.46.22-.94 1.4-5.95 1.4-5.95s-.36-.72-.36-1.78c0-1.67.97-2.92 2.17-2.92 1.02 0 1.51.77 1.51 1.69 0 1.03-.66 2.56-1 3.98-.28 1.19.6 2.16 1.78 2.16 2.13 0 3.77-2.25 3.77-5.49 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.2 0 1.03.4 2.14.9 2.74.1.12.11.23.08.35l-.34 1.39c-.05.23-.18.28-.41.17-1.53-.71-2.49-2.94-2.49-4.74 0-3.86 2.81-7.41 8.09-7.41 4.25 0 7.55 3.03 7.55 7.07 0 4.22-2.66 7.62-6.35 7.62-1.24 0-2.41-.64-2.81-1.4l-.76 2.91c-.28 1.07-1.03 2.41-1.54 3.23C9.72 23.82 10.84 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                </svg>
              </a>

              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-pink-200 flex items-center justify-center text-gray-700 hover:text-[#ff4d6d] hover:border-[#ff4d6d] transition-all shadow-sm hover:scale-105"
                title="Twitter"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: DISCOVER */}
          <div>
            <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-gray-900 mb-6">
              DISCOVER
            </h4>
            <ul className="space-y-3.5 text-sm sm:text-base font-semibold text-gray-700">
              <li>
                <Link to="/shop" className="hover:text-[#ff4d6d] transition-colors">
                  Shop Cosmetics
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-[#ff4d6d] transition-colors">
                  Book Salon & Spa
                </Link>
              </li>
              <li>
                <Link to="/vendor/register" className="hover:text-[#ff4d6d] transition-colors">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link to="/influencer/dashboard" className="hover:text-[#ff4d6d] transition-colors">
                  Creator Program
                </Link>
              </li>
              <li>
                <Link to="/quick-commerce" className="hover:text-[#ff4d6d] transition-colors font-extrabold text-[#ff4d6d]">
                  Quick 10-Min Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: POPULAR SERVICES */}
          <div>
            <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-gray-900 mb-6">
              POPULAR SERVICES
            </h4>
            <ul className="space-y-3.5 text-sm sm:text-base font-semibold text-gray-700">
              <li>
                <Link to="/booking" className="hover:text-[#ff4d6d] transition-colors">
                  Bridal Makeovers
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-[#ff4d6d] transition-colors">
                  Hair Styling & Color
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-[#ff4d6d] transition-colors">
                  Advanced Skin Facials
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-[#ff4d6d] transition-colors">
                  Salon at Home
                </Link>
              </li>
              <li>
                <Link to="/academy" className="hover:text-[#ff4d6d] transition-colors">
                  Pro Academy Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: GET IN TOUCH */}
          <div>
            <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-gray-900 mb-6">
              GET IN TOUCH
            </h4>
            <ul className="space-y-4 text-sm sm:text-base text-gray-700 font-semibold">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#ff4d6d] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Fashion Fever Plaza, Saket, New Delhi, 110017
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#ff4d6d] shrink-0" />
                <a href="tel:+919999988888" className="hover:text-[#ff4d6d] transition-colors font-bold">
                  +91 99999 88888
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[#ff4d6d] shrink-0" />
                <a href="mailto:support@fashionfever.in" className="hover:text-[#ff4d6d] transition-colors font-bold">
                  support@fashionfever.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & policies row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 font-semibold">
          <p>
            © {new Date().getFullYear()} FASHION FEVER . Crafted within India.
          </p>
          <div className="flex items-center gap-6 text-gray-700">
            <Link to="/privacy-policy" className="hover:text-[#ff4d6d] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/terms" className="hover:text-[#ff4d6d] transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
