import React from 'react';

const LastChance = () => {
 const bannerImg = "https://images-static.nykaa.com/uploads/c638aaea-f78e-49e0-b14b-93400e0d94c7.png?tr=cm-pad_resize,w-1200";
 const cardImage = "https://images-static.nykaa.com/uploads/2f14ad13-4aca-41cb-87c1-961f857d59af.png?tr=cm-pad_resize,w-200";

 return (
 <div className="w-full bg-[#fbd6e8] pt-12 mt-16">
  <div className="container mx-auto bg-white rounded-t-[60px] pt-8 pb-16 px-4 lg:px-6 relative shadow-sm">
  
  {/* Torn Paper Banner */}
  <div className="flex justify-center -mt-20 mb-8">
   <img 
   src={bannerImg} 
   alt="Last Chance Save Now" 
   className="w-full max-w-[1100px] h-auto "
   />
  </div>

  {/* 6 Grid Images */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 relative z-10 px-2 lg:px-6">
   {[1, 2, 3, 4, 5, 6].map((item) => (
   <div 
    key={item} 
    className="cursor-pointer transition-transform duration-300 hover:-translate-y-1"
   >
    <img 
    src={cardImage} 
    alt={`Offer ${item}`} 
    className="w-full h-auto object-contain"
    />
   </div>
   ))}
  </div>

  {/* Background Sparkle dots (optional flair) */}
  <div className="absolute top-20 left-10 w-4 h-4 bg-gray-200/40 rounded-full animate-pulse"></div>
  <div className="absolute bottom-20 right-10 w-6 h-6 bg-gray-200/40 rounded-full animate-pulse"></div>
  </div>
 </div>
 );
};

export default LastChance;
