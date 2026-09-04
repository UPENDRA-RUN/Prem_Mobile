import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = express.Router();

/**
 * Helper: Get all settings as key-value object
 */
function getAllSettings() {
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  for (const r of rows) {
    settings[r.key] = r.value;
  }
  return settings;
}

/**
 * Helper: Set a setting value (insert or update)
 */
function setSetting(key, value) {
  db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, String(value));
}

/**
 * GET /api/settings
 * Returns store configuration and all settings.
 */
router.get('/', requireAdmin, (req, res) => {
  try {
    const settings = getAllSettings();

    return res.json({
      success: true,
      settings,
      storeConfig: {
        name: settings.store_name || 'Prem Mobile',
        tagline: settings.store_tagline || 'Deal Aise Jo Deewana Bana De 🔥',
        phone: settings.store_phone || '8770559251',
        whatsapp: settings.store_whatsapp || '918770559251',
        address: settings.store_address || 'Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.)',
        city: settings.store_city || 'Gwalior',
        state: settings.store_state || 'Madhya Pradesh',
        landmark: settings.store_landmark || 'Jaderua Gate Ke Samne & Pinto Park Chauraha',
        email: settings.store_email || 'premmobilegwalior@gmail.com',
        timing: settings.store_timing || '10:00 AM – 9:30 PM (Open All 7 Days A Week)',
        closedDay: settings.store_closed_day || 'Tuesday'
      }
    });
  } catch (err) {
    console.error('Error fetching settings:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch settings.' });
  }
});

/**
 * POST /api/settings
 * Updates store configuration settings.
 * Accepts: store_name, store_tagline, store_phone, store_whatsapp, store_address,
 *          store_city, store_state, store_landmark, store_email, store_timing, store_closed_day
 */
router.post('/', requireAdmin, (req, res) => {
  try {
    const allowedKeys = [
      'store_name', 'store_tagline', 'store_phone', 'store_whatsapp',
      'store_address', 'store_city', 'store_state', 'store_landmark',
      'store_email', 'store_timing', 'store_closed_day'
    ];

    const updates = {};
    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) {
        setSetting(key, req.body[key]);
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid settings provided.' });
    }

    const settings = getAllSettings();

    return res.json({
      success: true,
      message: 'Store settings updated successfully.',
      updates,
      storeConfig: {
        name: settings.store_name || 'Prem Mobile',
        tagline: settings.store_tagline || 'Deal Aise Jo Deewana Bana De 🔥',
        phone: settings.store_phone || '8770559251',
        whatsapp: settings.store_whatsapp || '918770559251',
        address: settings.store_address || 'Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.)',
        city: settings.store_city || 'Gwalior',
        state: settings.store_state || 'Madhya Pradesh',
        landmark: settings.store_landmark || 'Jaderua Gate Ke Samne & Pinto Park Chauraha',
        email: settings.store_email || 'premmobilegwalior@gmail.com',
        timing: settings.store_timing || '10:00 AM – 9:30 PM (Open All 7 Days A Week)',
        closedDay: settings.store_closed_day || 'Tuesday'
      }
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    return res.status(500).json({ success: false, error: 'Failed to update settings.' });
  }
});

export default router;
