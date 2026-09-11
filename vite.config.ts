import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // BUNDLE SIZE: split large, rarely-changing vendor libraries into
          // their own chunks so browsers cache them separately from app
          // code, and so `exceljs` (only needed by the admin panel's Excel
          // export) never ships in the chunk every regular visitor
          // downloads. AdminPanel itself is also lazy-loaded (see App.tsx).
          manualChunks: {
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            exceljs: ['exceljs'],
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
