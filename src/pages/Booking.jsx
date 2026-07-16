import React, { useState, useEffect, useRef } from 'react';
import { toast } from '../utils/toast';
import Swal from 'sweetalert2';
import { searchServices, getAvailableSlots, createBooking, createServiceLead } from '../api/serviceProviderService';
import { getAllServiceCategories } from '../api/adminService';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';

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

  // Custom Lead Modal state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  
  // Custom Lead form state
  const [leadRequirement, setLeadRequirement] = useState('');
  const [leadBudget, setLeadBudget] = useState('');
  const [leadPreferredDate, setLeadPreferredDate] = useState('');
  const [leadAddress, setLeadAddress] = useState('');
  const [leadPincode, setLeadPincode] = useState('');
  const [leadCity, setLeadCity] = useState('');
  const [leadState, setLeadState] = useState('');
  const [leadQuantity, setLeadQuantity] = useState(1);
  const [leadPhoneNumber, setLeadPhoneNumber] = useState('');
  const [leadGender, setLeadGender] = useState('FEMALE');
  const [leadSelectedCategories, setLeadSelectedCategories] = useState([]);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

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
        const serviceIds = selectedServices.map(s => s._id);
        const res = await getAvailableSlots(providerId, serviceIds, selectedDate);
        
        const unpacked = res?.data?.data ?? res?.data ?? res;
        const slotsArray = unpacked?.slots ?? (Array.isArray(unpacked) ? unpacked : []);
        setSlots(slotsArray);
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

    const items = selectedServices.map(s => ({ serviceId: s._id }));
    const staffId = selectedStaff?._id || selectedSlot?.availableStaff?.[0]?._id;
    if (!staffId) {
      toast.error("No stylist/staff available for the selected slot.");
      return;
    }

    const serviceProviderId = selectedResult.provider?._id;
    const serviceAddress = [selectedResult.provider?.address, selectedResult.provider?.city].filter(Boolean).join(', ') || 'Delhi';

    const payload = {
      items,
      staffId,
      serviceProviderId,
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
  };

  const handleOpenLeadModal = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please log in or register to request custom services.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EC4899',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Login Now',
        customClass: {
          popup: 'rounded-3xl font-outfit'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/auth?redirect=/booking');
        }
      });
      return;
    }
    
    setIsLeadModalOpen(true);
    setCategoriesLoading(true);
    
    const fallbackCategories = [
      { _id: '6a2111c512726baf686d344d', label: 'Makeup', name: 'Makeup' },
      { _id: '6a21210d12726baf686d344f', label: 'Hair Care', name: 'Hair Care' },
      { _id: '6a2130e512726baf686d3451', label: 'Skin Care', name: 'Skin Care' },
      { _id: '6a2131fa12726baf686d3453', label: 'Nail Care', name: 'Nail Care' },
      { _id: '6a2133ea12726baf686d3455', label: 'Spa & Wellness', name: 'Spa & Wellness' },
      { _id: '6a21350a12726baf686d3457', label: 'Bridal Packages', name: 'Bridal Packages' }
    ];

    try {
      const res = await getAllServiceCategories();
      const list = res?.data?.data || res?.data || res || [];
      if (res?.success && Array.isArray(list) && list.length > 0) {
        setCategoriesList(list);
      } else {
        setCategoriesList(fallbackCategories);
      }
    } catch (err) {
      console.error('Error fetching service categories, loading fallbacks:', err);
      setCategoriesList(fallbackCategories);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleToggleCategory = (catId) => {
    setLeadSelectedCategories(prev => {
      if (prev.includes(catId)) {
        return prev.filter(id => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    if (leadSelectedCategories.length === 0) {
      toast.error("Please select at least one service category.");
      return;
    }

    setLeadSubmitting(true);
    try {
      const payload = {
        categoryIds: leadSelectedCategories,
        requirement: leadRequirement,
        budget: Number(leadBudget),
        preferredDate: new Date(leadPreferredDate).toISOString(),
        address: leadAddress,
        pincode: leadPincode,
        city: leadCity,
        state: leadState,
        location: {
          type: "Point",
          coordinates: [lng || 77.2090, lat || 28.6139] // use GPS coords or New Delhi default
        },
        quantity: Number(leadQuantity),
        phoneNumber: leadPhoneNumber,
        gender: leadGender
      };

      const res = await createServiceLead(payload);
      if (res?.success) {
        setIsLeadModalOpen(false);
        // Reset state
        setLeadRequirement('');
        setLeadBudget('');
        setLeadPreferredDate('');
        setLeadAddress('');
        setLeadPincode('');
        setLeadCity('');
        setLeadState('');
        setLeadQuantity(1);
        setLeadPhoneNumber('');
        setLeadGender('FEMALE');
        setLeadSelectedCategories([]);

        Swal.fire({
          title: 'Requirement Posted!',
          text: res.message || 'Your service lead request has been created successfully. Local lounges/stylists will contact you with quotes.',
          icon: 'success',
          confirmButtonColor: '#EC4899',
          customClass: {
            popup: 'rounded-3xl font-outfit'
          }
        });
      } else {
        toast.error(res?.message || 'Failed to submit service lead request.');
      }
    } catch (err) {
      console.error('Submit lead error:', err);
      toast.error('Something went wrong. Please check fields and try again.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-outfit text-gray-800 pb-24 lg:pb-12 text-left">
      
      {/* Premium Header Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 py-16 px-4 shadow-md text-white text-center">
        <div className="max-w-[1600px] mx-auto space-y-4">
          <span className="text-sm font-black tracking-widest bg-white/20 px-3 py-1 rounded-full uppercase">
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
        
        {/* Custom Lead Request Banner */}
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-black tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">
              Custom Requirements
            </span>
            <h2 className="text-lg font-bold text-gray-900">Can't find a matching Lounge or Service nearby?</h2>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Post your requirement details, budget, and location. Let verified service providers send you customized quotes!
            </p>
          </div>
          <button
            onClick={handleOpenLeadModal}
            className="bg-primary hover:bg-primary/95 text-white font-black uppercase text-xs tracking-wider px-6 py-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            Request Custom Service
          </button>
        </div>

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

      {/* Custom Lead Creation Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col animate-in scale-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-150 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-sm font-black uppercase text-primary tracking-wider">Request Custom Service</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Post requirement lead details</p>
              </div>
              <button
                onClick={() => setIsLeadModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitLead} className="p-6 space-y-5 text-xs text-left">
              
              {/* Category selector */}
              <div>
                <label className="block font-black text-gray-700 uppercase tracking-wider mb-2">
                  Select Categories *
                </label>
                {categoriesLoading ? (
                  <div className="flex items-center gap-1.5 py-2 font-bold text-gray-400">
                    <Loader2 size={12} className="animate-spin text-primary" /> Loading service categories...
                  </div>
                ) : categoriesList.length === 0 ? (
                  <p className="text-gray-450 font-bold py-1">No categories available.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categoriesList.map(cat => {
                      const isSelected = leadSelectedCategories.includes(cat._id);
                      return (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => handleToggleCategory(cat._id)}
                          className={`px-3.5 py-2 rounded-xl border font-bold uppercase text-[10px] transition-all cursor-pointer active:scale-95 ${
                            isSelected 
                              ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {cat.label || cat.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Requirement details */}
              <div>
                <label className="block font-black text-gray-700 uppercase tracking-wider mb-1.5">
                  Explain your Requirement *
                </label>
                <textarea
                  required
                  rows={3}
                  value={leadRequirement}
                  onChange={e => setLeadRequirement(e.target.value)}
                  placeholder="e.g. Bridal makeup, hair styling and saree draping for wedding event..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-250 font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-gray-50/50 resize-none text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Budget */}
                <div>
                  <label className="block font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Estimated Budget (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={leadBudget}
                    onChange={e => setLeadBudget(e.target.value)}
                    placeholder="e.g. 20000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-250 font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-gray-50/50 text-gray-800"
                  />
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Preferred Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={leadPreferredDate}
                    onChange={e => setLeadPreferredDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-250 font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-gray-50/50 text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact phone */}
                <div>
                  <label className="block font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={leadPhoneNumber}
                    onChange={e => setLeadPhoneNumber(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-250 font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-gray-50/50 text-gray-800"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Total Persons *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={leadQuantity}
                    onChange={e => setLeadQuantity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-250 font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-gray-50/50 text-gray-800"
                  />
                </div>
              </div>

              {/* Gender & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Gender */}
                <div className="sm:col-span-1">
                  <label className="block font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Gender Preference *
                  </label>
                  <select
                    value={leadGender}
                    onChange={e => setLeadGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-250 font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-gray-50/50 text-gray-800 cursor-pointer"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="ANY">Any</option>
                  </select>
                </div>

                {/* Pin Code */}
                <div className="sm:col-span-1">
                  <label className="block font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadPincode}
                    onChange={e => setLeadPincode(e.target.value)}
                    placeholder="6-digit pincode"
                    className="w-full px-4 py-3 rounded-xl border border-gray-250 font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-gray-50/50 text-gray-800"
                  />
                </div>

                {/* City */}
                <div className="sm:col-span-1">
                  <label className="block font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadCity}
                    onChange={e => setLeadCity(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full px-4 py-3 rounded-xl border border-gray-250 font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-gray-50/50 text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* State */}
                <div>
                  <label className="block font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadState}
                    onChange={e => setLeadState(e.target.value)}
                    placeholder="e.g. Delhi"
                    className="w-full px-4 py-3 rounded-xl border border-gray-250 font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-gray-55/50 text-gray-800"
                  />
                </div>

                {/* Detailed Address */}
                <div>
                  <label className="block font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Address Detail *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadAddress}
                    onChange={e => setLeadAddress(e.target.value)}
                    placeholder="House No., Sector, Area..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-250 font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-gray-55/50 text-gray-800"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="flex items-center gap-1.5 px-8 py-3 bg-primary hover:bg-primary/95 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider shadow-lg shadow-primary/20 transition-all cursor-pointer active:scale-95 disabled:opacity-55"
                >
                  {leadSubmitting ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Submit Lead Request'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Booking;
