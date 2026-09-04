import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Check, ShieldCheck, Zap } from 'lucide-react';
import { fetchLaravelProducts } from '../../api/laravel';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export default function SuggestedAddons({ compact = false }) {
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchLaravelProducts().then(res => {
      if (res.success) setProducts(res.data || []);
    });
  }, []);

  // Get add-on items or accessory items not yet in cart
  const addonItems = products.filter((p) => p.isAddon || p.categorySlug === 'accessories');

  const cartItemIds = new Set(cart.map((item) => item.id));

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#050505] flex items-center justify-center border border-amber-300">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
          </div>
          <div>
            <h3 className="font-display font-black text-sm text-[#050505] uppercase tracking-wider">
              Suggested Add-ons
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Frequently bought together with cart items
            </p>
          </div>
        </div>
      </div>

      <div className={`grid ${compact ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
        {addonItems.map((addon) => {
          const isAdded = cartItemIds.has(addon.id);

          return (
            <div
              key={addon.id}
              className="group p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#FFD400] transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl bg-white p-1 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={addon.image}
                    alt={addon.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-black text-[#E31B23] uppercase tracking-wider block">
                    {addon.tag || 'STORE SPECIAL'}
                  </span>
                  <h4 className="text-xs font-bold text-[#050505] line-clamp-1">
                    {addon.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xs font-black text-[#050505]">
                      {formatCurrency(addon.price)}
                    </span>
                    {addon.originalPrice > addon.price && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatCurrency(addon.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => addToCart(addon, 1)}
                disabled={isAdded}
                className={`w-full py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  isAdded
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] shadow-xs hover:shadow-md'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add +{formatCurrency(addon.price)}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
