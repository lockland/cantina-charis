import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Em desenvolvimento: use VITE_PROXY_TARGET para acessar o backend por IP/rede
// Ex.: VITE_PROXY_TARGET=http://192.168.1.10:8080 yarn dev
const proxyTarget = process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../dist/views"
  },
  server: {
    host: true,
    proxy: {
      '/api': proxyTarget,
      '/ws': {
        target: proxyTarget,
        ws: true,
      },
    },
  },
  plugins: [react()],
})
