import React from 'react';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

export default function ProductGrid({
  products = [],
  searchQuery = '',
  columns = 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  emptyMessage = 'No products found matching your selection.'
}) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#050505] flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <PackageOpen className="w-8 h-8 text-[#050505]" />
        </div>
        <h4 className="text-lg font-bold text-[#050505]">No Products Found</h4>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${columns} gap-3 sm:gap-5`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} searchQuery={searchQuery} />
      ))}
    </div>
  );
}
