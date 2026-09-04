import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { parseResponseJson } from '../utils/apiHelper';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('premmobile_admin_token') || null;
  });
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('premmobile_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isVerifying, setIsVerifying] = useState(true);
  const verifyCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const currentVerify = ++verifyCountRef.current;

    async function verifySession() {
      if (!adminToken) {
        // No token — clear any stale user data
        setAdminUser(null);
        localStorage.removeItem('premmobile_admin_user');
        setIsVerifying(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });

        // Only update state if this is still the latest verification
        if (cancelled || currentVerify !== verifyCountRef.current) return;

        if (res.ok) {
          const data = await parseResponseJson(res);
          if (data.success && data.admin) {
            setAdminUser(data.admin);
            localStorage.setItem('premmobile_admin_user', JSON.stringify(data.admin));
          }
        } else if (res.status === 401 || res.status === 403) {
          // Token is genuinely invalid — only logout on auth errors
          const data = await parseResponseJson(res).catch(() => ({}));
          console.warn('Admin session invalid:', data.error || `HTTP ${res.status}`);
          logout();
        }
        // For other errors (500, network, etc.), keep the existing session alive
        // The user can still try — the next request will re-verify
      } catch (err) {
        // Network error — keep session alive, don't logout
        console.warn('Admin session verify network error (keeping session):', err.message);
      } finally {
        if (!cancelled && currentVerify === verifyCountRef.current) {
          setIsVerifying(false);
        }
      }
    }

    verifySession();

    return () => { cancelled = true; };
  }, [adminToken]);

  const login = (token, user) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('premmobile_admin_token', token);
    localStorage.setItem('premmobile_admin_user', JSON.stringify(user));
  };

  const logout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('premmobile_admin_token');
    localStorage.removeItem('premmobile_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminToken,
        token: adminToken,
        adminUser,
        admin: adminUser,
        isAuthenticated: Boolean(adminToken),
        isVerifying,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
