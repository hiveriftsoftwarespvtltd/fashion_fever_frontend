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
    <div className="space-y-3 pt-4 border-t border-gray-100">
      <div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
          Prefer a Stylist / Therapist?
        </h3>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">
          Select a stylist, or choose "Any Stylist" for fastest slot allocation
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedStaff(null)}
          className={`shrink-0 px-3.5 py-2.5 rounded-2xl border text-center transition-all cursor-pointer flex items-center gap-2.5 ${
            selectedStaff === null 
              ? 'border-[#ff4d6d] bg-pink-50 text-[#ff4d6d] shadow-2xs' 
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-pink-100/70 flex items-center justify-center text-[#ff4d6d] shrink-0">
            <Users size={16} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-extrabold uppercase leading-tight text-[#ff4d6d]">Any Stylist</p>
            <p className="text-[9px] font-medium text-gray-400 mt-0.5 uppercase">No Preference</p>
          </div>
        </button>

        {allStaff.map(staff => {
          const isSel = selectedStaff?._id === staff._id;
          return (
            <button
              key={staff._id}
              type="button"
              onClick={() => setSelectedStaff(staff)}
              className={`shrink-0 px-3.5 py-2.5 rounded-2xl border text-center transition-all cursor-pointer flex items-center gap-2.5 ${
                isSel 
                  ? 'border-[#ff4d6d] bg-pink-50 text-[#ff4d6d] shadow-2xs' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-pink-100/70 border border-pink-200 flex items-center justify-center text-[#ff4d6d] font-bold uppercase text-xs shrink-0">
                {staff.name?.substring(0, 2)}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-extrabold uppercase leading-tight">{staff.name}</p>
                <p className="text-[9px] font-bold text-gray-400 mt-0.5 flex items-center gap-0.5 uppercase leading-none">
                  <Award size={10} className="text-amber-500" /> {staff.experienceYears || 0} Yrs Exp
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
