import React from 'react';
import { Loader2, Users, Award } from 'lucide-react';

const StylistSelector = ({
  slotsLoading,
  slots,
  selectedStaff,
  setSelectedStaff
}) => {
  if (slotsLoading) {
    return (
      <div className="py-4 border-t border-gray-200/60 flex items-center justify-center">
        <Loader2 size={16} className="animate-spin text-primary mr-2" />
        <span className="text-[9px] font-black text-gray-455 uppercase">Loading Stylist roster...</span>
      </div>
    );
  }

  if (!slots || slots.length === 0) return null;

  // Extract unique staff from slot details
  const allStaff = [];
  slots.forEach(slot => {
    if (slot.availableStaff) {
      slot.availableStaff.forEach(st => {
        if (!allStaff.some(item => item._id === st._id)) {
          allStaff.push(st);
        }
      });
    }
  });

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200/60">
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">
          Prefer a Stylist / Therapist?
        </h3>
        <p className="text-[10px] text-gray-455 font-bold uppercase mt-0.5">
          Select a stylist, or choose "Any Stylist" for fastest slot allocation
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedStaff(null)}
          className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center gap-2.5 ${
            selectedStaff === null 
              ? 'border-primary bg-primary/5 text-primary' 
              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Users size={15} />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black uppercase leading-tight">Any Stylist</p>
            <p className="text-[8px] font-medium text-gray-400 mt-0.5 uppercase">No Preference</p>
          </div>
        </button>

        {allStaff.map(staff => {
          const isSel = selectedStaff?._id === staff._id;
          return (
            <button
              key={staff._id}
              type="button"
              onClick={() => setSelectedStaff(staff)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center gap-3 ${
                isSel 
                  ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-150 flex items-center justify-center text-primary font-black uppercase text-[10px]">
                {staff.name?.substring(0, 2)}
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase leading-none">{staff.name}</p>
                <p className="text-[8px] font-bold text-gray-400 mt-0.5 flex items-center gap-0.5 uppercase leading-none">
                  <Award size={9} className="text-amber-500" /> {staff.experienceYears || 0} Yrs Exp
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StylistSelector;
