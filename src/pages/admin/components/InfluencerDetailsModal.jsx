import React, { useState, useEffect } from 'react';
import { Loader2, X, Camera, Video, TicketPercent, Pencil, Trash2 } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { getInfluencerById, deleteCoupon } from '../../../api/adminService';
import { useTheme } from '../../../context/ThemeContext';

/**
 * Influencer Details Modal
 * Rendered in AdminPanel for viewing and managing influencer profiles and their coupons.
 */
const InfluencerDetailsModal = ({ influencerId, onClose, onEditCoupon, onRefresh }) => {
  const { isDarkMode } = useTheme();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!influencerId) return;
      setLoading(true);
      try {
        const response = await getInfluencerById(influencerId);
        if (response.success) {
          const data = response.data?.data || response.data;
          setInfluencer(data);
        } else {
          toast.error(response.message || 'Failed to load details');
        }
      } catch (err) {
        console.error('Modal fetch error:', err);
        toast.error('Could not fetch influencer details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [influencerId]);

  const handleDeleteCoupon = (couponId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-gray-800">Delete this coupon?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await deleteCoupon(couponId);
                if (res.success) {
                  toast.success('Coupon deleted');
                  if (onRefresh) onRefresh();
                } else {
                  toast.error(res.message || 'Delete failed');
                }
              } catch (err) {
                toast.error('Something went wrong');
              }
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
          >
            Yes, Delete
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  if (!influencerId) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-2xl my-auto rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <span className="text-xs font-bold text-gray-400 uppercase">Fetching Influencer Profile...</span>
          </div>
        ) : influencer ? (
          <div className="p-5 md:p-10">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-5">
                <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-2xl font-bold shadow-xl ${isDarkMode ? 'bg-gray-900 text-gray-500' : 'bg-gray-50 text-primary ring-8 ring-primary/5'}`}>
                  {influencer.name?.charAt(0)}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{influencer.name}</h2>
                  <p className="text-xs font-bold text-primary uppercase mt-1">Professional Influencer</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{influencer.userId?.email}</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
                <X size={20} />
              </button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase text-gray-400">Financial Performance</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Commission</p>
                    <p className="text-lg font-bold text-primary">{influencer.commissionRate}%</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Followers</p>
                    <p className="text-lg font-bold">{influencer.followers?.toLocaleString()}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Sales</p>
                    <p className="text-lg font-bold">₹{influencer.totalSales?.toLocaleString()}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Earnings</p>
                    <p className="text-lg font-bold text-green-500">₹{influencer.totalCommissionEarned?.toLocaleString()}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pending</p>
                    <p className="text-lg font-bold text-orange-500">₹{influencer.pendingCommission?.toLocaleString() || 0}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Paid</p>
                    <p className="text-lg font-bold text-blue-500">₹{influencer.paidCommission?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
              {/* Bio & Social */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase text-gray-400">Profile Information</h3>
                <div className={`p-4 rounded-2xl min-h-[100px] ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Biography</p>
                  <p className="text-xs font-medium leading-relaxed opacity-80">{influencer.bio || 'No biography provided.'}</p>
                </div>
                <div className="flex gap-2">
                  {influencer.instagram && (
                    <a href={influencer.instagram.startsWith('http') ? influencer.instagram : `https://${influencer.instagram}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-pink-500/10 text-pink-500 text-[10px] font-bold uppercase transition-all hover:bg-pink-500 hover:text-white">
                      <Camera size={14} /> Instagram
                    </a>
                  )}
                  {influencer.youtube && (
                    <a href={influencer.youtube.startsWith('http') ? influencer.youtube : `https://${influencer.youtube}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-bold uppercase transition-all hover:bg-red-500 hover:text-white">
                      <Video size={14} /> YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>
            {/* Coupons */}
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-bold uppercase text-gray-400">Assigned Coupons ({influencer.coupons?.length || 0})</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {influencer.coupons?.length > 0 ? (
                  influencer.coupons.map((coupon, idx) => (
                    <div key={idx} className={`group p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-gray-900/40 border-white/5 hover:border-primary/50' : 'bg-gray-50 border-gray-100 hover:border-primary/30'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">{coupon.code}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => onEditCoupon(coupon)} title="Edit Coupon" className="p-1.5 rounded-lg bg-primary text-white transition-all hover:scale-110"><Pencil size={12} /></button>
                          <button onClick={() => handleDeleteCoupon(coupon._id)} title="Delete Coupon" className="p-1.5 rounded-lg bg-red-500 text-white transition-all hover:scale-110"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Exp: {new Date(coupon.expiresAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${coupon.isActive ? 'text-green-500' : 'text-red-5'}`}>{coupon.isActive ? 'Active' : 'Expired'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`col-span-full py-8 text-center rounded-2xl border-2 border-dashed ${isDarkMode ? 'border-white/5 text-gray-600' : 'border-gray-100 text-gray-400'}`}>
                    <TicketPercent size={24} className="mx-auto mb-2 opacity-20" />
                    <p className="text-[10px] font-bold uppercase">No coupons generated yet</p>
                  </div>
                )}
              </div>
            </div>
            <button onClick={onClose} className="w-full mt-10 py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:opacity-95 active:opacity-90 transition-all">
              Dismiss Profile
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InfluencerDetailsModal;
