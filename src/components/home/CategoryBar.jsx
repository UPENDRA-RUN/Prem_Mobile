import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { Grid3X3 } from 'lucide-react';

export default function CategoryBar() {
  return (
    <section className="relative z-20 -mt-3 sm:-mt-6 px-3 sm:px-6 max-w-[1500px] mx-auto">
      <div className="bg-white rounded-2xl sm:rounded-[22px] shadow-category border border-[#dedede] p-2.5 sm:p-4 overflow-hidden">
        
        {/* Horizontal Swipeable Track */}
        <div className="flex items-start gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1">
          {categories.map((cat, index) => {
            const isLast = index === 11 || cat.slug === 'view-all';

            return (
              <Link
                key={cat.id}
                to={cat.slug === 'view-all' ? '/categories' : `/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center justify-start flex-shrink-0 transition-transform duration-200 hover:-translate-y-1 active:scale-95 text-center w-[72px] min-[380px]:w-[78px] sm:w-[92px]"
              >
                {/* Large Circle Container */}
                {isLast ? (
                  <div className="w-[62px] h-[62px] min-[380px]:w-[68px] min-[380px]:h-[68px] sm:w-[78px] sm:h-[78px] rounded-full bg-[#ffd000] text-[#050505] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-1.5 border-2 border-black/10">
                    <Grid3X3 className="w-6 h-6 sm:w-8 sm:h-8 text-[#050505]" />
                  </div>
                ) : (
                  <div className="w-[62px] h-[62px] min-[380px]:w-[68px] min-[380px]:h-[68px] sm:w-[78px] sm:h-[78px] rounded-full bg-[#f6f6f6] p-1.5 flex items-center justify-center overflow-hidden border-2 border-slate-200/80 group-hover:border-[#ffd000] shadow-xs group-hover:scale-105 transition-all mb-1.5">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full mix-blend-multiply"
                    />
                  </div>
                )}

                {/* Readable Category Title - 2 lines max, never clipped with single-line cutoff */}
                <span className="font-bold text-[11px] sm:text-[13px] text-[#050505] group-hover:text-[#e51b23] transition-colors leading-tight line-clamp-2 h-7 flex items-center justify-center">
                  {isLast ? 'VIEW ALL' : cat.name}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
