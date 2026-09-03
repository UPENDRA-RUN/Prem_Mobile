import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { requireAdmin } from '../auth.js';

const router = express.Router();

/**
 * POST /api/upload
 * Uploads an image (or multiple images) from device as base64 data URL.
 * Saves the file directly to public/uploads/ and returns the web-accessible URL.
 */
router.post('/', requireAdmin, (req, res) => {
  try {
    const { dataUrl, filename = 'product.jpg', images } = req.body;

    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const itemsToProcess = [];
    if (Array.isArray(images) && images.length > 0) {
      itemsToProcess.push(...images);
    } else if (dataUrl) {
      itemsToProcess.push({ dataUrl, filename });
    }

    if (itemsToProcess.length === 0) {
      return res.status(400).json({ success: false, error: 'No image data provided.' });
    }

    const savedUrls = [];

    for (const item of itemsToProcess) {
      const rawData = item.dataUrl || item;
      if (typeof rawData !== 'string' || !rawData.includes(';base64,')) {
        // If it's already a URL, preserve it
        if (typeof rawData === 'string' && (rawData.startsWith('/') || rawData.startsWith('http'))) {
          savedUrls.push(rawData);
        }
        continue;
      }

      const [header, base64Data] = rawData.split(';base64,');
      let ext = '.jpg';
      if (header.includes('png')) ext = '.png';
      else if (header.includes('webp')) ext = '.webp';
      else if (header.includes('gif')) ext = '.gif';
      else if (header.includes('svg')) ext = '.svg';
      else if (header.includes('jpeg')) ext = '.jpeg';

      const originalName = (item.filename || 'product')
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 30);
      const uniqueName = `${originalName || 'product'}-${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);

      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

      // If dist/uploads exists in production, also copy there
      const distUploadsDir = path.resolve(process.cwd(), 'dist', 'uploads');
      if (fs.existsSync(distUploadsDir)) {
        try {
          fs.copyFileSync(filePath, path.join(distUploadsDir, uniqueName));
        } catch (e) {
          // ignore
        }
      }

      savedUrls.push(`/uploads/${uniqueName}`);
    }

    if (savedUrls.length === 0) {
      return res.status(400).json({ success: false, error: 'Failed to process any valid images.' });
    }

    return res.json({
      success: true,
      url: savedUrls[0],
      urls: savedUrls
    });
  } catch (err) {
    console.error('Image upload error:', err);
    return res.status(500).json({ success: false, error: 'Failed to upload image: ' + err.message });
  }
});

export default router;
