import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';
import { openProductWhatsApp } from '../utils/whatsapp';
import { storeConfig } from '../config/store';
import RatingStars from '../components/common/RatingStars';
import QuickEnquiryModal from '../components/product/QuickEnquiryModal';
import ProductGrid from '../components/product/ProductGrid';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Zap,
  MapPin,
  Phone,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  Truck,
  Sparkles,
  Share2,
  Flame
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = products.find((p) => p.id === Number(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4 space-y-4">
        <h2 className="text-2xl font-bold text-[#050505]">Product Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested product does not exist or may have been removed.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-xl bg-[#FFD400] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} - Prem Mobile`,
        text: `Check out ${product.name} at Prem Mobile Gwalior! “${storeConfig.tagline}”`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 font-bold hover:text-[#E31B23] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 font-medium">
            <Link to="/" className="hover:text-[#E31B23]">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#E31B23]">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#E31B23]">
              {product.category}
            </Link>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="bg-white rounded-3xl sm:rounded-4xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl bg-slate-50 border border-slate-200 p-6 flex items-center justify-center overflow-hidden">
                {product.discount > 0 && (
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-xl bg-[#E31B23] text-white font-black text-xs shadow-sm">
                    {product.discount}% OFF
                  </span>
                )}

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                    isLiked
                      ? 'bg-red-50 text-[#E31B23] scale-105'
                      : 'bg-white text-slate-400 hover:text-[#E31B23]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#E31B23]' : ''}`} />
                </button>

                <img
                  src={galleryImages[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-all duration-300 hover:scale-105"
                />
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-2xl border-2 p-1 bg-slate-50 overflow-hidden transition-all ${
                        selectedImage === idx
                          ? 'border-[#FFD400] scale-105 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded-xl" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & CTA */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-lg bg-[#050505] text-[#FFD400] font-black text-xs uppercase tracking-wider">
                    {product.brand}
                  </span>
                  
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#050505] font-semibold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                  </button>
                </div>

                <h1 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-[#050505] leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Availability */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="md" />
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {product.availability || 'In Stock at Pinto Park Store'}
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-[#050505] text-white border-2 border-[#FFD400]/40 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black font-display text-[#FFD400]">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm sm:text-base text-slate-400 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                    *Store Offer Rate • “{storeConfig.tagline}”
                  </p>
                </div>

                {product.discount > 0 && (
                  <span className="px-3 py-1 rounded-xl bg-[#E31B23] text-white font-black text-xs shadow-xs">
                    Save {formatCurrency(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Key Features & Highlights
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#050505]">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Check className="w-3.5 h-3.5 text-[#E31B23] flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Stepper & Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-600">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-[#050505] min-w-[30px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Yellow Add to Cart CTA */}
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="py-3.5 px-4 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </button>

                  {/* Green WhatsApp Order CTA */}
                  <button
                    onClick={() => openProductWhatsApp(product, `Quantity: ${quantity}`)}
                    className="py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>ORDER ON WHATSAPP</span>
                  </button>
                </div>
              </div>

              {/* Store Pickup Notice */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2 text-[#050505] font-bold">
                  <MapPin className="w-4 h-4 text-[#E31B23]" />
                  <span>Store Pickup Location:</span>
                </div>
                <p className="pl-6 text-slate-700">
                  {storeConfig.address}
                </p>
                <div className="flex items-center gap-2 pl-6 text-[#E31B23] font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Free screen guard fitting and live audio test on pickup</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[#E31B23] uppercase">
                  SIMILAR DEALS
                </span>
                <h2 className="font-display font-black text-2xl text-[#050505]">
                  Related Products
                </h2>
              </div>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-[#E31B23] hover:underline"
              >
                View Category →
              </Link>
            </div>

            <ProductGrid products={relatedProducts} columns="grid-cols-2 sm:grid-cols-4" />
          </div>
        )}

      </div>

      <QuickEnquiryModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
