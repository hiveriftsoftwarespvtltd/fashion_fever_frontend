import React from 'react';
import { Loader2, Play, Clock, Edit, Trash2 } from 'lucide-react';
import DataTable from '../../../components/shared/DataTable';

const EducatorCourses = ({
  isDarkMode,
  courses,
  coursesLoading,
  courseColumns,
  setIsCreateModalOpen,
  setEditingCourse,
  handleDelete
}) => {
  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className={`text-base sm:text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>My Courses List</h3>
          <p className="text-[9px] sm:text-sm font-bold text-gray-400 uppercase mt-0.5">Manage and organize your published beauty tutorials</p>
        </div>
        <button 
          onClick={() => {
            setEditingCourse(null);
            setIsCreateModalOpen(true);
          }}
          className="whitespace-nowrap flex-shrink-0 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-primary hover:bg-primary/95 text-sm sm:text-xs font-black uppercase rounded-xl shadow-md shadow-primary/20 transition-all cursor-pointer hover:scale-[1.01]"
        >
          + Add Course
        </button>
      </div>

      {coursesLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-primary mb-3" size={32} />
          <span className="text-xs font-bold text-gray-455 uppercase tracking-widest animate-pulse">Syncing Course Catalog...</span>
        </div>
      ) : courses.length > 0 ? (
        <>
          {/* Course View Table */}
          <div className="overflow-x-auto w-full">
            <DataTable columns={courseColumns} data={courses} loading={coursesLoading} />
          </div>
        </>
      ) : (
        <div className={`border p-6 sm:p-12 rounded-3xl shadow-sm text-center space-y-4 ${isDarkMode ? 'bg-gray-900 border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Play size={22} className="text-primary fill-primary" />
          </div>
          <h4 className={`text-sm sm:text-base font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-805'}`}>No Courses Listed</h4>
          <p className="text-sm sm:text-xs text-gray-400 font-bold uppercase max-w-xs mx-auto leading-relaxed">
            Start uploading course modules, lessons, and tutorials to share your beauty skills with the platform!
          </p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4.5 py-2.5 sm:px-5 sm:py-3 bg-primary hover:bg-primary/95 text-sm sm:text-xs font-black uppercase rounded-xl transition-all cursor-pointer"
          >
            Create First Course
          </button>
        </div>
      )}
    </div>
  );
};

export default EducatorCourses;
