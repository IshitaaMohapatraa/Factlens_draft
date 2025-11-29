import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Changed from 3000 to avoid conflict with backend
    open: true,
    proxy: {
      // Proxy API requests to backend (uses PORT from backend .env, default 5000)
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})

