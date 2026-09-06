import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, CheckCircle2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatters';

export function ProductCardExact({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-2xl border border-[#dedede] p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 h-full min-h-[260px]">
      <div>
        {/* Top Badges & Wishlist */}
        <div className="relative h-[135px] w-full rounded-xl bg-[#f8fafc] overflow-hidden mb-2.5 p-2 flex items-center justify-center">
          
          {/* Solid Red Discount Badge */}
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-[#e51b23] text-white font-extrabold text-[11px] tracking-tight leading-none">
              -{product.discount}%
            </span>
          )}

          {/* Outline Wishlist Heart Icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-[#e51b23] flex items-center justify-center transition-colors shadow-xs"
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 stroke-[1.8] ${isLiked ? 'fill-[#e51b23] text-[#e51b23]' : ''}`} />
          </button>

          {/* Product Image */}
          <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full max-h-[120px] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-[13px] text-[#050505] group-hover:text-[#e51b23] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* 5 Yellow Stars + Reviews Count */}
        <div className="flex items-center gap-1 my-1">
          <div className="flex text-[#ffd000]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 fill-[#ffd000] text-[#ffd000]"
              />
            ))}
          </div>
          <span className="text-[11px] text-[#777777] font-medium">
            ({product.reviewsCount || 128})
          </span>
        </div>

        {/* Current Price & Strikethrough Original Price */}
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-[15px] font-black text-[#050505] font-display">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[12px] text-[#777777] line-through font-medium">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedSection({ products }) {
  // Take exactly the first 6 products for the left side
  const featuredSix = products.slice(0, 6);

  return (
    <section className="pt-8 pb-10 bg-[#f5f5f5]">
      <div className="max-w-[1500px] mx-auto px-6 space-y-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-2xl sm:text-[26px] text-[#050505] tracking-tight flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span>FEATURED PRODUCTS</span>
          </h2>

          <Link
            to="/shop"
            className="px-4 py-1.5 rounded-full bg-[#050505] hover:bg-[#1a1a1a] text-[#ffd000] font-black text-xs uppercase tracking-wider transition-colors shadow-xs"
          >
            View All
          </Link>
        </div>

        {/* 6 Product Cards on Left + Sunday Special Sale Card on Right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3.5 items-stretch">
          
          {/* 6 Product Cards */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredSix.map((product) => (
              <ProductCardExact key={product.id} product={product} />
            ))}
          </div>

          {/* Sunday Special Sale Sidebar Banner Card */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-2 flex flex-col">
            <Link
              to="/sunday-sale"
              className="relative w-full h-full min-h-[260px] rounded-2xl overflow-hidden border-2 border-[#ffd000]/60 shadow-lg group block transition-transform hover:scale-[1.02] bg-black"
            >
              <img
                src="/images/sunday-shocking-sale.jpg"
                alt="Sunday Shocking Sale - Prem Mobile Gwalior"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
