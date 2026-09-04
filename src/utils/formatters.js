/**
 * Format number into Indian Rupees currency format
 * @param {number} amount 
 * @returns {string} e.g. ₹1,299
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

/**
 * Calculate discount percentage
 * @param {number} price 
 * @param {number} originalPrice 
 * @returns {number}
 */
export function calculateDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Format YYYY-MM-DD or ISO string to DD-MM-YYYY format
 * @param {string} dateStr e.g. "2026-09-06"
 * @returns {string} e.g. "06-09-2026"
 */
export function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return '';
  const parts = String(dateStr).split('T')[0].split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (e) {
    return String(dateStr);
  }
}
