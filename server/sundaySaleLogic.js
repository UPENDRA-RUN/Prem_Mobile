import { db } from './db.js';

/**
 * Returns current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * Uses Indian Standard Time (Asia/Kolkata) — always real time.
 */
export function getCurrentDayInfo() {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = istFormatter.formatToParts(now);
  const weekday = parts.find(p => p.type === 'weekday')?.value || 'Sunday';
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = dayNames.findIndex(d => d.toLowerCase() === weekday.toLowerCase());

  return {
    dayOfWeek: dayIndex >= 0 ? dayIndex : 0,
    dayName: weekday,
    isSunday: dayIndex === 0,
    isSimulated: false,
    simulatedDay: 'REAL'
  };
}

/**
 * Gets the current Sunday Sale status from backend/database.
 * Enforces AUTOMATIC WEEKLY RESET:
 * If current day != Sunday, the customer-facing sale status is strictly 'OFF' (or 'UNAVAILABLE').
 */
export function getSundaySaleStatus() {
  const dayInfo = getCurrentDayInfo();

  // Find most recent Sunday sale record
  const latestSale = db.prepare(`
    SELECT * FROM sunday_sales ORDER BY id DESC LIMIT 1
  `).get();

  // 1. If today is NOT Sunday, sale is strictly OFF / UNAVAILABLE for customers
  if (!dayInfo.isSunday) {
    return {
      isLive: false,
      status: 'OFF',
      customerState: 'WEEKDAY_CLOSED',
      dayInfo,
      saleRecord: latestSale || null,
      message: 'Sunday Shopping is currently closed. Special deals are available every Sunday. Come back on Sunday for exciting offers!'
    };
  }

  // 2. Today IS Sunday: check admin activation status
  if (!latestSale || latestSale.status !== 'LIVE') {
    return {
      isLive: false,
      status: 'NOT_LIVE',
      customerState: 'SUNDAY_PREPARING',
      dayInfo,
      saleRecord: latestSale || null,
      message: "Today's sale is getting ready! Please check back soon."
    };
  }

  // 3. Today IS Sunday AND admin has activated the sale
  return {
    isLive: true,
    status: 'LIVE',
    customerState: 'LIVE',
    dayInfo,
    saleRecord: latestSale,
    message: '🔥 SUNDAY SHOPPING SALE IS LIVE! Special prices available today only.'
  };
}

/**
 * Returns all active products selected for the Sunday Sale along with regularPriceSnapshot,
 * salePrice, discountPercentage, and savings.
 */
export function getSundaySaleProducts() {
  const saleStatus = getSundaySaleStatus();
  if (!saleStatus.isLive || !saleStatus.saleRecord) {
    return [];
  }

  const items = db.prepare(`
    SELECT 
      si.id as saleItemId,
      si.saleId,
      si.productId,
      si.regularPriceSnapshot,
      si.salePrice,
      p.name,
      p.slug,
      p.category,
      p.images,
      p.stock,
      p.isActive,
      p.description
    FROM sunday_sale_items si
    JOIN products p ON si.productId = p.id
    WHERE si.saleId = ? AND p.isActive = 1
  `).all(saleStatus.saleRecord.id);

  return items.map(item => {
    let images = [];
    try {
      images = JSON.parse(item.images);
    } catch (e) {
      images = [item.images];
    }

    const reg = Number(item.regularPriceSnapshot);
    const sale = Number(item.salePrice);
    const savings = Math.max(0, reg - sale);
    const discountPercent = reg > 0 ? Math.round((savings / reg) * 100) : 0;

    return {
      ...item,
      images,
      regularPrice: reg,
      salePrice: sale,
      savings,
      discountPercent
    };
  });
}

/**
 * Resolves the server-validated valid unit price for a given product.
 * NEVER trusts client input.
 * If Sunday Sale is LIVE and product is in the active Sunday sale, returns salePrice.
 * Otherwise, returns regularPrice.
 */
export function resolveServerProductPrice(productId) {
  const product = db.prepare('SELECT id, name, regularPrice, stock, isActive FROM products WHERE id = ?').get(productId);
  if (!product || !product.isActive) {
    return null;
  }

  const saleStatus = getSundaySaleStatus();
  if (saleStatus.isLive && saleStatus.saleRecord) {
    const saleItem = db.prepare(`
      SELECT salePrice, regularPriceSnapshot 
      FROM sunday_sale_items 
      WHERE saleId = ? AND productId = ?
    `).get(saleStatus.saleRecord.id, productId);

    if (saleItem) {
      return {
        productId: product.id,
        name: product.name,
        regularPrice: Number(product.regularPrice),
        salePrice: Number(saleItem.salePrice),
        finalUnitPrice: Number(saleItem.salePrice),
        isSundaySalePrice: true,
        stock: product.stock
      };
    }
  }

  return {
    productId: product.id,
    name: product.name,
    regularPrice: Number(product.regularPrice),
    salePrice: null,
    finalUnitPrice: Number(product.regularPrice),
    isSundaySalePrice: false,
    stock: product.stock
  };
}
