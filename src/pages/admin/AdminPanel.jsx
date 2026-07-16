import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Users,
  Store,
  TrendingUp,
  CircleAlert,
  CircleCheckBig,
  CircleX,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sun,
  Moon,
  Eye,
  X,
  Menu,
  Percent,
  Trash2,
  Power,
  Sparkles,
  TicketPercent,
  Pencil,
  Grid,
  ShoppingBag,
  Package,
  Plus,
  BookOpen
} from 'lucide-react';
import DataTable from "../../components/shared/DataTable";
import DeleteConfirmModal from "../../components/shared/DeleteConfirmModal";
import UserDetailsModal from "./components/UserDetailsModal";
import VendorDetailsModal from "./components/VendorDetailsModal";
import OnboardInfluencerModal from "./components/OnboardInfluencer";
import InfluencerDetailsModal from "./components/InfluencerDetailsModal";
import EducatorDetailsModal from "./components/EducatorDetailsModal";
import CreateCourseCategoryModal from "./components/CreateCourseCategoryModal";
import CourseCategoryDetailsModal from "./components/CourseCategoryDetailsModal";
import AdminServiceManager from "./components/AdminServiceManager";
import { CreateCouponModal, CouponDetailsModal } from "./components/CouponModals";
import CreateCategoryModal from "./components/CreateCategoryModal";
import CategoryDetailsModal from "./components/CategoryDetailsModal";
import AdminSidebar from "./components/AdminSidebar";
import OrderDetailsModal from "./components/OrderDetailsModal";
import CreateCommissionSlabModal from "./components/CreateCommissionSlabModal";
import CommissionSlabDetailsModal from "./components/CommissionSlabDetailsModal";
import CreateCashbackSlabModal from "./components/CreateCashbackSlabModal";
import CashbackSlabDetailsModal from "./components/CashbackSlabDetailsModal";
import AdminDashboard from "./components/AdminDashboard";
import SendInvitationModal from "./components/SendInvitationModal";
import InfluencerCommissions from "./components/InfluencerCommissions";
import AdminAffiliateDashboard from "./components/AdminAffiliateDashboard";
import VendorPayouts from "./components/VendorPayouts";
import SubscriptionPlans from "./components/SubscriptionPlans";
import ServiceCategories from "./components/ServiceCategories";
import ServiceProviders from "./components/ServiceProviders";
import HomeContentList from "./components/HomeContentList";
import CreateHomeContentModal from "./components/CreateHomeContentModal";
import HomeContentDetailsModal from "./components/HomeContentDetailsModal";
import AdminWalletBalances from "./components/AdminWalletBalances";
import SupportTickets from "./components/SupportTickets";
import SubAdminsManager from "./components/SubAdminsManager";
import AdminProfile from "./components/AdminProfile";
import NotificationsManager from "./components/NotificationsManager";
import AdminServiceLeads from "./components/AdminServiceLeads";
import AdminBankAccounts from "./components/AdminBankAccounts";
import { useUser } from '../../context/UserContext';

import { toast } from '../../utils/toast';
import {
  getAllUsers,
  toggleUserStatus,
  getAllVendors,
  deleteVendor,
  deleteUser,
  acceptVendor,
  toggleVendorStatus,
  rejectVendor,
  getPendingVendors,
  getAllInfluencers,
  deleteInfluencer,
  deleteCoupon,
  getAllCoupons,
  getAllOrders,
  fetchCategories,
  deleteCategory,
  getAllProducts,
  deleteProduct,
  deleteAllProducts,
  getDashboardOverview,
  getRevenueTrend,
  getTopCategories,
  getOrderStatusAnalytics,
  getCategoryDistribution,
  getOrderStatusGraph,
  getMonthlyAnalytics,
  getYearlyAnalytics,
  getAnalyticsGraph,
  getTopVendorsGraph,
  getAllInfluencerCommissionSlabs,
  deleteInfluencerCommissionSlab,
  getHomeContents,
  getHomeContentsPublic,
  approveEducator,
  getPendingEducators,
  toggleEducatorActive,
  getAllEducators,
  addCourseCategory,
  getCourseCategories,
  getCourseCategoryDetails,
  getAllCashbackSlabs,
  deleteCashbackSlab,
  getAdminProfile
} from '../../api/adminService';
import { useTheme } from '../../context/ThemeContext';

const AdminPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const { isDarkMode, toggleTheme } = useTheme();
  const { role } = useUser();
  const containerRef = useRef(null);

  // Admin and sub-admin granular module permissions states
  const [adminAccess, setAdminAccess] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Tab-access validation helper
  const hasAccessToTab = (tab) => {
    if (profileLoading) return true;
    if (isSuperAdmin) return true;
    if (tab === 'profile' || tab === 'dashboard') return true;

    // Check which module corresponds to the tab
    const tabModuleMap = {
      'users': 'USERS',
      'service-providers': 'SERVICE_PROVIDERS',
      'educators': 'COURSES',
      'all-educators': 'COURSES',
      'sub-admins': 'NONE', // only super_admin can access sub-admins list
      'vendors': 'VENDORS',
      'pending': 'VENDORS',
      'vendor-payouts': 'VENDORS',
      'affiliate-dashboard': 'INFLUENCERS',
      'influencers': 'INFLUENCERS',
      'commission-slabs': 'INFLUENCERS',
      'influencer-commissions': 'INFLUENCERS',
      'categories': 'COURSES',
      'course-categories': 'COURSES',
      'products': 'VENDORS',
      'coupons': 'INFLUENCERS',
      'subscription-plans': 'SERVICE_PROVIDERS',
      'orders': 'VENDORS',
      'beauty-services': 'SERVICE_PROVIDERS',
      'service-categories': 'SERVICE_PROVIDERS',
      'admin-service-leads': 'SERVICE_PROVIDERS',
      'home-content': 'HOME_CONTENT',
      'cashback-slabs': 'FINANCE',
      'wallet-balances': 'FINANCE',
      'tickets': 'TICKETS',
      'notifications': 'NOTIFICATION'
    };

    const requiredModule = tabModuleMap[tab];
    if (!requiredModule) return true; // general fallback
    return adminAccess.some(item => item.module === requiredModule);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setProfileLoading(true);
      try {
        const response = await getAdminProfile();
        if (response.success && response.data) {
          setAdminAccess(response.data.adminAccess || response.data.moduleAccess || []);
          setIsSuperAdmin(response.data.user?.roles?.includes('super_admin') || false);
        }
      } catch (err) {
        console.error('Error loading admin profile info:', err);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (!profileLoading && !hasAccessToTab(activeTab)) {
      // Find a safe tab they do have access to, or default to profile
      if (isSuperAdmin || adminAccess.some(item => item.module === 'DASHBOARD')) {
        setSearchParams({ tab: 'dashboard' });
      } else {
        setSearchParams({ tab: 'profile' });
      }
    }
  }, [activeTab, profileLoading, isSuperAdmin, adminAccess]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [activeTab]);

  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedEducatorId, setSelectedEducatorId] = useState(null);
  const [selectedCourseCategoryId, setSelectedCourseCategoryId] = useState(null);
  const [isCreateCourseCategoryOpen, setIsCreateCourseCategoryOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({ role: '', search: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState(null);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [influencerForCoupon, setInfluencerForCoupon] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateSlabOpen, setIsCreateSlabOpen] = useState(false);
  const [editingSlab, setEditingSlab] = useState(null);
  const [selectedSlabId, setSelectedSlabId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isCreateCashbackSlabOpen, setIsCreateCashbackSlabOpen] = useState(false);
  const [editingCashbackSlab, setEditingCashbackSlab] = useState(null);
  const [selectedCashbackSlab, setSelectedCashbackSlab] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [orderStatusAnalytics, setOrderStatusAnalytics] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [orderStatusGraph, setOrderStatusGraph] = useState([]);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState([]);
  const [yearlyAnalytics, setYearlyAnalytics] = useState([]);
  const [analyticsGraph, setAnalyticsGraph] = useState([]);
  const [topVendorsGraph, setTopVendorsGraph] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [activeMonthlyMetric, setActiveMonthlyMetric] = useState('revenue');
  const [isOverviewLoading, setIsOverviewLoading] = useState(true);
  const [isSendLinkOpen, setIsSendLinkOpen] = useState(false);
  const [showHomeContentModal, setShowHomeContentModal] = useState(false);
  const [editingHomeContent, setEditingHomeContent] = useState(null);
  const [selectedHomeContentId, setSelectedHomeContentId] = useState(null);

  const fetchOverview = async () => {
    setIsOverviewLoading(true);
    try {
      const [res, trendRes, catRes, statusRes, distRes, graphRes, yearlyRes, rawGraphRes, vendorsRes] = await Promise.allSettled([
        getDashboardOverview(),
        getRevenueTrend(10),
        getTopCategories(),
        getOrderStatusAnalytics(),
        getCategoryDistribution(),
        getOrderStatusGraph(),
        getYearlyAnalytics(),
        getAnalyticsGraph(),
        getTopVendorsGraph()
      ]);

      if (res.status === 'fulfilled' && res.value?.success) {
        setOverviewData(res.value.data?.data || res.value.data || null);
      }
      if (trendRes.status === 'fulfilled' && trendRes.value?.success) {
        const list = trendRes.value.data?.data ?? trendRes.value.data ?? [];
        setRevenueTrend(Array.isArray(list) ? list : []);
      }
      if (catRes.status === 'fulfilled' && catRes.value?.success) {
        const list = catRes.value.data?.data ?? catRes.value.data ?? [];
        setTopCategories(Array.isArray(list) ? list : []);
      }
      if (statusRes.status === 'fulfilled' && statusRes.value?.success) {
        const list = statusRes.value.data?.data ?? statusRes.value.data ?? [];
        setOrderStatusAnalytics(Array.isArray(list) ? list : []);
      }
      if (distRes.status === 'fulfilled' && distRes.value?.success) {
        const list = distRes.value.data?.data ?? distRes.value.data ?? [];
        setCategoryDistribution(Array.isArray(list) ? list : []);
      }
      if (graphRes.status === 'fulfilled' && graphRes.value?.success) {
        const list = graphRes.value.data?.data ?? graphRes.value.data ?? [];
        setOrderStatusGraph(Array.isArray(list) ? list : []);
      }
      if (yearlyRes.status === 'fulfilled' && yearlyRes.value?.success) {
        const list = yearlyRes.value.data?.data ?? yearlyRes.value.data ?? [];
        setYearlyAnalytics(Array.isArray(list) ? list : []);
      }
      if (rawGraphRes.status === 'fulfilled' && rawGraphRes.value?.success) {
        const list = rawGraphRes.value.data?.data ?? rawGraphRes.value.data ?? [];
        setAnalyticsGraph(Array.isArray(list) ? list : []);
      }
      if (vendorsRes.status === 'fulfilled' && vendorsRes.value?.success) {
        const list = vendorsRes.value.data?.data ?? vendorsRes.value.data ?? [];
        setTopVendorsGraph(Array.isArray(list) ? list : []);
      }
      
      fetchMonthlyData(selectedYear);
    } catch (err) {
      console.error("Failed to load overview data:", err);
    } finally {
      setIsOverviewLoading(false);
    }
  };

  const fetchMonthlyData = async (year) => {
    try {
      const res = await getMonthlyAnalytics(year);
      if (res?.success) {
        const list = res.data?.data ?? res.data ?? [];
        setMonthlyAnalytics(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Failed to load monthly analytics:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchMonthlyData(selectedYear);
    }
  }, [selectedYear, activeTab]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchOverview();
    }
  }, [activeTab]);

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
      } else if (activeTab === 'influencers') {
        response = await getAllInfluencers({ page: pagination.page, limit: pagination.limit, search: filters.search });
      } else if (activeTab === 'commission-slabs') {
        response = await getAllInfluencerCommissionSlabs();
      } else if (activeTab === 'coupons') {
        response = await getAllCoupons({ page: pagination.page, limit: pagination.limit, search: filters.search });
      } else if (activeTab === 'categories') {
        response = await fetchCategories({ page: pagination.page, limit: pagination.limit, search: filters.search });
      } else if (activeTab === 'orders') {
        response = await getAllOrders({ page: pagination.page, limit: pagination.limit, search: filters.search });
      } else if (activeTab === 'products') {
        response = await getAllProducts({ page: pagination.page, limit: pagination.limit, search: filters.search });
      } else if (activeTab === 'home-content') {
        response = await getHomeContentsPublic({ page: pagination.page, limit: pagination.limit, search: filters.search });
      } else if (activeTab === 'educators') {
        response = await getPendingEducators();
      } else if (activeTab === 'all-educators') {
        response = await getAllEducators();
      } else if (activeTab === 'course-categories') {
        response = await getCourseCategories();
      } else if (activeTab === 'cashback-slabs') {
        response = await getAllCashbackSlabs();
      }

      if (response && response.success) {
        let list;
        if (activeTab === 'course-categories') {
          const inner = response.data?.data ?? response.data;
          list = Array.isArray(inner) ? inner : (inner?.data || []);
        } else if (activeTab === 'categories' || activeTab === 'orders' || activeTab === 'products' || activeTab === 'home-content' || activeTab === 'educators' || activeTab === 'all-educators' || activeTab === 'cashback-slabs') {
          list = response.data?.data || response.data || [];
        } else {
          list = response.data?.users || response.data?.vendors || response.data?.influencers || response.data?.coupons || response.data?.data || response.data || [];
        }
        if (activeTab === 'vendors') {
          list = list.filter(u => u.role === 'vendor' && u.vendorId);
        } else if (activeTab === 'pending') {
          list = list.filter(u => (u.vendorId?.status || u.status) === 'PENDING');
        } else if (activeTab === 'commission-slabs' || activeTab === 'cashback-slabs') {
          list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        setDataList(list);
        setPagination(prev => ({ ...prev, total: response.data?.total || list.length }));
      }
    } catch (error) { toast.error('Data sync failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (['users', 'vendors', 'pending', 'influencers', 'commission-slabs', 'coupons', 'categories', 'course-categories', 'orders', 'products', 'home-content', 'educators', 'all-educators', 'cashback-slabs'].includes(activeTab)) fetchData();
  }, [activeTab, pagination.page, filters.role]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      let res;
      if (activeTab === 'users') {
        res = await deleteUser(itemToDelete._id);
      } else if (activeTab === 'influencers') {
        res = await deleteInfluencer(itemToDelete._id);
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

  const handleToggleUserStatus = async (userId) => {
    const loadingToast = toast.loading('Updating user status...');
    try {
      const res = await toggleUserStatus(userId);
      toast.dismiss(loadingToast);
      if (res.success) {
        toast.success(res.message || 'User status updated successfully!');
        fetchData();
      } else {
        toast.error(res.message || 'Failed to update user status.');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong.');
    }
  };

  const userColumns = [
    {
      header: 'User profile',
      render: (user) => (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center font-bold ${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.name}</span>
            <span className="text-sm font-bold uppercase text-gray-400">{user.email}</span>
          </div>
        </div>
      )
    },
    { header: 'System role', render: (user) => <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">{user.role}</span> },
    {
      header: 'Status',
      render: (user) => (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${user.isActive && !user.isDeleted ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
          <span className="text-sm font-semibold uppercase text-gray-400">{user.isActive && !user.isDeleted ? 'Active' : 'Banned'}</span>
        </div>
      )
    },
    { header: 'Registration', render: (user) => <div className="flex flex-col"><span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span><span className="text-sm uppercase font-bold text-gray-400">Onboarded</span></div> },
    {
      header: 'Actions',
      render: (user) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => handleToggleUserStatus(user._id)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-500 hover:text-green-500' : 'bg-gray-50 text-gray-400 hover:text-green-600'}`}><Power size={18} /></button>
          <button onClick={() => setSelectedUserId(user._id)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button onClick={() => setItemToDelete(user)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const vendorColumns = [
    {
      header: 'Vendor profile',
      render: (vendor) => {
        const business = vendor.vendorId;
        const name = typeof business === 'object' ? business?.businessName : vendor.name;
        const slug = typeof business === 'object' ? business?.slug : 'unknown-brand';
        const logo = typeof business === 'object' ? business?.logo?.url : null;
        return (
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center font-bold border ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-gray-100 border-gray-100 shadow-sm'}`}>
              {logo ? (
                <img src={logo} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary font-bold">{name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{name || 'Vendor Partner'}</span>
              <span className="text-sm font-bold uppercase text-gray-400">/{slug}</span>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Status',
      render: (vendor) => {
        const vProfile = vendor.vendorId;
        const isActive = typeof vProfile === 'object' ? vProfile?.isActive : vendor.isActive;
        return <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div><span className="text-sm font-semibold uppercase text-gray-400">{isActive ? 'Active' : 'Offline'}</span></div>
      }
    },
    { header: 'Registration', render: (vendor) => <div className="flex flex-col"><span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span><span className="text-sm uppercase font-bold text-gray-400">Onboarded</span></div> },
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
                <button onClick={() => handleApproveVendor(vId)} className="p-2.5 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 hover:scale-110 transition-all"><CircleCheckBig size={16} /></button>
                <button onClick={() => handleRejectVendor(vId)} className="p-2.5 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20 hover:scale-110 transition-all"><CircleX size={16} /></button>
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

  const influencerColumns = [
    {
      header: 'Influencer',
      render: (inf) => (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center font-bold ${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
            {inf.name?.charAt(0) || inf.userId?.name?.charAt(0) || 'I'}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{inf.name || inf.userId?.name}</span>
            <span className="text-sm font-bold uppercase text-gray-400">{inf.userId?.email}</span>
          </div>
        </div>
      )
    },
    { header: 'Followers', render: (inf) => <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{inf.followers?.toLocaleString()}</span> },
    { header: 'Commission', render: (inf) => <span className="px-3 py-1 rounded-lg bg-pink-500/10 text-pink-500 text-sm font-bold uppercase ">{inf.commissionRate}%</span> },
    { header: 'Earnings', render: (inf) => <div className="flex flex-col"><span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>₹{inf.totalCommissionEarned?.toLocaleString()}</span><span className="text-sm uppercase font-bold text-gray-400">Total Paid</span></div> },
    { header: 'Status', render: (inf) => <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${inf.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div><span className="text-sm font-semibold uppercase text-gray-400">{inf.status}</span></div> },
    {
      header: 'Actions',
      render: (inf) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button title="Create Coupon" onClick={() => setInfluencerForCoupon(inf)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-green-500' : 'bg-gray-50 text-gray-400 hover:text-green-500'}`}><TicketPercent size={18} /></button>
          <button title="Edit Profile" onClick={() => { setEditingInfluencer(inf); setIsOnboardingOpen(true); }} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-orange-500' : 'bg-gray-50 text-gray-400 hover:text-orange-500'}`}><Pencil size={18} /></button>
          <button title="View Details" onClick={() => setSelectedInfluencerId(inf._id)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button title="Delete Influencer" onClick={() => setItemToDelete(inf)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const commissionSlabColumns = [
    {
      header: 'Commission Slab',
      render: (slab) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500">
            <Percent size={18} />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{slab.commissionRate}% Commission</span>
            <span className="text-sm font-bold text-gray-400 uppercase">Slab ID: {slab._id}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Sales Range',
      render: (slab) => (
        <div className="flex flex-col">
          <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            ₹{slab.minSales?.toLocaleString('en-IN')} - ₹{slab.maxSales?.toLocaleString('en-IN')}
          </span>
          <span className="text-sm font-bold text-gray-400 uppercase">Min to Max Sales</span>
        </div>
      )
    },
    {
      header: 'Status',
      render: (slab) => (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${slab.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
          <span className="text-sm font-semibold uppercase text-gray-400">{slab.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      )
    },
    {
      header: 'Created On',
      render: (slab) => (
        <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {new Date(slab.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (slab) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button title="View Details" onClick={() => setSelectedSlabId(slab._id)} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button title="Edit Slab" onClick={() => setEditingSlab(slab)} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-orange-500' : 'bg-gray-50 text-gray-400 hover:text-orange-500'}`}><Pencil size={18} /></button>
          <button title="Delete Slab" onClick={() => {
            Swal.fire({
              title: 'Delete Commission Slab?',
              text: `Are you sure you want to delete this commission slab? (${slab.commissionRate}% rate, ₹${slab.minSales?.toLocaleString('en-IN')} - ₹${slab.maxSales?.toLocaleString('en-IN')})`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#da016a',
              cancelButtonColor: '#94a3b8',
              confirmButtonText: 'Yes, Delete',
              cancelButtonText: 'Cancel',
              background: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              borderRadius: '20px',
              customClass: {
                popup: 'rounded-3xl border-none',
                confirmButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 text-white cursor-pointer',
                cancelButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 cursor-pointer'
              }
            }).then(async (result) => {
              if (result.isConfirmed) {
                const loadingToast = toast.loading('Deleting slab...');
                try {
                  const res = await deleteInfluencerCommissionSlab(slab._id);
                  toast.dismiss(loadingToast);
                  if (res.success) {
                    toast.success(res.message || 'Commission slab deleted successfully!');
                    fetchData();
                  } else {
                    toast.error(res.message || 'Failed to delete commission slab.');
                  }
                } catch (err) {
                  toast.dismiss(loadingToast);
                  toast.error('Something went wrong during deletion.');
                }
              }
             });
          }} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const cashbackSlabColumns = [
    {
      header: 'Cashback Slab',
      render: (slab) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Percent size={18} />
          </div>
          <div className="flex flex-col text-left">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {slab.cashbackValue}{slab.cashbackType === 'PERCENTAGE' ? '%' : ' ₹'} Cashback
            </span>
            <span className="text-sm font-bold text-gray-400 uppercase">Type: {slab.cashbackType}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Wallet Load Range',
      render: (slab) => (
        <div className="flex flex-col text-left">
          <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            ₹{slab.minValue?.toLocaleString('en-IN')} - ₹{slab.maxValue?.toLocaleString('en-IN')}
          </span>
          <span className="text-sm font-bold text-gray-400 uppercase">Min to Max Load</span>
        </div>
      )
    },
    {
      header: 'Max Cashback Limit',
      render: (slab) => (
        <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {slab.maxCashback ? `₹${slab.maxCashback}` : 'No Limit'}
        </span>
      )
    },
    {
      header: 'Status',
      render: (slab) => (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${slab.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
          <span className="text-sm font-semibold uppercase text-gray-400">{slab.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      render: (slab) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button title="View Details" onClick={() => setSelectedCashbackSlab(slab)} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button title="Edit Slab" onClick={() => { setEditingCashbackSlab(slab); setIsCreateCashbackSlabOpen(true); }} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-orange-500' : 'bg-gray-50 text-gray-400 hover:text-orange-500'}`}><Pencil size={18} /></button>
          <button title="Delete Slab" onClick={() => {
            Swal.fire({
              title: 'Delete Cashback Slab?',
              text: `Are you sure you want to delete this cashback slab? (₹${slab.minValue} - ₹${slab.maxValue} range)`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#da016a',
              cancelButtonColor: '#94a3b8',
              confirmButtonText: 'Yes, Delete',
              cancelButtonText: 'Cancel',
              background: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              borderRadius: '20px',
              customClass: {
                popup: 'rounded-3xl border-none',
                confirmButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 text-white cursor-pointer',
                cancelButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 cursor-pointer'
              }
            }).then(async (result) => {
              if (result.isConfirmed) {
                const loadingToast = toast.loading('Deleting slab...');
                try {
                  const res = await deleteCashbackSlab(slab._id);
                  toast.dismiss(loadingToast);
                  if (res.success) {
                    toast.success(res.message || 'Cashback slab deleted successfully!');
                    fetchData();
                  } else {
                    toast.error(res.message || 'Failed to delete cashback slab.');
                  }
                } catch (err) {
                  toast.dismiss(loadingToast);
                  toast.error('Something went wrong during deletion.');
                }
              }
            });
          }} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const couponColumns = [
    {
      header: 'Coupon Code',
      render: (cp) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <TicketPercent size={18} />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{cp.code}</span>
            <span className="text-sm font-bold text-gray-400 uppercase">{cp.description || 'Platform Discount'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Assigned To',
      render: (cp) => (
        <div className="flex flex-col">
          <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cp.influencerId?.name || cp.influencerId || 'Global'}</span>
          <span className="text-sm font-bold text-gray-400 uppercase">Partner</span>
        </div>
      )
    },
    { header: 'Discount', render: (cp) => <span className={`text-sm font-bold text-primary`}>{cp.type === 'percentage' ? `${cp.value}%` : `₹${cp.value}`}</span> },
    { header: 'Usage', render: (cp) => <div className="flex flex-col"><span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{cp.totalUsed} / {cp.totalUsageLimit}</span><div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-primary" style={{ width: `${Math.min((cp.totalUsed / cp.totalUsageLimit) * 100, 100)}%` }}></div></div></div> },
    { header: 'Status', render: (cp) => <span className={`px-2 py-1 rounded text-sm font-bold uppercase ${cp.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{cp.isActive ? 'Active' : 'Expired'}</span> },
    {
      header: 'Actions',
      render: (cp) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button title="View Details" onClick={() => setSelectedCouponId(cp._id)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button title="Edit Coupon" onClick={() => { setEditingCoupon(cp); setInfluencerForCoupon(true); }} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-orange-500' : 'bg-gray-50 text-gray-400 hover:text-orange-500'}`}><Pencil size={18} /></button>
          <button title="Delete Coupon" onClick={() => {
            toast((t) => (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-gray-800">Delete coupon <span className="text-primary">{cp.code}</span>?</p>
                <div className="flex gap-2">
                  <button onClick={async () => { toast.dismiss(t.id); await deleteCoupon(cp._id); fetchData(); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">Yes, Delete</button>
                  <button onClick={() => toast.dismiss(t.id)} className="flex-1 bg-gray-100 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">Cancel</button>
                </div>
              </div>
            ), { duration: 8000 });
          }} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const categoryColumns = [
    {
      header: 'Category',
      render: (cat) => (
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center font-bold border ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-gray-100 border-gray-100 shadow-sm'}`}>
            {cat.image?.url ? (
              <img src={cat.image.url} alt={cat.label} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-bold">{cat.label?.charAt(0)}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{cat.label}</span>
            <span className="text-sm font-bold uppercase text-gray-400">/{cat.slug}</span>
          </div>
        </div>
      )
    },
    { header: 'Description', render: (cat) => <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cat.description || 'No description'}</span> },
    {
      header: 'Tags',
      render: (cat) => (
        <div className="flex flex-wrap gap-1">
          {cat.tags && cat.tags.length > 0 ? (
            cat.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase">{tag}</span>
            ))
          ) : (
            <span className="text-gray-400 text-sm font-bold uppercase">No tags</span>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      render: (cat) => (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
          <span className="text-sm font-semibold uppercase text-gray-400">{cat.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      )
    },
    {
      header: 'Created At',
      render: (cat) => (
        <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {new Date(cat.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (cat) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button title="View Category Details" onClick={() => setSelectedCategoryId(cat._id)} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button title="Edit Category" onClick={() => setEditingCategory(cat)} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-orange-500' : 'bg-gray-50 text-gray-400 hover:text-orange-500'}`}><Pencil size={18} /></button>
          <button title="Delete Category" onClick={() => {
            Swal.fire({
              title: 'Delete Category?',
              text: `Are you sure you want to delete category "${cat.label || cat.name}"?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#da016a',
              cancelButtonColor: '#94a3b8',
              confirmButtonText: 'Yes, Delete',
              cancelButtonText: 'Cancel',
              background: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              borderRadius: '20px',
              customClass: {
                popup: 'rounded-3xl border-none',
                confirmButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 text-white cursor-pointer',
                cancelButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 cursor-pointer'
              }
            }).then(async (result) => {
              if (result.isConfirmed) {
                const loadingToast = toast.loading('Deleting category...');
                try {
                  const res = await deleteCategory(cat._id);
                  toast.dismiss(loadingToast);
                  if (res.success) {
                    toast.success(res.message || 'Category deleted successfully!');
                    fetchData();
                  } else {
                    toast.error(res.message || 'Failed to delete category.');
                  }
                } catch (err) {
                  toast.dismiss(loadingToast);
                  toast.error('Something went wrong during deletion.');
                }
              }
            });
          }} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const courseCategoryColumns = [
    {
      header: 'Category',
      render: (cat) => {
        const logo = cat.icon?.url || cat.icon || '';
        return (
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center font-bold border ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-gray-100 border-gray-100 shadow-sm'}`}>
              {logo ? (
                <img src={logo} alt={cat.label} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary font-bold">{cat.label?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{cat.label}</span>
              <span className="text-sm font-bold uppercase text-gray-400">Name: {cat.name}</span>
            </div>
          </div>
        );
      }
    },
    { header: 'Description', render: (cat) => <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cat.description || 'No description'}</span> },
    {
      header: 'Tags',
      render: (cat) => (
        <div className="flex flex-wrap gap-1">
          {cat.tags && cat.tags.length > 0 ? (
            cat.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase">{tag}</span>
            ))
          ) : (
            <span className="text-gray-400 text-sm font-bold uppercase">No tags</span>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      render: (cat) => (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
          <span className="text-sm font-semibold uppercase text-gray-400">{cat.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      )
    },
    {
      header: 'Created At',
      render: (cat) => (
        <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {new Date(cat.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (cat) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button title="View Category Details" onClick={() => setSelectedCourseCategoryId(cat._id)} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button title="Delete Category" onClick={() => {
            Swal.fire({
              title: 'Delete Course Category?',
              text: `Are you sure you want to delete course category "${cat.label || cat.name}"?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#da016a',
              cancelButtonColor: '#94a3b8',
              confirmButtonText: 'Yes, Delete',
              cancelButtonText: 'Cancel',
              background: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              borderRadius: '20px',
              customClass: {
                popup: 'rounded-3xl border-none',
                confirmButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 text-white cursor-pointer',
                cancelButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 cursor-pointer'
              }
            }).then(async (result) => {
              if (result.isConfirmed) {
                const loadingToast = toast.loading('Deleting course category...');
                try {
                  const res = await deleteCourseCategory(cat._id);
                  toast.dismiss(loadingToast);
                  if (res.success) {
                    toast.success(res.message || 'Course category deleted successfully!');
                    fetchData();
                  } else {
                    toast.error(res.message || 'Failed to delete course category.');
                  }
                } catch (err) {
                  toast.dismiss(loadingToast);
                  toast.error('Something went wrong during deletion.');
                }
              }
            });
          }} className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const orderColumns = [
    {
      header: 'Order Number',
      render: (order) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <ShoppingBag size={18} />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{order.orderNumber}</span>
            <span className="text-sm font-bold text-gray-400 uppercase">Payment: {order.paymentMethod}</span>
          </div>
        </div>
      )
    },
    { header: 'Status', render: (order) => <span className={`px-2 py-1 rounded text-sm font-bold uppercase ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>{order.status}</span> },
    { header: 'Date & Time', render: (order) => <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span> },
    { header: 'Total Value', render: (order) => <span className={`text-sm font-bold text-primary`}>₹{order.totalAmount?.toLocaleString()}</span> },
    {
      header: 'Actions',
      render: (order) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button title="View Details" onClick={() => setSelectedOrderId(order._id)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}><Eye size={18} /></button>
          <button title="Delete Order" onClick={() => {
            Swal.fire({
              title: 'Delete Order?',
              text: `Are you sure you want to delete order "${order.orderNumber}"?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#da016a',
              cancelButtonColor: '#94a3b8',
              confirmButtonText: 'Yes, Delete',
              cancelButtonText: 'Cancel',
              background: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              borderRadius: '20px',
              customClass: {
                popup: 'rounded-3xl border-none',
                confirmButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 text-white cursor-pointer',
                cancelButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 cursor-pointer'
              }
            }).then(async (result) => {
              if (result.isConfirmed) {
                const loadingToast = toast.loading('Deleting order...');
                try {
                  const res = await deleteCategory(order._id); // Delete API
                  toast.dismiss(loadingToast);
                  if (res.success) {
                    toast.success(res.message || 'Order deleted successfully!');
                    fetchData();
                  } else {
                    toast.error(res.message || 'Failed to delete order.');
                  }
                } catch (err) {
                  toast.dismiss(loadingToast);
                  toast.error('Something went wrong during deletion.');
                }
              }
            });
          }} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  const productColumns = [
    {
      header: 'Product Details',
      render: (product) => (
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center font-bold border ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-gray-100 border-gray-100 shadow-sm'}`}>
            {product.image?.url || (product.images && product.images[0]?.url) ? (
              <img src={product.image?.url || product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-bold">{product.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{product.name}</span>
            <span className="text-sm font-bold text-gray-400 uppercase">Code: {product._id?.substring(18)}</span>
          </div>
        </div>
      )
    },
    { header: 'Price', render: (product) => <span className={`text-sm font-bold text-primary`}>₹{product.price?.toLocaleString()}</span> },
    { header: 'Inventory', render: (product) => <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{product.stock !== undefined ? product.stock : 'N/A'} units</span> },
    {
      header: 'Status',
      render: (product) => {
        const active = product.isActive && !product.isDeleted;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
            <span className="text-sm font-semibold uppercase text-gray-400">{product.status || 'ACTIVE'}</span>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      render: (product) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            title="View Product Details" 
            onClick={() => {
              Swal.fire({
                title: product.name,
                html: `
                  <div class="text-left text-xs space-y-3 font-outfit mt-4 text-gray-600 dark:text-gray-300">
                    <p><strong>Slug:</strong> /${product.slug}</p>
                    <p><strong>Description:</strong> ${product.description || 'N/A'}</p>
                    <p><strong>Category ID:</strong> ${product.categoryId || 'N/A'}</p>
                    <p><strong>Vendor ID:</strong> ${product.vendorId || 'N/A'}</p>
                    <p><strong>Created By:</strong> ${product.createdBy || 'N/A'}</p>
                    <p><strong>Meta Title:</strong> ${product.metaTitle || 'N/A'}</p>
                    <p><strong>Meta Description:</strong> ${product.metaDescription || 'N/A'}</p>
                    <p><strong>Shipping Applies:</strong> ${product.isShippingApply ? 'Yes' : 'No'}</p>
                    <p><strong>Has Variants:</strong> ${product.hasVariants ? 'Yes' : 'No'}</p>
                  </div>
                `,
                confirmButtonColor: '#da016a',
                confirmButtonText: 'Close',
                background: isDarkMode ? '#1f2937' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderRadius: '20px',
                customClass: {
                  popup: 'rounded-3xl border-none p-6 md:p-8',
                  confirmButton: 'w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer'
                }
              });
            }} 
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'}`}
          >
            <Eye size={18} />
          </button>
          <button 
            title="Delete Product" 
            onClick={() => {
              Swal.fire({
                title: 'Delete Product?',
                text: `Are you sure you want to delete product "${product.name}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#da016a',
                cancelButtonColor: '#94a3b8',
                confirmButtonText: 'Yes, Delete',
                cancelButtonText: 'Cancel',
                background: isDarkMode ? '#1f2937' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderRadius: '20px',
                customClass: {
                  popup: 'rounded-3xl border-none',
                  confirmButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 text-white cursor-pointer',
                  cancelButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 cursor-pointer'
                }
              }).then(async (result) => {
                if (result.isConfirmed) {
                  const loadingToast = toast.loading('Deleting product...');
                  try {
                    const res = await deleteProduct(product.vendorId, product._id);
                    toast.dismiss(loadingToast);
                    if (res.success) {
                      toast.success(res.message || 'Product deleted successfully!');
                      fetchData();
                    } else {
                      toast.error(res.message || 'Failed to delete product.');
                    }
                  } catch (err) {
                    toast.dismiss(loadingToast);
                    toast.error('Something went wrong during deletion.');
                  }
                }
              });
            }} 
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const educatorColumns = [
    {
      header: 'Educator Profile',
      render: (item) => {
        const userDetails = item.userId || {};
        const logo = item.profileImage?.url || item.profileImage || userDetails.avatar;
        return (
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center font-bold border ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-gray-100 border-gray-100 shadow-sm'}`}>
              {logo ? (
                <img src={logo} alt={userDetails.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary font-bold">{userDetails.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{userDetails.name || 'Educator Partner'}</span>
              <span className="text-sm font-bold uppercase text-gray-400">{userDetails.email}</span>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Bio',
      render: (item) => {
        return <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 max-w-xs`}>{item.bio || 'No bio description'}</span>;
      }
    },
    {
      header: 'Expertise',
      render: (item) => {
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {item.expertise && item.expertise.length > 0 ? (
              item.expertise.map((exp, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase">{exp}</span>
              ))
            ) : (
              <span className="text-gray-450 text-sm font-bold uppercase">None</span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Active Status',
      render: (item) => {
        const isActive = item.isActive;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
            <span className="text-sm font-semibold uppercase text-gray-400">
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Approval Status',
      render: (item) => {
        const isApproved = item.isApproved;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
            <span className="text-sm font-semibold uppercase text-gray-400">
              {isApproved ? 'Approved' : 'Pending'}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      render: (item) => {
        const isApproved = item.isApproved;
        const educatorId = item._id;
        
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {!isApproved && (
              <button 
                title="Approve Educator" 
                onClick={async () => {
                  const loadingToast = toast.loading('Approving educator...');
                  try {
                    const res = await approveEducator(educatorId, true);
                    toast.dismiss(loadingToast);
                    if (res.success) {
                      toast.success(res.message || 'Educator approved successfully!');
                      fetchData();
                    } else {
                      toast.error(res.message || 'Failed to approve educator.');
                    }
                  } catch (err) {
                    toast.dismiss(loadingToast);
                    toast.error('Something went wrong during approval.');
                  }
                }} 
                className="p-2 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 hover:scale-110 transition-all cursor-pointer"
              >
                <CircleCheckBig size={15} />
              </button>
            )}
            {isApproved && (
              <button 
                title="Revoke / Disapprove Educator" 
                onClick={async () => {
                  const loadingToast = toast.loading('Rejecting educator...');
                  try {
                    const res = await approveEducator(educatorId, false);
                    toast.dismiss(loadingToast);
                    if (res.success) {
                      toast.success(res.message || 'Educator status updated successfully!');
                      fetchData();
                    } else {
                      toast.error(res.message || 'Failed to update educator status.');
                    }
                  } catch (err) {
                    toast.dismiss(loadingToast);
                    toast.error('Something went wrong.');
                  }
                }} 
                className="p-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:scale-110 transition-all cursor-pointer"
              >
                <CircleX size={15} />
              </button>
            )}
            <button 
              title={item.isActive ? "Deactivate Educator" : "Activate Educator"} 
              onClick={async () => {
                const loadingToast = toast.loading(item.isActive ? 'Deactivating educator...' : 'Activating educator...');
                try {
                  const res = await toggleEducatorActive(educatorId, !item.isActive);
                  toast.dismiss(loadingToast);
                  if (res.success) {
                    toast.success(res.message || `Educator status updated successfully!`);
                    fetchData();
                  } else {
                    toast.error(res.message || 'Failed to toggle status.');
                  }
                } catch (err) {
                  toast.dismiss(loadingToast);
                  toast.error('Something went wrong.');
                }
              }} 
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                item.isActive 
                  ? (isDarkMode ? 'bg-white/5 text-green-500 hover:text-red-500' : 'bg-gray-50 text-green-600 hover:text-red-500') 
                  : (isDarkMode ? 'bg-white/5 text-gray-400 hover:text-green-500' : 'bg-gray-50 text-gray-400 hover:text-green-600')
              }`}
            >
              <Power size={15} />
            </button>
            <button onClick={() => setItemToDelete(item)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}><Trash2 size={15} /></button>
          </div>
        );
      }
    }
  ];

  return (
    <div className={`flex min-h-screen font-outfit transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <UserDetailsModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      <OrderDetailsModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      <InfluencerDetailsModal key={`inf-${selectedInfluencerId}`} influencerId={selectedInfluencerId} onClose={() => setSelectedInfluencerId(null)} onEditCoupon={(coupon) => { setEditingCoupon(coupon); setInfluencerForCoupon(true); }} onRefresh={fetchData} />
      <CouponDetailsModal key={`coup-${selectedCouponId}`} couponId={selectedCouponId} onClose={() => setSelectedCouponId(null)} />
      <CreateCouponModal isOpen={!!influencerForCoupon || !!editingCoupon} onClose={() => { setInfluencerForCoupon(null); setEditingCoupon(null); fetchData(); }} initialData={editingCoupon} influencerId={influencerForCoupon?._id} influencerName={influencerForCoupon?.name} />
      <VendorDetailsModal vendorId={selectedVendorId} onClose={() => setSelectedVendorId(null)} />
      <EducatorDetailsModal educatorId={selectedEducatorId} onClose={() => setSelectedEducatorId(null)} />
      <CreateCourseCategoryModal isOpen={isCreateCourseCategoryOpen} onClose={() => setIsCreateCourseCategoryOpen(false)} onSuccess={fetchData} />
      <CourseCategoryDetailsModal courseCategoryId={selectedCourseCategoryId} onClose={() => setSelectedCourseCategoryId(null)} />
      <DeleteConfirmModal isOpen={!!itemToDelete} itemName={itemToDelete?.name || itemToDelete?.businessName} onConfirm={handleDeleteConfirm} onCancel={() => setItemToDelete(null)} />
      <OnboardInfluencerModal isOpen={isOnboardingOpen} onClose={() => { setIsOnboardingOpen(false); setEditingInfluencer(null); }} initialData={editingInfluencer} onSuccess={fetchData} />
      <CreateCategoryModal 
        isOpen={isCreateCategoryOpen || !!editingCategory} 
        onClose={() => { 
          setIsCreateCategoryOpen(false); 
          setEditingCategory(null); 
        }} 
        onSuccess={fetchData} 
        initialData={editingCategory}
      />
      <CategoryDetailsModal 
        categoryId={selectedCategoryId} 
        onClose={() => setSelectedCategoryId(null)} 
      />
      <CreateCommissionSlabModal
        isOpen={isCreateSlabOpen || !!editingSlab}
        onClose={() => {
          setIsCreateSlabOpen(false);
          setEditingSlab(null);
        }}
        initialData={editingSlab}
        onSuccess={fetchData}
        isDarkMode={isDarkMode}
      />
      <CommissionSlabDetailsModal
        slabId={selectedSlabId}
        onClose={() => setSelectedSlabId(null)}
      />
      <CreateCashbackSlabModal
        isOpen={isCreateCashbackSlabOpen || !!editingCashbackSlab}
        onClose={() => {
          setIsCreateCashbackSlabOpen(false);
          setEditingCashbackSlab(null);
        }}
        initialData={editingCashbackSlab}
        onSuccess={fetchData}
        isDarkMode={isDarkMode}
      />
      <CashbackSlabDetailsModal
        slab={selectedCashbackSlab}
        onClose={() => setSelectedCashbackSlab(null)}
      />
      <CreateHomeContentModal
        isOpen={showHomeContentModal || !!editingHomeContent}
        onClose={() => {
          setShowHomeContentModal(false);
          setEditingHomeContent(null);
        }}
        onSuccess={fetchData}
        editData={editingHomeContent}
      />
      <HomeContentDetailsModal
        isOpen={!!selectedHomeContentId}
        id={selectedHomeContentId}
        onClose={() => setSelectedHomeContentId(null)}
        isDarkMode={isDarkMode}
      />

      {/* Sidebar */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        handleLogout={handleLogout}
        role={role}
        adminAccess={adminAccess}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="flex-1 flex flex-col min-h-screen min-w-0 h-screen overflow-y-scroll"
      >
        <header className={`h-24 flex-shrink-0 flex items-center justify-between px-6 lg:px-10 border-b sticky top-0 z-[1000] ${isDarkMode ? 'bg-gray-950/90 backdrop-blur-xl border-white/5' : 'bg-white/80 backdrop-blur-xl border-gray-100'}`}>
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
              <Menu size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search platform..." value={filters.search} onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && fetchData()} className={`w-full pl-12 pr-4 py-3 border-none rounded-xl text-sm outline-none font-medium placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs transition-all ${isDarkMode ? 'bg-white/5 text-gray-200' : 'bg-gray-50 text-gray-800 focus:bg-gray-100'}`} />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button onClick={toggleTheme} className={`p-3 rounded-xl transition-all border ${isDarkMode ? 'bg-white/5 text-primary border-white/5 shadow-xl shadow-primary/10' : 'bg-gray-50 text-primary border-transparent hover:bg-gray-100'}`}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <div className={`w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20`}>AD</div>
          </div>
        </header>

        <main className="p-4 lg:p-10 space-y-6 lg:space-y-10 flex-grow">
          {/* Shared directories block */}
          <div className={['users', 'vendors', 'pending', 'influencers', 'commission-slabs', 'coupons', 'categories', 'course-categories', 'orders', 'products', 'educators', 'all-educators', 'cashback-slabs'].includes(activeTab) ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <div className="space-y-6 lg:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className={`text-lg lg:text-3xl font-bold uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{activeTab.replace('-', ' ')} Directory</h2>
                  <p className="text-sm font-semibold uppercase text-gray-400 mt-1">Oversee global system accounts</p>
                </div>
                <div className={`px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-[24px] border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100'}`}>
                  <p className="text-sm font-bold uppercase text-gray-400 mb-0.5">Total {activeTab === 'commission-slabs' ? 'Slabs' : activeTab}</p>
                  <p className="text-xl lg:text-2xl font-bold">{pagination.total}</p>
                </div>
              </div>

              {activeTab === 'influencers' && (
                <div className="flex">
                  <button
                    onClick={() => { setIsSendLinkOpen(true); }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Sparkles size={18} />
                    Send Invitation Link
                  </button>
                </div>
              )}

              {activeTab === 'commission-slabs' && (
                <div className="flex">
                  <button
                    onClick={() => setIsCreateSlabOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={18} />
                    Create Slab
                  </button>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="flex">
                  <button
                    onClick={() => setIsCreateCategoryOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={18} />
                    Create Category
                  </button>
                </div>
              )}

              {activeTab === 'course-categories' && (
                <div className="flex">
                  <button
                    onClick={() => setIsCreateCourseCategoryOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={18} />
                    Create Course Category
                  </button>
                </div>
              )}

              {activeTab === 'cashback-slabs' && (
                <div className="flex">
                  <button
                    onClick={() => { setEditingCashbackSlab(null); setIsCreateCashbackSlabOpen(true); }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={18} />
                    Create Cashback Slab
                  </button>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="flex">
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: 'Delete All Products?',
                        text: 'Are you sure you want to delete all products? This action is irreversible!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#94a3b8',
                        confirmButtonText: 'Yes, Delete All',
                        cancelButtonText: 'Cancel',
                        background: isDarkMode ? '#1f2937' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        borderRadius: '20px',
                        customClass: {
                          popup: 'rounded-3xl border-none',
                          confirmButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 text-white cursor-pointer',
                          cancelButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 cursor-pointer'
                        }
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          const loadingToast = toast.loading('Deleting all products...');
                          try {
                            const res = await deleteAllProducts();
                            toast.dismiss(loadingToast);
                            if (res.success) {
                              toast.success(res.message || 'All products deleted successfully!');
                              fetchData();
                            } else {
                              toast.error(res.message || 'Failed to delete products.');
                            }
                          } catch (err) {
                            toast.dismiss(loadingToast);
                            toast.error('Something went wrong during deletion.');
                          }
                        }
                      });
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-xs uppercase shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <Trash2 size={18} />
                    Delete All Products
                  </button>
                </div>
              )}

              <DataTable
                columns={
                  activeTab === 'users'
                    ? userColumns
                    : activeTab === 'influencers'
                    ? influencerColumns
                    : activeTab === 'commission-slabs'
                    ? commissionSlabColumns
                    : activeTab === 'cashback-slabs'
                    ? cashbackSlabColumns
                    : activeTab === 'coupons'
                    ? couponColumns
                    : activeTab === 'categories'
                    ? categoryColumns
                  : activeTab === 'course-categories'
                    ? courseCategoryColumns
                    : activeTab === 'orders'
                    ? orderColumns
                    : activeTab === 'products'
                    ? productColumns
                    : activeTab === 'educators' || activeTab === 'all-educators'
                    ? educatorColumns
                    : vendorColumns
                }
                data={dataList}
                loading={loading}
                onRowClick={(item) => {
                  if (activeTab === 'users') setSelectedUserId(item._id);
                  else if (activeTab === 'educators' || activeTab === 'all-educators') setSelectedEducatorId(item._id);
                  else if (activeTab === 'influencers') setSelectedUserId(item.userId?._id || item.userId);
                  else if (activeTab === 'categories') setSelectedCategoryId(item._id);
                  else if (activeTab === 'orders') setSelectedOrderId(item._id);
                  else if (activeTab === 'commission-slabs' || activeTab === 'products') { /* no-op */ }
                  else if (activeTab === 'cashback-slabs') setSelectedCashbackSlab(item);
                  else if (activeTab === 'course-categories') setSelectedCourseCategoryId(item._id);
                  else setSelectedVendorId(item.vendorId?._id || item._id);
                }}
              />
              <div className="flex justify-center gap-3">
                <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1} className={`p-4 rounded-2xl disabled:opacity-30 shadow-sm transition-all ${isDarkMode ? 'bg-gray-800 text-white hover:bg-primary' : 'bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-100'}`}><ChevronLeft size={20} /></button>
                <div className="w-14 h-14 flex items-center justify-center bg-primary text-white rounded-2xl font-bold shadow-2xl shadow-primary/30 ring-4 ring-primary/10">{pagination.page}</div>
                <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={dataList.length < pagination.limit} className={`p-4 rounded-2xl disabled:opacity-30 shadow-sm transition-all ${isDarkMode ? 'bg-gray-800 text-white hover:bg-primary' : 'bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-100'}`}><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>

          {/* Vendor Payouts */}
          <div className={activeTab === 'vendor-payouts' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <VendorPayouts isDarkMode={isDarkMode} />
          </div>

          {/* Influencer Commissions */}
          <div className={activeTab === 'influencer-commissions' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <InfluencerCommissions isDarkMode={isDarkMode} />
          </div>

          {/* Affiliate Dashboard */}
          <div className={activeTab === 'affiliate-dashboard' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <AdminAffiliateDashboard isDarkMode={isDarkMode} />
          </div>

          {/* Beauty Services (Subscription Plans) */}
          <div className={activeTab === 'beauty-services' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <SubscriptionPlans isDarkMode={isDarkMode} />
          </div>

          {/* Service Manager */}
          <div className={activeTab === 'subscription-plans' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <AdminServiceManager isDarkMode={isDarkMode} />
          </div>

          {/* Service Categories */}
          <div className={activeTab === 'service-categories' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <ServiceCategories isDarkMode={isDarkMode} />
          </div>

          {/* Service Providers */}
          <div className={activeTab === 'service-providers' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <ServiceProviders isDarkMode={isDarkMode} />
          </div>

          {/* Wallet Balances Console */}
          <div className={activeTab === 'wallet-balances' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <AdminWalletBalances isDarkMode={isDarkMode} />
          </div>

          {/* Bank Accounts Console */}
          <div className={activeTab === 'bank-accounts' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <AdminBankAccounts isDarkMode={isDarkMode} />
          </div>

          {/* Support Tickets Console */}
          <div className={activeTab === 'tickets' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <SupportTickets isDarkMode={isDarkMode} />
          </div>

          {/* Sub-Admins Management Console */}
          {(role === 'super_admin' || role === 'admin') && (
            <div className={activeTab === 'sub-admins' ? 'block animate-in fade-in duration-300' : 'hidden'}>
              <SubAdminsManager isDarkMode={isDarkMode} />
            </div>
          )}

          {/* Home Content Manager */}
          <div className={activeTab === 'home-content' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <HomeContentList
              isDarkMode={isDarkMode}
              homeContents={dataList}
              loading={loading}
              onCreateTrigger={() => setShowHomeContentModal(true)}
              onEditTrigger={(item) => {
                setEditingHomeContent(item);
                setShowHomeContentModal(true);
              }}
              onViewTrigger={(item) => setSelectedHomeContentId(item._id)}
              onDeleteSuccess={fetchData}
            />
          </div>

          {/* Notifications Management Console */}
          <div className={activeTab === 'notifications' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <NotificationsManager isDarkMode={isDarkMode} />
          </div>

          {/* Admin Service Leads Manager */}
          <div className={activeTab === 'admin-service-leads' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <AdminServiceLeads isDarkMode={isDarkMode} />
          </div>

          {/* Profile Console */}
          <div className={activeTab === 'profile' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <AdminProfile isDarkMode={isDarkMode} />
          </div>

          {/* Dashboard Overview */}
          <div className={activeTab === 'dashboard' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <AdminDashboard
              isOverviewLoading={isOverviewLoading}
              overviewData={overviewData}
              revenueTrend={revenueTrend}
              topCategories={topCategories}
              orderStatusAnalytics={orderStatusAnalytics}
              categoryDistribution={categoryDistribution}
              orderStatusGraph={orderStatusGraph}
              monthlyAnalytics={monthlyAnalytics}
              yearlyAnalytics={yearlyAnalytics}
              analyticsGraph={analyticsGraph}
              topVendorsGraph={topVendorsGraph}
              isDarkMode={isDarkMode}
              setActiveTab={setActiveTab}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              activeMonthlyMetric={activeMonthlyMetric}
              setActiveMonthlyMetric={setActiveMonthlyMetric}
              fetchMonthlyData={fetchMonthlyData}
            />
          </div>
        </main>
      </div>

      {/* ── Send Influencer Invitation Link Modal ── */}
      <SendInvitationModal
        isOpen={isSendLinkOpen}
        onClose={() => setIsSendLinkOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default AdminPanel;
