/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command, mode, isPreview }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  const base = command === 'build' || isPreview ? env.VITE_BASE || '/chordpath/' : '/'

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['apple-touch-icon.png'],
        manifest: {
          name: 'chordpath',
          short_name: 'chordpath',
          display: 'standalone',
          theme_color: '#1a1a2e',
          background_color: '#1a1a2e',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
      }),
    ],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/ui/setup-tests.ts'],
      globals: true,
    },
  }
})
