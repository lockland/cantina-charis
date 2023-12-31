import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../dist/views"
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    }
  },
  plugins: [react()],
})
