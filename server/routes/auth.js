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

  const cookieOptions = {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: false,
    sameSite: 'lax',
    path: '/'
  };

  res.cookie('premmobile_customer_token', token, cookieOptions);
  res.cookie('premmobile_customer_user', JSON.stringify(user), cookieOptions);

  res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    token,
    user
  });
});

/**
 * UNIFIED LOGIN (CUSTOMER & ADMIN)
 * POST /api/auth/customer/login
 * Fields: identifier (email or mobile), password
 */
router.post('/customer/login', (req, res) => {
  const { identifier, password } = req.body || {};

  if (!identifier || !String(identifier).trim() || !password || !String(password).trim()) {
    return res.status(400).json({
      success: false,
      error: 'Please enter your login details.'
    });
  }

  const cleanIdent = String(identifier).trim();
  const cleanEmail = cleanIdent.toLowerCase();
  const cleanDigits = cleanIdent.replace(/\D/g, '');

  // Brute force check
  const attemptCheck = checkLoginAttempts(cleanIdent);
  if (!attemptCheck.allowed) {
    return res.status(429).json({ success: false, error: attemptCheck.error });
  }

  const cookieOptions = {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: false,
    sameSite: 'lax',
    path: '/'
  };

  // 1. First check if credentials match an Admin in admins table or users table with role='ADMIN'
  let admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(cleanEmail);
  if (!admin) {
    admin = db.prepare("SELECT * FROM users WHERE (email = ? OR mobile = ?) AND role = 'ADMIN'").get(cleanEmail, cleanDigits);
  }

  if (admin) {
    const isValidAdmin = verifyPassword(password, admin.salt, admin.passwordHash);
    if (isValidAdmin) {
      clearLoginAttempts(cleanIdent);
      const token = generateToken({
        adminId: admin.id,
        userId: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'ADMIN'
      });

      const adminData = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile || '',
        role: 'ADMIN'
      };

      res.cookie('premmobile_customer_token', token, cookieOptions);
      res.cookie('premmobile_customer_user', JSON.stringify(adminData), cookieOptions);
      res.cookie('premmobile_admin_token', token, cookieOptions);
      res.cookie('premmobile_admin_user', JSON.stringify(adminData), cookieOptions);

      return res.json({
        success: true,
        message: 'Logged in as Administrator!',
        token,
        role: 'ADMIN',
        user: adminData,
        admin: adminData
      });
    }
  }

  // 2. Otherwise check regular users table
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
  if (!user && cleanDigits.length >= 10) {
    user = db.prepare('SELECT * FROM users WHERE mobile = ?').get(cleanDigits);
  }

  if (!user) {
    recordFailedLogin(cleanIdent);
    return res.status(401).json({
      success: false,
      error: 'Account not found. Please create an account.'
    });
  }

  const isValidUser = verifyPassword(password, user.salt, user.passwordHash);
  if (!isValidUser) {
    recordFailedLogin(cleanIdent);
    return res.status(401).json({
      success: false,
      error: 'Incorrect email/mobile number or password.'
    });
  }

  clearLoginAttempts(cleanIdent);

  const token = generateToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role || 'CUSTOMER'
  });

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role || 'CUSTOMER'
  };

  res.cookie('premmobile_customer_token', token, cookieOptions);
  res.cookie('premmobile_customer_user', JSON.stringify(userData), cookieOptions);

  if (userData.role === 'ADMIN') {
    res.cookie('premmobile_admin_token', token, cookieOptions);
    res.cookie('premmobile_admin_user', JSON.stringify(userData), cookieOptions);
  }

  return res.json({
    success: true,
    message: 'Logged in successfully!',
    token,
    role: userData.role,
    user: userData,
    ...(userData.role === 'ADMIN' ? { admin: userData } : {})
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

/**
 * UNIFIED LOGOUT
 * POST /api/auth/logout & POST /api/auth/customer/logout
 * Completely clears all admin & customer auth cookies on the server
 */
const performLogout = (req, res) => {
  const cookieOptions = { path: '/', httpOnly: false, sameSite: 'lax' };
  res.clearCookie('premmobile_admin_token', cookieOptions);
  res.clearCookie('premmobile_admin_user', cookieOptions);
  res.clearCookie('premmobile_customer_token', cookieOptions);
  res.clearCookie('premmobile_customer_user', cookieOptions);
  res.clearCookie('premmobile_user_profile', cookieOptions);

  return res.json({
    success: true,
    message: 'Logged out successfully. All security sessions terminated.'
  });
};

router.post('/logout', performLogout);
router.post('/customer/logout', performLogout);

export default router;
