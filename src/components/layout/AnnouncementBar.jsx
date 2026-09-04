import React from 'react';
import { storeConfig } from '../../config/store';
import { MapPin, Instagram, Facebook } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="text-white text-xs h-[38px] flex items-center bg-[#050505] border-b border-[#ffd000]/40">
      <div className="max-w-[1500px] w-full mx-auto px-6 flex items-center justify-between">
        
        {/* LEFT: Address */}
        <div className="flex items-center gap-1.5 text-slate-200 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#ffd000] flex-shrink-0" />
          <span className="font-normal text-[12px] truncate">
            {storeConfig.address}
          </span>
        </div>

        {/* CENTER: Official Tagline */}
        <div className="hidden md:flex items-center gap-1.5 text-center">
          <span className="text-[#ffd000] text-[12px] font-bold tracking-wide flex items-center gap-1">
            📍 {storeConfig.tagline}
          </span>
        </div>

        {/* RIGHT: Follow Us */}
        <div className="flex items-center gap-3 text-slate-300 flex-shrink-0">
          <span className="text-[11px] font-semibold text-slate-300">Follow Us:</span>
          <a
            href={storeConfig.socials?.instagram || 'https://instagram.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-[#ffd000] transition-colors"
            title="Follow on Instagram"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <a
            href={storeConfig.socials?.facebook || 'https://facebook.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-[#ffd000] transition-colors"
            title="Follow on Facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
