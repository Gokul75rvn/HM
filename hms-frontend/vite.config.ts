import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@types': path.resolve(__dirname, './src/types'),
      '@routes': path.resolve(__dirname, './src/routes'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
