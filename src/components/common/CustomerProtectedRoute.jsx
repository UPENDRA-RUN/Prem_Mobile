import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export default function CustomerProtectedRoute() {
  const { isAuthenticated, isVerifying } = useCustomerAuth();
  const location = useLocation();

  if (isVerifying) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#ffd000] border-t-[#e51b23] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Checking your account session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname, message: 'Please log in to access this page.' }} replace />;
  }

  return <Outlet />;
}
