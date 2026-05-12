import React, { useState } from 'react';
import { 
  Play, 
  ChevronLeft, 
  CheckCircle2, 
  Lock, 
  Clock, 
  MessageSquare,
  FileText,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CoursePlayer = () => {
  const [activeLesson, setActiveLesson] = useState(1);

  const lessons = [
    { id: 1, title: 'Introduction to Skin Tones', duration: '12:45', completed: true, locked: false },
    { id: 2, title: 'Understanding Undertones', duration: '15:20', completed: false, locked: false },
    { id: 3, title: 'Concealing & Correcting', duration: '22:10', completed: false, locked: true },
    { id: 4, title: 'Foundation Application', duration: '18:05', completed: false, locked: true },
    { id: 5, title: 'Setting & Baking', duration: '10:30', completed: false, locked: true },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-black/50 border-b border-white/10 flex items-center justify-between px-6 backdrop-blur-md">
         <div className="flex items-center gap-4">
            <Link to="/academy" className="text-white/50 hover:text-white transition-all">
               <ChevronLeft size={24} />
            </Link>
            <h1 className="text-white text-sm font-bold uppercase">Professional Bridal Makeup</h1>
         </div>
         <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[10px] font-bold text-white/40 uppercase">Your Progress</span>
               <div className="w-32 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div className="w-1/5 h-full bg-primary shadow-[0_0_10px_#da016a]"></div>
               </div>
            </div>
            <button className="bg-primary text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase shadow-xl shadow-primary/20">
               Next Lesson
            </button>
         </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Content (Video Player) */}
        <div className="flex-1 flex flex-col bg-black">
           <div className="flex-1 relative group cursor-pointer overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&h=800&fit=crop" 
                alt="Video Preview" 
                className="w-full h-full object-cover opacity-60 grayscale-[50%] group-hover:scale-105 transition-transform duration-[2s]" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform">
                    <Play size={40} fill="white" />
                 </div>
              </div>
              {/* Custom Controls Bar Mockup */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent p-6 flex items-center gap-6">
                 <div className="flex-1 h-1 bg-white/20 rounded-full relative">
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-primary"></div>
                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl"></div>
                 </div>
                 <span className="text-white text-[10px] font-bold">12:45 / 45:00</span>
              </div>
           </div>

           {/* Video Info Tabs */}
           <div className="bg-gray-900 border-t border-white/5 p-8">
              <div className="flex gap-8 mb-8 border-b border-white/5 pb-4">
                 <button className="text-primary text-[10px] font-bold uppercase relative pb-4">
                    Overview
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>
                 </button>
                 <button className="text-white/40 text-[10px] font-bold uppercase hover:text-white transition-all pb-4">Notes</button>
                 <button className="text-white/40 text-[10px] font-bold uppercase hover:text-white transition-all pb-4">Q&A</button>
              </div>
              <div className="max-w-3xl">
                 <h2 className="text-white text-xl font-bold uppercase mb-4">Introduction to Skin Tones</h2>
                 <p className="text-white/50 text-sm leading-relaxed mb-6 font-medium">In this fundamental lesson, we explore the primary skin tone categories and how to accurately identify them under different lighting conditions. This is the first step to becoming a professional makeup artist.</p>
                 <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-white/60 hover:text-white transition-all text-[10px] font-bold uppercase bg-white/5 px-4 py-2 rounded-xl">
                       <FileText size={16} /> Download Resources
                    </button>
                    <button className="flex items-center gap-2 text-white/60 hover:text-white transition-all text-[10px] font-bold uppercase bg-white/5 px-4 py-2 rounded-xl">
                       <MessageSquare size={16} /> Discuss with Peers
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Sidebar (Playlist) */}
        <div className="w-full lg:w-[400px] bg-gray-900 border-l border-white/10 flex flex-col h-full">
           <div className="p-6 border-b border-white/10">
              <h3 className="text-white text-sm font-bold uppercase mb-2">Course Curriculum</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase">24 Lessons • 12.5 Hours</p>
           </div>
           <div className="flex-1 overflow-y-auto scrollbar-hide">
              {lessons.map((lesson) => (
                <button 
                  key={lesson.id}
                  onClick={() => !lesson.locked && setActiveLesson(lesson.id)}
                  className={`w-full p-6 flex items-start gap-4 transition-all hover:bg-white/5 border-b border-white/5 text-left ${activeLesson === lesson.id ? 'bg-primary/10' : ''} ${lesson.locked ? 'opacity-50' : ''}`}
                >
                   <div className="mt-1">
                      {lesson.completed ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : lesson.locked ? (
                        <Lock size={20} className="text-white/30" />
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 ${activeLesson === lesson.id ? 'border-primary' : 'border-white/20'}`}></div>
                      )}
                   </div>
                   <div className="flex-grow">
                      <h4 className={`text-sm font-bold mb-1 ${activeLesson === lesson.id ? 'text-primary' : 'text-white'}`}>
                        {lesson.id}. {lesson.title}
                      </h4>
                      <div className="flex items-center gap-3">
                         <span className="flex items-center gap-1 text-[10px] font-bold text-white/30 uppercase">
                            <Clock size={12} /> {lesson.duration}
                         </span>
                         {!lesson.locked && !lesson.completed && (
                           <span className="text-[8px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">Watch Now</span>
                         )}
                      </div>
                   </div>
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
