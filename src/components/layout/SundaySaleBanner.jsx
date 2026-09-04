import React from 'react';
import { Link } from 'react-router-dom';
import { useSundaySale } from '../../context/SundaySaleContext';
import { Flame, ArrowRight } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';

export default function SundaySaleBanner() {
  const { isLive, sale } = useSundaySale();

  if (!isLive) return null;

  return (
    <div className="bg-gradient-to-r from-[#b91017] via-[#e51b23] to-[#d4141c] text-white py-2.5 px-4 sticky top-0 z-[1001] shadow-md transition-all">
      <div className="max-w-[1500px] mx-auto flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-1 min-w-[260px]">
          <span className="flex h-7 w-7 rounded-full bg-[#ffd000] text-[#050505] items-center justify-center font-black animate-pulse flex-shrink-0">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          </span>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 justify-center sm:justify-start">
            <span className="font-display font-black text-xs sm:text-sm tracking-wide uppercase text-white drop-shadow-sm">
              🔥 {sale?.name ? `${sale.name.toUpperCase()} IS LIVE` : 'SPECIAL SALE IS LIVE'} 🔥
            </span>

            {sale?.endDate && (
              <CountdownTimer endDate={sale.endDate} endTime={sale.endTime} size="compact" />
            )}
          </div>
        </div>

        <div className="mx-auto sm:mx-0 flex items-center gap-2">
          <Link
            to="/sale"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffd000] hover:bg-white text-[#050505] font-black text-xs uppercase tracking-wider transition-all transform hover:scale-105 shadow-sm"
          >
            <span>SHOP SALE NOW</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

