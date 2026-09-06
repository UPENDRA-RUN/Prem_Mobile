import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseResponseJson } from '../utils/apiHelper';
import { setCookie, getCookie, eraseCookie } from '../utils/cookies';

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [customerToken, setCustomerToken] = useState(() => {
    return localStorage.getItem('premmobile_customer_token') || getCookie('premmobile_customer_token') || null;
  });

  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const saved = localStorage.getItem('premmobile_customer_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return getCookie('premmobile_customer_user') || null;
  });

  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    async function verifyCustomerSession() {
      if (!customerToken) {
        setIsVerifying(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/customer/me', {
          headers: { Authorization: `Bearer ${customerToken}` }
        });
        if (res.ok) {
          const data = await parseResponseJson(res);
          if (data.success && data.user) {
            setCustomerUser(data.user);
            localStorage.setItem('premmobile_customer_user', JSON.stringify(data.user));
            setCookie('premmobile_customer_user', data.user, 30);
          }
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (err) {
        console.error('Customer session verify error:', err);
      } finally {
        setIsVerifying(false);
      }
    }

    verifyCustomerSession();
  }, [customerToken]);

  const login = (token, user) => {
    setCustomerToken(token);
    setCustomerUser(user);
    localStorage.setItem('premmobile_customer_token', token);
    localStorage.setItem('premmobile_customer_user', JSON.stringify(user));
    setCookie('premmobile_customer_token', token, 30);
    setCookie('premmobile_customer_user', user, 30);

    if (user) {
      const profile = {
        fullName: user.name || '',
        email: user.email || '',
        phone: user.mobile || '',
        address: user.address || 'Pinto Park, Gwalior',
        city: user.city || 'Gwalior',
        state: user.state || 'Madhya Pradesh',
        pincode: user.pincode || '474005'
      };
      localStorage.setItem('premmobile_user_profile', JSON.stringify(profile));
      setCookie('premmobile_user_profile', profile, 30);
    }
  };

  const logout = () => {
    setCustomerToken(null);
    setCustomerUser(null);
    localStorage.removeItem('premmobile_customer_token');
    localStorage.removeItem('premmobile_customer_user');
    localStorage.removeItem('premmobile_user_profile');
    eraseCookie('premmobile_customer_token');
    eraseCookie('premmobile_customer_user');
    eraseCookie('premmobile_user_profile');
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customerToken,
        token: customerToken,
        customerUser,
        user: customerUser,
        isAuthenticated: Boolean(customerToken),
        isVerifying,
        login,
        logout
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
