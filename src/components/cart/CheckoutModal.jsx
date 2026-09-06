import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Phone,
  User,
  ShoppingBag,
  Ticket,
  Banknote,
  QrCode,
  Sparkles,
  AlertCircle,
  Lock,
  Loader2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { formatCurrency } from '../../utils/formatters';
import { storeConfig } from '../../config/store';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { parseResponseJson } from '../../utils/apiHelper';

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

export default function CheckoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    appliedPromo,
    promoDiscount,
    finalTotal,
    clearCart
  } = useCart();

  const { customerUser, customerToken } = useCustomerAuth();

  const [fulfillmentType, setFulfillmentType] = useState('pickup'); // 'pickup' | 'delivery'
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'razorpay'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: 'Pinto Park, Gwalior',
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    pincode: '474005'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // Prefill customer details when modal opens or user profile loads
  useEffect(() => {
    if (!isOpen) return;

    let localProf = null;
    try {
      const stored = localStorage.getItem('premmobile_user_profile');
      if (stored) localProf = JSON.parse(stored);
    } catch (e) {}

    const name = customerUser?.name || localProf?.fullName || localProf?.name || '';
    const phone = customerUser?.mobile || localProf?.phone || localProf?.mobile || '';
    const email = customerUser?.email || localProf?.email || '';
    const address = customerUser?.address || localProf?.address || 'Pinto Park, Gwalior';

    setFormData({
      name: name || '',
      phone: phone || '',
      email: email || '',
      address: address || 'Pinto Park, Gwalior',
      city: customerUser?.city || localProf?.city || 'Gwalior',
      state: customerUser?.state || localProf?.state || 'Madhya Pradesh',
      pincode: customerUser?.pincode || localProf?.pincode || '474005'
    });
    setErrorMessage(null);
    setIsSuccess(false);
    setPlacedOrderDetails(null);
  }, [isOpen, customerUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (fulfillmentType === 'delivery' && !formData.address.trim()) {
      setErrorMessage('Please enter your delivery address in Gwalior.');
      return false;
    }
    return true;
  };

  const handleCompleteCheckout = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleCodOrder();
    }
  };

  // 1. Cash on Delivery Order Handler
  const handleCodOrder = async () => {
    try {
      const payload = {
        customerName: formData.name,
        mobile: formData.phone,
        email: formData.email,
        address: fulfillmentType === 'pickup' ? 'Store Pickup at Pinto Park, Gwalior' : formData.address,
        city: formData.city || 'Gwalior',
        state: formData.state || 'Madhya Pradesh',
        pincode: formData.pincode || '474005',
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        userId: customerUser?.id || null
      };

      const reqHeaders = { 'Content-Type': 'application/json' };
      if (customerToken) reqHeaders['Authorization'] = `Bearer ${customerToken}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify(payload)
      });

      const data = await parseResponseJson(res);

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      const orderNo = data.order?.orderNumber || 'PM-' + Math.floor(100000 + Math.random() * 900000);
      
      setPlacedOrderDetails({
        orderNo,
        items: [...cartItems],
        subtotal,
        promoDiscount,
        finalTotal,
        appliedPromo,
        fulfillmentType,
        paymentMethod: 'Cash on Delivery',
        customer: { ...formData }
      });

      clearCart();
      setIsSuccess(true);
    } catch (err) {
      console.error('COD Order Error:', err);
      setErrorMessage(err.message || 'Error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Razorpay Online Payment Handler
  const handleRazorpayPayment = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const headers = { 'Content-Type': 'application/json' };
      if (customerToken) headers['Authorization'] = `Bearer ${customerToken}`;

      // Create Razorpay Order on server
      const createRes = await fetch('/api/payment/create-razorpay-order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: finalTotal,
          receipt: `rcpt_${Date.now()}`
        })
      });

      const createData = await parseResponseJson(createRes);
      if (!createRes.ok || !createData.success) {
        throw new Error(createData.error || 'Failed to initiate Razorpay payment.');
      }

      // Open Razorpay Popup
      const options = {
        key: createData.key,
        amount: createData.amount,
        currency: createData.currency || 'INR',
        name: 'Prem Mobile Gwalior',
        description: `Payment for ${cartItems.length} items`,
        image: 'https://res.cloudinary.com/iuuqceor/image/upload/v1740920000/prem_logo.png',
        order_id: createData.razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email || '',
          contact: formData.phone
        },
        theme: {
          color: '#ffd000'
        },
        handler: async function (response) {
          try {
            const verifyHeaders = { 'Content-Type': 'application/json' };
            if (customerToken) verifyHeaders['Authorization'] = `Bearer ${customerToken}`;

            const verifyRes = await fetch('/api/payment/verify-razorpay-payment', {
              method: 'POST',
              headers: verifyHeaders,
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || createData.razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || 'verified_sig',
                customerDetails: {
                  customerName: formData.name,
                  mobile: formData.phone,
                  email: formData.email,
                  address: fulfillmentType === 'pickup' ? 'Store Pickup at Pinto Park, Gwalior' : formData.address,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode
                },
                items: cartItems.map(item => ({
                  productId: item.id,
                  quantity: item.quantity
                })),
                notes: 'Paid via Razorpay Online',
                userId: customerUser?.id || null
              })
            });

            const verifyData = await parseResponseJson(verifyRes);
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }

            const orderNo = verifyData.order?.orderNumber || 'PM-' + Math.floor(100000 + Math.random() * 900000);

            setPlacedOrderDetails({
              orderNo,
              items: [...cartItems],
              subtotal,
              promoDiscount,
              finalTotal,
              appliedPromo,
              fulfillmentType,
              paymentMethod: 'Razorpay Online (Paid)',
              customer: { ...formData }
            });

            clearCart();
            setIsSuccess(true);
          } catch (err) {
            console.error('Payment verification error:', err);
            setErrorMessage(err.message || 'Payment received but order registration failed. Please contact store.');
          } finally {
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
      console.error('Razorpay Modal Error:', err);
      setErrorMessage(err.message || 'Something went wrong initiating Razorpay payment.');
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsAppReceipt = () => {
    if (!placedOrderDetails) return;

    const itemListStr = placedOrderDetails.items
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* ${
            item.selectedVariants ? `(${Object.values(item.selectedVariants).join(', ')})` : ''
          } x${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
      )
      .join('\n');

    const message = `Hello Prem Mobile (Gwalior),
*ORDER CONFIRMATION ${placedOrderDetails.orderNo}*

*Customer Details:*
• Name: ${placedOrderDetails.customer.name}
• Phone: ${placedOrderDetails.customer.phone}
• Mode: ${placedOrderDetails.fulfillmentType === 'pickup' ? 'Store Pickup at Pinto Park' : 'Home Delivery (' + placedOrderDetails.customer.address + ')'}
• Payment Method: ${placedOrderDetails.paymentMethod}

*Items Ordered:*
${itemListStr}

-------------------------
*Subtotal:* ₹${placedOrderDetails.subtotal.toLocaleString('en-IN')}
${placedOrderDetails.promoDiscount > 0 ? `*Promo Discount (${placedOrderDetails.appliedPromo?.code}):* -₹${placedOrderDetails.promoDiscount.toLocaleString('en-IN')}\n` : ''}*Total Amount Payable:* ₹${placedOrderDetails.finalTotal.toLocaleString('en-IN')}
-------------------------

Please confirm my order and share further pickup/delivery details.`;

    window.open(getWhatsAppUrl(message), '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto animate-fade-in flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl z-10 border border-slate-200 space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD400] text-[#050505] flex items-center justify-center shadow-sm font-black">
              <ShoppingBag className="w-5 h-5 text-[#050505]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-[#050505] uppercase tracking-wider">
                {isSuccess ? 'ORDER PLACED SUCCESSFULLY!' : 'COMPLETE YOUR PURCHASE'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Prem Mobile • Pinto Park, Gwalior
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess && placedOrderDetails ? (
          <div className="space-y-5 py-3 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                ORDER #{placedOrderDetails.orderNo}
              </span>
              <h3 className="font-display font-black text-2xl text-[#050505] mt-2">
                Thank You, {placedOrderDetails.customer.name}!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your order is registered live in our store database. Click below to send your digital receipt to our WhatsApp team or view your orders!
              </p>
            </div>

            {/* Order Items Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex justify-between font-bold text-slate-700 border-b border-slate-200 pb-2">
                <span>Order Total:</span>
                <span className="font-black text-base text-[#050505]">{formatCurrency(placedOrderDetails.finalTotal)}</span>
              </div>
              
              <div className="space-y-1.5 text-slate-600">
                <p><strong>Fulfillment Mode:</strong> {placedOrderDetails.fulfillmentType === 'pickup' ? 'Store Pickup at Pinto Park' : `Home Delivery (${placedOrderDetails.customer.address})`}</p>
                <p><strong>Payment Method:</strong> {placedOrderDetails.paymentMethod}</p>
                <p><strong>Mobile Number:</strong> {placedOrderDetails.customer.phone}</p>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <p className="font-bold text-slate-700">Items Ordered ({placedOrderDetails.items.length}):</p>
                <div className="max-h-32 overflow-y-auto divide-y divide-slate-100">
                  {placedOrderDetails.items.map((it, idx) => (
                    <div key={idx} className="py-1 flex justify-between text-[11px]">
                      <span>{it.name} × {it.quantity}</span>
                      <span className="font-bold">{formatCurrency(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleSendWhatsAppReceipt}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>SEND RECEIPT ON WHATSAPP</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate('/account');
                }}
                className="py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider shadow-md"
              >
                VIEW MY ORDERS
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleCompleteCheckout} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Fulfillment Choice */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                1. Order Fulfillment Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    fulfillmentType === 'pickup'
                      ? 'border-[#FFD400] bg-amber-50/60 shadow-sm ring-2 ring-[#FFD400]/40'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <MapPin className={`w-5 h-5 ${fulfillmentType === 'pickup' ? 'text-[#050505]' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-black text-[#050505]">Store Pickup</div>
                    <div className="text-[10px] text-slate-500">Free fitting & testing at Pinto Park</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    fulfillmentType === 'delivery'
                      ? 'border-[#FFD400] bg-amber-50/60 shadow-sm ring-2 ring-[#FFD400]/40'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <Truck className={`w-5 h-5 ${fulfillmentType === 'delivery' ? 'text-[#050505]' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-black text-[#050505]">Home Delivery</div>
                    <div className="text-[10px] text-slate-500">Gwalior Local Express Delivery</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Customer Information */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                2. Contact & Address Details
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Mobile Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {fulfillmentType === 'delivery' && (
                <textarea
                  name="address"
                  rows={2}
                  required
                  placeholder="Delivery Address in Gwalior (House/Flat No, Street, Landmark) *"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                />
              )}
            </div>

            {/* 3. Payment Method Options (Cash on Delivery vs Razorpay Online) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                3. Select Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-[#050505] bg-[#050505] text-[#FFD400] shadow-md ring-2 ring-[#FFD400]/50'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Banknote className={`w-4 h-4 ${paymentMethod === 'cod' ? 'text-[#FFD400]' : 'text-emerald-600'}`} />
                      <span className="font-display font-black text-xs uppercase tracking-wider">Cash on Delivery</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-[#FFD400] bg-[#FFD400]' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-[#050505]" />}
                    </div>
                  </div>
                  <p className={`text-[11px] mt-1.5 ${paymentMethod === 'cod' ? 'text-white/80' : 'text-slate-500'}`}>
                    Pay cash upon home delivery or pay at Pinto Park store during pickup.
                  </p>
                </button>

                {/* Razorpay Online */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#050505] bg-[#050505] text-[#FFD400] shadow-md ring-2 ring-[#FFD400]/50'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className={`w-4 h-4 ${paymentMethod === 'razorpay' ? 'text-[#FFD400]' : 'text-indigo-600'}`} />
                      <span className="font-display font-black text-xs uppercase tracking-wider">Razorpay Online</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'razorpay' ? 'border-[#FFD400] bg-[#FFD400]' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'razorpay' && <div className="w-1.5 h-1.5 rounded-full bg-[#050505]" />}
                    </div>
                  </div>
                  <p className={`text-[11px] mt-1.5 ${paymentMethod === 'razorpay' ? 'text-white/80' : 'text-slate-500'}`}>
                    Pay via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, QR Code & NetBanking.
                  </p>
                </button>

              </div>
            </div>

            {/* 4. Order Items Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-[#050505] uppercase tracking-wider">
                  4. Selected Items ({cartItems.length})
                </span>
                <span className="text-xs font-bold text-slate-500">{formatCurrency(subtotal)}</span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-200/60 max-h-48 overflow-y-auto pr-1 space-y-2">
                {cartItems.map((item) => (
                  <div key={item.cartItemId || item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image || '/images/prem-main.jpg'}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#050505] truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-xs font-black text-[#050505]">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 text-xs font-bold pt-1 border-t border-slate-200">
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    Promo Discount ({appliedPromo?.code}):
                  </span>
                  <span>-{formatCurrency(promoDiscount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-display font-black text-xs text-[#050505] uppercase tracking-wider">
                  Final Amount Payable:
                </span>
                <span className="font-display font-black text-xl text-[#050505]">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#FFD400] hover:bg-[#e6be00] disabled:bg-slate-200 disabled:text-slate-400 text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />
                  <span>PROCESSING YOUR ORDER...</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'razorpay' ? 'PAY & PLACE ORDER (RAZORPAY)' : 'CONFIRM & PLACE ORDER (COD)'}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Encrypted & Direct Store-Server Registered Transaction</span>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}

