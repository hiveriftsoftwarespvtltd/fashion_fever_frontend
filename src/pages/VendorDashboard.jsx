import React, { useState, useEffect } from 'react';
import { getVendorDetails, getVendorProducts, deleteProduct, getVendorOrders, getVendorOverview, getVendorTopProducts, getVendorOrderGraph, getVendorTopCategories, getVendorOrderComparison } from '../api/vendorService';
import {
  Package,
  IndianRupee,
  Plus,
  Search,
  Edit,
  Trash2,
  Menu,
  Eye,
  Store,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Percent
} from 'lucide-react';
import { toast } from '../utils/toast';
import Swal from 'sweetalert2';
import VendorSidebar from '../components/vendor/VendorSidebar';
import EditProfileModal from '../components/vendor/EditProfileModal';
import ProductModal from '../components/vendor/ProductModal';
import VendorOrderDetailsModal from '../components/vendor/VendorOrderDetailsModal';
import { useTheme } from '../context/ThemeContext';

const VendorDashboard = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('vendorActiveTab') || 'overview';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('vendorActiveTab', activeTab);
  }, [activeTab]);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [vendorData, setVendorData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [overviewData, setOverviewData] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [topProducts, setTopProducts] = useState([]);
  const [topProductsLoading, setTopProductsLoading] = useState(false);
  const [orderGraphData, setOrderGraphData] = useState([]);
  const [orderGraphLoading, setOrderGraphLoading] = useState(false);
  const [graphDays, setGraphDays] = useState(20);
  const [topCategories, setTopCategories] = useState([]);
  const [topCategoriesLoading, setTopCategoriesLoading] = useState(false);
  const [orderComparison, setOrderComparison] = useState(null);
  const [orderComparisonLoading, setOrderComparisonLoading] = useState(false);

  // States for Modals
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isViewingProduct, setIsViewingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const getImageUrl = (img) => {
    if (!img) return '';
    if (img instanceof File) return URL.createObjectURL(img);
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    return '';
  };

  const fetchVendorData = async () => {
    try {
      const response = await getVendorDetails();
      if (response.success) {
        setVendorData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch vendor details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchProductsAndCategories = async () => {
    if (activeTab === 'products' || activeTab === 'overview') {
      setProductsLoading(true);
      try {
        const response = await getVendorProducts();
        if (response.success) {
          const productList = response.data?.data || response.data || [];
          setProducts(productList);
        }
      } catch (error) { console.error(error); }
      finally { setProductsLoading(false); }
    }

    if (activeTab === 'orders' || activeTab === 'overview') {
      setOrdersLoading(true);
      try {
        const response = await getVendorOrders();
        if (response.success) {
          const orderList = response.data?.data || response.data || [];
          setOrders(orderList);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setOrdersLoading(false);
      }
    }

    if (activeTab === 'overview') {
      setOverviewLoading(true);
      setTopProductsLoading(true);
      setOrderGraphLoading(true);
      setTopCategoriesLoading(true);
      setOrderComparisonLoading(true);
      try {
        const [overviewRes, topProdRes, graphRes, catRes, compRes] = await Promise.allSettled([
          getVendorOverview(),
          getVendorTopProducts(),
          getVendorOrderGraph(graphDays),
          getVendorTopCategories(),
          getVendorOrderComparison()
        ]);

        if (overviewRes.status === 'fulfilled' && overviewRes.value?.success) {
          const innerData = overviewRes.value.data?.data || overviewRes.value.data || null;
          setOverviewData(innerData);
        }
        if (topProdRes.status === 'fulfilled' && topProdRes.value?.success) {
          const innerList = topProdRes.value.data?.data || topProdRes.value.data || [];
          setTopProducts(Array.isArray(innerList) ? innerList : []);
        }
        if (graphRes.status === 'fulfilled' && graphRes.value?.success) {
          const innerGraph = graphRes.value.data?.data || graphRes.value.data || [];
          setOrderGraphData(Array.isArray(innerGraph) ? innerGraph : []);
        }
        if (catRes.status === 'fulfilled' && catRes.value?.success) {
          const innerCatList = catRes.value.data?.data || catRes.value.data || [];
          setTopCategories(Array.isArray(innerCatList) ? innerCatList : []);
        }
        if (compRes.status === 'fulfilled' && compRes.value?.success) {
          const innerComp = compRes.value.data?.data || compRes.value.data || null;
          setOrderComparison(innerComp);
        }
      } catch (error) {
        console.error("Overview dynamic fetch error:", error);
      } finally {
        setOverviewLoading(false);
        setTopProductsLoading(false);
        setOrderGraphLoading(false);
        setTopCategoriesLoading(false);
        setOrderComparisonLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, [activeTab, showProductModal, graphDays]);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const stats = [
    { 
      id: 'revenue',
      label: 'Total Revenue', 
      value: formatCurrency(overviewData?.totalRevenue || 0), 
      icon: <TrendingUp size={20} />, 
      change: 'Gross Inflow',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/10',
      glow: 'hover:shadow-emerald-500/10 hover:border-emerald-500/30',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
    },
    { 
      id: 'grossProfit',
      label: 'Gross Profit', 
      value: formatCurrency(overviewData?.grossProfit || 0), 
      icon: <IndianRupee size={20} />, 
      change: 'Profit Scale',
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20 dark:border-cyan-500/10',
      glow: 'hover:shadow-cyan-500/10 hover:border-cyan-500/30',
      badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
    },
    { 
      id: 'netProfit',
      label: 'Net Profit', 
      value: formatCurrency(overviewData?.netProfit || 0), 
      icon: <CreditCard size={20} />, 
      change: 'Take Home',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20 dark:border-indigo-500/10',
      glow: 'hover:shadow-indigo-500/10 hover:border-indigo-500/30',
      badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
    },
    { 
      id: 'pendingPayout',
      label: 'Pending Payout', 
      value: formatCurrency(overviewData?.pendingPayout || 0), 
      icon: <Clock size={20} />, 
      change: 'In Pipeline',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20 dark:border-amber-500/10',
      glow: 'hover:shadow-amber-500/10 hover:border-amber-500/30',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
    },
    { 
      id: 'totalOrders',
      label: 'Total Orders', 
      value: (overviewData?.totalOrders || 0).toLocaleString(), 
      icon: <ShoppingCart size={20} />, 
      change: 'Order Book',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:border-blue-500/10',
      glow: 'hover:shadow-blue-500/10 hover:border-blue-500/30',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
    },
    { 
      id: 'deliveredOrders',
      label: 'Delivered Orders', 
      value: (overviewData?.deliveredOrders || 0).toLocaleString(), 
      icon: <CheckCircle2 size={20} />, 
      change: 'Fulfilled',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/10',
      glow: 'hover:shadow-emerald-500/10 hover:border-emerald-500/30',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
    },
    { 
      id: 'pendingOrders',
      label: 'Pending Orders', 
      value: (overviewData?.pendingOrders || 0).toLocaleString(), 
      icon: <Clock size={20} />, 
      change: 'Processing',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20 dark:border-purple-500/10',
      glow: 'hover:shadow-purple-500/10 hover:border-purple-500/30',
      badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
    },
    { 
      id: 'cancelledOrders',
      label: 'Cancelled Orders', 
      value: (overviewData?.cancelledOrders || 0).toLocaleString(), 
      icon: <XCircle size={20} />, 
      change: 'Voided',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20 dark:border-rose-500/10',
      glow: 'hover:shadow-rose-500/10 hover:border-rose-500/30',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
    },
  ];

  const handleEditProduct = (product) => {
    setIsEditingProduct(true);
    setIsViewingProduct(false);
    setCurrentProductId(product._id);
    setShowProductModal(true);
  };

  const handleViewProduct = (product) => {
    setIsViewingProduct(true);
    setIsEditingProduct(false);
    setCurrentProductId(product._id);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#fff',
      customClass: {
        title: 'text-lg font-bold font-outfit uppercase',
        htmlContainer: 'text-xs font-bold font-outfit text-gray-500 uppercase',
        confirmButton: 'bg-primary px-6 py-2.5 rounded-xl font-bold uppercase text-xs',
        cancelButton: 'bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl font-bold uppercase text-xs'
      }
    });

    if (result.isConfirmed) {
      const loadingToast = toast.loading('Deleting product...');
      try {
        const response = await deleteProduct(id);
        toast.dismiss(loadingToast);
        if (response.success) {
          toast.success(response.data?.message || 'Product deleted successfully!');
          fetchProductsAndCategories();
        } else {
          toast.error(response.data?.message || 'Failed to delete product');
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('System error');
      }
    }
  };

  const getCurvePath = (points) => {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + 2 * (next.x - curr.x) / 3;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const getVendorSvgChartPaths = () => {
    if (!orderGraphData || orderGraphData.length === 0) return { linePath: '', areaPath: '', points: [], maxVal: 10000, chartHeight: 160 };
    
    const maxVal = Math.max(...orderGraphData.map(item => item.revenue || item.totalRevenue || item.amount || 0), 1000);
    const chartHeight = 160;
    const chartWidth = 500;
    const paddingLeft = 60;
    const paddingRight = 40;
    const paddingTop = 20;
    const paddingBottom = 40;
    
    const usableWidth = chartWidth - paddingLeft - paddingRight;
    const usableHeight = chartHeight - paddingTop - paddingBottom;
    
    const points = orderGraphData.map((item, idx) => {
      const x = paddingLeft + (idx / Math.max(orderGraphData.length - 1, 1)) * usableWidth;
      const val = item.revenue || item.totalRevenue || item.amount || 0;
      const y = chartHeight - paddingBottom - (val / maxVal) * usableHeight;
      const date = item.date || item.day || item.label || 'N/A';
      const ordersCount = item.orders || item.totalOrders || item.count || 0;
      return { x, y, revenue: val, date, ordersCount };
    });
    
    const linePath = getCurvePath(points);
    
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const bottomY = chartHeight - paddingBottom;
    const areaPath = points.length > 0 ? `${linePath} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z` : '';
    
    return { linePath, areaPath, points, maxVal, chartHeight };
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-outfit uppercase font-bold text-gray-400">Loading Dashboard...</div>;

  // Restrict dashboard access if vendor is not approved
  if (vendorData && vendorData.status !== 'APPROVED') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 font-outfit flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 flex flex-col items-center gap-6 relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10 animate-pulse">
            <Store size={36} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 uppercase ">Approval Pending</h2>
            <p className="text-xs font-bold text-gray-400 uppercase ">Store: {vendorData.businessName}</p>
          </div>
          
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Your vendor application has been received and is currently under review by our administrator team. 
            Once approved, you will get full access to your vendor dashboard to list products and start selling!
          </p>
          
          <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 text-left">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase ">Current Status</p>
              <p className="text-sm font-extrabold text-amber-600 uppercase ">{vendorData.status || 'PENDING'}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-2xl font-bold uppercase text-xs  transition-all shadow-lg shadow-primary/20 hover:opacity-95 active:opacity-90 cursor-pointer"
          >
            Logout & Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-outfit">
      <VendorSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        vendorData={vendorData}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-lg lg:text-xl font-bold text-gray-800 capitalize">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 bg-gray-100 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none w-48 lg:w-64"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/20">
              {vendorData?.businessName?.charAt(0) || 'V'}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {overviewLoading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-[32px] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/30">
                  <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Hydrating Merchant Analytics...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {stats.map((stat, i) => (
                    <div 
                      key={i} 
                      className={`p-5 lg:p-6 rounded-[28px] border transition-all duration-500 group relative overflow-hidden backdrop-blur-xl ${
                        stat.glow
                      } ${
                        isDarkMode 
                          ? 'bg-gray-800/40 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)]' 
                          : 'bg-white/60 border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
                      }`}
                    >
                      {/* Ambient background glow bubble */}
                      <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl opacity-10 transition-opacity duration-500 group-hover:opacity-20 ${
                        stat.id === 'revenue' || stat.id === 'deliveredOrders' ? 'bg-emerald-500' :
                        stat.id === 'grossProfit' ? 'bg-cyan-500' :
                        stat.id === 'netProfit' ? 'bg-indigo-500' :
                        stat.id === 'pendingPayout' ? 'bg-amber-500' :
                        stat.id === 'totalOrders' ? 'bg-blue-500' :
                        stat.id === 'pendingOrders' ? 'bg-purple-500' : 'bg-rose-500'
                      }`} />

                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className={`p-3 rounded-2xl transition-all duration-500 bg-gray-50/50 dark:bg-gray-900/60 ${stat.color} border shadow-inner flex items-center justify-center`}>
                          {stat.icon}
                        </div>
                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-lg border transition-all duration-300 ${stat.badge}`}>
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider mb-1 relative z-10 text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </h3>
                      <p className="text-base lg:text-xl font-extrabold tracking-tight relative z-10 transition-colors duration-300 text-gray-800 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Symmetrical Charts and Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left items-start">
                
                {/* Daily Order & Revenue Trend SVG Chart */}
                <div className={`p-6 lg:p-8 rounded-[32px] border text-left flex flex-col justify-between transition-all duration-300 lg:col-span-2 ${
                  isDarkMode 
                    ? 'bg-gray-800/40 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)]' 
                    : 'bg-white/60 border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
                } backdrop-blur-xl`}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-[9px] font-bold text-primary uppercase block mb-1">Financial Trends</span>
                      <h3 className="text-base font-extrabold uppercase text-gray-800 dark:text-white">
                        Order & Revenue Trend
                      </h3>
                    </div>
                    {/* Timeframe selector dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Range:</span>
                      <select 
                        value={graphDays} 
                        onChange={(e) => setGraphDays(Number(e.target.value))}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition-all ${
                          isDarkMode 
                            ? 'bg-gray-900 border-white/10 text-white focus:ring-primary/20' 
                            : 'bg-gray-50 border-gray-100 text-gray-700 focus:ring-primary/10'
                        }`}
                      >
                        <option value={10}>10 Days</option>
                        <option value={15}>15 Days</option>
                        <option value={20}>20 Days</option>
                        <option value={30}>30 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full relative overflow-hidden">
                    {orderGraphLoading ? (
                      <div className="h-[180px] flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hydrating trend metrics...</p>
                      </div>
                    ) : orderGraphData.length === 0 ? (
                      <div className="h-[180px] flex flex-col items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                        No trend data available.
                      </div>
                    ) : (() => {
                      const { linePath, areaPath, points, maxVal } = getVendorSvgChartPaths();
                      return (
                        <svg className="w-full h-auto max-h-[220px]" viewBox="0 0 500 160" preserveAspectRatio="xMidYMid meet">
                          <defs>
                            <linearGradient id="vendor-chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#da016a" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#da016a" stopOpacity="0.0" />
                            </linearGradient>
                            <filter id="vendor-svg-neon-glow-primary" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="3.5" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>
                          
                          {/* Grid Y lines */}
                          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                            const y = 20 + ratio * 100;
                            const val = Math.round(maxVal * (1 - ratio));
                            return (
                              <g key={idx} className="opacity-15">
                                <line x1="60" y1={y} x2="460" y2={y} stroke={isDarkMode ? '#ffffff' : '#000000'} strokeDasharray="3,3" strokeWidth="1" />
                                <text x="15" y={y + 3} className={`text-[8px] font-bold fill-current ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  ₹{val >= 1000 ? (val / 1000).toFixed(0) + 'K' : val}
                                </text>
                              </g>
                            );
                          })}

                          {/* X-axis date labels */}
                          {points.map((p, idx) => {
                            const showLabel = idx === 0 || idx === Math.floor(points.length / 2) || idx === points.length - 1;
                            if (!showLabel) return null;
                            return (
                              <text key={idx} x={p.x} y="145" textAnchor="middle" className={`text-[8px] font-bold opacity-75 fill-current ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {p.date}
                              </text>
                            );
                          })}

                          {/* Area Fill */}
                          {areaPath && (
                            <path d={areaPath} fill="url(#vendor-chart-area-grad)" />
                          )}

                          {/* Stroke Line */}
                          {linePath && (
                            <path d={linePath} fill="none" stroke="#da016a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#vendor-svg-neon-glow-primary)" />
                          )}

                          {/* Glowing dots at data points */}
                          {points.map((p, idx) => (
                            <g key={idx} className="group/dot cursor-pointer">
                              <circle cx={p.x} cy={p.y} r="4" className="fill-primary stroke-white dark:stroke-gray-800 transition-all duration-300 group-hover/dot:r-6" strokeWidth="1.5" />
                              <circle cx={p.x} cy={p.y} r="8" className="fill-primary/20 opacity-0 group-hover/dot:opacity-100 transition-all duration-300" />
                              <title>Date: {p.date} &#13;Revenue: ₹{p.revenue.toLocaleString()} &#13;Orders: {p.ordersCount}</title>
                            </g>
                          ))}
                        </svg>
                      );
                    })()}
                  </div>
                </div>

                {/* Top Selling Products List */}
                <div className={`p-6 lg:p-8 rounded-[32px] border text-left flex flex-col justify-between transition-all duration-300 lg:col-span-1 ${
                  isDarkMode 
                    ? 'bg-gray-800/40 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)]' 
                    : 'bg-white/60 border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
                } backdrop-blur-xl`}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-[9px] font-bold text-primary uppercase block mb-1">Catalog Performance</span>
                      <h3 className="text-base font-extrabold uppercase text-gray-800 dark:text-white">
                        Top Products
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[9px] font-bold uppercase">
                      {topProducts.length} Items
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    {topProductsLoading ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loading product statistics...</p>
                      </div>
                    ) : topProducts.length === 0 ? (
                      <div className="text-center py-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        No selling analytics.
                      </div>
                    ) : (() => {
                      const maxRevenue = Math.max(...topProducts.map(p => {
                        const qty = p.totalSold || p.quantitySold || p.quantity || p.unitsSold || 0;
                        const price = p.product?.variants?.[0]?.salesPrice || p.salesPrice || p.price || 0;
                        return p.totalRevenue || (qty * price) || 0;
                      }), 1);

                      return (
                        <div className="space-y-4 font-bold max-h-[220px] overflow-y-auto pr-1">
                          {topProducts.map((item, idx) => {
                            const prod = item.product || {};
                            const qty = item.totalSold || item.quantitySold || item.quantity || item.unitsSold || 0;
                            const price = prod.variants?.[0]?.salesPrice || item.salesPrice || item.price || 0;
                            const revenue = item.totalRevenue || (qty * price) || 0;
                            const percent = Math.min(Math.round((revenue / maxRevenue) * 100), 100);

                            const colors = [
                              { text: 'text-pink-500', bar: 'from-pink-400 to-pink-600 shadow-pink-500/20' },
                              { text: 'text-purple-500', bar: 'from-purple-400 to-purple-600 shadow-purple-500/20' },
                              { text: 'text-blue-500', bar: 'from-blue-400 to-blue-600 shadow-blue-500/20' },
                              { text: 'text-green-500', bar: 'from-green-400 to-green-600 shadow-green-500/20' }
                            ];
                            const design = colors[idx % colors.length];

                            return (
                              <div key={item._id || idx} className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 flex items-center justify-center font-bold text-sm bg-gray-50 dark:bg-gray-900 text-gray-400 flex-shrink-0">
                                    {prod.variants?.[0]?.thumbnail ? (
                                      <img src={getImageUrl(prod.variants[0].thumbnail)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-xs uppercase font-extrabold text-primary">{prod.name?.charAt(0) || 'P'}</span>
                                    )}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{prod.name || 'Product'}</span>
                                    <span className="text-[9px] font-medium text-gray-400 truncate">{qty.toLocaleString()} sold • {formatCurrency(price)}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                  <span className="text-xs font-extrabold text-emerald-500">{formatCurrency(revenue)}</span>
                                  <div className="w-16 h-1 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                                    <div style={{ width: `${percent}%` }} className={`h-full bg-gradient-to-r ${design.bar} rounded-full transition-all duration-1000`} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>

              {/* Symmetrical Top Categories and MoM Comparison Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left items-start">

                {/* Top Performing Categories Box */}
                <div className={`p-6 lg:p-8 rounded-[32px] border text-left flex flex-col justify-between transition-all duration-300 lg:col-span-2 ${
                  isDarkMode 
                    ? 'bg-gray-800/40 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)]' 
                    : 'bg-white/60 border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
                } backdrop-blur-xl`}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-[9px] font-bold text-primary uppercase block mb-1">Inventory Performance</span>
                      <h3 className="text-base font-extrabold uppercase text-gray-800 dark:text-white">
                        Top Selling Categories
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase">
                      {topCategories.length} Categories
                    </span>
                  </div>

                  {topCategoriesLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loading category analytics...</p>
                    </div>
                  ) : topCategories.length === 0 ? (
                    <div className="text-center py-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      No category distribution recorded.
                    </div>
                  ) : (() => {
                    const maxSales = Math.max(...topCategories.map(c => c.totalSales || c.sales || c.revenue || 0), 1);
                    const totalSales = topCategories.reduce((sum, item) => sum + (item.totalSales || item.sales || item.revenue || 0), 0) || 1;
                    
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Left: Progress bars list */}
                        <div className="lg:col-span-2 space-y-6">
                          {topCategories.map((item, idx) => {
                            const cat = item.category || {};
                            const sales = item.totalSales || item.sales || item.revenue || 0;
                            const ordersCount = item.totalOrders || item.orders || item.count || 0;
                            const percent = Math.min(Math.round((sales / maxSales) * 100), 100);

                            const colors = [
                              { text: 'text-pink-500', bar: 'from-pink-400 to-pink-600 shadow-pink-500/20', bg: 'bg-pink-500' },
                              { text: 'text-purple-500', bar: 'from-purple-400 to-purple-600 shadow-purple-500/20', bg: 'bg-purple-500' },
                              { text: 'text-blue-500', bar: 'from-blue-400 to-blue-600 shadow-blue-500/20', bg: 'bg-blue-500' },
                              { text: 'text-green-500', bar: 'from-green-400 to-green-600 shadow-green-500/20', bg: 'bg-green-500' }
                            ];
                            const design = colors[idx % colors.length];

                            return (
                              <div key={cat._id || idx} className="space-y-2 group/cat transition-all duration-300">
                                <div className="flex justify-between items-end text-xs font-bold uppercase">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${design.bg} block shadow-sm`}></span>
                                    <span className={`font-black tracking-wider ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                      {cat.name || item.name || 'Category'}
                                    </span>
                                    <span className={`text-[9px] lowercase font-normal px-2 py-0.5 rounded-full ${
                                      isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {ordersCount} {ordersCount === 1 ? 'order' : 'orders'}
                                    </span>
                                  </div>
                                  <span className={`${design.text} font-black text-right`}>
                                    {formatCurrency(sales)}
                                  </span>
                                </div>
                                <div className={`w-full h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                  <div 
                                    style={{ width: `${percent}%` }} 
                                    className={`h-full bg-gradient-to-r ${design.bar} rounded-full transition-all duration-1000 shadow-md`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Right: Proportion stack and share chips */}
                        <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5 pt-6 lg:pt-0 lg:pl-8 space-y-6">
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase">Sales Proportion Stack</p>
                            <div className="w-full h-6 rounded-xl overflow-hidden flex shadow-inner border border-gray-100/10">
                              {topCategories.map((item, idx) => {
                                const sales = item.totalSales || item.sales || item.revenue || 0;
                                const pct = Math.round((sales / totalSales) * 100);
                                if (pct === 0) return null;

                                const colors = ['bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500'];
                                return (
                                  <div 
                                    key={idx} 
                                    style={{ width: `${pct}%` }} 
                                    className={`${colors[idx % colors.length]} transition-all duration-1000`} 
                                    title={`${item.category?.name || item.name}: ${pct}%`} 
                                  />
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 pt-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase">Proportional Share</p>
                            {topCategories.map((item, idx) => {
                              const sales = item.totalSales || item.sales || item.revenue || 0;
                              const pct = Math.round((sales / totalSales) * 100);

                              const colors = [
                                { text: 'text-pink-500', bg: 'bg-pink-500/10' },
                                { text: 'text-purple-500', bg: 'bg-purple-500/10' },
                                { text: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { text: 'text-green-500', bg: 'bg-green-500/10' }
                              ];
                              const design = colors[idx % colors.length];

                              return (
                                <div key={idx} className={`flex items-center justify-between p-3 rounded-2xl border border-gray-100/50 dark:border-white/5 transition-all ${design.bg}`}>
                                  <span className={`text-xs font-extrabold uppercase ${design.text}`}>
                                    {item.category?.name || item.name || 'Category'}
                                  </span>
                                  <span className={`text-xs font-black ${design.text}`}>
                                    {pct}% Share
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Month-over-Month Comparison Box */}
                <div className={`p-6 lg:p-8 rounded-[32px] border text-left flex flex-col justify-between transition-all duration-300 lg:col-span-1 ${
                  isDarkMode 
                    ? 'bg-gray-800/40 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)]' 
                    : 'bg-white/60 border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
                } backdrop-blur-xl`}>
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="text-[9px] font-bold text-primary uppercase block mb-1">Performance Metrics</span>
                        <h3 className="text-base font-extrabold uppercase text-gray-800 dark:text-white">
                          MoM Growth Analysis
                        </h3>
                      </div>
                      <span className="p-2 bg-primary/10 text-primary rounded-xl">
                        <TrendingUp size={16} />
                      </span>
                    </div>

                    {orderComparisonLoading ? (
                      <div className="py-16 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hydrating comparison...</p>
                      </div>
                    ) : !orderComparison ? (
                      <div className="text-center py-16 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        No comparison logs.
                      </div>
                    ) : (() => {
                      const currentRev = orderComparison.currentMonth?.revenue || 0;
                      const prevRev = orderComparison.previousMonth?.revenue || 0;
                      const currentOrders = orderComparison.currentMonth?.totalOrders || 0;
                      const prevOrders = orderComparison.previousMonth?.totalOrders || 0;

                      const revDiff = currentRev - prevRev;
                      const revPercent = prevRev > 0 ? ((revDiff / prevRev) * 100).toFixed(1) : (currentRev > 0 ? '100.0' : '0.0');
                      const isRevPositive = revDiff >= 0;

                      const orderDiff = currentOrders - prevOrders;
                      const orderPercent = prevOrders > 0 ? ((orderDiff / prevOrders) * 100).toFixed(1) : (currentOrders > 0 ? '100.0' : '0.0');
                      const isOrderPositive = orderDiff >= 0;

                      const maxRev = Math.max(currentRev, prevRev, 1);
                      const maxOrders = Math.max(currentOrders, prevOrders, 1);

                      const currentRevPercent = Math.min(Math.round((currentRev / maxRev) * 100), 100);
                      const prevRevPercent = Math.min(Math.round((prevRev / maxRev) * 100), 100);

                      const currentOrderPercent = Math.min(Math.round((currentOrders / maxOrders) * 100), 100);
                      const prevOrderPercent = Math.min(Math.round((prevOrders / maxOrders) * 100), 100);

                      return (
                        <div className="space-y-6">
                          
                          {/* Revenue Comparison section */}
                          <div className="space-y-3 p-4 rounded-2xl border border-gray-100/50 dark:border-white/5 bg-gray-50/20 dark:bg-gray-900/10">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Monthly Revenue</span>
                              <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                isRevPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                              }`}>
                                {isRevPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {isRevPositive ? '+' : ''}{revPercent}%
                              </div>
                            </div>

                            <div className="space-y-2">
                              {/* Current Month */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-gray-600 dark:text-gray-300">
                                  <span>Current Month</span>
                                  <span className="font-extrabold text-primary">{formatCurrency(currentRev)}</span>
                                </div>
                                <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                  <div 
                                    style={{ width: `${currentRevPercent}%` }} 
                                    className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transition-all duration-1000 shadow-sm"
                                  />
                                </div>
                              </div>

                              {/* Previous Month */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                  <span>Previous Month</span>
                                  <span className="font-extrabold">{formatCurrency(prevRev)}</span>
                                </div>
                                <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                  <div 
                                    style={{ width: `${prevRevPercent}%` }} 
                                    className="h-full bg-gray-400 dark:bg-gray-700 rounded-full transition-all duration-1000"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Orders Comparison section */}
                          <div className="space-y-3 p-4 rounded-2xl border border-gray-100/50 dark:border-white/5 bg-gray-50/20 dark:bg-gray-900/10">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Monthly Orders</span>
                              <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                isOrderPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                              }`}>
                                {isOrderPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {isOrderPositive ? '+' : ''}{orderPercent}%
                              </div>
                            </div>

                            <div className="space-y-2">
                              {/* Current Month */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-gray-600 dark:text-gray-300">
                                  <span>Current Month</span>
                                  <span className="font-extrabold text-blue-500">{currentOrders} {currentOrders === 1 ? 'order' : 'orders'}</span>
                                </div>
                                <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                  <div 
                                    style={{ width: `${currentOrderPercent}%` }} 
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 shadow-sm"
                                  />
                                </div>
                              </div>

                              {/* Previous Month */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                  <span>Previous Month</span>
                                  <span className="font-extrabold">{prevOrders} {prevOrders === 1 ? 'order' : 'orders'}</span>
                                </div>
                                <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                  <div 
                                    style={{ width: `${prevOrderPercent}%` }} 
                                    className="h-full bg-gray-400 dark:bg-gray-700 rounded-full transition-all duration-1000"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Summary Insights */}
                          <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              {isRevPositive 
                                ? `Revenue expanded by ₹${Math.abs(revDiff).toLocaleString()} MoM!` 
                                : `Revenue retracted by ₹${Math.abs(revDiff).toLocaleString()} MoM.`
                              }
                            </p>
                          </div>

                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Product Catalog</h2>
                <button
                  onClick={() => {
                    setIsEditingProduct(false);
                    setIsViewingProduct(false);
                    setCurrentProductId(null);
                    setShowProductModal(true);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                >
                  <Plus size={18} /> Add Product
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Product</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Price</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Stock</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {productsLoading ? (
                      <tr><td colSpan="5" className="p-10 text-center font-bold text-gray-400">Loading products...</td></tr>
                    ) : products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={getImageUrl(product.variants?.[0]?.thumbnail) || `https://ui-avatars.com/api/?name=${product.name}&background=random`} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-bold text-gray-800 text-sm">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-800">₹{product.variants?.[0]?.salesPrice || 0}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-600">{product.variants?.[0]?.stock || 0} units</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${product.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewProduct(product)}
                              className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                              title="Edit Product"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && !productsLoading && (
                      <tr><td colSpan="5" className="p-10 text-center font-bold text-gray-400">No products found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Customer Orders</h2>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase">
                  {orders.length} Total Orders
                </span>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Order Number</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Items</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Grand Total</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Payout Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {ordersLoading ? (
                        <tr><td colSpan="8" className="p-10 text-center font-bold text-gray-400">Loading orders...</td></tr>
                      ) : orders.map((order) => {
                        const itemsCount = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                        const orderDate = order.createdAt ? new Date(order.createdAt) : null;
                        const isDateValid = orderDate && !isNaN(orderDate.getTime());
                        
                        let statusColor = 'bg-amber-50 text-amber-600';
                        if (order.orderStatus === 'delivered') statusColor = 'bg-green-50 text-green-600';
                        else if (order.orderStatus === 'cancelled') statusColor = 'bg-red-50 text-red-600';
                        
                        return (
                          <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-bold text-gray-800 text-sm">{order.orderNumber}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-800 text-sm">{order.userId?.name || 'User'}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{order.userId?.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800">
                                  {isDateValid ? orderDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-gray-400">
                                  {isDateValid ? orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-600">{itemsCount} units</td>
                            <td className="px-6 py-4 text-sm font-bold text-primary">₹{(order.grandTotal || 0).toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm font-bold text-green-600">₹{(order.payoutAmount || 0).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${statusColor}`}>
                                {order.orderStatus || 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => {
                                  setCurrentOrder(order);
                                  setShowOrderModal(true);
                                }}
                                className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && !ordersLoading && (
                        <tr><td colSpan="8" className="p-10 text-center font-bold text-gray-400">No orders found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && vendorData && (
            <div className="max-w-4xl space-y-8">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-48 bg-gray-100 relative">
                  <img
                    src={getImageUrl(vendorData.banner)}
                    alt="Banner"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80'; }}
                  />
                  <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
                    <img
                      src={getImageUrl(vendorData.logo)}
                      alt="Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${vendorData.businessName}&background=random&size=128`; }}
                    />
                  </div>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur shadow-lg p-3 rounded-xl text-primary hover:scale-110 transition-all flex items-center gap-2 font-bold text-xs"
                  >
                    <Edit size={16} /> Edit Profile
                  </button>
                </div>
                <div className="pt-16 p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{vendorData.businessName}</h2>
                      <p className="text-gray-500 font-medium">@{vendorData.slug}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${vendorData.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {vendorData.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Email Address</label>
                        <p className="text-sm font-bold text-gray-800">{vendorData.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Phone Number</label>
                        <p className="text-sm font-bold text-gray-800">{vendorData.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Commission Rate</label>
                        <p className="text-sm font-bold text-gray-800">{vendorData.commissionRate || 0}%</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Business Address</label>
                        <p className="text-sm font-bold text-gray-800">{vendorData.address || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Description</label>
                        <p className="text-sm font-bold text-gray-800">{vendorData.description || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Member Since</label>
                        <p className="text-sm font-bold text-gray-800">{vendorData.createdAt ? new Date(vendorData.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialData={vendorData}
        onSuccess={fetchVendorData}
      />



      <ProductModal
        key={currentProductId || 'new-product-form'}
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        isEditing={isEditingProduct}
        isViewing={isViewingProduct}
        productId={currentProductId}
        onSuccess={fetchProductsAndCategories}
        getImageUrl={getImageUrl}
      />

      <VendorOrderDetailsModal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setCurrentOrder(null);
        }}
        order={currentOrder}
        onUpdate={fetchProductsAndCategories}
      />
    </div>
  );
};

export default VendorDashboard;
