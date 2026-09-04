import express from 'express';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import saleRoutes from './routes/sale.js';
import sundaySaleRoutes from './routes/sundaySale.js';
import orderRoutes from './routes/orders.js';
import settingRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import categoryRoutes from './routes/categories.js';

export function createApiRouter() {
  const app = express();

  // Enable CORS middleware (handles both trailing slash and non-trailing slash origins)
  app.use((req, res, next) => {
    const allowedOrigin = process.env.CORS_ORIGIN || '*';
    const cleanAllowed = allowedOrigin.replace(/\/$/, '');
    const reqOrigin = (req.headers.origin || '').replace(/\/$/, '');

    if (allowedOrigin === '*' || reqOrigin === cleanAllowed) {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: '30mb' }));

  // Mount API modules
  app.use('/auth', authRoutes);
  app.use('/products', productRoutes);
  app.use('/upload', uploadRoutes);
  app.use('/sale', saleRoutes);
  app.use('/sunday-sale', saleRoutes); // Alias for seamless backward compatibility
  app.use('/orders', orderRoutes);
  app.use('/settings', settingRoutes);
  app.use('/categories', categoryRoutes);

  // Health check endpoint for UptimeRobot keep-alive ping
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  return app;
}

export default createApiRouter;
