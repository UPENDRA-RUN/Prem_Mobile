import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  requireAdmin,
  requireCustomer,
  checkLoginAttempts,
  recordFailedLogin,
  clearLoginAttempts
} from '../auth.js';

const router = express.Router();

/**
 * CUSTOMER REGISTRATION
 * POST /api/auth/customer/register
 * Fields: name, mobile, email, password, confirmPassword
 */
router.post('/customer/register', (req, res) => {
  const { name, mobile, email, password, confirmPassword } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Please enter your full name.' });
  }

  if (!mobile || !mobile.trim()) {
    return res.status(400).json({ success: false, error: 'Please enter your mobile number.' });
  }

  const cleanMobile = String(mobile).replace(/\D/g, '');
  if (cleanMobile.length < 10) {
    return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit mobile number.' });
  }

  if (!email || !email.trim() || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({ success: false, error: 'Passwords do not match. Please re-enter.' });
  }

  // Check if mobile or email already exists
  const existingUser = db.prepare('SELECT id, email, mobile FROM users WHERE email = ? OR mobile = ?').get(cleanEmail, cleanMobile);
  if (existingUser) {
    if (existingUser.email === cleanEmail) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists. Please log in.' });
    }
    return res.status(409).json({ success: false, error: 'An account with this mobile number already exists. Please log in.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const now = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO users (name, email, mobile, passwordHash, salt, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, 'CUSTOMER', ?, ?)
  `);

  const result = insert.run(name.trim(), cleanEmail, cleanMobile, passwordHash, salt, now, now);
  const userId = result.lastInsertRowid;

  const user = {
    id: userId,
    name: name.trim(),
    email: cleanEmail,
    mobile: cleanMobile,
    role: 'CUSTOMER'
  };

  const token = generateToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: 'CUSTOMER'
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    token,
    user
  });
});

/**
 * CUSTOMER LOGIN
 * POST /api/auth/customer/login
 * Fields: identifier (email or mobile), password
 */
router.post('/customer/login', (req, res) => {
  const { identifier, password } = req.body || {};

  // Requirement 4: If fields are empty
  if (!identifier || !String(identifier).trim() || !password || !String(password).trim()) {
    return res.status(400).json({
      success: false,
      error: 'Please enter your login details.'
    });
  }

  const cleanIdent = String(identifier).trim();
  const cleanDigits = cleanIdent.replace(/\D/g, '');

  // Brute force check
  const attemptCheck = checkLoginAttempts(cleanIdent);
  if (!attemptCheck.allowed) {
    return res.status(429).json({ success: false, error: attemptCheck.error });
  }

  // Look up user by email or mobile
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanIdent.toLowerCase());
  if (!user && cleanDigits.length >= 10) {
    user = db.prepare('SELECT * FROM users WHERE mobile = ?').get(cleanDigits);
  }

  // Requirement 4: If account does not exist
  if (!user) {
    recordFailedLogin(cleanIdent);
    return res.status(401).json({
      success: false,
      error: 'Account not found. Please create an account.'
    });
  }

  // Verify password
  const isValid = verifyPassword(password, user.salt, user.passwordHash);
  if (!isValid) {
    recordFailedLogin(cleanIdent);
    // Requirement 4: If credentials are incorrect
    return res.status(401).json({
      success: false,
      error: 'Incorrect email/mobile number or password.'
    });
  }

  // Clear attempts on success
  clearLoginAttempts(cleanIdent);

  const token = generateToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role
  });

  res.json({
    success: true,
    message: 'Logged in successfully!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role
    }
  });
});

/**
 * CUSTOMER CURRENT PROFILE
 * GET /api/auth/customer/me
 */
router.get('/customer/me', requireCustomer, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * ADMIN LOGIN
 * POST /api/auth/login
 * Fields: email, password
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Brute force check
  const attemptCheck = checkLoginAttempts(cleanEmail);
  if (!attemptCheck.allowed) {
    return res.status(429).json({ success: false, error: attemptCheck.error });
  }

  // Check admins table or users table with role 'ADMIN'
  let admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(cleanEmail);
  let adminRole = 'ADMIN';

  if (!admin) {
    const userAdmin = db.prepare("SELECT * FROM users WHERE email = ? AND role = 'ADMIN'").get(cleanEmail);
    if (userAdmin) {
      admin = userAdmin;
    }
  }

  if (!admin) {
    recordFailedLogin(cleanEmail);
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const isValid = verifyPassword(password, admin.salt, admin.passwordHash);
  if (!isValid) {
    recordFailedLogin(cleanEmail);
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  clearLoginAttempts(cleanEmail);

  const token = generateToken({
    adminId: admin.id,
    userId: admin.id,
    email: admin.email,
    name: admin.name,
    role: 'ADMIN'
  });

  res.json({
    success: true,
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'ADMIN'
    }
  });
});

/**
 * ADMIN CURRENT PROFILE
 * GET /api/auth/me
 */
router.get('/me', requireAdmin, (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

export default router;
