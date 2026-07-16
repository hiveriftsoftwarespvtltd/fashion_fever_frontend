import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import bannerImg from '../assets/banner.png';
import wellnessneed1 from '../assets/wellnessneed1.png';
import wellnessneed2 from '../assets/wellnessneed2.png';
import wellnessneed3 from '../assets/wellnessneed3.png';
import wellnessneed4 from '../assets/wellnessneed4.png';

const MoreBeautyToLove = () => {
  const categoriesRef = useRef(null);
  const beautyGuidesRef = useRef(null);

  const categories = [
   "https://images-static.nykaa.com/uploads/346ed7f1-065a-4283-869f-45523e621137.jpg?tr=cm-pad_resize,w-150",
   "https://images-static.nykaa.com/uploads/e44e176c-cade-486a-a19b-a23ded2337b2.jpg?tr=cm-pad_resize,w-150",
   "https://images-static.nykaa.com/uploads/cbc2dfc3-91b7-483d-b2e0-2e3cb5776d25.jpg?tr=cm-pad_resize,w-150",
   "https://images-static.nykaa.com/uploads/ba00dddf-858e-4242-aa0d-362415bd9613.jpg?tr=cm-pad_resize,w-150",
   "https://images-static.nykaa.com/uploads/17541b73-5f5f-449e-91aa-c5606e59aeb5.png?tr=cm-pad_resize,w-150",
   "https://images-static.nykaa.com/uploads/6da43d08-8c04-4f31-9f2d-a8c34b32cfc5.jpg?tr=cm-pad_resize,w-150",
   "https://images-static.nykaa.com/uploads/b7a6e36e-be01-4a56-8aed-6cac82cdc74d.jpg?tr=cm-pad_resize,w-150",
   "https://images-static.nykaa.com/uploads/844c2a89-2ae5-4e29-a1f8-6dad808da1d4.jpg?tr=cm-pad_resize,w-150",
   "https://images-static.nykaa.com/uploads/ba00dddf-858e-4242-aa0d-362415bd9613.jpg?tr=cm-pad_resize,w-150"
  ];

  const wellness = {
   logo: "https://images-static.nykaa.com/uploads/0491871a-289b-449e-b830-4e0da1a0139b.png",
   banners: [
    "https://images-static.nykaa.com/uploads/5ec28d9e-dca0-4cd9-b45d-048d1a683f58.jpg?tr=cm-pad_resize,w-800",
    "https://images-static.nykaa.com/uploads/3d4925f2-dc17-4a04-8107-5199befc8b55.jpg?tr=cm-pad_resize,w-800",
    "https://images-static.nykaa.com/uploads/00b3a7c2-0b7b-4a33-9df0-eb57c4f910b6.jpg?tr=cm-pad_resize,w-800"
   ],
   grid: [
    wellnessneed1,
    wellnessneed2,
    wellnessneed3,
    wellnessneed4
   ]
  };

 const beautyGuides = [
  { img: "https://images-static.nykaa.com/uploads/23b44191-454c-461c-9160-0666d8964361.jpg?tr=cm-pad_resize,w-300", title: "Makeup, Makeup Edit" },
  { img: "https://images-static.nykaa.com/uploads/1d695c6b-fecd-4142-8da5-a61fbac9f0e6.jpg?tr=cm-pad_resize,w-300", title: "Skincare For All Stages" },
  { img: "https://images-static.nykaa.com/uploads/88e267a6-0ea2-4e51-85cf-132adc60cf52.jpg?tr=cm-pad_resize,w-300", title: "Exam Survival Guide" },
  { img: "https://images-static.nykaa.com/uploads/21149c7c-a1c2-476a-ac07-b1ab4def1aba.jpg?tr=cm-pad_resize,w-300", title: "The College Beauty Guide" },
  { img: "https://images-static.nykaa.com/uploads/105a72b2-26e8-47cc-81a0-e45e083972b0.jpg?tr=cm-pad_resize,w-300", title: "Bonjour, French Pharmacy" },
  { img: "https://images-static.nykaa.com/uploads/6d9eba37-4ea7-4ae4-a34c-783ec69d4066.jpg?tr=cm-pad_resize,w-300", title: "Viral Beauty Essentials" }
 ];

 const scroll = (ref, direction) => {
  if (ref.current) {
   const scrollAmount = direction === 'left' ? -350 : 350;
   ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
 };

 return (
  <div className="w-full bg-white pt-8 pb-24">
   <div className="container mx-auto px-4 md:px-8">
    
    {/* 1. Need Help Section */}
    <div className="mb-12 relative group text-center">
     <div className="mb-6 px-1">
      <p className="text-[14px] font-medium text-gray-400 mb-1">More Beauty To Love</p>
      <h2 className="text-[20px] md:text-[24px] font-bold text-[#001325]">Need Help Choosing? Start Here!</h2>
     </div>

     <div className="relative">
      <button onClick={() => scroll(categoriesRef, 'left')} className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg border border-gray-100 hidden md:flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><ChevronLeft className="w-6 h-6 text-gray-600" /></button>
      <div 
       ref={categoriesRef} 
       className="flex overflow-x-auto gap-4 md:gap-5 no-scrollbar pb-4 snap-x snap-mandatory md:justify-center"
      >
       {categories.map((img, index) => (
        <Link to="/shop" key={index} className="block flex-shrink-0 w-[110px] md:w-[135px] snap-start cursor-pointer transition-transform hover:scale-105">
         <img src={img} alt={`Category ${index + 1}`} className="w-full h-auto rounded-2xl shadow-sm border border-gray-50" />
        </Link>
       ))}
      </div>
      <button onClick={() => scroll(categoriesRef, 'right')} className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg border border-gray-100 hidden md:flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><ChevronRight className="w-6 h-6 text-gray-600" /></button>
     </div>
    </div>

    {/* 2. Wellness Section - Gapless & No Overlap */}
    <div className="mt-16 mb-24">
     <div className="flex items-center justify-between mb-8 px-1">
      <h2 className="text-[18px] md:text-[26px] font-bold text-[#1e293b]">Explore Your Wellness Needs</h2>
      <img src={wellness.logo} alt="Nykaa Wellness Logo" className="h-6 md:h-8 object-contain" />
     </div>

     {/* Single full-width banner */}
     <Link to="/shop" className="block w-full mb-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer">
      <img
       src={bannerImg}
       alt="Explore Wellness"
       className="w-full h-auto block"
      />
     </Link>

     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {wellness.grid.map((img, index) => (
       <Link to="/shop" key={index} className="block cursor-pointer overflow-hidden rounded-2xl md:rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
        <img src={img} alt={`Wellness ${index + 1}`} className="w-full h-auto block" />
       </Link>
      ))}
     </div>

     
    </div>

    {/* 3. Beauty Advice Carousel */}
    <div className="mt-16 relative group text-center md:text-left">
     <div className="mb-8 px-1">
      <h2 className="text-[20px] md:text-[28px] font-bold text-[#1e293b]">Beauty Advice</h2>
     </div>

     <div className="relative">
      <button onClick={() => scroll(beautyGuidesRef, 'left')} className="absolute -left-4 md:-left-6 top-[40%] -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl border border-gray-100 hidden md:flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><ChevronLeft className="w-6 h-8 text-gray-800" /></button>
      <div 
       ref={beautyGuidesRef} 
       className="flex overflow-x-auto gap-4 md:gap-5 no-scrollbar pb-6 snap-x snap-mandatory md:justify-center"
      >
       {beautyGuides.map((guide, index) => (
        <Link to="/shop" key={index} className="block flex-shrink-0 w-[165px] md:w-[230px] snap-start cursor-pointer text-left">
         <div className="overflow-hidden rounded-2xl shadow-sm mb-3">
          <img src={guide.img} alt={guide.title} className="w-full h-auto transform transition-transform duration-500 hover:scale-110" />
         </div>
         <p className="text-[12px] md:text-[14px] font-medium text-[#1e293b] line-clamp-1 hover:text-[#ff0050] transition-colors">{guide.title}</p>
        </Link>
       ))}
      </div>
      <button onClick={() => scroll(beautyGuidesRef, 'right')} className="absolute -right-4 md:-right-6 top-[40%] -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl border border-gray-100 hidden md:flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><ChevronRight className="w-6 h-8 text-gray-800" /></button>
     </div>
    </div>

   </div>
  </div>
 );
};

export default MoreBeautyToLove;
