import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = express.Router();

/**
 * GET /api/analytics/admin
 * Aggregates real-time e-commerce metrics from SQLite database.
 */
router.get('/admin', requireAdmin, (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayDate = new Date(Date.now() - 86400000);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);

    // 1. ORDERS SUMMARY & REVENUE METRICS
    const orderStats = db.prepare(`
      SELECT 
        COUNT(*) as totalOrders,
        COALESCE(SUM(total), 0) as totalRevenue,
        COALESCE(SUM(discount), 0) as totalDiscounts,
        COALESCE(AVG(total), 0) as aov
      FROM orders
    `).get();

    // 2. TODAY & YESTERDAY REVENUE
    const todayStats = db.prepare(`
      SELECT 
        COUNT(*) as todayOrders,
        COALESCE(SUM(total), 0) as todayRevenue
      FROM orders
      WHERE createdAt LIKE ?
    `).get(`${todayStr}%`);

    const yesterdayStats = db.prepare(`
      SELECT 
        COUNT(*) as yesterdayOrders,
        COALESCE(SUM(total), 0) as yesterdayRevenue
      FROM orders
      WHERE createdAt LIKE ?
    `).get(`${yesterdayStr}%`);

    // 3. ORDER STATUS BREAKDOWN
    const statusRows = db.prepare(`
      SELECT status, COUNT(*) as count, COALESCE(SUM(total), 0) as statusRevenue
      FROM orders
      GROUP BY status
    `).all();

    const statusCounts = {
      PENDING: 0,
      CONFIRMED: 0,
      DELIVERED: 0,
      CANCELLED: 0
    };
    for (const row of statusRows) {
      if (statusCounts[row.status] !== undefined) {
        statusCounts[row.status] = row.count;
      }
    }

    const deliveredCount = statusCounts.DELIVERED || 0;
    const cancelledCount = statusCounts.CANCELLED || 0;
    const totalFinished = deliveredCount + cancelledCount;
    const fulfillmentRate = totalFinished > 0 ? Math.round((deliveredCount / totalFinished) * 100) : 100;

    // 4. SUNDAY SALE ORDERS VS REGULAR ORDERS
    const sundaySaleOrderStats = db.prepare(`
      SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue
      FROM orders
      WHERE isSundaySaleOrder = 1
    `).get();

    // 5. REGISTERED CUSTOMERS METRICS
    let registeredUsersCount = 0;
    try {
      const userCheck = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "CUSTOMER"').get();
      registeredUsersCount = userCheck ? userCheck.count : 0;
    } catch (e) {
      registeredUsersCount = 0;
    }

    // 6. TOP SPENDING CUSTOMERS (LEADERBOARD)
    const topCustomers = db.prepare(`
      SELECT 
        customerName as name,
        mobile,
        email,
        COUNT(id) as totalOrders,
        SUM(total) as totalSpent,
        MAX(createdAt) as lastOrderDate
      FROM orders
      GROUP BY mobile, email
      ORDER BY totalSpent DESC
      LIMIT 6
    `).all();

    // 7. TOP SELLING PRODUCTS
    const topProducts = db.prepare(`
      SELECT 
        oi.productId,
        oi.productNameSnapshot as name,
        SUM(oi.quantity) as unitsSold,
        SUM(oi.finalPrice * oi.quantity) as totalRevenue,
        p.images,
        p.category,
        p.stock
      FROM order_items oi
      LEFT JOIN products p ON oi.productId = p.id
      GROUP BY oi.productId
      ORDER BY unitsSold DESC, totalRevenue DESC
      LIMIT 6
    `).all().map(item => {
      let image = '/images/placeholder.jpg';
      if (item.images) {
        try {
          const parsed = JSON.parse(item.images);
          if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
        } catch (e) {
          if (typeof item.images === 'string') image = item.images;
        }
      }
      return {
        id: item.productId,
        name: item.name,
        unitsSold: item.unitsSold,
        revenue: item.totalRevenue,
        category: item.category || 'General',
        stock: item.stock !== null && item.stock !== undefined ? item.stock : 0,
        image
      };
    });

    // 8. CATEGORY PERFORMANCE DISTRIBUTION
    const categoryStats = db.prepare(`
      SELECT 
        COALESCE(p.category, 'Other') as categoryName,
        SUM(oi.quantity) as unitsSold,
        SUM(oi.finalPrice * oi.quantity) as revenue
      FROM order_items oi
      LEFT JOIN products p ON oi.productId = p.id
      GROUP BY p.category
      ORDER BY revenue DESC
    `).all();

    // 9. LOW STOCK & OUT OF STOCK ALERTS (Stock <= 5)
    const lowStockProducts = db.prepare(`
      SELECT id, name, category, regularPrice, offerPrice, stock, images
      FROM products
      WHERE isActive = 1 AND stock <= 5
      ORDER BY stock ASC
      LIMIT 8
    `).all().map(p => {
      let image = '/images/placeholder.jpg';
      try {
        const parsed = JSON.parse(p.images);
        if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
      } catch (e) {
        image = p.images || image;
      }
      return { ...p, image };
    });

    // 10. TOTAL PRODUCTS & ACTIVE INVENTORY STATS
    const productStats = db.prepare(`
      SELECT 
        COUNT(*) as totalCatalogProducts,
        SUM(CASE WHEN isActive = 1 THEN 1 ELSE 0 END) as activeCatalogProducts,
        SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as outOfStockCount
      FROM products
    `).get();

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        financials: {
          totalRevenue: orderStats.totalRevenue,
          todayRevenue: todayStats.todayRevenue,
          yesterdayRevenue: yesterdayStats.yesterdayRevenue,
          totalDiscounts: orderStats.totalDiscounts,
          aov: Math.round(orderStats.aov)
        },
        orders: {
          totalOrders: orderStats.totalOrders,
          todayOrders: todayStats.todayOrders,
          statusCounts,
          fulfillmentRate,
          sundaySaleOrdersCount: sundaySaleOrderStats.count,
          sundaySaleRevenue: sundaySaleOrderStats.revenue
        },
        customers: {
          registeredUsersCount,
          topCustomers
        },
        inventory: {
          totalCatalogProducts: productStats.totalCatalogProducts || 0,
          activeCatalogProducts: productStats.activeCatalogProducts || 0,
          outOfStockCount: productStats.outOfStockCount || 0,
          lowStockProducts
        },
        topProducts,
        categoryStats
      }
    });
  } catch (err) {
    console.error('[Analytics] Error fetching admin metrics:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate metrics report: ' + err.message
    });
  }
});

export default router;
