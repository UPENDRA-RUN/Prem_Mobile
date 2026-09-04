import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import { resolveServerProductPrice } from '../saleLogic.js';
import { broadcastEvent } from '../events.js';

const router = express.Router();


// Public: POST /api/orders (Customer places order)
router.post('/', (req, res) => {
  const {
    customerName,
    mobile,
    email,
    address,
    city,
    state,
    pincode,
    items, // array of { productId, quantity }
    notes
  } = req.body || {};

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
    const pId = Number(item.productId || item.id);
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

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
      lineTotal: itemFinalSubtotal
    });
  }

  const finalTotal = subtotal;
  const orderNumber = 'PM-' + Date.now().toString().slice(-6) + '-' + Math.floor(100 + Math.random() * 900);
  const now = new Date().toISOString();

  // Create Order in DB
  const orderInsert = db.prepare(`
    INSERT INTO orders (
      orderNumber, customerName, mobile, email, address, city, state, pincode,
      subtotal, discount, total, status, notes, isSundaySaleOrder, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?)
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

  const existing = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);

  broadcastEvent('ORDERS_UPDATED');

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

export default router;
