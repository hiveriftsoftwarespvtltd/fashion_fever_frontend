import React from 'react';
import { X, Percent, IndianRupee, Calendar, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const CashbackSlabDetailsModal = ({ slab, onClose }) => {
  const { isDarkMode } = useTheme();

  if (!slab) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Box */}
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl border transform transition-all flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'
      }`}>
        {/* Accent Top Bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-pink-400 to-purple-500 flex-shrink-0" />

        <div className="p-6 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Percent size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wide">Cashback Slab Details</h3>
                <p className="text-sm font-bold text-gray-400 uppercase">Information on wallet load rewards</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isDarkMode ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-gray-50 text-gray-400 hover:text-gray-800'
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Giant Metric Display */}
          <div className={`p-6 rounded-3xl border mb-6 text-center ${
            isDarkMode ? 'bg-gray-900/50 border-white/5' : 'bg-primary/[0.02] border-primary/10'
          }`}>
            <span className="text-5xl font-black text-primary tracking-tighter">
              {slab.cashbackValue}{slab.cashbackType === 'PERCENTAGE' ? '%' : ' ₹'}
            </span>
            <p className="text-sm font-black uppercase text-gray-400 mt-2 tracking-wider">
              Incentive Reward Value ({slab.cashbackType} TYPE)
            </p>
          </div>

          {/* Range Breakdown Card */}
          <div className="space-y-3">
            {/* Wallet Load Target */}
            <div className={`p-4 rounded-2xl border text-left ${
              isDarkMode ? 'bg-gray-900/30 border-white/5' : 'bg-gray-50 border-gray-100'
            }`}>
              <span className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={12} className="text-primary" /> Wallet Add Money Range
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  ₹{slab.minValue?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase">to</span>
                <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  ₹{slab.maxValue?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Max Cashback Limit */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border text-left ${
              isDarkMode ? 'bg-gray-900/30 border-white/5' : 'bg-gray-50 border-gray-100'
            }`}>
              <span className="text-sm font-black text-gray-400 uppercase tracking-wider">
                Max Cashback Cap
              </span>
              <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {slab.maxCashback ? `₹${slab.maxCashback}` : 'No Limit'}
              </span>
            </div>

            {/* Status Row */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border text-left ${
              isDarkMode ? 'bg-gray-900/30 border-white/5' : 'bg-gray-50 border-gray-100'
            }`}>
              <span className="text-sm font-black text-gray-400 uppercase tracking-wider">
                Slab System Status
              </span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  slab.isActive 
                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' 
                    : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                }`} />
                <span className="text-xs font-black uppercase tracking-wide">
                  {slab.isActive ? 'Active & Live' : 'Inactive / Paused'}
                </span>
              </div>
            </div>

            {/* Created / Updated timelines */}
            <div className={`p-4 rounded-2xl border text-left space-y-3 ${
              isDarkMode ? 'bg-gray-900/30 border-white/5' : 'bg-gray-50 border-gray-100'
            }`}>
              <span className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={12} className="text-primary" /> Audit Timeline
              </span>
              <div className="space-y-2 border-l border-gray-200 dark:border-gray-700 pl-3 ml-1.5 pt-0.5">
                <div className="relative">
                  <div className="absolute -left-[16.5px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white dark:border-gray-800" />
                  <p className="text-sm font-bold text-gray-400 uppercase">Created On</p>
                  <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(slab.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                {slab.updatedAt && (
                  <div className="relative pt-2">
                    <div className="absolute -left-[16.5px] top-3 w-2.5 h-2.5 rounded-full bg-pink-400 border-2 border-white dark:border-gray-800" />
                    <p className="text-sm font-bold text-gray-400 uppercase">Last Updated</p>
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(slab.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button 
              onClick={onClose} 
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Close View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashbackSlabDetailsModal;
