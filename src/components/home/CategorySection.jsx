import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { ArrowRight, ChevronRight, Layers } from 'lucide-react';

export default function CategorySection() {
  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Explore Tech Categories</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-navy-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Everything you need for your everyday technology and mobile lifestyle.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-800 hover:underline transition-all"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid / Horizontal Scroll for Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-3 sm:p-4 shadow-xs hover:shadow-card-hover hover:border-brand-400 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* Category Image Area */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-50/60 p-2 mb-3 flex items-center justify-center overflow-hidden border border-brand-100 group-hover:bg-brand-100/60 transition-colors">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Name and Count */}
              <h3 className="font-bold text-xs sm:text-sm text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                {category.name}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                {category.itemCount}
              </span>

              {/* Small Action Arrow */}
              <div className="mt-2 w-6 h-6 rounded-full bg-slate-50 text-slate-400 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-all">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
