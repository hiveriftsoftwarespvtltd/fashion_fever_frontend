import React from 'react';

const BeautyBFF = () => {
 return (
  <div className="w-full bg-white pb-16">
   <div className="container mx-auto px-4 lg:px-0">
    <div className="mb-6 px-1">
     <h2 className="text-[20px] md:text-[24px] font-bold text-[#001325]">Your Beauty BFF Is Here!</h2>
    </div>
    
    <div className="w-full overflow-hidden rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
     <img 
      src="https://images-static.nykaa.com/uploads/534900d4-50d4-4d22-8586-1c7496e7235b.png?tr=cm-pad_resize,w-1200" 
      alt="Your Beauty BFF - Korean Glass Skin" 
      className="w-full h-auto object-contain"
     />
    </div>
   </div>
  </div>
 );
};

export default BeautyBFF;
