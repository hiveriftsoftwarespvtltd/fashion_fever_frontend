import React, { useState, useEffect, useRef } from 'react';
import { toast } from '../utils/toast';
import Swal from 'sweetalert2';
import { searchServices, getAvailableSlots, createBooking } from '../api/serviceProviderService';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

// Booking Sub-components
import BookingSearchForm from '../components/booking/BookingSearchForm';
import LoungeSelection from '../components/booking/LoungeSelection';
import ServicesCatalog from '../components/booking/ServicesCatalog';
import StylistSelector from '../components/booking/StylistSelector';
import DateTimeSlotSelector from '../components/booking/DateTimeSlotSelector';
import BookingSummary from '../components/booking/BookingSummary';

const Booking = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [loading, setLoading] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [bookingConfirmLoading, setBookingConfirmLoading] = useState(false);
  
  // Geolocation & Search params
  const [city, setCity] = useState('');
  const [maxDistanceKm, setMaxDistanceKm] = useState(100);
  const [lat, setLat] = useState(28.5245);
  const [lng, setLng] = useState(77.2066);
  const [searchResults, setSearchResults] = useState([]);
  
  // Selection states
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Refs for smooth scrolling
  const servicesRef = useRef(null);
  const scheduleRef = useRef(null);

  // Load initial search on mount
  useEffect(() => {
    detectLocation(true); // Silent detect on mount, fallbacks to Gorakhpur
  }, []);

  // Fetch slots dynamically when selectedResult, selectedServices, or selectedDate changes
  useEffect(() => {
    const fetchSlotsData = async () => {
      if (!selectedResult || selectedServices.length === 0 || !selectedDate) {
        setSlots([]);
        return;
      }
      
      setSlotsLoading(true);
      try {
        const providerId = selectedResult.provider._id;
        const serviceId = selectedServices[0]._id; // Use the first selected service
        const res = await getAvailableSlots(providerId, serviceId, selectedDate);
        
        const unpacked = res?.data?.data ?? res?.data ?? res;
        if (Array.isArray(unpacked)) {
          setSlots(unpacked);
        } else {
          setSlots([]);
        }
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setSlots([]);
        toast.error("Failed to load time slots.");
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlotsData();
  }, [selectedResult, selectedServices, selectedDate]);

  const detectLocation = (isSilent = false) => {
    if (!navigator.geolocation) {
      if (!isSilent) toast.error("Geolocation is not supported by your browser");
      handleSearch(lat, lng, city, maxDistanceKm);
      return;
    }
    
    if (!isSilent) setSearchingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        setLat(uLat);
        setLng(uLng);
        if (!isSilent) {
          setSearchingLocation(false);
          toast.success("Location retrieved successfully!");
        }
        handleSearch(uLat, uLng, city, maxDistanceKm);
      },
      (error) => {
        console.error("Geolocation retrieval error:", error);
        if (!isSilent) {
          setSearchingLocation(false);
          toast.error("Location permission denied. Searching by city default.");
        }
        handleSearch(lat, lng, city, maxDistanceKm);
      },
      { timeout: 8000 }
    );
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    handleSearch(lat, lng, city, maxDistanceKm);
  };

  const handleSearch = async (sLat, sLng, sCity, sDist) => {
    setLoading(true);
    try {
      const res = await searchServices({
        lat: sLat,
        lng: sLng,
        maxDistanceKm: sDist,
        city: sCity
      });

      const unpacked = res?.data?.data ?? res?.data ?? res;
      if (Array.isArray(unpacked)) {
        setSearchResults(unpacked);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search API error:", err);
      toast.error("Failed to fetch nearby salons.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle service selection
  const handleToggleService = (service) => {
    setSelectedServices(prev => {
      const exists = prev.some(s => s._id === service._id);
      let updated;
      if (exists) {
        updated = prev.filter(s => s._id !== service._id);
      } else {
        updated = [...prev, service];
      }

      // Smooth scroll to schedule if first service added
      if (updated.length === 1 && prev.length === 0) {
        setTimeout(() => {
          scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
      return updated;
    });
    setSelectedSlot(null);
    setSelectedStaff(null);
  };


  const calculateTotal = () => {
    return selectedServices.reduce((sum, s) => {
      const price = s.offeredPrice || s.sellingPrice || s.costPrice || 0;
      return sum + price;
    }, 0);
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please log in or register to book an appointment.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EC4899',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Login Now',
        borderRadius: '24px',
        customClass: {
          popup: 'rounded-3xl border border-gray-100 shadow-xl',
          confirmButton: 'rounded-xl font-bold uppercase text-xs px-6 py-3 text-white cursor-pointer shadow-md shadow-primary/20',
          cancelButton: 'rounded-xl font-bold uppercase text-xs px-6 py-3 cursor-pointer'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/auth?redirect=/booking');
        }
      });
      return;
    }

    if (!selectedResult || selectedServices.length === 0 || !selectedSlot) {
      toast.error("Missing booking selection details.");
      return;
    }

    const serviceId = selectedServices[0]._id;
    const staffId = selectedStaff?._id || selectedSlot?.availableStaff?.[0]?._id;
    if (!staffId) {
      toast.error("No stylist/staff available for the selected slot.");
      return;
    }

    const serviceAddress = [selectedResult.provider?.address, selectedResult.provider?.city].filter(Boolean).join(', ') || 'Delhi';

    const payload = {
      serviceId,
      staffId,
      bookingDate: selectedDate,
      slotStartTime: selectedSlot.startTime,
      serviceAddress
    };

    setBookingConfirmLoading(true);
    try {
      const response = await createBooking(payload);
      const unpacked = response?.data?.data ?? response?.data ?? response;
      
      if (response.success || unpacked?.success) {
        const salonName = selectedResult.provider?.businessName || 'Beauty Lounge';
        const total = calculateTotal();
        const serviceTitles = selectedServices.map(s => s.title).join(', ');
        const staffName = selectedStaff ? selectedStaff.name : (selectedSlot?.availableStaff?.find(st => st._id === staffId)?.name || 'Any Available Stylist');

        Swal.fire({
          title: 'Appointment Booked!',
          html: `
            <div class="text-left text-xs space-y-3 font-outfit uppercase tracking-wider text-gray-600">
              <p><strong class="text-gray-800">Salon:</strong> ${salonName}</p>
              <p><strong class="text-gray-800">Services:</strong> ${serviceTitles}</p>
              <p><strong class="text-gray-800">Stylist:</strong> ${staffName}</p>
              <p><strong class="text-gray-800">Schedule:</strong> ${selectedDate} at ${selectedSlot.startTime}</p>
              <p><strong class="text-gray-800">Amount Due:</strong> ₹${total} (Pay after service)</p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#EC4899',
          confirmButtonText: 'Great, Thank You!',
          background: '#FFFFFF',
          color: '#1F2937',
          borderRadius: '24px',
          customClass: {
            popup: 'rounded-3xl border border-gray-100 shadow-xl',
            confirmButton: 'rounded-xl font-bold uppercase text-xs px-6 py-3 text-white cursor-pointer shadow-md shadow-primary/20'
          }
        });

        // Reset selection state
        setSelectedResult(null);
        setSelectedServices([]);
        setSelectedSlot(null);
        setSelectedStaff(null);
        setSlots([]);
      } else {
        Swal.fire({
          title: 'Booking Failed',
          text: response.message || 'Failed to create booking. Please try again.',
          icon: 'error',
          confirmButtonColor: '#EC4899',
          borderRadius: '24px',
          customClass: {
            popup: 'rounded-3xl border border-gray-100 shadow-xl',
            confirmButton: 'rounded-xl font-bold uppercase text-xs px-6 py-3 text-white cursor-pointer shadow-md'
          }
        });
      }
    } catch (err) {
      console.error("Booking API execution error:", err);
      toast.error("Something went wrong while confirming your booking.");
    } finally {
      setBookingConfirmLoading(false);
    }
  };  return (
    <div className="bg-gray-50 min-h-screen font-outfit text-gray-800 pb-24 lg:pb-12 text-left">
      
      {/* Premium Header Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 py-16 px-4 shadow-md text-white text-center">
        <div className="max-w-[1600px] mx-auto space-y-4">
          <span className="text-[10px] font-black tracking-widest bg-white/20 px-3 py-1 rounded-full uppercase">
            Instantly Confirmed Appointments
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            Book Beauty Services
          </h1>
          <p className="text-xs md:text-sm text-white/80 font-bold uppercase tracking-wider">
            Discover nearby salons, select premium stylists & pay after service.
          </p>
        </div>
      </div>

      {/* Geolocation Search Form block */}
      <BookingSearchForm
        city={city}
        setCity={setCity}
        maxDistanceKm={maxDistanceKm}
        setMaxDistanceKm={setMaxDistanceKm}
        searchingLocation={searchingLocation}
        detectLocation={detectLocation}
        handleSearchClick={handleSearchClick}
        loading={loading}
      />

      {/* Main Content Layout Grid (1600px Max Width Container) */}
      <div className="max-w-[1600px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          
          {/* LEFT COLUMN: Open, comprehensive listings */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Section 1: Lounge selection */}
            <LoungeSelection
              loading={loading}
              searchResults={searchResults}
              selectedResult={selectedResult}
              setSelectedResult={setSelectedResult}
              setSelectedServices={setSelectedServices}
              setSelectedSlot={setSelectedSlot}
              setSelectedStaff={setSelectedStaff}
              setSlots={setSlots}
              servicesRef={servicesRef}
            />

            {/* Section 2: Services Catalogue & Stylist Preferences */}
            <div className="space-y-6">
              <ServicesCatalog
                selectedResult={selectedResult}
                selectedServices={selectedServices}
                handleToggleService={handleToggleService}
                servicesRef={servicesRef}
              />
              
              <StylistSelector
                slotsLoading={slotsLoading}
                slots={slots}
                selectedStaff={selectedStaff}
                setSelectedStaff={setSelectedStaff}
              />
            </div>

            {/* Section 3: Schedule Date & Slots */}
            <DateTimeSlotSelector
              selectedResult={selectedResult}
              selectedServices={selectedServices}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              selectedStaff={selectedStaff}
              setSelectedStaff={setSelectedStaff}
              slots={slots}
              slotsLoading={slotsLoading}
              scheduleRef={scheduleRef}
            />

          </div>

          {/* RIGHT COLUMN: Sticky Checkout Card (Displays selection and final checkout action) */}
          <div className="space-y-6">
            <BookingSummary
              selectedResult={selectedResult}
              selectedServices={selectedServices}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              selectedStaff={selectedStaff}
              calculateTotal={calculateTotal}
              handleConfirmBooking={handleConfirmBooking}
              bookingConfirmLoading={bookingConfirmLoading}
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default Booking;
