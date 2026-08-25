import React from 'react';
import { Link } from 'react-router-dom';
import { specialOffers } from '../../data/offers';
import { storeConfig } from '../../config/store';
import { Sparkles, ArrowRight, Tag, Percent } from 'lucide-react';

export default function SpecialOffers() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Store Offers</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-navy-900 tracking-tight">
            Deals You’ll Love
          </h2>

          <p className="text-base sm:text-lg font-bold text-brand-700">
            “{storeConfig.tagline}”
          </p>

          <p className="text-xs sm:text-sm text-slate-500">
            Handpicked seasonal promotions and bundled electronics deals at our Pinto Park, Gwalior store.
          </p>
        </div>

        {/* 4 Offer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {specialOffers.map((offer) => (
            <div
              key={offer.id}
              className="group relative rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-brand-400 transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden"
            >
              {/* Background gradient banner on card header */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${offer.gradient}`} />

              <div>
                {/* Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-extrabold text-[11px] border border-brand-200">
                    {offer.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-semibold">
                    CODE: {offer.code}
                  </span>
                </div>

                {/* Offer Image */}
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-3.5 bg-slate-50 border border-slate-100">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Offer Title & Text */}
                <h3 className="font-display font-bold text-base text-navy-900 group-hover:text-brand-600 transition-colors leading-snug">
                  {offer.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {offer.subtitle}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to={`/shop?category=${encodeURIComponent(offer.category)}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-brand-50 group-hover:bg-brand-600 text-brand-700 group-hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200"
                >
                  <span>{offer.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
