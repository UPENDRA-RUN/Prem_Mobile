import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { Grid3X3, Grid } from 'lucide-react';

export default function CategoryBar() {
  return (
    <section className="relative z-20 -mt-7 sm:-mt-8 px-6 max-w-[1500px] mx-auto">
      <div
        className="bg-white rounded-[20px] shadow-category border border-[#dedede] px-4 sm:px-6 py-4 flex items-center justify-between overflow-x-auto no-scrollbar"
        style={{ minHeight: '145px' }}
      >
        <div className="flex items-center justify-between w-full gap-4 sm:gap-6 min-w-max lg:min-w-0">
          {categories.map((cat, index) => {
            const isLast = index === 11 || cat.slug === 'view-all';

            return (
              <Link
                key={cat.id}
                to={cat.slug === 'view-all' ? '/categories' : `/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center justify-center flex-1 transition-transform duration-200 hover:-translate-y-1"
                style={{ minWidth: '85px' }}
              >
                {/* Circle Container (75px x 75px) */}
                {isLast ? (
                  <div className="w-[72px] h-[72px] sm:w-[75px] sm:h-[75px] rounded-full bg-[#ffd000] text-[#050505] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2">
                    <Grid3X3 className="w-8 h-8 text-[#050505]" />
                  </div>
                ) : (
                  <div className="w-[72px] h-[72px] sm:w-[75px] sm:h-[75px] rounded-full bg-[#f4f4f4] p-1.5 flex items-center justify-center overflow-hidden border border-slate-200/60 group-hover:border-[#ffd000] shadow-xs group-hover:scale-105 transition-all mb-2">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full mix-blend-multiply"
                    />
                  </div>
                )}

                {/* Category Title (14-15px black font) */}
                <span className="font-bold text-[13px] sm:text-[14px] text-[#050505] group-hover:text-[#e51b23] transition-colors text-center leading-tight">
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
