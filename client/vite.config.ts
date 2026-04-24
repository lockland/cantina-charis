import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../dist/views",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Mantine v7: manter @mantine + react no mesmo chunk; acrescentar postcss-preset-mantine no client.
            // React and Mantine must stay in the same chunk (Mantine uses React.forwardRef)
            if (
              id.includes('@mantine') ||
              id.includes('@emotion') ||
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('react/')
            ) {
              return 'vendor'
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.API_PORT || 8080}`,
        ws: true,
      },
    },
  },
  plugins: [react()],
})
