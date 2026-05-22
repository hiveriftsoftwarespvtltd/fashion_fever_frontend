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
import toast from 'react-hot-toast';

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState('2024-05-15');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [location, setLocation] = useState('HSR Layout, Bangalore');

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

  const handleBooking = () => {
    if (!selectedSalon) {
      toast.error('Please select a salon first!');
      return;
    }
    if (!selectedSlot) {
      toast.error('Please select an available time slot!');
      return;
    }
    toast.success(`Booking confirmed at ${selectedSalon.name} for ${selectedDate} at ${selectedSlot}!`);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-outfit">
      
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tight mb-4">
            Book Your Service
          </h1>
          <p className="text-xs lg:text-sm text-gray-500 font-bold uppercase tracking-wider mb-8">
            Professional beauty services at your doorstep or our nearest lounge.
          </p>
          
          <div className="flex flex-col sm:flex-row bg-gray-50 p-2.5 rounded-2xl gap-2.5 border border-gray-100 max-w-2xl mx-auto shadow-inner">
            <div className="flex-grow relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <input 
                type="text" 
                placeholder="Your Location" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-xl font-bold text-xs uppercase tracking-wider outline-none shadow-sm focus:border-primary/20 transition-all text-gray-700" 
              />
            </div>
            <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20 cursor-pointer">
              <Search size={14} /> Find Salons
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="container mx-auto px-4 max-w-[1600px] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          
          {/* Salon Listing */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black uppercase tracking-wider text-gray-800 flex items-center gap-2.5">
                Nearby Salons 
                <span className="bg-primary/10 text-primary text-[9px] font-black tracking-widest px-2.5 py-1 rounded-lg uppercase">
                  Top Rated
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {salons.map((salon) => {
                const isSelected = selectedSalon?.id === salon.id;
                return (
                  <div 
                    key={salon.id} 
                    className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 group ${
                      isSelected 
                        ? 'border-primary shadow-xl ring-2 ring-primary/5 bg-primary/[0.01]' 
                        : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-50">
                      <img 
                        src={salon.image} 
                        alt={salon.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <span className="text-[10px] font-black text-gray-800">{salon.rating}</span>
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <div className="p-6 text-left">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-extrabold text-gray-800 uppercase tracking-tight truncate max-w-[170px]">
                          {salon.name}
                        </h3>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-md">
                          <Navigation size={9} /> {salon.distance}
                        </span>
                      </div>
                      <p className="text-gray-400 text-[10px] font-black uppercase mb-6 flex items-center gap-1.5">
                        <MapPin size={12} className="text-gray-300" /> {salon.location}
                      </p>
                      
                      <button 
                        onClick={() => setSelectedSalon(salon)}
                        className={`w-full py-3 rounded-xl font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-primary text-white shadow-md shadow-primary/10' 
                            : 'border-2 border-primary/25 hover:border-primary text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Selected Salon' : 'Select Salon'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking Summary / Slot Picker */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-xl sticky top-[100px] lg:top-[120px] text-left">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 mb-6 pb-3 border-b border-gray-50 flex items-center gap-2">
                <CalendarIcon size={16} className="text-primary" /> Select Slot
              </h2>
              
              {/* Salon info if selected */}
              {selectedSalon && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Selected Location</span>
                  <p className="text-xs font-black text-gray-800 uppercase tracking-tight truncate">{selectedSalon.name}</p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">{selectedSalon.location}</p>
                </div>
              )}

              {/* Date Picker */}
              <div className="space-y-3 mb-6">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  Choose Date
                </span>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[15, 16, 17, 18, 19].map((d) => (
                    <button 
                      key={d} 
                      onClick={() => setSelectedDate(`2024-05-${d}`)}
                      className={`flex-shrink-0 w-14 h-18 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                        selectedDate === `2024-05-${d}` 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                      }`}
                    >
                      <span className="text-[8px] font-black uppercase tracking-wider">May</span>
                      <span className="text-lg font-black">{d}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Grid */}
              <div className="space-y-3 mb-6">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  Available Slots
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button 
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-1 rounded-lg text-[9px] font-black uppercase border-2 transition-all cursor-pointer text-center ${
                        selectedSlot === slot 
                          ? 'bg-primary border-primary text-white shadow-md shadow-primary/10' 
                          : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirmation Indicator */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3.5 bg-green-50/50 border border-green-100/50 rounded-xl">
                  <ShieldCheck className="text-green-600" size={18} />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-green-600 uppercase tracking-wider leading-none mb-0.5">
                      Instant Confirmation
                    </span>
                    <span className="text-[8px] font-bold text-green-600/70 uppercase tracking-wider">
                      Pay after service
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:shadow-none cursor-pointer" 
                disabled={!selectedSlot || !selectedSalon}
              >
                Confirm Booking <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Booking;
