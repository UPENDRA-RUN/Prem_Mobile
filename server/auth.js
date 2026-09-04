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

// In-memory brute-force attempt tracker
const loginAttempts = new Map();

export function checkLoginAttempts(identifier) {
  const key = String(identifier || '').trim().toLowerCase();
  const record = loginAttempts.get(key);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      error: `Too many failed login attempts. Please wait ${remainingSeconds} seconds before trying again.`
    };
  }

  if (record.lockedUntil && now >= record.lockedUntil) {
    loginAttempts.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(identifier) {
  const key = String(identifier || '').trim().toLowerCase();
  const now = Date.now();
  const record = loginAttempts.get(key) || { count: 0, firstAttempt: now };

  // Reset if window older than 15 minutes
  if (now - record.firstAttempt > 15 * 60 * 1000) {
    record.count = 0;
    record.firstAttempt = now;
  }

  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = now + 5 * 60 * 1000; // 5 minute lock
  }

  loginAttempts.set(key, record);
}

export function clearLoginAttempts(identifier) {
  const key = String(identifier || '').trim().toLowerCase();
  loginAttempts.delete(key);
}

// Middleware to protect admin routes
export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication token required' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
  }

  // Check role
  const role = payload.role;
  const adminId = payload.adminId || (role === 'ADMIN' ? payload.userId : null);

  if (!adminId || (role && role !== 'ADMIN')) {
    return res.status(403).json({ success: false, error: 'Access denied: Administrator privileges required' });
  }

  // Verify admin exists in admins table OR users table with role 'ADMIN'
  let admin = db.prepare('SELECT id, name, email FROM admins WHERE id = ?').get(adminId);
  if (!admin) {
    admin = db.prepare("SELECT id, name, email, role FROM users WHERE id = ? AND role = 'ADMIN'").get(adminId);
  }

  if (!admin) {
    return res.status(403).json({ success: false, error: 'Access denied: Administrator account not found' });
  }

  req.admin = admin;
  req.user = admin;
  next();
}

// Middleware to protect customer routes
export function requireCustomer(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Customer authentication required' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired session' });
  }

  const userId = payload.userId || payload.adminId;
  const user = db.prepare('SELECT id, name, email, mobile, role FROM users WHERE id = ?').get(userId);
  if (!user) {
    // If admin is browsing
    if (payload.adminId) {
      const admin = db.prepare('SELECT id, name, email FROM admins WHERE id = ?').get(payload.adminId);
      if (admin) {
        req.user = { ...admin, role: 'ADMIN' };
        return next();
      }
    }
    return res.status(401).json({ success: false, error: 'Unauthorized: User account not found' });
  }

  req.user = user;
  next();
}
