import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const UnlockMoreBeauty = () => {
 const scrollRef = useRef(null);
 const images = {
  tick: "https://images-static.nykaa.com/uploads/84581a31-2a25-49f6-bcd5-95da9fdec95a.png?tr=cm-pad_resize,w-600",
  giftCard: "https://images-static.nykaa.com/uploads/f3ba4add-4f2a-4c51-856d-363dade8d435.jpg?tr=cm-pad_resize,w-600",
  store: "https://images-static.nykaa.com/uploads/5aa8ba8b-8a32-497f-aabc-941581c1cc8a.jpg?tr=cm-pad_resize,w-600"
 };

 const stores = [
  "https://images-static.nykaa.com/uploads/6ceabedc-0da6-4de9-977e-e0f9979bcc57.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/6447f989-64c7-47c4-aeab-0e84c62c2eb4.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/4a0a92af-c87e-41f5-abf8-88645315de12.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/68e02b0e-1170-43f5-b248-84bd88407296.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/4ccc23fe-9c9d-4b9b-b27d-3b0db0bd6d38.jpg?tr=cm-pad_resize,w-300",
  "https://images-static.nykaa.com/uploads/7e076a07-c6f0-49e9-a411-f0900e48be09.jpg?tr=cm-pad_resize,w-300",
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
