import React, { useState } from 'react';
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
  Ticket
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { storeConfig } from '../../config/store';
import { getWhatsAppUrl } from '../../utils/whatsapp';

export default function CheckoutModal({ isOpen, onClose }) {
  const {
    cartItems,
    subtotal,
    appliedPromo,
    promoDiscount,
    finalTotal,
    clearCart
  } = useCart();

  const [fulfillmentType, setFulfillmentType] = useState('pickup'); // 'pickup' | 'delivery'
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi' | 'card'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteCheckout = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please enter your Name and Mobile Number.');
      return;
    }

    const orderNo = 'PM-' + Math.floor(100000 + Math.random() * 900000);
    const orderDetails = {
      orderNo,
      items: [...cartItems],
      subtotal,
      promoDiscount,
      finalTotal,
      appliedPromo,
      fulfillmentType,
      paymentMethod,
      customer: { ...formData },
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPlacedOrderDetails(orderDetails);
    setIsSuccess(true);
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
• Payment Method: ${placedOrderDetails.paymentMethod.toUpperCase()}

*Items Ordered:*
${itemListStr}

-------------------------
*Subtotal:* ₹${placedOrderDetails.subtotal.toLocaleString('en-IN')}
${placedOrderDetails.promoDiscount > 0 ? `*Promo Discount (${placedOrderDetails.appliedPromo?.code}):* -₹${placedOrderDetails.promoDiscount.toLocaleString('en-IN')}\n` : ''}*Total Amount Payable:* ₹${placedOrderDetails.finalTotal.toLocaleString('en-IN')}
-------------------------

Please confirm my order and share further pickup/delivery details.`;

    window.open(getWhatsAppUrl(message), '_blank');
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD400] text-[#050505] flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-[#050505] uppercase tracking-wider">
                {isSuccess ? 'Order Placed Successfully!' : 'Complete Your Purchase'}
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
          <div className="space-y-6 py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                ORDER #{placedOrderDetails.orderNo}
              </span>
              <h3 className="font-display font-black text-2xl text-[#050505] mt-2">
                Thank You, {placedOrderDetails.customer.name}!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your order is registered with Prem Mobile Store. Click below to instantly send your digital invoice to our WhatsApp desk.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex justify-between font-bold text-slate-700 border-b border-slate-200 pb-2">
                <span>Order Total:</span>
                <span className="font-black text-base text-[#050505]">{formatCurrency(placedOrderDetails.finalTotal)}</span>
              </div>
              <div className="space-y-1 text-slate-600">
                <p><strong>Fulfillment:</strong> {placedOrderDetails.fulfillmentType === 'pickup' ? 'Store Pickup (Pinto Park)' : 'Home Delivery'}</p>
                <p><strong>Payment Method:</strong> {placedOrderDetails.paymentMethod.toUpperCase()}</p>
                <p><strong>Contact Phone:</strong> {placedOrderDetails.customer.phone}</p>
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
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleCompleteCheckout} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            
            {/* Fulfillment Choice */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                1. Order Fulfillment Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    fulfillmentType === 'pickup'
                      ? 'border-[#FFD400] bg-amber-50/50 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <MapPin className={`w-5 h-5 ${fulfillmentType === 'pickup' ? 'text-[#050505]' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-black text-[#050505]">Store Pickup</div>
                    <div className="text-[10px] text-slate-500">Free fitting & testing</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    fulfillmentType === 'delivery'
                      ? 'border-[#FFD400] bg-amber-50/50 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <Truck className={`w-5 h-5 ${fulfillmentType === 'delivery' ? 'text-[#050505]' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-black text-[#050505]">Home Delivery</div>
                    <div className="text-[10px] text-slate-500">Gwalior Local Express</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
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
                  placeholder="Delivery Address in Gwalior (Area, Landmark, Pincode) *"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                />
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                3. Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay on Pickup/Delivery' },
                  { id: 'upi', label: 'UPI / QR Code', sub: 'GPay, PhonePe, Paytm' },
                  { id: 'card', label: 'Card / NetBanking', sub: 'Visa, Mastercard, RuPay' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === m.id
                        ? 'border-[#050505] bg-[#050505] text-[#FFD400]'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-black">{m.label}</div>
                    <div className="text-[9px] opacity-80">{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartItems.length} items):</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    Promo Discount ({appliedPromo?.code}):
                  </span>
                  <span>-{formatCurrency(promoDiscount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-display font-black text-sm text-[#050505]">
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
              className="w-full py-4 px-6 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
            >
              <span>CONFIRM & PLACE ORDER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
