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
