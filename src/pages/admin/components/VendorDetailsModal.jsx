import React, { useState, useEffect } from 'react';
import { Store, X, Loader2 } from 'lucide-react';
import { getVendorById } from '../../../api/adminService';
import { useTheme } from '../../../context/ThemeContext';

/**
 * Vendor Details Modal
 */
const VendorDetailsModal = ({ vendorId, onClose }) => {
  const { isDarkMode } = useTheme();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const vendor = details?.vendor || details;
  const productsCount = details?.vendorProducts?.length || 0;
  const categoriesCount = details?.vendorCategories?.length || 0;

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await getVendorById(vendorId);
        if (response.success) setDetails(response.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    if (vendorId) fetchDetail();
  }, [vendorId]);

  if (!vendorId) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <span className="text-xs font-bold text-gray-400 uppercase">Loading Shop...</span>
          </div>
        ) : vendor ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-8 text-left">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${isDarkMode ? 'bg-gray-900 text-gray-500' : 'bg-gray-50 text-primary'}`}>
                  <Store size={24} />
                </div>
                <div>
                  <h2 className={`text-lg font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{vendor.businessName || 'No Name'}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase">@{vendor.slug || 'no-slug'}</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-left">
              {[
                { label: 'Shop Status', value: vendor.status || 'PENDING', isTag: true, color: vendor.status === 'APPROVED' ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10' },
                { label: 'Commission', value: `${vendor.commissionRate || 0}%` },
                { label: 'Products Listed', value: `${productsCount} Items` },
                { label: 'Categories Supported', value: `${categoriesCount} Items` },
                { label: 'Onboarding Date', value: vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A' },
                { label: 'Shop ID', value: vendor._id, isMono: true }
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                  <span className="text-xs font-bold text-gray-400 uppercase">{item.label}</span>
                  {item.isTag ? (
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${item.color}`}>{item.value}</span>
                  ) : (
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ${item.isMono ? 'font-mono opacity-50' : 'uppercase'}`}>
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button onClick={onClose} className="w-full mt-8 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
              Close Review
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VendorDetailsModal;
