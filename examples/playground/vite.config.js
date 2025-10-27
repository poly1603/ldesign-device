import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3004,
    open: true
  },
  build: {
    target: 'es2015',
    outDir: 'dist'
  }
})


