import React from 'react';
import { Smartphone, MapPin, Gift, HelpCircle } from 'lucide-react';

const TopStrip = () => {
 return (
 <div className="bg-[#fc9bc9] text-[#3f414d] h-[30px] hidden md:flex items-center border-b border-black/5">
  <div className="container flex justify-end items-center">
  {/* Left Side (Message - optional, keeping it clean as per image) */}
  <div className="text-[12px] font-medium">
   {/* You can add a message here if needed */}
  </div>

  {/* Right Side Links */}
  <div className="flex items-center gap-6">
   <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
   <Smartphone size={16} strokeWidth={2} />
   <span className="text-[12px] font-bold">Get App</span>
   </div>
   <div className="w-[1px] h-3 bg-black/10"></div>

   <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
   <MapPin size={16} strokeWidth={2} />
   <span className="text-[12px] font-bold">Store & Events</span>
   </div>
   <div className="w-[1px] h-3 bg-black/10"></div>

   <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
   <Gift size={16} strokeWidth={2} />
   <span className="text-[12px] font-bold">Gift Card</span>
   </div>
   <div className="w-[1px] h-3 bg-black/10"></div>

   <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
   <HelpCircle size={16} strokeWidth={2} />
   <span className="text-[12px] font-bold">Help</span>
   </div>
  </div>
  </div>
 </div>
 );
};

export default TopStrip;
