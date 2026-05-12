import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  MoreVertical, 
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
      date: "15 May 2024", 
      time: "10:30 AM", 
      service: "Bridal Makeup Trial",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop"
    },
    { 
      id: 2, 
      salon: "Glam & Glow Salon", 
      location: "Koramangala, Bangalore", 
      date: "28 Apr 2024", 
      time: "02:00 PM", 
      service: "Hair Coloring",
      status: "past",
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200&h=200&fit=crop"
    },
  ];

  const filtered = appointments.filter(apt => apt.status === activeFilter);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
           <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-primary">Salon Services</span>
              <h1 className="text-4xl font-bold text-gray-900 uppercase italic">My Appointments</h1>
           </div>
           <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
              <button 
                onClick={() => setActiveFilter('upcoming')}
                className={`px-8 py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeFilter === 'upcoming' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-900'}`}
              >
                 Upcoming
              </button>
              <button 
                onClick={() => setActiveFilter('past')}
                className={`px-8 py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeFilter === 'past' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-gray-900'}`}
              >
                 Past Visits
              </button>
           </div>
        </div>

        <div className="space-y-6">
           {filtered.length > 0 ? filtered.map((apt) => (
             <div key={apt.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center group hover:shadow-2xl transition-all duration-500">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
                   <img src={apt.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   {apt.status === 'past' && (
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <CheckCircle2 className="text-white" size={32} />
                     </div>
                   )}
                </div>
                
                <div className="flex-grow text-center md:text-left space-y-2">
                   <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-[10px] font-bold uppercase text-primary bg-primary/5 px-2 py-0.5 rounded">Confirmed</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">ID: #APT-{apt.id}204</span>
                   </div>
                   <h3 className="text-xl font-bold text-gray-900">{apt.service}</h3>
                   <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                         <Calendar size={14} className="text-primary" /> {apt.date}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                         <Clock size={14} className="text-primary" /> {apt.time}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                         <MapPin size={14} className="text-primary" /> {apt.salon}
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[160px]">
                   {apt.status === 'upcoming' ? (
                     <>
                        <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold uppercase text-[10px] shadow-xl shadow-black/10 flex items-center justify-center gap-2 hover:bg-black transition-all">
                           <Navigation size={12} /> Get Directions
                        </button>
                        <button className="w-full border-2 border-red-50 text-red-500 py-3 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-red-50 transition-all">
                           <XCircle size={12} /> Reschedule
                        </button>
                     </>
                   ) : (
                     <button className="w-full border-2 border-primary text-primary py-3 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                        <Star size={12} /> Leave Review
                     </button>
                   )}
                </div>
             </div>
           )) : (
             <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-gray-200">
                <Calendar size={48} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-xl font-bold text-gray-400 uppercase">No Appointments Found</h3>
                <p className="text-xs font-bold text-gray-300 uppercase mt-2">Time to book your first beauty session!</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
