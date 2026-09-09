import express from 'express';
import { db } from '../db.js';
import { requireAdmin, verifyToken } from '../auth.js';
import { resolveServerProductPrice } from '../saleLogic.js';
import { broadcastEvent } from '../events.js';

const router = express.Router();

// Public: POST /api/orders (Customer places order)
router.post('/', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const payload = token ? verifyToken(token) : null;

    const {
      customerName,
      mobile,
      email,
      address,
      city,
      state,
      pincode,
      items, // array of { productId, quantity }
      notes,
      userId: bodyUserId,
      couponCode
    } = req.body || {};

    const resolvedUserId = payload?.userId || bodyUserId || null;

    // Form validations
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, error: 'Customer name is required' });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, error: 'Mobile number is required' });
    }
    // Mobile format validation (min 10 digits)
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit mobile number' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ success: false, error: 'Delivery / pickup address is required' });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, error: 'City is required' });
    }
    if (!state || !state.trim()) {
      return res.status(400).json({ success: false, error: 'State is required' });
    }
    if (!pincode || !pincode.trim()) {
      return res.status(400).json({ success: false, error: 'Pincode is required' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty. Please add products to order.' });
    }

    let subtotal = 0;
    let totalDiscount = 0;
    let isSundaySaleOrder = false;

    const verifiedItems = [];

    // SERVER-SIDE PRICE AND STOCK VERIFICATION
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
        if (!serverPriceInfo) {
          return res.status(400).json({
            success: false,
            error: `Product #${pId} is unavailable or out of stock.`
          });
        }

        const regPrice = serverPriceInfo.regularPrice;
        const finalPrice = serverPriceInfo.finalUnitPrice;
        const salePrice = serverPriceInfo.isSundaySalePrice ? serverPriceInfo.salePrice : null;

        if (serverPriceInfo.isSundaySalePrice) {
          isSundaySaleOrder = true;
        }

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

    // Process Coupon Discount if provided
    let couponDiscountAmount = 0;
    if (couponCode) {
      const cleanCoupon = String(couponCode).trim().toUpperCase();
      const couponRecord = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = ? AND isActive = 1').get(cleanCoupon);
      if (couponRecord) {
        const today = new Date().toISOString().split('T')[0];
        const isExpired = couponRecord.expiryDate && couponRecord.expiryDate < today;
        const isLimitReached = couponRecord.usageLimit && couponRecord.timesUsed >= couponRecord.usageLimit;
        const minOrder = Number(couponRecord.minOrderAmount || 0);

        if (!isExpired && !isLimitReached && (minOrder === 0 || subtotal >= minOrder)) {
          if (couponRecord.type === 'PERCENT') {
            couponDiscountAmount = Math.round((subtotal * Number(couponRecord.value)) / 100);
            if (couponRecord.maxDiscountAmount && couponDiscountAmount > Number(couponRecord.maxDiscountAmount)) {
              couponDiscountAmount = Number(couponRecord.maxDiscountAmount);
            }
          } else if (couponRecord.type === 'FLAT') {
            couponDiscountAmount = Math.min(subtotal, Number(couponRecord.value));
          }
          db.prepare('UPDATE coupons SET timesUsed = timesUsed + 1 WHERE id = ?').run(couponRecord.id);
          totalDiscount += couponDiscountAmount;
          broadcastEvent('COUPONS_UPDATED');
        }
      }
    }

    const finalTotal = Math.max(0, subtotal - couponDiscountAmount);
    const orderNumber = 'PM-' + Date.now().toString().slice(-6) + '-' + Math.floor(100 + Math.random() * 900);
    const now = new Date().toISOString();

    // Create Order in DB
    const orderInsert = db.prepare(`
      INSERT INTO orders (
        orderNumber, customerName, mobile, email, address, city, state, pincode,
        subtotal, discount, total, status, notes, isSundaySaleOrder, createdAt, userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?)
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
      notes ? notes.trim() : '',
      isSundaySaleOrder ? 1 : 0,
      now,
      resolvedUserId
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

    broadcastEvent('ORDERS_UPDATED');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        id: orderId,
        orderNumber,
        customerName: customerName.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        subtotal,
        discount: totalDiscount,
        total: finalTotal,
        isSundaySaleOrder,
        items: verifiedItems,
        createdAt: now
      }
    });
  } catch (err) {
    console.error('[Orders] Error creating order:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to place order due to a server error.'
    });
  }
});

// Customer: GET /api/orders/my-orders
router.get('/my-orders', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const payload = token ? verifyToken(token) : null;
  const queryMobile = req.query.mobile ? String(req.query.mobile).replace(/\D/g, '') : null;
  const queryEmail = req.query.email ? String(req.query.email).trim().toLowerCase() : null;

  let query = 'SELECT * FROM orders WHERE 1=0';
  const params = [];

  if (payload && payload.userId) {
    query = 'SELECT * FROM orders WHERE userId = ? OR email = ? OR mobile = ? ORDER BY id DESC';
    params.push(payload.userId, payload.email || '', payload.mobile || '');
  } else if (queryMobile || queryEmail) {
    query = 'SELECT * FROM orders WHERE (mobile = ? OR email = ?) ORDER BY id DESC';
    params.push(queryMobile || '', queryEmail || '');
  } else {
    return res.status(401).json({ success: false, error: 'Authentication required to view orders' });
  }

  const orders = db.prepare(query).all(...params);
  const fullOrders = orders.map(order => {
    const items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id);
    return { ...order, items };
  });

  res.json({
    success: true,
    orders: fullOrders
  });
});

// Admin: GET /api/admin/orders
router.get('/admin', requireAdmin, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();

  const fullOrders = orders.map(order => {
    const items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id);
    return {
      ...order,
      items
    };
  });

  res.json({
    success: true,
    orders: fullOrders
  });
});

// Admin: PUT /api/admin/orders/:id/status
router.put('/admin/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  const validStatuses = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid order status' });
  }

  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);

  broadcastEvent('ORDERS_UPDATED', {
    orderId: existing.id,
    orderNumber: existing.orderNumber,
    customerName: existing.customerName,
    mobile: existing.mobile,
    email: existing.email,
    userId: existing.userId,
    city: existing.city || 'Gwalior',
    status: status
  });

  res.json({
    success: true,
    message: 'Order status updated successfully'
  });
});

// Admin: DELETE /api/admin/orders/purge-all (Purge all orders)
router.delete('/admin/purge-all', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM order_items').run();
  db.prepare('DELETE FROM orders').run();

  broadcastEvent('ORDERS_UPDATED');

  res.json({
    success: true,
    message: 'All store orders purged successfully'
  });
});

// Customer: GET /api/orders/my-orders?mobile=xxx&email=xxx
router.get('/my-orders', (req, res) => {
  const { mobile, email } = req.query || {};
  const cleanMobile = (mobile || '').replace(/\D/g, '');
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanMobile && !cleanEmail) {
    return res.json({ success: true, orders: [] });
  }

  const orders = db.prepare(`
    SELECT * FROM orders 
    WHERE (length(?) > 0 AND replace(mobile, '-', '') LIKE ?) 
       OR (length(?) > 0 AND lower(email) = ?) 
    ORDER BY id DESC
  `).all(cleanMobile, `%${cleanMobile}%`, cleanEmail, cleanEmail);

  const fullOrders = orders.map(order => {
    const items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id);
    return {
      ...order,
      items
    };
  });

  res.json({
    success: true,
    orders: fullOrders
  });
});

// Admin: DELETE /api/orders/admin/purge-all (Purge all orders)
router.delete('/admin/purge-all', requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM order_items').run();
    db.prepare('DELETE FROM orders').run();
    broadcastEvent('ORDERS_UPDATED');

    res.json({
      success: true,
      message: 'All store orders purged successfully.'
    });
  } catch (err) {
    console.error('Error purging orders:', err);
    res.status(500).json({ success: false, error: 'Failed to purge orders' });
  }
});

export default router;
