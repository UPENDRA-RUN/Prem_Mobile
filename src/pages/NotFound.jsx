import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Home, ArrowLeft } from 'lucide-react';
import { storeConfig } from '../config/store';

export default function NotFound() {
  return (
    <div className="py-24 bg-slate-50 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-md">
          <Smartphone className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold font-display text-brand-600">404</span>
          <h1 className="text-2xl font-bold text-navy-900">Page Not Found</h1>
          <p className="text-sm text-slate-500">
            The page you are looking for might have been moved or doesn't exist. “{storeConfig.tagline}”.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 shadow-md flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          <Link
            to="/shop"
            className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
          >
            Explore Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
