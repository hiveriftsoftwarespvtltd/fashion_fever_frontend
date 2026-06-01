import { useState } from 'react';
import {
  X, LayoutDashboard, Users, Store, CircleAlert, TrendingUp,
  TicketPercent, LogOut, Sparkles, Grid, ShoppingBag, Package,
  Percent, IndianRupee, ChevronDown
} from 'lucide-react';

const AdminSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  isDarkMode,
  handleLogout
}) => {
  const [openGroups, setOpenGroups] = useState(() => {
    const isInfluencer = ['influencers', 'commission-slabs', 'influencer-commissions'].includes(activeTab);
    const isVendor = ['vendors', 'vendor-payouts', 'pending'].includes(activeTab);
    return { influencers: isInfluencer, vendors: isVendor };
  });

  const toggleGroup = (key) => setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const isInfluencerTabActive = ['influencers', 'commission-slabs', 'influencer-commissions'].includes(activeTab);
  const isVendorTabActive = ['vendors', 'vendor-payouts', 'pending'].includes(activeTab);

  // Generic nav item
  const NavItem = ({ id, label, icon, onClick }) => {
    const selected = activeTab === id;
    return (
      <button
        onClick={() => { (onClick || (() => setActiveTab(id)))(); setIsSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 group relative ${
          selected
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : isDarkMode
            ? 'text-gray-400 hover:bg-white/5 hover:text-white'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`}
      >
        {/* Active left bar */}
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

  // Sub-item (indented)
  const SubNavItem = ({ id, label, icon }) => {
    const selected = activeTab === id;
    return (
      <button
        onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
        className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 ${
          selected
            ? isDarkMode
              ? 'bg-primary/15 text-primary'
              : 'bg-primary/10 text-primary'
            : isDarkMode
            ? 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
        }`}
      >
        <span className={selected ? 'text-primary' : isDarkMode ? 'text-gray-600' : 'text-gray-400'}>{icon}</span>
        {label}
      </button>
    );
  };

  // Group header with expand/collapse
  const GroupHeader = ({ groupKey, isActive, icon, label, children }) => {
    const open = openGroups[groupKey];
    return (
      <div className="space-y-1">
        <button
          onClick={() => toggleGroup(groupKey)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 group ${
            isActive
              ? isDarkMode ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'
              : isDarkMode
              ? 'text-gray-400 hover:bg-white/5 hover:text-white'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
          }`}
        >
          <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {icon}
          </span>
          <span className="truncate flex-1 text-left">{label}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-180' : ''} ${isActive ? 'text-primary' : isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}
          />
        </button>

        {/* Collapsible sub-items */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className={`ml-3 pl-3 border-l space-y-0.5 py-1 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
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
        {/* ── Brand Header ── */}
        <div className={`px-5 py-6 flex items-center justify-between border-b flex-shrink-0 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
              <span className="text-white text-xs font-black tracking-tight">WM</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-primary tracking-widest leading-none">Wakeup</p>
              <p className={`text-[10px] font-bold uppercase tracking-wider leading-tight mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Admin Console
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

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-thin">

          {/* Overview */}
          <div className="mb-3">
            <p className={`text-[9px] font-black uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
              Overview
            </p>
            <NavItem id="dashboard" label="Dashboard" icon={<LayoutDashboard size={16} />} />
          </div>

          {/* People */}
          <div className="mb-3">
            <p className={`text-[9px] font-black uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
              People
            </p>
            <div className="space-y-0.5">
              <NavItem id="users" label="User Management" icon={<Users size={16} />} />

              {/* Vendors Group */}
              <GroupHeader
                groupKey="vendors"
                isActive={isVendorTabActive}
                icon={<Store size={16} />}
                label="Vendor Control"
              >
                <SubNavItem id="vendors"       label="Vendor List"     icon={<Store size={13} />} />
                <SubNavItem id="pending"        label="Pending Approvals" icon={<CircleAlert size={13} />} />
                <SubNavItem id="vendor-payouts" label="Vendor Payouts"  icon={<IndianRupee size={13} />} />
              </GroupHeader>

              {/* Influencers Group */}
              <GroupHeader
                groupKey="influencers"
                isActive={isInfluencerTabActive}
                icon={<TrendingUp size={16} />}
                label="Influencer Hub"
              >
                <SubNavItem id="influencers"           label="Influencer List"    icon={<Users size={13} />} />
                <SubNavItem id="commission-slabs"      label="Commission Slabs"   icon={<Percent size={13} />} />
                <SubNavItem id="influencer-commissions" label="Commissions & Payouts" icon={<IndianRupee size={13} />} />
              </GroupHeader>
            </div>
          </div>

          {/* Catalog */}
          <div className="mb-3">
            <p className={`text-[9px] font-black uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
              Catalog
            </p>
            <div className="space-y-0.5">
              <NavItem id="categories"     label="Categories"      icon={<Grid size={16} />} />
              <NavItem id="products"       label="Products"        icon={<Package size={16} />} />
              <NavItem id="coupons"        label="Coupons"         icon={<TicketPercent size={16} />} />
            </div>
          </div>

          {/* Operations */}
          <div className="mb-3">
            <p className={`text-[9px] font-black uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
              Operations
            </p>
            <div className="space-y-0.5">
              <NavItem id="orders"         label="Orders Manager"  icon={<ShoppingBag size={16} />} />
              <NavItem id="beauty-services" label="Beauty Services" icon={<Sparkles size={16} />} />
            </div>
          </div>
        </nav>

        {/* ── Logout Footer ── */}
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

export default AdminSidebar;
