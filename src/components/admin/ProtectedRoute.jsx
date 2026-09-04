import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ProtectedRoute() {
  const { isAuthenticated: isAdmin, isVerifying: isAdminVerifying } = useAdminAuth();
  const { isAuthenticated: isCustomer } = useCustomerAuth();
  const location = useLocation();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    // If user is authenticated as customer but not as admin and tries to access admin routes
    if (!isAdminVerifying && !isAdmin && isCustomer) {
      setShowAccessDenied(true);
      const timer = setTimeout(() => {
        setShowAccessDenied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, isAdminVerifying, isCustomer]);

  if (isAdminVerifying) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#ffd000] border-t-[#e51b23] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Verifying administrator session...</p>
        </div>
      </div>
    );
  }

  // Requirement 7: If a normal Customer tries to access /admin/* show: "Access denied."
  if (showAccessDenied || (!isAdmin && isCustomer)) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full bg-[#0f172a] border-2 border-red-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-shake">
          <div className="w-16 h-16 rounded-full bg-red-900/30 border border-red-500 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-red-400">Access denied.</h2>
            <p className="text-sm text-slate-300">
              You are logged in as a Customer. Administrator privileges are required to access the Admin Management Portal.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <a
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-[#050505] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Customer Store</span>
            </a>
            <a
              href="/admin/login"
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Sign in with Admin Credentials →
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
