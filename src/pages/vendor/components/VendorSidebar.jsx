import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  IndianRupee,
  Store,
  LogOut,
  X,
  Wallet,
  Landmark,
  Zap,
  Bike,
  LifeBuoy
} from 'lucide-react';

import { useTheme } from '../../../context/ThemeContext';

const VendorSidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, vendorData, handleLogout }) => {
  const { isDarkMode } = useTheme();
  const navItems = [
    { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Overview' },
    { id: 'products', icon: <Package size={18} />, label: 'Products' },
    { id: 'orders', icon: <ShoppingCart size={18} />, label: 'Orders' },
    { id: 'riders', icon: <Bike size={18} />, label: 'Delivery Riders' },
    { id: 'tickets', icon: <LifeBuoy size={18} />, label: 'Support Tickets' },
    { id: 'quickcommerce', icon: <Zap size={18} />, label: '⚡ Quick Commerce' },
    { id: 'earnings', icon: <IndianRupee size={18} />, label: 'Earnings' },
    { id: 'wallet', icon: <Wallet size={18} />, label: 'Wallet Ledger' },
    { id: 'payout', icon: <Landmark size={18} />, label: 'Bank Details' },
    { id: 'profile', icon: <Store size={18} />, label: 'Store Profile' }
  ];

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
     fixed lg:static inset-y-0 left-0 w-64 z-[101] 
     flex flex-col transition-transform duration-300 transform border-r
     ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
     ${isDarkMode ? 'bg-gray-950 border-white/5' : 'bg-white border-gray-200'}
   `}>
        <div className={`h-24 px-6 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none truncate">
              {vendorData?.businessName || 'FashionFever'}
            </span>
            <span className={`text-xs font-black uppercase tracking-wide block mt-1.5 whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Vendor Dashboard
            </span>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : isDarkMode
                  ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className={`p-4 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isDarkMode 
                ? 'text-red-400 hover:bg-red-500/10' 
                : 'text-red-500 hover:bg-red-50'
            }`}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default VendorSidebar;
