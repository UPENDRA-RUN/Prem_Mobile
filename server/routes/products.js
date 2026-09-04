import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import { getSundaySaleStatus } from '../sundaySaleLogic.js';
import { broadcastEvent } from '../events.js';

const router = express.Router();

// Helper to format product object with prices, badges, and discounts
function formatProduct(p, sundayItemsMap = new Map()) {
  let images = [];
  try {
    images = JSON.parse(p.images);
  } catch (e) {
    images = [p.images];
  }

  const regularPrice = Number(p.regularPrice || 0); // Original / MRP Price
  const offerPrice = p.offerPrice !== null && p.offerPrice !== undefined ? Number(p.offerPrice) : regularPrice; // Offer / Selling Price

  const sundaySaleItem = sundayItemsMap.get(p.id);
  const isSundaySale = Boolean(sundaySaleItem);
  const sundaySalePrice = isSundaySale ? Number(sundaySaleItem.salePrice) : null;

  // Effective selling price: Sunday sale > Offer price > Regular price
  const currentPrice = isSundaySale ? sundaySalePrice : (offerPrice > 0 && offerPrice < regularPrice ? offerPrice : (p.isOnSale ? offerPrice : regularPrice));
  const discount = regularPrice > currentPrice && regularPrice > 0
    ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100)
    : 0;

  const stock = Number(p.stock !== undefined ? p.stock : 10);
  const isOnSale = Boolean(p.isOnSale || isSundaySale || discount > 0);

  return {
    ...p,
    images,
    image: images[0] || '/images/prem-main.jpg',
    price: currentPrice,
    originalPrice: regularPrice,
    regularPrice,
    offerPrice,
    currentPrice,
    salePrice: currentPrice,
    isSundaySale,
    isOnSale,
    isBestSeller: Boolean(p.isBestSeller),
    isFeatured: Boolean(p.isFeatured),
    isNew: Boolean(p.isNew),
    tag: p.tag || (isOnSale && discount > 0 ? `${discount}% OFF` : (p.isBestSeller ? 'Best Seller' : '')),
    discount,
    stock,
    rating: 4.8,
    reviewsCount: 120
  };
}

// Public: GET /api/products
router.get('/', (req, res) => {
  const { category, search, sort, filter } = req.query;

  let query = 'SELECT * FROM products WHERE isActive = 1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND (LOWER(category) = LOWER(?) OR LOWER(categorySlug) = LOWER(?))';
    params.push(category, category);
  }

  if (search) {
    query += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?) OR LOWER(brand) LIKE LOWER(?))';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (filter === 'sale') {
    query += ' AND (isOnSale = 1 OR (offerPrice > 0 AND offerPrice < regularPrice))';
  } else if (filter === 'bestseller') {
    query += ' AND isBestSeller = 1';
  } else if (filter === 'featured') {
    query += ' AND isFeatured = 1';
  } else if (filter === 'new') {
    query += ' AND isNew = 1';
  }

  if (sort === 'price_asc') {
    query += ' ORDER BY regularPrice ASC';
  } else if (sort === 'price_desc') {
    query += ' ORDER BY regularPrice DESC';
  } else {
    query += ' ORDER BY id DESC';
  }

  const rows = db.prepare(query).all(...params);

  // Check Sunday Sale status to attach sale pricing if active
  const saleStatus = getSundaySaleStatus();
  let sundayItemsMap = new Map();
  if (saleStatus.isLive && saleStatus.saleRecord) {
    const saleItems = db.prepare('SELECT productId, regularPriceSnapshot, salePrice FROM sunday_sale_items WHERE saleId = ?').all(saleStatus.saleRecord.id);
    for (const item of saleItems) {
      sundayItemsMap.set(item.productId, item);
    }
  }

  const products = rows.map(p => formatProduct(p, sundayItemsMap));

  res.json({
    success: true,
    count: products.length,
    sundaySaleLive: saleStatus.isLive,
    products
  });
});

// Admin: DELETE /api/products/clear-all (Purge all sample products)
router.delete('/clear-all', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM sunday_sale_items').run();
  db.prepare('DELETE FROM sale_items').run();
  db.prepare('DELETE FROM products').run();

  broadcastEvent('PRODUCTS_UPDATED');

  res.json({
    success: true,
    message: 'All sample products purged successfully. Ready for custom inventory.'
  });
});

// Public: GET /api/products/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const isNumeric = /^\d+$/.test(id);

  const product = isNumeric
    ? db.prepare('SELECT * FROM products WHERE id = ?').get(id)
    : db.prepare('SELECT * FROM products WHERE slug = ?').get(id);

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const saleStatus = getSundaySaleStatus();
  let sundayItemsMap = new Map();
  if (saleStatus.isLive && saleStatus.saleRecord) {
    const saleItem = db.prepare('SELECT regularPriceSnapshot, salePrice FROM sunday_sale_items WHERE saleId = ? AND productId = ?').get(saleStatus.saleRecord.id, product.id);
    if (saleItem) sundayItemsMap.set(product.id, saleItem);
  }

  res.json({
    success: true,
    product: formatProduct(product, sundayItemsMap)
  });
});

// Admin: GET /api/products/admin/all (includes inactive)
router.get('/admin/all', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  const products = rows.map(p => formatProduct(p));

  res.json({
    success: true,
    products
  });
});

// Admin: POST /api/products (Add product)
router.post('/', requireAdmin, (req, res) => {
  const {
    name, category, description, brand, images,
    regularPrice, offerPrice, stock, isActive,
    isOnSale, isBestSeller, isFeatured, isNew, tag
  } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Product name is required' });
  }
  if (!category || !category.trim()) {
    return res.status(400).json({ success: false, error: 'Category is required' });
  }

  const regPrice = Number(regularPrice);
  if (isNaN(regPrice) || regPrice < 0) {
    return res.status(400).json({ success: false, error: 'Valid Original/MRP price is required' });
  }

  const offPrice = offerPrice !== undefined && offerPrice !== '' ? Number(offerPrice) : regPrice;
  if (isNaN(offPrice) || offPrice < 0) {
    return res.status(400).json({ success: false, error: 'Offer price must be valid' });
  }

  const stockNum = Number(stock !== undefined ? stock : 10);
  if (isNaN(stockNum) || stockNum < 0) {
    return res.status(400).json({ success: false, error: 'Stock cannot be negative' });
  }

  const now = new Date().toISOString();
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  const categorySlug = category.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const imgArray = Array.isArray(images) && images.length > 0 ? images : ['/images/prem-main.jpg'];

  const stmt = db.prepare(`
    INSERT INTO products (
      name, slug, description, category, categorySlug, brand, images,
      regularPrice, offerPrice, stock, isActive, isOnSale, isBestSeller, isFeatured, isNew, tag, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name.trim(),
    slug,
    description ? description.trim() : `${name.trim()} at Prem Mobile`,
    category.trim(),
    categorySlug,
    brand ? brand.trim() : 'Prem Mobile',
    JSON.stringify(imgArray),
    regPrice,
    offPrice,
    stockNum,
    isActive !== undefined ? (isActive ? 1 : 0) : 1,
    isOnSale ? 1 : 0,
    isBestSeller ? 1 : 0,
    isFeatured ? 1 : 0,
    isNew ? 1 : 0,
    tag ? tag.trim() : '',
    now,
    now
  );

  broadcastEvent('PRODUCTS_UPDATED');

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    productId: result.lastInsertRowid
  });
});

// Admin: PUT /api/products/:id (Update product)
router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const {
    name, category, description, brand, images,
    regularPrice, offerPrice, stock, isActive,
    isOnSale, isBestSeller, isFeatured, isNew, tag
  } = req.body || {};

  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const regPrice = regularPrice !== undefined ? Number(regularPrice) : existing.regularPrice;
  if (isNaN(regPrice) || regPrice < 0) {
    return res.status(400).json({ success: false, error: 'Price must be valid' });
  }

  const offPrice = offerPrice !== undefined ? Number(offerPrice) : (existing.offerPrice ?? regPrice);
  if (isNaN(offPrice) || offPrice < 0) {
    return res.status(400).json({ success: false, error: 'Offer price must be valid' });
  }

  const stockNum = stock !== undefined ? Number(stock) : existing.stock;
  if (isNaN(stockNum) || stockNum < 0) {
    return res.status(400).json({ success: false, error: 'Stock cannot be negative' });
  }

  const now = new Date().toISOString();
  const updatedImages = images !== undefined ? JSON.stringify(Array.isArray(images) ? images : [images]) : existing.images;
  const updatedName = name !== undefined ? name.trim() : existing.name;
  const updatedCategory = category !== undefined ? category.trim() : existing.category;
  const categorySlug = updatedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const updatedDesc = description !== undefined ? description : existing.description;
  const updatedBrand = brand !== undefined ? brand : existing.brand;
  const updatedActive = isActive !== undefined ? (isActive ? 1 : 0) : existing.isActive;
  const updatedOnSale = isOnSale !== undefined ? (isOnSale ? 1 : 0) : (existing.isOnSale || 0);
  const updatedBestSeller = isBestSeller !== undefined ? (isBestSeller ? 1 : 0) : (existing.isBestSeller || 0);
  const updatedFeatured = isFeatured !== undefined ? (isFeatured ? 1 : 0) : (existing.isFeatured || 0);
  const updatedNew = isNew !== undefined ? (isNew ? 1 : 0) : (existing.isNew || 0);
  const updatedTag = tag !== undefined ? tag.trim() : (existing.tag || '');

  db.prepare(`
    UPDATE products SET
      name = ?,
      category = ?,
      categorySlug = ?,
      description = ?,
      brand = ?,
      images = ?,
      regularPrice = ?,
      offerPrice = ?,
      stock = ?,
      isActive = ?,
      isOnSale = ?,
      isBestSeller = ?,
      isFeatured = ?,
      isNew = ?,
      tag = ?,
      updatedAt = ?
    WHERE id = ?
  `).run(
    updatedName,
    updatedCategory,
    categorySlug,
    updatedDesc,
    updatedBrand,
    updatedImages,
    regPrice,
    offPrice,
    stockNum,
    updatedActive,
    updatedOnSale,
    updatedBestSeller,
    updatedFeatured,
    updatedNew,
    updatedTag,
    now,
    id
  );

  broadcastEvent('PRODUCTS_UPDATED');

  res.json({
    success: true,
    message: 'Product updated successfully'
  });
});

// Admin: DELETE /api/products/:id
router.delete('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(id);

  broadcastEvent('PRODUCTS_UPDATED');

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

export default router;
