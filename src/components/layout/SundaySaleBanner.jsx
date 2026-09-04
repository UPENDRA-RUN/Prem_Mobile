import React from 'react';
import { Link } from 'react-router-dom';
import { useSundaySale } from '../../context/SundaySaleContext';
import { Flame, ArrowRight } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';

export default function SundaySaleBanner() {
  const { isLive, sale } = useSundaySale();

  if (!isLive) return null;

  return (
    <div className="bg-gradient-to-r from-[#b91017] via-[#e51b23] to-[#d4141c] text-white py-2 px-3 sm:px-4 sticky top-0 z-[1001] shadow-md transition-all">
      <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 flex-1 min-w-0 max-w-full">
          <span className="flex h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#ffd000] text-[#050505] items-center justify-center font-black animate-pulse flex-shrink-0">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500" />
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 justify-center sm:justify-start">
            <span className="font-display font-black text-[11px] sm:text-sm tracking-wide uppercase text-white drop-shadow-sm">
              🔥 {sale?.name ? `${sale.name.toUpperCase()} IS LIVE` : 'SPECIAL SALE IS LIVE'} 🔥
            </span>

            {sale?.endDate && (
              <CountdownTimer endDate={sale.endDate} endTime={sale.endTime} size="compact" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/sale"
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ffd000] hover:bg-white text-[#050505] font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all transform hover:scale-105 shadow-sm"
          >
            <span>SHOP SALE NOW</span>
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

