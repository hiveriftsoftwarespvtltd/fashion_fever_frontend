import React from 'react';
import { Loader2, Scissors, Star, Check, ChevronRight } from 'lucide-react';

const LoungeSelection = ({
  loading,
  searchResults,
  selectedResult,
  setSelectedResult,
  setSelectedServices,
  setSelectedSlot,
  setSelectedStaff,
  setSlots,
  servicesRef
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
        <h2 className="text-base md:text-lg font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <span className="bg-primary text-white w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold">1</span>
          Select a Lounge ({searchResults.length})
        </h2>
      </div>

      {loading ? (
        <div className="py-24 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center shadow-sm">
          <Loader2 size={36} className="animate-spin text-primary mb-3" />
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Scanning geographic grid...</span>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center shadow-sm">
          <Scissors size={40} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-sm font-black text-gray-400 uppercase">No Service Lounges Found</h3>
          <p className="text-sm text-gray-400 font-bold uppercase mt-1">Try expanding your search radius or selecting a different city.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {searchResults.map((result, index) => {
            const prov = result.provider;
            const hasServices = result.services?.length || 0;
            const isSelected = selectedResult?.provider?._id === prov._id;
            
            return (
              <div 
                key={prov._id || index}
                onClick={() => {
                  setSelectedResult(result);
                  setSelectedServices([]);
                  setSelectedSlot(null);
                  setSelectedStaff(null);
                  setSlots([]);
                }}
                className={`bg-white p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 group flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected 
                    ? 'border-[#ff4d6d] ring-2 ring-[#ff4d6d]/10 bg-pink-50/20 shadow-md'
                    : 'border-gray-150 shadow-2xs hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {/* Left: Thumbnail & Main Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                    {result.services?.[0]?.images?.[0]?.url ? (
                      <img 
                        src={result.services[0].images[0].url} 
                        alt={prov.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Scissors size={24} className="text-gray-400" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    {/* Header Row: Title, Rating, Distance, Heart */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-gray-900 truncate">
                        {prov.businessName}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#ff4d6d] bg-pink-50 px-1.5 py-0.5 rounded-md">
                        <Star size={11} className="fill-[#ff4d6d] text-[#ff4d6d]" />
                        <span>{prov.rating || 5}</span>
                      </div>

                      <span className="text-[11px] font-medium text-gray-400">
                        {(prov.distance ? (prov.distance / 1000).toFixed(1) : '10.0')} KM Away
                      </span>
                    </div>

                    {/* Address Subtitle */}
                    <p className="text-xs text-gray-500 font-medium truncate">
                      {prov.businessName} {prov.address || 'Address'}, {prov.city || 'Delhi'}
                    </p>

                    {/* Services Count Tag */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 pt-0.5">
                      <Scissors size={12} className="text-gray-400" />
                      <span>{hasServices} Services</span>
                    </div>
                  </div>
                </div>

                {/* Right: View Catalog Button */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected 
                        ? 'bg-[#ff4d6d] border-[#ff4d6d] text-white shadow-xs' 
                        : 'border-[#ff4d6d] text-[#ff4d6d] hover:bg-pink-50'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'View Catalog'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoungeSelection;
