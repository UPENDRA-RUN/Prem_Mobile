import React from 'react';

export default function ProgressBar({
  progress = null, // null for indeterminate, 0-100 for percentage
  color = "bg-[#FFD400]"
}) {
  return (
    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden relative">
      {progress === null ? (
        <div className={`h-full ${color} w-1/3 rounded-full animate-pulse`} />
      ) : (
        <div
          className={`h-full ${color} transition-all duration-300 rounded-full`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      )}
    </div>
  );
}
