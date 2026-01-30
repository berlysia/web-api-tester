import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const certsExist =
  fs.existsSync('./certs/key.pem') && fs.existsSync('./certs/cert.pem');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/web-api-tester/',
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
