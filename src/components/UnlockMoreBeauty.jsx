import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import unlock from '../assets/unlock.png';
import unlock2 from '../assets/unlock2.png';
import unlock3 from '../assets/unlock3.png';
import Discover1 from '../assets/Discover1.png';
import Discover2 from '../assets/Discover2.png';
import Discover3 from '../assets/Discover3.png';
import Dicover4 from '../assets/Dicover4.png';
import Discover5 from '../assets/Discover5.png';
import Discover6 from '../assets/Discover6.png';

const UnlockMoreBeauty = () => {
 const scrollRef = useRef(null);
 const images = {
  tick: unlock,
  giftCard: unlock2,
  store: unlock3
 };

 const stores = [
  Discover1,
  Discover2,
  Discover3,
  Dicover4,
  Discover5,
  Discover6
 ];

 const scroll = (direction) => {
  if (scrollRef.current) {
   const { scrollLeft, clientWidth } = scrollRef.current;
   const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
   scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }
 };

 return (
  <div className="w-full bg-white">
   <div className="container mx-auto py-12 px-4 lg:px-0">
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 px-1">Unlock More Beauty</h2>
    
    <div className="flex flex-col gap-10">
     {/* Main Promos Block */}
     <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <img src={images.tick} alt="Tick Shop & Win" className="w-full h-auto object-cover" />
       </div>
       <div className="cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <img src={images.giftCard} alt="Gift Cards" className="w-full h-auto object-cover" />
       </div>
      </div>

      <div className="flex justify-center">
       <div className="w-full md:w-[70%] cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <img src={images.store} alt="The Gift Store" className="w-full h-auto object-cover" />
       </div>
      </div>
     </div>

     {/* Stores Carousel Integration */}
     <div className="relative group px-1">
      <button 
       onClick={() => scroll('left')}
       className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 text-gray-700 hidden md:flex items-center justify-center border border-gray-100"
      >
       <ChevronLeft size={24} />
      </button>
      
      <button 
       onClick={() => scroll('right')}
       className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 bg-white p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 text-gray-700 hidden md:flex items-center justify-center border border-gray-100"
      >
       <ChevronRight size={24} />
      </button>

      <div 
       ref={scrollRef}
       className="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory pb-4"
      >
       {stores.map((img, index) => (
        <div 
         key={index} 
         className="flex-shrink-0 w-[180px] md:w-[260px] snap-start"
        >
         <div className="cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <img 
           src={img} 
           alt={`Store ${index + 1}`} 
           className="w-full h-auto object-cover"
          />
         </div>
        </div>
       ))}
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};

export default UnlockMoreBeauty;
