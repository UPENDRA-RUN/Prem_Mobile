import React from 'react';
import { Link } from 'react-router-dom';
import { useSale } from '../context/SaleContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { openGeneralWhatsApp } from '../utils/whatsapp';
import {
  Flame,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Calendar
} from 'lucide-react';

export default function Sale() {
  const { isLive, status, sale, items, message, isLoading } = useSale();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  const handleAddSaleItem = (item) => {
    addToCart(item, 1, {});
    setIsCartDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-[#ffd000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-500">Checking active deals...</p>
      </div>
    );
  }

  // ==========================================
  // STATE 1: SALE IS OFFLINE (BEFORE ADMIN ACTIVATION)
  // ==========================================
  if (!isLive) {
    return (
      <div className="py-12 sm:py-16 bg-[#f8fafc] min-h-[80vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          
          {/* OFFLINE NOTICE HERO */}
          <div className="bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-14 border border-slate-200 shadow-xl space-y-6">
            
            <div className="w-20 h-20 rounded-3xl bg-red-50 text-[#e51b23] flex items-center justify-center mx-auto border-2 border-red-100 shadow-sm">
              <Clock className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>SALE IS CURRENTLY OFFLINE</span>
              </span>

              <h1 className="font-display font-black text-2xl sm:text-4xl text-[#050505] tracking-tight">
                Special Deals Coming Soon!
              </h1>

              <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Our flash sales and exclusive deals are announced regularly. 
                Products are currently available at our standard verified store rates.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#ffd000] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
              >
                <ShoppingBag className="w-4 h-4 text-[#050505]" />
                <span>EXPLORE ALL PRODUCTS</span>
              </Link>

              <button
                onClick={() => openGeneralWhatsApp('I want alerts for upcoming flash sales')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>NOTIFY ME ON WHATSAPP</span>
              </button>
            </div>

          </div>

          {/* STORE PROMISE BADGES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <span className="font-bold text-xs text-[#050505] block">100% Genuine</span>
                <span className="text-[11px] text-slate-500">Original brand warranties</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#ffd000] shrink-0" />
              <div>
                <span className="font-bold text-xs text-[#050505] block">Pinto Park Store</span>
                <span className="text-[11px] text-slate-500">Fast pickup & testing</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#e51b23] shrink-0" />
              <div>
                <span className="font-bold text-xs text-[#050505] block">Best Rates</span>
                <span className="text-[11px] text-slate-500">Unbeatable offline prices</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // STATE 2: SALE IS LIVE (ADMIN ACTIVATED)
  // ==========================================
  return (
    <div className="py-8 sm:py-12 bg-[#f8fafc] min-h-screen space-y-10">
      
      {/* 1. LIVE HERO BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden bg-gradient-to-r from-black via-[#1c0808] to-black border-2 border-[#ffd000] p-6 sm:p-12 text-white shadow-2xl">
          
          {/* Flame Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#e51b23]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ffd000]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e51b23] text-white font-black text-xs uppercase tracking-wider shadow-md animate-pulse">
                <Flame className="w-4 h-4 fill-white" />
                <span>🟢 SALE IS LIVE</span>
              </span>

              {sale?.startDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#ffd000] text-xs font-bold border border-[#ffd000]/30">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Limited Time Event</span>
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
              🔥 {sale?.name || 'SPECIAL FLASH SALE'}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Special promotional discounts available now! Verified authentic products with store warranty. Order online or reserve via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* 2. LIVE PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-display font-black text-xl text-[#050505]">
              Featured Sale Products ({items.length})
            </h2>
            <p className="text-xs text-slate-500">
              Special prices applied automatically at checkout.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            In Stock & Ready to Ship
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border-2 border-amber-200/80 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative group"
            >
              {/* Discount Flame Badge */}
              <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#e51b23] text-white font-black text-xs flex items-center gap-1 shadow-md">
                <Flame className="w-3 h-3 fill-white" />
                <span>{item.discountPercent}% OFF</span>
              </span>

              {/* Product Image */}
              <Link to={`/product/${item.id}`} className="block relative aspect-square mb-4 overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Product Info */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {item.category} • {item.brand}
                </span>

                <Link to={`/product/${item.id}`} className="font-display font-black text-sm text-[#050505] hover:text-[#e51b23] transition-colors line-clamp-2 block leading-snug">
                  {item.name}
                </Link>

                {/* PRICING BLOCK */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-display text-[#e51b23]">
                      {formatCurrency(item.salePrice)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {formatCurrency(item.regularPrice)}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">
                    Save {formatCurrency(item.savings)} today
                  </span>
                </div>
              </div>

              {/* CTA BUTTONS */}
              <div className="pt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddSaleItem(item)}
                  className="py-2.5 px-3 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#050505]" />
                  <span>ADD TO CART</span>
                </button>

                <Link
                  to={`/product/${item.id}`}
                  className="py-2.5 px-3 rounded-xl bg-[#050505] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                >
                  <span>VIEW DETAILS</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
