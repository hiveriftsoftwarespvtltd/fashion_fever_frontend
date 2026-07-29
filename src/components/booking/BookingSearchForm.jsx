import React from 'react';
import { MapPin, Search, ChevronDown, Edit3, Navigation, Loader2 } from 'lucide-react';

const BookingSearchForm = ({
  city,
  setCity,
  maxDistanceKm,
  setMaxDistanceKm,
  searchingLocation,
  detectLocation,
  handleSearchClick,
  loading,
  onOpenLeadModal
}) => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left Column: Search Form Card (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <form onSubmit={handleSearchClick} className="w-full space-y-3">
            
            {/* Top Labels & Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-left">
              
              {/* City Input */}
              <div className="sm:col-span-7">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Enter City <span className="text-gray-400 font-normal">(e.g. Gorakhpur)</span>
                </label>
                <div className="relative flex items-center">
                  <MapPin size={18} className="absolute left-3.5 text-[#ff4d6d]" />
                  <input
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-[#ff4d6d] transition-all"
                  />
                </div>
              </div>

              {/* Radius Dropdown */}
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Search Radius
                </label>
                <div className="relative flex items-center">
                  <select
                    value={maxDistanceKm}
                    onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-[#ff4d6d] appearance-none cursor-pointer"
                  >
                    <option value={10}>10 KM</option>
                    <option value={25}>25 KM</option>
                    <option value={50}>50 KM</option>
                    <option value={100}>100 KM</option>
                    <option value={110}>110 KM</option>
                    <option value={150}>150 KM</option>
                    <option value={200}>200 KM</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 text-gray-500 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Find Lounges & GPS Detector Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => detectLocation && detectLocation(false)}
                disabled={searchingLocation}
                className="p-3 bg-pink-50 border border-pink-200 text-[#ff4d6d] hover:bg-[#ff4d6d] hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50"
                title="Detect Current GPS Location"
              >
                {searchingLocation ? (
                  <Loader2 size={18} className="animate-spin text-[#ff4d6d]" />
                ) : (
                  <Navigation size={18} />
                )}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#ff4d6d] hover:bg-[#e63956] text-white px-10 py-3 rounded-xl font-extrabold text-sm transition-all shadow-md shadow-pink-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Search size={16} /> Find Lounges
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Custom Requirements Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#fff0f4] p-5 sm:p-6 rounded-3xl border border-pink-100 flex flex-col justify-between text-left">
          
          <div className="flex gap-3.5 items-start mb-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-pink-200 shadow-2xs">
              <Edit3 size={18} className="text-[#ff4d6d]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#ff4d6d] mb-1">
                Custom Requirements
              </h3>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                Can't find a matching Lounge or Service nearby? Post your requirement details, budget, and location. Let verified service providers send you customized quotes!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenLeadModal}
            className="w-full bg-white border border-[#ff4d6d] text-[#ff4d6d] hover:bg-pink-50 rounded-xl py-2.5 px-4 text-xs font-extrabold transition-all cursor-pointer shadow-2xs mt-2"
          >
            Request Custom Service
          </button>

        </div>

      </div>
    </div>
  );
};

export default BookingSearchForm;
