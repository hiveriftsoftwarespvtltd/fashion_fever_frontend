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
  BookMarked
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublicUserCourseList, getCourseCategories, searchCourses } from '../../api/educatorService';
import { toast } from '../../utils/toast';
import config from '../../config/config';

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
      
      {/* Premium Hero Banner (Light, Simple & Decent) */}
      <div className="relative pt-16 pb-20 bg-white border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles size={12} className="text-primary" />
              <span className="text-xs font-bold text-primary tracking-wide">
                WakeUp Makeup Pro Academy
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Unlock Your <span className="text-primary">Creative Genius</span>
            </h1>
            
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
              Step-by-step masterclasses led by industry heavyweights. Build your professional beauty portfolio and launch your career with confidence.
            </p>

            {/* Interactive Search Panel */}
            <div className="max-w-md relative pt-3">
              <div className="relative flex items-center bg-gray-50 rounded-xl border border-gray-250 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all p-1">
                <div className="flex items-center flex-1 pl-2">
                  <Search size={18} className="text-gray-400" />
                  <input 
                    type="text" 
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    placeholder="Search beauty courses..." 
                    className="w-full bg-transparent border-none outline-none py-2 px-3 text-sm text-gray-800 placeholder:text-gray-400 placeholder:font-normal font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Course Catalog Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-gray-200">
          {/* Category Pill Navigations */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer border ${
                  activeCategory === cat 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Toggle Extra Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border tracking-wide transition-all cursor-pointer ${
              showFilters ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>

        {/* Extra Filter Options Drawer */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-gray-200 mb-8 animate-fadeIn text-sm font-semibold shadow-sm">
            <div>
              <label className="text-xs font-bold text-gray-550 block mb-1.5">Level</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-750 outline-none font-medium"
              >
                <option value="All">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-550 block mb-1.5">Language</label>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-750 outline-none font-medium"
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
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-650 p-2.5 rounded-xl border border-red-500/20 transition-all cursor-pointer font-bold"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse h-[380px]">
                <div className="bg-gray-100 h-48 w-full" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-6 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-200 p-8 flex flex-col items-center shadow-sm">
            <BookMarked size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-400 font-semibold text-sm">No matching masterclasses found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => {
                const discount = course.sellingPrice < course.offeredPrice
                  ? Math.round(((course.offeredPrice - course.sellingPrice) / course.offeredPrice) * 100)
                  : 0;

                return (
                  <div 
                    key={course._id} 
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col relative text-left"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 border-b border-gray-150">
                      {getThumbnailUrl(course) ? (
                        <img 
                          src={getThumbnailUrl(course)} 
                          alt={course.title} 
                          className="w-full h-full object-cover transition-transform duration-500 ease-in-out opacity-95 group-hover:scale-[1.02]" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-purple-600/5">
                          <Play size={24} className="text-primary" />
                        </div>
                      )}
                      
                      {/* Level Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          {course.level}
                        </span>
                      </div>

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-3 right-3 bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                          {discount}% Off
                        </div>
                      )}
                    </div>

                    {/* Content Box */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="mb-2">
                        <span className="text-sm font-bold text-primary uppercase tracking-wider block mb-0.5">
                          {course.categoryId?.label || course.categoryId?.name || 'Academy'}
                        </span>
                        <Link to={`/academy/course/${course._id}`}>
                          <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                        </Link>
                        {course.subtitle && (
                          <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{course.subtitle}</p>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-550 mb-4 leading-relaxed font-normal">
                        {(() => {
                          const desc = course.description || 'No description provided for this masterclass.';
                          const shouldTruncate = desc.length > 80;
                          const isExpanded = expandedCourseIds.has(course._id);
                          const displayText = shouldTruncate && !isExpanded ? `${desc.slice(0, 80)}...` : desc;
                          return (
                            <>
                              {displayText}
                              {shouldTruncate && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleDescription(course._id);
                                  }}
                                  className="text-primary hover:underline font-semibold ml-1.5 text-[11px] cursor-pointer inline-block"
                                >
                                  {isExpanded ? 'Read Less' : 'Read More'}
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </p>

                      {/* Core Metrics Grid */}
                      <div className="grid grid-cols-2 gap-2 py-2.5 bg-gray-50 rounded-xl border border-gray-150 text-center mb-4 text-gray-550 font-bold uppercase text-[9px]">
                        <div className="flex items-center justify-center gap-1.5">
                          <Globe size={13} className="text-primary" />
                          <span>{course.language}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 border-l border-gray-200">
                          <Clock size={13} className="text-primary" />
                          <span>{course.totalDurationInMinutes || 0} Mins</span>
                        </div>
                      </div>

                      {/* Pricing footer block */}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] font-semibold text-gray-400 tracking-wider mb-0.5">Fee Structure</span>
                          <div className="flex items-baseline gap-1.5">
                            {course.isFree ? (
                              <span className="text-sm font-bold text-emerald-600">FREE</span>
                            ) : (
                              <>
                                <span className="text-sm font-bold text-gray-900">₹{course.sellingPrice}</span>
                                {course.offeredPrice > course.sellingPrice && (
                                  <span className="text-xs font-semibold text-gray-400 line-through">₹{course.offeredPrice}</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        <Link 
                          to={`/academy/course/${course._id}`} 
                          className="bg-primary hover:bg-primary/95 text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wider flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                        >
                          Enroll Class <ChevronRight size={12} />
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
