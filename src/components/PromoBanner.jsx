import React from 'react';

const PromoBanner = () => {
 const wideBanner = "https://images-static.nykaa.com/uploads/7656232f-fbff-4be1-bd1f-688546f5db1a.png?tr=cm-pad_resize,w-1200";

 return (
  <div className="container mx-auto py-6 px-4 lg:px-0">
   <div className="w-full cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
    <img 
     src={wideBanner} 
     alt="Celebratory Offer" 
     className="w-full h-auto object-cover"
    />
   </div>
  </div>
 );
};

export default PromoBanner;
