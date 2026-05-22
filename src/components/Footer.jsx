import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import logo from '../assets/logo.png.jpeg';

const Footer = () => {
 return (
 <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
  <div className="container mx-auto px-4 max-w-[1600px]">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
   {/* Brand Column */}
   <div className="flex flex-col gap-6">
   <Link to="/" className="flex items-center">
    <img src={logo} alt="WakeUp MakeUp" className="h-[80px] w-auto object-contain" />
   </Link>
   <p className="text-text-muted">
    Designing the future of web experiences with a focus on speed, aesthetics, and user conversion.
   </p>

   </div>

   {/* Quick Links */}
   <div>
   <h4 className="text-xl font-bold mb-8">Quick Links</h4>
   <ul className="flex flex-col gap-4 text-text-muted">
    <li><Link to="/" className="hover:text-primary">Home</Link></li>
    <li><Link to="/services" className="hover:text-primary">Services</Link></li>
    <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
    <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
   </ul>
   </div>

   {/* Services */}
   <div>
   <h4 className="text-xl font-bold mb-8">Services</h4>
   <ul className="flex flex-col gap-4 text-text-muted">
    <li>Web Development</li>
    <li>UI/UX Design</li>
    <li>SEO Management</li>
    <li>Brand Identity</li>
   </ul>
   </div>

   {/* Contact Info */}
   <div>
   <h4 className="text-xl font-bold mb-8">Contact Us</h4>
   <ul className="flex flex-col gap-6 text-text-muted">
    <li className="flex items-start gap-4">
    <div className="text-primary mt-1"><MapPin size={20} /></div>
    <span>123 Digital Drive, Creative Valley, Tech City 560001</span>
    </li>
    <li className="flex items-center gap-4">
    <div className="text-primary"><Phone size={20} /></div>
    <span>+91 98765 43210</span>
    </li>
    <li className="flex items-center gap-4">
    <div className="text-primary"><Mail size={20} /></div>
    <span>hello@wakeup.com</span>
    </li>
   </ul>
   </div>
  </div>

  <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-sm">
   <p>© 2024 WAKEUP Digital. All rights reserved.</p>
   <div className="flex gap-8">
   <a href="#" className="hover:text-primary">Privacy Policy</a>
   <a href="#" className="hover:text-primary">Terms of Service</a>
   </div>
  </div>
  </div>
 </footer>
 );
};

export default Footer;
