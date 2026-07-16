import React from 'react';
import { Info, Loader2, ShieldCheck } from 'lucide-react';

const DateTimeSlotSelector = ({
  selectedResult,
  selectedServices,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  selectedStaff,
  setSelectedStaff,
  slots,
  slotsLoading,
  scheduleRef
}) => {
  // Get next 7 dates for schedule picker
  const getNext7Days = () => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      dates.push({
        dateString,
        dayNum: d.getDate(),
        dayName: days[d.getDay()],
        monthName: months[d.getMonth()]
      });
    }
    return dates;
  };

  // Helper to format ISO time string to only time (e.g. 03:30 AM)
  const formatSlotTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div ref={scheduleRef} className="space-y-6 scroll-mt-24">
      <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
        <h2 className="text-base md:text-lg font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <span className="bg-primary text-white w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold">3</span>
          Choose Date & Time Slot
        </h2>
      </div>

      {!selectedResult || selectedServices.length === 0 ? (
        <div className="py-16 bg-white rounded-3xl border border-gray-150 flex flex-col items-center justify-center text-center p-6 shadow-sm">
          <Info size={32} className="text-gray-300 mb-3" />
          <p className="text-xs font-black text-gray-400 uppercase">Services Selection Pending</p>
          <p className="text-[9px] text-gray-455 font-bold uppercase mt-1">Please select a lounge and at least one service above to view slots.</p>
        </div>
      ) : (
        <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-150 shadow-sm">
          
          {/* Date scroller header */}
          <div className="space-y-2">
            <span className="text-sm font-black uppercase text-gray-400">Select Date</span>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {getNext7Days().map((d) => {
                const isSel = selectedDate === d.dateString;
                return (
                  <button 
                    key={d.dateString}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d.dateString);
                      setSelectedSlot(null);
                      setSelectedStaff(null);
                    }}
                    className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105' 
                        : 'bg-gray-50 text-gray-455 border border-transparent hover:border-gray-250 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-[8px] font-black uppercase opacity-85">{d.monthName}</span>
                    <span className="text-lg font-black">{d.dayNum}</span>
                    <span className="text-[8px] font-bold uppercase opacity-75">{d.dayName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Time Slots Grid */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <span className="text-sm font-black uppercase text-gray-400 block">Available Slots</span>
            
            {slotsLoading ? (
              <div className="py-12 bg-white rounded-3xl flex flex-col items-center justify-center text-center p-6">
                <Loader2 size={28} className="animate-spin text-primary mb-2" />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Scanning available calendar slots...</span>
              </div>
            ) : slots && slots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {slots.map((slot, idx) => {
                  const stylistRestricted = selectedStaff && 
                    (!slot.availableStaff || !slot.availableStaff.some(st => st?._id === selectedStaff._id));
                  
                  const isAvail = slot.isAvailable !== false && !stylistRestricted;
                  const isSel = selectedSlot?.startTime === slot.startTime;

                  return (
                    <button 
                      key={idx}
                      type="button"
                      disabled={!isAvail}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-4 px-2 rounded-2xl text-sm font-black uppercase border-2 text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-1 ${
                        isSel 
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-[1.02]' 
                          : isAvail
                          ? 'bg-white border-gray-150 text-gray-700 hover:border-gray-300 hover:scale-[1.01]'
                          : 'bg-gray-100 border-transparent text-gray-350 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span className="leading-none">{formatSlotTime(slot.startTime)} - {formatSlotTime(slot.endTime)}</span>
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase leading-none mt-1 ${
                        isSel 
                          ? 'bg-white/20 text-white' 
                          : isAvail
                          ? 'bg-green-50 text-green-500'
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isAvail ? 'Available' : 'Booked'}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 bg-white rounded-3xl text-center text-gray-400 text-xs font-bold uppercase border border-gray-150">
                No Time Slots Available for this Service on this Date
              </div>
            )}
          </div>

          {/* instant confirmation status */}
          <div className="p-4 bg-green-50/50 border border-green-100/50 rounded-2xl flex items-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-green-700 uppercase leading-none mb-1">
                Instant Confirmation
              </p>
              <p className="text-[8px] font-extrabold text-green-600/75 uppercase leading-none">
                No pre-payment required. Pay at the salon after service.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default DateTimeSlotSelector;
