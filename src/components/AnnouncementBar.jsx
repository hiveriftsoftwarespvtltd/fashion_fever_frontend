import React from 'react';

const AnnouncementBar = () => {
 const message = "SALE IS LIVE! FREE SHIPPING ON ALL ORDERS ABOVE ₹299 • ";
 
 return (
 <div className="bg-[#fff0f5] py-2 overflow-hidden border-b border-pink-100">
  <div className="animate-marquee whitespace-nowrap">
  {/* Repeat the text multiple times for a continuous effect */}
  {[...Array(10)].map((_, i) => (
   <span key={i} className="text-[#8b0000] text-[12px] font-bold uppercase px-4">
   {message}
   </span>
  ))}
  </div>
 </div>
 );
};

export default AnnouncementBar;
