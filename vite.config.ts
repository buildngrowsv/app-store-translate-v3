import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
  },
  preview: {
    port: 5174,
  },
  define: {
    // This allows Stripe to work in development
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});
