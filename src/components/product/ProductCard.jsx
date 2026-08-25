import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatters';
import { openProductWhatsApp } from '../../utils/whatsapp';
import RatingStars from '../common/RatingStars';
import QuickEnquiryModal from './QuickEnquiryModal';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const isLiked = isInWishlist(product.id);

  return (
    <>
      <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3 sm:p-4 shadow-sm hover:shadow-card-hover hover:border-[#FFD400] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
        
        {/* Top Badges & Wishlist */}
        <div>
          <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl bg-[#F6F6F6] overflow-hidden mb-3 p-2 flex items-center justify-center border border-slate-100">
            
            {/* Red Discount Badge */}
            {product.discount > 0 && (
              <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-[#E31B23] text-white font-black text-[10px] sm:text-xs shadow-xs tracking-tight">
                -{product.discount}%
              </span>
            )}

            {/* Custom Tag */}
            {product.tag && (
              <span className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-[#050505] text-[#FFD400] font-bold text-[9px] sm:text-[10px] uppercase tracking-wider">
                {product.tag}
              </span>
            )}

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs ${
                isLiked
                  ? 'bg-red-50 text-[#E31B23] scale-110'
                  : 'bg-white/90 text-slate-400 hover:text-[#E31B23] hover:bg-white'
              }`}
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#E31B23]' : ''}`} />
            </button>

            {/* Product Image */}
            <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500"
              />
            </Link>
          </div>

          {/* Product Meta */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-black text-[#E31B23] uppercase tracking-wider">
                {product.brand}
              </span>
              <RatingStars rating={product.rating} showText={false} size="sm" />
            </div>

            <Link
              to={`/product/${product.id}`}
              className="block group-hover:text-[#E31B23] transition-colors"
            >
              <h3 className="font-bold text-xs sm:text-sm text-[#050505] line-clamp-2 leading-snug h-8 sm:h-9">
                {product.name}
              </h3>
            </Link>

            {/* Price Area */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-base sm:text-lg font-black font-display text-[#050505]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Yellow Cart CTA + WhatsApp */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-1.5 sm:gap-2">
          {/* Yellow Add to Cart CTA */}
          <button
            onClick={() => addToCart(product, 1)}
            className="py-2 px-2 sm:px-3 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Cart</span>
          </button>

          {/* Enquire Button */}
          <button
            onClick={() => openProductWhatsApp(product)}
            className="py-2 px-2 sm:px-3 rounded-xl bg-[#050505] hover:bg-[#1f1f1f] text-[#FFD400] text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#FFD400]/40"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#FFD400]" />
            <span>Enquire</span>
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
