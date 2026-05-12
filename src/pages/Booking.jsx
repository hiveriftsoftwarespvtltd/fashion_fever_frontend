import React, { useState } from 'react';
import { 
 Calendar as CalendarIcon, 
 Clock, 
 MapPin, 
 ChevronRight, 
 Star, 
 ShieldCheck,
 Search,
 Navigation
} from 'lucide-react';

const Booking = () => {
 const [selectedDate, setSelectedDate] = useState('2024-05-15');
 const [selectedSlot, setSelectedSlot] = useState(null);

 const salons = [
 { 
  id: 1, 
  name: "Wakeup Beauty Lounge", 
  location: "HSR Layout, Bangalore", 
  distance: "1.2 km", 
  rating: 4.9, 
  image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop" 
 },
 { 
  id: 2, 
  name: "Glam & Glow Salon", 
  location: "Koramangala, Bangalore", 
  distance: "3.5 km", 
  rating: 4.7, 
  image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop" 
 }
 ];

 const slots = [
 "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", 
 "11:30 AM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
 "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"
 ];

 return (
 <div className="bg-gray-50 min-h-screen">
  {/* Search Header */}
  <div className="bg-white border-b border-gray-100 py-12">
  <div className="container text-center max-w-2xl">
   <h1 className="text-4xl font-bold text-gray-900 uppercase  mb-4">Book Your Service</h1>
   <p className="text-gray-500 font-medium mb-8">Professional beauty services at your doorstep or our nearest lounge.</p>
   <div className="flex bg-gray-100 p-2 rounded-2xl gap-2 shadow-inner">
   <div className="flex-grow relative">
    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
    <input type="text" placeholder="Your Location" className="w-full pl-12 pr-4 py-4 bg-white rounded-xl font-bold text-sm outline-none shadow-sm" defaultValue="HSR Layout, Bangalore" />
   </div>
   <button className="bg-primary text-white px-8 rounded-xl font-bold uppercase text-xs flex items-center gap-2 hover:bg-primary-hover transition-all">
    <Search size={18} /> Find Salons
   </button>
   </div>
  </div>
  </div>

  <div className="container py-12">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
   
   {/* Salon Listing */}
   <div className="lg:col-span-2 space-y-8">
   <h2 className="text-xl font-bold uppercase  flex items-center gap-2">
    Nearby Salons <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-full uppercase">Top Rated</span>
   </h2>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {salons.map((salon) => (
    <div key={salon.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
     <div className="relative h-48 overflow-hidden">
      <img src={salon.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1">
       <span className="text-xs font-bold text-gray-800">{salon.rating}</span>
       <Star size={12} className="fill-yellow-400 text-yellow-400" />
      </div>
     </div>
     <div className="p-6">
      <div className="flex items-center justify-between mb-2">
       <h3 className="text-lg font-bold text-gray-800 ">{salon.name}</h3>
       <span className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
       <Navigation size={10} /> {salon.distance}
       </span>
      </div>
      <p className="text-gray-400 text-xs font-bold uppercase mb-6 flex items-center gap-2">
       <MapPin size={14} /> {salon.location}
      </p>
      <button className="w-full border-2 border-primary text-primary py-3 rounded-xl font-bold uppercase text-xs hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5">
       Select Salon
      </button>
     </div>
    </div>
    ))}
   </div>
   </div>

   {/* Booking Summary / Slot Picker */}
   <div className="space-y-8">
   <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl sticky top-24">
    <h2 className="text-xl font-bold uppercase  mb-8">Select Slot</h2>
    
    {/* Date Picker (Mock) */}
    <div className="space-y-4 mb-8">
     <span className="text-[10px] font-bold text-gray-400 uppercase ">Choose Date</span>
     <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {[15, 16, 17, 18, 19].map((d) => (
      <button 
       key={d} 
       onClick={() => setSelectedDate(`2024-05-${d}`)}
       className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${selectedDate === `2024-05-${d}` ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
      >
       <span className="text-[10px] font-bold uppercase ">May</span>
       <span className="text-xl font-bold">{d}</span>
      </button>
      ))}
     </div>
    </div>

    {/* Time Slot Grid */}
    <div className="space-y-4 mb-8">
     <span className="text-[10px] font-bold text-gray-400 uppercase ">Available Slots</span>
     <div className="grid grid-cols-3 gap-2">
      {slots.map((slot) => (
      <button 
       key={slot}
       onClick={() => setSelectedSlot(slot)}
       className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase border-2 transition-all ${selectedSlot === slot ? 'bg-primary border-primary text-white' : 'border-gray-50 text-gray-400 hover:border-gray-100'}`}
      >
       {slot}
      </button>
      ))}
     </div>
    </div>

    {/* Features */}
    <div className="space-y-4 mb-8">
     <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
      <ShieldCheck className="text-green-600" size={20} />
      <div className="flex flex-col">
      <span className="text-[10px] font-bold text-green-600 uppercase leading-tight">Instant Confirmation</span>
      <span className="text-[8px] font-bold text-green-600/70 uppercase">Pay after service</span>
      </div>
     </div>
    </div>

    <button className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase text-sm shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:bg-primary-hover transition-all disabled:opacity-50 disabled:shadow-none" disabled={!selectedSlot}>
     Confirm Booking <ChevronRight size={18} />
    </button>
   </div>
   </div>

  </div>
  </div>
 </div>
 );
};

export default Booking;
