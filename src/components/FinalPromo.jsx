import React from 'react';

const FinalPromo = () => {
 const bannerImg = "https://images-static.nykaa.com/uploads/f1bb4764-da1d-4646-a4bf-6456f43fcb1f.jpg?tr=cm-pad_resize,w-1200";

 return (
  <div className="container mx-auto py-8 px-4 lg:px-0">
   <div className="w-full cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
    <img 
     src={bannerImg} 
     alt="Final Promotion" 
     className="w-full h-auto object-cover"
    />
   </div>
  </div>
 );
};

export default FinalPromo;
