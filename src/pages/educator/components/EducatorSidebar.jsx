import React, { memo } from 'react';
import { Sliders, Video, User, LogOut, X, Landmark } from 'lucide-react';

const EducatorSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  isDarkMode,
  handleLogout
}) => {
  return (
    <>
      {/* Mobile Sidebar Back Drop Overlay */}
      <div 
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1500] md:hidden transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu will-change-[opacity,backdrop-filter] ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Side Navigation */}
      <aside 
        className={`w-64 fixed md:static inset-y-0 left-0 z-[1600] flex flex-col justify-between
          transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          transform-gpu will-change-transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isDarkMode ? 'bg-gray-950 border-r border-white/5' : 'bg-white border-r border-gray-100'}
        `}
        style={{ 
          backfaceVisibility: 'hidden',
          willChange: 'transform'
        }}
      >
        {/* ── Brand Header ── */}
        <div className={`h-24 px-5 flex items-center justify-between border-b flex-shrink-0 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
              <span className="text-white text-xs font-black tracking-tight">FF</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">FashionFever</p>
              <p className={`text-sm font-extrabold uppercase tracking-wider leading-tight mt-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Educator Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`md:hidden p-2 rounded-xl transition-all duration-[250ms] ${isDarkMode ? 'hover:bg-white/5 text-gray-550' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Navigation Links ── */}
        <div className="flex-1 overflow-y-auto px-3 py-4 scroll-smooth">
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('overview');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group relative transform-gpu will-change-[transform,opacity] ${
                activeTab === 'overview' 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : `text-gray-500 hover:text-gray-855 hover:translate-x-0.5 ${isDarkMode ? 'hover:bg-white/5 hover:text-gray-200' : 'hover:bg-gray-50 hover:text-gray-855'}`
              }`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {activeTab === 'overview' && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/60 rounded-full transition-all duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-center transform-gpu" />
              )}
              <span className={`transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${activeTab === 'overview' ? 'text-white' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <Sliders size={15} />
              </span>
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('courses');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group relative transform-gpu will-change-[transform,opacity] ${
                activeTab === 'courses' 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : `text-gray-500 hover:text-gray-855 hover:translate-x-0.5 ${isDarkMode ? 'hover:bg-white/5 hover:text-gray-200' : 'hover:bg-gray-50 hover:text-gray-855'}`
              }`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {activeTab === 'courses' && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/60 rounded-full transition-all duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-center transform-gpu" />
              )}
              <span className={`transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${activeTab === 'courses' ? 'text-white' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <Video size={15} />
              </span>
              <span>Manage Courses</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group relative transform-gpu will-change-[transform,opacity] ${
                activeTab === 'profile' 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : `text-gray-500 hover:text-gray-855 hover:translate-x-0.5 ${isDarkMode ? 'hover:bg-white/5 hover:text-gray-200' : 'hover:bg-gray-50 hover:text-gray-855'}`
              }`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {activeTab === 'profile' && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/60 rounded-full transition-all duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-center transform-gpu" />
              )}
              <span className={`transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${activeTab === 'profile' ? 'text-white' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <User size={15} />
              </span>
              <span>Profile Settings</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('payout');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group relative transform-gpu will-change-[transform,opacity] ${
                activeTab === 'payout' 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : `text-gray-500 hover:text-gray-855 hover:translate-x-0.5 ${isDarkMode ? 'hover:bg-white/5 hover:text-gray-200' : 'hover:bg-gray-50 hover:text-gray-855'}`
              }`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {activeTab === 'payout' && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/60 rounded-full transition-all duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-center transform-gpu" />
              )}
              <span className={`transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${activeTab === 'payout' ? 'text-white' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <Landmark size={15} />
              </span>
              <span>Bank Details</span>
            </button>
          </nav>
        </div>

        {/* Logout Section */}
        <div className={`p-6 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-[250ms] group ${
              isDarkMode
                ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                : 'text-red-500 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default memo(EducatorSidebar);
