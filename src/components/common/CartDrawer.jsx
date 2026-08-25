import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { openCartWhatsApp } from '../../utils/whatsapp';
import { storeConfig } from '../../config/store';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ArrowRight
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
    clearCart
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
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
                  ENQUIRY CART ({totalItems})
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
                    Your Enquiry Cart is Empty
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore smartphones, boAt bassheads, power banks, chargers and add items to enquire.
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
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[10px] font-black text-[#E31B23] uppercase">
                            {item.brand}
                          </span>
                          <h4 className="text-xs font-bold text-[#050505] line-clamp-1">
                            {item.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
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
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-black"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#050505]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-black"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-600">Total Estimated:</span>
                <span className="font-display font-black text-lg text-[#050505]">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="space-y-2">
                {/* WhatsApp Enquiry Button */}
                <button
                  onClick={() => {
                    openCartWhatsApp(cartItems, subtotal);
                    setIsCartDrawerOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>ENQUIRE ON WHATSAPP ({totalItems} ITEMS)</span>
                </button>

                {/* View Cart Page Link */}
                <Link
                  to="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#050505] hover:bg-[#1a1a1a] text-[#FFD400] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#FFD400]/40"
                >
                  <span>VIEW FULL CART</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>📍 Store Pickup: Pinto Park, Gwalior</span>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:underline"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
