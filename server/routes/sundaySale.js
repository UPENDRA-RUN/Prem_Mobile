import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import { getSundaySaleStatus, getSundaySaleProducts, getCurrentDayInfo } from '../sundaySaleLogic.js';

const router = express.Router();

// Public: GET /api/sunday-sale
router.get('/', (req, res) => {
  const saleStatus = getSundaySaleStatus();
  const products = saleStatus.isLive ? getSundaySaleProducts() : [];

  res.json({
    success: true,
    isLive: saleStatus.isLive,
    status: saleStatus.status,
    customerState: saleStatus.customerState,
    message: saleStatus.message,
    dayInfo: saleStatus.dayInfo,
    products
  });
});

// Admin: GET /api/admin/sunday-sale (Inspect current config & products)
router.get('/admin', requireAdmin, (req, res) => {
  const dayInfo = getCurrentDayInfo();
  const latestSale = db.prepare('SELECT * FROM sunday_sales ORDER BY id DESC LIMIT 1').get();

  // Fetch all active products
  const products = db.prepare('SELECT id, name, category, regularPrice, images, stock FROM products WHERE isActive = 1 ORDER BY id ASC').all();

  // If there's a latest sale, get its configured items
  let configuredItems = [];
  if (latestSale) {
    configuredItems = db.prepare('SELECT productId, regularPriceSnapshot, salePrice FROM sunday_sale_items WHERE saleId = ?').all(latestSale.id);
  }

  const itemsMap = new Map();
  for (const item of configuredItems) {
    itemsMap.set(item.productId, item);
  }

  const candidateProducts = products.map(p => {
    let images = [];
    try {
      images = JSON.parse(p.images);
    } catch (e) {
      images = [p.images];
    }

    const reg = Number(p.regularPrice);
    const configured = itemsMap.get(p.id);
    const included = Boolean(configured);
    const salePrice = configured ? Number(configured.salePrice) : Math.round(reg * 0.7); // default 30% off suggestion
    const discount = reg > 0 ? Math.round(((reg - salePrice) / reg) * 100) : 0;

    return {
      id: p.id,
      name: p.name,
      category: p.category,
      image: images[0] || '/images/prem-main.jpg',
      regularPrice: reg,
      included,
      salePrice,
      discount
    };
  });

  const saleStatus = latestSale ? latestSale.status : 'OFFLINE';
  // Consider live ONLY IF status is 'LIVE' AND today is Sunday
  const isCurrentlyLive = saleStatus === 'LIVE' && dayInfo.isSunday;

  res.json({
    success: true,
    dayInfo,
    saleRecord: latestSale || null,
    statusText: isCurrentlyLive ? 'LIVE' : (saleStatus === 'LIVE' && !dayInfo.isSunday ? 'EXPIRED_WEEKDAY' : 'OFFLINE'),
    isLive: isCurrentlyLive,
    candidateProducts
  });
});

// Admin: POST /api/admin/sunday-sale (Save products and prices)
router.post('/admin', requireAdmin, (req, res) => {
  const { items } = req.body || {}; // items: array of { productId, salePrice }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'At least one product must be selected for Sunday Sale' });
  }

  const now = new Date().toISOString();
  const todayDateStr = now.slice(0, 10);

  // Check if we can reuse or create a sale record
  let sale = db.prepare("SELECT * FROM sunday_sales WHERE status IN ('DRAFT', 'LIVE') ORDER BY id DESC LIMIT 1").get();

  if (!sale) {
    const result = db.prepare(`
      INSERT INTO sunday_sales (date, status, createdAt, updatedAt)
      VALUES (?, 'DRAFT', ?, ?)
    `).run(todayDateStr, now, now);
    sale = db.prepare('SELECT * FROM sunday_sales WHERE id = ?').get(result.lastInsertRowid);
  } else {
    // Saving the sale does NOT automatically make it live; sets status to DRAFT
    db.prepare("UPDATE sunday_sales SET status = 'DRAFT', updatedAt = ? WHERE id = ?").run(now, sale.id);
    // Clear old items for this sale
    db.prepare('DELETE FROM sunday_sale_items WHERE saleId = ?').run(sale.id);
  }


  const insertItem = db.prepare(`
    INSERT INTO sunday_sale_items (saleId, productId, regularPriceSnapshot, salePrice, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const it of items) {
    const prod = db.prepare('SELECT id, regularPrice FROM products WHERE id = ?').get(it.productId);
    if (prod) {
      const regPrice = Number(prod.regularPrice);
      const sPrice = Number(it.salePrice !== undefined ? it.salePrice : Math.round(regPrice * 0.7));
      insertItem.run(sale.id, prod.id, regPrice, sPrice, now);
    }
  }

  res.json({
    success: true,
    message: 'Sunday Sale saved successfully.',
    saleId: sale.id
  });
});

// Admin: POST /api/admin/sunday-sale/go-live
router.post('/admin/go-live', requireAdmin, (req, res) => {
  const dayInfo = getCurrentDayInfo();

  // MANDATORY SUNDAY RULE: Only allow go-live if today is Sunday!
  if (!dayInfo.isSunday) {
    return res.status(400).json({
      success: false,
      error: 'Sunday Sale can only be activated on Sunday.'
    });
  }

  const sale = db.prepare("SELECT * FROM sunday_sales ORDER BY id DESC LIMIT 1").get();
  if (!sale) {
    return res.status(400).json({
      success: false,
      error: 'No Sunday Sale configured yet. Please configure and save products first.'
    });
  }

  const itemCount = db.prepare('SELECT COUNT(*) as count FROM sunday_sale_items WHERE saleId = ?').get(sale.id);
  if (itemCount.count === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please select at least one product before starting the sale.'
    });
  }

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE sunday_sales 
    SET status = 'LIVE', activatedAt = ?, updatedAt = ?
    WHERE id = ?
  `).run(now, now, sale.id);

  res.json({
    success: true,
    message: '🔥 Sunday Shopping Sale is now LIVE!'
  });
});

// Admin: POST /api/admin/sunday-sale/end
router.post('/admin/end', requireAdmin, (req, res) => {
  const sale = db.prepare("SELECT * FROM sunday_sales WHERE status = 'LIVE' ORDER BY id DESC LIMIT 1").get();
  const now = new Date().toISOString();

  if (sale) {
    db.prepare(`
      UPDATE sunday_sales 
      SET status = 'ENDED', endedAt = ?, updatedAt = ?
      WHERE id = ?
    `).run(now, now, sale.id);
  } else {
    // End any latest sale regardless
    db.prepare(`
      UPDATE sunday_sales 
      SET status = 'ENDED', endedAt = ?, updatedAt = ?
      WHERE id = (SELECT id FROM sunday_sales ORDER BY id DESC LIMIT 1)
    `).run(now, now);
  }

  res.json({
    success: true,
    message: 'Sunday Sale has been ended.'
  });
});

export default router;
