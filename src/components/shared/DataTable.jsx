import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Modern Data Table Component
 */
const DataTable = ({ columns, data, loading, onRowClick }) => {
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className={`h-[400px] flex flex-col items-center justify-center rounded-3xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Loading Records...</p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-8 py-6 text-[10px] font-bold uppercase  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {data.length > 0 ? data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-all group cursor-pointer ${isDarkMode ? 'hover:bg-gray-900/30' : 'hover:bg-gray-50/50'}`}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-8 py-6">
                    <div className={`transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600 font-bold'}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </div>
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="px-8 py-20 text-center">
                  <p className={`font-bold uppercase text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No records found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
