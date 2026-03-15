import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Ensures JSX transformation works on all .js and .jsx files
      include: /\.(jsx|js|ts|tsx)$/,
    }),
  ],
  server: {
    port: 3000,
    // Using 127.0.0.1 instead of localhost for Node.js 17+ compatibility
    proxy: {
      '/api': {
        target: 'https://cricketstore.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Keeps the /api prefix for your backend routes
      },
    },
  },
  // Handles JSX syntax inside .js files (common in older CRA projects)
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/, 
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  // Defines global constants to prevent "process is not defined" errors
  define: {
    'process.env': {},
  },
});