import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { parseResponseJson } from '../utils/apiHelper';
import { fetchLaravelProducts } from '../api/laravel';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSundaySale } from '../context/SundaySaleContext';
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
  Flame,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isLive: isSundayLive, products: sundayProducts } = useSundaySale();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => parseResponseJson(res))
      .then(data => {
        if (data.success && data.product) {
          const p = data.product;
          setProduct({
            ...p,
            price: p.currentPrice || p.regularPrice,
            originalPrice: p.regularPrice,
            image: p.image || (p.images && p.images[0]) || '/images/prem-main.jpg',
            images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || '/images/prem-main.jpg'],
            features: p.description ? p.description.split('. ').filter(Boolean) : ['Original product with official warranty.'],
            availability: p.stock > 0 ? 'In Stock at Store' : 'Out of Stock'
          });
        } else {
          setProduct(null);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    fetchLaravelProducts().then(res => {
      if (res.success) setAllProducts(res.data || []);
    });
  }, [id]);

  // Check if product is in Sunday Sale
  const sundaySaleItem = isSundayLive && sundayProducts
    ? sundayProducts.find(sp => sp.productId === Number(id))
    : null;
  const isSundaySaleItem = Boolean(sundaySaleItem);

  const effectivePrice = isSundaySaleItem ? sundaySaleItem.salePrice : (product?.price || 0);
  const effectiveOriginalPrice = isSundaySaleItem ? sundaySaleItem.regularPrice : (product?.originalPrice || product?.price || 0);


  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [variantError, setVariantError] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState(false);

  useEffect(() => {
    if (product && product.variants) {
      const defaults = {};
      Object.keys(product.variants).forEach((key) => {
        defaults[key] = product.variants[key][0];
      });
      setSelectedVariants(defaults);
      setVariantError(false);
    } else {
      setSelectedVariants({});
      setVariantError(false);
    }
    setRecentlyAdded(false);
  }, [product]);

  if (loading) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 space-y-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#FFD400] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Product Specs & Details...</p>
      </div>
    );
  }

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

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id && !p.isAddon)
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

  const handleVariantSelect = (catKey, optionValue) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [catKey]: optionValue
    }));
    setVariantError(false);
  };

  const handleAddToCartFlow = () => {
    // Check if product requires variants and all keys are filled
    if (product.variants) {
      const requiredKeys = Object.keys(product.variants);
      const isMissing = requiredKeys.some((k) => !selectedVariants[k]);
      if (isMissing) {
        setVariantError(true);
        return;
      }
    }

    const cartProduct = {
      ...product,
      price: effectivePrice,
      originalPrice: effectiveOriginalPrice,
      regularPrice: effectiveOriginalPrice,
      isSundaySale: isSundaySaleItem
    };

    addToCart(cartProduct, quantity, selectedVariants);
    setRecentlyAdded(true);
    setIsCartDrawerOpen(true);
  };

  const handleBuyNowFlow = () => {
    if (product.variants) {
      const requiredKeys = Object.keys(product.variants);
      const isMissing = requiredKeys.some((k) => !selectedVariants[k]);
      if (isMissing) {
        setVariantError(true);
        return;
      }
    }

    const cartProduct = {
      ...product,
      price: effectivePrice,
      originalPrice: effectiveOriginalPrice,
      regularPrice: effectiveOriginalPrice,
      isSundaySale: isSundaySaleItem
    };

    addToCart(cartProduct, quantity, selectedVariants);
    navigate('/checkout');
  };

  const variantNoteStr = Object.keys(selectedVariants).length > 0
    ? `Selected Options: ${Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')} | Qty: ${quantity}`
    : `Quantity: ${quantity}`;

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
        <div className="bg-white rounded-2xl sm:rounded-4xl border border-slate-200 p-4 sm:p-10 shadow-sm">
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
                  src={galleryImages[selectedImage] || product.image || '/images/prem-main.jpg'}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/prem-main.jpg';
                  }}
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
                      <img
                        src={img || '/images/prem-main.jpg'}
                        alt="thumbnail"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/prem-main.jpg';
                        }}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Add to Cart Flow */}
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
              {isSundaySaleItem ? (
                <div className="p-5 rounded-3xl bg-gradient-to-r from-[#050505] via-[#1a1a1a] to-[#050505] text-white border-2 border-[#ffd000] shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e51b23] text-white font-black text-xs uppercase tracking-wider animate-pulse">
                      <Flame className="w-4 h-4 fill-white" />
                      <span>🔥 SUNDAY SALE</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffd000] text-[#050505] font-black text-xs uppercase">
                      {sundaySaleItem.discountPercent}% OFF
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-0.5">Sunday price:</span>
                      <span className="text-3xl sm:text-4xl font-black font-display text-[#ffd000]">
                        {formatCurrency(effectivePrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-0.5">Regular price:</span>
                      <span className="text-base text-slate-400 line-through">
                        {formatCurrency(effectiveOriginalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      Save {formatCurrency(effectiveOriginalPrice - effectivePrice)}
                    </span>
                    <span className="text-slate-300 text-[11px]">Valid Today Only</span>
                  </div>
                </div>
              ) : (
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
              )}


              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* STEP 1: VARIANT SELECTION WITH OUTLINE VALIDATION */}
              {product.variants && Object.keys(product.variants).length > 0 && (
                <div
                  className={`space-y-4 p-4 rounded-2xl transition-all duration-300 ${
                    variantError
                      ? 'bg-amber-50 border-2 border-amber-400 ring-4 ring-amber-400/40 animate-pulse'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-black text-[#050505] uppercase tracking-wider flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#E31B23]" />
                      <span>STEP 1: SELECT PRODUCT VARIATIONS</span>
                    </h4>
                    <span className="text-[#E31B23] text-[11px] font-bold">
                      Required for Cart
                    </span>
                  </div>

                  {variantError && (
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span>Please select your variation options below to add item to cart!</span>
                    </div>
                  )}

                  {Object.entries(product.variants).map(([category, options]) => (
                    <div key={category} className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 capitalize flex items-center justify-between">
                        <span>Select {category}:</span>
                        <span className="text-[#E31B23] font-black">{selectedVariants[category] || 'None Selected'}</span>
                      </span>
                      
                      <div className="flex flex-wrap gap-2">
                        {options.map((opt) => {
                          const isSelected = selectedVariants[category] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleVariantSelect(category, opt)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-[#050505] text-[#FFD400] border-[#050505] shadow-sm font-black'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#FFD400]" />}
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2: QUANTITY STEPPER & PRIMARY ADD TO CART CTA */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    STEP 2: CHOOSE QUANTITY & ADD TO CART
                  </span>
                  
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

                {/* HIGH-CONTRAST PRIMARY CTA BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleAddToCartFlow}
                    className="py-4 px-4 rounded-2xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl transition-transform hover:scale-103 ring-2 ring-[#FFD400]/40"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#050505] stroke-[2.5]" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    onClick={handleBuyNowFlow}
                    className="py-4 px-4 rounded-2xl bg-[#e51b23] hover:bg-[#c91219] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl transition-transform hover:scale-103 ring-2 ring-red-400/40"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>BUY NOW</span>
                  </button>

                  <button
                    onClick={() => openProductWhatsApp(product, variantNoteStr)}
                    className="py-4 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-transform hover:scale-102"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WHATSAPP</span>
                  </button>
                </div>


                {/* FEEDBACK OPTION B: ACTIVE CONFIRMATION BANNER ON ADDITION */}
                {recentlyAdded && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>Item Added To Your Cart Successfully!</span>
                      </div>
                      <span className="text-xs font-black text-emerald-800">{formatCurrency(product.price * quantity)}</span>
                    </div>

                    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/cart"
                        className="py-2.5 px-3 rounded-xl bg-[#050505] text-[#FFD400] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm text-center"
                      >
                        <span>VIEW CART & CHECKOUT</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => setIsCartDrawerOpen(true)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>OPEN CART DRAWER</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
                  <span>100% genuine warranty and live audio test on pickup</span>
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
