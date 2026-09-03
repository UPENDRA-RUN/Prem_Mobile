import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import { getCurrentDayInfo } from '../sundaySaleLogic.js';

const router = express.Router();

router.get('/', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  for (const r of rows) {
    settings[r.key] = r.value;
  }

  const dayInfo = getCurrentDayInfo();

  res.json({
    success: true,
    settings,
    dayInfo
  });
});

router.post('/', requireAdmin, (req, res) => {
  const { simulated_day } = req.body || {};

  if (simulated_day !== undefined) {
    const valid = ['REAL', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    if (!valid.includes(simulated_day)) {
      return res.status(400).json({ success: false, error: 'Invalid simulated_day value' });
    }

    db.prepare(`
      INSERT INTO settings (key, value) VALUES ('simulated_day', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(simulated_day);
  }

  const dayInfo = getCurrentDayInfo();

  res.json({
    success: true,
    message: 'Settings updated successfully',
    dayInfo
  });
});

export default router;
