import { db } from './db.js';

/**
 * Checks and returns the single active LIVE sale.
 * Enforces optional auto-end if an end date/time is set and has expired.
 */
export function getActiveLiveSale() {
  const liveSale = db.prepare(`
    SELECT * FROM sales WHERE status = 'LIVE' ORDER BY id DESC LIMIT 1
  `).get();

  if (!liveSale) {
    return null;
  }

  // Check optional auto-end (Requirement 7)
  // Only auto-end if an explicit endTime was configured and the end time has actually passed
  if (liveSale.endDate && liveSale.endTime && liveSale.endTime.trim() !== '') {
    try {
      const timePart = liveSale.endTime.length === 5 ? `${liveSale.endTime}:00` : liveSale.endTime;
      const endDateTime = new Date(`${liveSale.endDate}T${timePart}`);
      const now = new Date();

      if (!isNaN(endDateTime.getTime()) && now > endDateTime) {
        // Automatically mark as ENDED only if endDateTime is after activation time
        const activatedTime = liveSale.activatedAt ? new Date(liveSale.activatedAt).getTime() : 0;
        if (endDateTime.getTime() > activatedTime) {
          db.prepare(`
            UPDATE sales SET status = 'ENDED', endedAt = ? WHERE id = ?
          `).run(now.toISOString(), liveSale.id);
          return null;
        }
      }
    } catch (e) {
      console.error('Error evaluating auto-end time:', e);
    }
  }


  return liveSale;
}

/**
 * Returns public sale state for customer website.
 * Before Admin activates: status = 'OFFLINE', isLive = false
 * After Admin activates: status = 'LIVE', isLive = true
 */
export function getSalePublicState() {
  const liveSale = getActiveLiveSale();

  if (!liveSale) {
    return {
      isLive: false,
      status: 'OFFLINE',
      sale: null,
      items: [],
      message: 'Special flash sales and exclusive deals are announced regularly. Check back soon for exciting offers!'
    };
  }

  // Fetch sale items with full product details
  const items = db.prepare(`
    SELECT 
      si.id as saleItemId,
      si.productId,
      si.salePrice,
      si.regularPriceSnapshot,
      p.name,
      p.slug,
      p.category,
      p.brand,
      p.images,
      p.stock,
      p.regularPrice
    FROM sale_items si
    JOIN products p ON si.productId = p.id
    WHERE si.saleId = ? AND p.isActive = 1
  `).all(liveSale.id);

  const formattedItems = items.map(item => {
    let parsedImages = [];
    try {
      parsedImages = JSON.parse(item.images);
    } catch (e) {
      parsedImages = ['/images/placeholder.jpg'];
    }

    const regular = item.regularPrice || item.regularPriceSnapshot;
    const sale = item.salePrice;
    const savings = Math.max(0, regular - sale);
    const discountPercent = regular > 0 ? Math.round((savings / regular) * 100) : 0;

    return {
      id: item.productId,
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      category: item.category,
      brand: item.brand,
      image: parsedImages[0] || '/images/placeholder.jpg',
      images: parsedImages,
      regularPrice: regular,
      salePrice: sale,
      price: sale,
      originalPrice: regular,
      savings,
      discountPercent,
      stock: item.stock
    };
  });

  return {
    isLive: true,
    status: 'LIVE',
    sale: {
      id: liveSale.id,
      name: liveSale.name || 'Special Sale',
      startDate: liveSale.startDate,
      endDate: liveSale.endDate,
      startTime: liveSale.startTime,
      endTime: liveSale.endTime
    },
    items: formattedItems,
    message: `🔥 ${liveSale.name || 'SPECIAL SALE'} IS LIVE! Special prices available now.`
  };
}

/**
 * Returns admin state for /admin/sale
 * Returns current working sale (either LIVE, READY, DRAFT, or ENDED)
 * and all candidate products with active sale prices.
 */
export function getSaleAdminState() {
  const liveSale = getActiveLiveSale();

  // Find most recent working sale
  let currentSale = liveSale;
  if (!currentSale) {
    currentSale = db.prepare(`
      SELECT * FROM sales ORDER BY id DESC LIMIT 1
    `).get();
  }

  // If still no sale exists in DB, prepare a blank default
  const today = new Date().toISOString().split('T')[0];
  if (!currentSale) {
    const info = db.prepare(`
      INSERT INTO sales (name, startDate, endDate, startTime, endTime, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, 'DRAFT', ?, ?)
    `).run(
      'Special Dhamaka Sale',
      today,
      today,
      '10:00',
      '22:00',
      new Date().toISOString(),
      new Date().toISOString()
    );
    currentSale = db.prepare('SELECT * FROM sales WHERE id = ?').get(info.lastInsertRowid);
  }

  // Get existing sale items for this sale
  const existingItems = db.prepare(`
    SELECT * FROM sale_items WHERE saleId = ?
  `).all(currentSale.id);

  const saleItemMap = new Map();
  for (const it of existingItems) {
    saleItemMap.set(it.productId, it.salePrice);
  }

  // Get all active products from catalog
  const products = db.prepare(`
    SELECT * FROM products WHERE isActive = 1 ORDER BY category ASC, id ASC
  `).all();

  const candidateProducts = products.map(p => {
    let images = [];
    try {
      images = JSON.parse(p.images);
    } catch (e) {
      images = ['/images/placeholder.jpg'];
    }

    const currentSalePrice = saleItemMap.get(p.id) || null;
    const isSelected = saleItemMap.has(p.id);

    return {
      id: p.id,
      name: p.name,
      category: p.category,
      brand: p.brand,
      image: images[0] || '/images/placeholder.jpg',
      regularPrice: p.regularPrice,
      salePrice: currentSalePrice,
      isSelected,
      discountPercent: currentSalePrice && p.regularPrice > 0
        ? Math.round(((p.regularPrice - currentSalePrice) / p.regularPrice) * 100)
        : 0
    };
  });

  return {
    sale: currentSale,
    isLive: currentSale.status === 'LIVE',
    status: currentSale.status, // 'DRAFT', 'READY', 'LIVE', 'ENDED'
    candidateProducts,
    hasLiveSale: Boolean(liveSale),
    liveSaleId: liveSale ? liveSale.id : null
  };
}

/**
 * Server-side tamper-proof price verification for order checkout.
 * Resolves verified price from DB against active live sale.
 */
export function resolveServerProductPrice(productId) {
  const product = db.prepare(`SELECT * FROM products WHERE id = ? AND isActive = 1`).get(productId);
  if (!product) {
    return null;
  }

  const liveSale = getActiveLiveSale();
  if (liveSale) {
    const saleItem = db.prepare(`
      SELECT * FROM sale_items WHERE saleId = ? AND productId = ?
    `).get(liveSale.id, productId);

    if (saleItem && Number(saleItem.salePrice) > 0) {
      return {
        productId: product.id,
        name: product.name,
        regularPrice: product.regularPrice,
        effectivePrice: Number(saleItem.salePrice),
        finalUnitPrice: Number(saleItem.salePrice),
        isSale: true,
        isSundaySalePrice: true,
        salePrice: Number(saleItem.salePrice),
        savings: Math.max(0, product.regularPrice - Number(saleItem.salePrice))
      };
    }
  }

  return {
    productId: product.id,
    name: product.name,
    regularPrice: product.regularPrice,
    effectivePrice: product.regularPrice,
    finalUnitPrice: product.regularPrice,
    isSale: false,
    isSundaySalePrice: false,
    salePrice: null,
    savings: 0
  };
}

