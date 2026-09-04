import React, { useState, useEffect } from 'react';
import { parseResponseJson } from '../utils/apiHelper';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { openGeneralWhatsApp } from '../utils/whatsapp';
import {
  Layers,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Package,
  Flame,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Plus
} from 'lucide-react';

export default function Combos() {
  const [combos, setCombos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, setIsCartDrawerOpen } = useCart();

  const fetchCombos = async () => {
    try {
      const res = await fetch('/api/combos');
      if (res.ok) {
        const data = await parseResponseJson(res);
        setCombos(data.combos || []);
      }
    } catch (err) {
      console.error('Failed to load combos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const handleAddComboToCart = (combo) => {
    // Construct combo item for cart
    const comboCartItem = {
      id: `combo-${combo.id}`,
      name: combo.name,
      image: combo.image,
      price: combo.comboPrice,
      salePrice: combo.comboPrice,
      regularPrice: combo.regularPrice,
      originalPrice: combo.regularPrice,
      category: 'Combo Pack',
      brand: 'Prem Mobile Combo',
      isCombo: true,
      bundledItems: combo.items
    };
    addToCart(comboCartItem, 1, {});
    setIsCartDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-[#ffd000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-500">Loading special combo packages...</p>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#f8fafc] min-h-screen space-y-10">
      
      {/* HERO BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden bg-gradient-to-r from-[#050505] via-[#111111] to-[#1c1200] border-2 border-[#ffd000] p-6 sm:p-12 text-white shadow-2xl">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd000]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e51b23]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ffd000] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md">
              <Sparkles className="w-4 h-4 text-[#050505]" />
              <span>SPECIAL BUNDLE PACKAGES</span>
            </span>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
              🔥 Super Combo Deals
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Buy bundled packages of smartphones, earphone accessories, power banks, and chargers together to save massive extra discounts at Prem Mobile Pinto Park!
            </p>
          </div>
        </div>
      </div>

      {/* COMBOS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-display font-black text-xl text-[#050505]">
              Featured Combo Bundles ({combos.length})
            </h2>
            <p className="text-xs text-slate-500">
              Complete bundle packs with instant savings applied.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            100% Original Brand Guarantee
          </span>
        </div>

        {combos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-display font-black text-lg text-slate-900">No Active Combo Deals Available Right Now</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check back soon! New bundle packages and combo deals are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="bg-white rounded-3xl border-2 border-amber-200/90 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative group"
              >
                {/* Discount Badge */}
                <span className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full bg-[#e51b23] text-white font-black text-xs flex items-center gap-1 shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>{combo.badgeText || `${combo.discountPercent}% OFF`}</span>
                </span>

                <div className="space-y-4">
                  {/* Combo Image */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center p-3 sm:p-4 border border-slate-100">
                    <img
                      src={combo.image || '/images/placeholder.jpg'}
                      alt={combo.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Price */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      COMBO PACKAGE
                    </span>
                    <h3 className="font-display font-black text-base sm:text-lg text-[#050505] leading-snug">
                      {combo.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {combo.description || 'Complete package deal bundled for maximum savings.'}
                    </p>
                  </div>

                  {/* PRICING */}
                  <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Combo Offer Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black font-display text-[#e51b23]">
                          {formatCurrency(combo.comboPrice)}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400 line-through">
                          {formatCurrency(combo.regularPrice)}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl">
                      Save {formatCurrency(combo.savings)}
                    </span>
                  </div>

                  {/* BUNDLED ITEMS LIST */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Included In This Bundle ({combo.items.length}):
                    </span>
                    <div className="space-y-1.5">
                      {combo.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="line-clamp-1">{item.name} {item.quantity > 1 ? `(x${item.quantity})` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-5 grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleAddComboToCart(combo)}
                    className="py-3 px-3 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#050505]" />
                    <span>ADD COMBO</span>
                  </button>

                  <button
                    onClick={() => openGeneralWhatsApp(`Enquiry for ${combo.name} - ₹${combo.comboPrice}`)}
                    className="py-3 px-3 rounded-xl bg-[#050505] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#ffd000]" />
                    <span>ENQUIRE</span>
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
