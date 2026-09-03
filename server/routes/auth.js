import express from 'express';
import { db } from '../db.js';
import { verifyPassword, generateToken, requireAdmin } from '../auth.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email.trim().toLowerCase());
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const isValid = verifyPassword(password, admin.salt, admin.passwordHash);
  if (!isValid) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const token = generateToken({ adminId: admin.id, email: admin.email, name: admin.name });

  res.json({
    success: true,
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  });
});

router.get('/me', requireAdmin, (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

export default router;
