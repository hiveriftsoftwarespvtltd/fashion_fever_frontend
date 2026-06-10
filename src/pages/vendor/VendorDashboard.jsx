import React, { useState, useEffect, useRef } from 'react';
import {
  getVendorDetails,
  getVendorProducts,
  deleteProduct,
  getVendorOrders,
  getVendorOverview,
  getVendorTopProducts,
  getVendorOrderGraph,
  getVendorTopCategories,
  getVendorOrderComparison,
  getVendorSalesPerformance,
  getVendorCategories,
  getVendorCustomerDemographics,
  exportVendorOrders
} from '../../api/vendorService';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Store
} from 'lucide-react';
import { toast } from '../../utils/toast';
import Swal from 'sweetalert2';
import VendorSidebar from './components/VendorSidebar';
import EditProfileModal from './components/EditProfileModal';
import ProductModal from './components/ProductModal';
import VendorOrderDetailsModal from './components/VendorOrderDetailsModal';
import { useTheme } from '../../context/ThemeContext';

// Import modular sub-components
import VendorOverview from './components/VendorOverview';
import VendorProducts from './components/VendorProducts';
import VendorOrders from './components/VendorOrders';
import VendorEarnings from './components/VendorEarnings';
import VendorProfile from './components/VendorProfile';

const VendorDashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('vendorActiveTab') || 'overview';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [activeTab]);

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

  const [salesPerformance, setSalesPerformance] = useState([]);
  const [salesPerformanceLoading, setSalesPerformanceLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [customerDemographics, setCustomerDemographics] = useState([]);
  const [customerDemographicsLoading, setCustomerDemographicsLoading] = useState(false);

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
    // Synchronously set loading states immediately to prevent layout jumps before await queries resolve
    if (activeTab === 'products' || activeTab === 'overview') {
      setProductsLoading(true);
    }
    if (activeTab === 'orders' || activeTab === 'overview' || activeTab === 'earnings') {
      setOrdersLoading(true);
    }
    if (activeTab === 'earnings' || activeTab === 'overview') {
      setSalesPerformanceLoading(true);
    }
    if (activeTab === 'overview') {
      setOverviewLoading(true);
      setTopProductsLoading(true);
      setOrderGraphLoading(true);
      setTopCategoriesLoading(true);
      setOrderComparisonLoading(true);
      setCustomerDemographicsLoading(true);
    }

    try {
      const response = await getVendorCategories();
      if (response.success) {
        setCategories(response.data?.data || response.data || []);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }

    if (activeTab === 'products' || activeTab === 'overview') {
      try {
        const response = await getVendorProducts();
        if (response.success) {
          const productList = response.data?.data || response.data || [];
          setProducts(productList);
        }
      } catch (error) { console.error(error); }
      finally { setProductsLoading(false); }
    }

    if (activeTab === 'orders' || activeTab === 'overview' || activeTab === 'earnings') {
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

    if (activeTab === 'earnings' || activeTab === 'overview') {
      try {
        const response = await getVendorSalesPerformance();
        if (response.success) {
          const salesList = response.data?.data || response.data || [];
          setSalesPerformance(Array.isArray(salesList) ? salesList : []);
        }
      } catch (error) {
        console.error("Sales performance fetch error:", error);
      } finally {
        setSalesPerformanceLoading(false);
      }
    }

    if (activeTab === 'overview') {
      try {
        const [overviewRes, topProdRes, graphRes, catRes, compRes, demoRes] = await Promise.allSettled([
          getVendorOverview(),
          getVendorTopProducts(),
          getVendorOrderGraph(graphDays),
          getVendorTopCategories(),
          getVendorOrderComparison(),
          getVendorCustomerDemographics()
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
        if (demoRes.status === 'fulfilled' && demoRes.value?.success) {
          const innerDemo = demoRes.value.data?.data || demoRes.value.data || [];
          setCustomerDemographics(Array.isArray(innerDemo) ? innerDemo : []);
        }
      } catch (error) {
        console.error("Overview dynamic fetch error:", error);
      } finally {
        setOverviewLoading(false);
        setTopProductsLoading(false);
        setOrderGraphLoading(false);
        setTopCategoriesLoading(false);
        setOrderComparisonLoading(false);
        setCustomerDemographicsLoading(false);
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

  const handleExportOrders = async () => {
    const loadingToast = toast.loading('Exporting orders...');
    try {
      const csvData = await exportVendorOrders();
      
      let csvContent = csvData;
      if (csvData && typeof csvData === 'object') {
        if (csvData.success === false) {
          throw new Error(csvData.message || 'Export failed');
        }
        csvContent = csvData.data || csvData.message || JSON.stringify(csvData);
      }
      
      if (!csvContent) {
        throw new Error('No order data found to export');
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vendor-orders-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss(loadingToast);
      toast.success('Orders exported successfully!');
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Failed to export orders:', error);
      toast.error(error.message || 'Failed to export orders');
    }
  };

  if (loading) return <div className={`min-h-screen flex items-center justify-center font-outfit uppercase font-bold text-gray-400 ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>Loading Dashboard...</div>;

  // Restrict dashboard access if vendor is not approved
  if (vendorData && vendorData.status !== 'APPROVED') {
    return (
      <div className={`min-h-screen font-outfit flex flex-col items-center justify-center p-6 text-center ${
        isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-800'
      }`}>
        <div className={`max-w-md w-full rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden border ${
          isDarkMode ? 'bg-gray-900 border-white/5' : 'bg-white border-gray-100'
        }`}>
          {/* Decorative gradients */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10 animate-pulse">
            <Store size={36} />
          </div>
          
          <div className="space-y-2">
            <h2 className={`text-2xl font-bold uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Approval Pending</h2>
            <p className="text-xs font-bold text-gray-400 uppercase ">Store: {vendorData.businessName}</p>
          </div>
          
          <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Your vendor application has been received and is currently under review by our administrator team. 
            Once approved, you will get full access to your vendor dashboard to list products and start selling!
          </p>
          
          <div className={`w-full rounded-2xl p-4 border flex items-center gap-4 text-left ${
            isDarkMode ? 'bg-gray-950 border-white/5' : 'bg-gray-50 border-gray-100'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase ">Current Status</p>
              <p className="text-sm font-extrabold text-amber-600 uppercase ">{vendorData.status || 'PENDING'}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-2xl font-bold uppercase text-xs transition-all shadow-lg shadow-primary/20 hover:opacity-95 active:opacity-90 cursor-pointer"
          >
            Logout & Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden font-outfit transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <VendorSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        vendorData={vendorData}
        handleLogout={handleLogout}
      />

      <div 
        ref={containerRef}
        className={`flex-grow flex flex-col h-screen overflow-y-scroll transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/30' : 'bg-gray-50'}`}
      >
        <header className={`h-24 flex-shrink-0 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 border-b transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-950/80 border-white/5 backdrop-blur text-white' : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <div className="flex items-center gap-4">
            <button className={`lg:hidden p-2 rounded-lg transition-all ${
              isDarkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-550 hover:bg-gray-50'
            }`} onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className={`text-lg lg:text-xl font-bold capitalize ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{activeTab}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-9 pr-4 py-1.5 border-none rounded-lg text-xs font-bold outline-none w-48 lg:w-64 transition-all ${
                  isDarkMode ? 'bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/20' : 'bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary/10'
                }`}
              />
            </div>

            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-xl transition-all border ${
                isDarkMode ? 'bg-white/5 text-primary border-white/5 shadow-xl shadow-primary/10' : 'bg-gray-50 text-primary border-transparent hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/20">
              {vendorData?.businessName?.charAt(0) || 'V'}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <div className={activeTab === 'overview' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <VendorOverview
              isDarkMode={isDarkMode}
              overviewLoading={overviewLoading}
              overviewData={overviewData}
              graphDays={graphDays}
              setGraphDays={setGraphDays}
              orderGraphLoading={orderGraphLoading}
              orderGraphData={orderGraphData}
              topProducts={topProducts}
              topProductsLoading={topProductsLoading}
              topCategories={topCategories}
              topCategoriesLoading={topCategoriesLoading}
              orderComparison={orderComparison}
              orderComparisonLoading={orderComparisonLoading}
              getImageUrl={getImageUrl}
              formatCurrency={formatCurrency}
              customerDemographics={customerDemographics}
              customerDemographicsLoading={customerDemographicsLoading}
            />
          </div>

          <div className={activeTab === 'products' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <VendorProducts
              isDarkMode={isDarkMode}
              products={products}
              productsLoading={productsLoading}
              getImageUrl={getImageUrl}
              onAddProduct={() => {
                setIsEditingProduct(false);
                setIsViewingProduct(false);
                setCurrentProductId(null);
                setShowProductModal(true);
              }}
              onViewProduct={handleViewProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>

          <div className={activeTab === 'orders' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <VendorOrders
              isDarkMode={isDarkMode}
              orders={orders}
              ordersLoading={ordersLoading}
              onViewOrder={(order) => {
                setCurrentOrder(order);
                setShowOrderModal(true);
              }}
              onExportOrders={handleExportOrders}
            />
          </div>

          <div className={activeTab === 'earnings' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            <VendorEarnings
              isDarkMode={isDarkMode}
              overviewData={overviewData}
              salesPerformance={salesPerformance}
              salesPerformanceLoading={salesPerformanceLoading}
              orders={orders}
              ordersLoading={ordersLoading}
              onViewOrder={(order) => {
                setCurrentOrder(order);
                setShowOrderModal(true);
              }}
              formatCurrency={formatCurrency}
            />
          </div>

          <div className={activeTab === 'profile' ? 'block animate-in fade-in duration-300' : 'hidden'}>
            {vendorData && (
              <VendorProfile
                isDarkMode={isDarkMode}
                vendorData={vendorData}
                getImageUrl={getImageUrl}
                onEditProfile={() => setShowEditModal(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals Portals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialData={vendorData}
        onSuccess={fetchVendorData}
      />

      <ProductModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setIsEditingProduct(false);
          setIsViewingProduct(false);
          setCurrentProductId(null);
        }}
        isEditing={isEditingProduct}
        isViewing={isViewingProduct}
        productId={currentProductId}
        onSuccess={fetchProductsAndCategories}
        getImageUrl={getImageUrl}
        categories={categories}
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
