import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { extractSpecifications } from '../utils/specExtractor';
import { parseResponseJson } from '../utils/apiHelper';
import { formatCurrency } from '../utils/formatters';
import { openProductWhatsApp } from '../utils/whatsapp';
import {
  Scale,
  ArrowLeft,
  Trash2,
  Plus,
  ShoppingBag,
  Zap,
  MessageCircle,
  Check,
  Star,
  ShieldCheck,
  Award,
  Sparkles,
  Share2,
  X,
  SlidersHorizontal
} from 'lucide-react';

export default function Compare() {
  const navigate = useNavigate();
  const { compareItems, removeFromCompare, addToCompare, clearCompare } = useCompare();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  const [availableProducts, setAvailableProducts] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => parseResponseJson(res))
      .then(data => {
        if (data.success) {
          setAvailableProducts(data.products || []);
        }
      })
      .catch(err => console.error('Error fetching catalog products for comparison:', err));
  }, []);

  const specsList = compareItems.map(item => extractSpecifications(item));

  // Determine highlights (best values across compared products)
  const lowestPrice = specsList.length > 0
    ? Math.min(...specsList.map(s => Number(s.price || 0)))
    : 0;

  const highestRating = specsList.length > 0
    ? Math.max(...specsList.map(s => Number(s.rating || 0)))
    : 0;

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setIsCartDrawerOpen(true);
  };

  const handleBuyNow = (product) => {
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Product Comparison - Prem Mobile Gwalior',
        text: `Check out this side-by-side comparison of ${compareItems.map(i => i.name).join(' vs ')} at Prem Mobile!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (compareItems.length === 0) {
    return (
      <div className="py-16 sm:py-24 bg-[#F6F6F6] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 text-[#E31B23] flex items-center justify-center mx-auto shadow-md">
            <Scale className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-black text-3xl text-slate-800">Your Comparison List is Empty</h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Select up to 4 products from our catalog to compare side-by-side specs, battery backup, prices, and features.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#050505] hover:bg-slate-800 text-[#FFD400] font-black text-xs uppercase tracking-wider shadow-lg transition"
          >
            <ShoppingBag className="w-4 h-4 text-[#FFD400]" />
            <span>BROWSE CATALOG & COMPARE</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#E31B23] transition mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-display font-black text-2xl text-slate-800">Product Specification Comparison</h1>
                <p className="text-xs text-slate-500">Side-by-side technical evaluation for Gwalior shoppers</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={clearCompare}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-2 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Comparison</span>
            </button>
          </div>
        </div>

        {/* COMPARISON MATRIX TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 sm:p-6 w-56 text-xs font-black text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                  Feature / Spec
                </th>

                {compareItems.map((product, idx) => (
                  <th key={product.id} className="p-4 sm:p-6 min-w-[220px] max-w-[280px] align-top border-r border-slate-200 last:border-r-0">
                    <div className="relative space-y-3">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute top-0 right-0 w-7 h-7 rounded-full bg-slate-200 hover:bg-rose-600 text-slate-600 hover:text-white flex items-center justify-center transition"
                        title="Remove column"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 p-2 mx-auto flex items-center justify-center">
                        <img
                          src={product.image || (product.images && product.images[0]) || '/images/prem-main.jpg'}
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = '/images/prem-main.jpg'; }}
                        />
                      </div>

                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                        <h3 className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[40px]">{product.name}</h3>
                      </div>

                      {/* Primary CTAs */}
                      <div className="space-y-2 pt-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={() => handleBuyNow(product)}
                          className="w-full py-2 px-3 rounded-xl bg-[#E31B23] hover:bg-[#c91219] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Buy Now</span>
                        </button>

                        <button
                          onClick={() => openProductWhatsApp(product)}
                          className="w-full py-2 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Enquire</span>
                        </button>
                      </div>
                    </div>
                  </th>
                ))}

                {/* Add product column placeholder if < 4 items */}
                {compareItems.length < 4 && (
                  <th className="p-4 sm:p-6 min-w-[200px] align-middle text-center bg-slate-50/50">
                    <div className="space-y-3 p-4 border-2 border-dashed border-slate-300 rounded-2xl">
                      <Plus className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-600">Add Another Product</p>
                      <select
                        onChange={(e) => {
                          const selectedId = Number(e.target.value);
                          const prod = availableProducts.find(p => p.id === selectedId);
                          if (prod) addToCompare(prod);
                        }}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white text-slate-700"
                        defaultValue=""
                      >
                        <option value="" disabled>Select catalog item...</option>
                        {availableProducts
                          .filter(p => !compareItems.some(ci => ci.id === p.id))
                          .map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({formatCurrency(p.price || p.regularPrice)})</option>
                          ))}
                      </select>
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              
              {/* PRICE ROW */}
              <tr>
                <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50 sticky left-0 border-r border-slate-200">
                  Price & Offer
                </td>
                {specsList.map((spec) => {
                  const isBest = spec.price === lowestPrice;
                  return (
                    <td key={spec.id} className="p-4 sm:p-5 border-r border-slate-100 last:border-r-0">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-black text-[#E31B23]">{formatCurrency(spec.price)}</span>
                          {spec.originalPrice > spec.price && (
                            <span className="text-slate-400 line-through text-xs">{formatCurrency(spec.originalPrice)}</span>
                          )}
                        </div>
                        {isBest && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <Sparkles className="w-3 h-3 text-emerald-600" /> Best Price
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {compareItems.length < 4 && <td className="bg-slate-50/50"></td>}
              </tr>

              {/* BRAND ROW */}
              <tr>
                <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50 sticky left-0 border-r border-slate-200">
                  Brand & Lineage
                </td>
                {specsList.map((spec) => (
                  <td key={spec.id} className="p-4 sm:p-5 font-bold text-slate-800 border-r border-slate-100 last:border-r-0">
                    {spec.brand}
                  </td>
                ))}
                {compareItems.length < 4 && <td className="bg-slate-50/50"></td>}
              </tr>

              {/* RATING ROW */}
              <tr>
                <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50 sticky left-0 border-r border-slate-200">
                  Customer Rating
                </td>
                {specsList.map((spec) => {
                  const isTop = spec.rating === highestRating;
                  return (
                    <td key={spec.id} className="p-4 sm:p-5 border-r border-slate-100 last:border-r-0">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>{spec.rating} / 5.0</span>
                        <span className="text-slate-400 text-[11px] font-normal">({spec.reviewsCount} reviews)</span>
                      </div>
                      {isTop && (
                        <span className="text-[10px] font-bold text-amber-600 block mt-1">★ Top Customer Rated</span>
                      )}
                    </td>
                  );
                })}
                {compareItems.length < 4 && <td className="bg-slate-50/50"></td>}
              </tr>

              {/* DRIVER / DISPLAY ROW */}
              <tr>
                <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50 sticky left-0 border-r border-slate-200">
                  Driver / Display Specs
                </td>
                {specsList.map((spec) => (
                  <td key={spec.id} className="p-4 sm:p-5 border-r border-slate-100 last:border-r-0 font-semibold text-slate-800">
                    {spec.driverSize}
                  </td>
                ))}
                {compareItems.length < 4 && <td className="bg-slate-50/50"></td>}
              </tr>

              {/* BATTERY LIFE ROW */}
              <tr>
                <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50 sticky left-0 border-r border-slate-200">
                  Battery Life / Playtime
                </td>
                {specsList.map((spec) => (
                  <td key={spec.id} className="p-4 sm:p-5 border-r border-slate-100 last:border-r-0 font-bold text-emerald-700 bg-emerald-50/30">
                    {spec.batteryLife}
                  </td>
                ))}
                {compareItems.length < 4 && <td className="bg-slate-50/50"></td>}
              </tr>

              {/* CHARGING SPEED ROW */}
              <tr>
                <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50 sticky left-0 border-r border-slate-200">
                  Fast Charging
                </td>
                {specsList.map((spec) => (
                  <td key={spec.id} className="p-4 sm:p-5 border-r border-slate-100 last:border-r-0">
                    {spec.chargingTime}
                  </td>
                ))}
                {compareItems.length < 4 && <td className="bg-slate-50/50"></td>}
              </tr>

              {/* BLUETOOTH / CONNECTIVITY ROW */}
              <tr>
                <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50 sticky left-0 border-r border-slate-200">
                  Bluetooth / Connectivity
                </td>
                {specsList.map((spec) => (
                  <td key={spec.id} className="p-4 sm:p-5 border-r border-slate-100 last:border-r-0">
                    {spec.bluetoothVersion}
                  </td>
                ))}
                {compareItems.length < 4 && <td className="bg-slate-50/50"></td>}
              </tr>

              {/* IP RATING ROW */}
              <tr>
                <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50 sticky left-0 border-r border-slate-200">
                  Water & Dust Protection
                </td>
                {specsList.map((spec) => (
                  <td key={spec.id} className="p-4 sm:p-5 border-r border-slate-100 last:border-r-0">
                    {spec.ipRating}
                  </td>
                ))}
                {compareItems.length < 4 && <td className="bg-slate-50/50"></td>}
              </tr>

              {/* WARRANTY ROW */}
              <tr>
                <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50 sticky left-0 border-r border-slate-200">
                  Warranty & Guarantee
                </td>
                {specsList.map((spec) => (
                  <td key={spec.id} className="p-4 sm:p-5 border-r border-slate-100 last:border-r-0">
                    <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                      <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{spec.warranty}</span>
                    </div>
                  </td>
                ))}
                {compareItems.length < 4 && <td className="bg-slate-50/50"></td>}
              </tr>

              {/* STORE PICKUP ROW */}
              <tr>
                <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50 sticky left-0 border-r border-slate-200">
                  Availability
                </td>
                {specsList.map((spec) => (
                  <td key={spec.id} className="p-4 sm:p-5 border-r border-slate-100 last:border-r-0 font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> {spec.stock}
                    </span>
                  </td>
                ))}
                {compareItems.length < 4 && <td className="bg-slate-50/50"></td>}
              </tr>

            </tbody>
          </table>
        </div>

        {/* SEO SPECIFICATION COMPARISON & SHOPPING GUIDE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 mt-10">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-black text-[#E31B23] uppercase tracking-wider block mb-1">
              PREM MOBILE GWALIOR • PRODUCT COMPARISON & TECH EVALUATION GUIDE
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-800">
              Compare Mobile & Electronics Specs Side-by-Side
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Making the right choice between smartphones or wireless audio accessories can be challenging. Prem Mobile's comparison matrix evaluates up to 4 devices side-by-side across essential parameters including price, battery playtime, fast charging speed, driver dimensions, IP water resistance, warranty coverage, and customer ratings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-display font-black text-base text-slate-800">📊 Side-by-Side Spec Evaluation</h3>
              <p>
                Compare technical specifications, battery capacities, screen refresh rates, audio driver sizes, and charging speeds to determine which gadget fits your exact usage requirements.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-display font-black text-base text-slate-800">⭐ Verified Customer Ratings</h3>
              <p>
                Review real customer ratings and feedback alongside technical specifications to ensure you invest in a reliable device with proven customer satisfaction.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-display font-black text-base text-slate-800">🏬 Live Demo at Pinto Park Store</h3>
              <p>
                Need help deciding? Visit Prem Mobile at Pinto Park, Gwalior to test audio clarity, mic performance, screen brightness, and phone ergonomics in person with store staff.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
