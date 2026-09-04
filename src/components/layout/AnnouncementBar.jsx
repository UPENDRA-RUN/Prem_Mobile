import React from 'react';
import { storeConfig } from '../../config/store';
import { MapPin, Instagram, Facebook, Clock } from 'lucide-react';

function getIsStoreClosedToday() {
  if (!storeConfig.closedDay) return false;
  const todayIndex = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long' });
  return todayIndex.toLowerCase() === storeConfig.closedDay.toLowerCase();
}

export default function AnnouncementBar() {
  const isClosedToday = getIsStoreClosedToday();

  return (
    <div className={`text-white text-xs h-[38px] flex items-center ${isClosedToday ? 'bg-[#E31B23]/90' : 'bg-[#050505]'} border-b border-[#ffd000]/40`}>
      <div className="max-w-[1500px] w-full mx-auto px-3 sm:px-6 flex items-center justify-between gap-2">
        
        {/* LEFT: Address or Closed Notice */}
        {isClosedToday ? (
          <div className="flex items-center gap-1.5 text-white truncate min-w-0">
            <Clock className="w-3.5 h-3.5 text-white flex-shrink-0" />
            <span className="font-bold text-[11px] sm:text-[12px] truncate">
              🚫 Store Closed Today ({storeConfig.closedDay}). We open tomorrow! {storeConfig.timing}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-200 truncate min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#ffd000] flex-shrink-0" />
            <span className="font-normal text-[11px] sm:text-[12px] truncate">
              {storeConfig.address}
            </span>
          </div>
        )}

        {/* CENTER: Official Tagline */}
        <div className="hidden md:flex items-center gap-1.5 text-center flex-shrink-0">
          <span className="text-[#ffd000] text-[12px] font-bold tracking-wide flex items-center gap-1">
            📍 {storeConfig.tagline}
          </span>
        </div>

        {/* RIGHT: Follow Us */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-300 flex-shrink-0">
          <span className="hidden min-[380px]:inline text-[10px] sm:text-[11px] font-semibold text-slate-300">Follow Us:</span>
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
