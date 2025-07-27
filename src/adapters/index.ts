// 适配器类型定义
// 自动注册适配器
import { registerAdapter } from './registry'
import { Vue3AdapterFactory } from './vue3'

export * from './types'

// 适配器注册表
export * from './registry'

// Vue3 适配器
export * from './vue3'

// 注册 Vue3 适配器
registerAdapter('vue3', new Vue3AdapterFactory())

// 导出便捷函数
export {
  registerAdapter,
  getAdapter,
  detectAdapter,
  getSupportedFrameworks,
  checkFrameworkSupport,
} from './registry'
