import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs'],
    esm: {
      dir: 'es',
    },
    cjs: {
      dir: 'lib',
    },
    name: 'LDesignDeviceCore',
  },
  minify: true,
  sourcemap: true,
  dts: true,
  clean: true,
})


