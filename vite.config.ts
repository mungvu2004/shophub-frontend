import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: process.env.VITE_API_PROXY_TARGET
    ? {
        proxy: {
          '/api': {
            target: process.env.VITE_API_PROXY_TARGET,
            changeOrigin: true,
            secure: false,
          },
        },
      }
    : undefined,
})
