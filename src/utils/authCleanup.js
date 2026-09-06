import { eraseCookie } from './cookies';

/**
 * Universal Security Session Wipe for Prem Mobile
 * Ensures total isolation on logout so no residual token, cookie,
 * profile data, or active context can bleed into another user's session.
 */
export function purgeAllAuthSessions() {
  try {
    // 1. Clear all localStorage auth & profile keys
    const keysToRemove = [
      'premmobile_admin_token',
      'premmobile_admin_user',
      'premmobile_customer_token',
      'premmobile_customer_user',
      'premmobile_user_profile'
    ];

    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    });

    // Also remove any premmobile_notifications_* keys to prevent notification bleed
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('premmobile_notifications_')) {
        try {
          localStorage.removeItem(key);
        } catch (e) {}
      }
    });

    // 2. Clear sessionStorage
    try {
      sessionStorage.clear();
    } catch (e) {}

    // 3. Erase browser cookies
    keysToRemove.forEach((name) => {
      eraseCookie(name);
    });

    // 4. Notify backend server to clear HTTP cookies
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  } catch (err) {
    console.error('Error executing auth session purge:', err);
  }
}
