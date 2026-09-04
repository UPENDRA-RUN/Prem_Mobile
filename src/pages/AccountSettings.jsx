import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { storeConfig } from '../config/store';
import { useCart } from '../context/CartContext';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import { formatCurrency } from '../utils/formatters';
import DeleteAccountModal from '../components/common/DeleteAccountModal';
import SupportModal from '../components/common/SupportModal';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Pencil,
  Save,
  CheckCircle2,
  Loader2,
  Lock,
  Unlock,
  RotateCcw,
  Smartphone,
  ShieldCheck,
  Building,
  Trash2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ShoppingBag,
  Package,
  Clock,
  Truck,
  CreditCard,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'premmobile_user_profile';

export default function AccountSettings() {
  const { showToast } = useCart();
  const [searchParams] = useSearchParams();
  const orderSuccessNo = searchParams.get('orderSuccess');

  // Initial default state
  const initialData = {
    fullName: 'Rahul Sharma',
    phone: '9893947477',
    email: 'rahul.gwalior@gmail.com',
    address: 'Flat 302, Pinto Park Chauraha, Jaderua Gate',
    city: 'Gwalior (M.P.)',
    pickupPreference: 'Pinto Park Store Pickup'
  };

  // State management
  const [profile, setProfile] = useState(initialData);
  const [savedProfile, setSavedProfile] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Customer Orders State
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setSavedProfile(parsed);
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    }
  }, []);

  // Fetch customer orders from API
  const fetchMyOrders = useCallback(async () => {
    if (!profile.phone && !profile.email) return;
    setIsLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders/my-orders?mobile=${encodeURIComponent(profile.phone || '')}&email=${encodeURIComponent(profile.email || '')}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        if (data.orders && data.orders.length > 0) {
          setExpandedOrder(data.orders[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching customer orders:', e);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [profile.phone, profile.email]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // Real-time SSE updates for live order tracking
  useRealtimeSync(fetchMyOrders, ['ORDERS_UPDATED'], 3000);

  // Determine if form has un-saved changes
  const isDirty = JSON.stringify(profile) !== JSON.stringify(savedProfile);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value
    }));
    setSaveSuccess(false);
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleCancelEdit = () => {
    setProfile(savedProfile);
    setIsEditing(false);
    setSaveSuccess(false);
  };

  const handleSaveFlow = (e) => {
    e.preventDefault();
    if (!isDirty || isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
      } catch (err) {}

      setSavedProfile(profile);
      setIsSaving(false);
      setIsEditing(false);

      setSaveSuccess(true);
      showToast('Profile Details Saved Successfully!');
    }, 1200);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Banner Header */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#FFD400]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>CUSTOMER PROFILE SETTINGS</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              MY ACCOUNT DETAILS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage your personal information, contact numbers, and store pickup preferences at Prem Mobile.
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={handleEnableEdit}
              className="py-3 px-5 rounded-2xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform hover:scale-103 flex-shrink-0"
            >
              <Pencil className="w-4 h-4" />
              <span>EDIT DETAILS</span>
            </button>
          ) : (
            <button
              onClick={handleCancelEdit}
              className="py-3 px-4 rounded-2xl bg-[#222222] hover:bg-[#333333] text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Cancel Editing</span>
            </button>
          )}
        </div>

        {/* ORDER PLACED CELEBRATION BANNER */}
        {orderSuccessNo && (
          <div className="p-6 rounded-3xl bg-emerald-500 text-white shadow-xl space-y-3 border-2 border-emerald-400 animate-bounce-short">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-100 block">
                  ORDER CONFIRMED LIVE
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl tracking-tight">
                  Thank You! Order #{orderSuccessNo} Placed Successfully!
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-emerald-50 font-medium leading-relaxed pl-15">
              Your order is now being processed by our store team in Pinto Park, Gwalior. Track its real-time progress below or contact support anytime!
            </p>
          </div>
        )}

        {/* MY ORDERS & LIVE ORDER TRACKING SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#050505] text-[#FFD400] flex items-center justify-center font-black">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-black text-lg sm:text-xl text-[#050505] tracking-tight">
                  MY ORDERS & LIVE TRACKING ({orders.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time status updates for your Prem Mobile store orders.
                </p>
              </div>
            </div>

            <button
              onClick={fetchMyOrders}
              className="text-xs font-bold text-[#E31B23] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh Orders</span>
            </button>
          </div>

          {isLoadingOrders ? (
            <div className="py-10 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#FFD400] animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Loading your order history...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center space-y-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h4 className="font-display font-black text-base text-slate-800">No Orders Placed Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  You haven't placed any orders yet using phone <strong>{profile.phone}</strong>. Explore our products and place your first order!
                </p>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm"
              >
                <span>Browse Products</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const isExpanded = expandedOrder === ord.id;
                const isConfirmed = ord.status === 'CONFIRMED' || ord.status === 'DELIVERED';
                const isDelivered = ord.status === 'DELIVERED';

                return (
                  <div
                    key={ord.id}
                    className={`rounded-2xl border transition-all ${
                      ord.orderNumber === orderSuccessNo
                        ? 'border-[#FFD400] bg-amber-50/40 ring-2 ring-[#FFD400]/50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Order Summary Bar */}
                    <div
                      onClick={() => setExpandedOrder(isExpanded ? null : ord.id)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : isConfirmed
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-black text-sm text-[#050505]">
                              Order #{ord.orderNumber}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isDelivered
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isConfirmed
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>Placed: {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            <span>•</span>
                            <span>{ord.items?.length || 1} Item(s)</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                          <span className="font-display font-black text-base text-[#E31B23]">
                            {formatCurrency(ord.total)}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Order Details & Progress Tracker */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 p-4 sm:p-6 bg-slate-50/50 space-y-6">
                        
                        {/* PROGRESS TIMELINE TRACKER */}
                        <div>
                          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-3">
                            Order Progress Tracker
                          </span>

                          <div className="grid grid-cols-4 gap-2 text-center relative">
                            {/* Line connecting steps */}
                            <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0" />

                            {/* Step 1: Placed */}
                            <div className="relative z-10 flex flex-col items-center gap-1.5">
                              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                                ✓
                              </div>
                              <span className="text-[11px] font-bold text-slate-800">Placed</span>
                              <span className="text-[9px] text-slate-400">Order Received</span>
                            </div>

                            {/* Step 2: Confirmed */}
                            <div className="relative z-10 flex flex-col items-center gap-1.5">
                              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shadow-sm ${
                                isConfirmed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {isConfirmed ? '✓' : '2'}
                              </div>
                              <span className="text-[11px] font-bold text-slate-800">Confirmed</span>
                              <span className="text-[9px] text-slate-400">Server Verified</span>
                            </div>

                            {/* Step 3: Dispatch / Ready */}
                            <div className="relative z-10 flex flex-col items-center gap-1.5">
                              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shadow-sm ${
                                isConfirmed ? 'bg-amber-400 text-black' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {isDelivered ? '✓' : '3'}
                              </div>
                              <span className="text-[11px] font-bold text-slate-800">Processing</span>
                              <span className="text-[9px] text-slate-400">Store Pickup / Delivery</span>
                            </div>

                            {/* Step 4: Completed */}
                            <div className="relative z-10 flex flex-col items-center gap-1.5">
                              <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shadow-sm ${
                                isDelivered ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                              }`}>
                                {isDelivered ? '✓' : '4'}
                              </div>
                              <span className="text-[11px] font-bold text-slate-800">Completed</span>
                              <span className="text-[9px] text-slate-400">Fulfilled</span>
                            </div>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                            Items in this Order
                          </span>
                          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                            {ord.items && ord.items.map((it, idx) => (
                              <div key={idx} className="p-3 flex items-center justify-between text-xs">
                                <div className="font-bold text-[#050505]">
                                  {it.productNameSnapshot} <span className="text-slate-400 font-normal">× {it.quantity}</span>
                                </div>
                                <div className="font-black text-slate-900">
                                  {formatCurrency(it.finalPrice * it.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Meta Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-slate-400 font-bold block">Delivery Address:</span>
                            <span className="font-bold text-slate-800">{ord.address}, {ord.city}, {ord.state} - {ord.pincode}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block">Payment Reference:</span>
                            <span className="font-bold text-indigo-700">{ord.notes || 'Standard Store Fulfillment'}</span>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SUCCESS BANNER */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 shadow-sm flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-950">Changes Saved Successfully!</h4>
                <p className="text-xs text-emerald-800 font-medium">
                  Your updated profile details are now safely locked in for your future store pickup orders.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSaveSuccess(false)}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* PROFILE FORM CONTAINER */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Unlock className="w-5 h-5 text-amber-500" />
              ) : (
                <Lock className="w-5 h-5 text-slate-400" />
              )}
              <h3 className="font-display font-black text-lg text-[#050505] uppercase tracking-wider">
                {isEditing ? 'EDITING PROFILE DETAILS' : 'READ-ONLY PROFILE VIEW'}
              </h3>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isEditing ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'
            }`}>
              {isEditing ? '🔓 Edit Mode Active' : '🔒 Locked / Read-Only'}
            </span>
          </div>

          <form onSubmit={handleSaveFlow} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isEditing
                        ? 'border-2 border-slate-300 focus:border-[#FFD400] bg-white text-[#050505] shadow-xs'
                        : 'border border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isEditing
                        ? 'border-2 border-slate-300 focus:border-[#FFD400] bg-white text-[#050505] shadow-xs'
                        : 'border border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isEditing
                        ? 'border-2 border-slate-300 focus:border-[#FFD400] bg-white text-[#050505] shadow-xs'
                        : 'border border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Pickup / Delivery Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Store Pickup Preference
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    disabled={!isEditing}
                    value={profile.pickupPreference}
                    onChange={(e) => handleInputChange('pickupPreference', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isEditing
                        ? 'border-2 border-slate-300 focus:border-[#FFD400] bg-white text-[#050505] shadow-xs cursor-pointer'
                        : 'border border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <option value="Pinto Park Store Pickup">Pinto Park Store Pickup</option>
                    <option value="Gwalior Local Express Delivery">Gwalior Local Express Delivery</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Default Delivery & Store Address Landmark
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isEditing
                      ? 'border-2 border-slate-300 focus:border-[#FFD400] bg-white text-[#050505] shadow-xs'
                      : 'border border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* STICKY BOTTOM ACTION BAR */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Your profile data is encrypted & secured locally.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!isEditing || !isDirty || isSaving}
                  className={`py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${
                    isSaving
                      ? 'bg-[#050505] text-[#FFD400] shadow-md cursor-wait'
                      : isEditing && isDirty
                      ? 'bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] shadow-xl animate-pulse ring-4 ring-[#FFD400]/40 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#FFD400] animate-spin" />
                      <span>SAVING CHANGES...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>
                        {!isEditing
                          ? 'NO CHANGES TO SAVE'
                          : isDirty
                          ? 'SAVE CHANGES NOW'
                          : 'NO CHANGES MADE'}
                      </span>
                    </>
                  )}
                </button>

              </div>

            </div>

          </form>

        </div>

        {/* CUSTOMER SUPPORT DESK LINK & CARD */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#FFD400]/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-display font-black text-base text-[#FFD400] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-[#FFD400]" />
              <span>NEED SUPPORT OR HELP WITH YOUR ORDER?</span>
            </h4>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Have questions about your order, store pickup, product testing, or warranty claims? Open our support desk to choose your preferred contact channel.
            </p>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="py-3 px-5 rounded-2xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 flex-shrink-0 transition-transform hover:scale-102"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Open Support Desk</span>
          </button>
        </div>

        {/* ACCOUNT CLOSURE & PRIVACY */}
        <div className="bg-red-50/60 rounded-3xl border border-red-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-display font-black text-base text-[#050505] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#E31B23]" />
              <span>ACCOUNT CLOSURE & PRIVACY</span>
            </h4>
            <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
              If you wish to close your account and remove saved data, you can delete your account at any time. You can still shop anytime as a guest without an account.
            </p>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-white hover:bg-red-50 text-[#E31B23] border border-red-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-[#E31B23]" />
            <span>Delete Account & Data</span>
          </button>
        </div>

      </div>

      {/* MODALS */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
