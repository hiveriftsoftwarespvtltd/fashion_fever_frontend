import React, { useState } from 'react';
import { 
 Star, 
 Heart, 
 ShoppingCart, 
 ShieldCheck, 
 Truck, 
 RotateCcw, 
 ChevronRight,
 Camera,
 Share2
} from 'lucide-react';

const ProductDetail = () => {
 const [selectedImage, setSelectedImage] = useState(0);
 const [selectedShade, setSelectedShade] = useState(0);
 const [quantity, setQuantity] = useState(1);
 const [isTryOnActive, setIsTryOnActive] = useState(false);

 const product = {
 name: "Matte Ultra-Stay Liquid Lipstick",
 brand: "Wakeup Luxe",
 price: 899,
 originalPrice: 1250,
 discount: "28% OFF",
 rating: 4.8,
 reviews: 1240,
 description: "Experience the ultimate comfort with our ultra-matte liquid lipstick. A long-lasting, lightweight formula that glides on smoothly and stays put for up to 12 hours without drying your lips.",
 images: [
  "https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=1000&fit=crop"
 ],
 shades: [
  { name: "Ruby Rush", hex: "#9b111e" },
  { name: "Mauve Magic", hex: "#af829b" },
  { name: "Nude Velvet", hex: "#bc8a7a" },
  { name: "Coral Crush", hex: "#ff7f50" }
 ]
 };

 return (
 <div className="bg-white min-h-screen">
  {/* Breadcrumbs */}
  <div className="container py-4">
  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
   <span>Home</span> <ChevronRight size={10} />
   <span>Makeup</span> <ChevronRight size={10} />
   <span>Lipstick</span> <ChevronRight size={10} />
   <span className="text-gray-900">{product.name}</span>
  </div>
  </div>

  <div className="container py-8">
  <div className="flex flex-col lg:flex-row gap-12">
   
   {/* Image Section */}
   <div className="w-full lg:w-1/2 flex gap-4">
   <div className="flex flex-col gap-4 w-20">
    {product.images.map((img, i) => (
    <button 
     key={i} 
     onClick={() => setSelectedImage(i)}
     className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}
    >
     <img src={img} alt="" className="w-full h-full object-cover" />
    </button>
    ))}
   </div>
   <div className="flex-grow relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 group">
    <img src={product.images[selectedImage]} alt="" className="w-full h-full object-cover" />
    
    {/* AI Try-On Button (Task 8) */}
    <button 
    onClick={() => setIsTryOnActive(true)}
    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl hover:bg-white transition-all group/btn"
    >
    <div className="bg-primary p-2 rounded-full text-white group-hover/btn:scale-110 transition-transform">
     <Camera size={18} />
    </div>
    <span className="text-sm font-bold uppercase text-gray-800">Virtual Try-On</span>
    </button>
   </div>
   </div>

   {/* Info Section */}
   <div className="w-full lg:w-1/2 space-y-8">
   <div>
    <span className="text-xs font-bold uppercase text-primary mb-2 block">{product.brand}</span>
    <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">{product.name}</h1>
    <div className="flex items-center gap-4">
    <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg">
     <span className="text-sm font-bold text-green-600">{product.rating}</span>
     <Star size={14} className="fill-green-600 text-green-600" />
    </div>
    <span className="text-sm font-bold text-gray-400 uppercase ">{product.reviews} Reviews</span>
    <div className="h-4 w-[1px] bg-gray-200"></div>
    <button className="text-primary hover:opacity-80 transition-opacity">
     <Share2 size={20} />
    </button>
    </div>
   </div>

   <div className="flex items-baseline gap-4">
    <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
    <span className="text-xl font-bold text-gray-300 line-through">₹{product.originalPrice}</span>
    <span className="text-sm font-bold text-primary uppercase bg-primary/5 px-2 py-1 rounded">{product.discount}</span>
   </div>

   <p className="text-gray-500 font-medium leading-relaxed">
    {product.description}
   </p>

   {/* Shade Selection */}
   <div className="space-y-4">
    <div className="flex items-center justify-between">
    <h3 className="text-xs font-bold uppercase text-gray-900">Select Shade: <span className="text-primary">{product.shades[selectedShade].name}</span></h3>
    </div>
    <div className="flex flex-wrap gap-4">
    {product.shades.map((shade, i) => (
     <button 
     key={i}
     onClick={() => setSelectedShade(i)}
     className={`w-12 h-12 rounded-full border-2 p-1 transition-all ${selectedShade === i ? 'border-primary' : 'border-transparent'}`}
     >
     <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: shade.hex }}></div>
     </button>
    ))}
    </div>
   </div>

   {/* Quantity and Actions */}
   <div className="flex flex-col gap-4 pt-6">
    <div className="flex gap-4">
    <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 gap-6 bg-gray-50">
     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl font-bold text-gray-400 hover:text-primary">-</button>
     <span className="text-lg font-bold w-4 text-center">{quantity}</span>
     <button onClick={() => setQuantity(quantity + 1)} className="text-xl font-bold text-gray-400 hover:text-primary">+</button>
    </div>
    <button className="flex-grow bg-primary text-white py-4 rounded-xl font-bold uppercase text-sm shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:bg-primary-hover transition-all">
     <ShoppingCart size={20} /> Add to Bag
    </button>
    <button className="w-14 h-14 border-2 border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 hover:border-red-100">
     <Heart size={24} />
    </button>
    </div>
   </div>

   {/* Features/Trust Badges */}
   <div className="grid grid-cols-3 gap-4 pt-8">
    <div className="flex flex-col items-center text-center gap-2 p-4 bg-gray-50 rounded-2xl">
    <ShieldCheck className="text-primary" size={24} />
    <span className="text-[10px] font-bold uppercase text-gray-700">100% Genuine</span>
    </div>
    <div className="flex flex-col items-center text-center gap-2 p-4 bg-gray-50 rounded-2xl">
    <RotateCcw className="text-primary" size={24} />
    <span className="text-[10px] font-bold uppercase text-gray-700">15 Day Returns</span>
    </div>
    <div className="flex flex-col items-center text-center gap-2 p-4 bg-gray-50 rounded-2xl">
    <Truck className="text-primary" size={24} />
    <span className="text-[10px] font-bold uppercase text-gray-700">Free Delivery</span>
    </div>
   </div>
   </div>
  </div>
  </div>

   {/* Reviews Section (Task 5 Requirement) */}
   <div className="container mt-24 pt-16 border-t border-gray-100 pb-24">
    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
     <div className="space-y-2">
      <h2 className="text-3xl font-bold uppercase">Customer Reviews</h2>
      <div className="flex items-center gap-2">
       <div className="flex text-yellow-400">
        {[1,2,3,4].map(i => <Star key={i} size={16} fill="currentColor" />)}
        <Star size={16} className="text-gray-200" fill="currentColor" />
       </div>
       <span className="text-sm font-bold text-gray-900">4.2 Out of 5</span>
       <span className="text-xs font-bold text-gray-400 uppercase ml-4">(128 Reviews)</span>
      </div>
     </div>
     <button className="bg-gray-900 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase hover:bg-black transition-all">
      Write a Review
     </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
     {[1, 2].map((i) => (
      <div key={i} className="bg-gray-50 p-8 rounded-3xl space-y-4">
       <div className="flex justify-between items-start">
        <div>
         <p className="text-sm font-bold uppercase text-gray-900">Anita Sharma</p>
         <p className="text-[10px] font-bold text-gray-400 uppercase">Verified Buyer • 2 days ago</p>
        </div>
        <div className="flex text-yellow-400">
         {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
        </div>
       </div>
       <p className="text-sm text-gray-600 leading-relaxed font-medium">"The texture is amazing! It stays on all day without drying my lips. Definitely recommending this shade to my friends."</p>
      </div>
     ))}
    </div>
   </div>

   {/* AI Try-On Overlay Mockup (Task 8) */}
  {isTryOnActive && (
  <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center">
   <div className="absolute top-8 right-8 flex gap-4">
    <button onClick={() => setIsTryOnActive(false)} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl">✕</button>
   </div>
   
   <div className="relative w-full max-w-xl aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
   {/* Mock Camera Feed */}
   <img src="https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=600&h=800&fit=crop" alt="Face" className="w-full h-full object-cover opacity-60" />
   
   <div className="absolute inset-0 border-[8px] border-primary/20 rounded-3xl"></div>
   
   <div className="absolute bottom-12 inset-x-0 flex flex-col items-center gap-8">
    <div className="flex gap-4 p-4 bg-black/40 backdrop-blur-xl rounded-full border border-white/10">
    {product.shades.map((shade, i) => (
     <button 
     key={i}
     onClick={() => setSelectedShade(i)}
     className={`w-12 h-12 rounded-full border-2 transition-all ${selectedShade === i ? 'border-white scale-110' : 'border-transparent opacity-60'}`}
     style={{ backgroundColor: shade.hex }}
     />
    ))}
    </div>
    <p className="text-white font-bold uppercase text-sm bg-primary px-6 py-2 rounded-full shadow-xl">Applying {product.shades[selectedShade].name}</p>
   </div>
   </div>
   
   <p className="mt-8 text-white/50 text-xs font-bold uppercase ">AI Vision Technology • Real-time Shade Overlay</p>
  </div>
  )}
 </div>
 );
};

export default ProductDetail;
