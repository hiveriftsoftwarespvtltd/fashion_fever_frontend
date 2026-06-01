import React, { useState, useEffect } from 'react';
import { Loader2, X, Camera, Video, TicketPercent, Pencil, Trash2 } from 'lucide-react';
import { toast } from '../../../utils/toast';
import { getUserById, getInfluencerById, deleteCoupon } from '../../../api/adminService';
import { useTheme } from '../../../context/ThemeContext';

/**
 * User Details Modal
 */
export const UserDetailsModal = ({ userId, onClose }) => {
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
            <div className="flex justify-between items-start mb-8 text-left">
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
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl text-left ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
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

            <button onClick={onClose} className="w-full mt-8 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
              Close Profile
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserDetailsModal;
