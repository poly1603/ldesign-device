/**
 * @ldesign/device-core 构建配置
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  input: {
    index: 'src/index.ts',
    'core/index': 'src/core/index.ts',
    'modules/index': 'src/modules/index.ts',
    'types/index': 'src/types/index.ts',
    'utils/index': 'src/utils/index.ts',
  },

  output: {
    format: ['esm', 'cjs', 'umd'],
    esm: { dir: 'es', preserveStructure: true },
    cjs: { dir: 'lib', preserveStructure: true },
    umd: { dir: 'dist', name: 'LDesignDeviceCore', minify: true },
  },

  dts: true,
  external: [],
  clean: true,
  sourcemap: false,
})
