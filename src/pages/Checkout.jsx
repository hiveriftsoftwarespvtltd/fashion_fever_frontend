import React, { useState } from 'react';
import { 
 CreditCard, 
 Truck, 
 MapPin, 
 CheckCircle2, 
 ChevronRight,
 ShieldCheck,
 Lock
} from 'lucide-react';

const Checkout = () => {
 const [step, setStep] = useState(1);
 const [paymentMethod, setPaymentMethod] = useState('card');

 return (
 <div className="bg-gray-50 min-h-screen py-12">
  <div className="container max-w-4xl">
  {/* Checkout Steps */}
  <div className="flex items-center justify-between mb-16 relative">
   <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2 -z-10"></div>
   {[1, 2, 3].map((s) => (
    <div key={s} className="flex flex-col items-center gap-3 bg-gray-50 px-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-white text-gray-300 border-2 border-gray-100'}`}>
     {step > s ? <CheckCircle2 size={24} /> : s}
    </div>
    <span className={`text-[10px] font-bold uppercase ${step >= s ? 'text-primary' : 'text-gray-300'}`}>
     {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
    </span>
    </div>
   ))}
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
   
   {/* Main Checkout Form */}
   <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
    {step === 1 && (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
     <h2 className="text-2xl font-bold uppercase  mb-8">Shipping Address</h2>
     <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase ">First Name</label>
      <input type="text" className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-primary/20 transition-all" />
      </div>
      <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase ">Last Name</label>
      <input type="text" className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-primary/20 transition-all" />
      </div>
     </div>
     <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase ">Full Address</label>
      <textarea rows="3" className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-primary/20 transition-all resize-none"></textarea>
     </div>
     <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase ">City</label>
      <input type="text" className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-primary/20 transition-all" />
      </div>
      <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase ">Pincode</label>
      <input type="text" className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-primary/20 transition-all" />
      </div>
     </div>
     <button onClick={() => setStep(2)} className="w-full bg-primary text-white py-5 rounded-2xl font-bold uppercase text-sm shadow-2xl shadow-primary/30 flex items-center justify-center gap-2 hover:bg-primary-hover transition-all">
      Continue to Payment <ChevronRight size={20} />
     </button>
    </div>
    )}

    {step === 2 && (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
     <h2 className="text-2xl font-bold uppercase  mb-8">Payment Method</h2>
     <div className="space-y-4">
      <button onClick={() => setPaymentMethod('card')} className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-50 bg-gray-50'}`}>
      <div className="flex items-center gap-4">
       <CreditCard className={paymentMethod === 'card' ? 'text-primary' : 'text-gray-400'} size={24} />
       <span className={`text-sm font-bold uppercase ${paymentMethod === 'card' ? 'text-primary' : 'text-gray-600'}`}>Credit / Debit Card</span>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-gray-300'}`}>
       {paymentMethod === 'card' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
      </div>
      </button>
      <button onClick={() => setPaymentMethod('upi')} className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-gray-50 bg-gray-50'}`}>
      <div className="flex items-center gap-4">
       <ShieldCheck className={paymentMethod === 'upi' ? 'text-primary' : 'text-gray-400'} size={24} />
       <span className={`text-sm font-bold uppercase ${paymentMethod === 'upi' ? 'text-primary' : 'text-gray-600'}`}>UPI (GPay / PhonePe)</span>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary' : 'border-gray-300'}`}>
       {paymentMethod === 'upi' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
      </div>
      </button>
     </div>
     
     {paymentMethod === 'card' && (
     <div className="space-y-6 pt-4 animate-in fade-in duration-500">
      <div className="space-y-2">
       <label className="text-[10px] font-bold text-gray-400 uppercase ">Card Number</label>
       <div className="relative">
        <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-primary/20 transition-all" />
        <Lock size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" />
       </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
       <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase ">Expiry Date</label>
        <input type="text" placeholder="MM / YY" className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-primary/20 transition-all" />
       </div>
       <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase ">CVV</label>
        <input type="password" placeholder="***" className="w-full px-5 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-primary/20 transition-all" />
       </div>
      </div>
     </div>
     )}

     <div className="flex gap-4">
     <button onClick={() => setStep(1)} className="px-8 border-2 border-gray-100 rounded-2xl font-bold uppercase text-[10px] hover:bg-gray-50 transition-all">Back</button>
     <button onClick={() => setStep(3)} className="flex-grow bg-primary text-white py-5 rounded-2xl font-bold uppercase text-sm shadow-2xl shadow-primary/30 flex items-center justify-center gap-2 hover:bg-primary-hover transition-all">
      Review Order <ChevronRight size={20} />
     </button>
     </div>
    </div>
    )}

    {step === 3 && (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 text-center py-10">
     <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border-[8px] border-green-100">
      <CheckCircle2 size={48} />
     </div>
     <h2 className="text-3xl font-bold uppercase  ">Everything Looks Great!</h2>
     <p className="text-gray-400 font-bold uppercase text-xs">Total Amount to Pay: <span className="text-gray-900 text-lg ml-2">₹2,450</span></p>
     
     <div className="bg-gray-50 p-8 rounded-3xl text-left space-y-4 border border-gray-100">
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase ">
      <span>Delivery To</span>
      <span className="text-gray-900">HSR Layout, Bangalore</span>
      </div>
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase ">
      <span>Payment Mode</span>
      <span className="text-gray-900">Credit Card (**** 4242)</span>
      </div>
     </div>

     <button className="w-full bg-primary text-white py-6 rounded-[2rem] font-bold uppercase text-base shadow-[0_20px_50px_rgba(252,155,201,0.4)] hover:scale-105 transition-all">
      Pay & Confirm Order
     </button>
    </div>
    )}
   </div>

   {/* Mini Summary */}
   <div className="space-y-6">
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
    <h3 className="text-sm font-bold uppercase text-gray-400 mb-6">In Your Bag</h3>
    <div className="space-y-4">
     <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0"></div>
      <div className="flex-grow">
       <h4 className="text-xs font-bold text-gray-800">Velvet Matte Lipstick</h4>
       <p className="text-[10px] font-bold text-gray-400 uppercase">Qty: 1 • ₹899</p>
      </div>
     </div>
     <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0"></div>
      <div className="flex-grow">
       <h4 className="text-xs font-bold text-gray-800">Hydrating Face Serum</h4>
       <p className="text-[10px] font-bold text-gray-400 uppercase">Qty: 1 • ₹1,250</p>
      </div>
     </div>
    </div>
    <div className="h-[1px] bg-gray-50 my-6"></div>
    <div className="flex justify-between items-baseline">
     <span className="text-xs font-bold uppercase text-gray-400">Final Total</span>
     <span className="text-2xl font-bold text-gray-900">₹2,450</span>
    </div>
    </div>
    
    <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
    <ShieldCheck className="text-primary" size={32} />
    <div className="flex flex-col">
     <span className="text-[10px] font-bold text-primary uppercase leading-tight">Razorpay Secure Checkout</span>
     <span className="text-[8px] font-bold text-primary/60 uppercase">PCI-DSS Compliant Infrastructure</span>
    </div>
    </div>
   </div>

  </div>
  </div>
 </div>
 );
};

export default Checkout;
