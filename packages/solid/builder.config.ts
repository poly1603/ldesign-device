import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs'],
    dir: {
      esm: 'es',
      cjs: 'lib',
    },
    name: 'LDesignDeviceSolid',
  },
  external: [
    'solid-js',
    'solid-js/web',
    '@ldesign/device-core',
    '@ldesign/device-battery',
    '@ldesign/device-network',
  ],
  minify: false,
  sourcemap: true,
  dts: true,
  clean: true,
})

