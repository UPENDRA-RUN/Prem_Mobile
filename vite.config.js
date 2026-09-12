import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import apiPlugin from './server/apiPlugin.js';

export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    port: 5173,
    open: false
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const normalizedId = id.replace(/\\/g, '/');
            if (
              normalizedId.includes('/node_modules/react/') ||
              normalizedId.includes('/node_modules/react-dom/') ||
              normalizedId.includes('/node_modules/react-router-dom/') ||
              normalizedId.includes('/node_modules/scheduler/')
            ) {
              return 'vendor-react';
            }
            if (normalizedId.includes('/node_modules/lucide-react/')) {
              return 'vendor-icons';
            }
            if (normalizedId.includes('/node_modules/framer-motion/')) {
              return 'vendor-motion';
            }
            if (
              normalizedId.includes('/node_modules/@react-pdf/') ||
              normalizedId.includes('/node_modules/jspdf/') ||
              normalizedId.includes('/node_modules/html2canvas/')
            ) {
              return 'vendor-pdf';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
