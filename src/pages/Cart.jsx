import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { openCartWhatsApp } from '../utils/whatsapp';
import { storeConfig } from '../config/store';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Flame
} from 'lucide-react';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    clearCart
  } = useCart();

  const handleWhatsAppEnquiry = () => {
    openCartWhatsApp(cartItems, subtotal);
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-16 sm:py-24 bg-[#F6F6F6] min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-white border-2 border-[#FFD400] text-[#050505] flex items-center justify-center mx-auto shadow-md">
            <ShoppingBag className="w-10 h-10 text-[#050505]" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-[#050505]">
              Your Enquiry Cart is Empty
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              You haven't added any products yet. Browse our smartphones, audio gear, and gadgets to start an enquiry.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105"
          >
            <span>EXPLORE PRODUCTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="rounded-3xl bg-[#050505] text-white p-6 sm:p-8 mb-8 shadow-xl border-2 border-[#FFD400]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>DIRECT STORE ENQUIRY</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
              MY ENQUIRY CART ({totalItems})
            </h1>
            <p className="text-xs sm:text-sm text-[#FFD400] font-bold mt-0.5">
              “{storeConfig.tagline}”
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold text-slate-400 hover:text-red-400 underline"
          >
            Clear All Items
          </button>
        </div>

        {/* Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:border-[#FFD400] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 p-2 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-black text-[#E31B23] uppercase">
                      {item.brand}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-[#050505] line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-end sm:self-center">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-slate-500 hover:text-black rounded-lg hover:bg-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#050505]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-slate-500 hover:text-black rounded-lg hover:bg-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-black text-base text-[#050505] block">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-600 p-2"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Enquiry Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h2 className="font-display font-black text-lg text-[#050505] pb-3 border-b border-slate-100 uppercase tracking-wider">
              ENQUIRY SUMMARY
            </h2>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-bold text-[#050505]">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Value:</span>
                <span className="font-bold text-[#050505]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Store Pickup:</span>
                <span className="font-bold text-emerald-600">FREE at Pinto Park</span>
              </div>
              <div className="flex justify-between">
                <span>Screen Guard Fitting:</span>
                <span className="font-bold text-emerald-600">FREE in Store</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-display font-black text-base text-[#050505]">
                  Estimated Total:
                </span>
                <span className="font-display font-black text-xl text-[#050505]">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Enquiry Button */}
            <button
              onClick={handleWhatsAppEnquiry}
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>SEND ENQUIRY VIA WHATSAPP</span>
            </button>

            {/* Store Information Card */}
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
  );
}
