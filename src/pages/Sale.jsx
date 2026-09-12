import React from 'react';
import { Link } from 'react-router-dom';
import { useSale } from '../context/SaleContext';
import { useCart } from '../context/CartContext';
import { formatCurrency, formatDateDDMMYYYY } from '../utils/formatters';
import { openGeneralWhatsApp } from '../utils/whatsapp';
import CountdownTimer from '../components/common/CountdownTimer';
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
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');

  const handleAddSaleItem = (item) => {
    addToCart(item, 1, {});
    setIsCartDrawerOpen(true);
  };

  const categories = React.useMemo(() => {
    const set = new Set(items.map(i => i.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [items]);

  const filteredItems = React.useMemo(() => {
    if (selectedCategory === 'ALL') return items;
    return items.filter(i => i.category === selectedCategory);
  }, [items, selectedCategory]);

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

            {/* UPCOMING SCHEDULE CARD */}
            {sale && (
              <div className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-[#ffd000] text-left max-w-md mx-auto space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd000]/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-black text-[#ffd000] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#ffd000]" />
                    <span>NEXT SCHEDULED SALE</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded-full">
                    OFFICIAL EVENT
                  </span>
                </div>

                <h3 className="font-display font-black text-lg text-white">
                  🔥 {sale.name || 'Sunday Shocking Sale'}
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-2xl bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Sale Date</span>
                    <span className="font-mono font-black text-[#ffd000] text-sm block">
                      {formatDateDDMMYYYY(sale.startDate) || 'Upcoming'}
                    </span>
                    {sale.endDate && sale.endDate !== sale.startDate && (
                      <span className="text-[10px] text-slate-400 block">to {formatDateDDMMYYYY(sale.endDate)}</span>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Sale Timings</span>
                    <span className="font-mono font-black text-emerald-400 text-xs block">
                      {sale.startTime ? `${sale.startTime}` : '00:01'} – {sale.endTime ? `${sale.endTime}` : '23:59'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {sale.startTime ? 'Scheduled Window' : 'Full Day Event'}
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                onClick={() => openGeneralWhatsApp(`I want alerts for next sale on ${formatDateDDMMYYYY(sale?.startDate) || 'upcoming Sunday'}`)}
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
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden bg-gradient-to-r from-black via-[#1c0808] to-black border-2 border-[#ffd000] p-4 sm:p-12 text-white shadow-2xl">
          
          {/* Flame Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#e51b23]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ffd000]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
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

              <h1 className="font-display font-black text-2xl sm:text-5xl text-white tracking-tight">
                🔥 {sale?.name || 'SPECIAL FLASH SALE'}
              </h1>

              <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
                Special promotional discounts available now! Verified authentic products with store warranty. Order online or reserve via WhatsApp.
              </p>
            </div>

            {/* Countdown Box */}
            {sale?.endDate && (
              <div className="p-3.5 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shrink-0 w-full sm:w-auto">
                <CountdownTimer endDate={sale.endDate} endTime={sale.endTime} size="normal" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. LIVE PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-display font-black text-lg sm:text-xl text-[#050505]">
              Featured Sunday Deals ({filteredItems.length})
            </h2>
            <p className="text-xs text-slate-500">
              Special prices applied automatically at checkout.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#050505] text-[#ffd000] shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'ALL' ? '🔥 All Deals' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border-2 border-amber-200/80 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative group"
            >
              {/* Discount Flame Badge */}
              <span className="absolute top-3.5 left-3.5 z-10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#e51b23] text-white font-black text-xs flex items-center gap-1 shadow-md">
                <Flame className="w-3 h-3 fill-white" />
                <span>{item.discountPercent}% OFF</span>
              </span>

              {/* Product Image */}
              <Link to={item.isCustom ? '#' : `/product/${item.id}`} className="block relative aspect-square mb-3 sm:mb-4 overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center p-3 sm:p-4">
                <img
                  src={item.image || '/images/prem-main.jpg'}
                  alt={item.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 transform-gpu backface-hidden [image-rendering:-webkit-optimize-contrast]"
                />
              </Link>

              {/* Product Info */}
              <div className="space-y-1.5 sm:space-y-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {item.category || 'Special Deal'} • {item.brand || 'Prem Mobile'}
                </span>

                <Link to={item.isCustom ? '#' : `/product/${item.id}`} className="font-display font-black text-xs sm:text-sm text-[#050505] hover:text-[#e51b23] transition-colors line-clamp-2 block leading-snug">
                  {item.name}
                </Link>

                {/* PRICING BLOCK */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black font-display text-[#e51b23]">
                      {formatCurrency(item.salePrice)}
                    </span>
                    {item.regularPrice > item.salePrice && (
                      <span className="text-xs sm:text-sm text-slate-400 line-through">
                        {formatCurrency(item.regularPrice)}
                      </span>
                    )}
                  </div>

                  {item.savings > 0 && (
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 block mt-0.5">
                      Save {formatCurrency(item.savings)} today
                    </span>
                  )}
                </div>
              </div>

              {/* CTA BUTTONS */}
              <div className="pt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddSaleItem(item)}
                  className="py-2.5 px-2 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-[#050505] font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#050505]" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  onClick={() => openGeneralWhatsApp(`Hi Prem Mobile! I want to order Sunday Sale Deal: ${item.name} for ₹${item.salePrice}`)}
                  className="py-2.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-colors text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WHATSAPP</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* SEO SUNDAY SALE & FLASH DISCOUNT GUIDE */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-black text-[#e51b23] uppercase tracking-wider block mb-1">
              PREM MOBILE GWALIOR • SUNDAY SHOPPING SALE & FLASH DEALS GUIDE
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#050505]">
              Prem Mobile Sunday Sale & Weekly Flash Discounts
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              The Prem Mobile Sunday Sale is Gwalior's premier weekly mobile discount event, offering massive price drops on smartphones, boAt basshead earbuds, 25W fast chargers, power banks, smartwatch bands, and electronic accessories. Every deal is verified server-side with authentic brand warranty coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200 space-y-2">
              <h3 className="font-display font-black text-base text-[#e51b23]">🔥 Server-Verified Sale Prices</h3>
              <p>
                All promotional prices are locked and verified directly by our server during checkout, ensuring transparent, tamper-proof discounts for online shoppers and store walk-ins alike.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-display font-black text-base text-[#050505]">💬 Instant WhatsApp Order Reservation</h3>
              <p>
                Reserve your favorite sale deal instantly by clicking the WhatsApp order button to chat directly with store staff at Pinto Park, Gwalior for fast pickup or local delivery.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-display font-black text-base text-[#050505]">🛡️ Original Brand Warranty Included</h3>
              <p>
                Sale pricing never compromises on product authenticity. Every discounted device comes complete with original tax billing and full manufacturer warranty.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
