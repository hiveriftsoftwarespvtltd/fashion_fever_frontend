import React, { useState } from 'react';
import { Filter, ChevronDown, Star, ShoppingCart, Heart, Search } from 'lucide-react';

const Shop = () => {
 const [activeFilters, setActiveFilters] = useState([]);

 const categories = ['Makeup', 'Skincare', 'Haircare', 'Fragrance', 'Tools', 'Natural'];
 const brands = ['Wakeup Luxe', 'Nykaa Cosmetics', 'L\'Oreal', 'Maybelline', 'MAC'];
 const priceRanges = ['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000'];

 const products = [
  { id: 1, name: 'Velvet Matte Lipstick', brand: 'Wakeup Luxe', price: 899, rating: 4.8, reviews: 245, image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=300&h=400&fit=crop', category: 'Makeup' },
  { id: 2, name: 'Vitamin C Serum', brand: 'Skin Glow', price: 1250, rating: 4.9, reviews: 128, image: 'https://images.unsplash.com/photo-1620916566398-39f1143af7be?w=300&h=400&fit=crop', category: 'Skincare' },
  { id: 3, name: 'Waterproof Mascara', brand: 'Wakeup Luxe', price: 650, rating: 4.7, reviews: 890, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=400&fit=crop', category: 'Makeup' },
  { id: 4, name: 'Hydrating Face Mist', brand: 'Natural Flow', price: 450, rating: 4.5, reviews: 56, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=400&fit=crop', category: 'Natural' },
  { id: 5, name: 'Pro Hair Mask', brand: 'Hair Care+', price: 1599, rating: 4.6, reviews: 342, image: 'https://images.unsplash.com/photo-1527799822367-a233b47b0ee1?w=300&h=400&fit=crop', category: 'Haircare' },
  { id: 6, name: 'Matte Liquid Foundation', brand: 'Beauty Base', price: 999, rating: 4.8, reviews: 760, image: 'https://images.unsplash.com/photo-1599733594230-6b823276abcc?w=300&h=400&fit=crop', category: 'Makeup' },
 ];

 return (
  <div className="bg-white min-h-screen">
   {/* Category Strip */}
   <div className="border-b border-gray-100 bg-gray-50/50">
    <div className="container overflow-x-auto scrollbar-hide py-3 flex items-center gap-8">
     {categories.map((cat) => (
      <button key={cat} className="whitespace-nowrap text-xs font-bold uppercase text-gray-500 hover:text-primary transition-colors">
       {cat}
      </button>
     ))}
    </div>
   </div>

   <div className="container py-8">
    <div className="flex flex-col lg:flex-row gap-8">
     
     {/* Filters Sidebar */}
     <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      <div className="flex items-center justify-between">
       <h2 className="text-xl font-bold uppercase  ">Filters</h2>
       <button className="text-xs font-bold text-primary uppercase">Clear All</button>
      </div>

      {/* Filter Group: Category */}
      <div className="space-y-4">
       <h3 className="text-sm font-bold uppercase flex items-center justify-between">
        Category <ChevronDown size={16} />
       </h3>
       <div className="space-y-2">
        {categories.map((cat) => (
         <label key={cat} className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 border-2 border-gray-200 rounded text-primary focus:ring-primary" />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{cat}</span>
         </label>
        ))}
       </div>
      </div>

      {/* Filter Group: Brand */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
       <h3 className="text-sm font-bold uppercase flex items-center justify-between">
        Brand <ChevronDown size={16} />
       </h3>
       <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search brands..." className="w-full pl-9 pr-3 py-2 bg-gray-100 border-none rounded-lg text-xs outline-none" />
       </div>
       <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {brands.map((brand) => (
         <label key={brand} className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 border-2 border-gray-200 rounded text-primary focus:ring-primary" />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{brand}</span>
         </label>
        ))}
       </div>
      </div>

      {/* Filter Group: Price */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
       <h3 className="text-sm font-bold uppercase flex items-center justify-between">
        Price <ChevronDown size={16} />
       </h3>
       <div className="space-y-2">
        {priceRanges.map((range) => (
         <label key={range} className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 border-2 border-gray-200 rounded text-primary focus:ring-primary" />
          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">{range}</span>
         </label>
        ))}
       </div>
      </div>
     </aside>

     {/* Main Grid */}
     <main className="flex-grow">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
       <p className="text-sm text-gray-500 font-medium">Showing <span className="text-gray-900 font-bold">1-12</span> of <span className="text-gray-900 font-bold">148</span> products</p>
       <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-gray-400 uppercase ">Sort By:</span>
        <select className="bg-transparent border-none text-sm font-bold outline-none cursor-pointer">
         <option>Popularity</option>
         <option>Price: Low to High</option>
         <option>Price: High to Low</option>
         <option>Customer Rating</option>
        </select>
       </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
       {products.map((product) => (
        <div key={product.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300">
         <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img 
           src={product.image} 
           alt={product.name} 
           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">New</span>
          </div>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm">
           <Heart size={20} />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
           <button className="w-full bg-primary text-white py-3 rounded-xl font-bold uppercase text-xs shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
            <ShoppingCart size={16} /> Add to Cart
           </button>
          </div>
         </div>
         <div className="p-5 flex flex-col flex-grow">
          <span className="text-[10px] font-bold uppercase text-primary mb-1">{product.brand}</span>
          <h3 className="text-gray-800 font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
          <div className="flex items-center gap-2 mb-4">
           <div className="flex items-center gap-0.5 text-yellow-400">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold text-gray-800 ml-1">{product.rating}</span>
           </div>
           <span className="text-[10px] font-bold text-gray-400 uppercase ">({product.reviews})</span>
          </div>
          <div className="mt-auto flex items-center justify-between">
           <span className="text-lg font-bold text-gray-900 ">₹{product.price}</span>
           <button className="text-[10px] font-bold uppercase text-gray-400 hover:text-primary transition-colors">View Details</button>
          </div>
         </div>
        </div>
       ))}
      </div>

      {/* Pagination */}
      <div className="mt-16 flex justify-center gap-2">
        {[1, 2, 3, '...', 12].map((p, i) => (
         <button key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${p === 1 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
          {p}
         </button>
        ))}
      </div>
     </main>
    </div>
   </div>
  </div>
 );
};

export default Shop;
