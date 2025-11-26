/**
 * @ldesign/device-vue Builder Configuration
 */
import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  // 输入配置
  entry: 'src/index.ts',

  // 输出配置 - TDesign 风格
  output: {
    // ES 模块
    es: {
      dir: 'es',
      sourcemap: true,
    },

    // ESM 模块
    esm: {
      dir: 'esm',
      sourcemap: true,
    },

    // CJS 模块
    cjs: {
      dir: 'cjs',
      sourcemap: true,
    },

    // UMD 模块 - 禁用
    umd: {
      enabled: false,
    },
  },

  // 外部依赖
  external: ['vue', '@ldesign/device-core', '@ldesign/shared', 'tslib'],

  // 全局变量映射 (UMD 使用)
  globals: {
    vue: 'Vue',
    '@ldesign/device-core': 'LDesignDeviceCore',
  },

  // 库类型 - 支持 Vue 3
  libraryType: 'vue3',

  // 打包器
  bundler: 'rollup',

  // 类型声明
  dts: {
    enabled: true,
  },
})

