import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { parseResponseJson } from '../utils/apiHelper';
import { uploadToCloudinary } from '../utils/cloudinary';
import { fetchLaravelProducts } from '../api/laravel';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSundaySale } from '../context/SundaySaleContext';
import { useCompare } from '../context/CompareContext';
import { formatCurrency } from '../utils/formatters';
import { openProductWhatsApp } from '../utils/whatsapp';
import { storeConfig } from '../config/store';
import RatingStars from '../components/common/RatingStars';
import QuickEnquiryModal from '../components/product/QuickEnquiryModal';
import ProductGrid from '../components/product/ProductGrid';
import FrequentlyBoughtTogether from '../components/product/FrequentlyBoughtTogether';
import SEO from '../components/common/SEO';
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
  SlidersHorizontal,
  Star,
  Camera,
  Image as ImageIcon,
  X,
  MessageSquare,
  Scale
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isLive: isSundayLive, products: sundayProducts } = useSundaySale();
  const { isInCompare, toggleCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Customer Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsSummary, setReviewsSummary] = useState({ averageRating: 5.0, totalCount: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewPhoto, setSelectedReviewPhoto] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, customerName: '', customerEmail: '', comment: '', photoUrl: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isUploadingReviewPhoto, setIsUploadingReviewPhoto] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  const reviewFileInputRef = useRef(null);
  const reviewCameraInputRef = useRef(null);

  const handleReviewPhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const file = files[0];
    setIsUploadingReviewPhoto(true);

    try {
      // Direct Cloudinary upload with fallback to local FileReader data URL
      const cUrl = await uploadToCloudinary(file);
      if (cUrl) {
        setNewReview((prev) => ({ ...prev, photoUrl: cUrl }));
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewReview((prev) => ({ ...prev, photoUrl: event.target.result }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Photo upload fallback to DataURL:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewReview((prev) => ({ ...prev, photoUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingReviewPhoto(false);
    }
  };

  const fetchProductReviews = async (productId) => {
    try {
      const res = await fetch(`/api/reviews/product/${productId}`);
      const data = await parseResponseJson(res);
      if (data.success && data.data) {
        setReviewsList(data.data.reviews || []);
        setReviewsSummary(data.data.summary || { averageRating: 5.0, totalCount: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
      }
    } catch (err) {
      console.error('Error loading product reviews:', err);
    }
  };

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
          fetchProductReviews(p.id);
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.customerName.trim() || !newReview.comment.trim()) {
      setReviewMessage({ type: 'error', text: 'Please enter your name and review comment.' });
      return;
    }
    setIsSubmittingReview(true);
    setReviewMessage(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(product.id),
          customerName: newReview.customerName,
          customerEmail: newReview.customerEmail,
          rating: newReview.rating,
          comment: newReview.comment,
          photoUrl: newReview.photoUrl
        })
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setReviewMessage({ type: 'success', text: 'Thank you! Your review has been submitted.' });
        setNewReview({ rating: 5, customerName: '', customerEmail: '', comment: '', photoUrl: '' });
        fetchProductReviews(product.id);
        setTimeout(() => {
          setIsReviewModalOpen(false);
          setReviewMessage(null);
        }, 2000);
      } else {
        setReviewMessage({ type: 'error', text: data.message || 'Failed to submit review' });
      }
    } catch (err) {
      setReviewMessage({ type: 'error', text: 'Network error submitting review' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);

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

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': galleryImages.map(img => img.startsWith('http') ? img : `https://prem-mobile-kappa.vercel.app${img.startsWith('/') ? img : '/' + img}`),
    'description': product.description || `Buy ${product.name} at Prem Mobile Gwalior. Deal Aise Jo Deewana Bana De!`,
    'sku': `PREM-PROD-${product.id}`,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || product.name.split(' ')[0] || 'Prem Mobile'
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://prem-mobile-kappa.vercel.app/product/${product.id}`,
      'priceCurrency': 'INR',
      'price': effectivePrice || product.price,
      'priceValidUntil': '2027-12-31',
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Prem Mobile Gwalior'
      }
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': product.rating || 4.8,
      'reviewCount': product.reviewsCount || product.reviews?.length || 15
    }
  };

  return (
    <div className="py-3 sm:py-5 bg-[#F6F6F6] min-h-screen">
      <SEO
        title={`${product.name} | Prem Mobile Gwalior`}
        description={`Buy ${product.name} at best price in Gwalior. ${product.description ? product.description.slice(0, 120) : '100% Genuine product with store warranty at Prem Mobile Pinto Park.'}`}
        path={`/product/${product.id}`}
        image={product.image}
        keywords={`${product.name}, buy ${product.name} Gwalior, ${product.category} Gwalior, Prem Mobile`}
        schemaJson={productSchema}
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        
        {/* Compact Breadcrumb & Back */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 py-0.5">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 font-bold hover:text-[#E31B23] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 font-medium truncate">
            <Link to="/" className="hover:text-[#E31B23]">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#E31B23]">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#E31B23] truncate">
              {product.category}
            </Link>
          </div>
        </div>

        {/* SINGLE VIEWPORT OPTIMIZED PRODUCT CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
            
            {/* Left Column: Fixed Controlled Gallery (Approx 42-45% width on desktop) */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-2.5">
              <div className="relative aspect-square w-full max-h-[340px] sm:max-h-[380px] lg:max-h-[400px] rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4 flex items-center justify-center overflow-hidden mx-auto">
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-[#E31B23] text-white font-black text-[10px] uppercase tracking-wider shadow-xs">
                    {product.discount}% OFF
                  </span>
                )}

                {/* Compact Secondary Actions: Compare, Wishlist, Share */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <button
                    onClick={handleShare}
                    className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-[#050505] flex items-center justify-center transition shadow-sm border border-slate-100"
                    title={copiedLink ? 'Link Copied!' : 'Share Product'}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleCompare(product)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm border border-slate-100 ${
                      isInCompare(product.id)
                        ? 'bg-[#050505] text-[#FFD400] scale-105'
                        : 'bg-white text-slate-400 hover:text-[#050505]'
                    }`}
                    title={isInCompare(product.id) ? 'In Compare list' : 'Add to Compare'}
                  >
                    <Scale className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm border border-slate-100 ${
                      isLiked
                        ? 'bg-red-50 text-[#E31B23] scale-105'
                        : 'bg-white text-slate-400 hover:text-[#E31B23]'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#E31B23]' : ''}`} />
                  </button>
                </div>

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

              {/* Gallery Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-14 h-14 rounded-xl border-2 p-1 bg-slate-50 overflow-hidden flex-shrink-0 transition-all ${
                        selectedImage === idx
                          ? 'border-[#FFD400] scale-105 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 opacity-75'
                      }`}
                    >
                      <img
                        src={img || '/images/prem-main.jpg'}
                        alt="thumbnail"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/prem-main.jpg';
                        }}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Compact Buying Controls Panel (Sticky on Desktop) */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-2.5 lg:sticky lg:top-20">
              
              {/* BRAND BADGE & TITLE */}
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-md bg-[#050505] text-[#FFD400] font-black text-[10px] uppercase tracking-wider inline-block">
                  {product.brand || 'PREM MOBILE'}
                </span>

                <h1 className="font-display font-black text-xl sm:text-2xl text-[#050505] leading-tight">
                  {product.name}
                </h1>

                {/* RATING + STOCK (Single Horizontal Row) */}
                <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                  <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {product.availability || 'In Stock at Store'}
                  </span>
                </div>
              </div>

              {/* PRICE BOX (Compact Black + Yellow Prem Mobile Card) */}
              {isSundaySaleItem ? (
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#050505] via-[#151515] to-[#050505] text-white border-2 border-[#ffd000] shadow-md space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#e51b23] text-white font-black text-[10px] uppercase tracking-wider animate-pulse">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>SUNDAY SALE</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#ffd000] text-[#050505] font-black text-[10px] uppercase">
                      {sundaySaleItem.discountPercent}% OFF
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black font-display text-[#ffd000]">
                        {formatCurrency(effectivePrice)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(effectiveOriginalPrice)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                      Save {formatCurrency(effectiveOriginalPrice - effectivePrice)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#050505] text-white border-2 border-[#FFD400]/50 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black font-display text-[#FFD400]">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through font-semibold">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-300 font-medium">
                      *Store Offer Rate • “{storeConfig.tagline}”
                    </p>
                  </div>

                  {product.discount > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-[#E31B23] text-white font-black text-[10px] uppercase shadow-xs">
                      Save {formatCurrency(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>
              )}

              {/* SHORT PRODUCT DESCRIPTION (Truncated to 1-2 lines with Read More) */}
              <div className="text-xs text-slate-600 font-medium">
                <p className={showFullDescription ? '' : 'line-clamp-2'}>
                  {product.description}
                </p>
                {product.description && product.description.length > 120 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-[11px] font-bold text-[#E31B23] hover:underline mt-0.5 block"
                  >
                    {showFullDescription ? 'Show less ▲' : 'Read more ▼'}
                  </button>
                )}
              </div>

              {/* VARIANT SELECTION (IF APPLICABLE) */}
              {product.variants && Object.keys(product.variants).length > 0 && (
                <div
                  className={`space-y-1.5 p-2 rounded-xl transition-all ${
                    variantError
                      ? 'bg-amber-50 border-2 border-amber-400 ring-2 ring-amber-400/40'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  {variantError && (
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span>Please select options below to proceed!</span>
                    </div>
                  )}

                  {Object.entries(product.variants).map(([category, options]) => (
                    <div key={category} className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-700 capitalize flex items-center justify-between">
                        <span>Select {category}:</span>
                        <span className="text-[#E31B23] font-black">{selectedVariants[category] || 'None Selected'}</span>
                      </span>
                      
                      <div className="flex flex-wrap gap-1">
                        {options.map((opt) => {
                          const isSelected = selectedVariants[category] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleVariantSelect(category, opt)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-[#050505] text-[#FFD400] border-[#050505] font-black shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-[#FFD400]" />}
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BUYING SECTION — STEP 1 QUANTITY & STEP 2 ACTION BUTTONS */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                
                {/* STEP 1: QUANTITY SELECTOR */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    STEP 1: CHOOSE QUANTITY
                  </span>
                  
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#050505] min-w-[24px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* STEP 2: THREE BUTTONS IN ONE ROW ON DESKTOP */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    STEP 2: CHOOSE YOUR ACTION
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* ADD TO CART - Bright Yellow */}
                    <button
                      onClick={handleAddToCartFlow}
                      className="py-3 px-2 rounded-xl bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-transform hover:scale-102 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#050505] stroke-[2.5]" />
                      <span>ADD TO CART</span>
                    </button>

                    {/* BUY NOW - Bright Red */}
                    <button
                      onClick={handleBuyNowFlow}
                      className="py-3 px-2 rounded-xl bg-[#e51b23] hover:bg-[#c91219] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-transform hover:scale-102 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>BUY NOW</span>
                    </button>

                    {/* WHATSAPP - Green */}
                    <button
                      onClick={() => openProductWhatsApp(product, variantNoteStr)}
                      className="py-3 px-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-transform hover:scale-102 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WHATSAPP</span>
                    </button>
                  </div>

                  {/* PROMINENT COMPARE PRODUCT ACTION BUTTON */}
                  <button
                    type="button"
                    onClick={() => toggleCompare(product)}
                    className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      isInCompare(product.id)
                        ? 'bg-[#050505] text-[#FFD400] border-[#050505] shadow-xs'
                        : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>
                      {isInCompare(product.id) ? '✓ IN COMPARE LIST (Click to Remove)' : 'ADD TO COMPARE LIST ⚖️'}
                    </span>
                  </button>
                </div>

                {/* FEEDBACK BANNER ON ADDITION */}
                {recentlyAdded && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Added to Cart!</span>
                      </div>
                      <span className="font-black text-emerald-800">{formatCurrency(product.price * quantity)}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to="/cart"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-[#050505] text-[#FFD400] font-black text-[10px] uppercase tracking-wider text-center"
                      >
                        CHECKOUT NOW →
                      </Link>

                      <button
                        onClick={() => setIsCartDrawerOpen(true)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider"
                      >
                        VIEW CART DRAWER
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* KEY FEATURES & HIGHLIGHTS (Compact 3-4 Bullets) */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-1 pt-1.5 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      KEY FEATURES & HIGHLIGHTS
                    </h4>
                    {product.features.length > 3 && (
                      <button
                        onClick={() => setShowSpecsModal(true)}
                        className="text-[10px] font-bold text-[#E31B23] hover:underline"
                      >
                        VIEW MORE DETAILS →
                      </button>
                    )}
                  </div>

                  <ul className="grid grid-cols-2 gap-1.5 text-xs text-[#050505]">
                    {product.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-[11px] font-semibold truncate">
                        <Check className="w-3 h-3 text-[#E31B23] flex-shrink-0 mt-0.5" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compact Store Notice */}
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#050505] font-bold truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#E31B23] flex-shrink-0" />
                  <span className="truncate">Store Pickup: {storeConfig.address}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-emerald-700 font-bold text-[10px] flex-shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Warranty Included</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER SMART BUNDLE BUILDER */}
        <FrequentlyBoughtTogether product={product} catalogProducts={allProducts} />

        {/* CUSTOMER RATINGS & PHOTO REVIEWS SECTION */}
        <div className="bg-white rounded-2xl sm:rounded-4xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-black text-[#E31B23] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                CUSTOMER REVIEWS & FEEDBACK
              </span>
              <h2 className="font-display font-black text-2xl text-[#050505]">
                Verified Ratings & Unboxing Photos
              </h2>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#050505] hover:bg-slate-800 text-[#FFD400] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
            >
              <Star className="w-4 h-4 text-[#FFD400] fill-[#FFD400]" />
              <span>WRITE A REVIEW</span>
            </button>
          </div>

          {/* Rating Summary Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200 items-center">
            {/* Average Score */}
            <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl font-black text-[#050505]">{reviewsSummary.averageRating}</span>
                <span className="text-slate-400 font-bold text-lg">/ 5.0</span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(reviewsSummary.averageRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs font-semibold text-slate-500">
                Based on {reviewsSummary.totalCount} verified buyer reviews
              </p>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="md:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewsSummary.breakdown[star] || 0;
                const percentage = reviewsSummary.totalCount > 0
                  ? Math.round((count / reviewsSummary.totalCount) * 100)
                  : 0;

                return (
                  <div key={star} className="flex items-center gap-3 text-xs font-bold">
                    <span className="w-8 text-slate-600 flex items-center gap-1">
                      {star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </span>

                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-12 text-right text-slate-500 font-semibold">{count} ({percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          {reviewsList.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 text-sm font-semibold">No customer reviews yet for this product.</p>
              <p className="text-xs text-slate-400">Be the first Gwalior shopper to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-sm border border-slate-200">
                          {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 text-sm block leading-tight">{rev.customerName}</span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Gwalior Buyer
                          </span>
                        </div>
                      </div>

                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Unboxing Photo Thumbnail */}
                  {rev.photoUrl && (
                    <div className="pt-2">
                      <button
                        onClick={() => setSelectedReviewPhoto(rev.photoUrl)}
                        className="group relative rounded-xl overflow-hidden border border-slate-200 block w-24 h-24 bg-slate-50"
                      >
                        <img
                          src={rev.photoUrl}
                          alt="Customer unboxing photo"
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop'; }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-xs font-bold">
                          Zoom 🔍
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WRITE A REVIEW MODAL */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in border border-slate-100">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-display font-black text-xl text-slate-800">Write a Review</h3>
                <p className="text-xs text-slate-500 mt-1">Share your experience with Gwalior buyers for {product.name}</p>
              </div>

              {reviewMessage && (
                <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  reviewMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {reviewMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{reviewMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Overall Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= newReview.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 hover:text-amber-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-slate-700 ml-2">{newReview.rating} / 5 Stars</span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newReview.customerName}
                    onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@gmail.com"
                    value={newReview.customerEmail}
                    onChange={(e) => setNewReview({ ...newReview, customerEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Written Feedback *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about the sound quality, packaging, delivery speed in Gwalior..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                  />
                </div>

                {/* Unboxing Photo Upload / Camera Capture */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-500" />
                    Add Unboxing Photo (Optional)
                  </label>

                  {/* Hidden File Inputs */}
                  <input
                    ref={reviewFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReviewPhotoUpload}
                    className="hidden"
                  />
                  <input
                    ref={reviewCameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleReviewPhotoUpload}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => reviewCameraInputRef.current && reviewCameraInputRef.current.click()}
                      className="px-3 py-2 rounded-xl bg-slate-900 text-[#FFD400] font-black text-xs uppercase flex items-center gap-1.5 hover:bg-black shadow-xs cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-[#FFD400]" />
                      <span>Snap Photo 📷</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => reviewFileInputRef.current && reviewFileInputRef.current.click()}
                      className="px-3 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                    >
                      <span>Choose File 📁</span>
                    </button>

                    {isUploadingReviewPhoto && (
                      <span className="text-xs font-bold text-blue-600 animate-pulse">Uploading...</span>
                    )}
                  </div>

                  <input
                    type="url"
                    placeholder="Or paste photo URL (e.g. https://...)"
                    value={newReview.photoUrl}
                    onChange={(e) => setNewReview({ ...newReview, photoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                  />
                </div>

                {newReview.photoUrl && (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={newReview.photoUrl}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop'; }}
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Photo Attached!</span>
                        <span className="text-[10px] text-slate-400">Ready to publish with your review</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNewReview({ ...newReview, photoUrl: '' })}
                      className="text-xs font-bold text-red-500 hover:underline px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-4 rounded-xl bg-[#050505] hover:bg-slate-800 text-[#FFD400] font-black text-xs uppercase tracking-wider shadow-lg transition"
                >
                  {isSubmittingReview ? 'Submitting Review...' : 'SUBMIT REVIEW NOW'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PHOTO ZOOM MODAL FOR CUSTOMER REVIEWS */}
        {selectedReviewPhoto && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl p-2 border border-slate-700">
              <button
                onClick={() => setSelectedReviewPhoto(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={selectedReviewPhoto}
                alt="Unboxing preview"
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}

        {/* VIEW MORE DETAILS MODAL */}
        {showSpecsModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-fade-in border border-slate-100 max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setShowSpecsModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="px-2.5 py-0.5 rounded bg-[#050505] text-[#FFD400] font-black text-[10px] uppercase tracking-wider inline-block mb-1">
                  {product.brand || 'PREM MOBILE'}
                </span>
                <h3 className="font-display font-black text-xl text-slate-900">{product.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Complete Product Specifications & Highlights</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1">All Features & Specifications</h4>
                <ul className="space-y-2 text-xs text-slate-800 font-medium">
                  {product.features?.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <Check className="w-4 h-4 text-[#E31B23] flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b pb-1 pt-2">Full Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        )}

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
