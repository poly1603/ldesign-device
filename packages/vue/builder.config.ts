import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs'],
    dir: {
      esm: 'es',
      cjs: 'lib',
    },
    name: 'LDesignDeviceVue',
  },
  external: [
    'vue',
    '@ldesign/device-core',
    '@ldesign/device-battery',
    '@ldesign/device-network',
  ],
  minify: false,
  sourcemap: true,
  dts: true,
  clean: true,
})

