import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { seedCatalogProductsAndReviews } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'prem_mobile.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode & performance PRAGMAs for high-speed queries
try {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA temp_store = MEMORY;
    PRAGMA cache_size = -64000;
  `);
} catch (e) {
  // Ignored if in-memory or not supported
}

// Initialize tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      salt TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      categorySlug TEXT,
      brand TEXT,
      images TEXT NOT NULL, -- JSON array of image URLs
      regularPrice REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 10,
      isActive INTEGER NOT NULL DEFAULT 1,
      isFeatured INTEGER NOT NULL DEFAULT 0,
      tag TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sunday_sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      status TEXT NOT NULL, -- 'DRAFT', 'LIVE', 'ENDED'
      activatedAt TEXT,
      endedAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sunday_sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saleId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      regularPriceSnapshot REAL NOT NULL,
      salePrice REAL NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (saleId) REFERENCES sunday_sales (id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT 'Special Sale',
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      startTime TEXT,
      endTime TEXT,
      status TEXT NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'READY', 'LIVE', 'ENDED'
      activatedAt TEXT,
      endedAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saleId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      regularPriceSnapshot REAL NOT NULL,
      salePrice REAL NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (saleId) REFERENCES sales (id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE
    );


    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderNumber TEXT UNIQUE NOT NULL,
      customerName TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'
      notes TEXT,
      isSundaySaleOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      userId INTEGER
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      productNameSnapshot TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      regularPrice REAL NOT NULL,
      salePrice REAL,
      finalPrice REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS combos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      regularPrice REAL NOT NULL,
      comboPrice REAL NOT NULL,
      badgeText TEXT DEFAULT 'COMBO SAVINGS',
      isActive INTEGER NOT NULL DEFAULT 1,
      isFeatured INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'CUSTOMER',
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT DEFAULT '📦',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS combo_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comboId INTEGER NOT NULL,
      productId INTEGER,
      customItemName TEXT,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (comboId) REFERENCES combos (id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      photoUrl TEXT,
      status TEXT NOT NULL DEFAULT 'APPROVED',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL DEFAULT 'PERCENT', -- 'PERCENT' or 'FLAT'
      value REAL NOT NULL,
      minOrderAmount REAL DEFAULT 0,
      maxDiscountAmount REAL,
      usageLimit INTEGER,
      timesUsed INTEGER NOT NULL DEFAULT 0,
      isActive INTEGER NOT NULL DEFAULT 1,
      expiryDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      key TEXT PRIMARY KEY,
      count INTEGER NOT NULL,
      firstAttempt INTEGER NOT NULL,
      lockedUntil INTEGER
    );
  `);

  // Migration: Add new columns if upgrading existing database
  try {
    const columns = db.prepare("PRAGMA table_info(products)").all().map(c => c.name);
    if (!columns.includes('offerPrice')) db.exec('ALTER TABLE products ADD COLUMN offerPrice REAL;');
    if (!columns.includes('isOnSale')) db.exec('ALTER TABLE products ADD COLUMN isOnSale INTEGER NOT NULL DEFAULT 0;');
    if (!columns.includes('isBestSeller')) db.exec('ALTER TABLE products ADD COLUMN isBestSeller INTEGER NOT NULL DEFAULT 0;');
    if (!columns.includes('isNew')) db.exec('ALTER TABLE products ADD COLUMN isNew INTEGER NOT NULL DEFAULT 0;');

    const saleItemCols = db.prepare("PRAGMA table_info(sale_items)").all().map(c => c.name);
    if (!saleItemCols.includes('isCustom')) db.exec('ALTER TABLE sale_items ADD COLUMN isCustom INTEGER NOT NULL DEFAULT 0;');
    if (!saleItemCols.includes('customTitle')) db.exec('ALTER TABLE sale_items ADD COLUMN customTitle TEXT;');
    if (!saleItemCols.includes('customCategory')) db.exec('ALTER TABLE sale_items ADD COLUMN customCategory TEXT;');
    if (!saleItemCols.includes('customBrand')) db.exec('ALTER TABLE sale_items ADD COLUMN customBrand TEXT;');
    if (!saleItemCols.includes('customImage')) db.exec('ALTER TABLE sale_items ADD COLUMN customImage TEXT;');
    if (!saleItemCols.includes('comboId')) db.exec('ALTER TABLE sale_items ADD COLUMN comboId INTEGER;');

    const orderCols = db.prepare("PRAGMA table_info(orders)").all().map(c => c.name);
    if (!orderCols.includes('userId')) db.exec('ALTER TABLE orders ADD COLUMN userId INTEGER;');

    const orderItemCols = db.prepare("PRAGMA table_info(order_items)").all().map(c => c.name);
    if (!orderItemCols.includes('isCombo')) db.exec('ALTER TABLE order_items ADD COLUMN isCombo INTEGER NOT NULL DEFAULT 0;');
    if (!orderItemCols.includes('bundledItems')) db.exec('ALTER TABLE order_items ADD COLUMN bundledItems TEXT;');
  } catch (e) {
    console.warn('[DB] Migration warning:', e.message);
  }

  // Create Indexes for high-performance sub-millisecond queries
  try {
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(isActive);
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(userId);
      CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(productId);
      CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
    `);
  } catch (e) {
    console.warn('[DB] Index creation warning:', e.message);
  }

  // Ensure default admin account exists and has updated credentials
  const targetEmail = process.env.ADMIN_EMAIL || 'admin@premmobile.com';
  const targetPassword = process.env.ADMIN_PASSWORD || 'Prem@2026Admin';
  
  const existingAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get(targetEmail);
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(targetPassword, salt, 1000, 64, 'sha512').toString('hex');
  const now = new Date().toISOString();

  if (!existingAdmin) {
    db.prepare(`
      INSERT INTO admins (name, email, passwordHash, salt, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run('Prem Mobile Admin', targetEmail, passwordHash, salt, now);
    console.log(`[DB] Seeded admin account: ${targetEmail}`);
  } else {
    db.prepare(`
      UPDATE admins SET passwordHash = ?, salt = ? WHERE email = ?
    `).run(passwordHash, salt, targetEmail);
    console.log(`[DB] Updated admin password for: ${targetEmail}`);
  }

  // Seed default categories if none exist
  try {
    const catCheck = db.prepare('SELECT COUNT(*) as count FROM categories').get();
    if (catCheck.count === 0) {
      const defaultCategories = [
        { name: 'Smartphones', slug: 'smartphones', icon: '📱' },
        { name: 'Feature Phones', slug: 'feature-phones', icon: '📞' },
        { name: 'Earbuds', slug: 'earbuds', icon: '🎧' },
        { name: 'Headphones', slug: 'headphones', icon: '🎧' },
        { name: 'Smartwatches', slug: 'smartwatches', icon: '⌚' },
        { name: 'Power Banks', slug: 'power-banks', icon: '🔋' },
        { name: 'Chargers', slug: 'chargers', icon: '⚡' },
        { name: 'Mobile Accessories', slug: 'accessories', icon: '🔌' }
      ];
      const insertCat = db.prepare('INSERT INTO categories (name, slug, icon, createdAt) VALUES (?, ?, ?, ?)');
      const now = new Date().toISOString();
      for (const cat of defaultCategories) {
        insertCat.run(cat.name, cat.slug, cat.icon, now);
      }
      console.log('[DB] Seeded default categories');
    }
  } catch (e) {
    console.warn('[DB] Category seed warning:', e.message);
  }

  // Seed sample customer reviews if table is empty
  try {
    const revCheck = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
    if (revCheck.count === 0) {
      const productsList = db.prepare('SELECT id, name FROM products LIMIT 10').all();
      if (productsList.length > 0) {
        const seedReviews = [
          {
            customerName: 'Aman Sharma',
            customerEmail: 'aman.sharma.gwalior@gmail.com',
            rating: 5,
            comment: 'Best quality product delivered same day in Sarafa Bazaar Gwalior! Super fast delivery and genuine warranty.',
            photoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
            status: 'APPROVED'
          },
          {
            customerName: 'Priya Verma',
            customerEmail: 'priya.v.gwl@gmail.com',
            rating: 5,
            comment: 'Prem Mobile always gives authentic items at wholesale rates. Packaging was top notch!',
            photoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop',
            status: 'APPROVED'
          },
          {
            customerName: 'Rohit Gupta',
            customerEmail: 'rohit.gwalior.sales@gmail.com',
            rating: 4,
            comment: 'Great battery backup and genuine product. Received within 3 hours in City Center Gwalior.',
            photoUrl: null,
            status: 'APPROVED'
          },
          {
            customerName: 'Neha Rajput',
            customerEmail: 'neha.rajput@gmail.com',
            rating: 5,
            comment: 'Unboxing experience was awesome. Thank you Prem Mobile for the Sunday Sale deal!',
            photoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop',
            status: 'APPROVED'
          }
        ];

        const insertRev = db.prepare(`
          INSERT INTO reviews (productId, customerName, customerEmail, rating, comment, photoUrl, status, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        productsList.forEach((prod, index) => {
          const rev1 = seedReviews[index % seedReviews.length];
          const rev2 = seedReviews[(index + 1) % seedReviews.length];

          const date1 = new Date(Date.now() - (index + 1) * 86400000).toISOString();
          const date2 = new Date(Date.now() - (index + 3) * 86400000).toISOString();

          insertRev.run(prod.id, rev1.customerName, rev1.customerEmail, rev1.rating, rev1.comment, rev1.photoUrl, rev1.status, date1);
          insertRev.run(prod.id, rev2.customerName, rev2.customerEmail, rev2.rating, rev2.comment, rev2.photoUrl, rev2.status, date2);
        });

        console.log('[DB] Seeded initial customer reviews for catalog products');
      }
    }
  } catch (e) {
    console.warn('[DB] Review seed warning:', e.message);
  }

  // Seed sample promo coupons if table is empty
  try {
    const couponCheck = db.prepare('SELECT COUNT(*) as count FROM coupons').get();
    if (couponCheck.count === 0) {
      const defaultCoupons = [
        {
          code: 'GWALIOR10',
          type: 'PERCENT',
          value: 10,
          minOrderAmount: 999,
          maxDiscountAmount: 500,
          usageLimit: 500,
          isActive: 1,
          expiryDate: '2026-12-31'
        },
        {
          code: 'SUNDAY500',
          type: 'FLAT',
          value: 500,
          minOrderAmount: 2999,
          maxDiscountAmount: 500,
          usageLimit: 200,
          isActive: 1,
          expiryDate: '2026-12-31'
        },
        {
          code: 'WELCOME100',
          type: 'FLAT',
          value: 100,
          minOrderAmount: 499,
          maxDiscountAmount: 100,
          usageLimit: 1000,
          isActive: 1,
          expiryDate: '2026-12-31'
        }
      ];

      const insertCoupon = db.prepare(`
        INSERT INTO coupons (code, type, value, minOrderAmount, maxDiscountAmount, usageLimit, isActive, expiryDate, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const now = new Date().toISOString();

      for (const c of defaultCoupons) {
        insertCoupon.run(c.code, c.type, c.value, c.minOrderAmount, c.maxDiscountAmount, c.usageLimit, c.isActive, c.expiryDate, now, now);
      }
      console.log('[DB] Seeded default promo coupons (GWALIOR10, SUNDAY500, WELCOME100)');
    }
  } catch (e) {
    console.warn('[DB] Coupon seed warning:', e.message);
  }

  // Seed 20 Realistic Prem Mobile Catalog Products & Verified Customer Reviews
  try {
    seedCatalogProductsAndReviews();
  } catch (e) {
    console.warn('[DB] Catalog seed warning:', e.message);
  }
}

// Automatically initialize on import
initDatabase();
