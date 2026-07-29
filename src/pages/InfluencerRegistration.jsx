import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Video,
  Users,
  Percent,
  FileText,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Music2,
  Link2
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { toast } from '../utils/toast';

/* ─── API helpers ────────────────────────────────────── */
const registerInfluencer = async (payload) => {
  try {
    const res = await apiClient.post('/public-user/onboard-influencer', payload);
    return res.data;
  } catch (err) {
    return err.response?.data || { success: false, message: 'Registration failed.' };
  }
};

// Steps indicator removed as form is now a single cohesive page

const InfluencerRegistration = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
    bio: '',
    followers: '',
    instagram: '',
    youtube: '',
  });

  /* ── If no token in URL — show invalid screen ── */
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center font-outfit px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
            <AlertTriangle size={30} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase text-gray-800">Invalid Link</h1>
            <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">
              This invitation link is invalid. Please contact the admin to receive a new invitation link.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-sm font-black text-gray-400 uppercase tracking-wider">Need help?</p>
            <p className="text-xs font-bold text-gray-600 mt-1">Contact admin to resend your invitation link.</p>
          </div>
          <a href="/" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!form.password) {
      toast.error('Please enter a password.');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!form.bio) {
      toast.error('Please enter your bio.');
      return;
    }
    if (!form.followers) {
      toast.error('Please enter total followers.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        token,
        password: form.password,
        bio: form.bio,
        instagram: form.instagram || '',
        youtube: form.youtube || '',
        followers: Number(form.followers) || 0,
      };
      const res = await registerInfluencer(payload);
      if (res.success) {
        setRegistered(true);
        toast.success(res.message || 'Registration successful!');
      } else {
        // Extract the most descriptive error message possible from the backend
        const errorMsg = res.message || res.data?.message || (res.data && typeof res.data === 'object' && res.data.message) || 'Registration failed.';
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* ─────────────────────────────────── SUCCESS ─── */
  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center font-outfit px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 animate-bounce">
            <CheckCircle2 size={38} className="text-emerald-500" />
          </div>

          <div>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-2">Welcome Aboard!</span>
            <h1 className="text-2xl font-black uppercase text-gray-800">You're All Set!</h1>
            <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">
              Your influencer account has been created successfully. Admin will review and activate your account shortly.
            </p>
          </div>

          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/15 space-y-2 text-left">
            <p className="text-sm font-black text-primary uppercase tracking-wider">What's next?</p>
            {['Admin reviews your profile', 'Account gets activated', 'Start earning commissions!'].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-black flex-shrink-0">{i + 1}</div>
                <p className="text-xs font-bold text-gray-700">{s}</p>
              </div>
            ))}
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
          >
            Go to Homepage <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────── MAIN FORM ─── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 font-outfit">
      {/* Background blobs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 py-10 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-5">
              <Sparkles size={14} className="text-primary" />
              <span className="text-sm font-black text-primary uppercase tracking-widest">Exclusive Invitation</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-800 leading-tight">
              Join as Influencer
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-3 max-w-md mx-auto leading-relaxed">
              Complete your profile to start earning commissions and growing with FashionFever.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
            {/* Card accent bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-pink-400 to-purple-500" />

            <div className="p-6 md:p-10 space-y-8">
              {/* Account Credentials Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Lock size={16} />
                  </div>
                  <h2 className="text-sm font-black uppercase text-gray-800 tracking-wider">Account Credentials</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Lock size={11} className="text-primary" /> Password
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Min. 8 characters"
                        className="w-full px-5 py-4 pr-14 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-300 placeholder:text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <CheckCircle2 size={11} className="text-primary" /> Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        className="w-full px-5 py-4 pr-14 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-300 placeholder:text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Influencer Profile Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <User size={16} />
                  </div>
                  <h2 className="text-sm font-black uppercase text-gray-800 tracking-wider">Profile Information</h2>
                </div>
                <div className="space-y-5">
                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <FileText size={11} className="text-purple-500" /> Your Bio
                    </label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe yourself as a beauty influencer — your niche, audience, and style..."
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/10 transition-all placeholder:text-gray-300 placeholder:text-xs resize-none"
                    />
                  </div>

                  {/* Followers */}
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Users size={11} className="text-purple-500" /> Total Followers
                    </label>
                    <input
                      name="followers"
                      type="number"
                      min="0"
                      value={form.followers}
                      onChange={handleChange}
                      placeholder="e.g. 50000"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/10 transition-all placeholder:text-gray-300 placeholder:text-xs"
                    />
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Combined across all platforms</p>
                  </div>
                </div>
              </div>

              {/* Social Channels Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                    <Camera size={16} />
                  </div>
                  <h2 className="text-sm font-black uppercase text-gray-800 tracking-wider">Social Handles</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Instagram */}
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Camera size={11} className="text-pink-500" /> Instagram
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">@</span>
                      <input
                        name="instagram"
                        type="text"
                        value={form.instagram}
                        onChange={handleChange}
                        placeholder="yourhandle"
                        className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-pink-500/30 focus:ring-2 focus:ring-pink-500/10 transition-all placeholder:text-gray-300 placeholder:text-xs"
                      />
                    </div>
                  </div>

                  {/* YouTube */}
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Video size={11} className="text-red-500" /> YouTube Channel
                    </label>
                    <input
                      name="youtube"
                      type="text"
                      value={form.youtube}
                      onChange={handleChange}
                      placeholder="youtube.com/yourchannel"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-red-500/30 focus:ring-2 focus:ring-red-500/10 transition-all placeholder:text-gray-300 placeholder:text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20 hover:opacity-95 active:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-6"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                  : <><Sparkles size={16} /> Complete Registration</>
                }
              </button>
            </div>
          </div>

          <p className="text-center text-sm font-bold text-gray-400 uppercase mt-8 pb-8">
            By registering, you agree to FashionFever's{' '}
            <span className="text-primary cursor-pointer hover:underline">Influencer Terms & Conditions</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfluencerRegistration;
