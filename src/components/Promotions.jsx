import React from 'react';

const Promotions = () => {
 const gifBanner = "https://images-static.nykaa.com/uploads/54f9ad15-b75d-4d53-b70a-6dfac421ebf6.gif";
 const mainBanner = "https://images-static.nykaa.com/uploads/718bdcc6-ca6d-4ce1-857f-1c9908b14905.jpg?tr=cm-pad_resize,w-1200";
 const celebratoryBanner = "https://images-static.nykaa.com/uploads/45490287-7b80-48b6-8187-5f8fc0f682e2.png?tr=cm-pad_resize,w-1200";

 return (
 <div className="container mx-auto px-4 lg:px-0">
  <div className="flex flex-col gap-6 bg-white rounded-xl shadow-sm">
  
  {/* GIF Promotion Banner */}
  <div className="w-full cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
   <img 
   src={gifBanner} 
   alt="Promotion Gift" 
   className="w-full h-auto object-cover"
   />
  </div>

  {/* Static Promotion Banner */}
  <div className="w-full cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
   <img 
   src={mainBanner} 
   alt="Promotion Offer" 
   className="w-full h-auto object-cover"
   />
  </div>

  {/* Celebratory Promotion Banner */}
  <div className="w-full cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
   <img 
   src={celebratoryBanner} 
   alt="Celebratory Offer" 
   className="w-full h-auto object-cover"
   />
  </div>

  </div>
 </div>
 );
};

export default Promotions;
