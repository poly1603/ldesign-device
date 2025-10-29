import { defineConfig } from '@ldesign/launcher'

export default defineConfig({
  server: {
    port: 3100,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
})

