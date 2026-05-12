import React from 'react';
import { PlayCircle, Clock, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyLearning = () => {
  const enrolledCourses = [
    { 
      id: 1, 
      title: 'Professional Bridal Makeup', 
      instructor: 'Meera Rajput', 
      progress: 45, 
      thumbnail: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop',
      lastWatched: 'Lesson 4: Foundation'
    },
    { 
      id: 2, 
      title: 'Skin Care Fundamentals', 
      instructor: 'Dr. Sarah', 
      progress: 10, 
      thumbnail: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&h=300&fit=crop',
      lastWatched: 'Lesson 1: Introduction'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
           <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-primary">Academy</span>
              <h1 className="text-5xl font-bold text-gray-900 uppercase italic">My Learning</h1>
           </div>
           <div className="flex gap-4">
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                 <Award className="text-primary" size={24} />
                 <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400">Certificates</p>
                    <p className="text-sm font-bold text-gray-900">2 Earned</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {enrolledCourses.map((course) => (
             <div key={course.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group">
                <div className="flex flex-col sm:flex-row h-full">
                   <div className="w-full sm:w-48 h-48 sm:h-auto relative overflow-hidden">
                      <img src={course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <PlayCircle className="text-white" size={40} />
                      </div>
                   </div>
                   <div className="flex-1 p-8 flex flex-col justify-between">
                      <div>
                         <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-primary uppercase">
                            <Clock size={12} /> Continue Learning
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                         <p className="text-xs font-bold text-gray-400 uppercase mb-4">Instructor: {course.instructor}</p>
                         
                         <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                               <span className="text-gray-400">Progress</span>
                               <span className="text-gray-900">{course.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-primary" style={{ width: `${course.progress}%` }}></div>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase italic">Next: {course.lastWatched}</p>
                         </div>
                      </div>
                      
                      <Link to={`/academy/course/${course.id}`} className="mt-6 w-full bg-gray-900 text-white py-4 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-all">
                         Resume Course <ChevronRight size={14} />
                      </Link>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;
