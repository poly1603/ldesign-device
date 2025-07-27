import type {
  DeviceChangeEvent,
  DeviceDetectionConfig,
  DeviceDetector,
  DeviceInfo,
} from '../types'
import { DEFAULT_DEVICE_CONFIG } from '../types'
import {
  debounce,
  detectDeviceType,
  getPixelRatio,
  getScreenOrientation,
  getScreenSize,
  getUserAgent,
  isTouchDevice,
} from '../utils'

/**
 * 设备检测器实现
 */
export class DeviceDetectorImpl implements DeviceDetector {
  private config: Required<DeviceDetectionConfig>
  private currentDeviceInfo: DeviceInfo | null = null
  private listeners: Array<(event: DeviceChangeEvent) => void> = []
  private resizeHandler: (() => void) | null = null
  private orientationHandler: (() => void) | null = null
  private isDestroyed = false

  constructor(config: DeviceDetectionConfig = {}) {
    this.config = { ...DEFAULT_DEVICE_CONFIG, ...config }
    this.init()
  }

  /**
   * 初始化检测器
   */
  private init(): void {
    if (typeof window === 'undefined') {
      return
    }

    // 初始化设备信息
    this.currentDeviceInfo = this.createDeviceInfo()

    // 设置事件监听器
    this.setupEventListeners()
  }

  /**
   * 创建设备信息对象
   */
  private createDeviceInfo(): DeviceInfo {
    const { width, height } = getScreenSize()
    const userAgent = getUserAgent()
    const pixelRatio = getPixelRatio()
    const isTouchDev = this.config.enableTouchDetection ? isTouchDevice() : false
    const deviceType = detectDeviceType(width, height, userAgent, this.config)
    const orientation = getScreenOrientation()

    return {
      type: deviceType,
      orientation,
      width,
      height,
      pixelRatio,
      isTouchDevice: isTouchDev,
      userAgent,
    }
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') {
      return
    }

    // 防抖处理，避免频繁触发
    const debouncedUpdate = debounce(() => {
      this.updateDeviceInfo()
    }, 100)

    // 监听窗口大小变化
    this.resizeHandler = debouncedUpdate
    window.addEventListener('resize', this.resizeHandler)

    // 监听屏幕方向变化
    this.orientationHandler = debouncedUpdate

    // 优先使用 Screen Orientation API
    if (screen.orientation) {
      screen.orientation.addEventListener('change', this.orientationHandler)
    }
 else {
      // 回退到 orientationchange 事件
      window.addEventListener('orientationchange', this.orientationHandler)
    }
  }

  /**
   * 更新设备信息
   */
  private updateDeviceInfo(): void {
    if (this.isDestroyed) {
      return
    }

    const previousInfo = this.currentDeviceInfo
    const newInfo = this.createDeviceInfo()

    // 检查是否有变化
    const changes = this.getChanges(previousInfo, newInfo)

    if (changes.length > 0) {
      this.currentDeviceInfo = newInfo

      // 触发变化事件
      const event: DeviceChangeEvent = {
        current: newInfo,
        previous: previousInfo,
        changes,
      }

      this.notifyListeners(event)
    }
  }

  /**
   * 获取变化的属性
   */
  private getChanges(
    previous: DeviceInfo | null,
    current: DeviceInfo,
  ): Array<keyof DeviceInfo> {
    if (!previous) {
      return []
    }

    const changes: Array<keyof DeviceInfo> = []
    const keys = Object.keys(current) as Array<keyof DeviceInfo>

    for (const key of keys) {
      if (previous[key] !== current[key]) {
        changes.push(key)
      }
    }

    return changes
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(event: DeviceChangeEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event)
      }
 catch (error) {
        console.error('Device change listener error:', error)
      }
    })
  }

  /**
   * 获取当前设备信息
   */
  getDeviceInfo(): DeviceInfo {
    if (!this.currentDeviceInfo) {
      this.currentDeviceInfo = this.createDeviceInfo()
    }
    return { ...this.currentDeviceInfo }
  }

  /**
   * 监听设备变化
   */
  onDeviceChange(callback: (event: DeviceChangeEvent) => void): () => void {
    this.listeners.push(callback)

    // 返回取消监听的函数
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * 销毁检测器
   */
  destroy(): void {
    if (this.isDestroyed) {
      return
    }

    this.isDestroyed = true

    // 移除事件监听器
    if (typeof window !== 'undefined') {
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler)
      }

      if (this.orientationHandler) {
        if (screen.orientation) {
          screen.orientation.removeEventListener('change', this.orientationHandler)
        }
 else {
          window.removeEventListener('orientationchange', this.orientationHandler)
        }
      }
    }

    // 清空监听器
    this.listeners = []
    this.currentDeviceInfo = null
    this.resizeHandler = null
    this.orientationHandler = null
  }
}

/**
 * 创建设备检测器实例
 */
export function createDeviceDetector(config?: DeviceDetectionConfig): DeviceDetector {
  return new DeviceDetectorImpl(config)
}

/**
 * 全局设备检测器实例
 */
let globalDetector: DeviceDetector | null = null

/**
 * 获取全局设备检测器实例
 */
export function getGlobalDeviceDetector(config?: DeviceDetectionConfig): DeviceDetector {
  if (!globalDetector) {
    globalDetector = createDeviceDetector(config)
  }
  return globalDetector
}

/**
 * 快速获取当前设备信息
 */
export function getDeviceInfo(config?: DeviceDetectionConfig): DeviceInfo {
  return getGlobalDeviceDetector(config).getDeviceInfo()
}

/**
 * 快速监听设备变化
 */
export function onDeviceChange(
  callback: (event: DeviceChangeEvent) => void,
  config?: DeviceDetectionConfig,
): () => void {
  return getGlobalDeviceDetector(config).onDeviceChange(callback)
}
