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
  AlertCircle
} from 'lucide-react';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!formData.customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please enter your delivery / pickup address.');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage('Please enter your city.');
      return;
    }
    if (!formData.state.trim()) {
      setErrorMessage('Please enter your state.');
      return;
    }
    if (!formData.pincode.trim()) {
      setErrorMessage('Please enter your area pincode.');
      return;
    }

    setIsSubmitting(true);

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

      // Order created successfully
      clearCart();
      navigate(`/order-success?orderNo=${data.order.orderNumber}`);
    } catch (err) {
      console.error('Order placement error:', err);
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

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: CUSTOMER FORM FIELDS */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
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

            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Your personal info is safe and only used for your Prem Mobile order fulfilment.</span>
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
                className="w-full py-4 rounded-xl bg-[#ffd000] hover:bg-[#e6bd00] disabled:bg-slate-200 disabled:text-slate-400 text-[#050505] font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                {isSubmitting ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#050505]" />
                    <span>PLACE ORDER</span>
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
