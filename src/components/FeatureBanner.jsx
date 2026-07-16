import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import makeup1 from '../assets/1makeup.png';
import makeup2 from '../assets/2makeup.png';
import makeup3 from '../assets/3makeup.png';
import makeup4 from '../assets/4makeup.png';
import makeup5 from '../assets/5makeup.png';
import makeup6 from '../assets/6makeup.png';
import makeup7 from '../assets/7makeup.png';
import makeup8 from '../assets/8makeup.png';

const FeatureBanner = () => {
 const scrollRef = useRef(null);
 const tornBanner = "https://images-static.nykaa.com/uploads/7656232f-fbff-4be1-bd1f-688546f5db1a.png?tr=cm-pad_resize,w-1200";

 const products = [
  { img: makeup1, brand: "Victoria's Secret", name: "Pure Seduction Fragrance...", size: "236ml", price: "1,619", oldPrice: "2,699", discount: "40%" },
  { img: makeup2, brand: "Dr. Sheth's", name: "Ceramide & Vitamin C...", size: "50g", price: "449", oldPrice: "400", discount: "10%" },
  { img: makeup3, brand: "Kay Beauty", name: "Intense Black 24H Kajal...", size: "0.55g", price: "899", oldPrice: "999", discount: "10%" },
  { img: makeup4, brand: "PAC", name: "Micro Finish Makeup Fixer...", size: "120ml", price: "1,058", oldPrice: "1,175", discount: "10%" },
  { img: makeup5, brand: "MCaffeine", name: "Summer Breeze Perfume...", size: "300ml", price: "374", oldPrice: "499", discount: "25%" },
  { img: makeup6, brand: "ETUDE", name: "Dear Darling Water Gel...", size: "9g", price: "405", oldPrice: "450", discount: "10%" },
  { img: makeup7, brand: "L'Oreal Paris", name: "Glycolic Bright Serum...", size: "15ml", price: "399", oldPrice: "499", discount: "20%" },
  { img: makeup8, brand: "Maybelline New York", name: "Fit Me Matte+Poreless...", size: "30ml", price: "599", oldPrice: "699", discount: "14%" }
 ];

 const scroll = (direction) => {
 if (scrollRef.current) {
  const { scrollLeft, clientWidth } = scrollRef.current;
  const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
  scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
 }
 };

 return (
 <div className="w-full bg-[#fefbe9] pb-12 pt-4 mt-8">
  <div className="container mx-auto relative group px-2 md:px-4">

  {/* Torn Paper Header Ribbon */}
  <div className="flex justify-center mb-6 md:mb-10">
   <img
   src={tornBanner}
   alt="Deals Of The Day"
   className="container mx-auto"
   />
  </div>

  {/* Navigation Buttons - Tablet/Desktop only */}
  <button
   onClick={() => scroll('left')}
   className="absolute left-2 top-[60%] -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-gray-50 text-gray-800 border border-gray-100"
  >
   <ChevronLeft size={24} />
  </button>

  <button
   onClick={() => scroll('right')}
   className="absolute right-2 top-[60%] -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-gray-50 text-gray-800 border border-gray-100"
  >
   <ChevronRight size={24} />
  </button>

  {/* Product Carousel - Forced 2 items on mobile */}
  <div
   ref={scrollRef}
   className="flex overflow-x-auto gap-3 md:gap-5 no-scrollbar snap-x snap-mandatory px-1"
  >
   {products.map((p, index) => (
   <div
    key={index}
    className="flex-shrink-0 w-[calc(50%-12px)] md:w-[240px] snap-start cursor-pointer group/card"
   >
    {/* Product Image Box */}
    <div className="bg-white rounded-xl p-3 md:p-4 mb-3 md:mb-4 shadow-sm group-hover/card:shadow-md transition-shadow aspect-square flex items-center justify-center border border-gray-50">
    <img
     src={p.img}
     alt={p.name}
     className="w-full h-auto object-contain transition-transform duration-500 group-hover/card:scale-105"
    />
    </div>

    {/* Text Details */}
    <div className="px-1">
    <h4 className="text-[12px] md:text-[14px] font-bold text-gray-900 truncate leading-tight">{p.brand}</h4>
    <p className="text-[11px] md:text-[13px] text-gray-600 truncate mb-1">{p.name}</p>
    <div className="flex items-center gap-1 text-sm md:text-[11px] text-gray-400 mb-1 md:mb-2">
     <span>📦</span>
     <span>{p.size}</span>
    </div>
    <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
     <span className="text-[13px] md:text-[16px] font-bold text-gray-900">₹{p.price}</span>
     <span className="text-sm md:text-[12px] text-gray-400 line-through">₹{p.oldPrice}</span>
     <span className="text-sm md:text-[12px] font-bold text-green-600 uppercase ">{p.discount} OFF</span>
    </div>
    </div>
   </div>
   ))}
   {/* Add more items for smooth scroll feel */}
   {products.slice(0, 4).map((p, index) => (
   <div
    key={`dup-${index}`}
    className="flex-shrink-0 w-[calc(50%-12px)] md:w-[240px] snap-start cursor-pointer group/card"
   >
    <div className="bg-white rounded-xl p-3 md:p-4 mb-3 md:mb-4 shadow-sm group-hover/card:shadow-md transition-shadow aspect-square flex items-center justify-center border border-gray-50">
    <img
     src={p.img}
     alt={p.name}
     className="w-full h-auto object-contain transition-transform duration-500 group-hover/card:scale-105"
    />
    </div>
    <div className="px-1">
    <h4 className="text-[12px] md:text-[14px] font-bold text-gray-900 truncate leading-tight">{p.brand}</h4>
    <p className="text-[11px] md:text-[13px] text-gray-600 truncate mb-1">{p.name}</p>
    <div className="flex items-center gap-1 text-sm md:text-[11px] text-gray-400 mb-1 md:mb-2">
     <span>📦</span>
     <span>{p.size}</span>
    </div>
    <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
     <span className="text-[13px] md:text-[16px] font-bold text-gray-900">₹{p.price}</span>
     <span className="text-sm md:text-[12px] text-gray-400 line-through">₹{p.oldPrice}</span>
     <span className="text-sm md:text-[12px] font-bold text-green-600 uppercase ">{p.discount} OFF</span>
    </div>
    </div>
   </div>
   ))}
  </div>
  </div>
 </div>
 );
};

export default FeatureBanner;
