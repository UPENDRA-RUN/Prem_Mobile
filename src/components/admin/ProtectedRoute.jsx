import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, isVerifying } = useAdminAuth();

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#ffd000] border-t-[#e51b23] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Verifying administrator session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
