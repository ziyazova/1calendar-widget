import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          styled: ['styled-components']
        }
      }
    }
  },
  // Обеспечиваем правильную работу SPA роутинга в dev режиме
  server: {
    historyApiFallback: true
  },
  // Настройки для production
  base: './',
  preview: {
    port: 3000
  }
}) 