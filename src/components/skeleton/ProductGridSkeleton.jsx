import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function ProductGridSkeleton({
  count = 6,
  columns = 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
}) {
  return (
    <div className={`grid ${columns} gap-3 sm:gap-5`}>
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}
