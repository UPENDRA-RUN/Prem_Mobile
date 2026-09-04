import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchLaravelProducts } from '../api/laravel';
import { categories } from '../data/categories';
import ProductGrid from '../components/product/ProductGrid';
import { ArrowLeft, ArrowRight, Flame } from 'lucide-react';
import { storeConfig } from '../config/store';

export default function CategoryProducts() {
  const { category: categoryParam } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchLaravelProducts({ category: categoryParam }).then(res => {
      if (res.success) setProducts(res.data || []);
    });
  }, [categoryParam]);

  const normalizedParam = categoryParam ? categoryParam.toLowerCase().replace(/-/g, ' ') : '';

  const currentCategory = categories.find(
    (c) =>
      c.slug.toLowerCase() === categoryParam?.toLowerCase() ||
      c.name.toLowerCase() === normalizedParam ||
      c.name.toLowerCase() === categoryParam?.toLowerCase()
  );

  const categoryName = currentCategory ? currentCategory.name : normalizedParam || categoryParam || 'Category';

  const categoryProducts = products.filter(
    (p) =>
      p.category.toLowerCase() === categoryName.toLowerCase() ||
      p.categorySlug === categoryParam?.toLowerCase() ||
      p.categorySlug === normalizedParam
  );

  return (
    <div className="py-8 sm:py-12 bg-[#f5f5f5] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-6">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#e51b23] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Categories</span>
          </Link>
        </div>

        {/* Category Header Banner */}
        <div className="rounded-3xl bg-[#050505] text-white p-6 sm:p-8 mb-8 shadow-xl border-2 border-[#ffd000]/40 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e51b23] text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>CATEGORY SHOWCASE</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
              {categoryName}
            </h1>
            <p className="text-xs sm:text-sm text-[#ffd000] font-bold">
              {currentCategory?.description || `Explore top-rated ${categoryName} models and deals at Prem Mobile Gwalior.`}
            </p>
          </div>
          <div className="absolute right-0 -bottom-10 w-64 h-64 bg-[#ffd000]/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>Showing {categoryProducts.length} Items</span>
            <Link to="/shop" className="text-[#e51b23] hover:underline flex items-center gap-1">
              <span>View full catalog</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <ProductGrid
            products={categoryProducts}
            columns="grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            emptyMessage={`No items found under ${categoryName}. Browse our other exciting electronics categories!`}
          />
        </div>

      </div>
    </div>
  );
}
