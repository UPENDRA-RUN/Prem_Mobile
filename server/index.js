import express from 'express';
import fs from 'fs';
import path from 'path';
import createApiRouter from './apiRouter.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Serve uploads & public directory statically
const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
const publicDir = path.resolve(process.cwd(), 'public');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir));
}
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

app.use('/api', createApiRouter());

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');

  if (fs.existsSync(indexHtmlPath)) {
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(indexHtmlPath);
    });
  } else {
    // API Server Standalone fallback when frontend is hosted on Vercel
    app.use((req, res) => {
      res.json({
        status: 'online',
        service: 'Prem Mobile Express API Server',
        healthCheck: '/api/health',
        frontendUrl: process.env.CORS_ORIGIN || 'https://prem-mobile-kappa.vercel.app'
      });
    });
  }
}

if (process.argv[1] && process.argv[1].endsWith('server/index.js')) {
  app.listen(PORT, () => {
    console.log(`[Prem Mobile Server] Running on http://localhost:${PORT}`);
  });
}

export default app;
