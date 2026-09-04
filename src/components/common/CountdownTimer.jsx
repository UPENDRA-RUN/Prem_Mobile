import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ endDate, endTime, size = 'normal', dark = false }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!endDate) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const timePart = endTime && endTime.trim() !== '' ? endTime : '23:59:59';
      const formattedTimePart = timePart.length === 5 ? `${timePart}:00` : timePart;
      const targetDate = new Date(`${endDate}T${formattedTimePart}`);

      if (isNaN(targetDate.getTime())) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endDate, endTime]);

  if (timeLeft.isExpired) {
    return null;
  }

  // Compact badge mode (for header banner)
  if (size === 'compact') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 text-[#ffd000] font-mono text-xs font-bold border border-[#ffd000]/30 shadow-xs">
        <Clock className="w-3 h-3 text-[#ffd000] animate-spin-slow" />
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {String(timeLeft.hours).padStart(2, '0')}h:
          {String(timeLeft.minutes).padStart(2, '0')}m:
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </span>
    );
  }

  // Full digital box mode (for Sale page & Home page Hero)
  return (
    <div className="space-y-1.5">
      <span className={`text-[11px] font-black uppercase tracking-wider block flex items-center gap-1.5 ${dark ? 'text-slate-300' : 'text-[#ffd000]'}`}>
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        <span>OFFER ENDS IN:</span>
      </span>

      <div className="flex items-center gap-1 min-[380px]:gap-2">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 min-[380px]:w-11 min-[380px]:h-11 sm:w-13 sm:h-13 rounded-xl min-[380px]:rounded-2xl bg-black/80 border-2 border-[#ffd000]/60 text-white font-mono font-black text-base min-[380px]:text-lg sm:text-xl flex items-center justify-center shadow-lg">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <span className="text-[8px] min-[380px]:text-[9px] font-bold text-slate-400 uppercase mt-1">Days</span>
            </div>
            <span className="text-[#ffd000] font-black text-base min-[380px]:text-lg pb-3 sm:pb-4">:</span>
          </>
        )}

        <div className="flex flex-col items-center">
          <div className="w-9 h-9 min-[380px]:w-11 min-[380px]:h-11 sm:w-13 sm:h-13 rounded-xl min-[380px]:rounded-2xl bg-black/80 border-2 border-[#ffd000]/60 text-[#ffd000] font-mono font-black text-base min-[380px]:text-lg sm:text-xl flex items-center justify-center shadow-lg">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <span className="text-[8px] min-[380px]:text-[9px] font-bold text-slate-300 uppercase mt-1">Hours</span>
        </div>

        <span className="text-[#ffd000] font-black text-base min-[380px]:text-lg pb-3 sm:pb-4">:</span>

        <div className="flex flex-col items-center">
          <div className="w-9 h-9 min-[380px]:w-11 min-[380px]:h-11 sm:w-13 sm:h-13 rounded-xl min-[380px]:rounded-2xl bg-black/80 border-2 border-[#ffd000]/60 text-[#ffd000] font-mono font-black text-base min-[380px]:text-lg sm:text-xl flex items-center justify-center shadow-lg">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <span className="text-[8px] min-[380px]:text-[9px] font-bold text-slate-300 uppercase mt-1">Mins</span>
        </div>

        <span className="text-[#ffd000] font-black text-base min-[380px]:text-lg pb-3 sm:pb-4">:</span>

        <div className="flex flex-col items-center">
          <div className="w-9 h-9 min-[380px]:w-11 min-[380px]:h-11 sm:w-13 sm:h-13 rounded-xl min-[380px]:rounded-2xl bg-[#e51b23] border-2 border-white/60 text-white font-mono font-black text-base min-[380px]:text-lg sm:text-xl flex items-center justify-center shadow-lg animate-pulse">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <span className="text-[8px] min-[380px]:text-[9px] font-bold text-slate-300 uppercase mt-1">Secs</span>
        </div>
      </div>
    </div>
  );
}
