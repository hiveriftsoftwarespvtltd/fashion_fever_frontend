import React, { useState } from 'react';
import { 
  Play, 
  BookOpen, 
  Clock, 
  Star, 
  ChevronRight, 
  Award,
  Video,
  Layers,
  Search,
  Sparkles,
  Users
} from 'lucide-react';

const CourseCatalog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Makeup', 'Skincare', 'Hair Styling', 'Business'];

  const courses = [
    { id: 1, title: 'Professional Bridal Makeup Masterclass', instructor: 'Mehak Arora', duration: '12h 45m', lessons: 24, rating: 4.9, students: '1.2k', price: '₹4,999', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&h=600&fit=crop', level: 'Advanced', category: 'Makeup', badge: 'Bestseller' },
    { id: 2, title: 'Skincare Science: Complete Routine 101', instructor: 'Dr. Sarah', duration: '4h 20m', lessons: 8, rating: 4.8, students: '850', price: '₹1,250', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop', level: 'Beginner', category: 'Skincare', badge: 'Trending' },
    { id: 3, title: 'Advanced Hair Styling & Extensions', instructor: 'Rohan Shah', duration: '8h 15m', lessons: 15, rating: 4.7, students: '540', price: '₹2,499', image: 'https://images.unsplash.com/photo-1527799822367-a233b47b0ee1?w=800&h=600&fit=crop', level: 'Intermediate', category: 'Hair Styling', badge: 'New' },
    { id: 4, title: 'Flawless Base & Contouring Techniques', instructor: 'Priya Verma', duration: '6h 30m', lessons: 12, rating: 4.9, students: '2.1k', price: '₹1,999', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=800&h=600&fit=crop', level: 'All Levels', category: 'Makeup' },
    { id: 5, title: 'Build Your Beauty Business Empire', instructor: 'Anita Desai', duration: '10h 00m', lessons: 20, rating: 4.8, students: '920', price: '₹3,499', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=800&h=600&fit=crop', level: 'Advanced', category: 'Business' },
    { id: 6, title: 'Everyday Glam: 15-Minute Makeup', instructor: 'Neha Singh', duration: '2h 15m', lessons: 5, rating: 4.6, students: '3.5k', price: '₹999', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=600&fit=crop', level: 'Beginner', category: 'Makeup' },
  ];

  const filteredCourses = activeCategory === 'All' ? courses : courses.filter(c => c.category === activeCategory);

  return (
    <div className="bg-[#fafafa] min-h-screen font-outfit pb-20 text-left">
      {/* Hero Section */}
      <div className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-[#fafafa] font-outfit">
        
        {/* Ambient Background Blur Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none select-none">
          <div className="absolute -top-[10%] -right-[10%] w-[70%] sm:w-[50%] h-[50%] bg-primary/10 rounded-full blur-[80px] md:blur-[120px]"></div>
          <div className="absolute top-[30%] -left-[20%] w-[60%] sm:w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[60px] md:blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6">
            
            {/* Top Floating Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white border border-gray-100/80 shadow-sm mb-2 md:mb-4">
              <Sparkles size={14} className="text-primary" />
              <span className="text-[10px] md:text-xs font-black uppercase  text-gray-800">
                WakeUp Academy
              </span>
            </div>
            
            {/* Responsive Fonts Matrix Header */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.15] md:leading-tight uppercase ">
              Master the Art of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Beauty</span>
            </h1>
            
            {/* Fluid Subtitle Paragraph */}
            <p className="text-gray-400 font-bold text-xs sm:text-sm md:text-base max-w-xl md:max-w-2xl mx-auto leading-relaxed uppercase ">
              Elevate your skills with exclusive masterclasses from top industry professionals. Learn at your own pace, anywhere, anytime.
            </p>

            {/* Responsive Input Form Shell Layout */}
            <div className="mt-8 md:mt-12 max-w-xl mx-auto relative group px-1 sm:px-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60"></div>
              
              <div className="relative flex flex-col sm:flex-row items-center bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 gap-2 sm:gap-0 w-full">
                
                <div className="flex items-center flex-1 w-full pl-3 sm:pl-4">
                  <Search size={18} className="text-gray-400 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search for courses, skills..." 
                    className="w-full bg-transparent border-none outline-none py-3 px-3 text-xs md:text-sm font-bold text-gray-800 placeholder:text-gray-400 placeholder:font-normal"
                  />
                </div>
                
                <button className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white px-6 py-3.5 sm:py-3 rounded-xl font-black text-xs uppercase  transition-all shadow-md shadow-primary/20 cursor-pointer active:scale-95">
                  Search
                </button>
                
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Categories & Catalog */}
      <div className="container mx-auto px-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase  transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105' 
                  : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group flex flex-col">
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {course.badge && (
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase  px-3 py-1.5 rounded-lg shadow-sm">
                      {course.badge}
                    </span>
                  )}
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase  px-3 py-1.5 rounded-lg border border-white/10">
                    {course.level}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-[11px] font-black text-gray-800">{course.rating}</span>
                </div>

                {/* Play Button Hover Effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl shadow-primary/50 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                    <Play size={24} fill="white" className="text-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-3">
                  <div className="text-[9px] font-bold text-primary uppercase  mb-1.5">{course.category}</div>
                  <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=random`} alt={course.instructor} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase ">By {course.instructor}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-50 text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-600 uppercase">{course.duration}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-x border-gray-50">
                    <BookOpen size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-600 uppercase">{course.lessons} Lessons</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-600 uppercase">{course.students}</span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase ">Course Fee</span>
                    <span className="text-xl font-black text-gray-900">{course.price}</span>
                  </div>
                  <button className="bg-gray-900 hover:bg-primary text-white px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase  flex items-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-primary/30 group/btn cursor-pointer">
                    Enroll <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-32">
          <div className="text-center mb-16 text-center">
            <h2 className="text-3xl font-black text-gray-900 uppercase  mb-4">Why Learn With Us?</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">Join thousands of beauty enthusiasts elevating their craft through our premium learning experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative text-center">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent hidden md:block -z-10"></div>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 text-center space-y-6 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-50 to-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto shadow-inner">
                <Award size={36} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase text-gray-900 mb-2">Industry Certification</h4>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">Earn certificates recognized by top global salons and beauty brands upon completion.</p>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-3xl text-center space-y-6 shadow-2xl hover:-translate-y-2 transition-transform duration-300 transform md:-translate-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-white mx-auto shadow-inner backdrop-blur-sm">
                <Video size={36} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase text-white mb-2">Cinematic Quality</h4>
                <p className="text-sm font-medium text-gray-400 leading-relaxed">Immerse yourself in 4K resolution tutorials with multi-angle close-ups for perfect clarity.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 text-center space-y-6 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 mx-auto shadow-inner">
                <Layers size={36} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase text-gray-900 mb-2">Lifetime Access</h4>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">Learn at your own pace. Revisit the techniques and modules whenever you need a refresher.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;
