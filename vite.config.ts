import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'animations'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'ui'
          }
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod')) {
            return 'forms'
          }
        },
      },
    },
  },
})
