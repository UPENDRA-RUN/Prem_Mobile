import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export default function RatingStars({ rating = 4.5, reviewsCount, showText = true, size = 'sm' }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;
  const starSize = size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className={`${starSize} fill-amber-400`} />;
          }
          if (i === fullStars && hasHalf) {
            return <StarHalf key={i} className={`${starSize} fill-amber-400 text-amber-400`} />;
          }
          return <Star key={i} className={`${starSize} text-slate-200 fill-slate-100`} />;
        })}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700">
          {rating.toFixed(1)}
          {reviewsCount && (
            <span className="text-slate-400 font-normal ml-1">({reviewsCount})</span>
          )}
        </span>
      )}
    </div>
  );
}
