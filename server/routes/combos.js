import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = express.Router();

/**
 * Helper to fetch combo bundled items details
 */
function enrichComboItems(comboId) {
  const items = db.prepare(`
    SELECT ci.*, p.name as productName, p.images as productImages, p.regularPrice as productRegularPrice, p.brand as productBrand
    FROM combo_items ci
    LEFT JOIN products p ON ci.productId = p.id
    WHERE ci.comboId = ?
  `).all(comboId);

  return items.map(item => {
    let image = '/images/placeholder.jpg';
    if (item.productImages) {
      try {
        const imgs = JSON.parse(item.productImages);
        if (imgs && imgs.length > 0) image = imgs[0];
      } catch (e) {}
    }
    return {
      id: item.id,
      productId: item.productId,
      name: item.customItemName || item.productName || 'Bundle Product',
      brand: item.productBrand || 'Prem Mobile',
      quantity: item.quantity || 1,
      image,
      isCustom: !item.productId
    };
  });
}

/**
 * GET /api/combos
 * Public endpoint for storefront /combos page
 */
router.get('/', (req, res) => {
  try {
    const combos = db.prepare(`
      SELECT * FROM combos WHERE isActive = 1 ORDER BY isFeatured DESC, id DESC
    `).all();

    const formatted = combos.map(c => {
      const items = enrichComboItems(c.id);
      const regular = c.regularPrice;
      const combo = c.comboPrice;
      const savings = Math.max(0, regular - combo);
      const discountPercent = regular > 0 ? Math.round((savings / regular) * 100) : 0;

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        image: c.image || (items[0]?.image || '/images/placeholder.jpg'),
        regularPrice: regular,
        comboPrice: combo,
        price: combo,
        savings,
        discountPercent,
        badgeText: c.badgeText || `${discountPercent}% OFF COMBO`,
        isFeatured: Boolean(c.isFeatured),
        items
      };
    });

    return res.json({ success: true, combos: formatted });
  } catch (err) {
    console.error('Error fetching public combos:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch combos.' });
  }
});

/**
 * GET /api/combos/admin
 * Admin endpoint to fetch all combos (active and inactive)
 */
router.get('/admin', requireAdmin, (req, res) => {
  try {
    const combos = db.prepare(`SELECT * FROM combos ORDER BY id DESC`).all();

    const formatted = combos.map(c => ({
      ...c,
      isActive: Boolean(c.isActive),
      isFeatured: Boolean(c.isFeatured),
      items: enrichComboItems(c.id)
    }));

    return res.json({ success: true, combos: formatted });
  } catch (err) {
    console.error('Error fetching admin combos:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch combos.' });
  }
});

/**
 * POST /api/combos/admin
 * Admin endpoint to create or update a combo pack
 */
router.post('/admin', requireAdmin, (req, res) => {
  try {
    const {
      id,
      name,
      description = '',
      image = '',
      regularPrice,
      comboPrice,
      badgeText = 'COMBO SAVINGS',
      isActive = true,
      isFeatured = false,
      items = []
    } = req.body;

    if (!name || !regularPrice || !comboPrice) {
      return res.status(400).json({ success: false, error: 'Combo name, regular price, and combo price are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    const now = new Date().toISOString();

    let comboId = id;
    if (comboId) {
      db.prepare(`
        UPDATE combos
        SET name = ?, description = ?, image = ?, regularPrice = ?, comboPrice = ?, badgeText = ?, isActive = ?, isFeatured = ?, updatedAt = ?
        WHERE id = ?
      `).run(name, description, image, Number(regularPrice), Number(comboPrice), badgeText, isActive ? 1 : 0, isFeatured ? 1 : 0, now, comboId);
    } else {
      const info = db.prepare(`
        INSERT INTO combos (name, slug, description, image, regularPrice, comboPrice, badgeText, isActive, isFeatured, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, slug, description, image, Number(regularPrice), Number(comboPrice), badgeText, isActive ? 1 : 0, isFeatured ? 1 : 0, now, now);
      comboId = info.lastInsertRowid;
    }

    // Replace items
    db.prepare('DELETE FROM combo_items WHERE comboId = ?').run(comboId);
    const insertItem = db.prepare(`
      INSERT INTO combo_items (comboId, productId, customItemName, quantity)
      VALUES (?, ?, ?, ?)
    `);

    for (const item of items) {
      insertItem.run(
        comboId,
        item.productId ? Number(item.productId) : null,
        item.customItemName || null,
        Number(item.quantity || 1)
      );
    }

    return res.json({ success: true, comboId, message: 'Combo pack saved successfully!' });
  } catch (err) {
    console.error('Error saving combo pack:', err);
    return res.status(500).json({ success: false, error: 'Failed to save combo pack.' });
  }
});

/**
 * DELETE /api/combos/admin/:id
 * Admin endpoint to delete a combo pack
 */
router.delete('/admin/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM combos WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Combo pack deleted.' });
  } catch (err) {
    console.error('Error deleting combo pack:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete combo pack.' });
  }
});

export default router;
