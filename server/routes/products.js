import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import { getSundaySaleStatus } from '../sundaySaleLogic.js';

const router = express.Router();

// Public: GET /api/products
router.get('/', (req, res) => {
  const { category, search, sort } = req.query;

  let query = 'SELECT * FROM products WHERE isActive = 1';
  const params = [];

  if (category) {
    query += ' AND (LOWER(category) = LOWER(?) OR LOWER(categorySlug) = LOWER(?))';
    params.push(category, category);
  }

  if (search) {
    query += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(category) LIKE LOWER(?) OR LOWER(brand) LIKE LOWER(?))';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (sort === 'price_asc') {
    query += ' ORDER BY regularPrice ASC';
  } else if (sort === 'price_desc') {
    query += ' ORDER BY regularPrice DESC';
  } else {
    query += ' ORDER BY id ASC';
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

  const products = rows.map(p => {
    let images = [];
    try {
      images = JSON.parse(p.images);
    } catch (e) {
      images = [p.images];
    }

    const regularPrice = Number(p.regularPrice);
    const sundaySaleItem = sundayItemsMap.get(p.id);

    const isSundaySale = Boolean(sundaySaleItem);
    const salePrice = isSundaySale ? Number(sundaySaleItem.salePrice) : null;
    const currentPrice = isSundaySale ? salePrice : regularPrice;
    const discount = isSundaySale && regularPrice > 0 ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

    return {
      ...p,
      images,
      image: images[0] || '/images/prem-main.jpg',
      regularPrice,
      salePrice,
      currentPrice,
      isSundaySale,
      discount,
      rating: 4.8,
      reviewsCount: 120
    };
  });

  res.json({
    success: true,
    count: products.length,
    sundaySaleLive: saleStatus.isLive,
    products
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

  let images = [];
  try {
    images = JSON.parse(product.images);
  } catch (e) {
    images = [product.images];
  }

  const saleStatus = getSundaySaleStatus();
  let sundaySaleItem = null;
  if (saleStatus.isLive && saleStatus.saleRecord) {
    sundaySaleItem = db.prepare('SELECT regularPriceSnapshot, salePrice FROM sunday_sale_items WHERE saleId = ? AND productId = ?').get(saleStatus.saleRecord.id, product.id);
  }

  const regularPrice = Number(product.regularPrice);
  const isSundaySale = Boolean(sundaySaleItem);
  const salePrice = isSundaySale ? Number(sundaySaleItem.salePrice) : null;
  const currentPrice = isSundaySale ? salePrice : regularPrice;
  const savings = isSundaySale ? regularPrice - salePrice : 0;
  const discount = isSundaySale && regularPrice > 0 ? Math.round((savings / regularPrice) * 100) : 0;

  res.json({
    success: true,
    product: {
      ...product,
      images,
      image: images[0] || '/images/prem-main.jpg',
      regularPrice,
      salePrice,
      currentPrice,
      isSundaySale,
      savings,
      discount,
      rating: 4.8,
      reviewsCount: 120
    }
  });
});

// Admin: GET /api/admin/products (includes inactive)
router.get('/admin/all', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  const products = rows.map(p => {
    let images = [];
    try {
      images = JSON.parse(p.images);
    } catch (e) {
      images = [p.images];
    }
    return {
      ...p,
      images,
      image: images[0] || '/images/prem-main.jpg',
      regularPrice: Number(p.regularPrice)
    };
  });

  res.json({
    success: true,
    products
  });
});

// Admin: POST /api/products (Add product)
router.post('/', requireAdmin, (req, res) => {
  const { name, category, description, brand, images, regularPrice, stock, isActive, isFeatured } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Product name is required' });
  }
  if (!category || !category.trim()) {
    return res.status(400).json({ success: false, error: 'Category is required' });
  }
  const price = Number(regularPrice);
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ success: false, error: 'Valid regular price is required' });
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
      name, slug, description, category, categorySlug, brand, images, regularPrice, stock, isActive, isFeatured, tag, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?)
  `);

  const result = stmt.run(
    name.trim(),
    slug,
    description ? description.trim() : `${name.trim()} at Prem Mobile`,
    category.trim(),
    categorySlug,
    brand ? brand.trim() : 'Prem Mobile',
    JSON.stringify(imgArray),
    price,
    stockNum,
    isActive !== undefined ? (isActive ? 1 : 0) : 1,
    isFeatured !== undefined ? (isFeatured ? 1 : 0) : 0,
    now,
    now
  );

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    productId: result.lastInsertRowid
  });
});

// Admin: PUT /api/products/:id (Update product)
router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, category, description, brand, images, regularPrice, stock, isActive, isFeatured } = req.body || {};

  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const price = regularPrice !== undefined ? Number(regularPrice) : existing.regularPrice;
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ success: false, error: 'Price must be valid' });
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
  const updatedFeatured = isFeatured !== undefined ? (isFeatured ? 1 : 0) : existing.isFeatured;

  db.prepare(`
    UPDATE products SET
      name = ?,
      category = ?,
      categorySlug = ?,
      description = ?,
      brand = ?,
      images = ?,
      regularPrice = ?,
      stock = ?,
      isActive = ?,
      isFeatured = ?,
      updatedAt = ?
    WHERE id = ?
  `).run(
    updatedName,
    updatedCategory,
    categorySlug,
    updatedDesc,
    updatedBrand,
    updatedImages,
    price,
    stockNum,
    updatedActive,
    updatedFeatured,
    now,
    id
  );

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
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

export default router;
