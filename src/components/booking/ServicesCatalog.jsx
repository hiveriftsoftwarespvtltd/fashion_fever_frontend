import React from 'react';
import { Info, Scissors, Clock, Check } from 'lucide-react';

const ServicesCatalog = ({
  selectedResult,
  selectedServices,
  handleToggleService,
  servicesRef
}) => {
  return (
    <div ref={servicesRef} className="space-y-6 scroll-mt-24">
      <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
        <h2 className="text-base md:text-lg font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <span className="bg-primary text-white w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold">2</span>
          Choose Services
        </h2>
      </div>

      {!selectedResult ? (
        <div className="py-16 bg-white rounded-3xl border border-gray-150 flex flex-col items-center justify-center text-center p-6 shadow-sm">
          <Info size={32} className="text-gray-300 mb-3" />
          <p className="text-xs font-black text-gray-400 uppercase">No Lounge Selected</p>
          <p className="text-[9px] text-gray-405 font-bold uppercase mt-1">Please select a lounge above first to unlock their catalog services.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-primary uppercase">Catalog for {selectedResult.provider.businessName}</p>
              <p className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">Click items to add or remove them from your booking appointment</p>
            </div>
            <span className="text-[10px] font-black text-white bg-primary px-3 py-1 rounded-full uppercase shadow-md shadow-primary/20">
              {selectedResult.services?.length || 0} Available
            </span>
          </div>

          {/* Services list mapping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedResult.services && selectedResult.services.length > 0 ? (
              selectedResult.services.map((service) => {
                const isChecked = selectedServices.some(s => s._id === service._id);
                const price = service.offeredPrice || service.sellingPrice || service.costPrice || 0;
                
                return (
                  <div 
                    key={service._id}
                    onClick={() => handleToggleService(service)}
                    className={`p-4 rounded-3xl border text-left transition-all duration-200 cursor-pointer flex gap-4 items-center bg-white ${
                      isChecked 
                        ? 'border-primary ring-2 ring-primary/5 bg-pink-50/[0.02] shadow-md'
                        : 'border-gray-150 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Service cover thumbnail */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 flex items-center justify-center">
                      {service.images?.[0]?.url ? (
                        <img src={service.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Scissors size={20} className="text-gray-300" />
                      )}
                    </div>

                    {/* Content metadata details */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-xs font-black uppercase truncate ${isChecked ? 'text-primary' : 'text-gray-800'}`}>
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-[9px] text-gray-400 font-medium line-clamp-1 mt-0.5">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2.5 text-[8px] font-black uppercase text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <Clock size={10} className="text-gray-350" /> {service.durationMinutes} Min
                        </span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                          {service.serviceType}
                        </span>
                      </div>
                    </div>

                    {/* Price block & Check indicator */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        {service.costPrice > price && (
                          <span className="text-[9px] text-gray-400 line-through">₹{service.costPrice}</span>
                        )}
                        <span className={`text-xs font-extrabold ${isChecked ? 'text-primary' : 'text-gray-700'}`}>₹{price}</span>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isChecked ? 'bg-primary border-primary text-white shadow-sm' : 'border-gray-300 bg-white'
                      }`}>
                        {isChecked && <Check size={11} />}
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="col-span-2 py-12 bg-white rounded-3xl border border-gray-150 text-center text-gray-400 text-xs font-bold uppercase">
                No Active Services Listed
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesCatalog;
