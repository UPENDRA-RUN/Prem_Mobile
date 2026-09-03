import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3 sm:p-4 shadow-sm flex flex-col justify-between animate-pulse">
      {/* Aspect-square image container skeleton */}
      <div>
        <div className="aspect-square w-full rounded-xl sm:rounded-2xl bg-slate-200 mb-3" />

        {/* Brand tag & rating skeleton */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 bg-slate-200 rounded-md" />
            <div className="h-3 w-12 bg-slate-200 rounded-md" />
          </div>

          {/* 2-line title skeleton */}
          <div className="space-y-1.5 pt-1">
            <div className="h-4 w-full bg-slate-200 rounded-md" />
            <div className="h-4 w-3/4 bg-slate-200 rounded-md" />
          </div>

          {/* Price line skeleton */}
          <div className="flex items-baseline gap-2 pt-2">
            <div className="h-5 w-20 bg-slate-200 rounded-md" />
            <div className="h-3 w-12 bg-slate-200 rounded-md" />
          </div>
        </div>
      </div>

      {/* 2-button action grid skeleton */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <div className="h-9 rounded-xl bg-slate-200" />
        <div className="h-9 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
