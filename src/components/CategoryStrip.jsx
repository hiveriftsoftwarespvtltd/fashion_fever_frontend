import React from 'react';
import { Link } from 'react-router-dom';

const CategoryStrip = () => {
 const categoryLinks = [
 'Makeup', 'Skin', 'Hair', 'Appliances', 'Bath & Body', 'Natural', 
 'Mom & Baby', 'Health & Wellness', 'Men', 'Fragrance', 'Lingerie & Accessories'
 ];

 return (
 <div className="bg-white border-b border-gray-100 py-3 overflow-x-auto no-scrollbar">
  <div className="container mx-auto">
  <div className="flex items-center justify-between">
   <div className="flex items-center gap-7">
   {categoryLinks.map((cat) => (
    <Link 
    key={cat} 
    to={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
    className="text-[13px] font-bold text-[#3f414d] hover:text-primary transition-colors whitespace-nowrap uppercase "
    >
    {cat}
    </Link>
   ))}
   </div>
   <div className="flex-shrink-0">
   <span className="bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-sm rotate-[-2deg] inline-block shadow-sm">
    SALE
   </span>
   </div>
  </div>
  </div>
 </div>
 );
};

export default CategoryStrip;
