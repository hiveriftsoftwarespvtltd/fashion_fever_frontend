import React, { useState, useEffect } from 'react';
import { X, Percent, IndianRupee, Sparkles, Loader2 } from 'lucide-react';
import { createInfluencerCommissionSlab, updateInfluencerCommissionSlab } from '../../../api/adminService';
import { toast } from '../../../utils/toast';

const CreateCommissionSlabModal = ({ isOpen, onClose, onSuccess, isDarkMode, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    minSales: '',
    maxSales: '',
    commissionRate: '',
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        minSales: initialData.minSales ?? '',
        maxSales: initialData.maxSales ?? '',
        commissionRate: initialData.commissionRate ?? '',
        isActive: initialData.isActive ?? true,
      });
    } else {
      setForm({
        minSales: '',
        maxSales: '',
        commissionRate: '',
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const minVal = Number(form.minSales);
    const maxVal = Number(form.maxSales);
    const rateVal = Number(form.commissionRate);

    if (isNaN(minVal) || minVal < 0) {
      toast.error('Min Sales must be a valid positive number.');
      return;
    }
    if (isNaN(maxVal) || maxVal < minVal) {
      toast.error('Max Sales must be greater than or equal to Min Sales.');
      return;
    }
    if (isNaN(rateVal) || rateVal <= 0 || rateVal > 100) {
      toast.error('Commission Rate must be between 1% and 100%.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (initialData?._id) {
        res = await updateInfluencerCommissionSlab(initialData._id, {
          minSales: minVal,
          maxSales: maxVal,
          commissionRate: rateVal,
          isActive: form.isActive,
        });
      } else {
        res = await createInfluencerCommissionSlab({
          minSales: minVal,
          maxSales: maxVal,
          commissionRate: rateVal,
        });
      }

      if (res.success) {
        toast.success(res.message || (initialData ? 'Slab updated successfully!' : 'Slab created successfully!'));
        setForm({ minSales: '', maxSales: '', commissionRate: '', isActive: true });
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || `Failed to ${initialData ? 'update' : 'create'} commission slab.`);
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Box */}
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl border transform transition-all overflow-hidden ${
        isDarkMode ? 'bg-gray-900 border-white/5 text-white' : 'bg-white border-gray-100 text-gray-800'
      }`}>
        {/* Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-pink-400 to-purple-500" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
            isDarkMode ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-gray-50 text-gray-500 hover:text-gray-800'
          }`}
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Percent size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-wide">
                {initialData ? 'Update Slab' : 'Create Slab'}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                {initialData ? 'Modify commission details' : 'Add a new commission range'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Min Sales */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <IndianRupee size={11} className="text-primary" /> Minimum Sales (INR)
              </label>
              <input
                required
                type="number"
                name="minSales"
                min="0"
                value={form.minSales}
                onChange={handleChange}
                placeholder="e.g. 500"
                className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 focus:border-primary/50 text-white' 
                    : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                }`}
              />
            </div>

            {/* Max Sales */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <IndianRupee size={11} className="text-primary" /> Maximum Sales (INR)
              </label>
              <input
                required
                type="number"
                name="maxSales"
                min="0"
                value={form.maxSales}
                onChange={handleChange}
                placeholder="e.g. 10000"
                className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 focus:border-primary/50 text-white' 
                    : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                }`}
              />
            </div>

            {/* Commission Rate */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Percent size={11} className="text-primary" /> Commission Rate (%)
              </label>
              <input
                required
                type="number"
                name="commissionRate"
                min="1"
                max="100"
                value={form.commissionRate}
                onChange={handleChange}
                placeholder="e.g. 12"
                className={`w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none border transition-all ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 focus:border-primary/50 text-white' 
                    : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                }`}
              />
            </div>

            {/* Active Toggle (Only shown when editing) */}
            {initialData && (
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100/50 bg-gray-50/50 dark:bg-gray-800/30 dark:border-white/5">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold uppercase tracking-wider">Slab Active Status</span>
                  <span className="text-[10px] text-gray-400 uppercase">Toggle to activate/deactivate this range</span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    form.isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase transition-all ${
                  isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Saving...</>
                ) : (
                  <><Sparkles size={16} /> {initialData ? 'Save Changes' : 'Create Slab'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCommissionSlabModal;
