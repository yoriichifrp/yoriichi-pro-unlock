import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/*
  Slot de imagen del Hero.

  Si existe public/images/yoriichi-original.(png|webp|jpg|jpeg) se expone su ruta en
  __HERO_IMAGE__ durante la compilación. Así la portada usa la ilustración real sin
  lanzar peticiones que terminen en 404 cuando el archivo todavía no está.
*/
const HERO_IMAGE_CANDIDATES = [
  'yoriichi-original.webp',
  'yoriichi-original.png',
  'yoriichi-original.jpg',
  'yoriichi-original.jpeg',
];

function heroImageSlot() {
  return {
    name: 'hero-image-slot',
    config() {
      const found = HERO_IMAGE_CANDIDATES.find((file) =>
        existsSync(resolve(process.cwd(), 'public', 'images', file)),
      );

      return {
        define: {
          __HERO_IMAGE__: JSON.stringify(found ? `/images/${found}` : null),
        },
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), heroImageSlot()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8080',
    },
  },
});
