import React from 'react';
import { Link } from 'react-router-dom';
import beautyBffVideo from '../assets/UNLOCKTHESECRETTO.mp4';

const BeautyBFF = () => {
 return (
  <div className="w-full bg-white pb-16">
   <div className="container mx-auto px-4 lg:px-0">
    <div className="mb-6 px-1">
     <h2 className="text-[20px] md:text-[24px] font-bold text-[#001325]">Your Beauty BFF Is Here!</h2>
    </div>
    
    <Link to="/shop" className="w-full block overflow-hidden rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
     <video 
      src={beautyBffVideo} 
      autoPlay 
      loop 
      muted 
      playsInline
      className="w-full h-auto object-contain"
     />
    </Link>
   </div>
  </div>
 );
};

export default BeautyBFF;
