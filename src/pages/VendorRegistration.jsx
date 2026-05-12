import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Type, 
  FileText, 
  Image as ImageIcon, 
  Upload,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Globe
} from 'lucide-react';
import { registerVendor } from '../api/vendorService';
import toast from 'react-hot-toast';

const VendorRegistration = () => {
  const [loading, setLoading] = useState(false);

  // Redirect if already registered
  React.useEffect(() => {
    const session = JSON.parse(localStorage.getItem('user_session'));
    if (session?.user?.vendorId) {
      window.location.href = '/vendor/dashboard';
    }
  }, []);
  const [formData, setFormData] = useState({
    businessName: '',
    slug: '',
    description: '',
    address: '',
    phone: '',
    email: '',
  });
  const [files, setFiles] = useState({
    logo: null,
    banner: null,
  });
  const [previews, setPreviews] = useState({
    logo: null,
    banner: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from business name
    if (name === 'businessName') {
      const generatedSlug = value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      setFiles(prev => ({ ...prev, [name]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (files.logo) data.append('logo', files.logo);
      if (files.banner) data.append('banner', files.banner);

      const response = await registerVendor(data);

      if (response.success) {
        toast.success('Vendor registered successfully!');
        // Redirect to dashboard or success page
        setTimeout(() => {
          window.location.href = '/vendor/dashboard';
        }, 2000);
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6 animate-bounce">
            <Store size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 uppercase">Vendor Registration</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Scale your beauty business with WAKEUP. Fill in your business details below to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Core Info */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-12 border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10"></div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">1</span>
              Business Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <Type size={14} className="text-primary" /> Business Name
                </label>
                <input
                  name="businessName"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300"
                  placeholder="e.g. Glamour Cosmetics"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <Globe size={14} className="text-primary" /> Store URL Slug
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">@</span>
                  <input
                    name="slug"
                    type="text"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300"
                    placeholder="glamour-cosmetics"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <FileText size={14} className="text-primary" /> Description
                </label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300 resize-none"
                  placeholder="Tell us about your brand and products..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-12 border border-gray-100 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-10 -mt-10"></div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-sm">2</span>
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <Mail size={14} className="text-blue-500" /> Business Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-300"
                  placeholder="contact@yourbusiness.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <Phone size={14} className="text-blue-500" /> Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-300"
                  placeholder="+91 00000 00000"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <MapPin size={14} className="text-blue-500" /> Physical Address
                </label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-300 resize-none"
                  placeholder="Full business or office address..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Branding Assets */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-12 border border-gray-100 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full -mr-10 -mt-10"></div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center text-sm">3</span>
              Store Branding
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Logo Upload */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <ImageIcon size={14} className="text-orange-500" /> Brand Logo
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all ${previews.logo ? 'border-orange-500 bg-orange-50/10' : 'border-gray-200 hover:border-orange-400 hover:bg-gray-50'}`}>
                    {previews.logo ? (
                      <div className="relative w-full h-full">
                        <img src={previews.logo} alt="Logo preview" className="w-full h-full object-contain rounded-2xl" />
                        <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload className="text-white" size={24} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-400 text-center">Click to upload Logo</p>
                        <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Banner Upload */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <ImageIcon size={14} className="text-orange-500" /> Store Banner
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    name="banner"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all h-[calc(100%-2rem)] ${previews.banner ? 'border-orange-500 bg-orange-50/10' : 'border-gray-200 hover:border-orange-400 hover:bg-gray-50'}`}>
                    {previews.banner ? (
                      <div className="relative w-full h-full">
                        <img src={previews.banner} alt="Banner preview" className="w-full h-full object-cover rounded-2xl" />
                        <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload className="text-white" size={24} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-400 text-center">Click to upload Banner</p>
                        <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase">Landscape orientation preferred</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 py-5 bg-primary text-white rounded-3xl font-bold uppercase text-sm hover:bg-primary-hover shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-10 py-5 bg-white text-gray-400 rounded-3xl font-bold uppercase text-sm hover:bg-gray-50 border border-gray-100 transition-all"
            >
              Skip for later
            </button>
          </div>
        </form>

        <p className="mt-12 text-center text-xs font-bold text-gray-400 uppercase pb-12">
          By registering, you agree to WAKEUP's <span className="text-primary cursor-pointer hover:underline">Vendor Terms & Conditions</span>
        </p>
      </div>
    </div>
  );
};

export default VendorRegistration;
