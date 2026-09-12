export default function apiPlugin() {
  return {
    name: 'prem-mobile-api',
    async configureServer(server) {
      const { createApiRouter } = await import('./apiRouter.js');
      const apiApp = createApiRouter();

      // Mount express app on Vite's internal Connect middleware pipeline
      server.middlewares.use('/api', (req, res, next) => {
        // Delegate to Express app
        apiApp(req, res, next);
      });
      console.log('[API Plugin] Express API mounted at /api');
    }
  };
}

