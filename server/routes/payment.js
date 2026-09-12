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
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerDetails,
      items,
      notes,
      userId: bodyUserId
    } = req.body || {};

    // Cryptographic HMAC SHA256 Verification
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing Razorpay payment verification credentials (order ID, payment ID, or signature).'
      });
    }

    const expectedBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(expectedBody)
      .digest('hex');

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf8'),
      Buffer.from(razorpay_signature, 'utf8')
    );

    if (!isSignatureValid) {
      console.warn(`[Payment Security Alert] Invalid Razorpay signature attempt for order ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed: Invalid cryptographic signature.'
      });
    }

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
      const isComboItem = Boolean(
        item.isCombo ||
        (item.category && item.category === 'Combo Pack') ||
        String(item.id || item.productId).startsWith('combo-')
      );

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (isComboItem) {
        let pId = 0;
        let name = item.name || 'Combo Pack';
        let regPrice = Number(item.regularPrice || item.price || 0);
        let finalPrice = Number(item.price || item.finalPrice || 0);
        let bundledItemsJson = null;

        const rawBundled = item.bundledItems || item.items;
        if (rawBundled && Array.isArray(rawBundled) && rawBundled.length > 0) {
          bundledItemsJson = JSON.stringify(rawBundled);
        } else {
          const numericComboId = parseInt(String(item.id || item.productId).replace(/\D/g, ''), 10);
          if (numericComboId) {
            const comboRow = db.prepare('SELECT * FROM combos WHERE id = ?').get(numericComboId);
            if (comboRow) {
              pId = comboRow.id;
              name = comboRow.name;
              regPrice = Number(comboRow.regularPrice || comboRow.comboPrice);
              finalPrice = Number(comboRow.comboPrice);

              const comboItemsFromDb = db.prepare(`
                SELECT ci.quantity, ci.customItemName, p.name as productName 
                FROM combo_items ci
                LEFT JOIN products p ON ci.productId = p.id
                WHERE ci.comboId = ?
              `).all(numericComboId);

              if (comboItemsFromDb.length > 0) {
                const list = comboItemsFromDb.map(c => ({
                  name: c.productName || c.customItemName || 'Item',
                  quantity: c.quantity || 1
                }));
                bundledItemsJson = JSON.stringify(list);
              }
            }
          }
        }

        const itemRegularSubtotal = regPrice * qty;
        const itemFinalSubtotal = finalPrice * qty;
        const itemDiscount = Math.max(0, itemRegularSubtotal - itemFinalSubtotal);

        subtotal += itemFinalSubtotal;
        totalDiscount += itemDiscount;

        verifiedItems.push({
          productId: pId,
          name: name.startsWith('🎁') ? name : `🎁 ${name}`,
          quantity: qty,
          regularPrice: regPrice,
          salePrice: finalPrice < regPrice ? finalPrice : null,
          finalPrice: finalPrice,
          lineTotal: itemFinalSubtotal,
          isCombo: 1,
          bundledItems: bundledItemsJson
        });
      } else {
        const pId = Number(item.productId || item.id);
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
            lineTotal: itemFinalSubtotal,
            isCombo: 0,
            bundledItems: null
          });
        }
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
        subtotal, discount, total, status, notes, isSundaySaleOrder, createdAt, userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?, ?, ?, ?)
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
      now,
      bodyUserId || null
    );

    const orderId = orderResult.lastInsertRowid;

    // Insert Order Items
    const itemInsert = db.prepare(`
      INSERT INTO order_items (
        orderId, productId, productNameSnapshot, quantity, regularPrice, salePrice, finalPrice, isCombo, bundledItems
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const it of verifiedItems) {
      itemInsert.run(
        orderId,
        it.productId,
        it.name,
        it.quantity,
        it.regularPrice,
        it.salePrice,
        it.finalPrice,
        it.isCombo ? 1 : 0,
        it.bundledItems || null
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
  } catch (err) {
    console.error('[Payment] Error verifying payment:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Server error verifying payment.'
    });
  }
});

export default router;
