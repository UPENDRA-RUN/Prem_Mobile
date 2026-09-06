import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import { broadcastEvent } from '../events.js';

const router = express.Router();

// POST /api/coupons/validate - Validate coupon code and calculate discount
router.post('/validate', (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Please enter a valid coupon code.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const total = Math.round(Number(cartTotal || 0));

    const coupon = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = ?').get(cleanCode);

    if (!coupon) {
      return res.status(404).json({ success: false, message: `Coupon code "${cleanCode}" is invalid.` });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: `Coupon code "${cleanCode}" is currently inactive.` });
    }

    if (coupon.expiryDate) {
      const today = new Date().toISOString().split('T')[0];
      if (coupon.expiryDate < today) {
        return res.status(400).json({ success: false, message: `Coupon code "${cleanCode}" has expired.` });
      }
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: `Coupon code "${cleanCode}" usage limit has been reached.` });
    }

    const minAmount = Number(coupon.minOrderAmount || 0);
    if (minAmount > 0 && total < minAmount) {
      const diff = minAmount - total;
      return res.status(400).json({
        success: false,
        message: `Coupon "${cleanCode}" requires a minimum order total of ₹${minAmount.toLocaleString('en-IN')}. Add ₹${diff.toLocaleString('en-IN')} more to apply.`
      });
    }

    // Calculate exact discount savings
    let discountAmount = 0;

    if (coupon.type === 'PERCENT') {
      discountAmount = Math.round((total * Number(coupon.value)) / 100);
      if (coupon.maxDiscountAmount && discountAmount > Number(coupon.maxDiscountAmount)) {
        discountAmount = Number(coupon.maxDiscountAmount);
      }
    } else if (coupon.type === 'FLAT') {
      discountAmount = Math.min(total, Number(coupon.value));
    }

    const finalTotal = Math.max(0, total - discountAmount);

    return res.json({
      success: true,
      message: `Coupon "${cleanCode}" applied successfully! You save ₹${discountAmount}.`,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
        finalTotal,
        label: coupon.type === 'PERCENT' ? `${coupon.value}% OFF` : `₹${coupon.value} FLAT OFF`
      }
    });
  } catch (err) {
    console.error('[COUPONS] Validation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to validate coupon code' });
  }
});

// GET /api/coupons/admin - List all promo coupons for admin manager
router.get('/admin', requireAdmin, (req, res) => {
  try {
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY id DESC').all();

    const totalSavings = coupons.reduce((acc, c) => acc + (c.timesUsed * (c.type === 'FLAT' ? c.value : 150)), 0);

    const stats = {
      total: coupons.length,
      active: coupons.filter(c => c.isActive).length,
      expired: coupons.filter(c => c.expiryDate && c.expiryDate < new Date().toISOString().split('T')[0]).length,
      totalSavings
    };

    return res.json({
      success: true,
      data: {
        coupons,
        stats
      }
    });
  } catch (err) {
    console.error('[COUPONS] Admin fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
});

// POST /api/coupons/admin - Create new promo coupon
router.post('/admin', requireAdmin, (req, res) => {
  try {
    const { code, type, value, minOrderAmount, maxDiscountAmount, usageLimit, expiryDate, isActive } = req.body;

    if (!code || !value) {
      return res.status(400).json({ success: false, message: 'Coupon code and value are required.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = db.prepare('SELECT id FROM coupons WHERE UPPER(code) = ?').get(cleanCode);
    if (existing) {
      return res.status(400).json({ success: false, message: `Coupon code "${cleanCode}" already exists.` });
    }

    const now = new Date().toISOString();

    const result = db.prepare(`
      INSERT INTO coupons (code, type, value, minOrderAmount, maxDiscountAmount, usageLimit, isActive, expiryDate, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      cleanCode,
      type === 'FLAT' ? 'FLAT' : 'PERCENT',
      Number(value),
      Number(minOrderAmount || 0),
      maxDiscountAmount ? Number(maxDiscountAmount) : null,
      usageLimit ? Number(usageLimit) : null,
      isActive !== undefined ? (isActive ? 1 : 0) : 1,
      expiryDate || null,
      now,
      now
    );

    broadcastEvent('COUPONS_UPDATED');

    return res.status(201).json({
      success: true,
      message: `Promo coupon "${cleanCode}" created successfully!`,
      data: { id: result.lastInsertRowid, code: cleanCode }
    });
  } catch (err) {
    console.error('[COUPONS] Create error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
});

// PUT /api/coupons/admin/:id - Update existing coupon
router.put('/admin/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { code, type, value, minOrderAmount, maxDiscountAmount, usageLimit, expiryDate, isActive } = req.body;

    const coupon = db.prepare('SELECT * FROM coupons WHERE id = ?').get(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const cleanCode = code ? code.trim().toUpperCase() : coupon.code;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE coupons SET
        code = ?, type = ?, value = ?, minOrderAmount = ?, maxDiscountAmount = ?,
        usageLimit = ?, isActive = ?, expiryDate = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      cleanCode,
      type || coupon.type,
      value !== undefined ? Number(value) : coupon.value,
      minOrderAmount !== undefined ? Number(minOrderAmount) : coupon.minOrderAmount,
      maxDiscountAmount !== undefined ? (maxDiscountAmount ? Number(maxDiscountAmount) : null) : coupon.maxDiscountAmount,
      usageLimit !== undefined ? (usageLimit ? Number(usageLimit) : null) : coupon.usageLimit,
      isActive !== undefined ? (isActive ? 1 : 0) : coupon.isActive,
      expiryDate !== undefined ? expiryDate : coupon.expiryDate,
      now,
      id
    );

    broadcastEvent('COUPONS_UPDATED');

    return res.json({
      success: true,
      message: `Coupon "${cleanCode}" updated successfully.`
    });
  } catch (err) {
    console.error('[COUPONS] Update error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update coupon' });
  }
});

// DELETE /api/coupons/admin/:id - Delete coupon
router.delete('/admin/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const coupon = db.prepare('SELECT * FROM coupons WHERE id = ?').get(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    db.prepare('DELETE FROM coupons WHERE id = ?').run(id);

    broadcastEvent('COUPONS_UPDATED');

    return res.json({
      success: true,
      message: `Coupon "${coupon.code}" deleted successfully.`
    });
  } catch (err) {
    console.error('[COUPONS] Delete error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
});

export default router;
