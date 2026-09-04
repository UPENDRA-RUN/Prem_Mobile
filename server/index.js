import express from 'express';
import createApiRouter from './apiRouter.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', createApiRouter());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  // Robust Express catch-all fallback middleware (Express 3/4/5 compatible)
  app.use((req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
  });
}

if (process.argv[1] && process.argv[1].endsWith('server/index.js')) {
  app.listen(PORT, () => {
    console.log(`[Prem Mobile Server] Running on http://localhost:${PORT}`);
  });
}

export default app;
