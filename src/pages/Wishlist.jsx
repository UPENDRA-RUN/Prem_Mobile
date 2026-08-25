import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { openProductWhatsApp } from '../utils/whatsapp';
import { storeConfig } from '../config/store';
import RatingStars from '../components/common/RatingStars';
import { Heart, ShoppingBag, MessageCircle, Trash2, ArrowRight, Sparkles, Flame } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="rounded-3xl bg-[#050505] text-white p-6 sm:p-8 shadow-xl border-2 border-[#FFD400]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>SAVED ITEMS</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              MY SAVED WISHLIST ({wishlist.length})
            </h1>
            <p className="text-xs sm:text-sm text-[#FFD400] font-bold mt-0.5">
              “{storeConfig.tagline}”
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-red-900/50 text-slate-300 hover:text-white text-xs font-bold transition-colors border border-white/10"
            >
              Clear Entire Wishlist
            </button>
          )}
        </div>

        {/* Wishlist Items List */}
        {wishlist.length === 0 ? (
          <div className="py-16 bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 fill-[#E31B23]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-[#050505]">Your Wishlist is Empty</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore our electronics, earbuds and gadgets, then click the heart icon to save your favorites!
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] text-xs font-black uppercase tracking-wider shadow-md transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200 p-4 shadow-sm hover:shadow-card-hover hover:border-[#FFD400] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-2xl bg-slate-50 overflow-hidden mb-3 p-3 flex items-center justify-center border border-slate-100">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-[#E31B23] hover:bg-red-50 flex items-center justify-center shadow-xs transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link to={`/product/${item.id}`} className="w-full h-full flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    </Link>
                  </div>

                  <span className="text-[11px] font-black text-[#E31B23] uppercase">
                    {item.brand}
                  </span>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-bold text-xs sm:text-sm text-[#050505] line-clamp-2 hover:text-[#E31B23] transition-colors mt-0.5">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-black font-display text-[#050505]">
                      {formatCurrency(item.price)}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="py-2 px-2 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Cart</span>
                  </button>

                  <button
                    onClick={() => openProductWhatsApp(item)}
                    className="py-2 px-2 rounded-xl bg-[#050505] hover:bg-[#1f1f1f] text-[#FFD400] text-xs font-bold flex items-center justify-center gap-1 border border-[#FFD400]/40"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-[#FFD400]" />
                    <span>Enquire</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
