import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShoppingBag, 
  Zap, 
  Calendar, 
  GraduationCap, 
  Users, 
  RefreshCw, 
  Scale, 
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Mail,
  HelpCircle
} from 'lucide-react';

const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState('account');

  const sections = [
    { id: 'account', title: '1. User Account Agreement', icon: <FileText size={18} /> },
    { id: 'ecommerce', title: '2. E-Commerce Purchases', icon: <ShoppingBag size={18} /> },
    { id: 'quick', title: '3. 10-Min Quick Delivery', icon: <Zap size={18} /> },
    { id: 'bookings', title: '4. Salon & Spa Bookings', icon: <Calendar size={18} /> },
    { id: 'academy', title: '5. Academy & Masterclasses', icon: <GraduationCap size={18} /> },
    { id: 'creators', title: '6. Vendor & Creator Terms', icon: <Users size={18} /> },
    { id: 'refunds', title: '7. Cancellations & Refunds', icon: <RefreshCw size={18} /> },
    { id: 'law', title: '8. Governing Law & Jurisdiction', icon: <Scale size={18} /> },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20 font-outfit text-left">
      {/* ── 1. Hero Header Banner ── */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-rose-950 text-white py-14 px-4 sm:px-6 lg:px-8 mb-10 relative overflow-hidden shadow-lg">
        {/* Background Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-rose-300 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white">Terms & Conditions</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase">
                Terms & Conditions
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-2xl mt-2 leading-relaxed">
                Please review these Terms and Conditions carefully. They govern your use of FashionFever (WakeUp MakeUp) services, shop orders, salon bookings, and quick delivery.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <Scale size={16} className="text-rose-400" />
                <span>Legally Binding Agreement</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Last Updated: July 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Main Terms Content Layout ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sticky Navigation Sidebar (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm text-left">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-2">
                Table of Contents
              </h3>
              <div className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-rose-50 text-primary border border-rose-200/80 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <span className={activeSection === sec.id ? 'text-primary' : 'text-slate-400'}>
                      {sec.icon}
                    </span>
                    <span className="truncate">{sec.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legal Support Box */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-100/60 rounded-3xl p-6 border border-rose-200/80 shadow-sm text-left space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                <HelpCircle size={20} />
              </div>
              <h4 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                Need Legal Clarification?
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Contact our legal compliance team for inquiries regarding terms, partner agreements, or merchant policies.
              </p>
              <a
                href="mailto:legal@fashionfever.in"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-primary hover:underline pt-1"
              >
                <Mail size={14} /> legal@fashionfever.in
              </a>
            </div>
          </div>

          {/* Main Detail Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-8 text-left">
            
            {/* Intro Alert Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-wider">
                <ShieldAlert size={18} />
                <span>Agreement Overview</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                By accessing or using the <strong>FashionFever (WakeUp MakeUp)</strong> website, mobile applications, marketplace, or booking portals, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue platform use immediately.
              </p>
            </div>

            {/* Section 1: User Account Agreement */}
            <section id="account" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-rose-50 text-primary rounded-2xl">
                  <FileText size={20} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-wide">1. User Account & Eligibility</h2>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                To create an account on FashionFever, you must be at least 18 years of age or possess legal parental consent.
              </p>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium list-disc pl-5">
                <li>You are responsible for maintaining the confidentiality of your account password and OTP credentials.</li>
                <li>Each user account is non-transferable and intended solely for individual or authorized business use.</li>
                <li>FashionFever reserves the right to suspend or terminate accounts found guilty of fraudulent activity, false bookings, or abuse.</li>
              </ul>
            </section>

            {/* Section 2: E-Commerce Purchases */}
            <section id="ecommerce" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-rose-50 text-primary rounded-2xl">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-wide">2. E-Commerce & Product Purchases</h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                All cosmetic products listed on FashionFever are 100% authentic, sourced directly from verified brand manufacturers or authorized distributors.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <h4 className="text-xs font-black uppercase text-slate-800">Pricing & Taxes</h4>
                  <p className="text-xs text-slate-500 font-medium">All prices listed on the platform are inclusive of GST taxes unless specified otherwise. Prices are subject to promotional discounts.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <h4 className="text-xs font-black uppercase text-slate-800">Order Acceptance</h4>
                  <p className="text-xs text-slate-500 font-medium">Order confirmation emails or SMS do not signify final order acceptance. We reserve the right to decline orders in case of stock unavailability.</p>
                </div>
              </div>
            </section>

            {/* Section 3: 10-Min Quick Delivery */}
            <section id="quick" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-rose-50 text-primary rounded-2xl">
                  <Zap size={20} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-wide">3. 10-Minute Quick E-Commerce Delivery</h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Our <strong>10-Minute Lightning Delivery</strong> operates within active dark-store coverage zones and designated pincodes.
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium list-disc pl-5">
                <li>Delivery times (10-15 mins) are estimates computed under normal weather, traffic, and store operation conditions.</li>
                <li>Riders will attempt to contact the buyer at the provided address upon arrival. Unresponsive orders will be held at local hubs.</li>
                <li>Standard delivery fees and packing charges are clearly itemized in your Express Bag summary before order placement.</li>
              </ul>
            </section>

            {/* Section 4: Salon & Spa Bookings */}
            <section id="bookings" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-rose-50 text-primary rounded-2xl">
                  <Calendar size={20} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-wide">4. Salon, Spa & Stylist Bookings</h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                FashionFever connects users with verified salon venues and independent beauty service providers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>Arrive 10 minutes prior to your booked salon appointment slot.</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>Salon-at-home services require a clean working space & water access.</span>
                </div>
              </div>
            </section>

            {/* Section 5: Academy & Masterclasses */}
            <section id="academy" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-rose-50 text-primary rounded-2xl">
                  <GraduationCap size={20} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-wide">5. Academy & Course Content Rights</h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Enrolling in FashionFever Pro Academy masterclasses grants you a non-transferable, single-user license to access video tutorials and learning materials.
              </p>

              <p className="text-xs text-rose-600 font-extrabold uppercase tracking-wider bg-rose-50 border border-rose-200/80 p-3 rounded-2xl">
                ⚠️ Screen recording, unauthorized distribution, or re-selling of Academy video content is strictly illegal and subject to copyright prosecution.
              </p>
            </section>

            {/* Section 6: Vendor & Creator Terms */}
            <section id="creators" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-rose-50 text-primary rounded-2xl">
                  <Users size={20} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-wide">6. Vendor & Creator Partner Terms</h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Vendors, Service Providers, Educators, and Influencers operating on FashionFever must adhere to partner commission slabs, product quality standards, and bank payout verification protocols.
              </p>
            </section>

            {/* Section 7: Cancellations & Refunds */}
            <section id="refunds" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-rose-50 text-primary rounded-2xl">
                  <RefreshCw size={20} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-wide">7. Cancellations & Refund Policy</h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <strong>Products & Cosmetics:</strong> Returns/replacements accepted within 7 days of delivery for sealed, undamaged, or defective items.
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <strong>Salon Appointments:</strong> Free cancellation up to 2 hours prior to slot time. Late cancellations may incur a 15% slot fee.
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <strong>Refund Disbursal:</strong> Approved refunds are processed back to your original payment method or FashionFever Wallet within 3-5 business days.
                </div>
              </div>
            </section>

            {/* Section 8: Governing Law */}
            <section id="law" className="bg-gradient-to-r from-slate-900 via-gray-900 to-rose-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-6 scroll-mt-28">
              <div className="flex items-center gap-3 border-b border-white/15 pb-4">
                <div className="p-2.5 bg-white/10 rounded-2xl text-rose-300">
                  <Scale size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wide">8. Governing Law & Contact</h2>
                  <p className="text-xs text-gray-300 font-medium">Subject to Courts of New Delhi, India.</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts located in New Delhi.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                <a href="mailto:legal@fashionfever.in" className="font-extrabold text-rose-300 hover:underline">
                  ✉️ legal@fashionfever.in
                </a>
                <span className="text-gray-500">•</span>
                <span className="font-semibold text-gray-300">📞 +91 99999 88888</span>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
