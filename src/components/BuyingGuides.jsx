import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import buyingguid3 from '../assets/buyingguid3.png';
import buyingguid from '../assets/buyingguid.png';
import buyingguid4 from '../assets/buyingguid4.png';
import buyingguid2 from '../assets/buyingguid2.png';

const BuyingGuides = () => {
 const scrollRef = useRef(null);
 const brandsRef = useRef(null);
 const dealsRef = useRef(null);

 const guides = [
  buyingguid3,
  buyingguid,
  buyingguid4,
  buyingguid2
 ];

 const brands = [
  "https://images-static.nykaa.com/uploads/9ac43dab-6874-469b-8147-ac2832be14f0.jpg?tr=cm-pad_resize,w-200",
  "https://images-static.nykaa.com/uploads/669581e9-5f6a-44df-8618-f168184c6c75.jpg?tr=cm-pad_resize,w-200",
  "https://images-static.nykaa.com/uploads/5fa97f91-506a-4569-9e18-3f6af5a3971b.jpg?tr=cm-pad_resize,w-200",
  "https://images-static.nykaa.com/uploads/db91e247-b927-497f-9e9f-582d61d270b1.jpg?tr=cm-pad_resize,w-200",
  "https://images-static.nykaa.com/uploads/d9d38e9c-8c76-4ad9-883d-86202dfc20f5.jpg?tr=cm-pad_resize,w-200",
  "https://images-static.nykaa.com/uploads/e18d5af3-8a79-4906-9256-5dcb438d15ab.jpg?tr=cm-pad_resize,w-200",
  "https://images-static.nykaa.com/uploads/1688a2be-1bd4-4a6a-8d6f-24cb83b53401.jpg?tr=cm-pad_resize,w-200"
 ];

 const topDeals = [
  { img: "https://images-static.nykaa.com/uploads/81cd0bbc-321a-447f-8824-d5c600cfb291.jpg?tr=cm-pad_resize,w-300", offer: "Up to 60% off" },
  { img: "https://images-static.nykaa.com/uploads/67bd50a7-7f7f-4d6a-ac09-551b0bab6e90.jpg?tr=cm-pad_resize,w-300", offer: "Up to 20% off" },
  { img: "https://images-static.nykaa.com/uploads/f74ba081-1faa-4f73-a3ca-8603b4310cdc.jpg?tr=cm-pad_resize,w-300", offer: "Up to 50% off" },
  { img: "https://images-static.nykaa.com/uploads/27eaa4c8-31ad-4c24-8c81-95d151a4de5d.jpg?tr=cm-pad_resize,w-300", offer: "Up to 70% off" },
  { img: "https://images-static.nykaa.com/uploads/512f49b4-af12-419e-9473-bb7554b72e83.jpg?tr=cm-pad_resize,w-300", offer: "Flat 40% off" },
  { img: "https://images-static.nykaa.com/uploads/f2e92eef-b9f0-49fc-8f5f-107da2b6a3f8.jpg?tr=cm-pad_resize,w-300", offer: "Min. 30% off" },
  { img: "https://images-static.nykaa.com/uploads/c38d2adc-22e1-4760-88d9-e725e2640c4f.jpg?tr=cm-pad_resize,w-300", offer: "Up to 45% off" },
  { img: "https://images-static.nykaa.com/uploads/e046aeb5-f184-4ea1-8e67-ffdc28f8f6c4.jpg?tr=cm-pad_resize,w-300", offer: "New Launch Special" }
 ];

 const scroll = (ref, direction, amount = 350) => {
  if (ref.current) {
   const scrollAmount = direction === 'left' ? -amount : amount;
   ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
 };

 return (
  <div className="w-full bg-white pb-20 pt-8 overflow-hidden">
   <div className="container mx-auto px-4 md:px-8">
    
    {/* 1. Buying Guides Section */}
    <div className="mb-14">
     <div className="mb-8 text-center md:text-left text-[#1e293b]">
      <h2 className="text-[20px] md:text-[28px] font-bold">Buying Guides</h2>
     </div>

     <div className="relative group">
      <button onClick={() => scroll(scrollRef, 'left')} className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl border border-gray-100 hidden md:flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><ChevronLeft className="w-6 h-6 text-gray-800" /></button>
      <div ref={scrollRef} className="flex overflow-x-auto gap-5 no-scrollbar pb-6 snap-x snap-mandatory">
       {guides.map((img, index) => (
        <div key={index} className="flex-shrink-0 w-[280px] md:w-[340px] snap-start cursor-pointer overflow-hidden rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
         <img src={img} alt={`Guide ${index + 1}`} className="w-full h-auto block" />
        </div>
       ))}
      </div>
      <button onClick={() => scroll(scrollRef, 'right')} className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl border border-gray-100 hidden md:flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><ChevronRight className="w-6 h-6 text-gray-800" /></button>
     </div>
    </div>

    {/* 2. Middle Banner */}
    <div className="mb-20">
     <img 
      src="https://images-static.nykaa.com/uploads/f2284778-ab2c-4e38-b92d-82c8f84849f4.jpg?tr=cm-pad_resize,w-1200" 
      alt="Promo Banner" 
      className="w-full h-auto object-contain rounded-2xl md:rounded-[1.5rem] shadow-sm mx-auto" 
     />
    </div>

    {/* 3. Brands Spotlight Section - 6 Cards Default */}
    <div className="mt-12 mb-20">
     <div className="mb-8 text-center md:text-left text-[#1e293b]">
      <h2 className="text-[20px] md:text-[28px] font-bold">Featured Brands</h2>
     </div>
     <div className="relative group">
      <button onClick={() => scroll(brandsRef, 'left')} className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg border border-gray-100 hidden md:flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><ChevronLeft className="w-6 h-6 text-gray-600" /></button>
      <div ref={brandsRef} className="flex overflow-x-auto gap-4 md:gap-5 no-scrollbar pb-6 snap-x snap-mandatory">
       {brands.map((img, index) => (
        <div key={index} className="flex-shrink-0 w-[140px] md:w-[calc(16.666%-1rem)] snap-start cursor-pointer group/item">
         <div className="overflow-hidden rounded-2xl shadow-sm border border-gray-50 transition-all duration-300 group-hover/item:shadow-md group-hover/item:border-gray-200">
          <img src={img} alt={`Featured ${index + 1}`} className="w-full h-auto transform transition-transform duration-500 group-hover/item:scale-110" />
         </div>
        </div>
       ))}
      </div>
      <button onClick={() => scroll(brandsRef, 'right')} className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg border border-gray-100 hidden md:flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><ChevronRight className="w-6 h-6 text-gray-600" /></button>
     </div>
    </div>

    {/* 4. Top Deals Section - 4 Cards Default (Newly Added) */}
    <div className="mt-20">
     <div className="mb-8 text-center md:text-left text-[#1e293b]">
      <h2 className="text-[20px] md:text-[28px] font-bold">Fashion & Lifestyle Deals</h2>
     </div>

     <div className="relative group">
      <button onClick={() => scroll(dealsRef, 'left', 400)} className="absolute -left-4 md:-left-6 top-[40%] -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl border border-gray-100 hidden md:flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><ChevronLeft className="w-7 h-7 text-gray-800" /></button>
      
      <div ref={dealsRef} className="flex overflow-x-auto gap-6 no-scrollbar pb-6 snap-x snap-mandatory">
       {topDeals.map((deal, index) => (
        <div 
         key={index} 
         className="flex-shrink-0 w-[240px] md:w-[calc(25%-1.2rem)] snap-start cursor-pointer flex flex-col items-center"
        >
         <div className="overflow-hidden rounded-2xl shadow-sm mb-4 w-full">
          <img src={deal.img} alt={deal.offer} className="w-full h-auto transform transition-transform duration-500 hover:scale-105" />
         </div>
         <p className="text-[14px] md:text-[16px] font-bold text-[#001325]">{deal.offer}</p>
        </div>
       ))}
      </div>

      <button onClick={() => scroll(dealsRef, 'right', 400)} className="absolute -right-4 md:-right-6 top-[40%] -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl border border-gray-100 hidden md:flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"><ChevronRight className="w-7 h-7 text-gray-800" /></button>
     </div>

     <div className="mt-10 flex justify-center">
      <button className="bg-[#ff0050] text-white px-10 md:px-32 py-3 rounded-lg font-bold text-[14px] md:text-[16px] hover:bg-[#e60048] transition-all flex items-center gap-2">
       Shop All <ChevronRight className="w-4 h-4" />
      </button>
     </div>
    </div>

   </div>
  </div>
 );
};

export default BuyingGuides;
