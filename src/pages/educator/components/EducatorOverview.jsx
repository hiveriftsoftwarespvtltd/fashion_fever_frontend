import React from 'react';
import { User, BookOpen } from 'lucide-react';

const EducatorOverview = ({
  user,
  stats,
  profile,
  isDarkMode,
  setActiveTab
}) => {
  return (
    <>
      {/* Welcome Message Banner */}
      <div className="mb-6">
        <h2 className={`text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-855'}`}>
          Welcome, {user?.name || 'Educator'}
        </h2>
        <p className="text-[9px] sm:text-sm font-bold text-gray-400 uppercase mt-0.5 sm:mt-1">
          Organize tutorials, analyze academy stats, and engage with online learners
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-3.5 sm:p-5 border rounded-2xl sm:rounded-3xl shadow-sm space-y-2.5 sm:space-y-4 ${isDarkMode ? 'bg-gray-900 border-white/5' : 'bg-white border-gray-100'}`}>
            <div className="flex justify-between items-center">
              <span className="text-[8px] sm:text-sm font-black uppercase text-gray-400 leading-none">{stat.label}</span>
              <div className={`p-1.5 sm:p-2.5 border rounded-lg sm:rounded-xl ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                {React.cloneElement(stat.icon, { size: window.innerWidth < 640 ? 16 : 20 })}
              </div>
            </div>
            <div>
              <h3 className={`text-sm sm:text-xl md:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</h3>
              <p className="text-[7.5px] sm:text-[9px] font-bold text-gray-400 uppercase mt-0.5">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Profile Card */}
        <div className={`border p-4 sm:p-6 rounded-[2rem] shadow-sm space-y-4 sm:space-y-6 ${isDarkMode ? 'bg-gray-900 border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="text-center space-y-3 sm:space-y-4">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto overflow-hidden border shadow-inner flex items-center justify-center ${isDarkMode ? 'bg-gray-955 border-white/5' : 'bg-gray-50'}`}>
              {profile?.profileImage || profile?.userId?.avatar ? (
                <img 
                  src={profile.profileImage?.url || profile.profileImage || profile.userId?.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User size={32} className="text-primary" />
              )}
            </div>
            <div>
              <h3 className={`text-sm sm:text-base font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {user?.name || 'Educator'}
              </h3>
              <p className="text-[8.5px] sm:text-sm font-bold text-primary uppercase mt-1">Certified Academy Educator</p>
            </div>
          </div>

          <div className={`space-y-4 pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
            <div className="space-y-1.5">
              <span className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-wider block">Bio Description</span>
              <p className={`text-xs font-bold leading-normal p-3 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                {profile?.bio || 'No bio submitted'}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-wider block font-bold">Expertise Badges</span>
              <div className="flex flex-wrap gap-1.5">
                {profile?.expertise?.map((exp, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-primary/5 text-primary border border-primary/10 rounded-full text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider">
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Workspace / Courses placeholder */}
        <div className={`lg:col-span-2 border p-6 sm:p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center space-y-4 ${isDarkMode ? 'bg-gray-900 border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="p-3.5 sm:p-4 bg-primary/10 text-primary rounded-2xl animate-bounce">
            <BookOpen size={28} />
          </div>
          <h3 className={`text-sm sm:text-base font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-855'}`}>Create Educational Content</h3>
          <p className="text-sm sm:text-xs text-gray-400 font-bold max-w-sm uppercase leading-relaxed">
            Start uploading course modules, video guides, and beauty lessons to inspire the community. Let's create your first tutorial!
          </p>
          <button 
            onClick={() => setActiveTab('courses')}
            className="px-4.5 py-2.5 sm:px-5 sm:py-3 bg-primary hover:bg-primary/95 text-sm sm:text-xs font-black uppercase rounded-xl shadow-md shadow-primary/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
          >
            Create First Course
          </button>
        </div>

      </div>
    </>
  );
};

export default EducatorOverview;
