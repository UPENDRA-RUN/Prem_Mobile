import createApiRouter from './apiRouter.js';

export default function apiPlugin() {
  const apiApp = createApiRouter();

  return {
    name: 'prem-mobile-api',
    configureServer(server) {
      // Mount express app on Vite's internal Connect middleware pipeline
      server.middlewares.use('/api', (req, res, next) => {
        // Delegate to Express app
        apiApp(req, res, next);
      });
      console.log('[API Plugin] Express API mounted at /api');
    }
  };
}
