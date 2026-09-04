import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { resolveServerProductPrice } from '../saleLogic.js';
import { broadcastEvent } from '../events.js';

const router = express.Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_TY1sq2rCUuSbfs';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'unMtcT3JuoKZ9g2znjQVXYpL';

// 1. POST /api/payment/create-razorpay-order
router.post('/create-razorpay-order', async (req, res) => {
  try {
    const { amount, receipt } = req.body || {};

    const orderAmount = Math.round((parseFloat(amount) || 0) * 100); // Amount in paise
    if (orderAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid order amount' });
    }

    const rcpt = receipt || `rcpt_${Date.now()}`;
    const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

    // Create authentic Razorpay order via Razorpay API
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        amount: orderAmount,
        currency: 'INR',
        receipt: rcpt
      })
    });

    const rzpData = await rzpRes.json();

    if (!rzpRes.ok || !rzpData.id) {
      console.error('Razorpay API Order Error:', rzpData);
      return res.status(500).json({
        success: false,
        error: rzpData.error?.description || 'Failed to create order on Razorpay servers'
      });
    }

    res.json({
      success: true,
      key: RAZORPAY_KEY_ID,
      amount: orderAmount,
      currency: 'INR',
      razorpayOrderId: rzpData.id,
      receipt: rcpt
    });
  } catch (err) {
    console.error('Create Razorpay order error:', err);
    res.status(500).json({ success: false, error: err.message || 'Server error creating payment' });
  }
});

// 2. POST /api/payment/verify-razorpay-payment
router.post('/verify-razorpay-payment', (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    customerDetails,
    items,
    notes
  } = req.body || {};

  const {
    customerName,
    mobile,
    email,
    address,
    city,
    state,
    pincode
  } = customerDetails || {};

  if (!customerName || !mobile || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Incomplete order details' });
  }

  let subtotal = 0;
  let totalDiscount = 0;
  let isSundaySaleOrder = false;
  const verifiedItems = [];

  for (const item of items) {
    const pId = Number(item.productId || item.id);
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

    const serverPriceInfo = resolveServerProductPrice(pId);
    if (serverPriceInfo) {
      const regPrice = serverPriceInfo.regularPrice;
      const finalPrice = serverPriceInfo.finalUnitPrice;
      const salePrice = serverPriceInfo.isSundaySalePrice ? serverPriceInfo.salePrice : null;

      if (serverPriceInfo.isSundaySalePrice) isSundaySaleOrder = true;

      const itemRegularSubtotal = regPrice * qty;
      const itemFinalSubtotal = finalPrice * qty;
      const itemDiscount = Math.max(0, itemRegularSubtotal - itemFinalSubtotal);

      subtotal += itemFinalSubtotal;
      totalDiscount += itemDiscount;

      verifiedItems.push({
        productId: pId,
        name: serverPriceInfo.name,
        quantity: qty,
        regularPrice: regPrice,
        salePrice: salePrice,
        finalPrice: finalPrice,
        lineTotal: itemFinalSubtotal
      });
    }
  }

  const finalTotal = subtotal;
  const orderNumber = 'PM-RZP-' + Date.now().toString().slice(-6) + '-' + Math.floor(100 + Math.random() * 900);
  const now = new Date().toISOString();

  const paymentRef = razorpay_payment_id || `pay_${Date.now()}`;
  const notesText = `[Razorpay Paid: ${paymentRef}] ${notes || ''}`.trim();

  // Create Order in DB as CONFIRMED
  const orderInsert = db.prepare(`
    INSERT INTO orders (
      orderNumber, customerName, mobile, email, address, city, state, pincode,
      subtotal, discount, total, status, notes, isSundaySaleOrder, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?, ?, ?)
  `);

  const orderResult = orderInsert.run(
    orderNumber,
    customerName.trim(),
    mobile.trim(),
    email ? email.trim() : '',
    address.trim(),
    city.trim(),
    state.trim(),
    pincode.trim(),
    subtotal,
    totalDiscount,
    finalTotal,
    notesText,
    isSundaySaleOrder ? 1 : 0,
    now
  );

  const orderId = orderResult.lastInsertRowid;

  // Insert Order Items
  const itemInsert = db.prepare(`
    INSERT INTO order_items (
      orderId, productId, productNameSnapshot, quantity, regularPrice, salePrice, finalPrice
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const it of verifiedItems) {
    itemInsert.run(
      orderId,
      it.productId,
      it.name,
      it.quantity,
      it.regularPrice,
      it.salePrice,
      it.finalPrice
    );
  }

  // Broadcast real-time order update to Admin Panel
  broadcastEvent('ORDERS_UPDATED');

  res.json({
    success: true,
    message: 'Payment verified & order confirmed successfully!',
    paymentId: paymentRef,
    order: {
      id: orderId,
      orderNumber,
      customerName,
      total: finalTotal,
      paymentMethod: 'Razorpay',
      paymentId: paymentRef,
      createdAt: now
    }
  });
});

export default router;
