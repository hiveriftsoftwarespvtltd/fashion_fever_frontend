import React, { useState, useEffect } from 'react';
import { Crown, X, Loader2, DollarSign, Calendar, Percent, Shield, Star, Award, Zap } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { createServiceSubscriptionPlan, updateServiceSubscriptionPlan } from '../../../api/adminService';
import { useTheme } from '../../../context/ThemeContext';

/**
 * Create / Update Subscription Plan Modal
 */
const CreateSubscriptionPlanModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    durationDays: 30,
    price: 0,
    maxServices: 5,
    maxStaff: 2,
    monthlyLeadLimit: 5,
    commissionPercentage: 10,
    featuredListing: false,
    prioritySupport: false,
    analyticsAccess: false,
    isActive: true,
    priorityRank: 1
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          label: initialData.label || '',
          durationDays: initialData.durationDays ?? 30,
          price: initialData.price ?? 0,
          maxServices: initialData.maxServices ?? 5,
          maxStaff: initialData.maxStaff ?? 2,
          monthlyLeadLimit: initialData.monthlyLeadLimit ?? 5,
          commissionPercentage: initialData.commissionPercentage ?? 10,
          featuredListing: initialData.featuredListing ?? false,
          prioritySupport: initialData.prioritySupport ?? false,
          analyticsAccess: initialData.analyticsAccess ?? false,
          isActive: initialData.isActive ?? true,
          priorityRank: initialData.priorityRank ?? 1
        });
      } else {
        setFormData({
          name: '',
          label: '',
          durationDays: 30,
          price: 0,
          maxServices: 5,
          maxStaff: 2,
          monthlyLeadLimit: 5,
          commissionPercentage: 10,
          featuredListing: false,
          prioritySupport: false,
          analyticsAccess: false,
          isActive: true,
          priorityRank: 1
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const nextVal = type === 'checkbox' ? checked : value;
      const nextData = { ...prev, [name]: nextVal };
      
      // Auto-generate label from name if label hasn't been manually edited
      if (name === 'name' && (!prev.label || prev.label === prev.name)) {
        nextData.label = value.charAt(0).toUpperCase() + value.slice(1);
      }
      
      return nextData;
    });
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit fired in CreateSubscriptionPlanModal! Form data:", formData);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        durationDays: Number(formData.durationDays),
        maxServices: Number(formData.maxServices),
        maxStaff: Number(formData.maxStaff),
        monthlyLeadLimit: Number(formData.monthlyLeadLimit),
        commissionPercentage: Number(formData.commissionPercentage),
        priorityRank: Number(formData.priorityRank)
      };

      let res;
      if (initialData) {
        const planId = initialData._id || initialData.id;
        console.log("Submitting PUT request to updateServiceSubscriptionPlan with ID:", planId, "and payload:", payload);
        res = await updateServiceSubscriptionPlan(planId, payload);
      } else {
        console.log("Submitting POST request to createServiceSubscriptionPlan with payload:", payload);
        res = await createServiceSubscriptionPlan(payload);
      }

      if (res.success) {
        toast.success(res.message || (initialData ? 'Subscription plan updated successfully!' : 'Subscription plan created successfully!'));
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res.message || (initialData ? 'Failed to update subscription plan.' : 'Failed to create subscription plan.'));
      }
    } catch (err) {
      console.error(err);
      toast.error(initialData ? 'Something went wrong while updating subscription plan.' : 'Something went wrong while creating subscription plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-outfit">
      <div className={`w-full max-w-2xl my-auto rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="p-5 md:p-8 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Crown size={24} />
              </div>
              <div>
                <h2 className={`text-xl font-bold uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {initialData ? 'Update Subscription Plan' : 'Create Subscription Plan'}
                </h2>
                <p className="text-sm font-bold text-gray-400 uppercase mt-1">
                  {initialData ? `Modify configuration for: ${initialData.label || initialData.name}` : 'Configure a new service subscription plan for vendors'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Plan Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-gray-400">Plan Name (System key)</label>
                <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. standard" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>

              {/* Display Label */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-gray-400">Display Label</label>
                <input required name="label" value={formData.label} onChange={handleChange} placeholder="e.g. Standard Tier" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-gray-400">Price (₹)</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <DollarSign size={16} />
                  </div>
                  <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 2999" className={`w-full pl-11 pr-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
                </div>
              </div>

              {/* Duration in Days */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-gray-400">Duration (Days, -1 for Lifetime)</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar size={16} />
                  </div>
                  <input required type="number" name="durationDays" value={formData.durationDays} onChange={handleChange} placeholder="e.g. 30" className={`w-full pl-11 pr-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
                </div>
              </div>

              {/* Max Services */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-gray-400">Max Services Allowed</label>
                <input required type="number" min="1" name="maxServices" value={formData.maxServices} onChange={handleChange} placeholder="e.g. 10" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>

              {/* Max Staff */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-gray-400">Max Staff Accounts</label>
                <input required type="number" min="1" name="maxStaff" value={formData.maxStaff} onChange={handleChange} placeholder="e.g. 5" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>

              {/* Monthly Lead Limit */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-gray-400">Monthly Lead Limit</label>
                <input required type="number" min="0" name="monthlyLeadLimit" value={formData.monthlyLeadLimit} onChange={handleChange} placeholder="e.g. 50" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>

              {/* Commission Percentage */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-gray-400">Commission Percentage (%)</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Percent size={14} />
                  </div>
                  <input required type="number" min="0" max="100" name="commissionPercentage" value={formData.commissionPercentage} onChange={handleChange} placeholder="e.g. 15" className={`w-full pl-11 pr-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
                </div>
              </div>

              {/* Priority Rank */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-gray-400">Priority Rank (Sorting order)</label>
                <input required type="number" min="1" name="priorityRank" value={formData.priorityRank} onChange={handleChange} placeholder="e.g. 1" className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white focus:border-primary/50' : 'bg-gray-50 border-gray-100 text-gray-800 focus:bg-white focus:border-primary/30'}`} />
              </div>

              {/* Active Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-gray-400">Plan Status</label>
                <div className="flex items-center gap-3 h-14">
                  <button
                    type="button"
                    onClick={() => handleToggle('isActive')}
                    className={`px-5 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                      formData.isActive
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}
                  >
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

            </div>

            {/* Feature Flags Grid */}
            <div className={`p-5 rounded-3xl border space-y-4 ${isDarkMode ? 'bg-gray-900/30 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
              <p className="text-sm font-black uppercase text-gray-400 tracking-wider">Features Included</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Featured Listing */}
                <button
                  type="button"
                  onClick={() => handleToggle('featuredListing')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    formData.featuredListing
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : isDarkMode
                      ? 'bg-gray-800/50 border-white/5 text-gray-400 hover:text-white'
                      : 'bg-white border-gray-100 text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Star size={18} className={formData.featuredListing ? 'fill-primary' : ''} />
                  <span className="text-sm font-black uppercase">Featured Listing</span>
                </button>

                {/* Priority Support */}
                <button
                  type="button"
                  onClick={() => handleToggle('prioritySupport')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    formData.prioritySupport
                      ? 'bg-violet-500/10 border-violet-500/20 text-violet-500'
                      : isDarkMode
                      ? 'bg-gray-800/50 border-white/5 text-gray-400 hover:text-white'
                      : 'bg-white border-gray-100 text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Award size={18} />
                  <span className="text-sm font-black uppercase">Priority Support</span>
                </button>

                {/* Analytics Access */}
                <button
                  type="button"
                  onClick={() => handleToggle('analyticsAccess')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    formData.analyticsAccess
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      : isDarkMode
                      ? 'bg-gray-800/50 border-white/5 text-gray-400 hover:text-white'
                      : 'bg-white border-gray-100 text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Zap size={18} />
                  <span className="text-sm font-black uppercase">Analytics Access</span>
                </button>

              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button disabled={loading} type="submit" className="flex-1 order-2 sm:order-1 py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:opacity-95 active:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer">
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Plan'}
              </button>
              <button type="button" onClick={onClose} className={`w-full sm:w-auto order-1 sm:order-2 px-8 py-4 rounded-2xl font-bold text-xs uppercase transition-all cursor-pointer ${isDarkMode ? 'bg-gray-900 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSubscriptionPlanModal;
