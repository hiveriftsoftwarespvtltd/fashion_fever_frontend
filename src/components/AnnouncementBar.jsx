import React from 'react';

const AnnouncementBar = () => {
  const message = "SALE IS LIVE! FREE SHIPPING ON ALL ORDERS ABOVE ₹299 • ";

  // Two identical sets so the loop is seamless (translateX -50% = exactly 1 set)
  const items = [...Array(10)].map((_, i) => (
    <span key={i} className="text-[#8b0000] text-[12px] font-bold uppercase px-4 shrink-0">
      {message}
    </span>
  ));

  return (
    <div className="bg-[#fff0f5] py-2 overflow-hidden border-b border-pink-100">
      <div className="animate-marquee whitespace-nowrap">
        {items}
        {/* Duplicate set for seamless infinite loop */}
        {items}
      </div>
    </div>
  );
};

export default AnnouncementBar;
