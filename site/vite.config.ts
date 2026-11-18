import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Examples import the pieces the way a project that ran `add` does.
      '@/components/ui': fileURLToPath(new URL('../src/components', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // The pieces live outside site/: force one copy of each package (from site/node_modules).
    dedupe: ['react', 'react-dom', 'clsx', 'lucide-react'],
  },
})
