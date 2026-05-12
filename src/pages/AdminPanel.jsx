import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Store, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  BarChart3,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Sun,
  Moon,
  Eye,
  X,
  Menu,
  Percent,
  Trash2,
  Power,
  LayoutDashboard,
  Shield,
  Bell,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllUsers, getUserById, getAllVendors, getVendorById, deleteVendor, deleteUser, acceptVendor, toggleVendorStatus, rejectVendor, getPendingVendors } from '../api/adminService';
import { useTheme } from '../context/ThemeContext';

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
                <th key={idx} className={`px-8 py-6 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
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

/**
 * Delete Confirmation Modal
 */
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, itemName }) => {
  const { isDarkMode } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-sm:max-w-xs max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} />
          </div>
          <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Confirm Deletion</h3>
          <p className="text-sm text-gray-500 mb-8">Are you sure you want to delete <span className="font-bold text-red-500">{itemName}</span>? This action cannot be undone.</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleConfirm}
              disabled={isDeleting}
              className="py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Delete Now'}
            </button>
            <button 
              onClick={onCancel}
              className={`py-3 rounded-xl font-bold text-xs uppercase transition-all ${isDarkMode ? 'bg-gray-900 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * User Details Modal
 */
const UserDetailsModal = ({ userId, onClose }) => {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await getUserById(userId);
        if (response.success) setUser(response.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    if (userId) fetchDetail();
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <span className="text-xs font-bold text-gray-400 uppercase">Loading Profile...</span>
          </div>
        ) : user ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${isDarkMode ? 'bg-gray-900 text-gray-500' : 'bg-gray-50 text-primary'}`}>
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <h2 className={`text-lg font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">{user.email}</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Access Role', value: user.role, isTag: true },
                { label: 'Status', value: user.isActive ? 'Active' : 'Inactive', isStatus: true },
                { label: 'Registration', value: new Date(user.createdAt).toLocaleDateString() },
                { label: 'System ID', value: user._id, isMono: true }
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                  <span className="text-xs font-bold text-gray-400 uppercase">{item.label}</span>
                  {item.isTag ? (
                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase">{item.value}</span>
                  ) : item.isStatus ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.value}</span>
                    </div>
                  ) : (
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ${item.isMono ? 'font-mono opacity-50' : 'uppercase'}`}>
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button onClick={onClose} className="w-full mt-8 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Close Profile
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Vendor Details Modal
 */
const VendorDetailsModal = ({ vendorId, onClose }) => {
  const { isDarkMode } = useTheme();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await getVendorById(vendorId);
        if (response.success) setVendor(response.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    if (vendorId) fetchDetail();
  }, [vendorId]);

  if (!vendorId) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <span className="text-xs font-bold text-gray-400 uppercase">Loading Shop...</span>
          </div>
        ) : vendor ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${isDarkMode ? 'bg-gray-900 text-gray-500' : 'bg-gray-50 text-primary'}`}>
                  <Store size={24} />
                </div>
                <div>
                  <h2 className={`text-lg font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{vendor.businessName}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">@{vendor.slug}</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Shop Status', value: vendor.status, isTag: true, color: vendor.status === 'APPROVED' ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10' },
                { label: 'Commission', value: `${vendor.commissionRate}%` },
                { label: 'Onboarding', value: new Date(vendor.createdAt).toLocaleDateString() },
                { label: 'Shop ID', value: vendor._id, isMono: true }
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                  <span className="text-xs font-bold text-gray-400 uppercase">{item.label}</span>
                  {item.isTag ? (
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${item.color}`}>{item.value}</span>
                  ) : (
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ${item.isMono ? 'font-mono opacity-50' : 'uppercase'}`}>
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button onClick={onClose} className="w-full mt-8 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Close Review
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({ role: '', search: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
    setPagination(prev => ({ ...prev, page: 1 }));
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'users') {
        response = await getAllUsers({ page: pagination.page, limit: pagination.limit, role: filters.role, search: filters.search });
      } else if (activeTab === 'vendors') {
        response = await getAllVendors({ page: pagination.page, limit: pagination.limit, search: filters.search });
      } else if (activeTab === 'pending') {
        response = await getPendingVendors({ page: pagination.page, limit: pagination.limit, search: filters.search });
      }

      if (response && response.success) {
        let list = response.data?.users || response.data?.vendors || response.data || [];
        if (activeTab === 'vendors') {
          list = list.filter(u => u.role === 'vendor' && u.vendorId);
        } else if (activeTab === 'pending') {
          list = list.filter(u => (u.vendorId?.status || u.status) === 'PENDING');
        }
        setDataList(list);
        setPagination(prev => ({ ...prev, total: response.data?.total || list.length }));
      }
    } catch (error) { toast.error('Data sync failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (['users', 'vendors', 'pending'].includes(activeTab)) fetchData();
  }, [activeTab, pagination.page, filters.role]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      let res;
      if (activeTab === 'users') {
        res = await deleteUser(itemToDelete._id);
      } else {
        const vId = itemToDelete.vendorId?._id || itemToDelete.vendorId || itemToDelete._id;
        res = await deleteVendor(vId);
      }
      if (res.success) {
        toast.success('Record removed');
        fetchData();
        setItemToDelete(null);
      }
    } catch (err) { toast.error('Removal failed'); }
  };

  const handleApproveVendor = async (vId) => {
    try {
      const res = await acceptVendor(vId);
      if (res.success) { toast.success('Vendor approved'); fetchData(); }
    } catch (e) { toast.error('Approval failed'); }
  };

  const handleRejectVendor = async (vId) => {
    try {
      const res = await rejectVendor(vId);
      if (res.success) { toast.success('Vendor rejected'); fetchData(); }
    } catch (e) { toast.error('Rejection failed'); }
  };

  const stats = [
    { id: 'dashboard', label: 'Revenue Growth', value: '₹12.5M', icon: <TrendingUp size={20} />, trend: '+18%', color: 'text-green-500' },
    { id: 'users', label: 'User Directory', value: '45.2K', icon: <Users size={20} />, trend: '+12%', color: 'text-blue-500' },
    { id: 'vendors', label: 'Vendor Partners', value: pagination.total || '0', icon: <Store size={20} />, trend: '+5%', color: 'text-purple-500' },
    { id: 'pending', label: 'New Approvals', value: '12', icon: <AlertCircle size={20} />, trend: 'Urgent', color: 'text-orange-500' },
  ];

  const userColumns = [
    { 
      header: 'Identity', 
      render: (user) => (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center font-bold ${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
            {user.name?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.name}</span>
            <span className="text-[10px] font-bold uppercase text-gray-400">{user.email}</span>
          </div>
        </div>
      )
    },
    { header: 'Role', render: (user) => <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'} shadow-sm`}>{user.role}</span> },
    { header: 'Status', render: (user) => <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div><span className="text-xs font-bold uppercase text-gray-400">{user.isActive ? 'Active' : 'Offline'}</span></div> },
    { 
      header: 'Actions', 
      render: (user) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setSelectedUserId(user._id)} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button onClick={() => setItemToDelete(user)} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const vendorColumns = [
    { 
      header: 'Vendor Info', 
      render: (vendor) => (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center font-bold ${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
            {vendor.businessName?.charAt(0) || vendor.name?.charAt(0) || 'V'}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{vendor.businessName || vendor.name}</span>
            <span className="text-[10px] font-bold uppercase text-gray-400">{vendor.email}</span>
          </div>
        </div>
      )
    },
    { header: 'Vendor ID', render: (vendor) => <span className="text-xs font-mono font-bold text-gray-400">{vendor.vendorId?._id || vendor.vendorId || vendor._id}</span> },
    { header: 'Status', render: (vendor) => {
      const vProfile = vendor.vendorId;
      const isActive = vProfile ? vProfile.isActive : vendor.isActive;
      return <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div><span className="text-xs font-bold uppercase text-gray-400">{isActive ? 'Active' : 'Offline'}</span></div>
    }},
    { header: 'Registration', render: (vendor) => <div className="flex flex-col"><span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span><span className="text-[10px] uppercase font-bold text-gray-400">Onboarded</span></div> },
    { 
      header: 'Actions', 
      render: (vendor) => {
        const vProfile = vendor.vendorId;
        const vId = typeof vProfile === 'object' ? vProfile?._id : (vProfile || vendor._id);
        const isPending = (vProfile?.status || vendor.status) === 'PENDING';
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {isPending && (
              <div className="flex gap-1">
                <button onClick={() => handleApproveVendor(vId)} className="p-2.5 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 hover:scale-110 transition-all"><CheckCircle2 size={16} /></button>
                <button onClick={() => handleRejectVendor(vId)} className="p-2.5 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20 hover:scale-110 transition-all"><XCircle size={16} /></button>
              </div>
            )}
            <button onClick={() => toggleVendorStatus(vId).then(() => fetchData())} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-500 hover:text-green-500' : 'bg-gray-50 text-gray-400 hover:text-green-600'}`}><Power size={18} /></button>
            <button onClick={() => setSelectedVendorId(vId)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
            <button onClick={() => setItemToDelete(vendor)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
          </div>
        );
      }
    }
  ];

  return (
    <div className={`flex min-h-screen font-outfit transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <UserDetailsModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      <VendorDetailsModal vendorId={selectedVendorId} onClose={() => setSelectedVendorId(null)} />
      <DeleteConfirmModal isOpen={!!itemToDelete} itemName={itemToDelete?.name || itemToDelete?.businessName} onConfirm={handleDeleteConfirm} onCancel={() => setItemToDelete(null)} />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[1002] w-72 transform transition-transform duration-300 lg:sticky lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-screen border-r ${isDarkMode ? 'bg-gray-900 border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="p-8 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xl lg:text-2xl font-bold uppercase tracking-tighter text-primary">WAKEUP ADMIN</span>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"><X size={20} /></button>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { id: 'users', label: 'User Management', icon: <Users size={20} /> },
            { id: 'vendors', label: 'Vendor Control', icon: <Store size={20} /> },
            { id: 'pending', label: 'Pending Approvals', icon: <AlertCircle size={20} /> },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === item.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : isDarkMode ? 'text-gray-500 hover:bg-white/5 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-800'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-100 dark:border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"><LogOut size={20} /> Logout System</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 h-screen overflow-y-auto">
        <header className={`h-20 flex items-center justify-between px-6 lg:px-10 border-b sticky top-0 z-[1000] ${isDarkMode ? 'bg-gray-900/80 backdrop-blur-xl border-white/5' : 'bg-white/80 backdrop-blur-xl border-gray-100'}`}>
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
              <Menu size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search platform..." value={filters.search} onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && fetchData()} className={`w-full pl-12 pr-4 py-3 border-none rounded-xl text-sm outline-none font-bold transition-all ${isDarkMode ? 'bg-white/5 text-gray-200' : 'bg-gray-50 text-gray-800 focus:bg-gray-100'}`} />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button onClick={toggleTheme} className={`p-3 rounded-xl transition-all border ${isDarkMode ? 'bg-white/5 text-primary border-white/5 shadow-xl shadow-primary/10' : 'bg-gray-50 text-primary border-transparent hover:bg-gray-100'}`}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <div className={`w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20`}>AD</div>
          </div>
        </header>

        <main className="p-6 lg:p-10 space-y-10">
          {(activeTab === 'users' || activeTab === 'vendors' || activeTab === 'pending') && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl lg:text-3xl font-bold uppercase tracking-tighter transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activeTab.replace('-', ' ')} Directory</h2>
                  <p className="text-xs font-bold uppercase text-gray-400 mt-1">Oversee global system accounts</p>
                </div>
                <div className={`px-6 py-4 rounded-[24px] border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100'}`}>
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Total {activeTab}</p>
                  <p className="text-2xl font-bold">{pagination.total}</p>
                </div>
              </div>
              <DataTable columns={activeTab === 'users' ? userColumns : vendorColumns} data={dataList} loading={loading} onRowClick={(item) => activeTab === 'users' ? setSelectedUserId(item._id) : setSelectedVendorId(item.vendorId?._id || item._id)} />
              <div className="flex justify-center gap-3">
                <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1} className={`p-4 rounded-2xl disabled:opacity-30 shadow-sm transition-all ${isDarkMode ? 'bg-gray-800 text-white hover:bg-primary' : 'bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-100'}`}><ChevronLeft size={20} /></button>
                <div className="w-14 h-14 flex items-center justify-center bg-primary text-white rounded-2xl font-bold shadow-2xl shadow-primary/30 ring-4 ring-primary/10">{pagination.page}</div>
                <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={dataList.length < pagination.limit} className={`p-4 rounded-2xl disabled:opacity-30 shadow-sm transition-all ${isDarkMode ? 'bg-gray-800 text-white hover:bg-primary' : 'bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-100'}`}><ChevronRight size={20} /></button>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} onClick={() => setActiveTab(stat.id)} className={`p-8 rounded-[32px] shadow-sm border transition-all duration-300 group hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100 shadow-gray-200/50'}`}>
                  <div className="flex items-center justify-between mb-8">
                    <div className={`p-5 rounded-2xl transition-all duration-300 group-hover:bg-primary group-hover:text-white ${isDarkMode ? 'bg-gray-900 text-primary' : 'bg-gray-50 text-primary'}`}>{stat.icon}</div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-green-500/10 text-green-500' : 'bg-green-50 text-green-600 uppercase'}`}>{stat.trend}</span>
                  </div>
                  <h3 className={`text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</h3>
                  <p className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
