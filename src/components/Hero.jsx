import React from 'react';
import AnnouncementBar from './AnnouncementBar';
import CategoryStrip from './CategoryStrip';

const Hero = () => {
 const bannerImg = "https://images-static.nykaa.com/uploads/08fdce55-e3c2-4b84-b37c-4872956cbea7.png?tr=cm-pad_resize,w-1200";
 const cardImg = "https://images-static.nykaa.com/creatives/f5064765-e62c-4ceb-8e25-f61056896c2b/default.jpg?tr=cm-pad_resize,w-600";

 return (
 <div className="w-full ">
  {/* These move here to become part of Hero */}
  <CategoryStrip />
  <AnnouncementBar />

  <div className="container mx-auto mt-6">
  {/* Main Banner */}
  <div className="w-full cursor-pointer hover:opacity-95 transition-opacity">
   <img
   src={bannerImg}
   alt="Main Banner"
   className="w-full h-auto rounded-lg shadow-sm"
   />
  </div>
  </div>

  {/* Full-width background for 3 Grid Cards */}
  <div className="bg-[#f8f8dd] ">
  <div className="container mx-auto">
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 ">
   {[1, 2, 3].map((item) => (
    <div key={item} className="group relative cursor-pointer overflow-hidden rounded-[16px] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-[350px] lg:h-[450px]">
    <img
     src={cardImg}
     alt={`Card ${item}`}
     className="w-full h-full object-fit transition-transform duration-700 group-hover:scale-105"
    />

    {/* Brand Logo Tab (Top Left) */}
    <div className="absolute top-0 left-0 bg-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-br-[16px] shadow-sm">
     <span className="text-[10px] lg:text-[12px] font-bold text-black uppercase text-center block">
     {item === 1 ? 'Clinique' : item === 2 ? 'Carolina' : 'Milk'}
     </span>
    </div>


    </div>
   ))}
   </div>
  </div>
  </div>
 </div>
 );
};

export default Hero;
