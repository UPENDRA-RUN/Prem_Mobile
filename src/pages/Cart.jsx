import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { openCartWhatsApp } from '../utils/whatsapp';
import { storeConfig } from '../config/store';
import SuggestedAddons from '../components/cart/SuggestedAddons';
import VariantEditModal from '../components/cart/VariantEditModal';
import CheckoutModal from '../components/cart/CheckoutModal';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Flame,
  Ticket,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  HelpCircle,
  Phone,
  CreditCard,
  Lock,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    clearCart,
    appliedPromo,
    promoError,
    promoSuccess,
    applyPromoCode,
    removePromoCode,
    promoDiscount,
    finalTotal
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [editingVariantItem, setEditingVariantItem] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    applyPromoCode(promoInput);
  };

  const handleWhatsAppEnquiry = () => {
    openCartWhatsApp(cartItems, subtotal, appliedPromo, promoDiscount, finalTotal);
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-16 sm:py-24 bg-[#F6F6F6] min-h-[75vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 space-y-6">
          <div className="w-24 h-24 rounded-3xl bg-white border-2 border-[#FFD400] text-[#050505] flex items-center justify-center mx-auto shadow-lg relative">
            <ShoppingBag className="w-12 h-12 text-[#050505]" />
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#E31B23] text-white font-black text-xs flex items-center justify-center">
              0
            </span>
          </div>
          
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#050505]">
              Your Cart is Empty
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Browse our latest smartphones, boAt bassheads, smartwatches, and accessories to start your order.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105"
          >
            <span>EXPLORE PRODUCTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Quick Suggested Addons Even When Cart Empty */}
          <div className="pt-8 border-t border-slate-200">
            <SuggestedAddons compact />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="rounded-3xl bg-[#050505] text-white p-6 sm:p-8 shadow-xl border-2 border-[#FFD400]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>SHOPPING CART & STORE ENQUIRY</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
              MY SHOPPING CART ({totalItems} ITEMS)
            </h1>
            <p className="text-xs sm:text-sm text-[#FFD400] font-bold mt-0.5">
              “{storeConfig.tagline}”
            </p>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-xs font-bold transition-colors border border-white/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Items</span>
          </button>
        </div>

        {/* Cart Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items & Add-ons */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Cart Items List */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Selected Cart Items</span>
                <span>Review Quantities & Variations</span>
              </h2>

              {cartItems.map((item) => {
                const itemKey = item.cartItemId || item.id;
                const hasVariants = item.variants && Object.keys(item.variants).length > 0;

                return (
                  <div
                    key={itemKey}
                    className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:border-[#FFD400] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Item Image & Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 p-2 border border-slate-200 flex-shrink-0 flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </Link>

                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider">
                          {item.brand}
                        </span>
                        
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-bold text-sm sm:text-base text-[#050505] hover:text-[#E31B23] transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>

                        {/* DISPLAY ITEM VARIATIONS CLEARLY */}
                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {Object.entries(item.selectedVariants).map(([k, v]) => (
                              <span
                                key={k}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200 capitalize"
                              >
                                <span className="text-slate-400 font-semibold">{k}:</span>
                                <span>{v}</span>
                              </span>
                            ))}

                            {hasVariants && (
                              <button
                                onClick={() => setEditingVariantItem(item)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E31B23] hover:underline ml-1"
                              >
                                <SlidersHorizontal className="w-3 h-3" />
                                <span>Change</span>
                              </button>
                            )}
                          </div>
                        ) : hasVariants ? (
                          <button
                            onClick={() => setEditingVariantItem(item)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#E31B23] hover:underline pt-1"
                          >
                            <SlidersHorizontal className="w-3 h-3" />
                            <span>Select Variation</span>
                          </button>
                        ) : null}

                        <p className="text-xs text-slate-400 font-medium pt-0.5">
                          {formatCurrency(item.price)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls, Total & Delete */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                          className="p-1.5 text-slate-500 hover:text-black rounded-lg hover:bg-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#050505]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                          className="p-1.5 text-slate-500 hover:text-black rounded-lg hover:bg-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Subtotal */}
                      <div className="text-right min-w-[80px]">
                        <span className="font-display font-black text-base text-[#050505] block">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(itemKey)}
                        className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors"
                        title="Remove item from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* SUGGESTED ADD-ONS SECTION */}
            <SuggestedAddons />

            {/* LINK TO SUPPORT / HELP CARD */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#050505]">
                    Need Help With Your Cart or Custom Orders?
                  </h4>
                  <p className="text-xs text-slate-500">
                    Find instant answers in our FAQ or chat with store staff for custom requests and fitting.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                <Link
                  to="/faq"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#050505] font-bold text-xs uppercase tracking-wider transition-colors text-center"
                >
                  VIEW FAQ
                </Link>

                <a
                  href={`https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent('Hello Prem Mobile, I need assistance with the items in my cart.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary, Promo Code, Payment Logos, Checkout CTA */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h2 className="font-display font-black text-lg text-[#050505] pb-3 border-b border-slate-100 uppercase tracking-wider">
                ORDER SUMMARY
              </h2>

              {/* PROMO OR DISCOUNT CODE INPUT FIELD */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Promo / Discount Code</span>
                  <span className="text-[10px] text-[#E31B23] font-black lowercase">Try "PREM10"</span>
                </label>

                {appliedPromo ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-emerald-600" />
                      <div>
                        <strong className="font-black uppercase">{appliedPromo.code}</strong>
                        <span className="block text-[10px] text-emerald-600">{appliedPromo.description}</span>
                      </div>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Enter Promo Code"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#FFD400] bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#050505] hover:bg-[#1a1a1a] text-[#FFD400] font-black text-xs uppercase tracking-wider transition-colors border border-[#FFD400]/40"
                    >
                      APPLY
                    </button>
                  </form>
                )}

                {/* Instant Feedback Messages */}
                {promoSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{promoSuccess}</span>
                  </div>
                )}
                {promoError && (
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{promoError}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span>Total Cart Items:</span>
                  <span className="font-bold text-[#050505]">{totalItems}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Item Subtotal:</span>
                  <span className="font-bold text-[#050505]">{formatCurrency(subtotal)}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo Discount ({appliedPromo?.code}):</span>
                    <span>-{formatCurrency(promoDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Store Pickup & Fitting:</span>
                  <span className="font-bold text-emerald-600">FREE at Pinto Park</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-display font-black text-base text-[#050505]">
                    Final Amount Payable:
                  </span>
                  <span className="font-display font-black text-2xl text-[#050505]">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              {/* PROMINENT CHECKOUT BUTTON & WHATSAPP BUTTON */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
                >
                  <ShoppingBag className="w-4 h-4 text-[#050505]" />
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppEnquiry}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>SEND ENQUIRY VIA WHATSAPP</span>
                </button>
              </div>

              {/* ACCEPTED PAYMENT METHODS LOGOS */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center">
                  Accepted Payment & Order Methods
                </span>
                
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-800">
                    💳 Visa / Mastercard
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-800">
                    🇮🇳 RuPay
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-800">
                    ⚡ UPI / GPay / PhonePe
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-800">
                     Apple Pay
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-800">
                    🅿️ PayPal
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-[10px] font-black text-amber-900">
                    🏪 Store Cash / Pickup
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1 font-medium">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>256-Bit Encrypted & 100% Genuine Store Assurance</span>
                </div>
              </div>

              {/* Store Location Card */}
              <div className="p-4 rounded-2xl bg-[#050505] text-white text-xs space-y-2 border border-[#FFD400]/40">
                <div className="flex items-center gap-1.5 text-[#FFD400] font-black uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>PICKUP LOCATION</span>
                </div>
                <p className="text-slate-300">
                  {storeConfig.address}
                </p>
                <p className="text-slate-400">
                  📞 Call: <strong className="text-white">{storeConfig.displayPhone}</strong>
                </p>
              </div>

              <Link
                to="/shop"
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#050505] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>CONTINUE SHOPPING</span>
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* Edit Variant Modal */}
      <VariantEditModal
        item={editingVariantItem}
        isOpen={!!editingVariantItem}
        onClose={() => setEditingVariantItem(null)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
