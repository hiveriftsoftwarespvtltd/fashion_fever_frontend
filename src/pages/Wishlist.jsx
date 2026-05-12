import React from 'react';
import { ShoppingCart, Trash2, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const wishlistItems = [
    { id: 1, name: "Velvet Matte Lipstick", price: 899, image: "https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=400&h=400&fit=crop", category: "Makeup" },
    { id: 2, name: "Hydrating Face Serum", price: 1299, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop", category: "Skincare" },
  ];

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
           <span className="text-xs font-bold uppercase text-primary">Saved Items</span>
           <h1 className="text-5xl font-bold text-gray-900 uppercase italic">My Wishlist</h1>
           <div className="w-24 h-1 bg-primary rounded-full"></div>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 mb-6">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex-grow space-y-2">
                   <span className="text-[10px] font-bold uppercase text-primary">{item.category}</span>
                   <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                   <p className="text-2xl font-bold text-gray-900">₹{item.price}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 flex gap-3">
                   <button className="flex-grow bg-primary text-white py-4 rounded-xl font-bold uppercase text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary-hover transition-all">
                      <ShoppingCart size={16} /> Add to Cart
                   </button>
                   <Link to={`/product/${item.id}`} className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all">
                      <ChevronRight size={20} />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[4rem] border border-dashed border-gray-200">
             <Heart size={64} className="mx-auto text-gray-200 mb-6" strokeWidth={1} />
             <h2 className="text-2xl font-bold text-gray-400 uppercase">Your wishlist is empty</h2>
             <Link to="/shop" className="inline-block mt-8 bg-primary text-white px-10 py-4 rounded-xl font-bold uppercase text-xs shadow-xl shadow-primary/20">
                Go Shopping
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
