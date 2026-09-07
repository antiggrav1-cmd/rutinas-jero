import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // Disable workbox bundling to avoid ERR_DLOPEN_FAILED with native rollup
      // binary on Node 24 Windows. The manifest is still injected and the SW
      // is generated inline (no second rollup pass needed).
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        // Use the Workbox CDN/inline runtime so no extra rollup native pass needed
        inlineWorkboxRuntime: true
      },
      devOptions: {
        enabled: false
      },
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        id: '/',
        name: 'Rutinas Jero - PWA Asperger & TDAH',
        short_name: 'Rutinas Jero',
        description: 'Gestor de rutinas, tareas desglosadas y temporizadores visuales para Asperger y TDAH.',
        theme_color: '#0d9488',
        background_color: '#f8fafc',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/canvas-confetti/')) {
            return 'vendor-effects';
          }
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase';
          }
        }
      }
    }
  }
});
