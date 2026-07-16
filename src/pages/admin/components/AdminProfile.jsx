import React, { useState, useEffect } from 'react';
import { User, Mail, ShieldCheck, Calendar, KeyRound, Loader2, Phone, Award } from 'lucide-react';
import { getAdminProfile } from '../../../api/adminService';

const AdminProfile = ({ isDarkMode }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getAdminProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Loader2 className="animate-spin text-primary mb-4" size={36} />
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Fetching your profile details...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`p-12 text-center rounded-3xl border ${isDarkMode ? 'bg-gray-950 border-white/5' : 'bg-white border-gray-150'}`}>
        <User size={40} className="text-gray-300 mx-auto mb-4" />
        <p className="text-sm font-bold text-gray-400">Failed to load profile details</p>
      </div>
    );
  }

  const { user, adminAccess, roleTitle } = profile;

  return (
    <div className="space-y-6 max-w-4xl text-left animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white uppercase flex items-center gap-2">
          <User className="text-primary" size={22} /> My Profile
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-bold">
          Manage your personal information and view assigned access levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar Card */}
        <div className={`p-8 rounded-[2rem] border text-center flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
          isDarkMode ? 'bg-gray-955 border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-gray-150 shadow-sm'
        }`}>
          {/* Visual Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-pink-500" />
          
          <div className="w-24 h-24 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl mb-4 border border-primary/20 shadow-inner">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
          </div>

          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
            {user?.name || 'Admin User'}
          </h2>
          <p className="text-xs font-semibold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/10">
            {roleTitle || (user?.roles?.includes('super_admin') ? 'Super Admin' : 'Admin')}
          </p>

          <div className="w-full border-t border-gray-100 dark:border-white/5 mt-6 pt-6 text-left space-y-4">
            <div className="flex items-center gap-3">
              <Calendar size={15} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Joined On</p>
                <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mt-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={15} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Account Status</p>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-green-500 mt-1">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Account Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Details */}
          <div className={`p-8 rounded-[2rem] border transition-all duration-300 ${
            isDarkMode ? 'bg-gray-955 border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-gray-150 shadow-sm'
          }`}>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-6 border-b pb-3 border-gray-100 dark:border-white/5">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                  <User size={12} /> Full Name
                </p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {user?.name || 'N/A'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                  <Mail size={12} /> Email Address
                </p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 break-all">
                  {user?.email || 'N/A'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                  <Phone size={12} /> Phone Number
                </p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {user?.phone || 'N/A'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                  <Award size={12} /> Assigned Roles
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {user?.roles?.map((r, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-150 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Permissions / Module Access */}
          <div className={`p-8 rounded-[2rem] border transition-all duration-300 ${
            isDarkMode ? 'bg-gray-955 border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-gray-150 shadow-sm'
          }`}>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-6 border-b pb-3 border-gray-100 dark:border-white/5">
              Assigned Permissions & Modules
            </h3>

            {user?.roles?.includes('super_admin') ? (
              <div className="p-4 rounded-xl bg-primary/5 text-primary text-xs font-bold flex items-center gap-2 border border-primary/10">
                <ShieldCheck size={18} />
                Full System Control Granted (Super Admin permissions bypass limits).
              </div>
            ) : Array.isArray(adminAccess) && adminAccess.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {adminAccess.map((access, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      isDarkMode ? 'bg-gray-900 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'
                    }`}
                  >
                    <span className="text-xs font-black uppercase text-gray-700 dark:text-gray-300">
                      {access.module}
                    </span>
                    <div className="flex gap-1">
                      {access.access?.map((perm, pIdx) => (
                        <span 
                          key={pIdx}
                          className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/10"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/5 text-xs text-gray-400 font-bold flex items-center gap-2">
                <KeyRound size={18} />
                No custom modules assigned yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
