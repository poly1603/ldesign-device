/**
 * @ldesign/device
 * 
 * 完整的设备检测库 - 聚合所有功能模块
 * 
 * 注意：这是主包，包含原有的完整功能。
 * 新的模块化架构位于 packages/ 目录下。
 * 
 * 推荐使用模块化的子包：
 * - @ldesign/device-core - 核心功能
 * - @ldesign/device-battery - 电池检测
 * - @ldesign/device-network - 网络检测
 * - @ldesign/device-vue - Vue 3 适配
 * - @ldesign/device-react - React 18+ 适配
 * - @ldesign/device-solid - Solid.js 适配
 * 
 * @packageDocumentation
 */

// 导出原有的完整功能
export * from './core'
export * from './modules'
export * from './types'
export * from './utils'
export * from './vue'

// 版本信息
export const VERSION = '0.2.0'

// 模块化迁移提示
console.info(`
🎉 @ldesign/device v${VERSION}

📦 现已支持模块化架构！

推荐使用新的子包：
- @ldesign/device-core      核心功能
- @ldesign/device-battery    电池检测
- @ldesign/device-network    网络检测  
- @ldesign/device-vue        Vue 3 适配
- @ldesign/device-react      React 18+ 适配
- @ldesign/device-solid      Solid.js 适配

详见: packages/ 目录
`)
