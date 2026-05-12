import React from 'react';

const BrandBanners = () => {
 const brand1 = "https://images-static.nykaa.com/creatives/d0b970b7-67ac-4bd5-a0b6-17fc466f2c4b/default.jpg?tr=cm-pad_resize,w-600";
 const brand2 = "https://images-static.nykaa.com/creatives/e91d7f06-6aef-44be-b26f-ae584786f35d/default.jpg?tr=cm-pad_resize,w-600";
 const brand3 = "https://images-static.nykaa.com/creatives/b90bf25c-b6fb-47ec-abb3-8cc1014061e9/default.jpeg?tr=cm-pad_resize,w-600";

 const brandData = [
 {
  id: '2347',
  title: '10% Off',
  subtitle: 'On Entire Brand',
  img: brand1
 },
 {
  id: '15967',
  title: 'Flat 15% OFF',
  subtitle: 'On First Purchase!',
  img: brand2
 },
 {
  id: '1938',
  title: 'New Launch Alert!',
  subtitle: 'Lightweight Moisturization',
  img: brand3
 }
 ];

 return (
 <div className="bg-[#fc9bc9] ">
  <div className="container mx-auto pb-8 px-4 lg:px-0">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
   {brandData.map((brand, index) => (
   <div key={index} className="group relative cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-[400px]">
    <img
    src={brand.img}
    alt={brand.title}
    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />

    {/* Top Left Label */}
    <div className="absolute top-0 left-0 bg-white px-3 py-1.5 rounded-br-xl shadow-sm">
    <span className="text-[11px] font-bold text-black">#{brand.id}</span>
    </div>

    {/* Bottom Left Text Overlay */}
    <div className="absolute inset-0 flex flex-col justify-end p-5">
    <h3 className="text-white text-[20px] font-extrabold leading-tight">{brand.title}</h3>
    <p className="text-white/90 text-[12px] font-semibold mt-1 uppercase ">{brand.subtitle}</p>
    </div>
   </div>
   ))}
  </div>
  </div>
 </div>
 );
};

export default BrandBanners;
