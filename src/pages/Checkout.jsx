import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import {
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  Mail,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  QrCode,
  Sparkles
} from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, finalTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    email: '',
    address: '',
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    pincode: '474005'
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Check login state on mount & prefill profile
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('premmobile_user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        setIsLoggedIn(true);
        setFormData(prev => ({
          ...prev,
          customerName: parsed.fullName || prev.customerName,
          mobile: parsed.phone || prev.mobile,
          email: parsed.email || prev.email,
          address: parsed.address || prev.address,
          city: parsed.city || prev.city,
          state: parsed.state || prev.state,
          pincode: parsed.pincode || prev.pincode
        }));
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      setIsLoggedIn(false);
    }
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#f8fafc] py-16 px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xl space-y-5">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-[#ffd000] border-2 border-[#ffd000] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-[#050505]" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-[#050505]">Your Cart is Empty</h1>
            <p className="text-slate-500 text-sm mt-1">Please add items to your cart before proceeding to checkout.</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md"
          >
            <span>SHOP PRODUCTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!isLoggedIn) {
      setErrorMessage('Please log in to your Prem Mobile account to place an order.');
      return false;
    }
    if (!formData.customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please enter your delivery / pickup address.');
      return false;
    }
    if (!formData.city.trim()) {
      setErrorMessage('Please enter your city.');
      return false;
    }
    if (!formData.state.trim()) {
      setErrorMessage('Please enter your state.');
      return false;
    }
    if (!formData.pincode.trim()) {
      setErrorMessage('Please enter your area pincode.');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleCodOrder();
    }
  };

  // 1. Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    try {
      const resLoaded = await loadRazorpayScript();
      if (!resLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // Step 1: Create Razorpay Order on server
      const createRes = await fetch('/api/payment/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          receipt: `rcpt_${Date.now()}`
        })
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.success) {
        throw new Error(createData.error || 'Failed to initiate Razorpay transaction.');
      }

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: createData.key,
        amount: createData.amount,
        currency: createData.currency || 'INR',
        name: 'Prem Mobile Gwalior',
        description: `Order payment for ${cartItems.length} items`,
        image: 'https://res.cloudinary.com/iuuqceor/image/upload/v1740920000/prem_logo.png',
        order_id: createData.razorpayOrderId,
        prefill: {
          name: formData.customerName,
          email: formData.email || '',
          contact: formData.mobile
        },
        theme: {
          color: '#ffd000'
        },
        handler: async function (response) {
          try {
            // Step 3: Verify payment on server & save order
            const verifyRes = await fetch('/api/payment/verify-razorpay-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || createData.razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || 'verified_sig',
                customerDetails: formData,
                items: cartItems.map(item => ({
                  productId: item.id,
                  quantity: item.quantity
                })),
                notes: 'Paid via Razorpay Online'
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }

            clearCart();
            navigate(`/account?orderSuccess=${verifyData.order.orderNumber}`);
          } catch (err) {
            console.error('Payment verification error:', err);
            setErrorMessage(err.message || 'Payment completed but order registration failed. Please contact store.');
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setErrorMessage(response.error?.description || 'Payment failed. Please try again.');
        setIsSubmitting(false);
      });
      paymentObject.open();
    } catch (err) {
      console.error('Razorpay Error:', err);
      setErrorMessage(err.message || 'Something went wrong initiating payment.');
      setIsSubmitting(false);
    }
  };

  // 2. COD / Pay at Store Handler
  const handleCodOrder = async () => {
    try {
      const payload = {
        customerName: formData.customerName,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      clearCart();
      navigate(`/account?orderSuccess=${data.order.orderNumber}`);
    } catch (err) {
      console.error('COD Order error:', err);
      setErrorMessage(err.message || 'Something went wrong while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        
        {/* HEADER */}
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
            Simple & Fast Order
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-[#050505] tracking-tight">
            Checkout
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Fill in your details below to place your order. Prices are verified securely by our store server.
          </p>
        </div>

        {/* LOGIN REQUIRED WARNING BANNER */}
        {!isLoggedIn && (
          <div className="p-6 rounded-3xl bg-amber-50 border-2 border-[#ffd000] text-slate-900 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#050505] text-[#ffd000] flex items-center justify-center flex-shrink-0 font-black">
                <User className="w-6 h-6 text-[#ffd000]" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-[#050505]">
                  Login Required to Place Order
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Please log in or create an account to save your order history and track order progress live.
                </p>
              </div>
            </div>

            <Link
              to="/login?redirect=/checkout"
              className="px-6 py-3 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2 flex-shrink-0 transition-transform hover:scale-102"
            >
              <span>LOG IN TO CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: CUSTOMER FORM & PAYMENT OPTIONS */}
          <div className="lg:col-span-7 space-y-6">

            {/* CUSTOMER DETAILS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#050505] border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-[#e51b23]" />
                <span>Customer Details</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#050505] focus:ring-2 focus:ring-[#ffd000]/50 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#050505] focus:ring-2 focus:ring-[#ffd000]/50 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#050505] focus:ring-2 focus:ring-[#ffd000]/50 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Delivery / Pickup Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      placeholder="House/Flat No, Street, Landmark"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#050505] focus:ring-2 focus:ring-[#ffd000]/50 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#050505] focus:ring-2 focus:ring-[#ffd000]/50 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#050505] focus:ring-2 focus:ring-[#ffd000]/50 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#050505] focus:ring-2 focus:ring-[#ffd000]/50 text-sm font-medium"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* PAYMENT METHOD SELECTOR */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#050505] border-b border-slate-100 pb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#e51b23]" />
                  <span>Select Payment Method</span>
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#e51b23]" />
                  <span>Instant Confirmation</span>
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* RAZORPAY OPTION */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#050505] bg-amber-50/60 ring-2 ring-[#ffd000]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-indigo-600" />
                      <span className="font-display font-black text-sm text-[#050505]">Razorpay Online</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'razorpay' ? 'border-amber-600 bg-[#ffd000]' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'razorpay' && <div className="w-2 h-2 rounded-full bg-[#050505]" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Pay via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards & NetBanking.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      ⚡ Fast & Secure Gateway
                    </span>
                    <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                      🧪 TEST MODE ENABLED
                    </span>
                  </div>
                </button>

                {/* CASH ON DELIVERY OPTION */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-[#050505] bg-amber-50/60 ring-2 ring-[#ffd000]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <span className="font-display font-black text-sm text-[#050505]">COD / Store Pickup</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-amber-600 bg-[#ffd000]' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-[#050505]" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Pay cash upon home delivery or pay at Prem Mobile Store Gwalior.
                  </p>
                  <div className="mt-3 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block w-fit">
                    📍 Store Pick & Pay
                  </div>
                </button>

              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Your personal info is safe and only used for your Prem Mobile order fulfilment.</span>
              </div>
            </div>

          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#050505] border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-bold text-slate-400">{cartItems.length} Items</span>
              </h2>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.cartItemId || item.id} className="py-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image || '/images/prem-main.jpg'}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#050505] truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-xs font-black text-[#050505]">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Box */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#050505]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Store Pickup / Delivery:</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                  <span className="font-display font-black text-base text-[#050505]">Total Payable:</span>
                  <span className="font-display font-black text-2xl text-[#e51b23]">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] disabled:bg-slate-200 disabled:text-slate-400 text-[#050505] font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#050505]" />
                    <span>
                      {paymentMethod === 'razorpay' ? 'PAY & PLACE ORDER' : 'PLACE ORDER (COD)'}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Encrypted & Server-Verified Transaction</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

