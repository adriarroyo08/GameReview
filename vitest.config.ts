import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [], // We might add setup files later
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
