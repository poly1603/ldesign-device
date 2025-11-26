/**
 * @ldesign/device-core
 *
 * Framework-agnostic device detection core library
 *
 * 提供完整的设备检测功能，包括：
 * - 设备类型检测（移动、平板、桌面）
 * - 屏幕方向监听
 * - 浏览器和操作系统信息
 * - 扩展模块系统（电池、网络、地理位置等）
 * - 高性能事件系统
 *
 * @packageDocumentation
 */

// ==================== 核心类 ====================
export { DeviceDetector } from './core/DeviceDetector'
export { EventEmitter } from './core/EventEmitter'
export { ModuleLoader } from './core/ModuleLoader'
export { OptimizedDeviceDetector } from './core/OptimizedDeviceDetector'
export { OptimizedEventEmitter } from './core/OptimizedEventEmitter'
export { OptimizedModuleLoader } from './core/OptimizedModuleLoader'

// ==================== 模块 ====================
export { BatteryModule } from './modules/BatteryModule'
export { NetworkModule } from './modules/NetworkModule'
export { GeolocationModule } from './modules/GeolocationModule'
export { MediaModule } from './modules/MediaModule'
export { MediaCapabilitiesModule } from './modules/MediaCapabilitiesModule'
export { ClipboardModule } from './modules/ClipboardModule'
export { FeatureDetectionModule } from './modules/FeatureDetectionModule'
export { OrientationLockModule } from './modules/OrientationLockModule'
export { PerformanceModule } from './modules/PerformanceModule'
export { VibrationModule } from './modules/VibrationModule'
export { WakeLockModule } from './modules/WakeLockModule'

// ==================== 工具函数 ====================
export * from './utils'

// ==================== 类型定义 ====================
export * from './types'

// ==================== 版本信息 ====================
export const VERSION = '1.0.0'

