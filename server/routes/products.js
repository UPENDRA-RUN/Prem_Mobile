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

  let rating = 4.8;
  let reviewsCount = 0;
  try {
    const stats = db.prepare(`
      SELECT COUNT(*) as count, AVG(rating) as avgRating
      FROM reviews
      WHERE productId = ? AND status = 'APPROVED'
    `).get(p.id);
    if (stats && stats.count > 0) {
      reviewsCount = stats.count;
      rating = Number(Number(stats.avgRating).toFixed(1));
    }
  } catch (e) {
    rating = 4.8;
    reviewsCount = 12;
  }

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
    rating,
    reviewsCount
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

// Admin: DELETE /api/products/clear-all (Purge all products for clean slate)
router.delete('/clear-all', requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM sunday_sale_items').run();
    db.prepare('DELETE FROM sale_items').run();
    db.prepare('DELETE FROM combo_items').run();
    db.prepare('DELETE FROM products').run();

    broadcastEvent('PRODUCTS_UPDATED');

    res.json({
      success: true,
      message: 'All sample products purged successfully.'
    });
  } catch (err) {
    console.error('Error clearing products:', err);
    res.status(500).json({ success: false, error: 'Failed to clear products: ' + err.message });
  }
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

// GET /api/products/export-csv - Download full store product catalog as CSV
router.get('/export-csv', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY id ASC').all();

    const headers = [
      'id',
      'name',
      'slug',
      'category',
      'brand',
      'regularPrice',
      'offerPrice',
      'stock',
      'description',
      'images',
      'isActive',
      'isFeatured',
      'isBestSeller',
      'isNew',
      'tag'
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const text = String(str).replace(/"/g, '""');
      return `"${text}"`;
    };

    let csvContent = headers.join(',') + '\n';

    for (const p of products) {
      let imageStr = p.images;
      try {
        const parsed = JSON.parse(p.images);
        if (Array.isArray(parsed)) imageStr = parsed.join(' | ');
      } catch (e) {
        imageStr = p.images;
      }

      const row = [
        p.id,
        escapeCsv(p.name),
        escapeCsv(p.slug),
        escapeCsv(p.category),
        escapeCsv(p.brand || ''),
        p.regularPrice,
        p.offerPrice || p.regularPrice,
        p.stock,
        escapeCsv(p.description || ''),
        escapeCsv(imageStr),
        p.isActive,
        p.isFeatured,
        p.isBestSeller,
        p.isNew,
        escapeCsv(p.tag || '')
      ];

      csvContent += row.join(',') + '\n';
    }

    const filename = `Prem_Mobile_Products_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error('Error exporting products CSV:', err);
    return res.status(500).json({ success: false, message: 'Failed to export CSV: ' + err.message });
  }
});

// GET /api/products/sample-template-csv - Download pre-formatted sample CSV template
router.get('/sample-template-csv', (req, res) => {
  try {
    const csvTemplate = `id,name,slug,category,brand,regularPrice,offerPrice,stock,description,images,isActive,isFeatured,isBestSeller,isNew,tag
,boAt Airdopes 141 ANC,boat-airdopes-141-anc,Earbuds,boAt,2990,1499,25,"Noise cancelling earbud with 42 hrs battery backup and ASAP Fast Charge.","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",1,1,1,0,Best Seller
,Noise Buds VS102 Pro,noise-buds-vs102-pro,Earbuds,Noise,3499,1299,30,"HyperSync technology with 11mm dynamic drivers and 50 hrs playtime.","https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop",1,0,1,1,Hot Deal
,Fire-Boltt Ninja Call Pro Plus,fire-boltt-ninja-call-pro,Smartwatches,Fire-Boltt,4999,1799,15,"1.83 HD display bluetooth calling smartwatch with 100+ sports modes.","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",1,1,0,1,Trending
,Mi 20000mAh Power Bank 3i,mi-20000mah-power-bank-3i,Power Banks,Xiaomi,2199,1699,40,"22.5W Fast charging triple port power bank with smart power management.","https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&auto=format&fit=crop",1,0,0,0,Essential
,Realme 33W Dart Flash Charger,realme-33w-dart-charger,Chargers,Realme,1299,899,50,"33W SuperDart fast charger adapter with Type-C braided cable included.","https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop",1,0,0,0,Fast Charge`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Prem_Mobile_Bulk_Product_Template.csv"');
    return res.status(200).send(csvTemplate);
  } catch (err) {
    console.error('Error serving CSV template:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate template' });
  }
});

// POST /api/products/bulk-import - Bulk insert or update (UPSERT) products from CSV data
router.post('/bulk-import', requireAdmin, (req, res) => {
  try {
    const { products: rawProducts } = req.body;

    if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
      return res.status(400).json({ success: false, message: 'No products provided for bulk import' });
    }

    let createdCount = 0;
    let updatedCount = 0;
    const errors = [];
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO products (
        name, slug, category, categorySlug, description, brand, images,
        regularPrice, offerPrice, stock, isActive, isOnSale, isBestSeller, isFeatured, isNew, tag, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStmt = db.prepare(`
      UPDATE products SET
        name = ?, category = ?, categorySlug = ?, description = ?, brand = ?, images = ?,
        regularPrice = ?, offerPrice = ?, stock = ?, isActive = ?, isOnSale = ?,
        isBestSeller = ?, isFeatured = ?, isNew = ?, tag = ?, updatedAt = ?
      WHERE id = ?
    `);

    const updateBySlugStmt = db.prepare(`
      UPDATE products SET
        name = ?, category = ?, categorySlug = ?, description = ?, brand = ?, images = ?,
        regularPrice = ?, offerPrice = ?, stock = ?, isActive = ?, isOnSale = ?,
        isBestSeller = ?, isFeatured = ?, isNew = ?, tag = ?, updatedAt = ?
      WHERE slug = ?
    `);

    const checkIdStmt = db.prepare('SELECT id FROM products WHERE id = ?');
    const checkSlugStmt = db.prepare('SELECT id, slug FROM products WHERE slug = ?');

    rawProducts.forEach((p, idx) => {
      try {
        const name = (p.name || '').trim();
        if (!name) {
          errors.push(`Row ${idx + 1}: Product name is required.`);
          return;
        }

        const category = (p.category || 'Mobile Accessories').trim();
        const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const brand = (p.brand || '').trim() || null;
        const description = (p.description || '').trim() || 'Original electronic accessory with official warranty.';
        const regularPrice = Math.max(0, Number(p.regularPrice || p.price || 0));
        const offerPrice = p.offerPrice !== undefined && p.offerPrice !== null ? Number(p.offerPrice) : regularPrice;
        const stock = p.stock !== undefined && p.stock !== null ? Math.max(0, Number(p.stock)) : 10;
        const tag = (p.tag || '').trim() || null;

        const isActive = p.isActive !== undefined ? (Number(p.isActive) ? 1 : 0) : 1;
        const isFeatured = Number(p.isFeatured) ? 1 : 0;
        const isBestSeller = Number(p.isBestSeller) ? 1 : 0;
        const isNew = Number(p.isNew) ? 1 : 0;
        const isOnSale = (offerPrice > 0 && offerPrice < regularPrice) ? 1 : 0;

        // Process images array
        let imagesJson = '["/images/prem-main.jpg"]';
        if (p.images) {
          if (Array.isArray(p.images)) {
            imagesJson = JSON.stringify(p.images);
          } else if (typeof p.images === 'string') {
            const splitImgs = p.images.split('|').map(s => s.trim()).filter(Boolean);
            imagesJson = JSON.stringify(splitImgs.length > 0 ? splitImgs : [p.images.trim()]);
          }
        }

        // Generate clean slug
        let slug = (p.slug || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (!slug) {
          slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        // Check if updating existing by ID or Slug
        const existingById = p.id ? checkIdStmt.get(Number(p.id)) : null;
        const existingBySlug = !existingById && slug ? checkSlugStmt.get(slug) : null;

        if (existingById) {
          updateStmt.run(
            name, category, categorySlug, description, brand, imagesJson,
            regularPrice, offerPrice, stock, isActive, isOnSale,
            isBestSeller, isFeatured, isNew, tag, now, existingById.id
          );
          updatedCount++;
        } else if (existingBySlug) {
          updateBySlugStmt.run(
            name, category, categorySlug, description, brand, imagesJson,
            regularPrice, offerPrice, stock, isActive, isOnSale,
            isBestSeller, isFeatured, isNew, tag, now, existingBySlug.slug
          );
          updatedCount++;
        } else {
          // Unique slug generator for new insert
          let finalSlug = slug;
          let counter = 1;
          while (checkSlugStmt.get(finalSlug)) {
            finalSlug = `${slug}-${counter}`;
            counter++;
          }

          insertStmt.run(
            name, finalSlug, category, categorySlug, description, brand, imagesJson,
            regularPrice, offerPrice, stock, isActive, isOnSale, isBestSeller, isFeatured, isNew, tag, now, now
          );
          createdCount++;
        }
      } catch (rowErr) {
        console.error(`Error importing row ${idx + 1}:`, rowErr);
        errors.push(`Row ${idx + 1} ("${p.name || 'Unknown'}"): ${rowErr.message}`);
      }
    });

    broadcastEvent('PRODUCTS_UPDATED');

    return res.json({
      success: true,
      message: `Bulk import completed! ${createdCount} created, ${updatedCount} updated.`,
      report: {
        totalProcessed: rawProducts.length,
        createdCount,
        updatedCount,
        errorsCount: errors.length,
        errors
      }
    });
  } catch (err) {
    console.error('Error in bulk import:', err);
    return res.status(500).json({ success: false, message: 'Bulk import failed: ' + err.message });
  }
});

export default router;

