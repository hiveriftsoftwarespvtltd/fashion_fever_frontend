import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Package, 
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Truck,
  Loader2,
  DollarSign,
  Tag,
  ArrowLeft
} from 'lucide-react';
import UserSidebar from './UserSidebar';
import { getUserOrders } from '../../api/authService';
import { toast } from '../../utils/toast';
import apiClient from '../../api/apiClient';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [productDetails, setProductDetails] = useState({});

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await getUserOrders();
      if (res?.success) {
        const list = res.data?.data ?? res.data ?? [];
        setOrders(Array.isArray(list) ? list : []);
      } else {
        toast.error(res?.message || 'Failed to load order history.');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('An error occurred while fetching your orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    // Gather all unique product IDs from orders
    const productIds = new Set();
    orders.forEach(order => {
      order.vendorOrders?.forEach(vendorOrd => {
        vendorOrd.items?.forEach(item => {
          const pId = item.productId?._id || item.productId;
          if (pId && typeof pId === 'string') {
            productIds.add(pId);
          }
        });
      });
    });

    const uniqueProductIds = Array.from(productIds);
    if (uniqueProductIds.length === 0) return;

    // Fetch product details for all unique product IDs
    const fetchAllDetails = async () => {
      const detailsMap = { ...productDetails };
      let updated = false;

      // We only fetch product details that we don't already have in productDetails
      const toFetch = uniqueProductIds.filter(pId => !detailsMap[pId]);
      if (toFetch.length === 0) return;

      try {
        const fetchPromises = toFetch.map(async (pId) => {
          try {
            const response = await apiClient.get(`/public-user/product-details/${pId}`);
            const product = response?.data?.data?.data || response?.data?.data;
            return { pId, product };
          } catch (err) {
            console.error(`Failed to load product details for ${pId}:`, err);
            return { pId, product: null };
          }
        });

        const results = await Promise.all(fetchPromises);
        results.forEach(({ pId, product }) => {
          if (product) {
            detailsMap[pId] = product;
            updated = true;
          }
        });

        if (updated) {
          setProductDetails(detailsMap);
        }
      } catch (err) {
        console.error("Error fetching product details for orders list:", err);
      }
    };

    fetchAllDetails();
  }, [orders]);

  const getVariantImage = (item) => {
    const pId = item.productId?._id || item.productId;
    const vId = item.variantId?._id || item.variantId;
    
    if (pId && vId && productDetails[pId]) {
      const product = productDetails[pId];
      const variant = product.variants?.find(v => v._id === vId);
      if (variant) {
        if (variant.thumbnail?.url) return variant.thumbnail.url;
        if (typeof variant.thumbnail === 'string') return variant.thumbnail;
        if (variant.images?.[0]?.url) return variant.images[0].url;
        if (typeof variant.images?.[0] === 'string') return variant.images[0];
      }
    }
    
    // Fallbacks if not yet loaded or not found
    if (item.variantId?.thumbnail?.url) return item.variantId.thumbnail.url;
    if (typeof item.variantId?.thumbnail === 'string' && !item.variantId.thumbnail.match(/^[0-9a-fA-F]{24}$/)) {
      return item.variantId.thumbnail;
    }
    if (item.variantId?.images?.[0]?.url) return item.variantId.images[0].url;
    if (typeof item.variantId?.images?.[0] === 'string' && !item.variantId.images[0].match(/^[0-9a-fA-F]{24}$/)) {
      return item.variantId.images[0];
    }
    
    return 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=100&h=100&fit=crop';
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    switch (s) {
      case 'delivered':
        return (
          <span className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 self-start">
            <CheckCircle2 size={12} className="stroke-[2.5]" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 self-start animate-pulse">
            <Truck size={12} className="stroke-[2.5]" /> Shipped
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-50 text-red-500 border border-red-100 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 self-start">
            <AlertCircle size={12} className="stroke-[2.5]" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 self-start">
            <Clock size={12} className="stroke-[2.5]" /> Processing
          </span>
        );
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.orderStatus?.toLowerCase() === activeTab;
  });

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 font-outfit text-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 italic">My Orders</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <UserSidebar />

          {/* Right Content */}
          <div className="flex-grow space-y-6">
            
            {/* Header section with modern tab navigation */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 text-left space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase block">Purchase History</span>
                  <h1 className="text-2xl font-black uppercase text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="text-primary stroke-[2.5]" size={24} /> My Orders
                  </h1>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100 self-start">
                  Total Orders: {orders.length}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-100 pb-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All Purchases' },
                  { id: 'pending', label: 'Processing' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'cancelled', label: 'Cancelled' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-4 text-xs font-black uppercase tracking-wider relative transition-all cursor-pointer ${
                      activeTab === tab.id 
                        ? 'text-primary' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full animate-in slide-in-from-bottom-2 duration-300"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Orders List container */}
            {isLoading ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={36} />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Hydrating Orders Pipeline...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-16 text-center space-y-6">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto text-primary border border-primary/10">
                  <Package size={28} className="stroke-[2.5]" />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h3 className="text-base font-extrabold uppercase text-gray-800">No Orders Found</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase leading-relaxed">
                    {activeTab === 'all' 
                      ? "You haven't placed any orders yet on WakeUp Makeup." 
                      : `You have no ${activeTab} orders at this moment.`}
                  </p>
                </div>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase px-6 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Explore cosmetics shop <ChevronRight size={14} className="stroke-[3]" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div 
                    key={order._id} 
                    className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 overflow-hidden text-left flex flex-col transition-all hover:shadow-gray-200/50"
                  >
                    
                    {/* Order Metadata Header Card */}
                    <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase block">Order Number</span>
                        <code className="text-xs font-black text-gray-900 uppercase tracking-tight">{order.orderNumber}</code>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase block">Placed On</span>
                        <span className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                          <Calendar size={12} className="text-gray-400" />
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase block">Final Total</span>
                        <span className="text-xs font-black text-primary">₹{(order.grandTotal || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col gap-1 items-start md:items-end justify-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase block md:hidden">Status</span>
                        {getStatusBadge(order.orderStatus)}
                      </div>
                    </div>

                    {/* Order items, address & pipeline summary body */}
                    <div className="p-6 md:p-8 space-y-6">
                      
                      {/* Items loop */}
                      <div className="space-y-5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Ordered Products</p>
                        
                        <div className="space-y-4">
                          {order.vendorOrders?.map((vendorOrd) => 
                            vendorOrd.items?.map((item, idx) => {
                              const color = item.attributes?.color || item.attributes?.Color;
                              const size = item.attributes?.size || item.attributes?.Size;
                              return (
                                <div key={item._id || idx} className="flex gap-4 items-start group pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden relative">
                                    <img 
                                      src={getVariantImage(item)} 
                                      alt="" 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=100&h=100&fit=crop'; }}
                                    />
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <span className="text-[9px] font-black uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md mb-1 inline-block">
                                      SKU: {item.sku || 'N/A'}
                                    </span>
                                    <h4 className="text-xs font-black text-gray-800 uppercase truncate leading-snug">{item.productName || 'Cosmetics Item'}</h4>
                                    {(color || size) && (
                                      <p className="text-[9px] font-black text-primary uppercase mt-0.5">
                                        {color && `Color: ${color}`} {size && `• Size: ${size}`}
                                      </p>
                                    )}
                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                                      Qty: {item.quantity} • <span className="text-gray-800 font-extrabold">₹{(item.salesPrice || 0).toLocaleString()}</span>
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <span className="text-xs font-black text-gray-800">₹{(item.finalPrice || (item.salesPrice * item.quantity)).toLocaleString()}</span>
                                    {item.discountAmount > 0 && (
                                      <p className="text-[8px] font-bold text-green-500 uppercase mt-0.5">Save ₹{item.discountAmount}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Flex grid containing Shipping Address and Pricing Summary details */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-gray-100">
                        
                        {/* Shipping Destination */}
                        <div className="md:col-span-7 bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50 space-y-3">
                          <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin size={12} className="text-primary" /> Delivery Destination
                          </h5>
                          <div className="text-xs text-gray-600 font-bold uppercase leading-relaxed space-y-1">
                            <p className="text-gray-800 font-black">{order.shippingAddress?.phone}</p>
                            <p>{order.shippingAddress?.line1}</p>
                            {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
                            <p className="text-gray-800 font-extrabold">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                            <p className="text-gray-400">{order.shippingAddress?.country || 'India'}</p>
                          </div>
                        </div>

                        {/* Order Calculation Side */}
                        <div className="md:col-span-5 bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50 space-y-2.5 text-xs font-bold text-gray-400 uppercase">
                          <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-2">Invoice Summary</h5>
                          
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-gray-800">₹{(order.subTotal || 0).toLocaleString()}</span>
                          </div>
                          
                          {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span className="flex items-center gap-1">
                                <Tag size={10} /> Coupon ({order.appliedCoupon?.code || 'COUPON'})
                              </span>
                              <span>-₹{(order.discount || 0).toLocaleString()}</span>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span>Shipping Charge</span>
                            <span className="text-gray-800 font-extrabold">₹{(order.shippingCharge || 0).toLocaleString()}</span>
                          </div>

                          {order.codCharge > 0 && (
                            <div className="flex justify-between">
                              <span>COD Pipeline Charge</span>
                              <span className="text-gray-800 font-extrabold">₹{(order.codCharge || 0).toLocaleString()}</span>
                            </div>
                          )}

                          <div className="h-[1px] bg-gray-200/60 my-2"></div>

                          <div className="flex justify-between items-baseline text-sm font-black text-gray-900">
                            <span className="text-[10px] font-black text-gray-400 uppercase">Grand Total</span>
                            <span className="text-base text-primary">₹{(order.grandTotal || 0).toLocaleString()}</span>
                          </div>

                          <div className="flex items-center justify-between text-[9px] font-black uppercase pt-1 border-t border-gray-200/40">
                            <span className="flex items-center gap-1"><CreditCard size={10} className="text-gray-400" /> {order.paymentMethod === 'CashOnDelivery' ? 'COD' : order.paymentMethod || 'COD'}</span>
                            <span className={`px-2 py-0.5 rounded ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                              {order.paymentStatus || 'pending'}
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Orders;
