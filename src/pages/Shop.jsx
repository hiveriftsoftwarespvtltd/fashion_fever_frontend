import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, Star, ShoppingBag, Heart, Search, SlidersHorizontal, X, Check, LayoutGrid, Loader2 } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from '../utils/toast';
import { getProducts } from '../api/productService';

const Shop = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { addToCart } = useCart();
  const { incrementWishlistCount, decrementWishlistCount } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortBy, setSortBy] = useState('Popularity');
  const [brandSearch, setBrandSearch] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  // Synchronize local search text with global search context
  useEffect(() => {
    setLocalSearch(searchQuery || '');
  }, [searchQuery]);

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [localSearch, activeCategory, selectedPrices]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileFilterOpen]);

  const categories = ['All', 'Makeup', 'Skincare', 'Haircare', 'Fragrance', 'Tools', 'Natural'];
  const staticBrands = ['Wakeup Luxe', 'Skin Glow', 'Natural Flow', 'Hair Care+', 'Beauty Base'];
  const brands = Array.from(new Set([...staticBrands, ...products.map(p => p.brand).filter(Boolean)]));

  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: 'Above ₹2000', min: 2000, max: 99999 }
  ];

  // Dynamic Product Hydration with filters mapped to /public-user/products
  useEffect(() => {
    let isMounted = true;
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 10
        };
        
        // 1. Search Query mapping
        if (localSearch) {
          params.search = localSearch;
        }

        // 2. Category Filter mapping
        if (activeCategory && activeCategory !== 'All') {
          params.category = activeCategory.toLowerCase();
        }

        // 3. Price Filter mapping
        if (selectedPrices.length > 0) {
          const matchedRanges = selectedPrices.map(label => priceRanges.find(r => r.label === label)).filter(Boolean);
          if (matchedRanges.length > 0) {
            const minPrices = matchedRanges.map(r => r.min);
            const maxPrices = matchedRanges.map(r => r.max);
            params.minPrice = Math.min(...minPrices);
            params.maxPrice = Math.max(...maxPrices);
          }
        }

        const response = await getProducts(params);
        if (isMounted) {
          if (response.success) {
            let rawProducts = [];
            const rawData = response.data;
            
            if (Array.isArray(rawData)) {
              rawProducts = rawData;
            } else if (rawData) {
              if (Array.isArray(rawData.products)) {
                rawProducts = rawData.products;
              } else if (Array.isArray(rawData.data)) {
                rawProducts = rawData.data;
              } else if (rawData.data && Array.isArray(rawData.data.products)) {
                rawProducts = rawData.data.products;
              } else if (rawData.data && Array.isArray(rawData.data.data)) {
                rawProducts = rawData.data.data;
              }
            }
            
            // Set dynamic total pages count returned by API or compute via totalProducts count
            const totalItems = response.data?.totalProducts || response.data?.total || response.data?.count || response.data?.data?.totalProducts || response.data?.data?.total || 0;
            const apiPagesCount = response.data?.totalPages || response.data?.pages || response.data?.data?.totalPages || response.data?.data?.pages;
            const pagesCount = apiPagesCount || (totalItems ? Math.ceil(totalItems / 10) : 1);
            setTotalPages(pagesCount || 1);

            // Map raw backend products to existing component layout schema
            const mapped = rawProducts.map(p => {
              const firstVariant = p.variants?.[0] || {};
              return {
                id: p._id,
                name: p.name,
                brand: p.brand || p.vendorId?.businessName || 'WakeUp Luxe',
                price: firstVariant.offeredPrice || firstVariant.salesPrice || 0,
                rating: p.rating || 4.7,
                reviews: 120,
                image: firstVariant.thumbnail?.url || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop',
                category: p.categoryId?.name || 'Beauty',
                badge: p.tags?.[0] || null,
                originalProduct: p,
                firstVariant: firstVariant
              };
            });
            setProducts(mapped);
          } else {
            setProducts([]);
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.error("Failed fetching filtered products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFilteredProducts();
    return () => { isMounted = false; };
  }, [localSearch, activeCategory, selectedPrices, currentPage]);

  // Toggle Wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      decrementWishlistCount();
      toast.success('Removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      incrementWishlistCount();
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

  // Filter & Sort Logic (Local Brand Filter over fetched products)
  const filteredProducts = products.filter(product => {
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Customer Rating') return b.rating - a.rating;
    return b.reviews - a.reviews; 
  });

  // Filter Sidebar Content Component
  const FilterContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="text-lg font-bold uppercase  text-gray-900 flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-primary" /> Filters
        </h2>
        {(activeCategory !== 'All' || selectedBrands.length > 0 || selectedPrices.length > 0) && (
          <button 
            onClick={clearAllFilters}
            className="text-[10px] font-semibold text-primary hover:text-white hover:bg-primary px-3 py-1.5 rounded-lg uppercase  transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase  text-gray-400">Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase  transition-all duration-300 flex items-center justify-between ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
              {activeCategory === cat && <Check size={14} className="text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <h3 className="text-xs font-bold uppercase  text-gray-400">Brands</h3>
        <div className="relative mb-3 group">
          <div className="absolute inset-0 bg-primary/5 rounded-xl blur transition-opacity opacity-0 group-hover:opacity-100"></div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="Search brands..."
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-primary/30 focus:bg-white transition-all font-bold placeholder:font-medium text-gray-700"
            />
          </div>
        </div>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {brands
            .filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
            .map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedBrands.includes(brand) ? 'bg-primary border-primary' : 'border-gray-200 bg-gray-50 group-hover:border-primary/50'}`}>
                  {selectedBrands.includes(brand) && <Check size={12} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="hidden"
                />
                <span className={`text-xs font-bold uppercase  transition-colors ${selectedBrands.includes(brand) ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
                  {brand}
                </span>
              </label>
            ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <h3 className="text-xs font-bold uppercase  text-gray-400">Price Range</h3>
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedPrices.includes(range.label) ? 'bg-primary border-primary' : 'border-gray-200 bg-gray-50 group-hover:border-primary/50'}`}>
                {selectedPrices.includes(range.label) && <Check size={12} className="text-white" />}
              </div>
              <input
                type="checkbox"
                checked={selectedPrices.includes(range.label)}
                onChange={() => handlePriceChange(range.label)}
                className="hidden"
              />
              <span className={`text-xs font-bold uppercase  transition-colors ${selectedPrices.includes(range.label) ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-outfit pb-24">
      
      {/* Premium Hero Banner */}
      <div className="relative bg-gray-900 py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&h=400&fit=crop" alt="Shop Banner" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="text-primary font-bold uppercase tracking-wide text-xs mb-4 block">New Arrivals 2024</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase leading-tight mb-6">
              Discover Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400">Signature Look</span>
            </h1>
            <p className="text-gray-300 font-medium text-sm md:text-base max-w-md leading-relaxed">
              Shop our curated collection of premium beauty essentials designed to enhance your natural radiance.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1400px] mt-8 md:mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm sticky top-[100px]">
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filter Drawer Overlay */}
          <div 
            className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[200] lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Mobile Filter Drawer */}
          <div className={`fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white shadow-2xl z-[210] lg:hidden transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold uppercase  text-gray-900 flex items-center gap-2">
                <Filter size={20} className="text-primary" /> Filters
              </h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <FilterContent />
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold uppercase text-xs  shadow-xl shadow-gray-900/20 active:opacity-90 transition-opacity"
              >
                Show {sortedProducts.length} Results
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-grow min-w-0">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 lg:p-5 rounded-2xl border border-gray-100 shadow-sm">
              
              <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start gap-4">
                {/* Mobile Filter Trigger */}
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-xs font-bold uppercase  text-gray-800 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <Filter size={16} /> Filter
                </button>
                <p className="text-[11px] lg:text-xs text-gray-500 font-bold uppercase ">
                  Showing <span className="text-gray-900 font-bold">{sortedProducts.length}</span> products
                </p>
              </div>

              {/* In-page Direct Search Box */}
              <div className="relative w-full sm:max-w-xs group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    if (setSearchQuery) setSearchQuery(e.target.value);
                  }}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-primary/30 focus:bg-white transition-all font-bold placeholder:font-medium text-gray-700"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <span className="hidden sm:inline-block text-[10px] font-semibold text-gray-400 uppercase ">Sort By</span>
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold uppercase  px-4 py-2.5 pr-10 outline-none cursor-pointer text-gray-800 hover:bg-gray-100 focus:border-primary/30 transition-all w-full sm:w-auto"
                  >
                    <option value="Popularity">Popularity</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Customer Rating">Customer Rating</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 flex flex-col h-[380px] animate-pulse">
                    <div className="aspect-square w-full bg-gray-100 rounded-2xl mb-4"></div>
                    <div className="h-3 w-1/3 bg-gray-100 rounded mb-2"></div>
                    <div className="h-5 w-3/4 bg-gray-100 rounded mb-4"></div>
                    <div className="mt-auto h-10 w-full bg-gray-100 rounded-xl"></div>
                  </div>
                ))
              ) : sortedProducts.length === 0 ? (
                <div className="col-span-full py-32 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-inner">
                    <Search size={32} className="text-gray-300" />
                  </div>
                  <p className="text-base font-bold text-gray-800 uppercase  mb-2">No Products Found</p>
                  <p className="text-xs text-gray-400 uppercase font-bold ">Try adjusting your filters or search query</p>
                  <button onClick={clearAllFilters} className="mt-8 px-8 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase  hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
                    Reset All Filters
                  </button>
                </div>
              ) : (
                sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Image Wrapper */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50 ">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-2xl shadow-sm transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-110"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 flex justify-between items-start z-20">
                        {product.badge ? (
                          <span className="bg-gray-900 text-white text-[8px] sm:text-[9px] font-bold uppercase  px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg">
                            {product.badge}
                          </span>
                        ) : (
                          <div></div>
                        )}
                        
                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                          className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md border ${
                            wishlist.includes(product.id)
                              ? 'bg-primary border-primary text-white'
                              : 'bg-white/80 border-white text-gray-400 hover:text-primary hover:bg-white'
                          }`}
                        >
                          <Heart size={16} fill={wishlist.includes(product.id) ? "currentColor" : "none"} className="mt-[1px]" />
                        </button>
                      </div>


                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-5 flex flex-col flex-grow text-left relative bg-white z-10">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 sm:mb-2 gap-1 sm:gap-0">
                        <span className="text-[8px] sm:text-[9px] font-bold uppercase  text-primary/80 truncate w-full">
                          {product.brand}
                        </span>
                        <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                          <Star size={8} className="text-yellow-400 fill-yellow-400 sm:w-2.5 sm:h-2.5" />
                          <span className="text-[9px] sm:text-[10px] font-bold text-gray-700">{product.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-gray-900 font-bold text-[11px] sm:text-sm uppercase leading-snug mb-0.5 sm:mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[8px] sm:text-[10px] font-bold uppercase  text-gray-400 mb-2 sm:mb-4">{product.category}</p>
                      
                      {/* Footer Info */}
                      <div className="mt-auto pt-2 sm:pt-4 border-t border-gray-100/60">
                        <div className="mb-2 sm:mb-3">
                          <span className="text-sm sm:text-lg font-bold text-gray-900">₹{product.price}</span>
                        </div>
                        <button
                          onClick={() => {
                            const cartItemLocal = {
                              id: product.firstVariant?._id || product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                            };
                            addToCart(cartItemLocal, product.firstVariant?._id || product.id, product.originalProduct?._id || product.id);
                            toast.success(`${product.name} added to cart`);
                          }}
                          className="w-full bg-gray-900 hover:bg-primary text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold uppercase text-[9px] sm:text-[10px]  shadow-md hover:shadow-primary/30 transition-all flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag size={12} className="sm:w-[14px] sm:h-[14px]" /> <span className="hidden sm:inline">Add to Cart</span><span className="sm:hidden">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className="mt-16 mb-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                      p === currentPage
                        ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20'
                        : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-4 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold text-xs uppercase flex items-center transition-all ml-2 cursor-pointer"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
