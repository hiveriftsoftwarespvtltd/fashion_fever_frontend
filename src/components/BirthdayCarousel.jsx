import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BirthdayCarousel = () => {
 const scrollRef = useRef(null);

 const images = [
 "https://images-static.nykaa.com/uploads/5c098b63-6844-4ce8-a3cf-3e1015c2277a.jpg?tr=cm-pad_resize,w-300",
 "https://images-static.nykaa.com/uploads/fbbeab50-12f4-449d-917b-4efa0fa79941.jpg?tr=cm-pad_resize,w-300",
 "https://images-static.nykaa.com/uploads/b12e526b-c6c7-45f8-9cd4-491e3767d78b.jpg?tr=cm-pad_resize,w-300",
 "https://images-static.nykaa.com/uploads/2c3c7fa3-2da8-49a1-8643-d1aaba2479b5.jpg?tr=cm-pad_resize,w-300",
 "https://images-static.nykaa.com/uploads/1db00d7e-5594-47ab-96e2-f7310500a7b1.jpg?tr=cm-pad_resize,w-300",
 "https://images-static.nykaa.com/uploads/b5555e6a-916e-4760-a0bd-de61e1f3a413.jpg?tr=cm-pad_resize,w-300",
 "https://images-static.nykaa.com/uploads/7c2dca89-2b54-4a3e-9bd5-9e930455944f.jpg?tr=cm-pad_resize,w-300",
 "https://images-static.nykaa.com/uploads/f678d929-1ee7-4478-8299-4254514a7585.jpg?tr=cm-pad_resize,w-300",
 "https://images-static.nykaa.com/uploads/d4e39488-7ba7-4983-bdb6-07a89706dc11.jpg?tr=cm-pad_resize,w-300",
 "https://images-static.nykaa.com/uploads/d4e39488-7ba7-4983-bdb6-07a89706dc11.jpg?tr=cm-pad_resize,w-300",
 "https://images-static.nykaa.com/uploads/4a1da26b-fed1-4107-a94a-58126abe5668.jpg?tr=cm-pad_resize,w-300"
 ];

 const scroll = (direction) => {
 if (scrollRef.current) {
  const { scrollLeft, clientWidth } = scrollRef.current;
  const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
  scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
 }
 };

 return (
 <div className="w-full bg-[#fbd6e8] pb-16 pt-12 -mt-1">
  <div className="container mx-auto px-4 lg:px-10 relative group">
  
  {/* Navigation Buttons */}
  <button 
   onClick={() => scroll('left')}
   className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-white text-pink-600 border border-pink-100"
  >
   <ChevronLeft size={28} color="currentColor" />
  </button>

  <button 
   onClick={() => scroll('right')}
   className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-white text-pink-600 border border-pink-100"
  >
   <ChevronRight size={28} color="currentColor" />
  </button>

  {/* Carousel Content */}
  <div 
   ref={scrollRef}
   className="flex overflow-x-auto gap-5 no-scrollbar pb-8 snap-x snap-mandatory"
  >
   {images.map((img, index) => (
   <div 
    key={index} 
    className="flex-shrink-0 w-[260px] md:w-[320px] snap-start cursor-pointer transition-all duration-300 hover:scale-[1.03]"
   >
    <img 
    src={img} 
    alt={`Slide ${index + 1}`} 
    className="w-full h-auto rounded-[40px] shadow-sm border-2 border-white/40"
    />
   </div>
   ))}
  </div>
  </div>
 </div>
 );
};

export default BirthdayCarousel;
