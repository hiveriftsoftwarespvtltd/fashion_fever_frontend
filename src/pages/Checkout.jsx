import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ChevronRight,
  ShieldCheck,
  Lock,
  MapPin,
  Check,
  User,
  ShoppingBag,
  Loader2,
  Truck,
  Wallet
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWallet } from '../context/WalletContext';
import { getCartDetails, getCoupons, validateCoupon, placeOrder } from '../api/cartService';
import { addAddress, getAddresses, editAddress, deleteAddress } from '../api/authService';
import { toast } from '../utils/toast';
import { Pencil, Plus, Trash2, Ticket } from 'lucide-react';
import Swal from 'sweetalert2';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { balanceData, refreshWalletBalance } = useWallet();
  const { cartId, cart, clearCart } = useCart();
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [detailedCart, setDetailedCart] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // Toggle to show form
  const [editingAddressId, setEditingAddressId] = useState(null); // null = add, ID = edit
  const [coupons, setCoupons] = useState([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount, type, value }
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [orderNotes, setOrderNotes] = useState('Please deliver fast');
  
  // Local Controlled Address Form State - Fully mapped to API body
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    line1: '',
    line2: '',
    phone1: '',
    phone2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  const getMergedDetailedCartItems = () => {
    if (!detailedCart?.cartItems) return [];
    const merged = {};
    const standardOnly = detailedCart.cartItems.filter(item => !item.isQuickDelivery);
    const list = standardOnly.length > 0 ? standardOnly : detailedCart.cartItems;
    list.forEach(item => {
      const name = item.productName || '';
      const color = ((item.attributes?.Color || item.attributes?.color) ?? '').trim().toLowerCase();
      const size = ((item.attributes?.Size || item.attributes?.size) ?? '').trim().toLowerCase();
      const key = `${name}-${color}-${size}`;
      
      if (merged[key]) {
        merged[key].quantity += item.quantity;
      } else {
        merged[key] = { ...item };
      }
    });
    return Object.values(merged);
  };

  const getMergedLocalCartItems = () => {
    if (!cart) return [];
    const merged = {};
    const standardOnly = cart.filter(item => !item.isQuickDelivery);
    const list = standardOnly.length > 0 ? standardOnly : cart;
    list.forEach(item => {
      const name = item.name || '';
      const color = ((item.attributes?.Color || item.attributes?.color) ?? '').trim().toLowerCase();
      const size = ((item.attributes?.Size || item.attributes?.size) ?? '').trim().toLowerCase();
      const key = `${name}-${color}-${size}`;
      
      if (merged[key]) {
        merged[key].qty += item.qty;
      } else {
        merged[key] = { ...item };
      }
    });
    return Object.values(merged);
  };

  const getSubtotalAmount = () => {
    if (detailedCart?.cartSummary?.subtotal !== undefined && Number(detailedCart.cartSummary.subtotal) > 0) {
      return Number(detailedCart.cartSummary.subtotal);
    }
    if (detailedCart?.cartItems?.length > 0) {
      const detailedItems = getMergedDetailedCartItems();
      return detailedItems.reduce((acc, item) => {
        const itemPrice = Number(item.unitPrice ?? item.offeredPrice ?? item.salesPrice ?? item.price ?? item.finalPrice ?? 0);
        return acc + (itemPrice * Number(item.quantity || 1));
      }, 0);
    }
    const items = getMergedLocalCartItems();
    return items.reduce((acc, item) => acc + (Number(item.price || item.salesPrice || 0) * Number(item.qty || 1)), 0);
  };

  const getFinalTotal = () => {
    const baseTotal = getSubtotalAmount();
    const shippingCharge = Number(detailedCart?.cartSummary?.shippingCharge || 0);
    const codCharge = paymentMethod === 'cod' ? Number(detailedCart?.cartSummary?.codCharge || 0) : 0;
    const cartDiscount = Number(detailedCart?.cartSummary?.discount || 0);
    const couponDiscount = Number(appliedCoupon?.discount || 0);
    return Math.max(0, baseTotal + shippingCharge + codCharge - cartDiscount - couponDiscount);
  };

  // Dynamic Product Hydration inside Checkout from /cart/cart-details/:addressId
  useEffect(() => {
    const fetchCartSummary = async () => {
      if (!selectedAddressId) return;
      setIsLoadingDetails(true);
      try {
        const res = await getCartDetails(selectedAddressId);
        if (res?.success) {
          setDetailedCart(res.data);
        }
      } catch (err) {
        console.error("Failed fetching dynamic checkout cart details:", err);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    
    fetchCartSummary();
  }, [selectedAddressId]);

  // Fetch Saved Addresses on checkout mount
  const fetchUserAddresses = async () => {
    try {
      const res = await getAddresses();
      if (res?.success) {
        const list = res.data?.data ?? res.data ?? [];
        setAddresses(Array.isArray(list) ? list : []);
        if (list.length > 0) {
          // If no address selected, default to the first one
          setSelectedAddressId(list[0]._id);
          setShippingForm(prev => ({
            ...prev,
            firstName: prev.firstName || 'User',
            line1: list[0].line1 || '',
            line2: list[0].line2 || '',
            phone1: list[0].phone1 || '',
            phone2: list[0].phone2 || '',
            landmark: list[0].landmark || '',
            city: list[0].city || '',
            state: list[0].state || '',
            pincode: list[0].pincode || ''
          }));
        } else {
          setIsFormOpen(true);
        }
      }
    } catch (err) {
      console.error("Failed to load user addresses:", err);
    }
  };

  const fetchCouponsList = async () => {
    setIsLoadingCoupons(true);
    try {
      const res = await getCoupons();
      if (res?.success) {
        const list = res.data?.data ?? res.data ?? [];
        setCoupons(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Failed to load available coupons:", err);
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  useEffect(() => {
    fetchUserAddresses();
    fetchCouponsList();
  }, []);

  const selectAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setShippingForm(prev => ({
      ...prev,
      line1: addr.line1 || '',
      line2: addr.line2 || '',
      phone1: addr.phone1 || '',
      phone2: addr.phone2 || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || ''
    }));
  };

  const handleDeleteAddress = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this address deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fe3e6a', // Match theme primary color
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'rounded-3xl font-outfit',
        confirmButton: 'rounded-xl font-bold uppercase text-xs px-6 py-3',
        cancelButton: 'rounded-xl font-bold uppercase text-xs px-6 py-3'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteAddress(id);
          if (res?.success) {
            Swal.fire({
              title: 'Deleted!',
              text: res?.message || 'Your address has been deleted.',
              icon: 'success',
              confirmButtonColor: '#fe3e6a'
            });
            await fetchUserAddresses();
            // If the deleted address was selected, select another one
            setSelectedAddressId((prevId) => {
              if (prevId === id) return null;
              return prevId;
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: res?.message || 'Failed to delete address.',
              icon: 'error',
              confirmButtonColor: '#fe3e6a'
            });
          }
        } catch (err) {
          console.error("Delete address failed:", err);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while deleting the address.',
            icon: 'error',
            confirmButtonColor: '#fe3e6a'
          });
        }
      }
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address first.");
      setStep(1);
      return;
    }

    if (paymentMethod === 'wallet') {
      const orderTotal = getFinalTotal();
      const currentBalance = balanceData?.balance || 0;
      if (currentBalance < orderTotal) {
        toast.error("Insufficient wallet balance. Please choose another payment method.");
        return;
      }
    }

    setIsConfirmingOrder(true);
    
    Swal.fire({
      title: 'Securing Your Order...',
      text: 'Please wait while we secure your order pipeline with the merchant.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: 'rounded-3xl font-outfit p-8',
      }
    });

    try {
      // Group/merge cart items to prevent duplicate variants in the API payload!
      const mergedPayloadItems = {};
      const standardOnlyCart = cart.filter(item => !item.isQuickDelivery);
      const cartToOrder = standardOnlyCart.length > 0 ? standardOnlyCart : cart;
      
      cartToOrder.forEach(item => {
        const pId = item.productId || item.id;
        const vId = item.variantId || item.id;
        const qty = item.qty || 1;
        
        if (mergedPayloadItems[vId]) {
          mergedPayloadItems[vId].quantity += qty;
        } else {
          mergedPayloadItems[vId] = {
            productId: pId,
            variantId: vId,
            quantity: qty
          };
        }
      });
      const orderItems = Object.values(mergedPayloadItems);

      const payload = {
        addressId: selectedAddressId,
        paymentMethod: paymentMethod === 'wallet' ? 'Wallet' : 'CashOnDelivery',
        couponCode: appliedCoupon?.code || null,
        notes: orderNotes,
        items: orderItems
      };

      const res = await placeOrder(payload);
      
      // Support nested backend response fields
      const success = res?.success || res?.data?.success || false;
      const orderData = res?.data?.data || res?.data || {};

      if (success) {
        await clearCart(); // Clear local and database cart
        if (paymentMethod === 'wallet') {
          await refreshWalletBalance(); // Refresh global wallet balance dynamically
        }
        
        Swal.fire({
          title: 'Order Placed Successfully! 🎉',
          html: `
            <div class="space-y-4 text-left font-outfit mt-2">
              <p class="text-xs text-gray-600 font-medium leading-relaxed">
                ${paymentMethod === 'wallet' 
                  ? 'Thank you for shopping with FashionFever. Your payment has been processed successfully using your Wallet balance.' 
                  : 'Thank you for shopping with FashionFever. Your order is secured under Cash on Delivery (COD).'}
              </p>
              <div class="bg-gray-50/80 p-5 rounded-2xl border border-gray-100/60 text-xs font-bold text-gray-500 uppercase space-y-2">
                <div class="flex justify-between border-b border-gray-200/40 pb-2">
                  <span>Order ID:</span>
                  <span class="text-primary font-mono select-all">${orderData.orderNumber || 'ORD-PLACED'}</span>
                </div>
                <div class="flex justify-between border-b border-gray-200/40 pb-2">
                  <span>Ship To:</span>
                  <span class="text-gray-800">${shippingForm.firstName} ${shippingForm.lastName || ''}</span>
                </div>
                <div class="flex justify-between border-b border-gray-200/40 pb-2">
                  <span>Destination:</span>
                  <span class="text-gray-800">${shippingForm.city}, ${shippingForm.state}</span>
                </div>
                <div class="flex justify-between">
                  <span>Payment Mode:</span>
                  <span class="text-primary font-black">
                    ${paymentMethod === 'wallet' ? 'Wallet Payment (Paid)' : 'COD (Cash on Delivery)'}
                  </span>
                </div>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#fe3e6a', // Match theme primary
          confirmButtonText: 'Continue Shopping 🛍️',
          allowOutsideClick: false,
          customClass: {
            popup: 'rounded-3xl font-outfit p-8',
            confirmButton: 'rounded-xl font-black uppercase text-xs px-6 py-3.5 shadow-lg shadow-primary/20',
          }
        }).then(() => {
          navigate('/');
        });
      } else {
        Swal.close();
        Swal.fire({
          title: 'Order Placement Failed!',
          text: res?.message || 'The checkout pipeline encountered a backend validation error.',
          icon: 'error',
          confirmButtonColor: '#fe3e6a',
          customClass: {
            popup: 'rounded-3xl font-outfit p-8',
            confirmButton: 'rounded-xl font-black uppercase text-xs px-6 py-3.5',
          }
        });
      }
    } catch (err) {
      console.error("Order completion error:", err);
      Swal.close();
      Swal.fire({
        title: 'Network Error!',
        text: 'Failed to communicate with the checkout pipeline. Please try again.',
        icon: 'error',
        confirmButtonColor: '#fe3e6a',
        customClass: {
          popup: 'rounded-3xl font-outfit p-8',
          confirmButton: 'rounded-xl font-black uppercase text-xs px-6 py-3.5',
        }
      });
    } finally {
      setIsConfirmingOrder(false);
    }
  };

  const handleInputChange = (e, field) => {
    setShippingForm({ ...shippingForm, [field]: e.target.value });
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-16 font-outfit text-gray-800 transition-colors duration-300">
      <div className="container max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Modern Stepper Header */}
        <div className="max-w-xl mx-auto mb-16 relative">
          <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-200/60 -translate-y-1/2 -z-10"></div>
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center gap-3 bg-[#f8f9fa] px-4">
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 border ${
                    step > s 
                      ? 'bg-green-500 text-white border-transparent shadow-lg shadow-green-500/20' 
                      : step === s
                        ? 'bg-primary text-white border-transparent shadow-xl shadow-primary/30 scale-105 ring-4 ring-primary/10'
                        : 'bg-white text-gray-300 border-gray-200'
                  }`}
                >
                  {step > s ? <Check size={18} className="stroke-[3]" /> : s}
                </div>
                <span className={`text-[9px] font-black uppercase  ${step >= s ? 'text-primary' : 'text-gray-400'}`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Checkout Form Box (Left 7 Columns) */}
          <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40">
            
            {/* STEP 1: SHIPPING DETAILS */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <span className="text-[9px] font-black text-primary uppercase block mb-1">Step 01 / 03</span>
                  <h2 className="text-xl font-black uppercase text-gray-900">Shipping Address</h2>
                </div>

                {!isFormOpen && addresses.length > 0 ? (
                  /* Saved Addresses List View */
                  <div className="space-y-5">
                    <p className="text-sm font-black text-gray-400 uppercase tracking-wider">Select a Delivery Address</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr._id;
                        return (
                          <div 
                            key={addr._id}
                            onClick={() => selectAddress(addr)}
                            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative group flex gap-4 items-start ${
                              isSelected ? 'border-primary bg-primary/[0.02]' : 'border-gray-100 hover:border-gray-200 bg-white'
                            }`}
                          >
                            {/* Radio indicator on left */}
                            <div className="mt-1 flex-shrink-0">
                              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected ? 'border-primary' : 'border-gray-300'
                              }`}>
                                {isSelected && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                              </div>
                            </div>

                            {/* Address details */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-grow min-w-0">
                                  <span className="text-[9px] font-black uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md mb-2 inline-block">
                                    {addr.landmark ? addr.landmark : 'Home'}
                                  </span>
                                  <h4 className="text-xs font-extrabold text-gray-800 uppercase truncate">{addr.line1}</h4>
                                  {addr.line2 && <p className="text-[11px] font-bold text-gray-400 truncate mt-0.5">{addr.line2}</p>}
                                  <p className="text-[11px] font-extrabold text-gray-600 uppercase mt-2">
                                    {addr.city}, {addr.state} - {addr.pincode}
                                  </p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                                    Phone: {addr.phone1}
                                  </p>
                                </div>
                                
                                <div className="flex flex-col gap-2 flex-shrink-0 z-10">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingAddressId(addr._id);
                                      setShippingForm({
                                        firstName: shippingForm.firstName || 'User',
                                        lastName: shippingForm.lastName || '',
                                        line1: addr.line1 || '',
                                        line2: addr.line2 || '',
                                        phone1: addr.phone1 || '',
                                        phone2: addr.phone2 || '',
                                        landmark: addr.landmark || '',
                                        city: addr.city || '',
                                        state: addr.state || '',
                                        pincode: addr.pincode || ''
                                      });
                                      setIsFormOpen(true);
                                    }}
                                    className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:bg-primary/5 hover:text-primary flex items-center justify-center text-gray-400 transition-all cursor-pointer"
                                    title="Edit Address"
                                  >
                                    <Pencil size={12} className="stroke-[2.5]" />
                                  </button>

                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteAddress(addr._id);
                                    }}
                                    className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 hover:border-red-200 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-all cursor-pointer"
                                    title="Delete Address"
                                  >
                                    <Trash2 size={12} className="stroke-[2.5]" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add New Address Card */}
                      <button 
                        onClick={() => {
                          setEditingAddressId(null);
                          setShippingForm({
                            firstName: shippingForm.firstName || '',
                            lastName: shippingForm.lastName || '',
                            line1: '',
                            line2: '',
                            phone1: '',
                            phone2: '',
                            landmark: '',
                            city: '',
                            state: '',
                            pincode: ''
                          });
                          setIsFormOpen(true);
                        }}
                        className="border-2 border-dashed border-gray-200 hover:border-primary/40 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary transition-all cursor-pointer min-h-[120px] bg-white group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-gray-50 group-hover:bg-primary/5 flex items-center justify-center border border-gray-100 group-hover:border-primary/20 transition-all">
                          <Plus size={16} />
                        </div>
                        <span className="text-sm font-black uppercase">Add New Address</span>
                      </button>
                    </div>

                    <button 
                      onClick={() => setStep(2)}
                      className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer mt-4"
                    >
                      Deliver to Selected Address <ChevronRight size={16} className="stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  /* Edit / Add Address Form View */
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-black text-gray-400 uppercase tracking-wider">
                        {editingAddressId ? 'Modify Address (PATCH Mode)' : 'New Address'}
                      </p>
                      {addresses.length > 0 && (
                        <button 
                          onClick={() => {
                            setIsFormOpen(false);
                            setEditingAddressId(null);
                          }}
                          className="text-sm font-black text-primary hover:text-primary-hover uppercase tracking-wider underline cursor-pointer"
                        >
                          Back to Saved List
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase">First Name *</label>
                        <input 
                          type="text" 
                          required
                          value={shippingForm.firstName}
                          onChange={(e) => handleInputChange(e, 'firstName')}
                          placeholder="e.g. Rahul" 
                          className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Last Name</label>
                        <input 
                          type="text" 
                          value={shippingForm.lastName}
                          onChange={(e) => handleInputChange(e, 'lastName')}
                          placeholder="Sharma" 
                          className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Primary Phone *</label>
                        <input 
                          type="tel" 
                          required
                          value={shippingForm.phone1}
                          onChange={(e) => handleInputChange(e, 'phone1')}
                          placeholder="1234567890" 
                          className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Alternative Phone</label>
                        <input 
                          type="tel" 
                          value={shippingForm.phone2}
                          onChange={(e) => handleInputChange(e, 'phone2')}
                          placeholder="9876543210" 
                          className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase">Address Line 1 (Street/Locality) *</label>
                      <input 
                        type="text"
                        required
                        value={shippingForm.line1}
                        onChange={(e) => handleInputChange(e, 'line1')}
                        placeholder="e.g. Vija Chowk" 
                        className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase">Address Line 2 (Apartment, Clinic, Unit)</label>
                      <input 
                        type="text"
                        value={shippingForm.line2}
                        onChange={(e) => handleInputChange(e, 'line2')}
                        placeholder="e.g. Chouson Dental Clinic" 
                        className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase">Landmark</label>
                      <input 
                        type="text"
                        value={shippingForm.landmark}
                        onChange={(e) => handleInputChange(e, 'landmark')}
                        placeholder="e.g. Star Hospital" 
                        className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase">City *</label>
                        <input 
                          type="text" 
                          required
                          value={shippingForm.city}
                          onChange={(e) => handleInputChange(e, 'city')}
                          placeholder="e.g. Lucknow" 
                          className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase">State *</label>
                        <input 
                          type="text" 
                          required
                          value={shippingForm.state}
                          onChange={(e) => handleInputChange(e, 'state')}
                          placeholder="e.g. Uttar Pradesh" 
                          className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Pincode *</label>
                        <input 
                          type="text" 
                          required
                          value={shippingForm.pincode}
                          onChange={(e) => handleInputChange(e, 'pincode')}
                          placeholder="e.g. 201301" 
                          className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700 font-mono" 
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      {addresses.length > 0 && (
                        <button 
                          type="button"
                          onClick={() => {
                            setIsFormOpen(false);
                            setEditingAddressId(null);
                          }}
                          className="px-6 py-4 border-2 border-gray-100 hover:bg-gray-50 rounded-xl font-black uppercase text-sm transition-all cursor-pointer text-gray-500"
                        >
                          Cancel
                        </button>
                      )}
                      
                      <button 
                        disabled={isSavingAddress}
                        onClick={async () => {
                          if (!shippingForm.firstName || !shippingForm.line1 || !shippingForm.phone1 || !shippingForm.city || !shippingForm.state || !shippingForm.pincode) {
                            toast.error("Please fill all mandatory delivery fields (*).");
                            return;
                          }
                          
                          setIsSavingAddress(true);
                          try {
                            const payload = {
                              line1: shippingForm.line1,
                              line2: shippingForm.line2 || '',
                              phone1: shippingForm.phone1,
                              phone2: shippingForm.phone2 || '',
                              landmark: shippingForm.landmark || '',
                              city: shippingForm.city,
                              state: shippingForm.state,
                              pincode: shippingForm.pincode
                            };
                            
                            const res = editingAddressId 
                              ? await editAddress(editingAddressId, payload)
                              : await addAddress(payload);

                            if (res?.success) {
                              toast.success(res?.message || (editingAddressId ? "Address Updated Successfully" : "Address Added Successfully"));
                              await fetchUserAddresses();
                              // If it's an update, select it automatically
                              const newAddressId = res.data?.data?._id || res.data?._id || editingAddressId;
                              if (newAddressId) setSelectedAddressId(newAddressId);
                              setIsFormOpen(false);
                              setEditingAddressId(null);
                            } else {
                              toast.error(res?.message || "Address validation failed. Please check your inputs.");
                            }
                          } catch (err) {
                            console.error("Address operation failed:", err);
                            toast.error("Failed to save address. Please verify your inputs.");
                          } finally {
                            setIsSavingAddress(false);
                          }
                        }} 
                        className="flex-grow bg-primary disabled:opacity-50 text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
                      >
                        {isSavingAddress ? (
                          <>Saving Address... <Loader2 className="animate-spin" size={16} /></>
                        ) : (
                          <>{editingAddressId ? 'Update & Select Address' : 'Save & Select Address'} <ChevronRight size={16} className="stroke-[3]" /></>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: PAYMENT OVERLAYS */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <span className="text-[9px] font-black text-primary uppercase block mb-1">Step 02 / 03</span>
                  <h2 className="text-xl font-black uppercase text-gray-900">Payment Pipeline</h2>
                </div>

                <div className="space-y-4">
                  {/* Select Payment Method Options */}
                  <div className="space-y-3">
                    {/* Option 1: Cash on Delivery */}
                    <div 
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === 'cod' 
                          ? 'border-primary bg-primary/[0.02]' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Truck size={20} className="stroke-[2.5]" />
                        </div>
                        <div>
                          <span className="text-xs font-black uppercase text-gray-800 block">Cash on Delivery (COD)</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5 block">Pay cash or scan QR upon delivery</span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        paymentMethod === 'cod' ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                      </div>
                    </div>

                    {/* Option 2: Pay using Wallet */}
                    {(() => {
                      const orderTotal = getFinalTotal();
                      const walletBal = balanceData?.balance || 0;
                      const hasSufficientBal = walletBal >= orderTotal;

                      return (
                        <div 
                          onClick={() => {
                            if (hasSufficientBal) {
                              setPaymentMethod('wallet');
                            } else {
                              toast.warning(`Insufficient wallet balance. Total required: ₹${orderTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}, wallet balance: ₹${walletBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
                            }
                          }}
                          className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                            !hasSufficientBal 
                              ? 'border-gray-100 opacity-60 bg-gray-50/50 cursor-not-allowed'
                              : paymentMethod === 'wallet'
                                ? 'border-primary bg-primary/[0.02] cursor-pointer'
                                : 'border-gray-100 hover:border-gray-200 bg-white cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <Wallet size={20} className="stroke-[2.5]" />
                            </div>
                            <div>
                              <span className="text-xs font-black uppercase text-gray-800 block">Pay using Wallet</span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5 block">
                                Available Balance: ₹{walletBal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              {!hasSufficientBal && (
                                <span className="text-[8px] font-bold text-red-500 uppercase mt-1 block">
                                  ⚠️ Insufficient Balance (Short of ₹{(orderTotal - walletBal).toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            !hasSufficientBal 
                              ? 'border-gray-200' 
                              : paymentMethod === 'wallet' 
                                ? 'border-primary' 
                                : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-500 font-bold uppercase leading-relaxed">
                    {paymentMethod === 'wallet' 
                      ? '✓ You have selected Wallet Payment. The order amount will be deducted directly from your wallet balance upon confirmation.' 
                      : '⚠️ We currently support Cash on Delivery (COD) and Wallet payment. Please choose your preferred payment mode.'}
                  </div>

                  <div className="space-y-1.5 mt-4">
                    <label className="text-[9px] font-black text-gray-400 uppercase">Order Delivery Notes</label>
                    <textarea 
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Please deliver fast / Ring the bell / Leave at gate" 
                      className="w-full px-4 py-3 bg-gray-50/70 border border-gray-100 focus:bg-white rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-gray-700 h-20 resize-none" 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-50">
                  <button onClick={() => setStep(1)} className="px-6 py-3.5 border-2 border-gray-100 hover:bg-gray-50 rounded-xl font-black uppercase text-sm transition-all cursor-pointer text-gray-500">Back</button>
                  <button onClick={() => setStep(3)} className="flex-grow bg-primary text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer">
                    Review Order & Proceed <ChevronRight size={16} className="stroke-[3]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER REVIEW SUMMARY */}
            {step === 3 && (
              <div className="space-y-6 animate-in zoom-in-95 duration-300 text-center py-4">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border-4 border-green-100">
                  <Check size={28} className="stroke-[3]" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase text-gray-900 ">Everything Looks Perfect!</h2>
                  <p className="text-sm font-bold text-gray-400 uppercase  mt-1">Review your order details before confirmation</p>
                </div>
                
                <div className="bg-gray-50/80 p-5 rounded-2xl text-left space-y-3 border border-gray-100 text-xs font-bold text-gray-600">
                  <div className="flex items-start gap-3 border-b border-gray-200/60 pb-3">
                    <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">Shipping Destination</p>
                      <p className="text-gray-800 mt-0.5">
                        {shippingForm.firstName} {shippingForm.lastName}<br />
                        {shippingForm.line1}
                        {shippingForm.line2 && `, ${shippingForm.line2}`}
                        {shippingForm.landmark && ` (Near ${shippingForm.landmark})`}
                        <br />
                        {shippingForm.city}, {shippingForm.state} - {shippingForm.pincode}
                        <br />
                        <span className="text-sm text-gray-400 font-bold uppercase">Phone: {shippingForm.phone1} {shippingForm.phone2 && `| Alt: ${shippingForm.phone2}`}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase ">Payment Pipeline</p>
                      <p className="text-gray-800 mt-0.5">
                        {paymentMethod === 'wallet' 
                          ? 'Wallet Payment (Paid)' 
                          : paymentMethod === 'card' 
                            ? 'Secure Credit Card' 
                            : 'Cash on Delivery (COD)'}
                      </p>
                    </div>
                  </div>
                  {orderNotes && (
                    <div className="flex items-start gap-3 border-t border-gray-100 pt-3 mt-3">
                      <ShoppingBag size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase">Delivery Instructions / Notes</p>
                        <p className="text-gray-800 mt-0.5 italic">"{orderNotes}"</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(2)} className="px-6 py-4 border-2 border-gray-100 hover:bg-gray-50 rounded-xl font-black uppercase text-sm  transition-all cursor-pointer text-gray-500">Back</button>
                  <button 
                    disabled={isConfirmingOrder}
                    onClick={handlePlaceOrder}
                    className="flex-grow bg-primary disabled:opacity-50 text-white py-4 rounded-xl font-black uppercase text-xs shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isConfirmingOrder ? <>Placing Order... <Loader2 className="animate-spin" size={16} /></> : <>Pay & Confirm Order Now</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mini Sidebar Cart Summary (Right 5 Columns) */}
          <div className="lg:col-span-5 space-y-4 w-full">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 space-y-5 text-left relative overflow-hidden">
              {isLoadingDetails && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-50">
                  <Loader2 className="animate-spin text-primary" size={24} />
                </div>
              )}
              <h3 className="text-xs font-black uppercase  text-gray-400 border-b border-gray-50 pb-3 flex items-center gap-2">
                <ShoppingBag size={14} className="text-primary" /> In Your Bag
              </h3>
              
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                {detailedCart?.cartItems?.length > 0 ? (
                  getMergedDetailedCartItems().map((item, i) => {
                    const color = item.attributes?.Color || item.attributes?.color;
                    const size = item.attributes?.Size || item.attributes?.size;
                    return (
                      <div key={i} className="flex items-center gap-4 group/item">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden relative">
                          <img 
                            src={item.thumbnail?.url || 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=100&h=100&fit=crop'} 
                            alt="" 
                            className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300" 
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=100&h=100&fit=crop'; }}
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-extrabold text-gray-800 uppercase truncate leading-tight">{item.productName || 'Luxe Product'}</h4>
                          {(color || size) && (
                            <p className="text-[9px] font-black text-primary uppercase mt-0.5">
                              {color && `Color: ${color}`} {size && `• Size: ${size}`}
                            </p>
                          )}
                          <p className="text-sm font-bold text-gray-400 mt-1 uppercase">
                            Qty: {item.quantity} • <span className="text-gray-700 font-extrabold">₹{Number(item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  getMergedLocalCartItems().map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group/item">
                      <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden relative">
                        <img src={item.image || 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=100&h=100&fit=crop'} alt="" className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-extrabold text-gray-800 uppercase truncate leading-tight">{item.name}</h4>
                        <p className="text-sm font-bold text-gray-400 mt-1 uppercase">Qty: {item.qty} • <span className="text-gray-700 font-extrabold">₹{Number(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Coupons & Offers Section */}
              <div className="bg-gray-50/50 p-4.5 rounded-2xl border border-gray-100 space-y-3.5 mt-4">
                <h4 className="text-sm font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                  <Ticket size={12} className="text-primary" /> Apply Coupon & Save Extra
                </h4>
                
                {/* Applied Coupon Banner */}
                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-green-50 border border-green-100 px-4 py-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-green-600 stroke-[3]" />
                      <div>
                        <p className="text-sm font-black uppercase text-green-700">{appliedCoupon.code} Applied!</p>
                        <p className="text-[8px] font-bold text-green-500 uppercase">
                          You save ₹{appliedCoupon.discount?.toLocaleString()} on this order
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setAppliedCoupon(null); setPromoInput(''); toast.success('Coupon removed.'); }}
                      className="text-[8px] font-black uppercase text-red-400 hover:text-red-600 transition-all cursor-pointer underline"
                    >Remove</button>
                  </div>
                )}

                {/* Apply coupon promo input form */}
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !appliedCoupon && document.getElementById('apply-coupon-btn')?.click()}
                    placeholder="ENTER CODE (e.g. PRASHANT100)"
                    className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl px-4 py-2.5 text-xs font-black uppercase outline-none transition-all w-full bg-white text-gray-800 disabled:opacity-50"
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <button 
                      onClick={() => { 
                        setAppliedCoupon(null); 
                        setPromoInput(''); 
                        toast.success('Coupon removed.'); 
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-black uppercase px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-md shadow-red-500/10"
                    >
                      Remove
                    </button>
                  ) : (
                    <button 
                      id="apply-coupon-btn"
                      disabled={isValidatingCoupon}
                      onClick={async () => {
                        if (!promoInput.trim()) {
                          toast.error('Please enter a coupon code.');
                          return;
                        }
                        setIsValidatingCoupon(true);
                        try {
                          const res = await validateCoupon(promoInput.trim().toUpperCase());
                          const data = res?.data?.data ?? res?.data ?? res;
                          if (res?.success || data?.success) {
                            const couponInfo = data?.coupon ?? data;
                            const discountAmt = data?.discountAmount ?? couponInfo?.value ?? 0;
                            setAppliedCoupon({
                              code: promoInput.trim().toUpperCase(),
                              discount: discountAmt,
                              type: couponInfo?.type,
                              value: couponInfo?.value
                            });
                            toast.success(res?.message || data?.message || `Coupon applied! You save ₹${discountAmt}`);
                          } else {
                            toast.error(res?.message || data?.message || 'Invalid or expired coupon code.');
                          }
                        } catch (err) {
                          console.error('Coupon validation error:', err);
                          toast.error('Failed to validate coupon. Please try again.');
                        } finally {
                          setIsValidatingCoupon(false);
                        }
                      }}
                      className="bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-sm font-black uppercase px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                    >
                      {isValidatingCoupon ? <Loader2 size={12} className="animate-spin" /> : null}
                      Apply
                    </button>
                  )}
                </div>

                {/* Available Coupons List */}
                {coupons.length > 0 && (
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 no-scrollbar pt-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Available Offers ({coupons.length})</p>
                    {coupons.map((coupon) => (
                      <div 
                        key={coupon._id}
                        onClick={() => {
                          if (coupon.isValid) {
                            setPromoInput(coupon.code);
                            toast.success(`Coupon code "${coupon.code}" selected! Click Apply to confirm.`);
                          } else {
                            toast.error(coupon.reason || "This coupon is not available for use.");
                          }
                        }}
                        className={`p-3 rounded-xl border transition-all text-left flex flex-col gap-1 relative ${
                          coupon.isValid 
                            ? 'border-primary/20 hover:border-primary/40 bg-white cursor-pointer' 
                            : 'border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <code className="text-xs font-black uppercase text-primary tracking-normal">{coupon.code}</code>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                            coupon.isValid ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'
                          }`}>
                            {coupon.isValid ? `${coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`} OFF` : 'INVALID'}
                          </span>
                        </div>
                        {coupon.description && <p className="text-[9px] text-gray-400 font-bold">{coupon.description}</p>}
                        {!coupon.isValid && coupon.reason && (
                          <p className="text-[8px] text-red-500 font-bold uppercase mt-0.5 flex items-center gap-1">
                            ⚠️ {coupon.reason}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-[8px] font-bold text-gray-400 uppercase mt-1">
                          <span>Min Order: ₹{coupon.minimumOrderAmount}</span>
                          <span>Max Disc: ₹{coupon.maximumDiscount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-gray-100 my-4"></div>
              
              <div className="space-y-2.5 pt-1 text-xs font-bold text-gray-400 uppercase">
                {detailedCart?.cartSummary?.totalItems !== undefined && (
                  <div className="flex justify-between">
                    <span>Total Items</span>
                    <span className="text-gray-800 font-extrabold">{detailedCart.cartSummary.totalItems} Unit(s)</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-800">₹{Number(getSubtotalAmount()).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {(detailedCart?.cartSummary?.discount !== undefined || appliedCoupon) && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{Number((detailedCart?.cartSummary?.discount || 0) + (appliedCoupon?.discount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Ticket size={10} className="text-green-500" /> Coupon ({appliedCoupon.code})
                    </span>
                    <span className="font-extrabold">-₹{Number(appliedCoupon.discount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                {detailedCart?.cartSummary?.shippingCharge !== undefined && (
                  <div className="flex justify-between">
                    <span>Shipping Charge</span>
                    <span className="text-gray-800 font-extrabold">₹{Number(detailedCart.cartSummary.shippingCharge).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                {paymentMethod === 'cod' && detailedCart?.cartSummary?.codCharge !== undefined && (
                  <div className="flex justify-between transition-all duration-300">
                    <span>COD Charge</span>
                    <span className="text-gray-800 font-extrabold">
                      ₹{Number(detailedCart.cartSummary.codCharge).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {detailedCart?.cartSummary?.estimatedDeliveryDate && (
                  <div className="flex justify-between text-sm text-primary lowercase tracking-wider border-t border-gray-50 pt-2 font-black">
                    <span>Est. Delivery</span>
                    <span>
                      {detailedCart.cartSummary.estimatedDeliveryDate} 
                      {detailedCart.cartSummary.estimatedDeliveryDays && ` (Within ${detailedCart.cartSummary.estimatedDeliveryDays} Days)`}
                    </span>
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-gray-100 my-4"></div>
              
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-black uppercase text-gray-400">Final Total</span>
                <span className="text-2xl font-black text-gray-900">
                  ₹{Number(getFinalTotal()).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            
            {/* Dynamic Shipping Summary Courier Cards */}
            {detailedCart?.shippingSummary?.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 text-left space-y-3">
                <h4 className="text-sm font-black uppercase text-gray-400 tracking-wider">Logistics & Delivery Pipeline</h4>
                {detailedCart.shippingSummary.map((ship, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5 p-3.5 bg-gray-50 rounded-2xl border border-gray-100/50 text-xs">
                    <div className="flex justify-between font-extrabold text-gray-800 uppercase">
                      <span>{ship.courierName || 'Delhivery Surface'}</span>
                      <span className="text-primary">₹{Number(ship.shippingCharge || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Estimated delivery: {ship.estimatedDate || 'Within 5 Days'} ({ship.estimatedDays} Days)</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Vendor: {ship.vendorName}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Trust Safety Footer Badge */}
            <div className="flex items-center gap-4 p-5 bg-primary/[0.02] rounded-2xl border border-primary/10 text-left">
              <ShieldCheck className="text-primary flex-shrink-0" size={28} />
              <div className="flex flex-col">
                <span className="text-sm font-black text-primary uppercase  leading-tight">Razorpay Secure Checkout</span>
                <span className="text-[8px] font-bold text-primary/60 uppercase  mt-0.5">PCI-DSS Compliant Secure Token Infrastructure</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;