import React from 'react';

export default function ProductDetailsSkeleton() {
  return (
    <div className="bg-white rounded-3xl sm:rounded-4xl border border-slate-200 p-6 sm:p-10 shadow-sm animate-pulse space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Gallery Skeleton */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl bg-slate-200" />
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-2xl bg-slate-200" />
            <div className="w-20 h-20 rounded-2xl bg-slate-200" />
            <div className="w-20 h-20 rounded-2xl bg-slate-200" />
          </div>
        </div>

        {/* Info & CTA Skeleton */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-slate-200 rounded-md" />
            <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
            <div className="h-4 w-1/2 bg-slate-200 rounded-md" />
          </div>

          {/* Price Banner Skeleton */}
          <div className="h-20 w-full rounded-2xl bg-slate-200" />

          {/* Description Skeleton */}
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-slate-200 rounded-md" />
            <div className="h-3.5 w-5/6 bg-slate-200 rounded-md" />
            <div className="h-3.5 w-4/6 bg-slate-200 rounded-md" />
          </div>

          {/* Variant Box Skeleton */}
          <div className="h-28 w-full rounded-2xl bg-slate-200" />

          {/* Buttons Skeleton */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-14 rounded-2xl bg-slate-200" />
            <div className="h-14 rounded-2xl bg-slate-200" />
          </div>
        </div>

      </div>
    </div>
  );
}
