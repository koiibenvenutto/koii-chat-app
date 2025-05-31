import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs' // Use node: prefix for built-in modules

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('.cert/key.pem'),
      cert: fs.readFileSync('.cert/cert.pem'),
    },
    port: 5173,
    strictPort: true, // Force this exact port - don't try others if busy
    host: 'localhost',
    cors: {
      origin: ['https://www.koiib.com', 'https://koiib.com'],
      methods: ['GET', 'OPTIONS', 'POST'],
      allowedHeaders: ['Content-Type', 'Origin'],
      credentials: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    manifest: true,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      // Make sure to export the manifest to the root directory
      output: {
        // Copy the manifest to the root directory as well
        // Prevents naming with hash, making it predictable
        manualChunks: undefined
      }
    }
  }
})
