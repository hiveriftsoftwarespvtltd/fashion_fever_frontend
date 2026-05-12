import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroPromotion = () => {
 const scrollRef = useRef(null);
 const bannerImg = "https://images-static.nykaa.com/uploads/ecd2fe0a-4c16-4e2b-86b5-b984d8355cc4.jpg?tr=cm-pad_resize,w-1200";
 
 const products = [
  "https://images-static.nykaa.com/uploads/2f421ca9-be4b-4a41-bbbb-b166c0f624a0.png?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/b5fa9c9e-e08a-4f11-a169-a73cf28ab130.png?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/5950aaac-8315-4f7b-be17-914db766fcaf.png?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/42de3e73-ea1b-46fa-8f8e-176dbfa43d52.png?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/50dd809b-fa10-4963-9362-5db46a7477b2.png?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/626c87e0-3e82-4242-9619-711363646279.png?tr=cm-pad_resize,w-300"
 ];

 const scroll = (direction) => {
  if (scrollRef.current) {
   const { scrollLeft, clientWidth } = scrollRef.current;
   const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
   scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }
 };

 return (
  <div className="w-full bg-white pt-6 pb-16">
   <div className="container mx-auto">
    
    {/* Main Banner */}
    <div className="w-full mb-8">
     <img 
      src={bannerImg} 
      alt="Promotion Banner" 
      className="w-full h-auto rounded-xl"
     />
    </div>

    {/* Carousel Wrapper */}
    <div className="relative group px-4 lg:px-0">
     
     {/* Navigation Buttons */}
     <button 
      onClick={() => scroll('left')}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
     >
      <ChevronLeft size={24} className="text-gray-600" />
     </button>
     
     <button 
      onClick={() => scroll('right')}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
     >
      <ChevronRight size={24} className="text-gray-600" />
     </button>

     {/* Product Carousel */}
     <div 
      ref={scrollRef}
      className="flex overflow-x-auto gap-4 no-scrollbar pb-6 snap-x snap-mandatory"
     >
      {products.map((img, index) => (
       <div 
        key={index} 
        className="flex-shrink-0 w-[180px] md:w-[220px] lg:w-[240px] snap-start"
       >
        <div className="cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
         <img 
          src={img} 
          alt={`Promotion Card ${index + 1}`} 
          className="w-full h-auto object-contain rounded-2xl"
         />
        </div>
       </div>
      ))}
     </div>
    </div>
   </div>
  </div>
 );
};

export default HeroPromotion;
