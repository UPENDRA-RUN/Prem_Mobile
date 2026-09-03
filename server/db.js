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
      createdAt TEXT NOT NULL
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
  `);

  // Seed default admin if none exists
  const adminCheck = db.prepare('SELECT COUNT(*) as count FROM admins').get();
  if (adminCheck.count === 0) {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync('admin123', salt, 1000, 64, 'sha512').toString('hex');
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO admins (name, email, passwordHash, salt, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run('Prem Mobile Admin', 'admin@premmobile.com', passwordHash, salt, now);
    console.log('[DB] Seeded default admin: admin@premmobile.com / admin123');
  }

  // Seed initial settings
  const settingsCheck = db.prepare("SELECT value FROM settings WHERE key = 'simulated_day'").get();
  if (!settingsCheck) {
    db.prepare("INSERT INTO settings (key, value) VALUES ('simulated_day', 'REAL')").run();
  }

  // Seed initial products from existing products.js if empty
  const productCheck = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (productCheck.count === 0) {
    try {
      const productsFilePath = path.join(__dirname, '..', 'src', 'data', 'products.js');
      if (fs.existsSync(productsFilePath)) {
        const fileContent = fs.readFileSync(productsFilePath, 'utf8');
        // Extract products array using dynamic import or eval in safe context
        import('../src/data/products.js').then(({ products }) => {
          if (Array.isArray(products)) {
            const now = new Date().toISOString();
            const insert = db.prepare(`
              INSERT INTO products (
                id, name, slug, description, category, categorySlug, brand, images, regularPrice, stock, isActive, isFeatured, tag, createdAt, updatedAt
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            for (const p of products) {
              const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + p.id;
              const imgList = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : ['/images/prem-main.jpg']);
              const regPrice = Number(p.originalPrice || p.price || 499);
              insert.run(
                p.id,
                p.name,
                slug,
                p.description || `${p.name} at Prem Mobile`,
                p.category || 'Accessories',
                p.categorySlug || 'accessories',
                p.brand || 'Prem Mobile',
                JSON.stringify(imgList),
                regPrice,
                15,
                1,
                p.isFeatured ? 1 : 0,
                p.tag || '',
                now,
                now
              );
            }
            console.log(`[DB] Seeded ${products.length} products into SQLite database.`);
          }
        }).catch(err => {
          console.warn('[DB] Could not dynamically load initial products:', err.message);
        });
      }
    } catch (e) {
      console.warn('[DB] Product seed warning:', e.message);
    }
  }
}

// Automatically initialize on import
initDatabase();
