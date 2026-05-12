import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DiscoverStores = () => {
 const scrollRef = useRef(null);
 
 const stores = [
  "https://images-static.nykaa.com/uploads/6ceabedc-0da6-4de9-977e-e0f9979bcc57.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/6447f989-64c7-47c4-aeab-0e84c62c2eb4.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/4a0a92af-c87e-41f5-abf8-88645315de12.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/68e02b0e-1170-43f5-b248-84bd88407296.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/4ccc23fe-9c9d-4b9b-b27d-3b0db0bd6d38.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/7e076a07-c6f0-49e9-a411-f0900e48be04.jpg?tr=cm-pad_resize,w-300", // Fixed potential typo
  "https://images-static.nykaa.com/uploads/5d5c7b39-c375-441d-8d9f-524428296c38.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/e67de922-1433-4be8-b30c-decb76f22b26.png?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/1ebb19bd-d2b1-468c-94f2-14c36f8dbcca.jpg?tr=cm-pad_resize,w-300"
 ];

 const scroll = (direction) => {
  if (scrollRef.current) {
   const { scrollLeft, clientWidth } = scrollRef.current;
   const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
   scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }
 };

 return (
  <div className="w-full bg-white py-12">
   <div className="container mx-auto">
    <div className="relative group px-4 lg:px-1">
     
     {/* Navigation Buttons */}
     <button 
      onClick={() => scroll('left')}
      className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 text-gray-700 hidden md:flex items-center justify-center border border-gray-100"
     >
      <ChevronLeft size={24} />
     </button>
     
     <button 
      onClick={() => scroll('right')}
      className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 text-gray-700 hidden md:flex items-center justify-center border border-gray-100"
     >
      <ChevronRight size={24} />
     </button>

     {/* Stores Carousel */}
     <div 
      ref={scrollRef}
      className="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory pb-4"
     >
      {stores.map((img, index) => (
       <div 
        key={index} 
        className="flex-shrink-0 w-[200px] md:w-[280px] snap-start"
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
 );
};

export default DiscoverStores;
