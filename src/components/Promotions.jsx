import React from 'react';
import { Link } from 'react-router-dom';
import slide from '../assets/slide.png';
import slide2 from '../assets/slide2.png';

const Promotions = () => {
  const gifBanner = slide;
  const mainBanner = slide2;

  return (
    <div className="container mx-auto px-4 lg:px-0">
      <div className="flex flex-col gap-6 bg-white rounded-xl shadow-sm">
      
        {/* GIF Promotion Banner */}
        <Link to="/shop" className="w-full block cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <img 
            src={gifBanner} 
            alt="Promotion Gift" 
            className="w-full h-auto object-cover"
          />
        </Link>

        {/* Static Promotion Banner */}
        <Link to="/shop" className="w-full block cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <img 
            src={mainBanner} 
            alt="Promotion Offer" 
            className="w-full h-auto object-cover"
          />
        </Link>

      </div>
    </div>
  );
};

export default Promotions;
