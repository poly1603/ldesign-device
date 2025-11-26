/**
 * Vue Device 常量定义
 */
import type { InjectionKey } from 'vue'
import type { DeviceDetector } from '@ldesign/device-core'

/**
 * DeviceDetector 依赖注入 Key
 */
export const DEVICE_INJECTION_KEY: InjectionKey<DeviceDetector> = Symbol('device-detector')

/**
 * 默认全局属性名称
 */
export const DEFAULT_GLOBAL_PROPERTY_NAME = '$device'

/**
 * 默认断点配置
 */
export const DEFAULT_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
}

/**
 * 默认防抖延迟
 */
export const DEFAULT_DEBOUNCE_DELAY = 100

