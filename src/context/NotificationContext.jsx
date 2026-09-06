import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCustomerAuth } from './CustomerAuthContext';
import { useAdminAuth } from './AdminAuthContext';
import { getApiUrl } from '../utils/apiHelper';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const customerAuth = useCustomerAuth();
  const adminAuth = useAdminAuth();

  const customerUser = customerAuth?.customerUser;
  const isAdmin = adminAuth?.isAuthenticated;

  // Compute storage key based on active user context
  const getActiveUserKey = () => {
    if (isAdmin) return 'admin';
    if (customerUser?.id) return `user_${customerUser.id}`;
    if (customerUser?.email) return `user_${customerUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    if (customerUser?.mobile) return `user_${customerUser.mobile}`;
    return 'guest';
  };

  const activeUserKey = getActiveUserKey();
  const storageKey = `premmobile_notifications_${activeUserKey}`;

  // Initial seed notifications for demo trust building if key is fresh
  const defaultNotifications = [
    {
      id: 'welcome_1',
      type: 'WELCOME',
      title: 'Welcome to Prem Mobile!',
      message: 'Explore 100% authentic mobile accessories with Gwalior local fast delivery.',
      link: '/shop',
      read: false,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'coupon_welcome',
      type: 'PROMO',
      title: 'Special Coupon Unlocked 🎟️',
      message: 'Use code GWALIOR10 at checkout for 10% instant discount on your cart!',
      link: '/shop',
      read: false,
      createdAt: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultNotifications;
    } catch (e) {
      return defaultNotifications;
    }
  });

  // Switch notifications dynamically when user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setNotifications(saved ? JSON.parse(saved) : defaultNotifications);
    } catch (e) {
      setNotifications(defaultNotifications);
    }
  }, [storageKey]);

  // Persist notifications to active user's storage key
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications to localStorage', e);
    }
  }, [notifications, storageKey]);

  // Connect to backend SSE endpoint for live updates
  useEffect(() => {
    let eventSource;
    try {
      const sseUrl = getApiUrl('/api/events');
      eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'ORDERS_UPDATED' && data.orderNumber && data.status) {
            // Check if order belongs to current user or if user is admin
            const isMatch = isAdmin || 
              (customerUser?.id && String(data.userId) === String(customerUser.id)) ||
              (customerUser?.mobile && data.mobile && data.mobile.replace(/\D/g, '') === customerUser.mobile.replace(/\D/g, '')) ||
              (customerUser?.email && data.email && data.email.toLowerCase() === customerUser.email.toLowerCase()) ||
              (!customerUser && !isAdmin); // Allow notification for active session guest who placed order

            if (isMatch) {
              const statusTextMap = {
                PENDING: 'Order Placed & Awaiting Confirmation ⏳',
                CONFIRMED: 'Order Confirmed & Preparing for Dispatch 🚚',
                DELIVERED: 'Order Delivered Safely! Enjoy your accessories 🎉',
                CANCELLED: 'Order Cancelled'
              };

              const newNotif = {
                id: `ord_${data.orderId || Date.now()}_${data.status}`,
                type: 'ORDER_STATUS',
                title: `Order #${data.orderNumber} Updated`,
                message: `${statusTextMap[data.status] || `Status: ${data.status}`} (${data.city || 'Gwalior'})`,
                link: isAdmin ? '/admin/orders' : '/orders',
                read: false,
                createdAt: new Date().toISOString()
              };

              setNotifications((prev) => {
                if (prev.some((n) => n.id === newNotif.id)) return prev;
                return [newNotif, ...prev];
              });
            }
          } else if (data.type === 'SUNDAY_SALE_ACTIVATED') {
            const newNotif = {
              id: `sale_${Date.now()}`,
              type: 'SALE',
              title: '🔥 Sunday Super Sale is Live!',
              message: 'Exclusive discounts on Earbuds, Chargers, and Covers today only in Gwalior!',
              link: '/sunday-sale',
              read: false,
              createdAt: new Date().toISOString()
            };

            setNotifications((prev) => [newNotif, ...prev]);
          }
        } catch (err) {
          console.error('Error handling SSE event in NotificationContext:', err);
        }
      };

      eventSource.onerror = () => {
        // Quietly failover; EventSource will auto-reconnect
      };
    } catch (err) {
      console.warn('SSE EventSource initialization failed:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [activeUserKey, customerUser, isAdmin]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notif) => {
    const formatted = {
      id: notif.id || `custom_${Date.now()}`,
      type: notif.type || 'INFO',
      title: notif.title || 'Notification',
      message: notif.message || '',
      link: notif.link || '#',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [formatted, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
