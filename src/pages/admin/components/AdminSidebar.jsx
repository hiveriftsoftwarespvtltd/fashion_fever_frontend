import React, { useState, memo, useCallback } from 'react';
import {
  X, LayoutDashboard, Users, Store, CircleAlert, TrendingUp,
  TicketPercent, LogOut, Sparkles, Grid, ShoppingBag, Package,
  Percent, IndianRupee, ChevronDown, CreditCard, Layers, Briefcase, Image, BookOpen, Wallet, ShieldCheck, User, Bell, ClipboardList, Landmark
} from 'lucide-react';

// ==========================================
// OPTIMIZATION: Memoized NavItem Component
// Prevents re-renders and handles smooth transform-gpu scale,
// active color shift, and active indicator animations.
// ==========================================
const NavItem = memo(({ id, label, icon, onClick, activeTab, isDarkMode }) => {
  const selected = activeTab === id;
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group relative transform-gpu will-change-[transform,opacity] ${
        selected
          ? 'bg-primary text-white shadow-lg shadow-primary/25'
          : isDarkMode
          ? 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-0.5'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 hover:translate-x-0.5'
      }`}
      style={{ backfaceVisibility: 'hidden' }}
    >
      {/* Active left indicator bar with smooth height and scale transition */}
      <span 
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-white/60 rounded-full transition-all duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-center transform-gpu will-change-[height,opacity] ${
          selected ? 'h-5 opacity-100 scale-y-100' : 'h-0 opacity-0 scale-y-0'
        }`}
      />
      <span className={`transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${selected ? 'text-white' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
});

NavItem.displayName = 'NavItem';

// ==========================================
// OPTIMIZATION: Memoized SubNavItem Component
// Handles smooth color transitions and scales hover state slightly
// with GPU acceleration to prevent layout shift.
// ==========================================
const SubNavItem = memo(({ id, label, icon, activeTab, isDarkMode, onClick }) => {
  const selected = activeTab === id;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu will-change-[transform,opacity] hover:translate-x-0.5 ${
        selected
          ? isDarkMode
            ? 'bg-primary/15 text-primary font-extrabold'
            : 'bg-primary/10 text-primary font-extrabold'
          : isDarkMode
          ? 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
      }`}
      style={{ backfaceVisibility: 'hidden' }}
    >
      <span className={`transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${selected ? 'text-primary' : isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
});

SubNavItem.displayName = 'SubNavItem';

// ==========================================
// OPTIMIZATION: Memoized GroupHeader Component
// Encapsulates height, opacity, chevron, and margin transitions.
// Uses explicit cubic-bezier transforms to prevent sudden expansion jumps.
// ==========================================
const GroupHeader = memo(({ groupKey, isActive, icon, label, children, isDarkMode, isOpen, onToggle }) => {
  return (
    <div className="space-y-0.5 transform-gpu">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group transform-gpu will-change-[transform,opacity] hover:translate-x-0.5 ${
          isActive
            ? isDarkMode ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'
            : isDarkMode
            ? 'text-gray-400 hover:bg-white/5 hover:text-white'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <span className={`transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${isActive ? 'text-primary' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {icon}
        </span>
        <span className="truncate flex-1 text-left">{label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex-shrink-0 transform-gpu will-change-transform ${isOpen ? 'rotate-180' : ''} ${isActive ? 'text-primary' : isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}
        />
      </button>

      {/* Collapsible Container with buttery smooth spring-like cubic-bezier transition */}
      <div
        style={{
          maxHeight: isOpen ? '180px' : '0px',
          opacity: isOpen ? 1 : 0,
          paddingTop: isOpen ? '4px' : '0px',
          paddingBottom: isOpen ? '4px' : '0px',
          transition: 'max-height 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 350ms cubic-bezier(0.22, 1, 0.36, 1), padding 350ms cubic-bezier(0.22, 1, 0.36, 1)',
          overflow: 'hidden'
        }}
        className="transform-gpu will-change-[max-height,opacity,padding]"
      >
        <div className={`ml-3 pl-3 border-l space-y-0.5 py-1 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          {children}
        </div>
      </div>
    </div>
  );
});

GroupHeader.displayName = 'GroupHeader';

const AdminSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  isDarkMode,
  handleLogout,
  role,
  adminAccess = [],
  isSuperAdmin = false
}) => {
  // Access check helper based on granular permissions list
  const hasAccess = (moduleName) => {
    if (isSuperAdmin) return true;
    return adminAccess.some(item => item.module === moduleName);
  };

  // Group visibility calculations
  const showPeopleSection = hasAccess('USERS') || hasAccess('SERVICE_PROVIDERS') || hasAccess('COURSES') || hasAccess('VENDORS') || hasAccess('INFLUENCERS') || isSuperAdmin;
  const showCatalogSection = hasAccess('COURSES') || hasAccess('VENDORS') || hasAccess('INFLUENCERS') || hasAccess('SERVICE_PROVIDERS');
  const showOperationsSection = hasAccess('VENDORS') || hasAccess('SERVICE_PROVIDERS') || hasAccess('HOME_CONTENT') || hasAccess('FINANCE') || hasAccess('TICKETS') || hasAccess('USERS') || hasAccess('NOTIFICATION');

  // Collapsible dropdown group state
  const [openGroups, setOpenGroups] = useState(() => {
    const isInfluencer = ['influencers', 'commission-slabs', 'influencer-commissions', 'affiliate-dashboard'].includes(activeTab);
    const isVendor = ['vendors', 'vendor-payouts', 'pending'].includes(activeTab);
    return { influencers: isInfluencer, vendors: isVendor };
  });

  // OPTIMIZATION: Memoized state updater to prevent layout shifts
  const toggleGroup = useCallback((key) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const isInfluencerTabActive = ['influencers', 'commission-slabs', 'influencer-commissions', 'affiliate-dashboard'].includes(activeTab);
  const isVendorTabActive = ['vendors', 'vendor-payouts', 'pending'].includes(activeTab);

  // OPTIMIZATION: Callback wrappers to avoid inline function instances
  const handleItemClick = useCallback((id) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
  }, [setActiveTab, setIsSidebarOpen]);

  const handleToggleInfluencer = useCallback(() => toggleGroup('influencers'), [toggleGroup]);
  const handleToggleVendors = useCallback(() => toggleGroup('vendors'), [toggleGroup]);
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), [setIsSidebarOpen]);

  return (
    <>
      {/* 
        OPTIMIZATION: Fade-in / Fade-out backdrop with backdrop-blur transition.
        Replaces hard mounting with opacity/filter transitions to avoid lag and shifts.
      */}
      <div
        className={`fixed inset-0 z-[1001] bg-black/40 backdrop-blur-sm lg:hidden transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu will-change-[opacity,backdrop-filter] ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleCloseSidebar}
      />

      {/* 
        OPTIMIZATION: GPU Accelerated aside container.
        Using Translate3d (via transform-gpu), cubic-bezier easing, and will-change: transform.
      */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[1002] w-64 flex flex-col h-screen
          lg:sticky lg:translate-x-0
          transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          transform-gpu will-change-transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isDarkMode
            ? 'bg-gray-955 border-r border-white/5'
            : 'bg-white border-r border-gray-100 shadow-xl shadow-gray-200/60'
          }
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
                Admin Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseSidebar}
            className={`lg:hidden p-2 rounded-xl transition-all duration-[250ms] ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-thin scroll-smooth">

          {/* Overview */}
          <div className="mb-3">
            <p className={`text-[9px] font-black uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
              Overview
            </p>
            {hasAccess('DASHBOARD') && (
              <NavItem 
                id="dashboard" 
                label="Dashboard" 
                icon={<LayoutDashboard size={16} />} 
                onClick={() => handleItemClick('dashboard')}
                activeTab={activeTab}
                isDarkMode={isDarkMode}
              />
            )}
            <NavItem 
              id="profile" 
              label="My Profile" 
              icon={<User size={16} />} 
              onClick={() => handleItemClick('profile')}
              activeTab={activeTab}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* People */}
          {showPeopleSection && (
            <div className="mb-3">
              <p className={`text-[9px] font-black uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                People
              </p>
              <div className="space-y-0.5">
                {hasAccess('USERS') && (
                  <NavItem 
                    id="users" 
                    label="User Management" 
                    icon={<Users size={16} />} 
                    onClick={() => handleItemClick('users')}
                    activeTab={activeTab}
                    isDarkMode={isDarkMode}
                  />
                )}
                {hasAccess('SERVICE_PROVIDERS') && (
                  <NavItem 
                    id="service-providers" 
                    label="Service Providers" 
                    icon={<Briefcase size={16} />} 
                    onClick={() => handleItemClick('service-providers')}
                    activeTab={activeTab}
                    isDarkMode={isDarkMode}
                  />
                )}
                {hasAccess('COURSES') && (
                  <>
                    <NavItem 
                      id="educators" 
                      label="Educator Approvals" 
                      icon={<BookOpen size={16} />} 
                      onClick={() => handleItemClick('educators')}
                      activeTab={activeTab}
                      isDarkMode={isDarkMode}
                    />
                    <NavItem 
                      id="all-educators" 
                      label="Educator Directory" 
                      icon={<BookOpen size={16} />} 
                      onClick={() => handleItemClick('all-educators')}
                      activeTab={activeTab}
                      isDarkMode={isDarkMode}
                    />
                  </>
                )}
                {isSuperAdmin && (
                  <NavItem 
                    id="sub-admins" 
                    label="Sub-Admins" 
                    icon={<ShieldCheck size={16} />} 
                    onClick={() => handleItemClick('sub-admins')}
                    activeTab={activeTab}
                    isDarkMode={isDarkMode}
                  />
                )}

                {/* Vendors Group */}
                {hasAccess('VENDORS') && (
                  <GroupHeader
                    groupKey="vendors"
                    isActive={isVendorTabActive}
                    icon={<Store size={16} />}
                    label="Vendor Control"
                    isDarkMode={isDarkMode}
                    isOpen={openGroups.vendors}
                    onToggle={handleToggleVendors}
                  >
                    <SubNavItem id="vendors" label="Vendor List" icon={<Store size={13} />} activeTab={activeTab} isDarkMode={isDarkMode} onClick={() => handleItemClick('vendors')} />
                    <SubNavItem id="pending" label="Pending Approvals" icon={<CircleAlert size={13} />} activeTab={activeTab} isDarkMode={isDarkMode} onClick={() => handleItemClick('pending')} />
                    <SubNavItem id="vendor-payouts" label="Vendor Payouts" icon={<IndianRupee size={13} />} activeTab={activeTab} isDarkMode={isDarkMode} onClick={() => handleItemClick('vendor-payouts')} />
                  </GroupHeader>
                )}

                {/* Influencers Group */}
                {hasAccess('INFLUENCERS') && (
                  <GroupHeader
                    groupKey="influencers"
                    isActive={isInfluencerTabActive}
                    icon={<TrendingUp size={16} />}
                    label="Influencer Hub"
                    isDarkMode={isDarkMode}
                    isOpen={openGroups.influencers}
                    onToggle={handleToggleInfluencer}
                  >
                    <SubNavItem id="affiliate-dashboard" label="Affiliate Performance" icon={<LayoutDashboard size={13} />} activeTab={activeTab} isDarkMode={isDarkMode} onClick={() => handleItemClick('affiliate-dashboard')} />
                    <SubNavItem id="influencers" label="Influencer List" icon={<Users size={13} />} activeTab={activeTab} isDarkMode={isDarkMode} onClick={() => handleItemClick('influencers')} />
                    <SubNavItem id="commission-slabs" label="Commission Slabs" icon={<Percent size={13} />} activeTab={activeTab} isDarkMode={isDarkMode} onClick={() => handleItemClick('commission-slabs')} />
                    <SubNavItem id="influencer-commissions" label="Commissions & Payouts" icon={<IndianRupee size={13} />} activeTab={activeTab} isDarkMode={isDarkMode} onClick={() => handleItemClick('influencer-commissions')} />
                  </GroupHeader>
                )}
              </div>
            </div>
          )}

          {/* Catalog */}
          {showCatalogSection && (
            <div className="mb-3">
              <p className={`text-[9px] font-black uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                Catalog
              </p>
              <div className="space-y-0.5">
                {(hasAccess('COURSES') || hasAccess('VENDORS')) && (
                  <NavItem id="categories" label="Categories" icon={<Grid size={16} />} onClick={() => handleItemClick('categories')} activeTab={activeTab} isDarkMode={isDarkMode} />
                )}
                {hasAccess('COURSES') && (
                  <NavItem id="course-categories" label="Course Categories" icon={<BookOpen size={16} />} onClick={() => handleItemClick('course-categories')} activeTab={activeTab} isDarkMode={isDarkMode} />
                )}
                {hasAccess('VENDORS') && (
                  <NavItem id="products" label="Products" icon={<Package size={16} />} onClick={() => handleItemClick('products')} activeTab={activeTab} isDarkMode={isDarkMode} />
                )}
                {hasAccess('INFLUENCERS') && (
                  <NavItem id="coupons" label="Coupons" icon={<TicketPercent size={16} />} onClick={() => handleItemClick('coupons')} activeTab={activeTab} isDarkMode={isDarkMode} />
                )}
                {hasAccess('SERVICE_PROVIDERS') && (
                  <NavItem id="subscription-plans" label="Beauty Services" icon={<Sparkles size={16} />} onClick={() => handleItemClick('subscription-plans')} activeTab={activeTab} isDarkMode={isDarkMode} />
                )}
              </div>
            </div>
          )}

          {/* Operations */}
          {showOperationsSection && (
            <div className="mb-3">
              <p className={`text-[9px] font-black uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                Operations
              </p>
              <div className="space-y-0.5">
                {(hasAccess('VENDORS') || hasAccess('SERVICE_PROVIDERS')) && (
                  <NavItem id="orders" label="Orders Manager" icon={<ShoppingBag size={16} />} onClick={() => handleItemClick('orders')} activeTab={activeTab} isDarkMode={isDarkMode} />
                )}
                {hasAccess('SERVICE_PROVIDERS') && (
                  <>
                    <NavItem id="beauty-services" label="Services Subscription" icon={<CreditCard size={16} />} onClick={() => handleItemClick('beauty-services')} activeTab={activeTab} isDarkMode={isDarkMode} />
                    <NavItem id="service-categories" label="Service Categories" icon={<Layers size={16} />} onClick={() => handleItemClick('service-categories')} activeTab={activeTab} isDarkMode={isDarkMode} />
                    <NavItem id="admin-service-leads" label="Service Leads" icon={<ClipboardList size={16} />} onClick={() => handleItemClick('admin-service-leads')} activeTab={activeTab} isDarkMode={isDarkMode} />
                  </>
                )}
                {hasAccess('HOME_CONTENT') && (
                  <>
                    <NavItem id="home-content" label="Home Content" icon={<Image size={16} />} onClick={() => handleItemClick('home-content')} activeTab={activeTab} isDarkMode={isDarkMode} />
                    <NavItem id="home-booking-cards" label="Home Booking Cards" icon={<Sparkles size={16} />} onClick={() => handleItemClick('home-booking-cards')} activeTab={activeTab} isDarkMode={isDarkMode} />
                  </>
                )}
                {(hasAccess('FINANCE') || hasAccess('USERS')) && (
                  <NavItem id="cashback-slabs" label="Cashback Slabs" icon={<Percent size={16} />} onClick={() => handleItemClick('cashback-slabs')} activeTab={activeTab} isDarkMode={isDarkMode} />
                )}
                {hasAccess('FINANCE') && (
                  <>
                    <NavItem id="wallet-balances" label="Wallet Balances" icon={<Wallet size={16} />} onClick={() => handleItemClick('wallet-balances')} activeTab={activeTab} isDarkMode={isDarkMode} />
                    <NavItem id="bank-accounts" label="Bank Accounts" icon={<Landmark size={16} />} onClick={() => handleItemClick('bank-accounts')} activeTab={activeTab} isDarkMode={isDarkMode} />
                  </>
                )}
                {hasAccess('TICKETS') && (
                  <NavItem id="tickets" label="Support Tickets" icon={<CircleAlert size={16} />} onClick={() => handleItemClick('tickets')} activeTab={activeTab} isDarkMode={isDarkMode} />
                )}
                {hasAccess('NOTIFICATION') && (
                  <NavItem id="notifications" label="Notifications Manager" icon={<Bell size={16} />} onClick={() => handleItemClick('notifications')} activeTab={activeTab} isDarkMode={isDarkMode} />
                )}
              </div>
            </div>
          )}
        </nav>

        {/* ── Logout Footer ── */}
        <div className={`px-3 py-4 border-t flex-shrink-0 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-[250ms] group ${
              isDarkMode
                ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                : 'text-red-500 hover:bg-red-55 hover:text-red-600'
            }`}
          >
            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
            Logout System
          </button>
        </div>
      </aside>
    </>
  );
};

export default memo(AdminSidebar);
