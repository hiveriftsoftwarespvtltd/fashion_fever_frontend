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

/* ─── Step indicator ─────────────────────────────────── */
const steps = [
  { id: 1, label: 'Account' },
  { id: 2, label: 'Profile' },
  { id: 3, label: 'Social' },
];

const InfluencerRegistration = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    followers: '',
    commissionRate: 10,
    instagram: '',
    youtube: '',
    tiktok: '',
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
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Need help?</p>
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
            <p className="text-[10px] font-black text-primary uppercase tracking-wider">What's next?</p>
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
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Exclusive Invitation</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-800 leading-tight">
              Join as Influencer
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-3 max-w-md mx-auto leading-relaxed">
              Complete your profile to start earning commissions and growing with WAKEUP MAKEUP.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-0 mb-10">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                    step > s.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : step === s.id ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-110'
                    : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${step === s.id ? 'text-primary' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mb-5 mx-1 transition-all duration-500 ${step > s.id ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
            {/* Card accent bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-pink-400 to-purple-500" />

            <div className="p-6 md:p-10">

              {/* ── STEP 1: Account ── */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-base font-black uppercase text-gray-800">Account Details</h2>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Set up your login credentials</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <User size={11} className="text-primary" /> Full Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-300 placeholder:text-xs"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Mail size={11} className="text-primary" /> Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-300 placeholder:text-xs"
                      />

                    </div>

                    {/* Password */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Lock size={11} className="text-primary" /> Create Password
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
                  </div>

                  <button
                    onClick={() => {
                      if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields.'); return; }
                      if (form.password.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
                      setStep(2);
                    }}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20 hover:opacity-95 active:opacity-90 transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* ── STEP 2: Profile ── */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                      <Camera size={18} className="text-purple-500" />
                    </div>
                    <div>
                      <h2 className="text-base font-black uppercase text-gray-800">Influencer Profile</h2>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Tell us about yourself</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Bio */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Followers */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
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

                      {/* Commission Rate */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                          <Percent size={11} className="text-purple-500" /> Expected Commission (%)
                        </label>
                        <input
                          name="commissionRate"
                          type="number"
                          min="0"
                          max="100"
                          value={form.commissionRate}
                          onChange={handleChange}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/10 transition-all"
                        />
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Admin may adjust final rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-shrink-0 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-4 bg-purple-500 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-purple-500/20 hover:opacity-95 active:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Social Links ── */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                      <Camera size={18} className="text-pink-500" />
                    </div>
                    <div>
                      <h2 className="text-base font-black uppercase text-gray-800">Social Handles</h2>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Link your platforms (optional)</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Instagram */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
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
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
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

                    {/* TikTok */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Music2 size={11} className="text-gray-500" /> TikTok
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">@</span>
                        <input
                          name="tiktok"
                          type="text"
                          value={form.tiktok}
                          onChange={handleChange}
                          placeholder="yourhandle"
                          className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-gray-300/50 focus:ring-2 focus:ring-gray-200/50 transition-all placeholder:text-gray-300 placeholder:text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary box */}
                  <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl p-5 border border-primary/10 space-y-3">
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">Registration Summary</p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-600">
                      <span className="text-gray-400 uppercase text-[9px]">Name</span><span className="truncate">{form.name || '—'}</span>
                      <span className="text-gray-400 uppercase text-[9px]">Email</span><span className="truncate">{form.email || '—'}</span>
                      <span className="text-gray-400 uppercase text-[9px]">Followers</span><span>{form.followers ? Number(form.followers).toLocaleString('en-IN') : '—'}</span>
                      <span className="text-gray-400 uppercase text-[9px]">Commission</span><span>{form.commissionRate}%</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-shrink-0 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      disabled={loading}
                      onClick={handleSubmit}
                      className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20 hover:opacity-95 active:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading
                        ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                        : <><Sparkles size={16} /> Complete Registration</>
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-[10px] font-bold text-gray-400 uppercase mt-8 pb-8">
            By registering, you agree to WAKEUP's{' '}
            <span className="text-primary cursor-pointer hover:underline">Influencer Terms & Conditions</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfluencerRegistration;
