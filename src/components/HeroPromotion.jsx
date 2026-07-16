import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import skincare1 from '../assets/1skincare.png';
import skincare2 from '../assets/2skincare.png';
import skincare3 from '../assets/3skincare.png';
import skincare4 from '../assets/4skincare.png';
import skincare5 from '../assets/5skincare.png';
import skincare6 from '../assets/6skincare.png';
import skincare7 from '../assets/7skincare.png';
import skincare8 from '../assets/8skincare.png';

const HeroPromotion = () => {
  const scrollRef = useRef(null);
  const bannerImg = "https://images-static.nykaa.com/uploads/ecd2fe0a-4c16-4e2b-86b5-b984d8355cc4.jpg?tr=cm-pad_resize,w-1200";
  
  const products = [
   skincare1,
   skincare2,
   skincare3,
   skincare4,
   skincare5,
   skincare6,
   skincare7,
   skincare8
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
     <Link to="/shop" className="w-full mb-8 block cursor-pointer">
      <img 
       src={bannerImg} 
       alt="Promotion Banner" 
       className="w-full h-auto rounded-xl"
      />
     </Link>

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
        <Link 
         key={index} 
         to="/shop"
         className="flex-shrink-0 w-[180px] md:w-[220px] lg:w-[240px] snap-start block"
        >
         <div className="cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
          <img 
           src={img} 
           alt={`Promotion Card ${index + 1}`} 
           className="w-full h-auto object-contain rounded-2xl"
          />
         </div>
        </Link>
       ))}
      </div>
     </div>
    </div>
   </div>
  );
};

export default HeroPromotion;
