import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined // Упрощаем - пусть Vite сам решает
      }
    }
  },
  // Правильная настройка для SPA роутинга в dev режиме
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 3000,
    open: true
  }
}) 