import React, { useState, useEffect } from 'react';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[1000] w-full bg-white transition-all duration-200 ${
        isScrolled ? 'shadow-md border-b border-slate-200' : 'border-b border-[#dedede]'
      }`}
    >
      {/* MOBILE NAVBAR (< 1024px) */}
      <div className="block lg:hidden">
        <MobileNavbar />
      </div>

      {/* DESKTOP NAVBAR (>= 1024px) */}
      <div className="hidden lg:block">
        <DesktopNavbar />
      </div>
    </header>
  );
}
