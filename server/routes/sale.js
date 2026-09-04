import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import {
  getSalePublicState,
  getSaleAdminState,
  getActiveLiveSale
} from '../saleLogic.js';

const router = express.Router();

/**
 * GET /api/sale
 * Public endpoint for customer-facing sale page and banner.
 */
router.get('/', (req, res) => {
  try {
    const data = getSalePublicState();
    return res.json({ success: true, ...data });
  } catch (err) {
    console.error('Error fetching public sale state:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch sale information.' });
  }
});

/**
 * GET /api/sale/admin
 * Admin endpoint for inspecting candidate products and current sale status.
 */
router.get('/admin', requireAdmin, (req, res) => {
  try {
    const data = getSaleAdminState();
    return res.json({ success: true, ...data });
  } catch (err) {
    console.error('Error fetching admin sale state:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch admin sale configuration.' });
  }
});

/**
 * POST /api/sale/admin/save
 * Admin configures sale name, dates, times, products and prices.
 * Strictly sets status to 'READY' (or 'DRAFT'). DOES NOT MAKE SALE LIVE.
 */
router.post('/admin/save', requireAdmin, (req, res) => {
  try {
    const {
      saleId,
      name = 'Special Sale',
      startDate,
      endDate,
      startTime = '',
      endTime = '',
      items = []
    } = req.body;

    const todayStr = new Date().toISOString().split('T')[0];
    const finalStartDate = startDate || todayStr;
    const finalEndDate = endDate || finalStartDate;

    const now = new Date().toISOString();
    let currentSaleId = saleId;

    if (currentSaleId) {
      const existing = db.prepare('SELECT * FROM sales WHERE id = ?').get(currentSaleId);
      if (existing) {
        // Keep status as READY or DRAFT unless it's currently LIVE
        const newStatus = existing.status === 'LIVE' ? 'LIVE' : (items.length > 0 ? 'READY' : 'DRAFT');
        db.prepare(`
          UPDATE sales
          SET name = ?, startDate = ?, endDate = ?, startTime = ?, endTime = ?, status = ?, updatedAt = ?
          WHERE id = ?
        `).run(name, finalStartDate, finalEndDate, startTime, endTime, newStatus, now, currentSaleId);
      } else {
        currentSaleId = null;
      }
    }

    if (!currentSaleId) {
      const newStatus = items.length > 0 ? 'READY' : 'DRAFT';
      const insertInfo = db.prepare(`
        INSERT INTO sales (name, startDate, endDate, startTime, endTime, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, finalStartDate, finalEndDate, startTime, endTime, newStatus, now, now);
      currentSaleId = insertInfo.lastInsertRowid;
    }

    // Delete existing sale items and insert new ones
    db.prepare('DELETE FROM sale_items WHERE saleId = ?').run(currentSaleId);

    const insertItemStmt = db.prepare(`
      INSERT INTO sale_items (saleId, productId, regularPriceSnapshot, salePrice, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
      if (product) {
        const salePrice = Number(item.salePrice) || product.regularPrice;
        insertItemStmt.run(currentSaleId, product.id, product.regularPrice, salePrice, now);
      }
    }

    const updatedSale = db.prepare('SELECT * FROM sales WHERE id = ?').get(currentSaleId);
    return res.json({
      success: true,
      message: `Sale saved successfully! Status is ${updatedSale.status}. Press [GO LIVE] when ready.`,
      sale: updatedSale,
      status: updatedSale.status
    });
  } catch (err) {
    console.error('Error saving sale configuration:', err);
    return res.status(500).json({ success: false, error: 'Failed to save sale configuration.' });
  }
});

/**
 * POST /api/sale/admin/go-live
 * Explicit admin manual activation.
 * Backend verifies:
 * 1. Admin authenticated & authorized
 * 2. Sale exists
 * 3. Sale has at least 1 product
 * 4. Sale prices are valid
 * 5. Sale is not already ended
 * 6. Only ONE active sale allowed at a time (Requirement 12)
 */
router.post('/admin/go-live', requireAdmin, (req, res) => {
  try {
    const { saleId } = req.body || {};

    let targetSale = null;
    if (saleId) {
      targetSale = db.prepare('SELECT * FROM sales WHERE id = ?').get(saleId);
    } else {
      targetSale = db.prepare("SELECT * FROM sales WHERE status != 'ENDED' ORDER BY id DESC LIMIT 1").get();
    }

    if (!targetSale) {
      return res.status(404).json({ success: false, error: 'Sale record not found. Please create or save a sale first.' });
    }

    // Check if another sale is already LIVE
    const existingLiveSale = db.prepare("SELECT * FROM sales WHERE status = 'LIVE' AND id != ?").get(targetSale.id);
    if (existingLiveSale) {
      return res.status(400).json({
        success: false,
        error: `Another sale ("${existingLiveSale.name}") is currently live. Please end the current sale before starting a new one.`,
        liveSaleId: existingLiveSale.id,
        liveSaleName: existingLiveSale.name
      });
    }

    // Check if sale has at least one product
    const items = db.prepare('SELECT * FROM sale_items WHERE saleId = ?').all(targetSale.id);
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Sale must have at least one product before going live. Please select products and set sale prices.'
      });
    }

    // Validate sale prices
    for (const item of items) {
      if (!item.salePrice || Number(item.salePrice) <= 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid sale price for product #${item.productId}. Sale price must be greater than zero.`
        });
      }
    }

    // Activate sale
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sales
      SET status = 'LIVE', activatedAt = ?, updatedAt = ?
      WHERE id = ?
    `).run(now, now, targetSale.id);

    const activatedSale = db.prepare('SELECT * FROM sales WHERE id = ?').get(targetSale.id);

    return res.json({
      success: true,
      message: `🔥 "${activatedSale.name}" is now LIVE! Customers can immediately see special sale prices.`,
      sale: activatedSale,
      status: 'LIVE'
    });
  } catch (err) {
    console.error('Error activating sale:', err);
    return res.status(500).json({ success: false, error: 'Failed to activate sale.' });
  }
});

/**
 * POST /api/sale/admin/end
 * Admin manually ends the sale.
 * Status becomes 'ENDED'. Customer website immediately stops showing active sale.
 */
router.post('/admin/end', requireAdmin, (req, res) => {
  try {
    const { saleId } = req.body || {};

    let targetSale = null;
    if (saleId) {
      targetSale = db.prepare('SELECT * FROM sales WHERE id = ?').get(saleId);
    } else {
      targetSale = db.prepare("SELECT * FROM sales WHERE status = 'LIVE' ORDER BY id DESC LIMIT 1").get();
    }

    if (!targetSale) {
      return res.status(404).json({ success: false, error: 'No active sale found to end.' });
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sales
      SET status = 'ENDED', endedAt = ?, updatedAt = ?
      WHERE id = ?
    `).run(now, now, targetSale.id);

    const endedSale = db.prepare('SELECT * FROM sales WHERE id = ?').get(targetSale.id);

    return res.json({
      success: true,
      message: `"${endedSale.name}" has been ended. Website has returned to regular pricing.`,
      sale: endedSale,
      status: 'ENDED'
    });
  } catch (err) {
    console.error('Error ending sale:', err);
    return res.status(500).json({ success: false, error: 'Failed to end sale.' });
  }
});

export default router;
