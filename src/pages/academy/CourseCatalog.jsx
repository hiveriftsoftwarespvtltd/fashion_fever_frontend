import React, { useState, useEffect } from 'react';
import { 
  Play, 
  BookOpen, 
  Clock, 
  Search, 
  Sparkles, 
  Globe, 
  SlidersHorizontal,
  ChevronRight,
  BookMarked,
  Heart,
  LayoutGrid,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublicUserCourseList, getCourseCategories, searchCourses } from '../../api/educatorService';
import { toast } from '../../utils/toast';
import config from '../../config/config';
import acadmyHeroImg from '../../assets/acadmyhero.png';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [langFilter, setLangFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());

  const toggleWishlist = (id) => {
    setWishlistedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Removed from wishlist");
      } else {
        next.add(id);
        toast.success("Added to wishlist");
      }
      return next;
    });
  };

  // Debounce search input to query API
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInputValue);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 450);
    return () => clearTimeout(timer);
  }, [searchInputValue]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);

  // Description expansion state
  const [expandedCourseIds, setExpandedCourseIds] = useState(new Set());

  const getThumbnailUrl = (courseItem) => {
    if (!courseItem) return '';
    const thumbnail = courseItem.thumbnail;
    if (!thumbnail) return '';

    // Check if thumbnail is a populated object
    if (thumbnail.url && typeof thumbnail.url === 'string') {
      return thumbnail.url;
    }
    
    // Check if thumbnail is a direct URL string or base64 data
    if (typeof thumbnail === 'string') {
      if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://') || thumbnail.startsWith('data:')) {
        return thumbnail;
      }
      // If it looks like a Mongo ID or filename, resolve via backend file retrieval route
      return `${config.API_URL}/file/get-file/${thumbnail}`;
    }
    
    return '';
  };
  
  const toggleDescription = (id) => {
    setExpandedCourseIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Fetch categories list on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCourseCategories();
        if (res?.success) {
          const list = res.data?.data || res.data || [];
          setCategoriesList(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch courses with active category parameter or search query and pagination
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: limit
        };
        
        let res;
        
        if (searchQuery.trim()) {
          params.keyword = searchQuery.trim();
          res = await searchCourses(params);
        } else {
          if (activeCategory !== 'All') {
            const selectedCat = categoriesList.find(c => (c.label || c.name) === activeCategory);
            if (selectedCat) {
              params.categoryId = selectedCat._id;
            }
          }
          res = await getPublicUserCourseList(params);
        }

        if (res?.success) {
          const list = res.data?.courses || res.data?.data?.courses || res.data || [];
          setCourses(Array.isArray(list) ? list : []);
          
          const pagination = res.data?.pagination || res.data?.data?.pagination;
          if (pagination) {
            setTotalPages(pagination.totalPages || 1);
            setCurrentPage(pagination.currentPage || 1);
          } else {
            setTotalPages(1);
          }
        } else {
          toast.error(res?.message || 'Failed to fetch courses');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        toast.error('Could not connect to the server');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [activeCategory, currentPage, limit, categoriesList, searchQuery]);

  // Dynamically extract categories from list for tab controls
  const categories = ['All', ...categoriesList.map(c => c.label || c.name).filter(Boolean)];

  // Frontend local filtering for level and language
  const filteredCourses = courses.filter(course => {
    const matchesLevel = levelFilter === 'All' || course.level === levelFilter;
    const matchesLang = langFilter === 'All' || course.language === langFilter;
    return matchesLevel && matchesLang;
  });

  const handleCategoryChange = (catName) => {
    setActiveCategory(catName);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-outfit pb-24 text-left text-gray-700">
      
      {/* Academy Full-Width Hero Banner with Clean Text Overlay */}
      <div className="relative w-full overflow-hidden bg-pink-100/50 border-b border-gray-200 h-[140px] sm:h-[200px] md:h-[240px]">
        <img
          src={acadmyHeroImg}
          alt="FashionFever Pro Academy Banner"
          className="w-full h-full object-cover object-center block absolute inset-0"
        />

        {/* Transparent Text Overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16">
            <div className="max-w-xl text-left space-y-1 sm:space-y-2">

              <span className="block text-[#ff4d6d] font-bold text-[9px] sm:text-[11px] md:text-xs tracking-wide">
                FashionFever Pro Academy
              </span>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-normal text-gray-900 font-serif leading-[1.1] tracking-tight">
                Unlock Your <span className="font-serif">Creative Genius</span>
              </h1>

              <p className="text-gray-600 font-normal text-[11px] sm:text-xs md:text-sm leading-snug max-w-md hidden sm:block">
                Step-by-step masterclasses led by industry heavyweights. Build your professional beauty portfolio.
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* Main Course Catalog Area */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        {/* Filter Toolbar Matching Reference Screenshot */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder="Search beauty courses..." 
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-800 placeholder:text-gray-400 font-medium outline-none focus:border-[#ff4d6d] focus:ring-1 focus:ring-[#ff4d6d]/20 transition-all shadow-xs"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:border-gray-300 transition-all shadow-xs"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {categories.slice(0, 5).map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                    isActive 
                      ? 'bg-pink-50/80 border-[#ff4d6d] text-[#ff4d6d] shadow-2xs' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {cat === 'All' && <LayoutGrid size={14} className={isActive ? 'text-[#ff4d6d]' : 'text-gray-400'} />}
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Filters Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showFilters ? 'bg-[#ff4d6d] border-[#ff4d6d] text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal size={14} /> Filters <ChevronDown size={14} />
          </button>
        </div>

        {/* Extra Filter Options Drawer */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-gray-200 mb-8 text-sm font-semibold shadow-xs animate-fadeIn">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1.5">Level</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 outline-none font-medium"
              >
                <option value="All">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1.5">Language</label>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 outline-none font-medium"
              >
                <option value="All">All Languages</option>
                <option value="HINDI">Hindi</option>
                <option value="ENGLISH">English</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setLevelFilter('All');
                  setLangFilter('All');
                  setActiveCategory('All');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="w-full bg-pink-50 hover:bg-pink-100 text-[#ff4d6d] p-2.5 rounded-xl border border-pink-200 transition-all cursor-pointer font-bold"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Horizontal Course Cards (2 Column Grid) */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((skeleton) => (
              <div key={skeleton} className="bg-white rounded-3xl overflow-hidden border border-gray-200 animate-pulse h-64 flex" />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-200 p-8 flex flex-col items-center shadow-xs">
            <BookMarked size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-400 font-semibold text-sm">No matching masterclasses found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourses.map((course) => {
                const categoryName = course.categoryId?.label || course.categoryId?.name || course.category || 'Skin Care';
                const price = course.sellingPrice || course.offeredPrice || course.price || 600;

                return (
                  <div 
                    key={course._id} 
                    className="bg-white rounded-3xl border border-gray-200/90 hover:border-gray-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row text-left group overflow-hidden"
                  >
                    {/* Left: Thumbnail Image & Level Badge */}
                    <div className="sm:w-60 md:w-64 lg:w-72 shrink-0 aspect-[4/3] sm:aspect-auto relative bg-gray-100 overflow-hidden">
                      {getThumbnailUrl(course) ? (
                        <img 
                          src={getThumbnailUrl(course)} 
                          alt={course.title} 
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-pink-50">
                          <Play size={28} className="text-[#ff4d6d]" />
                        </div>
                      )}
                      
                      {/* Level Badge Over Top-Left Image */}
                      {course.level && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-black/75 backdrop-blur-xs text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                            {course.level}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right: Details & Action */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                      <div>
                        {/* Title & Wishlist Button */}
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/academy/course/${course._id}`}>
                            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug group-hover:text-[#ff4d6d] transition-colors line-clamp-1">
                              {course.title}
                            </h3>
                          </Link>
                          <button 
                            type="button"
                            onClick={() => toggleWishlist(course._id)}
                            className="text-gray-400 hover:text-[#ff4d6d] transition-colors p-1 shrink-0"
                          >
                            <Heart size={18} className={wishlistedIds.has(course._id) ? 'fill-[#ff4d6d] text-[#ff4d6d]' : ''} />
                          </button>
                        </div>

                        {/* Category Pill */}
                        <div className="mt-1.5">
                          <span className="inline-block px-2.5 py-0.5 bg-pink-50 text-[#ff4d6d] text-[10px] font-extrabold rounded-md uppercase tracking-wide">
                            {categoryName}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-500 font-medium mt-2.5 line-clamp-2 leading-relaxed">
                          {course.description || course.subtitle || `${course.title} - Professional step-by-step masterclass`}
                        </p>

                        {/* Language & Duration Metrics */}
                        <div className="flex items-center gap-4 mt-3 text-xs font-bold text-gray-500">
                          <span className="flex items-center gap-1">
                            <BookOpen size={13} className="text-[#ff4d6d]" /> {course.language || 'HINDI'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-gray-400" /> {course.totalDurationInMinutes || 27} Mins
                          </span>
                        </div>
                      </div>

                      {/* Dotted Divider & Fee + Enroll Button */}
                      <div className="mt-5 pt-3 border-t border-dashed border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-700">Fee Structure</span>
                          <span className="text-base font-extrabold text-gray-900">₹{price}</span>
                        </div>

                        <Link 
                          to={`/academy/course/${course._id}`} 
                          className="w-full bg-[#ff4d6d] hover:bg-[#e63956] text-white py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-pink-500/15 flex items-center justify-center gap-2"
                        >
                          Enroll Class <ArrowRight size={14} />
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12 pt-6 border-t border-gray-150">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 rounded-lg border border-gray-250 bg-white text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer active:scale-95"
                >
                  Prev
                </button>
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 rounded-lg border border-gray-250 bg-white text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer active:scale-95"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default CourseCatalog;
