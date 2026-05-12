import React, { useState } from 'react';
import { 
 Play, 
 BookOpen, 
 Clock, 
 Star, 
 ChevronRight, 
 Award,
 Video,
 Layers
} from 'lucide-react';

const CourseCatalog = () => {
 const courses = [
 { id: 1, title: 'Professional Bridal Makeup', instructor: 'Mehak Arora', duration: '12h 45m', lessons: 24, rating: 4.9, price: '₹4,999', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop', level: 'Advanced' },
 { id: 2, title: 'Skincare Science: Routine 101', instructor: 'Dr. Sarah', duration: '4h 20m', lessons: 8, rating: 4.8, price: '₹1,250', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', level: 'Beginner' },
 { id: 3, title: 'Advanced Hair Styling', instructor: 'Rohan Shah', duration: '8h 15m', lessons: 15, rating: 4.7, price: '₹2,499', image: 'https://images.unsplash.com/photo-1527799822367-a233b47b0ee1?w=400&h=300&fit=crop', level: 'Intermediate' },
 ];

 return (
 <div className="bg-gray-50 min-h-screen py-12">
  <div className="container">
  <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
   <div className="space-y-4">
    <span className="text-xs font-bold uppercase text-primary">Wakeup Academy</span>
    <h1 className="text-4xl font-bold text-gray-900 uppercase  ">Learn from the Best</h1>
    <p className="text-gray-400 font-medium max-w-lg">Master the art of beauty with exclusive courses from top industry professionals.</p>
   </div>
   <div className="flex gap-4">
    <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold uppercase text-[10px] shadow-sm border border-gray-100">My Learning</button>
    <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold uppercase text-[10px] shadow-xl">All Courses</button>
   </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
   {courses.map((course) => (
    <div key={course.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
    <div className="relative h-56">
     <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
      <Star size={12} className="fill-yellow-400 text-yellow-400" />
      <span className="text-[10px] font-bold text-gray-800">{course.rating}</span>
     </div>
     <div className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
      <Play size={20} fill="white" />
     </div>
     <div className="absolute bottom-4 left-4">
      <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-bold uppercase px-2 py-1 rounded-lg border border-white/20">{course.level}</span>
     </div>
    </div>
    <div className="p-8">
     <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
     <p className="text-xs font-bold text-gray-400 uppercase mb-6">Instructor: {course.instructor}</p>
     
     <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="flex items-center gap-2 text-gray-500">
       <Clock size={16} />
       <span className="text-[10px] font-bold uppercase ">{course.duration}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
       <BookOpen size={16} />
       <span className="text-[10px] font-bold uppercase ">{course.lessons} Lessons</span>
      </div>
     </div>

     <div className="flex items-center justify-between pt-6 border-t border-gray-50">
      <span className="text-xl font-bold text-gray-900 ">{course.price}</span>
      <button className="text-xs font-bold uppercase text-primary flex items-center gap-1 group/btn">
       Enroll Now <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
     </div>
    </div>
    </div>
   ))}
  </div>

  {/* Benefits Section */}
  <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
   <div className="bg-primary/5 p-10 rounded-[3rem] border border-primary/10 text-center space-y-4">
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto shadow-sm"><Award size={32} /></div>
    <h4 className="text-sm font-bold uppercase text-gray-900">Certified Courses</h4>
    <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">Get professional certificates recognized by top salons.</p>
   </div>
   <div className="bg-gray-900 p-10 rounded-[3rem] text-center space-y-4 shadow-2xl">
    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mx-auto"><Video size={32} /></div>
    <h4 className="text-sm font-bold uppercase text-white">4K Video Quality</h4>
    <p className="text-[10px] font-bold text-white/40 uppercase leading-relaxed">High-definition makeup tutorials with clear close-ups.</p>
   </div>
   <div className="bg-primary/5 p-10 rounded-[3rem] border border-primary/10 text-center space-y-4">
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto shadow-sm"><Layers size={32} /></div>
    <h4 className="text-sm font-bold uppercase text-gray-900">Lifetime Access</h4>
    <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">Learn at your own pace with unlimited course access.</p>
   </div>
  </div>
  </div>
 </div>
 );
};

export default CourseCatalog;
