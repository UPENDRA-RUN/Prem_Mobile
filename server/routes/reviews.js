import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import { broadcastEvent } from '../events.js';

const router = express.Router();

// GET /api/reviews/product/:productId - Get approved reviews and rating summary for a product
router.get('/product/:productId', (req, res) => {
  try {
    const productId = Number(req.params.productId);
    if (!productId || isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const reviews = db.prepare(`
      SELECT id, productId, customerName, customerEmail, rating, comment, photoUrl, status, createdAt
      FROM reviews
      WHERE productId = ? AND status = 'APPROVED'
      ORDER BY datetime(createdAt) DESC
    `).all(productId);

    // Compute average rating and distribution breakdown
    const totalCount = reviews.length;
    const totalRatingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalCount > 0 ? Number((totalRatingSum / totalCount).toFixed(1)) : 5.0;

    const breakdown = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    return res.json({
      success: true,
      data: {
        reviews,
        summary: {
          averageRating,
          totalCount,
          breakdown
        }
      }
    });
  } catch (err) {
    console.error('[REVIEWS] Error fetching product reviews:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews - Submit a new review
router.post('/', (req, res) => {
  try {
    const { productId, customerName, customerEmail, rating, comment, photoUrl } = req.body;

    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, customer name, rating (1-5), and feedback comment are required.'
      });
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating)));
    const now = new Date().toISOString();

    const result = db.prepare(`
      INSERT INTO reviews (productId, customerName, customerEmail, rating, comment, photoUrl, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, 'APPROVED', ?)
    `).run(
      Number(productId),
      customerName.trim(),
      customerEmail ? customerEmail.trim() : null,
      numericRating,
      comment.trim(),
      photoUrl ? photoUrl.trim() : null,
      now
    );

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);

    // Broadcast SSE update event
    broadcastEvent('REVIEWS_UPDATED', { type: 'NEW_REVIEW', reviewId: newReview.id, productId });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your review! It is now live.',
      data: newReview
    });
  } catch (err) {
    console.error('[REVIEWS] Error submitting review:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

// GET /api/reviews/admin - Get all reviews across products for admin moderation
router.get('/admin', requireAdmin, (req, res) => {
  try {
    const reviews = db.prepare(`
      SELECT r.*, p.name as productName, p.images as productImages, p.category as productCategory
      FROM reviews r
      LEFT JOIN products p ON r.productId = p.id
      ORDER BY datetime(r.createdAt) DESC
    `).all();

    const formattedReviews = reviews.map(r => {
      let productImages = [];
      try {
        productImages = JSON.parse(r.productImages);
      } catch (e) {
        productImages = [r.productImages];
      }
      return {
        ...r,
        productImage: productImages[0] || '/images/prem-main.jpg'
      };
    });

    const stats = {
      total: formattedReviews.length,
      approved: formattedReviews.filter(r => r.status === 'APPROVED').length,
      pending: formattedReviews.filter(r => r.status === 'PENDING').length,
      rejected: formattedReviews.filter(r => r.status === 'REJECTED').length,
      avgRating: formattedReviews.length > 0
        ? (formattedReviews.reduce((acc, r) => acc + r.rating, 0) / formattedReviews.length).toFixed(1)
        : 5.0
    };

    return res.json({
      success: true,
      data: {
        reviews: formattedReviews,
        stats
      }
    });
  } catch (err) {
    console.error('[REVIEWS] Error fetching admin reviews:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin reviews' });
  }
});

// PUT /api/reviews/admin/:id/status - Update review moderation status
router.put('/admin/:id/status', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!['APPROVED', 'PENDING', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run(status, id);

    broadcastEvent('REVIEWS_UPDATED', { type: 'STATUS_CHANGED', reviewId: id, status });

    return res.json({
      success: true,
      message: `Review status updated to ${status}`
    });
  } catch (err) {
    console.error('[REVIEWS] Error updating status:', err);
    return res.status(500).json({ success: false, message: 'Failed to update review status' });
  }
});

// DELETE /api/reviews/admin/:id - Delete a review
router.delete('/admin/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);

    broadcastEvent('REVIEWS_UPDATED', { type: 'REVIEW_DELETED', reviewId: id });

    return res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (err) {
    console.error('[REVIEWS] Error deleting review:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

export default router;
