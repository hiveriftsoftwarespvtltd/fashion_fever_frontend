import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, FileText, ShoppingBag, CreditCard, Tag, Landmark, ShieldCheck } from 'lucide-react';
import { updateVendorOrder } from '../../api/vendorService';
import { toast } from '../../utils/toast';

/**
 * Premium Vendor Order Details / Invoice Modal
 * Displays complete order logs, customer details, and payout distributions.
 * Includes interactive order updating panels (PUT `/vendor/update-order/:orderId`).
 */
const VendorOrderDetailsModal = ({ isOpen, onClose, order, onUpdate }) => {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setCurrentOrder(order);
    if (order) {
      setOrderStatus(order.orderStatus || 'pending');
      setPaymentStatus(order.paymentStatus || 'pending');
      setTrackingId(order.trackingId || '');
      setCancellationReason(order.cancellationReason || '');
    }
  }, [order]);

  if (!isOpen || !currentOrder) return null;

  // Formatting currency in Indian Rupees (INR)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'shipped':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'delivered':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const dateVal = currentOrder.createdAt || currentOrder.dateOfPurchase;
  const dateObj = dateVal ? new Date(dateVal) : null;
  const isDateValid = dateObj && !isNaN(dateObj.getTime());

  const handleUpdateStatus = async () => {
    setUpdating(true);
    const loadingToast = toast.loading('Updating order status...');
    try {
      const res = await updateVendorOrder(currentOrder._id, {
        orderStatus,
        paymentStatus,
        trackingId,
        cancellationReason
      });
      toast.dismiss(loadingToast);
      if (res.success) {
        toast.success(res.message || 'Order updated successfully!');
        
        // Extract updated object matching backend double-nested payload structure
        const updatedObj = res.data?.data || res.data || res.order;
        if (updatedObj) {
          setCurrentOrder(updatedObj);
        } else {
          setCurrentOrder(prev => ({
            ...prev,
            orderStatus,
            paymentStatus,
            trackingId,
            cancellationReason
          }));
        }
        
        if (onUpdate) onUpdate();
      } else {
        toast.error(res.message || 'Failed to update order status.');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error('Something went wrong.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-outfit text-left">
      <div className="w-full max-w-2xl my-auto bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
        
        <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto space-y-6">
          {/* Modal Header */}
          <div className="flex justify-between items-start border-b pb-4 border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20 shadow-inner">
                <ShoppingBag className="text-primary" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight text-gray-900">{currentOrder.orderNumber}</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 flex items-center gap-1">
                  <Calendar size={10} /> {isDateValid ? dateObj.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl transition-all hover:scale-105 hover:bg-gray-50 text-gray-400 hover:text-gray-800 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Quick Payout Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-green-100 bg-green-50/20">
              <p className="text-[10px] font-bold text-green-600 uppercase mb-1 flex items-center gap-1">
                <Landmark size={10} /> Vendor Payout
              </p>
              <span className="text-lg font-extrabold text-green-600">
                {formatCurrency(currentOrder.payoutAmount || 0)}
              </span>
            </div>
            <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/20">
              <p className="text-[10px] font-bold text-purple-600 uppercase mb-1 flex items-center gap-1">
                <Tag size={10} /> Commission Rate
              </p>
              <span className="text-base font-bold text-purple-600">
                {currentOrder.commissionRate || 0}%
              </span>
              <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">
                Fee: {formatCurrency(currentOrder.commissionAmount || 0)}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Order Status</p>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${getOrderStatusColor(currentOrder.orderStatus)}`}>
                {currentOrder.orderStatus || 'Pending'}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="p-5 rounded-3xl border border-gray-100 bg-gray-50/30">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
                <MapPin size={12} /> Shipping Address
              </p>
              {currentOrder.shippingAddress ? (
                <div className="text-xs space-y-1 text-gray-600 font-medium">
                  <p className="text-sm font-bold mb-1 text-gray-800">Phone: {currentOrder.shippingAddress.phone}</p>
                  <p>{currentOrder.shippingAddress.line1}</p>
                  {currentOrder.shippingAddress.line2 && <p>{currentOrder.shippingAddress.line2}</p>}
                  <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}</p>
                  <p className="uppercase font-bold text-[10px] text-primary tracking-wider mt-1">{currentOrder.shippingAddress.country || 'India'}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-400">No shipping address recorded.</p>
              )}
            </div>

            {/* Customer Details */}
            <div className="p-5 rounded-3xl border border-gray-100 bg-gray-50/30 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
                  <ShieldCheck size={12} /> Customer Identity
                </p>
                {currentOrder.userId ? (
                  <div className="text-xs space-y-1 text-gray-600 font-medium">
                    <p className="text-sm font-bold text-gray-800">
                      {typeof currentOrder.userId === 'object' ? (currentOrder.userId.name || 'User') : 'User'}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-mono">
                      {typeof currentOrder.userId === 'object' ? currentOrder.userId.email : currentOrder.userId}
                    </p>
                    {typeof currentOrder.userId === 'object' && currentOrder.userId.role && (
                      <p className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-500 inline-block mt-2">
                        Role: {currentOrder.userId.role}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Anonymous Customer</p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-400 uppercase text-[9px]">Payment Status</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${currentOrder.paymentStatus === 'paid' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                  {currentOrder.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Order Items</p>
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b text-[9px] font-bold uppercase text-gray-400 bg-gray-50">
                    <th className="p-3">Product Name</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentOrder.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50">
                      <td className="p-3 font-outfit">
                        <span className="font-bold text-gray-800">{item.productName}</span>
                        {item.sku && <p className="text-[9px] text-gray-400 font-mono mt-0.5">SKU: {item.sku}</p>}
                        {item.attributes && (
                          <div className="flex gap-2 mt-1">
                            {Object.entries(item.attributes).map(([key, val]) => (
                              <span key={key} className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] text-gray-500 uppercase font-semibold">
                                {key}: {val}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold text-gray-600">{item.quantity}</td>
                      <td className="p-3 text-right font-medium text-gray-600">{formatCurrency(item.salesPrice || item.price || 0)}</td>
                      <td className="p-3 text-right font-bold text-primary">{formatCurrency(item.totalPrice || ((item.salesPrice || item.price || 0) * (item.quantity || 0)))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Applied Coupon Info */}
          {currentOrder.orderId?.appliedCoupon && currentOrder.orderId.appliedCoupon.code && (
            <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                  <Tag size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Coupon {currentOrder.orderId.appliedCoupon.code}</span>
                  <p className="text-[9px] text-gray-400 uppercase mt-0.5">Discount Scheme: {currentOrder.orderId.appliedCoupon.couponType || 'Fixed'}</p>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-purple-600">- {formatCurrency(currentOrder.orderId.appliedCoupon.discountAmount)}</span>
                <p className="text-[9px] text-gray-400 uppercase mt-0.5">Discount Applied</p>
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="p-5 rounded-3xl border border-gray-100 bg-gray-50/30 space-y-3">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span className="font-bold">{formatCurrency(currentOrder.subTotal || 0)}</span>
            </div>
            {(currentOrder.discount || 0) > 0 && (
              <div className="flex justify-between text-xs text-purple-600 font-semibold">
                <span>Discounts</span>
                <span className="font-bold">- {formatCurrency(currentOrder.discount || 0)}</span>
              </div>
            )}
            {(currentOrder.shippingCharge || 0) > 0 && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>Shipping Fee</span>
                <span className="font-bold">{formatCurrency(currentOrder.shippingCharge || 0)}</span>
              </div>
            )}
            {(currentOrder.tax || 0) > 0 && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>Calculated Tax (GST)</span>
                <span className="font-bold">{formatCurrency(currentOrder.tax || 0)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-100 text-sm">
              <span className="font-bold text-gray-800">Grand Total</span>
              <span className="font-bold text-primary text-base">{formatCurrency(currentOrder.grandTotal || 0)}</span>
            </div>
          </div>

          {/* Action / Update Panel */}
          <div className="p-5 rounded-3xl border border-primary/10 bg-primary/5 space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Landmark size={12} /> Manage Order Actions
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Order Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none text-gray-700"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none text-gray-700"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Tracking ID input (only show if status is shipped or delivered) */}
            {(orderStatus === 'shipped' || orderStatus === 'delivered') && (
              <div className="animate-in slide-in-from-top-2 duration-150">
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Tracking ID</label>
                <input
                  type="text"
                  placeholder="Enter courier tracking ID..."
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            )}

            {/* Cancellation Reason input (only show if status is cancelled) */}
            {orderStatus === 'cancelled' && (
              <div className="animate-in slide-in-from-top-2 duration-150">
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Cancellation Reason</label>
                <textarea
                  placeholder="Reason for cancellation..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows="2"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>
            )}

            <button
              onClick={handleUpdateStatus}
              disabled={updating}
              className="w-full py-2.5 bg-primary hover:bg-primary/95 disabled:bg-gray-300 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-primary/10 hover:opacity-95 active:opacity-90 cursor-pointer text-center"
            >
              {updating ? 'Saving Changes...' : 'Save Order & Payout Status'}
            </button>
          </div>

          <button onClick={onClose} className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold text-xs uppercase transition-all cursor-pointer text-center">
            Dismiss Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorOrderDetailsModal;
