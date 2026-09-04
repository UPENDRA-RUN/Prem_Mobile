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
    const nextSale = db.prepare(`
      SELECT * FROM sales 
      WHERE status IN ('READY', 'DRAFT') 
      ORDER BY startDate ASC, id DESC LIMIT 1
    `).get() || db.prepare(`
      SELECT * FROM sales ORDER BY id DESC LIMIT 1
    `).get();

    return {
      isLive: false,
      status: 'OFFLINE',
      sale: nextSale ? {
        id: nextSale.id,
        name: nextSale.name || 'Sunday Shocking Sale',
        startDate: nextSale.startDate,
        endDate: nextSale.endDate,
        startTime: nextSale.startTime,
        endTime: nextSale.endTime
      } : null,
      items: [],
      message: 'Special flash sales and exclusive deals are announced regularly. Check back soon for exciting offers!'
    };
  }

  // Fetch sale items with full product details (LEFT JOIN to include direct custom items and combos)
  const items = db.prepare(`
    SELECT 
      si.id as saleItemId,
      si.productId,
      si.isCustom,
      si.customTitle,
      si.customCategory,
      si.customBrand,
      si.customImage,
      si.comboId,
      si.salePrice,
      si.regularPriceSnapshot,
      p.name as productName,
      p.slug as productSlug,
      p.category as productCategory,
      p.brand as productBrand,
      p.images as productImages,
      p.stock as productStock,
      p.regularPrice as productRegularPrice,
      c.name as comboTitle,
      c.description as comboDescription,
      c.image as comboImage,
      c.regularPrice as comboRegularPrice,
      c.comboPrice as comboPrice
    FROM sale_items si
    LEFT JOIN products p ON si.productId = p.id
    LEFT JOIN combos c ON si.comboId = c.id
    WHERE si.saleId = ?
  `).all(liveSale.id);

  const formattedItems = items.map(item => {
    let parsedImages = [];
    if (item.productImages) {
      try { parsedImages = JSON.parse(item.productImages); } catch (e) {}
    }

    const isCustom = Boolean(item.isCustom);
    const isCombo = Boolean(item.comboId);
    
    let name = 'Sale Item';
    let category = 'Special Deals';
    let brand = 'Prem Mobile';
    let image = '/images/placeholder.jpg';
    let regular = item.salePrice;

    if (isCombo) {
      name = item.comboTitle || item.customTitle || 'Combo Pack';
      category = 'Combo Pack';
      brand = 'Prem Mobile Combo';
      image = item.comboImage || item.customImage || '/images/placeholder.jpg';
      regular = item.comboRegularPrice || item.regularPriceSnapshot || item.salePrice;
    } else if (isCustom) {
      name = item.customTitle;
      category = item.customCategory || 'Special Deals';
      brand = item.customBrand || 'Prem Mobile';
      image = item.customImage || '/images/placeholder.jpg';
      regular = item.regularPriceSnapshot || item.salePrice;
    } else {
      name = item.productName || 'Catalog Item';
      category = item.productCategory || 'Catalog Item';
      brand = item.productBrand || 'Prem Mobile';
      image = parsedImages[0] || '/images/placeholder.jpg';
      regular = item.productRegularPrice || item.regularPriceSnapshot || item.salePrice;
    }

    const sale = item.salePrice;
    const savings = Math.max(0, regular - sale);
    const discountPercent = regular > 0 ? Math.round((savings / regular) * 100) : 0;
    const id = isCombo ? `combo-${item.comboId}` : (isCustom ? `custom-${item.saleItemId}` : (item.productId || `item-${item.saleItemId}`));

    return {
      id,
      productId: item.productId,
      comboId: item.comboId,
      isCustom,
      isCombo,
      name,
      slug: item.productSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      brand,
      image,
      images: parsedImages.length > 0 ? parsedImages : [image],
      regularPrice: regular,
      salePrice: sale,
      price: sale,
      originalPrice: regular,
      savings,
      discountPercent,
      stock: item.productStock || 15
    };
  });

  return {
    isLive: true,
    status: 'LIVE',
    sale: {
      id: liveSale.id,
      name: liveSale.name || 'Sunday Shocking Sale',
      startDate: liveSale.startDate,
      endDate: liveSale.endDate,
      startTime: liveSale.startTime,
      endTime: liveSale.endTime
    },
    items: formattedItems,
    message: `🔥 ${liveSale.name || 'SUNDAY SHOCKING SALE'} IS LIVE! Special prices available now.`
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
      'Sunday Shocking Sale',
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

  // Get custom items for this sale
  const configuredCustomItems = existingItems.filter(it => it.isCustom).map(it => ({
    saleItemId: it.id,
    customTitle: it.customTitle,
    customCategory: it.customCategory,
    customBrand: it.customBrand,
    customImage: it.customImage,
    regularPrice: it.regularPriceSnapshot,
    salePrice: it.salePrice
  }));

  // Get combo items for this sale
  const configuredComboItems = existingItems.filter(it => it.comboId).map(it => ({
    saleItemId: it.id,
    comboId: it.comboId,
    name: it.customTitle,
    regularPrice: it.regularPriceSnapshot,
    salePrice: it.salePrice
  }));

  return {
    sale: currentSale,
    isLive: currentSale.status === 'LIVE',
    status: currentSale.status, // 'DRAFT', 'READY', 'LIVE', 'ENDED'
    candidateProducts,
    configuredCustomItems,
    configuredComboItems,
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

