/**
 * Vue 3 组合式 API 集合
 *
 * 提供了一系列用于设备检测和状态监听的组合式函数
 */

// 电池状态检测
export { useBattery } from './useBattery'

// 响应式断点管理
export { useBreakpoints } from './useBreakpoints'

export type { BreakpointConfig } from './useBreakpoints'

// 设备检测相关
export { useDevice, useNetwork } from './useDevice'

// 地理位置检测
export { useGeolocation } from './useGeolocation'
// 屏幕方向检测
export { useOrientation } from './useOrientation'

// 新增：媒体能力检测
export { useMediaCapabilities } from './useMediaCapabilities'

// 新增：屏幕常亮控制
export { useWakeLock } from './useWakeLock'

// 新增：振动控制
export { useVibration } from './useVibration'

// 新增：剪贴板操作
export { useClipboard } from './useClipboard'

// 新增：屏幕方向锁定
export { useOrientationLock } from './useOrientationLock'