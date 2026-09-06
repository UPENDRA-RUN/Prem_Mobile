import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { openGeneralWhatsApp } from '../../utils/whatsapp';
import { heroSlides } from './heroData';
import { Flame, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

export default function MobileHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <div
      className="w-full relative px-3 py-3 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#ffd000]/60 bg-gradient-to-b from-[#111111] via-[#0a0a0a] to-black shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(255,208,0,0.2)] p-3.5 min-[380px]:p-4 flex flex-col justify-between">
        
        {/* TOP: DEAL BADGE */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e51b23] text-white text-[11px] font-black tracking-wider uppercase shadow-md">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>{activeSlide.badge}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#ffd000]">
            <Sparkles className="w-3.5 h-3.5 fill-[#ffd000]" />
            <span>Prem Special</span>
          </div>
        </div>

        {/* TITLE & SUBTITLE */}
        <div className="space-y-1 mb-2.5">
          <h2 className="font-display font-black text-xl min-[380px]:text-2xl text-white tracking-tight leading-snug">
            {activeSlide.title}
          </h2>
          <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
            {activeSlide.subtitle}
          </p>
        </div>

        {/* LARGE UN-CROPPED PROMOTIONAL IMAGE (object-fit: contain) */}
        <div
          onClick={() => openGeneralWhatsApp(activeSlide.whatsappTopic)}
          className="relative w-full aspect-[4/3] max-h-[250px] rounded-xl overflow-hidden bg-black border border-[#ffd000]/40 flex items-center justify-center p-2 mb-2.5 cursor-pointer shadow-inner"
        >
          <img
            src={activeSlide.image}
            alt={activeSlide.title}
            className="w-full h-full object-contain rounded-lg transition-transform duration-500 hover:scale-102"
          />
        </div>

        {/* PRICING BAR */}
        <div className="flex items-baseline justify-between gap-2 py-1.5 px-3 rounded-xl bg-black/70 border border-white/10 mb-2.5">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-2xl text-[#ffd000] drop-shadow-[0_2px_10px_rgba(255,208,0,0.5)]">
              {activeSlide.price}
            </span>
            {activeSlide.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-bold">
                {activeSlide.originalPrice}
              </span>
            )}
          </div>

          {activeSlide.discount && (
            <span className="px-2 py-0.5 rounded-md bg-[#e51b23] text-white font-black text-[10.5px] uppercase tracking-wide shadow-xs">
              {activeSlide.discount}
            </span>
          )}
        </div>

        {/* DUAL CTA BUTTONS: WHATSAPP + VIEW PRODUCT */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => openGeneralWhatsApp(activeSlide.whatsappTopic)}
            className="py-2.5 px-2 rounded-xl bg-[#25D366] active:bg-[#1faa4f] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white shrink-0" />
            <span className="truncate">WhatsApp</span>
          </button>

          <Link
            to={activeSlide.link}
            className="py-2.5 px-2 rounded-xl bg-[#ffd000] active:bg-[#e6bd00] text-[#050505] font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1 transition-transform active:scale-95 text-center"
          >
            <span className="truncate">View Deal</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
          </Link>
        </div>

        {/* SLIDER DOTS */}
        <div className="flex items-center justify-center gap-1.5 pt-2.5">
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
                  ? 'w-6 h-2 bg-[#ffd000] shadow-[0_0_8px_rgba(255,208,0,0.8)]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
