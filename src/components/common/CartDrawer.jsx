import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { openCartWhatsApp } from '../../utils/whatsapp';
import { storeConfig } from '../../config/store';
import SuggestedAddons from '../cart/SuggestedAddons';
import CheckoutModal from '../cart/CheckoutModal';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  Ticket,
  ShieldCheck,
  Phone
} from 'lucide-react';

export default function CartDrawer() {
  const {
    cartItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    clearCart,
    appliedPromo,
    promoDiscount,
    finalTotal
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartDrawerOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
          onClick={() => setIsCartDrawerOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-6 bg-[#050505] text-white flex items-center justify-between border-b-2 border-[#FFD400]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#FFD400] flex items-center justify-center border border-[#FFD400]/40">
                  <ShoppingBag className="w-4 h-4 text-[#FFD400]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-sm uppercase tracking-wider text-white">
                    SHOPPING CART ({totalItems})
                  </h2>
                  <p className="text-[10px] text-[#FFD400] font-bold">
                    “{storeConfig.tagline}”
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-yellow-50 text-[#050505] flex items-center justify-center border border-[#FFD400]">
                    <ShoppingBag className="w-8 h-8 text-[#050505]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#050505]">
                      Your Cart is Empty
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Explore smartphones, boAt bassheads, power banks, chargers and add items to purchase or enquire.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#FFD400] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#e6be00]"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cartItems.map((item) => {
                      const itemKey = item.cartItemId || item.id;

                      return (
                        <div
                          key={itemKey}
                          className="flex gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                        >
                          <Link
                            to={`/product/${item.id}`}
                            onClick={() => setIsCartDrawerOpen(false)}
                            className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 flex-shrink-0 flex items-center justify-center"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </Link>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <span className="text-[10px] font-black text-[#E31B23] uppercase">
                                  {item.brand}
                                </span>
                                <Link
                                  to={`/product/${item.id}`}
                                  onClick={() => setIsCartDrawerOpen(false)}
                                >
                                  <h4 className="text-xs font-bold text-[#050505] line-clamp-1 hover:text-[#E31B23]">
                                    {item.name}
                                  </h4>
                                </Link>

                                {/* VARIATION BADGES */}
                                {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-0.5">
                                    {Object.entries(item.selectedVariants).map(([k, v]) => (
                                      <span
                                        key={k}
                                        className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 uppercase"
                                      >
                                        {v}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => removeFromCart(itemKey)}
                                className="text-slate-400 hover:text-red-600 p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-black text-[#050505]">
                                {formatCurrency(item.price * item.quantity)}
                              </span>

                              {/* Qty Counter */}
                              <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                                <button
                                  onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                                  className="p-1 text-slate-500 hover:text-black"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-bold text-[#050505]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                                  className="p-1 text-slate-500 hover:text-black"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Compact Suggested Addons */}
                  <div className="pt-2">
                    <SuggestedAddons compact />
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3">
                
                {/* Price Breakdown */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                      <span>Promo Discount ({appliedPromo?.code}):</span>
                      <span>-{formatCurrency(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-200 font-bold">
                    <span className="text-slate-800">Final Total:</span>
                    <span className="font-display font-black text-lg text-[#050505]">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-1">
                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#050505]" />
                    <span>CHECKOUT NOW ({formatCurrency(finalTotal)})</span>
                  </button>

                  {/* WhatsApp Order Button */}
                  <button
                    onClick={() => {
                      openCartWhatsApp(cartItems, subtotal, appliedPromo, promoDiscount, finalTotal);
                      setIsCartDrawerOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WHATSAPP ORDER</span>
                  </button>

                  {/* View Cart Page Link */}
                  <Link
                    to="/cart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="w-full py-2 px-4 rounded-xl bg-[#050505] hover:bg-[#1a1a1a] text-[#FFD400] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#FFD400]/40"
                  >
                    <span>VIEW DETAILED CART</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Accepted Payment Logos preview */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                  <span>💳 Cards • UPI • Apple Pay • COD</span>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:underline font-bold"
                  >
                    Clear Cart
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal from Drawer */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
