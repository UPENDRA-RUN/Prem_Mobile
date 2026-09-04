import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = express.Router();

// GET /api/categories - Public listing with product counts
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as productCount
      FROM categories c
      LEFT JOIN products p ON (LOWER(p.category) = LOWER(c.name) OR LOWER(p.categorySlug) = LOWER(c.slug)) AND p.isActive = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();

    res.json({
      success: true,
      categories
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - Admin: Add Category
router.post('/', requireAdmin, (req, res) => {
  try {
    const { name, icon } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Category name is required' });
    }

    const cleanName = name.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    const existing = db.prepare('SELECT id FROM categories WHERE LOWER(name) = LOWER(?) OR slug = ?').get(cleanName, slug);
    if (existing) {
      return res.status(409).json({ success: false, error: 'Category already exists' });
    }

    const result = db.prepare(`
      INSERT INTO categories (name, slug, icon, createdAt)
      VALUES (?, ?, ?, ?)
    `).run(cleanName, slug, icon || '📦', now);

    res.status(201).json({
      success: true,
      message: `Category "${cleanName}" created successfully`,
      category: {
        id: result.lastInsertRowid,
        name: cleanName,
        slug,
        icon: icon || '📦',
        createdAt: now,
        productCount: 0
      }
    });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ success: false, error: 'Failed to create category' });
  }
});

// DELETE /api/categories/:id - Admin: Remove Category
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!cat) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({
      success: true,
      message: `Category "${cat.name}" removed successfully`
    });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ success: false, error: 'Failed to delete category' });
  }
});

export default router;
