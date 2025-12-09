/**
 * @ldesign/device-vue 构建配置
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  input: {
    index: 'src/index.ts',
    'components/index': 'src/components/index.ts',
    'composables/index': 'src/composables/index.ts',
    'directives/index': 'src/directives/index.ts',
    'plugins/index': 'src/plugins/index.ts',
  },

  output: {
    format: ['esm', 'cjs', 'umd'],
    esm: { dir: 'esm', preserveStructure: true },
    cjs: { dir: 'cjs', preserveStructure: true },
    umd: { dir: 'dist', name: 'LDesignDeviceVue', minify: true },
  },

  dts: true,
  external: ['vue', '@ldesign/device-core'],
  globals: { vue: 'Vue', '@ldesign/device-core': 'LDesignDeviceCore' },
  clean: true,
  sourcemap: false,
})
