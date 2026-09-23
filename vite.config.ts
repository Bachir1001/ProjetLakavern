import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/woo-api': {
        target: 'https://lakavernshop.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/woo-api/, '/wp-json/wc/store/v1'),
      },
    },
  },
})