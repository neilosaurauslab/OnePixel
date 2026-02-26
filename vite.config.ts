import { defineConfig } from 'vite';

export default defineConfig({
  base: '/OnePixel/',
  server: {
    port: 8080,
    open: false,
  },
  build: {
    target: 'esnext',
  },
});
