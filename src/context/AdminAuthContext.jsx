import React, { createContext, useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    async function verifySession() {
      if (!adminToken) {
        setIsVerifying(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const data = await parseResponseJson(res);
          if (data.success && data.admin) {
            setAdminUser(data.admin);
            localStorage.setItem('premmobile_admin_user', JSON.stringify(data.admin));
          }
        } else {
          // Token invalid
          logout();
        }
      } catch (err) {
        console.error('Session verify error:', err);
      } finally {
        setIsVerifying(false);
      }
    }

    verifySession();
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
        token: adminToken, // Alias
        adminUser,
        admin: adminUser,   // Alias
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
