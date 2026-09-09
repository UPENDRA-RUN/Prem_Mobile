import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, MessageCircle, Star, Scale } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { formatCurrency } from '../../utils/formatters';
import { openProductWhatsApp } from '../../utils/whatsapp';
import HighlightText from '../common/HighlightText';
import QuickEnquiryModal from './QuickEnquiryModal';

export default function ProductCard({ product, searchQuery = '' }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const isLiked = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const currentPrice = product.price ?? product.currentPrice ?? product.regularPrice ?? 0;
  const origPrice = product.originalPrice ?? product.regularPrice ?? 0;

  return (
    <>
      <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-2.5 min-[380px]:p-3 sm:p-4 shadow-sm hover:shadow-card-hover hover:border-[#FFD400] transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5">
        
        {/* TOP SECTION: IMAGE & METADATA */}
        <div>
          
          {/* 1:1 SQUARE ASPECT RATIO IMAGE CONTAINER */}
          <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl bg-[#f8fafc] overflow-hidden mb-2 sm:mb-2.5 p-2 flex items-center justify-center border border-slate-100/80">
            
            {/* Red Discount Badge */}
            {product.discount > 0 && (
              <span className="absolute top-2 left-2 z-10 px-1.5 min-[380px]:px-2 py-0.5 rounded-md bg-[#e51b23] text-white font-black text-[10px] sm:text-xs shadow-xs tracking-tight">
                -{product.discount}%
              </span>
            )}

            {/* Custom Tag (if any) */}
            {product.tag && (
              <span className="absolute bottom-2 left-2 z-10 px-1.5 py-0.5 rounded bg-black text-[#FFD400] font-bold text-[8.5px] sm:text-[9.5px] uppercase tracking-wider">
                {product.tag}
              </span>
            )}

            {/* Top Right Action Overlay (Wishlist + Compare) */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className={`w-7 h-7 min-[380px]:w-8 min-[380px]:h-8 rounded-full flex items-center justify-center transition-all shadow-xs ${
                  isLiked
                    ? 'bg-red-50 text-[#e51b23] scale-105'
                    : 'bg-white/95 text-slate-400 hover:text-[#e51b23] hover:bg-white'
                }`}
                aria-label="Toggle Wishlist"
                title="Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4 ${isLiked ? 'fill-[#e51b23] text-[#e51b23]' : ''}`} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCompare(product);
                }}
                className={`w-7 h-7 min-[380px]:w-8 min-[380px]:h-8 rounded-full flex items-center justify-center transition-all shadow-xs ${
                  isCompared
                    ? 'bg-[#050505] text-[#FFD400] scale-105'
                    : 'bg-white/95 text-slate-400 hover:text-[#050505] hover:bg-white'
                }`}
                aria-label="Toggle Compare"
                title={isCompared ? 'In Compare' : 'Add to Compare'}
              >
                <Scale className="w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4" />
              </button>
            </div>

            {/* Product Image (Fixed 1:1 Aspect, contain mode, no crop) */}
            <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
              <img
                src={product.image || '/images/prem-main.jpg'}
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/prem-main.jpg';
                }}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 transform-gpu backface-hidden [image-rendering:-webkit-optimize-contrast]"
              />
            </Link>
          </div>

          {/* PRODUCT META */}
          <div className="space-y-1">
            
            {/* Brand Name */}
            {product.brand && (
              <span className="block text-[10px] min-[380px]:text-[11px] font-black text-[#e51b23] uppercase tracking-wider truncate">
                <HighlightText text={product.brand} query={searchQuery} />
              </span>
            )}

            {/* Product Title (Strict 2-line limit with readable typography) */}
            <Link
              to={`/product/${product.id}`}
              className="block group-hover:text-[#e51b23] transition-colors"
            >
              <h3 className="font-bold text-[12px] min-[380px]:text-[13px] sm:text-sm text-[#050505] line-clamp-2 leading-snug min-h-[32px] sm:min-h-[38px]">
                <HighlightText text={product.name} query={searchQuery} />
              </h3>
            </Link>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 pt-0.5">
              <div className="flex text-[#ffd000]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-2.5 h-2.5 min-[380px]:w-3 min-[380px]:h-3 fill-[#ffd000] text-[#ffd000]"
                  />
                ))}
              </div>
              <span className="text-[10px] min-[380px]:text-[11px] text-slate-500 font-medium">
                ({product.reviewsCount || 128})
              </span>
            </div>

            {/* Price Area */}
            <div className="flex items-baseline gap-1.5 min-[380px]:gap-2 pt-1">
              <span className="text-[14px] min-[380px]:text-[16px] sm:text-lg font-black font-display text-[#050505]">
                {formatCurrency(currentPrice)}
              </span>
              {origPrice > currentPrice && (
                <span className="text-[11px] min-[380px]:text-xs text-slate-400 line-through font-medium">
                  {formatCurrency(origPrice)}
                </span>
              )}
            </div>

          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS: TOUCH-FRIENDLY & CLEAN */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col min-[380px]:grid min-[380px]:grid-cols-2 gap-1.5">
          {/* Add to Cart CTA */}
          <button
            onClick={() => addToCart(product, 1)}
            className="w-full py-2 px-1.5 min-[380px]:px-2 rounded-xl bg-[#ffd000] active:bg-[#e6bd00] hover:bg-[#ffcb05] text-[#050505] text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all shadow-xs active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Add to Cart</span>
          </button>

          {/* WhatsApp Enquire Button */}
          <button
            onClick={() => openProductWhatsApp(product)}
            className="w-full py-2 px-1.5 min-[380px]:px-2 rounded-xl bg-[#050505] active:bg-slate-800 hover:bg-[#1f1f1f] text-[#ffd000] text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all border border-[#ffd000]/40 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#ffd000] shrink-0" />
            <span className="truncate">Enquire</span>
          </button>
        </div>

      </div>

      {/* Quick Enquiry Modal */}
      <QuickEnquiryModal
        product={product}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </>
  );
}
