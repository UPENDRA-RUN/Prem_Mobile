import React from 'react';
import MobileHero from './MobileHero';
import DesktopHero from './DesktopHero';

export default function HeroSlider() {
  return (
    <section className="relative bg-[#050505] text-white pt-1 pb-4 sm:pb-6 overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#ffd000]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffd000_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      {/* DEDICATED MOBILE HERO (< 768px) */}
      <div className="block md:hidden">
        <MobileHero />
      </div>

      {/* DEDICATED DESKTOP HERO (>= 768px) */}
      <div className="hidden md:block">
        <DesktopHero />
      </div>
    </section>
  );
}
