import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import needhelp1 from '../assets/needhelp1.png';
import needhelp2 from '../assets/needhelp2.png';
import needhelp3 from '../assets/needhelp3.png';
import needhelp4 from '../assets/needhelp4.png';
import needhelp5 from '../assets/needhelp5.png';
import needhelp6 from '../assets/needhelp6.png';

const BirthdayCarousel = () => {
 const scrollRef = useRef(null);

 const images = [
  needhelp1,
  needhelp2,
  needhelp3,
  needhelp4,
  needhelp5,
  needhelp6,
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
   <Link 
    key={index} 
    to="/shop"
    className="flex-shrink-0 w-[260px] md:w-[320px] snap-start cursor-pointer transition-all duration-300 hover:scale-[1.03] block"
   >
    <img 
    src={img} 
    alt={`Slide ${index + 1}`} 
    className="w-full h-auto rounded-[40px] shadow-sm border-2 border-white/40"
    />
   </Link>
   ))}
  </div>
  </div>
 </div>
 );
};

export default BirthdayCarousel;
