import React from 'react';
import { X, User, MapPin, Briefcase, Phone, Mail, Award, CheckCircle2, XCircle, ShieldCheck, Star, Navigation } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

/**
 * Service Provider Details Modal
 * Displays comprehensive details for the selected service provider
 */
const ServiceProviderDetailsModal = ({ provider, onClose }) => {
  const { isDarkMode } = useTheme();

  if (!provider) return null;

  const DetailItem = ({ icon, label, value }) => (
    <div className="flex gap-3 py-3 border-b border-gray-100/50 dark:border-white/5 last:border-b-0">
      <div className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <span className="text-[9px] font-black text-gray-400 uppercase block tracking-wider leading-none mb-1">{label}</span>
        <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{value || '—'}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-outfit">
      <div className={`w-full max-w-2xl my-auto rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-white' : 'bg-white text-gray-800'}`}>
        <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold flex-shrink-0">
                <Briefcase size={28} />
              </div>
              <div>
                <h2 className={`text-xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {provider.businessName || 'Business Partner'}
                </h2>
                <p className="text-[10px] font-bold text-primary uppercase mt-1">Service Provider Profile</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    provider.verificationStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {provider.verificationStatus || 'PENDING'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    provider.providerType === 'INDIVIDUAL' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                  }`}>
                    {provider.providerType || 'INDIVIDUAL'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Primary Details */}
            <div className="space-y-4">
              <h3 className={`text-[10px] font-black uppercase tracking-wider pb-2 border-b ${isDarkMode ? 'text-gray-400 border-white/5' : 'text-gray-500 border-gray-100'}`}>Account & Contact Info</h3>
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900/10 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
                <DetailItem icon={<User size={16} />} label="Registered Owner" value={provider.userId?.name || '—'} />
                <DetailItem icon={<Mail size={16} />} label="Owner Email" value={provider.userId?.email || provider.email || '—'} />
                <DetailItem icon={<Phone size={16} />} label="Contact Phone" value={provider.phone || '—'} />
                <DetailItem icon={<Award size={16} />} label="Experience Years" value={`${provider.experienceYears || 0} Years`} />
              </div>
            </div>

            {/* Business Status & Availability */}
            <div className="space-y-4">
              <h3 className={`text-[10px] font-black uppercase tracking-wider pb-2 border-b ${isDarkMode ? 'text-gray-400 border-white/5' : 'text-gray-500 border-gray-100'}`}>Availability & Ratings</h3>
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900/10 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100/50 dark:border-white/5">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Home Service</span>
                  <span className={`inline-flex items-center gap-1 font-bold text-xs ${provider.homeServiceAvailable ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {provider.homeServiceAvailable ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {provider.homeServiceAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100/50 dark:border-white/5">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Salon Visit</span>
                  <span className={`inline-flex items-center gap-1 font-bold text-xs ${provider.salonVisitAvailable ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {provider.salonVisitAvailable ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {provider.salonVisitAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100/50 dark:border-white/5">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Service Radius</span>
                  <span className="text-xs font-bold flex items-center gap-1 text-primary">
                    <Navigation size={12} /> {provider.serviceRadiusKm || 0} km
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Ratings & Reviews</span>
                  <span className="text-xs font-bold flex items-center gap-1 text-amber-500">
                    <Star size={13} className="fill-amber-500" /> {provider.rating || 0} ({provider.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Overview Description */}
          <div className="mt-6 text-left">
            <h3 className={`text-[10px] font-black uppercase tracking-wider mb-2.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>About Business</h3>
            <p className={`p-4 rounded-2xl text-xs leading-relaxed border ${isDarkMode ? 'bg-gray-900/20 border-white/5 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
              {provider.description || 'No description provided.'}
            </p>
          </div>

          {/* Legal Information */}
          <div className="mt-6 text-left">
            <h3 className={`text-[10px] font-black uppercase tracking-wider mb-2.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Legal & Tax Identifications</h3>
            <div className={`p-4 rounded-2xl border grid grid-cols-2 gap-4 ${isDarkMode ? 'bg-gray-900/10 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">GST Identification</span>
                <span className="text-xs font-mono font-bold uppercase">{provider.gstNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">PAN Card Number</span>
                <span className="text-xs font-mono font-bold uppercase">{provider.panNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="mt-6 text-left">
            <h3 className={`text-[10px] font-black uppercase tracking-wider mb-2.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Address Location</h3>
            <div className={`p-4 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-gray-900/10 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
              <div className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="font-bold">
                  {provider.address}, {provider.city}, {provider.state} - {provider.pincode}
                </span>
              </div>
              {provider.coordinates && (
                <div className="flex justify-between items-center text-[10px] font-semibold text-gray-400 pt-2.5 border-t border-gray-100/50 dark:border-white/5">
                  <span>Coordinates (Long, Lat)</span>
                  <span className="font-mono">[{provider.coordinates.join(', ')}]</span>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps & ID */}
          <div className={`p-4 rounded-2xl border space-y-2.5 mt-6 text-xs ${isDarkMode ? 'bg-gray-900/20 border-white/5 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase text-gray-400">Account status</span>
              <span className="font-bold flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${provider.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                {provider.isActive ? 'Active & Live' : 'Inactive / Suspended'}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100/50 dark:border-white/5 pt-2.5">
              <span className="text-[9px] font-bold uppercase text-gray-400">Created At</span>
              <span className="font-bold text-gray-700 dark:text-gray-500">
                {new Date(provider.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase text-gray-400">Last Updated</span>
              <span className="font-bold text-gray-700 dark:text-gray-500">
                {new Date(provider.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="w-full mt-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:opacity-95 active:opacity-90 transition-all cursor-pointer">
            Close Profile Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDetailsModal;
