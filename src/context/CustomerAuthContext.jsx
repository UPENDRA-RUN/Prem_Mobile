import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [customerToken, setCustomerToken] = useState(() => {
    return localStorage.getItem('premmobile_customer_token') || null;
  });

  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const saved = localStorage.getItem('premmobile_customer_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
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
          const data = await res.json();
          if (data.success && data.user) {
            setCustomerUser(data.user);
            localStorage.setItem('premmobile_customer_user', JSON.stringify(data.user));
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
  };

  const logout = () => {
    setCustomerToken(null);
    setCustomerUser(null);
    localStorage.removeItem('premmobile_customer_token');
    localStorage.removeItem('premmobile_customer_user');
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
