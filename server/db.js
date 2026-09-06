import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'prem_mobile.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance
try {
  db.exec('PRAGMA journal_mode = WAL;');
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
  } catch (e) {
    console.warn('[DB] Migration warning:', e.message);
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
}

// Automatically initialize on import
initDatabase();
