import React from 'react';
import { MapPin, Loader2, Search, Navigation } from 'lucide-react';

const BookingSearchForm = ({
  city,
  setCity,
  maxDistanceKm,
  setMaxDistanceKm,
  searchingLocation,
  detectLocation,
  handleSearchClick,
  loading
}) => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 -mt-8">
      <form 
        onSubmit={handleSearchClick} 
        className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xl flex flex-col lg:flex-row gap-4 items-stretch lg:items-center"
      >
        {/* City search */}
        <div className="flex-1 relative flex items-center">
          <MapPin size={18} className="absolute left-4 text-primary" />
          <input 
            type="text" 
            placeholder="Enter City (e.g. Gorakhpur)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-150 rounded-2xl text-xs font-bold uppercase outline-none focus:bg-white focus:border-primary/30 transition-all text-gray-700"
          />
        </div>

        {/* Distance slider / display */}
        <div className="w-full lg:w-72 px-2 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-1.5 text-[9px] font-black uppercase text-gray-400">
            <span>Search Radius</span>
            <span className="text-primary font-bold">{maxDistanceKm} KM</span>
          </div>
          <input 
            type="range"
            min="5"
            max="300"
            step="5"
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
          />
        </div>

        {/* Search buttons */}
        <div className="flex gap-2 w-full lg:w-auto">
          <button 
            type="button"
            onClick={() => detectLocation(false)}
            disabled={searchingLocation}
            className="p-3.5 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all cursor-pointer flex items-center justify-center flex-shrink-0 disabled:opacity-55"
            title="Detect GPS Location"
          >
            {searchingLocation ? (
              <Loader2 size={16} className="animate-spin text-primary" />
            ) : (
              <Navigation size={16} />
            )}
          </button>

          <button 
            type="submit"
            disabled={loading}
            className="flex-1 lg:flex-none bg-primary hover:bg-primary/95 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-55"
          >
            <Search size={14} /> Find Lounges
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingSearchForm;
