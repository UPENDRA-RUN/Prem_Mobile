import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storeConfig } from '../../config/store';
import { openGeneralWhatsApp } from '../../utils/whatsapp';
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Award,
  ShieldCheck,
  Rocket,
  IndianRupee,
  RefreshCw,
  Headphones,
  ArrowRight,
  Crown,
  ThumbsUp,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      id: 'main-hero',
      type: 'landscape-image',
      title: 'Prem Mobile - Deal Aise Jo Deewana Bana De',
      image: '/images/prem-hero-hd.jpg',
      alt: 'Prem Mobile Gwalior Official Hero Banner',
      whatsappTopic: 'Prem Mobile Main Deals & Offers',
      link: '/shop',
      badge: 'OFFICIAL FLAGSHIP STORE'
    },
    {
      id: 'sunday-sale',
      type: 'landscape-image',
      title: 'Sunday Special Sale - Up to 70% OFF',
      image: '/images/sunday-sale.jpg',
      alt: 'Sunday Special Sale Prem Mobile Gwalior',
      whatsappTopic: 'Sunday Special Sale Deals',
      link: '/shop',
      badge: 'SUNDAY MEGA DHAMAKA'
    },
    {
      id: 'boat-deal',
      type: 'landscape-product',
      title: 'boAt Bassheads 90C Type-C',
      tagline: 'Deal Aise Jo Deewana Bana De 🔥',
      subtitle: 'Super Extra Bass with 3.5mm / Type-C Jack, HD Mic & Comfort Fit Earbuds',
      price: '₹350',
      originalPrice: '₹999',
      discount: '65% OFF',
      badge: 'BESTSELLER DEAL',
      image: '/images/boat-basshead.jpg',
      link: '/product/5',
      whatsappTopic: 'boAt Bassheads 90C @ Rs 350 Special Deal'
    },
    {
      id: 'agaro-deal',
      type: 'landscape-product',
      title: 'AGARO Grooming & Lifestyle Tech',
      tagline: 'Deal Aise Jo Deewana Bana De 🔥',
      subtitle: 'Premium Trimmers, Hair Dryers, Foot Massagers & Multi-grooming Kits with Warranty',
      price: 'Up to 40% OFF',
      originalPrice: 'Best Rates',
      discount: 'SAVE UP TO 40%',
      badge: 'PREMIUM QUALITY',
      image: '/images/agaro-products.jpg',
      link: '/shop?category=Gadgets',
      whatsappTopic: 'AGARO Grooming Products Offer'
    },
    {
      id: 'egg-boiler-deal',
      type: 'landscape-product',
      title: 'Automatic Electric Egg Boiler',
      tagline: 'Deal Aise Jo Deewana Bana De 🔥',
      subtitle: 'Boil 7 Eggs in 6 Mins • Instant Auto Cut-Off • Food-Grade Stainless Steel Design',
      price: '₹380',
      originalPrice: '₹799',
      discount: '52% OFF',
      badge: 'HOT SELLER GADGET',
      image: '/images/egg-boiler.jpg',
      link: '/shop?category=Gadgets',
      whatsappTopic: 'Electric Egg Boiler @ Rs 380 Deal'
    },
    {
      id: 'moto-vlogging-deal',
      type: 'landscape-product',
      title: 'Moto Vlogging Chest Harness Mount',
      tagline: 'Deal Aise Jo Deewana Bana De 🔥',
      subtitle: 'Ride & Record in 4K • Dual Universal Mount for Action Cam & Smartphone',
      price: '₹499',
      originalPrice: '₹999',
      discount: '50% OFF',
      badge: 'BIKER ESSENTIAL',
      image: '/images/moto-vlogging.jpg',
      link: '/product/21',
      whatsappTopic: 'Moto Vlogging Chest Harness Mount @ Rs 499'
    }
  ];

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6500);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused, slides.length]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const activeSlideData = slides[currentSlide];

  return (
    <section
      className="relative bg-[#050505] text-white pt-2 pb-6 sm:pb-8 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Ambient Glows & Gold Confetti */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#ffd000]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffd000_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      {/* Decorative Gold Sparkles */}
      <div className="absolute top-3 left-8 text-[#ffd000]/40 text-xl pointer-events-none select-none">✨</div>
      <div className="absolute top-10 left-1/3 text-[#f4b800]/50 text-2xl pointer-events-none select-none">🎉</div>
      <div className="absolute top-6 right-1/4 text-[#ffd000]/40 text-xl pointer-events-none select-none">✨</div>
      <div className="absolute bottom-8 right-8 text-[#ffd000]/40 text-2xl pointer-events-none select-none">🎉</div>

      <div className="max-w-[1540px] mx-auto px-3 sm:px-6 relative">
        
        {/* MAIN HERO LANDSCAPE SLIDER CONTAINER */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[26px] overflow-hidden border border-[#ffd000]/40 bg-[#000000] shadow-[0_12px_45px_rgba(0,0,0,0.9),0_0_35px_rgba(255,208,0,0.18)] group transition-all duration-300">
          
          {/* SLIDE CONTENT AREA - Sleek Landscape Frame */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[1024/520] max-h-[460px] min-h-[200px] sm:min-h-[320px] md:min-h-[390px] lg:min-h-[440px] flex items-center justify-center overflow-hidden bg-black">
            
            {/* 1. FULL LANDSCAPE IMAGE SLIDES (Main Banner & Sunday Special) */}
            {activeSlideData.type === 'landscape-image' ? (
              <div
                key={activeSlideData.id}
                className="relative w-full h-full flex items-center justify-center animate-fade-in cursor-pointer"
                onClick={() => openGeneralWhatsApp(activeSlideData.whatsappTopic)}
              >
                {/* Landscape Stretched Image */}
                <img
                  src={activeSlideData.image}
                  alt={activeSlideData.alt}
                  className="w-full h-full object-cover sm:object-fill object-center group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                />

                {/* Subtle Edge Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-30 sm:opacity-15" />

                {/* Interactive Floating Quick Actions Bar (Bottom Left & Right) */}
                <div className="absolute bottom-2.5 sm:bottom-4 left-3 sm:left-5 right-3 sm:right-5 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
                  
                  {/* Left Pill: Deal Tagline */}
                  <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#ffd000]/60 text-white shadow-lg">
                    <span className="text-xs">👑</span>
                    <span className="text-[11px] font-black tracking-wider text-[#ffd000] uppercase">
                      PREM MOBILE GWALIOR
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-[11px] font-bold text-white">
                      Pin To Park, Morar
                    </span>
                  </div>

                  {/* Right Actions: WhatsApp Order & Shop Now */}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openGeneralWhatsApp(activeSlideData.whatsappTopic);
                      }}
                      className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>ORDER ON WHATSAPP</span>
                    </button>

                    <Link
                      to={activeSlideData.link}
                      onClick={(e) => e.stopPropagation()}
                      className="hidden sm:inline-flex px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#ffd000] hover:bg-[#ffcb05] text-[#050505] font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-lg items-center gap-1.5 hover:scale-105 transition-all"
                    >
                      <span>EXPLORE DEALS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            ) : (
              /* 2. LANDSCAPE PRODUCT FEATURE DEAL SLIDES */
              <div
                key={activeSlideData.id}
                className="relative w-full h-full grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center p-5 sm:p-8 lg:p-10 z-10 animate-fade-in bg-gradient-to-r from-black via-[#0c0c0c] to-[#141414]"
              >
                {/* Left Content Column */}
                <div className="md:col-span-7 space-y-3 text-center md:text-left z-10">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e51b23] text-white text-[11px] font-black tracking-wider uppercase shadow-md">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>{activeSlideData.badge}</span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <h2 className="font-display font-black text-xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                      {activeSlideData.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl line-clamp-2">
                      {activeSlideData.subtitle}
                    </p>
                  </div>

                  {/* Pricing Bar */}
                  <div className="flex items-baseline justify-center md:justify-start gap-2.5 pt-0.5">
                    <span className="font-display font-black text-2xl sm:text-3xl text-[#ffd000] drop-shadow-[0_2px_10px_rgba(255,208,0,0.4)]">
                      {activeSlideData.price}
                    </span>
                    {activeSlideData.originalPrice && (
                      <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">
                        {activeSlideData.originalPrice}
                      </span>
                    )}
                    {activeSlideData.discount && (
                      <span className="px-2 py-0.5 rounded-md bg-[#ffd000]/20 border border-[#ffd000]/60 text-[#ffd000] font-black text-[11px] uppercase">
                        {activeSlideData.discount}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap gap-2.5 justify-center md:justify-start">
                    <button
                      onClick={() => openGeneralWhatsApp(activeSlideData.whatsappTopic)}
                      className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>ORDER ON WHATSAPP</span>
                    </button>

                    <Link
                      to={activeSlideData.link}
                      className="px-4 py-2 rounded-xl bg-[#ffd000] hover:bg-[#ffcb05] text-[#050505] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1 hover:scale-105 transition-all"
                    >
                      <span>VIEW PRODUCT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

                {/* Right Product Showcase Poster */}
                <div className="md:col-span-5 flex items-center justify-center relative">
                  <div className="relative max-h-[180px] sm:max-h-[260px] lg:max-h-[300px] rounded-2xl overflow-hidden border-2 border-[#ffd000]/60 shadow-[0_8px_25px_rgba(255,208,0,0.25)] bg-black group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={activeSlideData.image}
                      alt={activeSlideData.title}
                      className="w-full h-full max-h-[300px] object-contain"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Left Glassmorphism Navigation Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#ffd000] text-white hover:text-black border border-[#ffd000]/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 z-30 shadow-2xl hover:scale-110"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            {/* Right Glassmorphism Navigation Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#ffd000] text-white hover:text-black border border-[#ffd000]/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 z-30 shadow-2xl hover:scale-110"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            {/* Bottom Dots / Pill Navigation Indicators */}
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === idx
                      ? 'w-6 sm:w-7 h-1.5 sm:h-2 bg-[#ffd000] shadow-[0_0_8px_rgba(255,208,0,0.8)]'
                      : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
