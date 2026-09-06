import React, { useState, useEffect } from 'react';
import { getStoreLiveStatus } from '../../utils/storeStatus';

export default function StoreLiveBadge({ compact = false }) {
  const [status, setStatus] = useState(getStoreLiveStatus);

  useEffect(() => {
    // Update every minute
    const timer = setInterval(() => {
      setStatus(getStoreLiveStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9.5px] min-[380px]:text-[10px] font-bold tracking-tight shadow-xs ${status.badgeClass}`}
      title={status.text}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
        }`}
      />
      <span className="truncate">{compact ? status.shortText : status.text}</span>
    </div>
  );
}
