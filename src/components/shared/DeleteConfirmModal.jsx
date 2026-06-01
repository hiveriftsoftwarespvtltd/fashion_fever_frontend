import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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

export default DeleteConfirmModal;
