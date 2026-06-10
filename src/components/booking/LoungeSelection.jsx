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
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Scanning geographic grid...</span>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center shadow-sm">
          <Scissors size={40} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-sm font-black text-gray-400 uppercase">No Service Lounges Found</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Try expanding your search radius or selecting a different city.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {searchResults.map((result, index) => {
            const prov = result.provider;
            const hasServices = result.services?.length || 0;
            const isSelected = selectedResult?.provider?._id === prov._id;
            
            return (
              <div 
                key={prov._id || index}
                onClick={() => {
                  setSelectedResult(result);
                  setSelectedServices([]); // Clear prior services
                  setSelectedSlot(null);
                  setSelectedStaff(null);
                  setSlots([]);
                  setTimeout(() => {
                    servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 150);
                }}
                className={`bg-white rounded-3xl border text-left overflow-hidden transition-all duration-300 group flex flex-col cursor-pointer ${
                  isSelected 
                    ? 'border-primary ring-4 ring-primary/5 shadow-xl bg-pink-50/[0.01]'
                    : 'border-gray-150 shadow-sm hover:shadow-md hover:border-gray-200'
                }`}
              >
                {/* Card cover image */}
                <div className="relative h-44 bg-gray-100 overflow-hidden flex items-center justify-center">
                  {result.services?.[0]?.images?.[0]?.url ? (
                    <img 
                      src={result.services[0].images[0].url} 
                      alt={prov.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Scissors size={28} className="text-primary" />
                    </div>
                  )}
                  
                  {/* Rating badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100">
                    <span className="text-[9px] font-black text-gray-800">{prov.rating || 5.0}</span>
                    <Star size={9} className="fill-yellow-400 text-yellow-400" />
                  </div>

                  {/* Distance Tag */}
                  <span className="absolute top-3 right-3 text-[8px] font-black text-white uppercase bg-black/60 backdrop-blur-md px-2 py-1 rounded-md">
                    {(prov.distance / 1000).toFixed(1)} KM Away
                  </span>
                </div>

                {/* Card Content details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-800 uppercase truncate">
                      {prov.businessName}
                    </h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase mt-1 truncate">
                      {prov.address}, {prov.city}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                    <span className="text-[9px] font-black text-primary uppercase bg-primary/5 border border-primary/10 px-2 py-1 rounded-md inline-block">
                      {hasServices} Services
                    </span>
                    <span className="text-[10px] font-black text-primary uppercase flex items-center gap-0.5">
                      {isSelected ? (
                        <>Selected <Check size={12} /></>
                      ) : (
                        <>View Catalog <ChevronRight size={12} /></>
                      )}
                    </span>
                  </div>
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
