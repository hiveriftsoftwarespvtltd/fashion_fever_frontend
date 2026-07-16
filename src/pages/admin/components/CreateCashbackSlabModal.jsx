import React, { useState, useEffect } from 'react';
import { X, Percent, IndianRupee, Sparkles, Loader2 } from 'lucide-react';
import { createCashbackSlab, updateCashbackSlab } from '../../../api/adminService';
import { toast } from '../../../utils/toast';

const CreateCashbackSlabModal = ({ isOpen, onClose, onSuccess, isDarkMode, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    minValue: '',
    maxValue: '',
    cashbackValue: '',
    cashbackType: 'FIXED',
    maxCashback: '',
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        minValue: initialData.minValue ?? '',
        maxValue: initialData.maxValue ?? '',
        cashbackValue: initialData.cashbackValue ?? '',
        cashbackType: initialData.cashbackType ?? 'FIXED',
        maxCashback: initialData.maxCashback ?? '',
        isActive: initialData.isActive ?? true,
      });
    } else {
      setForm({
        minValue: '',
        maxValue: '',
        cashbackValue: '',
        cashbackType: 'FIXED',
        maxCashback: '',
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const minVal = Number(form.minValue);
    const maxVal = Number(form.maxValue);
    const cashbackVal = Number(form.cashbackValue);
    const maxCash = form.maxCashback ? Number(form.maxCashback) : 0;

    if (isNaN(minVal) || minVal < 0) {
      toast.error('Minimum value must be a valid positive number.');
      return;
    }
    if (isNaN(maxVal) || maxVal < minVal) {
      toast.error('Maximum value must be greater than or equal to minimum value.');
      return;
    }
    if (isNaN(cashbackVal) || cashbackVal <= 0) {
      toast.error('Cashback value must be a positive number.');
      return;
    }
    if (form.cashbackType === 'PERCENTAGE' && cashbackVal > 100) {
      toast.error('Percentage cashback rate cannot exceed 100%.');
      return;
    }
    if (form.cashbackType === 'PERCENTAGE' && (isNaN(maxCash) || maxCash <= 0)) {
      toast.error('Maximum cashback limit is required for percentage cashback.');
      return;
    }

    setLoading(true);
    const payload = {
      minValue: minVal,
      maxValue: maxVal,
      cashbackValue: cashbackVal,
      cashbackType: form.cashbackType,
      maxCashback: form.cashbackType === 'PERCENTAGE' ? maxCash : cashbackVal,
      isActive: form.isActive,
    };

    try {
      let res;
      if (initialData?._id) {
        res = await updateCashbackSlab(initialData._id, payload);
      } else {
        res = await createCashbackSlab(payload);
      }

      if (res.success) {
        toast.success(res.message || (initialData ? 'Cashback slab updated successfully!' : 'Cashback slab created successfully!'));
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || `Failed to ${initialData ? 'update' : 'create'} cashback slab.`);
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
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl border transform transition-all flex flex-col max-h-[90vh] overflow-hidden ${
        isDarkMode ? 'bg-gray-900 border-white/5 text-white' : 'bg-white border-gray-100 text-gray-800'
      }`}>
        {/* Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-pink-400 to-purple-500 flex-shrink-0" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors z-10 ${
            isDarkMode ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-gray-50 text-gray-500 hover:text-gray-800'
          }`}
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Percent size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-wide">
                {initialData ? 'Update Cashback Slab' : 'Create Cashback Slab'}
              </h3>
              <p className="text-sm font-bold text-gray-400 uppercase">
                {initialData ? 'Modify cashback rule parameters' : 'Define new wallet load incentive'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Load Range: Min Value */}
            <div className="space-y-1.5">
              <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <IndianRupee size={11} className="text-primary" /> Minimum Load Value (INR)
              </label>
              <input
                required
                type="number"
                name="minValue"
                min="0"
                value={form.minValue}
                onChange={handleChange}
                placeholder="e.g. 1000"
                className={`w-full px-5 py-3 rounded-2xl text-sm font-medium outline-none border transition-all ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 focus:border-primary/50 text-white' 
                    : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                }`}
              />
            </div>

            {/* Load Range: Max Value */}
            <div className="space-y-1.5">
              <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <IndianRupee size={11} className="text-primary" /> Maximum Load Value (INR)
              </label>
              <input
                required
                type="number"
                name="maxValue"
                min="0"
                value={form.maxValue}
                onChange={handleChange}
                placeholder="e.g. 2000"
                className={`w-full px-5 py-3 rounded-2xl text-sm font-medium outline-none border transition-all ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 focus:border-primary/50 text-white' 
                    : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                }`}
              />
            </div>

            {/* Cashback Type Dropdown */}
            <div className="space-y-1.5">
              <label className="text-sm font-black uppercase tracking-wider text-gray-400">
                Cashback Type
              </label>
              <select
                name="cashbackType"
                value={form.cashbackType}
                onChange={handleChange}
                className={`w-full px-5 py-3 rounded-2xl text-sm font-medium outline-none border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 focus:border-primary/50 text-white' 
                    : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                }`}
              >
                <option value="FIXED">FIXED (Flat Amount)</option>
                <option value="PERCENTAGE">PERCENTAGE (Fractional)</option>
              </select>
            </div>

            {/* Cashback Value */}
            <div className="space-y-1.5">
              <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                {form.cashbackType === 'PERCENTAGE' ? <Percent size={11} className="text-primary" /> : <IndianRupee size={11} className="text-primary" />} 
                Cashback Value ({form.cashbackType === 'PERCENTAGE' ? '%' : 'Flat ₹'})
              </label>
              <input
                required
                type="number"
                name="cashbackValue"
                min="1"
                value={form.cashbackValue}
                onChange={handleChange}
                placeholder={form.cashbackType === 'PERCENTAGE' ? 'e.g. 10' : 'e.g. 200'}
                className={`w-full px-5 py-3 rounded-2xl text-sm font-medium outline-none border transition-all ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 focus:border-primary/50 text-white' 
                    : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                }`}
              />
            </div>

            {/* Max Cashback Limit (Only for Percentage Type) */}
            {form.cashbackType === 'PERCENTAGE' && (
              <div className="space-y-1.5">
                <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <IndianRupee size={11} className="text-primary" /> Max Cashback Cap (INR)
                </label>
                <input
                  required
                  type="number"
                  name="maxCashback"
                  min="1"
                  value={form.maxCashback}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  className={`w-full px-5 py-3 rounded-2xl text-sm font-medium outline-none border transition-all ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700 focus:border-primary/50 text-white' 
                      : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                  }`}
                />
              </div>
            )}

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100/50 bg-gray-50/50 dark:bg-gray-800/30 dark:border-white/5">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold uppercase tracking-wider">Slab Active Status</span>
                <span className="text-sm text-gray-400 uppercase">Toggle to enable/disable</span>
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

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase transition-all ${
                  isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
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

export default CreateCashbackSlabModal;
