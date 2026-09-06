/**
 * Browser Cookie Helper Utility for Prem Mobile
 * Supports storing, reading, and clearing customer & admin sessions in browser cookies.
 */

export function setCookie(name, value, days = 30) {
  if (typeof document === 'undefined') return;
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const stringVal = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const encodedValue = encodeURIComponent(stringVal);
    document.cookie = `${name}=${encodedValue}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {
    console.error(`[Cookie] Failed to set ${name}:`, e);
  }
}

export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  try {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
      const [key, ...valParts] = c.split('=');
      if (key.trim() === name) {
        const rawVal = decodeURIComponent(valParts.join('='));
        try {
          return JSON.parse(rawVal);
        } catch {
          return rawVal;
        }
      }
    }
  } catch (e) {
    console.error(`[Cookie] Failed to read ${name}:`, e);
  }
  return null;
}

export function eraseCookie(name) {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  } catch (e) {
    console.error(`[Cookie] Failed to erase ${name}:`, e);
  }
}
