import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          // React core
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) {
            return 'vendor'
          }

          // Animation libraries
          if (id.includes('/node_modules/framer-motion/')) {
            return 'animations'
          }

          // Icons
          if (id.includes('/node_modules/lucide-react/')) {
            return 'ui'
          }

          // Form libraries
          if (id.includes('/node_modules/react-hook-form/') || id.includes('/node_modules/zod/')) {
            return 'forms'
          }

          // Everything else from node_modules
          return 'vendor'
        },
      },
    },
  },
})
