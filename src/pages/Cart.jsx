import React, { useState } from 'react';
import { 
 Trash2, 
 Minus, 
 Plus, 
 ChevronRight, 
 ArrowLeft,
 ShieldCheck,
 Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
 const [cartItems, setCartItems] = useState([
 { id: 1, name: 'Velvet Matte Lipstick', brand: 'FashionFever Luxe', shade: 'Ruby Rush', price: 899, quantity: 1, image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=100&h=100&fit=crop' },
 { id: 2, name: 'Hydrating Face Serum', brand: 'Skin Glow', price: 1250, quantity: 1, image: 'https://images.unsplash.com/photo-1620916566398-39f1143af7be?w=100&h=100&fit=crop' },
 ]);

 const updateQuantity = (id, delta) => {
 setCartItems(prev => prev.map(item => 
  item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
 ));
 };

 const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
 const shipping = 0;
 const tax = subtotal * 0.18;
 const total = subtotal + shipping + tax;

 return (
 <div className="bg-gray-50 min-h-screen py-12">
  <div className="container">
  <div className="flex items-center gap-2 mb-8">
   <Link to="/shop" className="text-gray-400 hover:text-primary transition-all flex items-center gap-1 font-bold text-xs uppercase ">
    <ArrowLeft size={16} /> Continue Shopping
   </Link>
  </div>

  <h1 className="text-4xl font-bold text-gray-900 uppercase  mb-12">Your Shopping Bag</h1>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
   
   {/* Cart Items List */}
   <div className="lg:col-span-2 space-y-6">
   {cartItems.map((item) => (
    <div key={item.id} className="bg-white p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
     <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
     <img src={item.image} alt="" className="w-full h-full object-cover" />
     </div>
     <div className="flex-grow flex flex-col sm:flex-row items-center justify-between w-full gap-4">
     <div className="text-center sm:text-left">
      <span className="text-sm font-bold uppercase text-primary mb-1 block">{item.brand}</span>
      <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h3>
      {item.shade && <p className="text-xs font-bold text-gray-400 uppercase mt-1">Shade: {item.shade}</p>}
     </div>
     
     <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 gap-6 border border-gray-100">
      <button onClick={() => updateQuantity(item.id, -1)} className="text-lg font-bold text-gray-400 hover:text-primary">-</button>
      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
      <button onClick={() => updateQuantity(item.id, 1)} className="text-lg font-bold text-gray-400 hover:text-primary">+</button>
     </div>

     <div className="text-center sm:text-right min-w-[100px]">
      <p className="text-xl font-bold text-gray-900 ">₹{item.price * item.quantity}</p>
      <button className="text-sm font-bold uppercase text-red-400 hover:text-red-600 transition-all mt-2 flex items-center gap-1 mx-auto sm:ml-auto">
       <Trash2 size={12} /> Remove
      </button>
     </div>
     </div>
    </div>
   ))}
   </div>

   {/* Order Summary */}
   <div className="space-y-6">
   <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-6 sticky top-24">
    <h2 className="text-xl font-bold uppercase  mb-4">Order Summary</h2>
    
    {/* Coupon Code */}
    <div className="relative group">
     <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
     <input type="text" placeholder="Coupon Code" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 uppercase " />
     <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm hover:bg-black transition-all">Apply</button>
    </div>

    <div className="space-y-4 pt-4">
     <div className="flex justify-between text-sm font-bold text-gray-400 uppercase ">
      <span>Subtotal</span>
      <span className="text-gray-900">₹{subtotal}</span>
     </div>
     <div className="flex justify-between text-sm font-bold text-gray-400 uppercase ">
      <span>Shipping</span>
      <span className="text-green-500">FREE</span>
     </div>
     <div className="flex justify-between text-sm font-bold text-gray-400 uppercase ">
      <span>Tax (GST 18%)</span>
      <span className="text-gray-900">₹{tax.toFixed(0)}</span>
     </div>
     <div className="h-[1px] bg-gray-100 my-4"></div>
     <div className="flex justify-between items-baseline">
      <span className="text-xl font-bold uppercase  ">Total</span>
      <span className="text-3xl font-bold text-primary ">₹{total.toFixed(0)}</span>
     </div>
    </div>

    <Link to="/checkout" className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase text-sm shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:bg-primary-hover transition-all">
     Checkout Now <ChevronRight size={18} />
    </Link>

    <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-300 uppercase pt-4">
     <ShieldCheck size={14} /> 100% Secure Payments
    </div>
   </div>
   </div>

  </div>
  </div>
 </div>
 );
};

export default Cart;
