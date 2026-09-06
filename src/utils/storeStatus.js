import { storeConfig } from '../config/store';

/**
 * Get real-time store open/closed status based on IST (Asia/Kolkata)
 * @returns {object} { isOpen: boolean, isClosedToday: boolean, text: string, shortText: string }
 */
export function getStoreLiveStatus() {
  try {
    const now = new Date();
    
    // Format to Asia/Kolkata
    const istTimeStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
    const istDayStr = now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long' });
    
    const [hourStr, minStr] = istTimeStr.split(':');
    const currentHour = parseInt(hourStr, 10);
    const currentMinute = parseInt(minStr, 10);
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    const openMinutes = 10 * 60; // 10:00 AM
    const closeMinutes = 21 * 60 + 30; // 9:30 PM

    // Check closed day (Tuesday)
    if (storeConfig.closedDay && istDayStr.toLowerCase() === storeConfig.closedDay.toLowerCase()) {
      return {
        isOpen: false,
        isClosedToday: true,
        text: `Store Closed Today (${storeConfig.closedDay}) • Opens Tomorrow 10:00 AM`,
        shortText: `Closed Today (${storeConfig.closedDay})`,
        badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40'
      };
    }

    // Check operating hours
    if (currentTotalMinutes >= openMinutes && currentTotalMinutes < closeMinutes) {
      return {
        isOpen: true,
        isClosedToday: false,
        text: '🟢 Store Open Now • Closes 9:30 PM',
        shortText: 'Open Now (Till 9:30 PM)',
        badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
      };
    }

    if (currentTotalMinutes < openMinutes) {
      return {
        isOpen: false,
        isClosedToday: false,
        text: 'Store Closed • Opens Today at 10:00 AM',
        shortText: 'Opens at 10:00 AM',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      };
    }

    return {
      isOpen: false,
      isClosedToday: false,
      text: 'Store Closed • Opens Tomorrow at 10:00 AM',
      shortText: 'Opens Tomorrow 10:00 AM',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    };
  } catch (err) {
    return {
      isOpen: true,
      isClosedToday: false,
      text: '🟢 Store Open • 10 AM - 9:30 PM',
      shortText: 'Open (10 AM - 9:30 PM)',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
    };
  }
}
