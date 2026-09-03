import crypto from 'node:crypto';
import { db } from './db.js';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'prem_mobile_super_secret_secure_key_2025_gwalior';

// Password hashing
export function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password, salt, storedHash) {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

// Token generation using HMAC SHA256 (lightweight, zero-dep, cryptographically secure)
export function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
  })).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

// Middleware to protect admin routes
export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication token required' });
  }

  const payload = verifyToken(token);
  if (!payload || !payload.adminId) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
  }

  // Verify admin exists in DB
  const admin = db.prepare('SELECT id, name, email FROM admins WHERE id = ?').get(payload.adminId);
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin account not found' });
  }

  req.admin = admin;
  next();
}
