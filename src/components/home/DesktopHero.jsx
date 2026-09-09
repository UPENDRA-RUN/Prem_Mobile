import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { openGeneralWhatsApp } from '../../utils/whatsapp';
import { heroSlides } from './heroData';
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ArrowRight,
  Flame
} from 'lucide-react';

export default function DesktopHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6500);
      return () => clearInterval(timer);
    }
  }, [isPaused]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const activeSlideData = heroSlides[currentSlide];

  return (
    <div
      className="max-w-[1540px] mx-auto px-6 py-4 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full rounded-3xl overflow-hidden border border-[#ffd000]/40 bg-black shadow-[0_12px_45px_rgba(0,0,0,0.9),0_0_35px_rgba(255,208,0,0.18)] group transition-all duration-300">
        
        <div className="relative w-full aspect-[2.7/1] min-h-[380px] max-h-[460px] flex items-center justify-center overflow-hidden bg-black">
          
          {activeSlideData.type === 'landscape-image' ? (
            <div
              key={activeSlideData.id}
              className="relative w-full h-full flex items-center justify-center animate-fade-in cursor-pointer"
              onClick={() => openGeneralWhatsApp(activeSlideData.whatsappTopic)}
            >
              <img
                src={activeSlideData.image}
                alt={activeSlideData.alt}
                className="w-full h-full object-cover object-center transform-gpu backface-hidden [image-rendering:-webkit-optimize-contrast]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          ) : (
            <div
              key={activeSlideData.id}
              className="relative w-full h-full grid grid-cols-12 gap-6 items-center p-8 z-10 animate-fade-in bg-gradient-to-r from-black via-[#0c0c0c] to-[#141414]"
            >
              {/* Left Column */}
              <div className="col-span-7 space-y-3 text-left z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e51b23] text-white text-[11px] font-black tracking-wider uppercase shadow-md">
                  <Flame className="w-3 h-3 fill-white" />
                  <span>{activeSlideData.badge}</span>
                </div>

                <div className="space-y-1">
                  <h2 className="font-display font-black text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                    {activeSlideData.title}
                  </h2>
                  <p className="text-sm text-slate-300 font-medium max-w-xl line-clamp-2">
                    {activeSlideData.subtitle}
                  </p>
                </div>

                {/* Pricing Bar */}
                <div className="flex items-baseline gap-2.5 pt-0.5">
                  <span className="font-display font-black text-3xl text-[#ffd000] drop-shadow-[0_2px_10px_rgba(255,208,0,0.4)]">
                    {activeSlideData.price}
                  </span>
                  {activeSlideData.originalPrice && (
                    <span className="text-sm text-slate-400 line-through font-semibold">
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
                <div className="pt-2 flex flex-wrap gap-2.5">
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
              <div className="col-span-5 flex items-center justify-center relative h-full">
                <div className="relative h-full max-h-[340px] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#ffd000]/60 shadow-[0_8px_25px_rgba(255,208,0,0.25)] bg-black flex items-center justify-center">
                  <img
                    src={activeSlideData.image}
                    alt={activeSlideData.title}
                    className="w-full h-full object-contain p-2 transform-gpu backface-hidden [image-rendering:-webkit-optimize-contrast]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#ffd000] text-white hover:text-black border border-[#ffd000]/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 z-30 shadow-2xl hover:scale-110"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Navigation Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#ffd000] text-white hover:text-black border border-[#ffd000]/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 z-30 shadow-2xl hover:scale-110"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Bottom Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === idx
                    ? 'w-7 h-2 bg-[#ffd000] shadow-[0_0_8px_rgba(255,208,0,0.8)]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
