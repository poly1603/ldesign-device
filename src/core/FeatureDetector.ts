import type { ExtendedDeviceInfo } from '../types'

/**
 * 网络信息接口
 */
interface NetworkInformation extends EventTarget {
  readonly type: string
  readonly effectiveType: string
  readonly downlink: number
  readonly rtt: number
  readonly saveData: boolean
  onchange: ((this: NetworkInformation, ev: Event) => any) | null
}

/**
 * 电池信息接口
 */
interface BatteryManager extends EventTarget {
  readonly charging: boolean
  readonly chargingTime: number
  readonly dischargingTime: number
  readonly level: number
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null
}

/**
 * 扩展的 Navigator 接口
 */
interface ExtendedNavigator extends Navigator {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
  getBattery?: () => Promise<BatteryManager>
}

/**
 * 设备特性检测器
 */
export class FeatureDetector {
  private networkInfo: NetworkInformation | null = null
  private batteryManager: BatteryManager | null = null
  private listeners: Set<() => void> = new Set()

  constructor() {
    this.init()
  }

  /**
   * 初始化特性检测
   */
  private async init(): Promise<void> {
    await this.initNetworkDetection()
    await this.initBatteryDetection()
  }

  /**
   * 初始化网络检测
   */
  private initNetworkDetection(): void {
    if (typeof navigator === 'undefined') {
      return
    }

    const nav = navigator as ExtendedNavigator
    this.networkInfo = nav.connection || nav.mozConnection || nav.webkitConnection || null

    if (this.networkInfo) {
      this.networkInfo.addEventListener('change', () => {
        this.notifyListeners()
      })
    }
  }

  /**
   * 初始化电池检测
   */
  private async initBatteryDetection(): Promise<void> {
    if (typeof navigator === 'undefined') {
      return
    }

    const nav = navigator as ExtendedNavigator
    if (nav.getBattery) {
      try {
        this.batteryManager = await nav.getBattery()

        // 监听电池状态变化
        if (this.batteryManager) {
          const events = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange']
          events.forEach((event) => {
            this.batteryManager?.addEventListener(event, () => {
              this.notifyListeners()
            })
          })
        }
      }
 catch (error) {
        console.warn('Battery API not supported:', error)
      }
    }
  }

  /**
   * 通知监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener()
      }
 catch (error) {
        console.error('Feature detector listener error:', error)
      }
    })
  }

  /**
   * 获取操作系统信息
   */
  getOSInfo(): { name: string, version: string } | null {
    if (typeof navigator === 'undefined') {
      return null
    }

    const userAgent = navigator.userAgent
    const platform = navigator.platform

    // Windows
    if (/Windows NT (\d+\.\d+)/.test(userAgent)) {
      const version = RegExp.$1
      return { name: 'Windows', version }
    }

    // macOS
    if (/Mac OS X (\d+[._]\d+[._]?\d*)/.test(userAgent)) {
      const version = RegExp.$1.replace(/_/g, '.')
      return { name: 'macOS', version }
    }

    // iOS
    if (/OS (\d+[._]\d+[._]?\d*)/.test(userAgent)) {
      const version = RegExp.$1.replace(/_/g, '.')
      return { name: 'iOS', version }
    }

    // Android
    if (/Android (\d+)/.test(userAgent)) {
      const version = RegExp.$1
      return { name: 'Android', version }
    }

    // Linux
    if (/Linux/.test(platform)) {
      return { name: 'Linux', version: 'Unknown' }
    }

    return { name: 'Unknown', version: 'Unknown' }
  }

  /**
   * 获取浏览器信息
   */
  getBrowserInfo(): { name: string, version: string } | null {
    if (typeof navigator === 'undefined') {
      return null
    }

    const userAgent = navigator.userAgent

    // Chrome
    if (/Chrome\/(\d+\.\d+)/.test(userAgent) && !/Edg/.test(userAgent)) {
      return { name: 'Chrome', version: RegExp.$1 }
    }

    // Edge
    if (/Edg\/(\d+\.\d+)/.test(userAgent)) {
      return { name: 'Edge', version: RegExp.$1 }
    }

    // Firefox
    if (/Firefox\/(\d+\.\d+)/.test(userAgent)) {
      return { name: 'Firefox', version: RegExp.$1 }
    }

    // Safari
    if (/Safari\//.test(userAgent) && !/Chrome/.test(userAgent)) {
      if (/Version\/(\d+\.\d+)/.test(userAgent)) {
        return { name: 'Safari', version: RegExp.$1 }
      }
      return { name: 'Safari', version: 'Unknown' }
    }

    return { name: 'Unknown', version: 'Unknown' }
  }

  /**
   * 获取硬件信息
   */
  getHardwareInfo(): { cores?: number, memory?: number, gpu?: string } {
    const info: { cores?: number, memory?: number, gpu?: string } = {}

    if (typeof navigator !== 'undefined') {
      // CPU 核心数
      info.cores = navigator.hardwareConcurrency || undefined

      // 内存信息（仅在支持的浏览器中）
      const nav = navigator as any
      if (nav.deviceMemory) {
        info.memory = nav.deviceMemory
      }

      // GPU 信息
      try {
        if (typeof document !== 'undefined') {
          const canvas = document.createElement('canvas')
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
          if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
            if (debugInfo) {
              info.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            }
          }
        }
      }
 catch (error) {
        // GPU 信息获取失败
      }
    }

    return info
  }

  /**
   * 获取网络信息
   */
  getNetworkInfo(): { type: string, online: boolean, downlink?: number } {
    const info = {
      type: 'unknown',
      online: typeof navigator !== 'undefined' ? navigator.onLine : true,
      downlink: undefined as number | undefined,
    }

    if (this.networkInfo) {
      info.type = this.networkInfo.effectiveType || this.networkInfo.type || 'unknown'
      info.downlink = this.networkInfo.downlink
    }

    return info
  }

  /**
   * 获取电池信息
   */
  getBatteryInfo(): { charging: boolean, level?: number, chargingTime?: number, dischargingTime?: number } | null {
    if (!this.batteryManager) {
      return null
    }

    return {
      charging: this.batteryManager.charging,
      level: this.batteryManager.level,
      chargingTime: this.batteryManager.chargingTime === Infinity ? undefined : this.batteryManager.chargingTime,
      dischargingTime: this.batteryManager.dischargingTime === Infinity ? undefined : this.batteryManager.dischargingTime,
    }
  }

  /**
   * 获取扩展设备信息
   */
  async getExtendedDeviceInfo(): Promise<Partial<ExtendedDeviceInfo>> {
    const info: Partial<ExtendedDeviceInfo> = {}

    // 操作系统信息
    info.os = this.getOSInfo() || undefined

    // 浏览器信息
    info.browser = this.getBrowserInfo() || undefined

    // 硬件信息
    info.hardware = this.getHardwareInfo()

    // 网络信息
    info.network = this.getNetworkInfo()

    return info
  }

  /**
   * 监听特性变化
   */
  onChange(callback: () => void): () => void {
    this.listeners.add(callback)

    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * 销毁检测器
   */
  destroy(): void {
    this.listeners.clear()
    this.networkInfo = null
    this.batteryManager = null
  }
}

/**
 * 全局特性检测器实例
 */
let globalFeatureDetector: FeatureDetector | null = null

/**
 * 获取全局特性检测器
 */
export function getGlobalFeatureDetector(): FeatureDetector {
  if (!globalFeatureDetector) {
    globalFeatureDetector = new FeatureDetector()
  }
  return globalFeatureDetector
}

/**
 * 快速获取扩展设备信息
 */
export async function getExtendedDeviceInfo(): Promise<Partial<ExtendedDeviceInfo>> {
  return getGlobalFeatureDetector().getExtendedDeviceInfo()
}
