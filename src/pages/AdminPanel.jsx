import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Store,
  TrendingUp,
  CircleAlert,
  CircleCheckBig,
  CircleX,
  BarChart3,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Sun,
  Moon,
  Eye,
  X,
  Menu,
  Percent,
  Trash2,
  Power,
  LayoutDashboard,
  Shield,
  Bell,
  Settings,
  Plus,
  Camera,
  Video,
  Music,
  TicketPercent,
  Pencil
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAllUsers,
  getUserById,
  getAllVendors,
  getVendorById,
  deleteVendor,
  deleteUser,
  acceptVendor,
  toggleVendorStatus,
  rejectVendor,
  getPendingVendors,
  onboardInfluencer,
  getAllInfluencers,
  getInfluencerById,
  updateInfluencer,
  deleteInfluencer,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  getAllCoupons
} from '../api/adminService';
import { useTheme } from '../context/ThemeContext';

/**
 * Modern Data Table Component
 */
const DataTable = ({ columns, data, loading, onRowClick }) => {
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className={`h-[400px] flex flex-col items-center justify-center rounded-3xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Loading Records...</p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-8 py-6 text-[10px] font-bold uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {data.length > 0 ? data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-all group cursor-pointer ${isDarkMode ? 'hover:bg-gray-900/30' : 'hover:bg-gray-50/50'}`}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-8 py-6">
                    <div className={`transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600 font-bold'}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </div>
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="px-8 py-20 text-center">
                  <p className={`font-bold uppercase text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No records found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Delete Confirmation Modal
 */
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, itemName }) => {
  const { isDarkMode } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-sm:max-w-xs max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} />
          </div>
          <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Confirm Deletion</h3>
          <p className="text-sm text-gray-500 mb-8">Are you sure you want to delete <span className="font-bold text-red-500">{itemName}</span>? This action cannot be undone.</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Delete Now'}
            </button>
            <button
              onClick={onCancel}
              className={`py-3 rounded-xl font-bold text-xs uppercase transition-all ${isDarkMode ? 'bg-gray-900 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * User Details Modal
 */
const UserDetailsModal = ({ userId, onClose }) => {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await getUserById(userId);
        if (response.success) setUser(response.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    if (userId) fetchDetail();
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <span className="text-xs font-bold text-gray-400 uppercase">Loading Profile...</span>
          </div>
        ) : user ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${isDarkMode ? 'bg-gray-900 text-gray-500' : 'bg-gray-50 text-primary'}`}>
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <h2 className={`text-lg font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase">{user.email}</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Access Role', value: user.role, isTag: true },
                { label: 'Status', value: user.isActive ? 'Active' : 'Inactive', isStatus: true },
                { label: 'Registration', value: new Date(user.createdAt).toLocaleDateString() },
                { label: 'System ID', value: user._id, isMono: true }
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                  <span className="text-xs font-bold text-gray-400 uppercase">{item.label}</span>
                  {item.isTag ? (
                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase">{item.value}</span>
                  ) : item.isStatus ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.value}</span>
                    </div>
                  ) : (
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ${item.isMono ? 'font-mono opacity-50' : 'uppercase'}`}>
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button onClick={onClose} className="w-full mt-8 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Close Profile
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Vendor Details Modal
 */
const VendorDetailsModal = ({ vendorId, onClose }) => {
  const { isDarkMode } = useTheme();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await getVendorById(vendorId);
        if (response.success) setVendor(response.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    if (vendorId) fetchDetail();
  }, [vendorId]);

  if (!vendorId) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <span className="text-xs font-bold text-gray-400 uppercase">Loading Shop...</span>
          </div>
        ) : vendor ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${isDarkMode ? 'bg-gray-900 text-gray-500' : 'bg-gray-50 text-primary'}`}>
                  <Store size={24} />
                </div>
                <div>
                  <h2 className={`text-lg font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{vendor.businessName}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase">@{vendor.slug}</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Shop Status', value: vendor.status, isTag: true, color: vendor.status === 'APPROVED' ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10' },
                { label: 'Commission', value: `${vendor.commissionRate}%` },
                { label: 'Onboarding', value: new Date(vendor.createdAt).toLocaleDateString() },
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

            <button onClick={onClose} className="w-full mt-8 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Close Review
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Onboard Influencer Modal Component
 */
const OnboardInfluencerModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    tiktok: '',
    instagram: '',
    youtube: '',
    commissionRate: 10,
    followers: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.userId?.name || '',
        email: initialData.userId?.email || '',
        password: '', // Keep empty for security
        bio: initialData.bio || '',
        tiktok: initialData.tiktok || '',
        instagram: initialData.instagram || '',
        youtube: initialData.youtube || '',
        commissionRate: initialData.commissionRate || 10,
        followers: initialData.followers || 0,
        userId: initialData.userId?._id || initialData.userId
      });
    } else {
      setFormData({
        name: '', email: '', password: '', bio: '',
        tiktok: '', instagram: '', youtube: '',
        commissionRate: 10, followers: 0
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (initialData) {
        // Exclude password if empty during update
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        res = await updateInfluencer(initialData._id, updateData);
      } else {
        res = await onboardInfluencer(formData);
      }

      if (res.success) {
        toast.success(initialData ? 'Influencer updated successfully!' : 'Influencer onboarded successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || 'Operation failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'commissionRate' || name === 'followers') {
      if (value === '') {
        setFormData(prev => ({ ...prev, [name]: '' }));
        return;
      }
      const val = Number(value);
      if (val < 0) return;
      setFormData(prev => ({ ...prev, [name]: val }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-2xl my-auto md:my-8 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="p-5 md:p-8 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className={`text-lg md:text-2xl font-bold uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {initialData ? 'Update Influencer' : 'Onboard New Influencer'}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase  mt-1">
                {initialData ? 'Modify existing partner details' : 'Create a new partner profile'}
              </p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email Address" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}> Password</label>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Commission Rate (%)</label>
                <input required type="number" name="commissionRate" value={formData.commissionRate} onChange={handleChange} min="0" max="100" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Influencer Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Describe the influencer..." className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs resize-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Followers Count</label>
                <input type="number" name="followers" value={formData.followers} onChange={handleChange} min="0" placeholder="0" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Instagram Handle</label>
                <div className="relative">
                  <Camera size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="instagram" value={formData.instagram} onChange={handleChange} placeholder="instagram.com/username" className={`w-full pl-12 pr-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>YouTube Channel</label>
                <div className="relative">
                  <Video size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="youtube" value={formData.youtube} onChange={handleChange} placeholder="youtube.com/channel" className={`w-full pl-12 pr-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
                </div>
              </div>
              {/* <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>TikTok Profile</label>
                <div className="relative">
                  <Music size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="tiktok" value={formData.tiktok} onChange={handleChange} placeholder="tiktok.com/@username" className={`w-full pl-12 pr-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
                </div>
              </div> */}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button disabled={loading} type="submit" className="flex-1 order-2 sm:order-1 py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : initialData ? 'Save Changes' : 'Confirm Onboarding'}
              </button>
              <button type="button" onClick={onClose} className={`w-full sm:w-auto order-1 sm:order-2 px-8 py-4 rounded-2xl font-bold text-xs uppercase transition-all ${isDarkMode ? 'bg-gray-900 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * Influencer Details Modal
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
              } catch (err) { toast.error('Something went wrong'); }
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
          >Yes, Delete</button>
          <button onClick={() => toast.dismiss(t.id)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">Cancel</button>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earnings & Stats */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-gray-400">Financial Performance</h3>
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
                <h3 className="text-[10px] font-black uppercase text-gray-400">Profile Information</h3>
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

            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase text-gray-400">Assigned Coupons ({influencer.coupons?.length || 0})</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {influencer.coupons?.length > 0 ? (
                  influencer.coupons.map((coupon, idx) => (
                    <div key={idx} className={`group p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-gray-900/40 border-white/5 hover:border-primary/50' : 'bg-gray-50 border-gray-100 hover:border-primary/30'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-black uppercase">{coupon.code}</span>
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
                        <span className={`text-[10px] font-bold uppercase ${coupon.isActive ? 'text-green-500' : 'text-red-500'}`}>{coupon.isActive ? 'Active' : 'Expired'}</span>
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

            <button onClick={onClose} className="w-full mt-10 py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
              Dismiss Profile
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Coupon Details Modal
 */
const CouponDetailsModal = ({ couponId, onClose }) => {
  const { isDarkMode } = useTheme();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!couponId) return;
      setLoading(true);
      try {
        const response = await getCouponById(couponId);
        if (response.success) {
          setCoupon(response.data?.data || response.data);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchDetail();
  }, [couponId]);

  if (!couponId) return null;

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-lg my-auto rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <span className="text-xs font-bold text-gray-400 uppercase">Fetching Coupon Details...</span>
          </div>
        ) : coupon ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <TicketPercent size={24} />
                </div>
                <div>
                  <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{coupon.code}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{coupon.type} Discount</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Value</p>
                <p className="text-lg font-black text-primary">{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}</p>
              </div>
              <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Used</p>
                <p className="text-lg font-black text-gray-400">{coupon.totalUsed} <span className="text-xs">/ {coupon.totalUsageLimit}</span></p>
              </div>
              <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Min Order</p>
                <p className="text-sm font-bold">₹{coupon.minimumOrderAmount}</p>
              </div>
              <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Max Discount</p>
                <p className="text-sm font-bold">₹{coupon.maximumDiscount}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 px-1">
                <span>Validity Period</span>
                <span className={coupon.isActive ? 'text-green-500' : 'text-red-500'}>{coupon.isActive ? 'Currently Active' : 'Inactive'}</span>
              </div>
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Starts</span>
                  <span className="text-xs font-bold">{new Date(coupon.startsAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Expires</span>
                  <span className="text-xs font-bold text-red-500">{new Date(coupon.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {coupon.description && (
              <div className="mt-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Description</p>
                <p className={`p-4 rounded-2xl text-xs leading-relaxed ${isDarkMode ? 'bg-gray-900/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                  {coupon.description}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Create Coupon Modal
 */
const CreateCouponModal = ({ isOpen, onClose, influencerId, influencerName, initialData = null }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'fixed',
    value: 0,
    influencerId: influencerId || '',
    scope: 'platform',
    minimumOrderAmount: 0,
    maximumDiscount: 0,
    usageLimitPerUser: 1,
    totalUsageLimit: 10,
    startsAt: new Date().toISOString().split('T')[0],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    const fetchCouponDetail = async () => {
      setLoading(true);
      try {
        const res = await getCouponById(initialData._id);
        if (res.success) {
          const coupon = res.data?.data || res.data;
          setFormData({
            code: coupon.code || '',
            type: coupon.type || 'fixed',
            value: coupon.value || 0,
            influencerId: coupon.influencerId?._id || coupon.influencerId || influencerId || '',
            scope: coupon.scope || 'platform',
            minimumOrderAmount: coupon.minimumOrderAmount || 0,
            maximumDiscount: coupon.maximumDiscount || 0,
            usageLimitPerUser: coupon.usageLimitPerUser || 1,
            totalUsageLimit: coupon.totalUsageLimit || 10,
            startsAt: coupon.startsAt ? new Date(coupon.startsAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: coupon.description || ''
          });
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };

    if (initialData) {
      fetchCouponDetail();
    } else if (influencerId) {
      setFormData(prev => ({
        ...prev,
        influencerId,
        code: '',
        type: 'fixed',
        value: 0
      }));
    }
  }, [influencerId, initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        startsAt: new Date(formData.startsAt).toISOString(),
        expiresAt: new Date(formData.expiresAt).toISOString(),
        value: Number(formData.value),
        minimumOrderAmount: Number(formData.minimumOrderAmount),
        maximumDiscount: Number(formData.maximumDiscount),
        usageLimitPerUser: Number(formData.usageLimitPerUser),
        totalUsageLimit: Number(formData.totalUsageLimit)
      };
      let res;
      if (initialData) {
        res = await updateCoupon(initialData._id, payload);
      } else {
        res = await createCoupon(payload);
      }

      if (res.success) {
        toast.success(initialData ? 'Coupon updated successfully!' : 'Coupon created successfully!');
        onClose();
      } else {
        toast.error(res.message || 'Operation failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-2xl my-auto rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="p-5 md:p-8 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <TicketPercent size={24} />
              </div>
              <div>
                <h2 className={`text-xl font-bold uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {initialData ? 'Update Coupon' : 'Create Coupon'}
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                  {initialData ? `Editing: ${initialData.code}` : `Assigning to: ${influencerName}`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Coupon Code</label>
                <input required name="code" value={formData.code} onChange={handleChange} placeholder="e.g. SAVE50" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Discount Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`}>
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Value ({formData.type === 'fixed' ? '₹' : '%'})</label>
                <input required type="number" name="value" value={formData.value} onChange={handleChange} min="0" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Min Order Amount</label>
                <input required type="number" name="minimumOrderAmount" value={formData.minimumOrderAmount} onChange={handleChange} min="0" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Usage Limit (Per User)</label>
                <input required type="number" name="usageLimitPerUser" value={formData.usageLimitPerUser} onChange={handleChange} min="1" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Total Usage Limit</label>
                <input required type="number" name="totalUsageLimit" value={formData.totalUsageLimit} onChange={handleChange} min="1" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Starts At</label>
                <input required type="date" name="startsAt" value={formData.startsAt} onChange={handleChange} className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Expires At</label>
                <input required type="date" name="expiresAt" value={formData.expiresAt} onChange={handleChange} className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Describe the coupon purpose..." className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all resize-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`}></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button disabled={loading} type="submit" className="flex-1 order-2 sm:order-1 py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : initialData ? 'Save Changes' : 'Create Coupon Now'}
              </button>
              <button type="button" onClick={onClose} className={`w-full sm:w-auto order-1 sm:order-2 px-8 py-4 rounded-2xl font-bold text-xs uppercase transition-all ${isDarkMode ? 'bg-gray-900 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const { isDarkMode, toggleTheme } = useTheme();

  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({ role: '', search: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState(null);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [influencerForCoupon, setInfluencerForCoupon] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
    setPagination(prev => ({ ...prev, page: 1 }));
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'users') {
        response = await getAllUsers({ page: pagination.page, limit: pagination.limit, role: filters.role, search: filters.search });
      } else if (activeTab === 'vendors') {
        response = await getAllVendors({ page: pagination.page, limit: pagination.limit, search: filters.search });
      } else if (activeTab === 'pending') {
        response = await getPendingVendors({ page: pagination.page, limit: pagination.limit, search: filters.search });
      } else if (activeTab === 'influencers') {
        response = await getAllInfluencers({ page: pagination.page, limit: pagination.limit, search: filters.search });
      } else if (activeTab === 'coupons') {
        response = await getAllCoupons({ page: pagination.page, limit: pagination.limit, search: filters.search });
      }

      if (response && response.success) {
        let list = response.data?.users || response.data?.vendors || response.data?.influencers || response.data?.coupons || response.data?.data || response.data || [];
        if (activeTab === 'vendors') {
          list = list.filter(u => u.role === 'vendor' && u.vendorId);
        } else if (activeTab === 'pending') {
          list = list.filter(u => (u.vendorId?.status || u.status) === 'PENDING');
        }
        setDataList(list);
        setPagination(prev => ({ ...prev, total: response.data?.total || list.length }));
      }
    } catch (error) { toast.error('Data sync failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (['users', 'vendors', 'pending', 'influencers', 'coupons'].includes(activeTab)) fetchData();
  }, [activeTab, pagination.page, filters.role]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      let res;
      if (activeTab === 'users') {
        res = await deleteUser(itemToDelete._id);
      } else if (activeTab === 'influencers') {
        res = await deleteInfluencer(itemToDelete._id);
      } else {
        const vId = itemToDelete.vendorId?._id || itemToDelete.vendorId || itemToDelete._id;
        res = await deleteVendor(vId);
      }
      if (res.success) {
        toast.success('Record removed');
        fetchData();
        setItemToDelete(null);
      }
    } catch (err) { toast.error('Removal failed'); }
  };

  const handleApproveVendor = async (vId) => {
    try {
      const res = await acceptVendor(vId);
      if (res.success) { toast.success('Vendor approved'); fetchData(); }
    } catch (e) { toast.error('Approval failed'); }
  };

  const handleRejectVendor = async (vId) => {
    try {
      const res = await rejectVendor(vId);
      if (res.success) { toast.success('Vendor rejected'); fetchData(); }
    } catch (e) { toast.error('Rejection failed'); }
  };

  const stats = [
    { id: 'dashboard', label: 'Revenue Growth', value: '₹12.5M', icon: <TrendingUp size={20} />, trend: '+18%', color: 'text-green-500' },
    { id: 'users', label: 'User Directory', value: '45.2K', icon: <Users size={20} />, trend: '+12%', color: 'text-blue-500' },
    { id: 'vendors', label: 'Vendor Partners', value: pagination.total || '0', icon: <Store size={20} />, trend: '+5%', color: 'text-purple-500' },
    { id: 'pending', label: 'New Approvals', value: '12', icon: <CircleAlert size={20} />, trend: 'Urgent', color: 'text-orange-500' },
    { id: 'influencers', label: 'Influencer Partners', value: '254', icon: <TrendingUp size={20} />, trend: '+30%', color: 'text-pink-500' },
    { id: 'coupons', label: 'Active Coupons', value: pagination.total || '0', icon: <TicketPercent size={20} />, trend: 'New', color: 'text-green-500' },
  ];

  const userColumns = [
    {
      header: 'Identity',
      render: (user) => (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center font-bold ${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
            {user.name?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.name}</span>
            <span className="text-[10px] font-bold uppercase text-gray-400">{user.email}</span>
          </div>
        </div>
      )
    },
    { header: 'Role', render: (user) => <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase  ${user.role === 'admin' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'} shadow-sm`}>{user.role}</span> },
    { header: 'Status', render: (user) => <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div><span className="text-[10px] font-semibold uppercase text-gray-400">{user.isActive ? 'Active' : 'Offline'}</span></div> },
    {
      header: 'Actions',
      render: (user) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setSelectedUserId(user._id)} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button onClick={() => setItemToDelete(user)} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const vendorColumns = [
    {
      header: 'Vendor Info',
      render: (vendor) => (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center font-bold ${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
            {vendor.businessName?.charAt(0) || vendor.name?.charAt(0) || 'V'}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{vendor.businessName || vendor.name}</span>
            <span className="text-[10px] font-bold uppercase text-gray-400">{vendor.email}</span>
          </div>
        </div>
      )
    },
    { header: 'Vendor ID', render: (vendor) => <span className="text-xs font-mono font-bold text-gray-400">{vendor.vendorId?._id || vendor.vendorId || vendor._id}</span> },
    {
      header: 'Status', render: (vendor) => {
        const vProfile = vendor.vendorId;
        const isActive = vProfile ? vProfile.isActive : vendor.isActive;
        return <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div><span className="text-[10px] font-semibold uppercase text-gray-400">{isActive ? 'Active' : 'Offline'}</span></div>
      }
    },
    { header: 'Registration', render: (vendor) => <div className="flex flex-col"><span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span><span className="text-[10px] uppercase font-bold text-gray-400">Onboarded</span></div> },
    {
      header: 'Actions',
      render: (vendor) => {
        const vProfile = vendor.vendorId;
        const vId = typeof vProfile === 'object' ? vProfile?._id : (vProfile || vendor._id);
        const isPending = (vProfile?.status || vendor.status) === 'PENDING';
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {isPending && (
              <div className="flex gap-1">
                <button onClick={() => handleApproveVendor(vId)} className="p-2.5 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 hover:scale-110 transition-all"><CircleCheckBig size={16} /></button>
                <button onClick={() => handleRejectVendor(vId)} className="p-2.5 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20 hover:scale-110 transition-all"><CircleX size={16} /></button>
              </div>
            )}
            <button onClick={() => toggleVendorStatus(vId).then(() => fetchData())} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-500 hover:text-green-500' : 'bg-gray-50 text-gray-400 hover:text-green-600'}`}><Power size={18} /></button>
            <button onClick={() => setSelectedVendorId(vId)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
            <button onClick={() => setItemToDelete(vendor)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
          </div>
        );
      }
    }
  ];

  const influencerColumns = [
    {
      header: 'Influencer',
      render: (inf) => (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center font-bold ${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
            {inf.name?.charAt(0) || inf.userId?.name?.charAt(0) || 'I'}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{inf.name || inf.userId?.name}</span>
            <span className="text-[10px] font-bold uppercase text-gray-400">{inf.userId?.email}</span>
          </div>
        </div>
      )
    },
    { header: 'Followers', render: (inf) => <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{inf.followers?.toLocaleString()}</span> },
    { header: 'Commission', render: (inf) => <span className="px-3 py-1 rounded-lg bg-pink-500/10 text-pink-500 text-[10px] font-black uppercase ">{inf.commissionRate}%</span> },
    { header: 'Earnings', render: (inf) => <div className="flex flex-col"><span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>₹{inf.totalCommissionEarned?.toLocaleString()}</span><span className="text-[10px] uppercase font-bold text-gray-400">Total Paid</span></div> },
    { header: 'Status', render: (inf) => <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${inf.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div><span className="text-[10px] font-semibold uppercase text-gray-400">{inf.status}</span></div> },
    {
      header: 'Actions',
      render: (inf) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button title="Create Coupon" onClick={() => setInfluencerForCoupon(inf)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-green-500' : 'bg-gray-50 text-gray-400 hover:text-green-500'}`}><TicketPercent size={18} /></button>
          <button title="Edit Profile" onClick={() => { setEditingInfluencer(inf); setIsOnboardingOpen(true); }} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-orange-500' : 'bg-gray-50 text-gray-400 hover:text-orange-500'}`}><Pencil size={18} /></button>
          <button title="View Details" onClick={() => setSelectedInfluencerId(inf._id)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button title="Delete Influencer" onClick={() => setItemToDelete(inf)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const couponColumns = [
    {
      header: 'Coupon Code',
      render: (cp) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <TicketPercent size={18} />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{cp.code}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">{cp.description || 'Platform Discount'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Assigned To',
      render: (cp) => (
        <div className="flex flex-col">
          <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cp.influencerId?.name || cp.influencerId || 'Global'}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase">Partner</span>
        </div>
      )
    },
    { header: 'Discount', render: (cp) => <span className={`text-sm font-black ${isDarkMode ? 'text-primary' : 'text-primary'}`}>{cp.type === 'percentage' ? `${cp.value}%` : `₹${cp.value}`}</span> },
    { header: 'Usage', render: (cp) => <div className="flex flex-col"><span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{cp.totalUsed} / {cp.totalUsageLimit}</span><div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-primary" style={{ width: `${Math.min((cp.totalUsed / cp.totalUsageLimit) * 100, 100)}%` }}></div></div></div> },
    { header: 'Status', render: (cp) => <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${cp.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{cp.isActive ? 'Active' : 'Expired'}</span> },
    {
      header: 'Actions',
      render: (cp) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button title="View Details" onClick={() => setSelectedCouponId(cp._id)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button title="Edit Coupon" onClick={() => { setEditingCoupon(cp); setInfluencerForCoupon(true); }} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-orange-500' : 'bg-gray-50 text-gray-400 hover:text-orange-500'}`}><Pencil size={18} /></button>
          <button title="Delete Coupon" onClick={() => {
            toast((t) => (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-gray-800">Delete coupon <span className="text-primary">{cp.code}</span>?</p>
                <div className="flex gap-2">
                  <button onClick={async () => { toast.dismiss(t.id); await deleteCoupon(cp._id); fetchData(); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">Yes, Delete</button>
                  <button onClick={() => toast.dismiss(t.id)} className="flex-1 bg-gray-100 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">Cancel</button>
                </div>
              </div>
            ), { duration: 8000 });
          }} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className={`flex min-h-screen font-outfit transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <UserDetailsModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      <InfluencerDetailsModal key={selectedInfluencerId} influencerId={selectedInfluencerId} onClose={() => setSelectedInfluencerId(null)} onEditCoupon={(coupon) => { setEditingCoupon(coupon); setInfluencerForCoupon(true); }} onRefresh={fetchData} />
      <CouponDetailsModal key={selectedCouponId} couponId={selectedCouponId} onClose={() => setSelectedCouponId(null)} />
      <CreateCouponModal isOpen={!!influencerForCoupon || !!editingCoupon} onClose={() => { setInfluencerForCoupon(null); setEditingCoupon(null); fetchData(); }} initialData={editingCoupon} influencerId={influencerForCoupon?._id} influencerName={influencerForCoupon?.name} />
      <VendorDetailsModal vendorId={selectedVendorId} onClose={() => setSelectedVendorId(null)} />
      <DeleteConfirmModal isOpen={!!itemToDelete} itemName={itemToDelete?.name || itemToDelete?.businessName} onConfirm={handleDeleteConfirm} onCancel={() => setItemToDelete(null)} />
      <OnboardInfluencerModal isOpen={isOnboardingOpen} onClose={() => { setIsOnboardingOpen(false); setEditingInfluencer(null); }} initialData={editingInfluencer} onSuccess={fetchData} />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[1002] w-72 transform transition-transform duration-300 lg:sticky lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-screen border-r ${isDarkMode ? 'bg-gray-900 border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="p-8 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xl lg:text-2xl font-bold uppercase  text-primary">WAKEUP ADMIN</span>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"><X size={20} /></button>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { id: 'users', label: 'User Management', icon: <Users size={20} /> },
            { id: 'vendors', label: 'Vendor Control', icon: <Store size={20} /> },
            { id: 'pending', label: 'Pending Approvals', icon: <CircleAlert size={20} /> },
            { id: 'influencers', label: 'Influencer Hub', icon: <TrendingUp size={20} /> },
            { id: 'coupons', label: 'Coupons Manager', icon: <TicketPercent size={20} /> },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === item.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : isDarkMode ? 'text-gray-500 hover:bg-white/5 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-800'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-100 dark:border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"><LogOut size={20} /> Logout System</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 h-screen overflow-y-auto">
        <header className={`h-20 flex items-center justify-between px-6 lg:px-10 border-b sticky top-0 z-[1000] ${isDarkMode ? 'bg-gray-900/80 backdrop-blur-xl border-white/5' : 'bg-white/80 backdrop-blur-xl border-gray-100'}`}>
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
              <Menu size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search platform..." value={filters.search} onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && fetchData()} className={`w-full pl-12 pr-4 py-3 border-none rounded-xl text-sm outline-none font-medium placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs transition-all ${isDarkMode ? 'bg-white/5 text-gray-200' : 'bg-gray-50 text-gray-800 focus:bg-gray-100'}`} />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button onClick={toggleTheme} className={`p-3 rounded-xl transition-all border ${isDarkMode ? 'bg-white/5 text-primary border-white/5 shadow-xl shadow-primary/10' : 'bg-gray-50 text-primary border-transparent hover:bg-gray-100'}`}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <div className={`w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20`}>AD</div>
          </div>
        </header>

        <main className="p-4 lg:p-10 space-y-6 lg:space-y-10">
          {(activeTab === 'users' || activeTab === 'vendors' || activeTab === 'pending' || activeTab === 'influencers' || activeTab === 'coupons') && (
            <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className={`text-lg lg:text-3xl font-bold uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{activeTab.replace('-', ' ')} Directory</h2>
                  <p className="text-[10px] font-semibold uppercase text-gray-400 mt-1">Oversee global system accounts</p>
                </div>
                <div className={`px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-[24px] border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100'}`}>
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Total {activeTab}</p>
                  <p className="text-xl lg:text-2xl font-bold">{pagination.total}</p>
                </div>
              </div>

              {activeTab === 'influencers' && (
                <div className="flex">
                  <button
                    onClick={() => setIsOnboardingOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Plus size={18} />
                    Onboard New Influencer
                  </button>
                </div>
              )}

              <DataTable
                columns={activeTab === 'users' ? userColumns : activeTab === 'influencers' ? influencerColumns : activeTab === 'coupons' ? couponColumns : vendorColumns}
                data={dataList}
                loading={loading}
                onRowClick={(item) => {
                  if (activeTab === 'users') setSelectedUserId(item._id);
                  else if (activeTab === 'influencers') setSelectedUserId(item.userId?._id || item.userId);
                  else setSelectedVendorId(item.vendorId?._id || item._id);
                }}
              />
              <div className="flex justify-center gap-3">
                <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1} className={`p-4 rounded-2xl disabled:opacity-30 shadow-sm transition-all ${isDarkMode ? 'bg-gray-800 text-white hover:bg-primary' : 'bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-100'}`}><ChevronLeft size={20} /></button>
                <div className="w-14 h-14 flex items-center justify-center bg-primary text-white rounded-2xl font-bold shadow-2xl shadow-primary/30 ring-4 ring-primary/10">{pagination.page}</div>
                <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={dataList.length < pagination.limit} className={`p-4 rounded-2xl disabled:opacity-30 shadow-sm transition-all ${isDarkMode ? 'bg-gray-800 text-white hover:bg-primary' : 'bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-100'}`}><ChevronRight size={20} /></button>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} onClick={() => setActiveTab(stat.id)} className={`p-4 lg:p-8 rounded-2xl lg:rounded-[32px] shadow-sm border transition-all duration-300 group hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100 shadow-gray-200/50'}`}>
                  <div className="flex items-center justify-between mb-4 lg:mb-8">
                    <div className={`p-3 lg:p-5 rounded-xl lg:rounded-2xl transition-all duration-300 group-hover:bg-primary group-hover:text-white ${isDarkMode ? 'bg-gray-900 text-primary' : 'bg-gray-50 text-primary'}`}>{stat.icon}</div>
                    <span className={`text-[8px] lg:text-[10px] font-bold px-2 lg:px-3 py-0.5 lg:py-1 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-green-500/10 text-green-500' : 'bg-green-50 text-green-600 uppercase'}`}>{stat.trend}</span>
                  </div>
                  <h3 className={`text-[10px] lg:text-xs font-bold uppercase mb-1 lg:mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</h3>
                  <p className={`text-lg lg:text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
