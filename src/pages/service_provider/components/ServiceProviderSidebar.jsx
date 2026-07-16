import React, { useState } from 'react';
import {
  X, LayoutDashboard, Scissors, Calendar, UserCheck, LogOut, ChevronDown, Sparkles, Users, Clock, Wallet, ClipboardList, Landmark
} from 'lucide-react';

const ServiceProviderSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  isDarkMode,
  handleLogout
}) => {
  const NavItem = ({ id, label, icon }) => {
    const selected = activeTab === id;
    return (
      <button
        onClick={() => {
          setActiveTab(id);
          setIsSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 group relative ${
          selected
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : isDarkMode
            ? 'text-gray-400 hover:bg-white/5 hover:text-white'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`}
      >
        {selected && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/60 rounded-full" />
        )}
        <span className={`transition-transform duration-200 group-hover:scale-110 ${selected ? 'text-white' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </button>
    );
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[1001] bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-[1002] w-64 flex flex-col h-screen
          transform transition-transform duration-300 ease-in-out
          lg:sticky lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isDarkMode
            ? 'bg-gray-950 border-r border-white/5'
            : 'bg-white border-r border-gray-100 shadow-xl shadow-gray-200/60'
          }
        `}
      >
        <div className={`h-24 px-5 flex items-center justify-between border-b flex-shrink-0 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
              <span className="text-white text-xs font-black tracking-tight">SP</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-primary tracking-widest leading-none">Wakeup</p>
              <p className={`text-sm font-bold uppercase tracking-wider leading-tight mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Provider Panel
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`lg:hidden p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2 scrollbar-thin">
          <p className={`text-[9px] font-black uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
            Menu
          </p>
          <NavItem id="dashboard" label="Dashboard" icon={<LayoutDashboard size={16} />} />
          <NavItem id="services" label="My Services" icon={<Scissors size={16} />} />
          <NavItem id="staff" label="Manage Staff" icon={<Users size={16} />} />
          <NavItem id="availability" label="Work Availability" icon={<Clock size={16} />} />
          <NavItem id="wallet" label="My Wallet" icon={<Wallet size={16} />} />
          <NavItem id="leads" label="Customer Leads" icon={<ClipboardList size={16} />} />
          <NavItem id="payout" label="Bank Details" icon={<Landmark size={16} />} />
          <NavItem id="profile" label="Business Profile" icon={<UserCheck size={16} />} />
        </nav>

        <div className={`px-3 py-4 border-t flex-shrink-0 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 group ${
              isDarkMode
                ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                : 'text-red-500 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            Logout System
          </button>
        </div>
      </aside>
    </>
  );
};

export default ServiceProviderSidebar;
