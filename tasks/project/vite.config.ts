import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/vite/',
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'dist/vite',
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        entryFileNames: '[name]_[hash].js',
        chunkFileNames: '[name]_[hash].js',
        assetFileNames: '[name]_[hash][extname]',
      },
    },
  },
})
