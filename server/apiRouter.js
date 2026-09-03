import express from 'express';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import saleRoutes from './routes/sale.js';
import sundaySaleRoutes from './routes/sundaySale.js';
import orderRoutes from './routes/orders.js';
import settingRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';

export function createApiRouter() {
  const app = express();

  app.use(express.json({ limit: '30mb' }));

  // Mount API modules
  app.use('/auth', authRoutes);
  app.use('/products', productRoutes);
  app.use('/upload', uploadRoutes);
  app.use('/sale', saleRoutes);
  app.use('/sunday-sale', saleRoutes); // Alias for seamless backward compatibility
  app.use('/orders', orderRoutes);
  app.use('/settings', settingRoutes);



  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  return app;
}

export default createApiRouter;
