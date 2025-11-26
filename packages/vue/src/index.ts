/**
 * @ldesign/device-vue
 * Vue 3 integration for device detection
 *
 * @packageDocumentation
 */

// ==================== 插件 ====================
export { createDevicePlugin } from './plugin'
export type { DevicePluginOptions } from './plugin'

// Engine 插件
export { createDeviceEnginePlugin, devicePlugin } from './plugins'
export type { DeviceEnginePluginOptions } from './plugins'

// ==================== Composables ====================
export { useDevice } from './composables/useDevice'
export { useBattery } from './composables/useBattery'
export { useNetwork } from './composables/useNetwork'
export { useGeolocation } from './composables/useGeolocation'
export { useOrientation } from './composables/useOrientation'
export { useBreakpoints } from './composables/useBreakpoints'
export { useClipboard } from './composables/useClipboard'
export { useMediaCapabilities } from './composables/useMediaCapabilities'
export { useOrientationLock } from './composables/useOrientationLock'
export { useVibration } from './composables/useVibration'
export { useWakeLock } from './composables/useWakeLock'

export type {
  UseDeviceOptions,
  UseDeviceReturn,
} from './composables/useDevice'

// ==================== 组件 ====================
export { default as DeviceInfo } from './components/DeviceInfo.vue'
export { default as NetworkStatus } from './components/NetworkStatus.vue'

// ==================== 指令 ====================
export { vDevice } from './directives/vDevice'
export { vBattery } from './directives/vBattery'
export { vNetwork } from './directives/vNetwork'
export { vOrientation } from './directives/vOrientation'

// ==================== 常量 ====================
export { DEVICE_INJECTION_KEY } from './constants'

// ==================== 类型 ====================
// 从 core 包重新导出常用类型
export type {
  DeviceType,
  Orientation,
  DeviceInfo,
  DeviceDetectorOptions,
  NetworkInfo,
  BatteryInfo,
  GeolocationInfo,
} from '@ldesign/device-core'

// ==================== 版本信息 ====================
export const VERSION = '1.0.0'
