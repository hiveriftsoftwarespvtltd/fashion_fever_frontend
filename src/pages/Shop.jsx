import React, { useState } from 'react';
import { Filter, ChevronDown, Star, ShoppingBag, Heart, Search, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Shop = () => {
  const { searchQuery } = useSearch();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortBy, setSortBy] = useState('Popularity');
  const [brandSearch, setBrandSearch] = useState('');
  const [wishlist, setWishlist] = useState([]);

  const categories = ['All', 'Makeup', 'Skincare', 'Haircare', 'Fragrance', 'Tools', 'Natural'];
  const brands = ['Wakeup Luxe', 'Skin Glow', 'Natural Flow', 'Hair Care+', 'Beauty Base'];
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: 'Above ₹2000', min: 2000, max: 99999 }
  ];

  const products = [
    { id: 1, name: 'Velvet Matte Lipstick', brand: 'Wakeup Luxe', price: 899, rating: 4.8, reviews: 245, image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=300&h=400&fit=crop', category: 'Makeup' },
    { id: 2, name: 'Vitamin C Serum', brand: 'Skin Glow', price: 1250, rating: 4.9, reviews: 128, image: 'https://images.unsplash.com/photo-1620916566398-39f1143af7be?w=300&h=400&fit=crop', category: 'Skincare' },
    { id: 3, name: 'Waterproof Mascara', brand: 'Wakeup Luxe', price: 650, rating: 4.7, reviews: 890, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=400&fit=crop', category: 'Makeup' },
    { id: 4, name: 'Hydrating Face Mist', brand: 'Natural Flow', price: 450, rating: 4.5, reviews: 56, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=400&fit=crop', category: 'Natural' },
    { id: 5, name: 'Pro Hair Mask', brand: 'Hair Care+', price: 1599, rating: 4.6, reviews: 342, image: 'https://images.unsplash.com/photo-1527799822367-a233b47b0ee1?w=300&h=400&fit=crop', category: 'Haircare' },
    { id: 6, name: 'Matte Liquid Foundation', brand: 'Beauty Base', price: 999, rating: 4.8, reviews: 760, image: 'https://images.unsplash.com/photo-1599733594230-6b823276abcc?w=300&h=400&fit=crop', category: 'Makeup' },
  ];

  // Toggle Wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast.success('Removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      toast.success('Added to wishlist');
    }
  };

  // Toggle Brand Filter
  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Toggle Price Filter
  const handlePriceChange = (label) => {
    setSelectedPrices(prev => 
      prev.includes(label) ? prev.filter(p => p !== label) : [...prev, label]
    );
  };

  // Clear All Filters
  const clearAllFilters = () => {
    setActiveCategory('All');
    setSelectedBrands([]);
    setSelectedPrices([]);
    setBrandSearch('');
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    // Search match
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower);

    // Category match
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;

    // Brand match
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    // Price match
    const matchesPrice = selectedPrices.length === 0 || selectedPrices.some(rangeLabel => {
      const range = priceRanges.find(r => r.label === rangeLabel);
      if (!range) return false;
      return product.price >= range.min && product.price <= range.max;
    });

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Customer Rating') return b.rating - a.rating;
    return b.reviews - a.reviews; // Popularity fallback
  });

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-0 pb-6 font-outfit">
      
      {/* Category Pills Strip */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm py-8 mb-6">
        <div className="container mx-auto px-4 max-w-[1600px]">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-68 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6 sticky top-[170px] lg:top-[200px]">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-primary" /> Filters
                </h2>
                {(activeCategory !== 'All' || selectedBrands.length > 0 || selectedPrices.length > 0) && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs font-extrabold text-primary hover:text-primary-hover uppercase tracking-wider transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Filter Group: Brand */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Brand</h3>
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Search brands..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-primary/30 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {brands
                    .filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
                    .map((brand) => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                        />
                        <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors font-semibold">
                          {brand}
                        </span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Filter Group: Price */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Price</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(range.label)}
                        onChange={() => handlePriceChange(range.label)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                      />
                      <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors font-semibold">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-grow">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Showing <span className="text-primary">{sortedProducts.length}</span> products
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl text-xs font-extrabold uppercase px-3 py-2 outline-none cursor-pointer text-gray-700 hover:border-primary/25 transition-all"
                >
                  <option value="Popularity">Popularity</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Customer Rating">Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.length === 0 ? (
                <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <Search size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">No Products Found</p>
                  <p className="text-xs text-gray-400 mt-2 uppercase font-medium">Try checking your spelling or filters</p>
                </div>
              ) : (
                sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image Wrapper */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-md shadow-primary/20">
                          {product.category}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                          wishlist.includes(product.id)
                            ? 'bg-primary text-white shadow-primary/25 scale-105'
                            : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-primary hover:bg-white'
                        }`}
                      >
                        <Heart size={16} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                      </button>

                      {/* Add to Cart Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={() => {
                            addToCart({ ...product, quantity: 1 });
                            toast.success(`${product.name} added to cart`);
                          }}
                          className="w-full bg-white text-gray-900 hover:bg-primary hover:text-white py-3 rounded-xl font-bold uppercase text-[10px] tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={14} /> Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary mb-1">
                        {product.brand}
                      </span>
                      <h3 className="text-gray-800 font-extrabold text-sm uppercase leading-tight mb-2 group-hover:text-primary transition-colors cursor-pointer truncate">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex items-center text-yellow-400">
                          <Star size={12} fill="currentColor" />
                        </div>
                        <span className="text-[11px] font-extrabold text-gray-700">{product.rating}</span>
                        <span className="text-[10px] font-bold text-gray-400">({product.reviews})</span>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                        <span className="text-base font-black text-gray-900">₹{product.price}</span>
                        <button className="text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-primary transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {sortedProducts.length > 0 && (
              <div className="mt-12 flex justify-center gap-2">
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      p === 1
                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                        : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
