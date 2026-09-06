import React from 'react';
import { Link } from 'react-router-dom';
import { useSundaySale } from '../../context/SundaySaleContext';
import { Flame, ArrowRight } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';

export default function SundaySaleBanner() {
  const { isLive, sale } = useSundaySale();

  if (!isLive) return null;

  return (
    <div className="bg-gradient-to-r from-[#b91017] via-[#e51b23] to-[#d4141c] text-white py-1.5 px-3 sm:px-4 sticky top-0 z-[1001] shadow-md transition-all">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="flex h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#ffd000] text-[#050505] items-center justify-center font-black animate-pulse flex-shrink-0">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="font-display font-black text-[10px] min-[380px]:text-[11px] sm:text-xs tracking-wide uppercase text-white truncate">
              {sale?.name ? `${sale.name.toUpperCase()} LIVE` : 'SUNDAY SALE LIVE'}
            </span>

            {sale?.endDate && (
              <div className="hidden sm:block">
                <CountdownTimer endDate={sale.endDate} endTime={sale.endTime} size="compact" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/sale"
            className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-1 rounded-full bg-[#ffd000] active:bg-[#e6be00] hover:bg-white text-[#050505] font-black text-[9.5px] min-[380px]:text-[10.5px] sm:text-xs uppercase tracking-wider transition-all transform hover:scale-105 shadow-xs"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
