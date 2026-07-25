import React, { useState, useEffect } from 'react';
import {
  getQuickVendorDashboard,
  updateQuickVendorConfig,
  getVendorQuickOrders,
  updateVendorOrderStatus,
  assignDeliveryPerson,
  cancelVendorQuickOrder,
  registerDeliveryPerson,
  getVendorDeliveryPersons,
  updateVendorDeliveryPerson,
  deleteVendorDeliveryPerson,
  getVendorDeliveryPersonDetails
} from '../../api/quickECommerceService';
import Swal from 'sweetalert2';
import { toast } from '../../utils/toast';

// Sub-components
import VendorStatsOverview from './components/VendorStatsOverview';
import VendorShopConfig from './components/VendorShopConfig';
import VendorRidersRoster from './components/VendorRidersRoster';
import VendorOrdersPipeline from './components/VendorOrdersPipeline';
import VendorOrderDetailsModal from './components/VendorOrderDetailsModal';
import VendorRiderAssignModal from './components/VendorRiderAssignModal';
import VendorRiderMetricsModal from './components/VendorRiderMetricsModal';

const VendorFlow = () => {
  // Stats states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);

  // Modal & Pagination states
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  // Config states
  const [enabled, setEnabled] = useState(false);
  const [acceptingOrders, setAcceptingOrders] = useState(false);
  const [serviceRadius, setServiceRadius] = useState(5);
  const [maxConcurrentOrders, setMaxConcurrentOrders] = useState(20);
  const [defaultPreparationTime, setDefaultPreparationTime] = useState(10);

  // Onboarding Rider States
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [riderEmail, setRiderEmail] = useState('');
  const [riderPassword, setRiderPassword] = useState('');
  const [riderAadhar, setRiderAadhar] = useState('');
  const [riderVehicleType, setRiderVehicleType] = useState('motorcycle');
  const [riderVehicleNumber, setRiderVehicleNumber] = useState('');
  const [riderPhoto, setRiderPhoto] = useState(null);
  const [showRiderPassword, setShowRiderPassword] = useState(false);

  // Editing & Viewing Rider States
  const [editingRider, setEditingRider] = useState(null);
  const [viewingRider, setViewingRider] = useState(null);
  const [riderStatus, setRiderStatus] = useState('AVAILABLE');
  const [loadingRiderDetails, setLoadingRiderDetails] = useState(false);

  // Active status tabs
  const [activeOrderTab, setActiveOrderTab] = useState('ALL');
  const [showRiderForm, setShowRiderForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assigningOrderId, setAssigningOrderId] = useState(null);

  // Initialize
  useEffect(() => {
    fetchDashboard();
    fetchOrdersList();
    fetchRidersList();
  }, [activeOrderTab]);

  const fetchDashboard = async () => {
    try {
      const res = await getQuickVendorDashboard();
      const data = res?.data || res;
      if (data) {
        setStats(data?.stats || data);
        if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          setOrders(data.orders);
        }
        const config = data.config || data;
        if (config.enabled !== undefined) setEnabled(config.enabled);
        if (config.acceptingOrders !== undefined) setAcceptingOrders(config.acceptingOrders);
        if (config.serviceRadius !== undefined) setServiceRadius(config.serviceRadius);
        if (config.maxConcurrentOrders !== undefined) setMaxConcurrentOrders(config.maxConcurrentOrders);
        if (config.defaultPreparationTime !== undefined) setDefaultPreparationTime(config.defaultPreparationTime);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = () => {
    fetchDashboard();
    fetchOrdersList();
    fetchRidersList();
  };

  const fetchOrdersList = async () => {
    setLoading(true);
    try {
      const statusFilter = activeOrderTab === 'ALL' ? '' : activeOrderTab;
      const res = await getVendorQuickOrders(1, 50, statusFilter);
      const ordersList = res?.data?.orders || res?.orders || (Array.isArray(res?.data) ? res.data : null);
      if (Array.isArray(ordersList) && ordersList.length > 0) {
        setOrders(ordersList);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRidersList = async () => {
    try {
      const res = await getVendorDeliveryPersons(1, 50);
      if (res?.success) {
        setRiders(res.data?.deliveryPersons || res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Quick Commerce configurations
  const handleSaveConfig = async () => {
    try {
      const res = await updateQuickVendorConfig({
        enabled,
        acceptingOrders,
        serviceRadius,
        maxConcurrentOrders,
        defaultPreparationTime
      });
      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Settings Saved!',
          text: `Quick Commerce is now ${enabled ? 'ONLINE' : 'OFFLINE'}.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire('Save Failed', res?.message || 'Could not save settings. Try again.', 'error');
        fetchDashboard();
      }
    } catch (err) {
      console.error('Save config error:', err);
      Swal.fire('Error', 'Network error. Please try again.', 'error');
      fetchDashboard();
    }
  };

  // Status transitions
  const handleUpdateOrderStatus = async (orderId, targetStatus) => {
    try {
      const res = await updateVendorOrderStatus(orderId, { status: targetStatus });
      if (res?.success) {
        Swal.fire('Updated', `Order status set to ${targetStatus}`, 'success');
        fetchOrdersList();
      } else {
        Swal.fire('Error', res.message || 'Status transition failed', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const { value: reason } = await Swal.fire({
        title: 'Cancel Order',
        input: 'text',
        inputLabel: 'Reason for cancellation',
        inputPlaceholder: 'Enter vendor rejection reason...',
        showCancelButton: true
      });

      if (reason) {
        const res = await cancelVendorQuickOrder(orderId, reason);
        if (res?.success) {
          Swal.fire('Order Cancelled', 'Rejection notification sent to customer', 'success');
          fetchOrdersList();
          fetchDashboard();
        } else {
          Swal.fire('Failed', res.message || 'Could not reject order', 'error');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Assign Rider
  const handleAssignRider = async (orderId, deliveryPersonId) => {
    try {
      const targetId = typeof deliveryPersonId === 'object' && deliveryPersonId !== null
        ? (deliveryPersonId.deliveryPersonId || deliveryPersonId._id || deliveryPersonId.id)
        : deliveryPersonId;
      const res = await assignDeliveryPerson(orderId, targetId);
      if (res?.success) {
        Swal.fire('Rider Dispatched!', 'Delivery partner has been assigned to this order', 'success');
        setAssigningOrderId(null);
        fetchOrdersList();
      } else {
        Swal.fire('Assignment Failed', res.message || 'Could not assign delivery partner', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Rider Roster Helper Methods
  const resetRiderForm = () => {
    setRiderName('');
    setRiderPhone('');
    setRiderEmail('');
    setRiderPassword('');
    setShowRiderPassword(false);
    setRiderAadhar('');
    setRiderVehicleNumber('');
    setRiderVehicleType('motorcycle');
    setRiderStatus('AVAILABLE');
    setRiderPhoto(null);
    setEditingRider(null);
    setShowRiderForm(false);
  };

  const handleOpenAddRider = () => {
    resetRiderForm();
    setShowRiderForm(true);
  };

  const handleOpenEditRider = (rider) => {
    setEditingRider(rider);
    setRiderName(rider.name || '');
    setRiderPhone(rider.phone || '');
    setRiderEmail(rider.userId?.email || rider.email || '');
    setRiderPassword('');
    setRiderAadhar(rider.aadharNumber || '');
    setRiderVehicleType(rider.vehicleType || 'motorcycle');
    setRiderVehicleNumber(rider.vehicleNumber || '');
    setRiderStatus(rider.status || 'AVAILABLE');
    setRiderPhoto(null);
    setShowRiderForm(true);
  };

  const handleSaveRiderSubmit = async (e) => {
    e.preventDefault();
    if (!riderName || !riderPhone) {
      Swal.fire('Required Fields', 'Please fill in rider name and phone number.', 'warning');
      return;
    }

    try {
      const form = new FormData();
      form.append('name', riderName);
      form.append('phone', riderPhone);
      if (riderEmail) form.append('email', riderEmail);
      if (riderPassword) form.append('password', riderPassword);
      if (riderAadhar) form.append('aadharNumber', riderAadhar);
      if (riderVehicleType) form.append('vehicleType', riderVehicleType);
      if (riderVehicleNumber) form.append('vehicleNumber', riderVehicleNumber);
      if (riderStatus) form.append('status', riderStatus);
      if (riderPhoto) form.append('profilePhoto', riderPhoto);

      let res;
      if (editingRider) {
        res = await updateVendorDeliveryPerson(editingRider._id, form);
        if (res?._id || res?.success || res?.status === 200 || res?.name) {
          toast.success('Rider details updated successfully!');
          resetRiderForm();
          fetchRidersList();
        } else {
          Swal.fire('Update Failed', res.message || 'Could not update rider details', 'error');
        }
      } else {
        if (!riderEmail || !riderPassword || !riderAadhar) {
          Swal.fire('Required Fields', 'Please fill in all core credentials (email, password, aadhar).', 'warning');
          return;
        }
        res = await registerDeliveryPerson(form);
        if (res?.success || res?._id) {
          Swal.fire({
            icon: 'success',
            title: 'Express Rider Registered!',
            html: `<b>${riderName}</b> can now log in to Rider Dashboard!<br/><br/><div style="text-align:left; background:#f8fafc; padding:12px; border-radius:12px; font-family:monospace;"><b>Login Page:</b> /auth<br/><b>Email:</b> ${riderEmail}<br/><b>Password:</b> ${riderPassword}</div>`,
            confirmButtonColor: '#da016a'
          });
          resetRiderForm();
          fetchRidersList();
        } else {
          Swal.fire('Failed to Onboard', res.message || 'Check credentials and duplicate emails', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving rider');
    }
  };

  const handleDeleteRider = async (rider) => {
    const result = await Swal.fire({
      title: `Deboard ${rider.name}?`,
      text: "This rider will be removed from your store's delivery roster.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Deboard Rider'
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteVendorDeliveryPerson(rider._id);
        if (res?.message || res?.success) {
          toast.success(`${rider.name} deboarded successfully.`);
          fetchRidersList();
        } else {
          Swal.fire('Failed', res?.message || 'Failed to delete rider', 'error');
        }
      } catch (err) {
        console.error(err);
        toast.error('Network error deboarding rider');
      }
    }
  };

  const handleViewRiderDetails = async (riderId) => {
    setLoadingRiderDetails(true);
    try {
      const res = await getVendorDeliveryPersonDetails(riderId);
      const data = res?.data || res;
      if (data) {
        setViewingRider(data);
      } else {
        toast.error('Could not fetch rider metrics');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load rider details');
    } finally {
      setLoadingRiderDetails(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getItemImage = (item) => {
    if (!item) return null;

    const extractUrl = (val) => {
      if (!val) return null;
      if (typeof val === 'string') return val;
      if (typeof val === 'object') {
        if (val.url) return val.url;
        if (val.path) return val.path;
      }
      return null;
    };

    let raw = extractUrl(item.productImage) 
      || extractUrl(item.image) 
      || extractUrl(item.thumbnail) 
      || (Array.isArray(item.images) ? extractUrl(item.images[0]) : null);

    if (!raw && item.variantId && typeof item.variantId === 'object') {
      raw = extractUrl(item.variantId.thumbnail)
        || (Array.isArray(item.variantId.images) ? extractUrl(item.variantId.images[0]) : null);
    }

    if (!raw && item.productId && typeof item.productId === 'object') {
      raw = extractUrl(item.productId.thumbnail) 
        || (Array.isArray(item.productId.images) ? extractUrl(item.productId.images[0]) : null) 
        || (Array.isArray(item.productId.variants) ? (
            extractUrl(item.productId.variants[0]?.thumbnail) || 
            (Array.isArray(item.productId.variants[0]?.images) ? extractUrl(item.productId.variants[0]?.images[0]) : null)
          ) : null);
    }

    if (!raw) return null;

    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.0.102:9000';
    const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
    return `${baseUrl}${raw.startsWith('/') ? '' : '/'}${raw}`;
  };

  const orderStatuses = [
    { code: 'ALL', label: 'All Orders' },
    { code: 'PREPARING', label: 'Preparing / Active' },
    { code: 'WAITING_FOR_DELIVERY_BOY', label: 'Ready for Rider' },
    { code: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { code: 'DELIVERED', label: 'Completed' },
    { code: 'CANCELLED', label: 'Rejections' }
  ];

  return (
    <div className="bg-white shadow-xl rounded-3xl border border-slate-100 p-6 md:p-8">
      {/* 1. Metrics Overview Cards */}
      <VendorStatsOverview
        stats={stats}
        orders={orders}
        riders={riders}
        enabled={enabled}
      />

      {/* Main Grid: Left Settings / Roster, Right Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configurations & Onboarding (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8 text-left">
          {/* 2. Shop Configuration */}
          <VendorShopConfig
            enabled={enabled}
            setEnabled={setEnabled}
            acceptingOrders={acceptingOrders}
            setAcceptingOrders={setAcceptingOrders}
            serviceRadius={serviceRadius}
            setServiceRadius={setServiceRadius}
            maxConcurrentOrders={maxConcurrentOrders}
            defaultPreparationTime={defaultPreparationTime}
            setDefaultPreparationTime={setDefaultPreparationTime}
            handleSaveConfig={handleSaveConfig}
          />

          {/* 3. Riders Roster */}
          <VendorRidersRoster
            riders={riders}
            showRiderForm={showRiderForm}
            setShowRiderForm={setShowRiderForm}
            editingRider={editingRider}
            riderName={riderName}
            setRiderName={setRiderName}
            riderPhone={riderPhone}
            setRiderPhone={setRiderPhone}
            riderEmail={riderEmail}
            setRiderEmail={setRiderEmail}
            riderPassword={riderPassword}
            setRiderPassword={setRiderPassword}
            showRiderPassword={showRiderPassword}
            setShowRiderPassword={setShowRiderPassword}
            riderAadhar={riderAadhar}
            setRiderAadhar={setRiderAadhar}
            riderVehicleType={riderVehicleType}
            setRiderVehicleType={setRiderVehicleType}
            riderVehicleNumber={riderVehicleNumber}
            setRiderVehicleNumber={setRiderVehicleNumber}
            riderStatus={riderStatus}
            setRiderStatus={setRiderStatus}
            riderPhoto={riderPhoto}
            setRiderPhoto={setRiderPhoto}
            handleSaveRiderSubmit={handleSaveRiderSubmit}
            handleOpenAddRider={handleOpenAddRider}
            handleOpenEditRider={handleOpenEditRider}
            handleDeleteRider={handleDeleteRider}
            handleViewRiderDetails={handleViewRiderDetails}
            resetRiderForm={resetRiderForm}
          />
        </div>

        {/* 4. Incoming Orders Manager (8 cols) */}
        <VendorOrdersPipeline
          orders={orders}
          activeOrderTab={activeOrderTab}
          setActiveOrderTab={setActiveOrderTab}
          orderStatuses={orderStatuses}
          loading={loading}
          handleRefresh={handleRefresh}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
          handleCancelOrder={handleCancelOrder}
          setSelectedOrderModal={setSelectedOrderModal}
          setAssigningOrderId={setAssigningOrderId}
          formatDate={formatDate}
          getItemImage={getItemImage}
        />
      </div>

      {/* 5. Order Details Modal */}
      <VendorOrderDetailsModal
        selectedOrderModal={selectedOrderModal}
        setSelectedOrderModal={setSelectedOrderModal}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
        formatDate={formatDate}
        getItemImage={getItemImage}
      />

      {/* 6. Rider Assignment Modal */}
      <VendorRiderAssignModal
        assigningOrderId={assigningOrderId}
        setAssigningOrderId={setAssigningOrderId}
        orders={orders}
        riders={riders}
        handleAssignRider={handleAssignRider}
      />

      {/* 7. Rider Performance Metrics Modal */}
      <VendorRiderMetricsModal
        viewingRider={viewingRider}
        setViewingRider={setViewingRider}
        formatDate={formatDate}
      />
    </div>
  );
};

export default VendorFlow;
