import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Ticket, Wallet, ShoppingBag, Heart, CreditCard,
  LogOut, ChevronRight, Loader2, Camera, Trash2, Mail,
  Shield, Calendar, CheckCircle2, AlertTriangle, Key,
  Pencil, Phone, X, Check, MapPin
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getUserDetails, uploadUserAvatar, getUserAvatar, deleteUserAvatar, editUserDetails } from '../api/authService';
import toast from 'react-hot-toast';

const AVATAR_KEY = 'wakeup_avatar_url';

const Profile = () => {
  const navigate = useNavigate();
  const { user: contextUser, isLoading: isAuthLoading, token, updateUser, logout } = useUser();

  const [profileData, setProfileData]   = useState(null);
  const [avatarUrl, setAvatarUrl]       = useState(() => localStorage.getItem(AVATAR_KEY) || '');
  const [isLoading, setIsLoading]       = useState(true);
  const [isUploading, setIsUploading]   = useState(false);
  const [isEditing, setIsEditing]       = useState(false);
  const [isSaving, setIsSaving]         = useState(false);
  const [editForm, setEditForm]         = useState({ name: '', phone: '' });
  const fileInputRef = useRef(null);

  /* ─── helpers ─────────────────────────────────────────────── */
  const persistAvatar = (url) => {
    if (url) localStorage.setItem(AVATAR_KEY, url);
    else     localStorage.removeItem(AVATAR_KEY);
    setAvatarUrl(url);
  };

  /* ─── fetch ────────────────────────────────────────────────── */
  const fetchProfileDetails = async () => {
    setIsLoading(true);
    try {
      const detailsRes = await getUserDetails();
      if (detailsRes?.success) setProfileData(detailsRes.data);
      else                     setProfileData(contextUser);

      const avatarRes  = await getUserAvatar();
      let fetchedUrl   = '';
      if      (avatarRes?.data?.data?.avatar?.url) fetchedUrl = avatarRes.data.data.avatar.url;
      else if (avatarRes?.data?.avatar?.url)       fetchedUrl = avatarRes.data.avatar.url;
      else if (avatarRes?.avatar?.url)             fetchedUrl = avatarRes.avatar.url;

      if (fetchedUrl) {
        persistAvatar(fetchedUrl);
        if (updateUser) updateUser({ avatar: fetchedUrl });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      if (token) fetchProfileDetails();
      else       setIsLoading(false);
    }
  }, [isAuthLoading, token]);

  /* ─── avatar upload ────────────────────────────────────────── */
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/'))    { toast.error('Please upload an image file.'); return; }
    if (file.size > 5 * 1024 * 1024)       { toast.error('File size must be under 5MB.');  return; }

    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);
    const t = toast.loading('Uploading photo...');
    try {
      const res = await uploadUserAvatar(formData);
      if (res?.success) {
        toast.success('Photo updated!', { id: t });
        let newUrl = '';
        if      (res?.data?.data?.data && typeof res.data.data.data === 'string') newUrl = res.data.data.data;
        else if (res?.data?.data       && typeof res.data.data       === 'string') newUrl = res.data.data;
        else if (res?.data             && typeof res.data            === 'string') newUrl = res.data;

        if (newUrl) { persistAvatar(newUrl); if (updateUser && profileData) updateUser({ ...profileData, avatar: newUrl }); }
        else        await fetchProfileDetails();
      } else {
        toast.error(res?.message || 'Upload failed.', { id: t });
      }
    } catch { toast.error('Upload error.', { id: t }); }
    finally  { setIsUploading(false); }
  };

  /* ─── avatar delete ────────────────────────────────────────── */
  const handleAvatarDelete = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-gray-800">Remove profile photo?</p>
        <div className="flex gap-2">
          <button onClick={async () => {
            toast.dismiss(t.id);
            setIsUploading(true);
            const dt = toast.loading('Removing...');
            try {
              const res = await deleteUserAvatar();
              if (res?.success) {
                toast.success('Photo removed.', { id: dt });
                persistAvatar('');
                if (updateUser && profileData) updateUser({ ...profileData, avatar: '' });
              } else toast.error(res?.message || 'Delete failed.', { id: dt });
            } catch { toast.error('Error removing photo.', { id: dt }); }
            finally  { setIsUploading(false); }
          }} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">
            Yes, Remove
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 8000 });
  };

  /* ─── edit save ────────────────────────────────────────────── */
  const handleSaveDetails = async () => {
    if (!editForm.name.trim()) { toast.error('Name cannot be empty.'); return; }
    setIsSaving(true);
    try {
      const payload = {};
      if (editForm.name.trim())  payload.name  = editForm.name.trim();
      if (editForm.phone.trim()) payload.phone = editForm.phone.trim();
      const res = await editUserDetails(payload);
      if (res?.success) {
        const updated = res.data?.data || res.data;
        toast.success('Profile updated!');
        setProfileData(prev => ({ ...prev, ...updated }));
        if (updateUser) updateUser({ name: updated.name, phone: updated.phone });
        setIsEditing(false);
      } else toast.error(res?.message || 'Update failed.');
    } catch { toast.error('Save error.'); }
    finally  { setIsSaving(false); }
  };

  /* ─── logout ───────────────────────────────────────────────── */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* ─── sidebar links ────────────────────────────────────────── */
  const sidebarLinks = [
    { icon: <User size={18} />,        label: 'My Profile',       path: '/profile',  active: true },
    { icon: <MapPin size={18} />,      label: 'My Addresses',     path: '/address' },
    { icon: <Ticket size={18} />,      label: 'My Coupons',       path: '/coupons' },
    { icon: <Wallet size={18} />,      label: 'My Wallet',        path: '/wallet' },
    { icon: <ShoppingBag size={18} />, label: 'My Orders',        path: '/my-appointments' },
    { icon: <Heart size={18} />,       label: 'My Wishlist',      path: '/wishlist' },
    { icon: <CreditCard size={18} />,  label: 'My Saved Payment', path: '/payments' },
  ];

  /* ─── derived ──────────────────────────────────────────────── */
  const nameLetter = profileData?.name?.charAt(0)?.toUpperCase() || 'U';

  /* ─── loading skeleton ─────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="bg-[#f3f3f3] min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-10 font-outfit">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 italic">My Profile</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left Sidebar ─────────────────────────────────── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col">
                {sidebarLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className={`flex items-center justify-between px-6 py-4 transition-all border-b border-gray-50 last:border-0 group ${
                      link.active
                        ? 'bg-white text-primary border-r-4 border-r-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={link.active ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}>
                        {link.icon}
                      </span>
                      <span className="text-xs font-bold uppercase">{link.label}</span>
                    </div>
                  </Link>
                ))}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-6 py-4 transition-all text-red-500 hover:bg-red-50 group w-full text-left"
                >
                  <LogOut size={18} />
                  <span className="text-xs font-bold uppercase">Log Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Right Content ─────────────────────────────────── */}
          <div className="flex-grow space-y-6">

            {/* Avatar + Name card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Cover banner */}
              <div className="h-32 bg-gradient-to-r from-primary/10 via-pink-50 to-primary/5" />

              <div className="px-8 pb-8 -mt-16">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">

                  {/* Avatar */}
                  <div className="relative group w-28 h-28 rounded-2xl overflow-hidden bg-white p-1 shadow-xl border border-gray-100 flex-shrink-0">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 relative flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={profileData?.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center text-white text-3xl font-extrabold">
                          {nameLetter}
                        </div>
                      )}
                      {/* hover overlay */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white cursor-pointer"
                      >
                        <Camera size={18} />
                        <span className="text-[8px] font-bold uppercase">Change</span>
                      </button>
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="animate-spin text-white" size={22} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name & role */}
                  <div className="flex-grow text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-2xl font-extrabold text-gray-900 uppercase leading-none">
                        {profileData?.name}
                      </h1>
                      <span className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {profileData?.role || 'User'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">{profileData?.email}</p>
                  </div>

                  {/* Upload / delete buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Camera size={13} /> Upload Photo
                    </button>
                    {avatarUrl && (
                      <button
                        onClick={handleAvatarDelete}
                        disabled={isUploading}
                        className="bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-100 p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        title="Remove photo"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => { setEditForm({ name: profileData?.name || '', phone: profileData?.phone || '' }); setIsEditing(true); }}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 px-3 py-2 rounded-lg transition-all cursor-pointer"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={handleSaveDetails} disabled={isSaving}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-white bg-primary hover:bg-primary-hover px-3 py-2 rounded-lg transition-all cursor-pointer disabled:opacity-60">
                      {isSaving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} Save
                    </button>
                    <button onClick={() => setIsEditing(false)} disabled={isSaving}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-500 border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all cursor-pointer disabled:opacity-60">
                      <X size={11} /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <User size={16} />
                  </div>
                  <div className="flex-grow">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                    {isEditing ? (
                      <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Enter full name"
                        className="mt-1 w-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 outline-none transition-all bg-gray-50/50" />
                    ) : (
                      <p className="text-sm font-bold text-gray-800 uppercase mt-0.5">{profileData?.name}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div className="flex-grow">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                    {isEditing ? (
                      <input type="tel" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="Enter phone number"
                        className="mt-1 w-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 outline-none transition-all bg-gray-50/50" />
                    ) : (
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{profileData?.phone || <span className="text-gray-400 font-medium normal-case text-xs">Not provided</span>}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="flex-grow">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">{profileData?.email}</p>
                  </div>
                  {profileData?.isEmailVerified ? (
                    <span className="flex items-center gap-1 bg-green-50 border border-green-100 text-green-600 px-2 py-1 rounded-full text-[9px] font-black uppercase self-start mt-5">
                      <CheckCircle2 size={9} /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-600 px-2 py-1 rounded-full text-[9px] font-black uppercase self-start mt-5">
                      <AlertTriangle size={9} /> Unverified
                    </span>
                  )}
                </div>

                {/* Joined */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Member Since</label>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">
                      {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-4 mb-5 flex items-center gap-2">
                <Key size={14} className="text-primary" /> Account Security
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Authentication</label>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {profileData?.authTypes?.map(type => (
                      <span key={type} className="bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{type}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Account Status</label>
                  <p className="text-xs font-bold text-green-600 uppercase mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Active
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Role</label>
                  <p className="text-xs font-bold text-primary uppercase mt-2">{profileData?.role || 'User'}</p>
                </div>
              </div>
            </div>

            {/* Become a Vendor card */}
            {profileData?.role === 'user' && !profileData?.isVendorOnboardingCompleted && (
              <div className="bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl shadow-lg shadow-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-1">Want to sell on WAKEUP?</h3>
                  <p className="text-[10px] font-medium uppercase opacity-80">Become a registered merchant and list your products or beauty services!</p>
                </div>
                <button
                  onClick={() => toast.success('Opening Merchant Application...')}
                  className="flex-shrink-0 bg-white text-primary text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
                >
                  Apply as Vendor
                </button>
              </div>
            )}

          </div>{/* end right */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
