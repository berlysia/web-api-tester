import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const certsExist =
  fs.existsSync('./certs/key.pem') && fs.existsSync('./certs/cert.pem');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/web-api-tester/',
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        'visual-viewport': path.resolve(
          __dirname,
          'visual-viewport/index.html'
        ),
        'visual-viewport-resizes-visual': path.resolve(
          __dirname,
          'visual-viewport/resizes-visual.html'
        ),
        'visual-viewport-resizes-content': path.resolve(
          __dirname,
          'visual-viewport/resizes-content.html'
        ),
        'visual-viewport-overlays-content': path.resolve(
          __dirname,
          'visual-viewport/overlays-content.html'
        ),
        'virtual-keyboard': path.resolve(
          __dirname,
          'virtual-keyboard/index.html'
        ),
        'viewport-keyboard': path.resolve(
          __dirname,
          'viewport-keyboard/index.html'
        ),
        'viewport-keyboard-resizes-visual': path.resolve(
          __dirname,
          'viewport-keyboard/resizes-visual.html'
        ),
        'viewport-keyboard-resizes-content': path.resolve(
          __dirname,
          'viewport-keyboard/resizes-content.html'
        ),
        'viewport-keyboard-overlays-content': path.resolve(
          __dirname,
          'viewport-keyboard/overlays-content.html'
        ),
      },
    },
  },
  server: certsExist
    ? {
        https: {
          key: fs.readFileSync('./certs/key.pem'),
          cert: fs.readFileSync('./certs/cert.pem'),
        },
        host: '0.0.0.0',
      }
    : {
        host: '0.0.0.0',
      },
});
