import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  Navigation,
  Star
} from 'lucide-react';

const MyAppointments = () => {
  const [activeFilter, setActiveFilter] = useState('upcoming');

  const appointments = [
    { 
      id: 1, 
      salon: "Wakeup Beauty Lounge", 
      location: "HSR Layout, Bangalore", 
      date: "15 May 2026", 
      time: "10:30 AM", 
      service: "Bridal Makeup Trial",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop"
    },
    { 
      id: 2, 
      salon: "Glam & Glow Salon", 
      location: "Koramangala, Bangalore", 
      date: "28 Apr 2026", 
      time: "02:00 PM", 
      service: "Hair Coloring Treatment",
      status: "past",
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200&h=200&fit=crop"
    },
  ];

  const filtered = appointments.filter(apt => apt.status === activeFilter);

  return (
    <div className="bg-[#fcfcfc] min-h-screen py-16 font-outfit text-gray-800">
      <div className="container max-w-4xl mx-auto px-4 md:px-6">
        
        {/* Header Block Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6 text-left">
           <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase  text-primary block">Salon Services Pipeline</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase italic ">My Appointments</h1>
           </div>
           
           {/* Modern Switcher Bar */}
           <div className="flex bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm w-full sm:w-auto">
              <button 
                onClick={() => setActiveFilter('upcoming')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase  transition-all duration-300 cursor-pointer ${
                  activeFilter === 'upcoming' 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                    : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                Upcoming Slots
              </button>
              <button 
                onClick={() => setActiveFilter('past')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase  transition-all duration-300 cursor-pointer ${
                  activeFilter === 'past' 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                    : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                Past Visits
              </button>
           </div>
        </div>

        {/* Dynamic Card Container Grid */}
        <div className="space-y-4">
           {filtered.length > 0 ? filtered.map((apt) => (
             <div 
               key={apt.id} 
               className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center group hover:shadow-xl transition-all duration-300"
             >
                {/* Compact Thumbnail Image Area */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 relative shadow-inner border border-gray-50 mx-auto md:mx-0">
                   <img src={apt.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   {apt.status === 'past' && (
                     <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] flex items-center justify-center">
                        <CheckCircle2 className="text-white" size={24} />
                     </div>
                   )}
                </div>
                
                {/* Center Content Metadata Node */}
                <div className="flex-grow text-left space-y-1 w-full">
                   <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[8px] font-bold uppercase  px-2 py-0.5 rounded-md ${
                        apt.status === 'upcoming' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                      }`}>
                         {apt.status === 'upcoming' ? 'Confirmed' : 'Completed'}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-gray-400 uppercase ">ID: #APT-{apt.id}206</span>
                   </div>
                   
                   <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1 uppercase leading-snug">{apt.service}</h3>
                   
                   {/* Parameters Spacing Strip */}
                   <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[10px] font-bold text-gray-400 uppercase ">
                      <div className="flex items-center gap-1">
                         <Calendar size={12} className="text-primary flex-shrink-0" /> 
                         <span className="text-gray-600 font-extrabold">{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <Clock size={12} className="text-primary flex-shrink-0" /> 
                         <span className="text-gray-600 font-extrabold">{apt.time}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate max-w-[200px]">
                         <MapPin size={12} className="text-primary flex-shrink-0" /> 
                         <span className="truncate">{apt.salon}</span>
                      </div>
                   </div>
                </div>

                {/* Right Area Custom Actions Pipeline */}
                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto md:min-w-[150px]">
                   {apt.status === 'upcoming' ? (
                     <>
                        <button className="flex-1 bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-bold uppercase text-[9px]  shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                           <Navigation size={11} /> Directions
                        </button>
                        <button className="flex-1 border border-gray-100 hover:border-red-100 hover:bg-red-50/50 text-gray-400 hover:text-red-500 py-2.5 rounded-xl font-bold uppercase text-[9px]  flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                           Reschedule
                        </button>
                     </>
                   ) : (
                     <button className="w-full border border-primary/20 hover:border-primary text-primary py-2.5 rounded-xl font-bold uppercase text-[9px]  flex items-center justify-center gap-1.5 transition-all hover:bg-primary hover:text-white cursor-pointer shadow-sm shadow-primary/5">
                        <Star size={11} fill="currentColor" /> Leave Review
                     </button>
                   )}
                </div>
             </div>
           )) : (
             /* Empty Placeholder State Grid */
             <div className="bg-white py-20 rounded-3xl text-center border border-dashed border-gray-200 shadow-sm animate-in fade-in duration-300">
                <Calendar size={36} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-sm font-bold text-gray-400 uppercase ">No Logged Sessions</h3>
                <p className="text-[10px] font-bold text-gray-300 uppercase mt-1 ">Time to book your premium beauty service tier!</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
