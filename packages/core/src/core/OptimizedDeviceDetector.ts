/**
 * 优化的设备检测器
 * 
 * 性能优化：
 * - 智能缓存策略
 * - 减少重复计算
 * - 优化的WebGL检测
 * - 更高效的事件系统
 * - 内存占用优化
 */

import type {
  DeviceDetectorEvents,
  DeviceDetectorOptions,
  DeviceInfo,
  DeviceModule,
  DeviceType,
  Orientation,
} from '../types'
import {
  debounce,
  getDeviceTypeByWidth,
  getPixelRatio,
  getScreenOrientation,
  isTouchDevice,
  parseBrowser,
  parseOS,
} from '../utils'
import { memoryManager, SafeTimerManager } from '../utils/MemoryManager'
import { SmartCache } from '../utils/SmartCache'
import { PerformanceBudget } from '../utils/PerformanceBudget'
import { OptimizedEventEmitter } from './OptimizedEventEmitter'
import { ModuleLoader } from './ModuleLoader'

// WebGL检测结果缓存（全局共享）
let globalWebGLSupport: boolean | undefined
let globalWebGLCheckTime = 0

export class OptimizedDeviceDetector extends OptimizedEventEmitter<DeviceDetectorEvents> {
  private options: DeviceDetectorOptions
  private moduleLoader: ModuleLoader
  private currentDeviceInfo: DeviceInfo
  private resizeHandler?: () => void
  private orientationHandler?: () => void
  private isDestroyed = false
  private timerManager: SafeTimerManager
  private performanceBudget: PerformanceBudget

  // 智能缓存
  private smartCache: SmartCache<unknown>
  private deviceInfoHash = ''

  // 性能优化：减少检测频率
  private lastDetectionTime = 0
  private readonly minDetectionInterval = 32 // 降低到约30fps，更合理

  // 批量更新控制
  private updateScheduled = false
  private pendingUpdates = new Set<string>()

  // 模块事件桥接
  private moduleEventUnsubscribers = new Map<string, Array<() => void>>()

  // 性能指标（使用环形缓冲区）
  private readonly maxMetricsHistory = 50 // 减少历史记录
  private metricsHistory: number[] = []
  private detectionMetrics = {
    detectionCount: 0,
    averageDetectionTime: 0,
    lastDetectionDuration: 0,
  }

  constructor(options: DeviceDetectorOptions = {}) {
    super()

    this.options = {
      enableResize: true,
      enableOrientation: true,
      breakpoints: {
        mobile: 768,
        tablet: 1024,
      },
      debounceDelay: 100,
      ...options,
    }

    this.timerManager = new SafeTimerManager()
    this.moduleLoader = new ModuleLoader()
    this.performanceBudget = new PerformanceBudget({
      enableWarnings: options.debug ?? false,
      collectStats: true,
    })

    // 初始化智能缓存
    this.smartCache = new SmartCache({
      maxSize: 50,
      baseExpireTime: 120000, // 2分钟
      maxExpireTime: 600000, // 10分钟
    })

    this.currentDeviceInfo = this.detectDevice()
    this.setupEventListeners()

    // 注册内存清理回调
    memoryManager.addGCCallback(() => this.onMemoryPressure())
  }

  /**
   * 获取设备信息（优化版本）
   */
  getDeviceInfo(): DeviceInfo {
    // 检查是否需要更新
    if (this.shouldUpdateDeviceInfo()) {
      this.updateDeviceInfo()
    }
    return { ...this.currentDeviceInfo }
  }

  /**
   * 检查是否需要更新设备信息
   */
  private shouldUpdateDeviceInfo(): boolean {
    const now = performance.now()

    // 检查时间间隔
    if (now - this.lastDetectionTime < this.minDetectionInterval) {
      return false
    }

    // 检查设备信息哈希是否变化
    const currentHash = this.calculateDeviceHash()
    return currentHash !== this.deviceInfoHash
  }

  /**
   * 计算设备信息哈希（快速变化检测）
   */
  private calculateDeviceHash(): string {
    if (typeof window === 'undefined') return 'ssr'

    // 只包含可能变化的关键信息
    return `${window.innerWidth}x${window.innerHeight}|${window.devicePixelRatio}|${navigator.onLine}`
  }

  /**
   * 优化的设备检测
   */
  private detectDevice(): DeviceInfo {
    if (typeof window === 'undefined') {
      return this.getSSRDeviceInfo()
    }

    const startTime = performance.now()
    const cacheKey = 'device-info'

    // 尝试从缓存获取
    const cached = this.smartCache.get(cacheKey) as DeviceInfo
    if (cached) {
      this.lastDetectionTime = startTime
      return cached
    }

    try {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent

      // 批量获取缓存的解析结果
      const osKey = `os-${userAgent}`
      const browserKey = `browser-${userAgent}`

      let os = this.smartCache.get(osKey) as { name: string; version: string }
      let browser = this.smartCache.get(browserKey) as { name: string; version: string }

      if (!os) {
        os = parseOS(userAgent)
        this.smartCache.set(osKey, os)
      }

      if (!browser) {
        browser = parseBrowser(userAgent)
        this.smartCache.set(browserKey, browser)
      }

      const deviceInfo: DeviceInfo = {
        type: getDeviceTypeByWidth(width, this.options.breakpoints),
        orientation: getScreenOrientation(),
        width,
        height,
        pixelRatio: getPixelRatio(),
        isTouchDevice: isTouchDevice(),
        userAgent,
        os,
        browser,
        screen: {
          width,
          height,
          pixelRatio: getPixelRatio(),
          availWidth: window.screen?.availWidth || width,
          availHeight: window.screen?.availHeight || height,
        },
        features: {
          touch: isTouchDevice(),
          webgl: this.detectWebGLOptimized(),
        },
      }

      // 缓存结果
      this.smartCache.set(cacheKey, deviceInfo)
      this.deviceInfoHash = this.calculateDeviceHash()

      // 更新性能指标
      const detectionTime = performance.now() - startTime
      this.updatePerformanceMetrics(detectionTime)

      this.lastDetectionTime = performance.now()
      return deviceInfo
    } catch (error) {
      console.error('Device detection error:', error)
      return this.currentDeviceInfo || this.getSSRDeviceInfo()
    }
  }

  /**
   * 优化的WebGL检测
   */
  private detectWebGLOptimized(): boolean {
    const now = Date.now()

    // 使用全局缓存（5分钟有效期）
    if (
      globalWebGLSupport !== undefined &&
      now - globalWebGLCheckTime < 300000
    ) {
      return globalWebGLSupport
    }

    try {
      // 优化：使用更轻量的检测方法
      if (typeof OffscreenCanvas !== 'undefined') {
        // 使用1x1的OffscreenCanvas减少内存占用
        const canvas = new OffscreenCanvas(1, 1)
        const gl = canvas.getContext('webgl', {
          failIfMajorPerformanceCaveat: true,
          powerPreference: 'low-power',
        })

        globalWebGLSupport = !!gl
      } else {
        // 降级到检查WebGLRenderingContext是否存在
        globalWebGLSupport = 'WebGLRenderingContext' in window
      }

      globalWebGLCheckTime = now
      return globalWebGLSupport
    } catch {
      globalWebGLSupport = false
      globalWebGLCheckTime = now
      return false
    }
  }

  /**
   * SSR环境的默认设备信息
   */
  private getSSRDeviceInfo(): DeviceInfo {
    return {
      type: 'desktop',
      orientation: 'landscape',
      width: 1920,
      height: 1080,
      pixelRatio: 1,
      isTouchDevice: false,
      userAgent: '',
      os: { name: 'unknown', version: 'unknown' },
      browser: { name: 'unknown', version: 'unknown' },
      screen: {
        width: 1920,
        height: 1080,
        pixelRatio: 1,
        availWidth: 1920,
        availHeight: 1080,
      },
      features: {
        touch: false,
        webgl: false,
      },
    }
  }

  /**
   * 批量更新设备信息
   */
  private scheduleUpdate(updateType: string): void {
    this.pendingUpdates.add(updateType)

    if (!this.updateScheduled) {
      this.updateScheduled = true

      // 使用 requestIdleCallback 优化更新时机
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          this.processPendingUpdates()
        }, { timeout: 100 })
      } else {
        setTimeout(() => this.processPendingUpdates(), 16)
      }
    }
  }

  /**
   * 处理待处理的更新
   */
  private processPendingUpdates(): void {
    if (this.isDestroyed) return

    this.updateScheduled = false
    const updates = Array.from(this.pendingUpdates)
    this.pendingUpdates.clear()

    // 批量处理更新
    this.startBatch()

    try {
      if (updates.includes('resize') || updates.includes('orientation')) {
        this.updateDeviceInfo()
      }
    } finally {
      this.endBatch()
    }
  }

  /**
   * 更新设备信息
   */
  private updateDeviceInfo(): void {
    const oldInfo = this.currentDeviceInfo
    const newInfo = this.detectDevice()

    if (this.hasDeviceInfoChanged(oldInfo, newInfo)) {
      this.currentDeviceInfo = newInfo

      // 批量发送事件
      if (oldInfo.type !== newInfo.type) {
        this.emit('deviceChange', newInfo)
      }

      if (oldInfo.orientation !== newInfo.orientation) {
        this.emit('orientationChange', newInfo.orientation)
      }

      if (
        oldInfo.width !== newInfo.width ||
        oldInfo.height !== newInfo.height
      ) {
        this.emit('resize', {
          width: newInfo.width,
          height: newInfo.height,
        })
      }
    }
  }

  /**
   * 检查设备信息是否变化
   */
  private hasDeviceInfoChanged(
    oldInfo: DeviceInfo,
    newInfo: DeviceInfo
  ): boolean {
    return (
      oldInfo.type !== newInfo.type ||
      oldInfo.orientation !== newInfo.orientation ||
      oldInfo.width !== newInfo.width ||
      oldInfo.height !== newInfo.height ||
      oldInfo.pixelRatio !== newInfo.pixelRatio
    )
  }

  /**
   * 响应内存压力
   */
  private onMemoryPressure(): void {
    // 清理智能缓存
    this.smartCache.onMemoryPressure()

    // 减少历史记录
    if (this.metricsHistory.length > this.maxMetricsHistory / 2) {
      this.metricsHistory = this.metricsHistory.slice(-this.maxMetricsHistory / 2)
    }
  }

  /**
   * 更新性能指标
   */
  private updatePerformanceMetrics(detectionTime: number): void {
    this.detectionMetrics.detectionCount++
    this.detectionMetrics.lastDetectionDuration = detectionTime

    this.metricsHistory.push(detectionTime)
    if (this.metricsHistory.length > this.maxMetricsHistory) {
      this.metricsHistory.shift()
    }

    const sum = this.metricsHistory.reduce((a, b) => a + b, 0)
    this.detectionMetrics.averageDetectionTime = sum / this.metricsHistory.length
  }

  /**
   * 设置事件监听器（优化版本）
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // 使用优化的防抖处理器
    const debouncedUpdate = debounce(
      () => this.scheduleUpdate('resize'),
      this.options.debounceDelay ?? 100
    )

    if (this.options.enableResize) {
      this.resizeHandler = debouncedUpdate
      window.addEventListener('resize', this.resizeHandler, {
        passive: true,
        capture: false,
      })
    }

    if (this.options.enableOrientation) {
      this.orientationHandler = () => this.scheduleUpdate('orientation')

      window.addEventListener('orientationchange', this.orientationHandler, {
        passive: true,
        capture: false,
      })

      // 备用方案
      if (!this.options.enableResize) {
        window.addEventListener('resize', this.orientationHandler, {
          passive: true,
          capture: false,
        })
      }
    }
  }

  /**
   * 清理资源
   */
  async destroy(): Promise<void> {
    if (this.isDestroyed) return

    this.isDestroyed = true

    // 移除事件监听器
    if (typeof window !== 'undefined') {
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler)
      }
      if (this.orientationHandler) {
        window.removeEventListener('orientationchange', this.orientationHandler)
        if (!this.options.enableResize) {
          window.removeEventListener('resize', this.orientationHandler)
        }
      }
    }

    // 清理定时器
    this.timerManager.clearAll()

    // 清理模块
    this.moduleEventUnsubscribers.forEach(unsubs => {
      unsubs.forEach(fn => {
        try {
          fn()
        } catch { }
      })
    })
    this.moduleEventUnsubscribers.clear()

    await this.moduleLoader.unloadAll()

    // 清理事件
    this.removeAllListeners()

    // 清理缓存
    this.smartCache.clear()

    // 清理性能指标
    this.metricsHistory.length = 0

    // 移除内存管理器回调
    memoryManager.removeGCCallback(() => this.onMemoryPressure())
  }

  // 保留原有的公共API以保持兼容性
  getDeviceType(): DeviceType {
    return this.currentDeviceInfo.type
  }

  getOrientation(): Orientation {
    return this.currentDeviceInfo.orientation
  }

  getDetectionMetrics() {
    return { ...this.detectionMetrics }
  }

  isMobile(): boolean {
    return this.currentDeviceInfo.type === 'mobile'
  }

  isTablet(): boolean {
    return this.currentDeviceInfo.type === 'tablet'
  }

  isDesktop(): boolean {
    return this.currentDeviceInfo.type === 'desktop'
  }

  isTouchDevice(): boolean {
    return this.currentDeviceInfo.isTouchDevice
  }

  refresh(): void {
    this.lastDetectionTime = 0
    this.deviceInfoHash = ''
    this.smartCache.delete('device-info')
    this.updateDeviceInfo()
  }

  async loadModule<T extends DeviceModule = DeviceModule>(
    name: string
  ): Promise<T> {
    if (this.isDestroyed) {
      throw new Error('DeviceDetector has been destroyed')
    }

    const instance = await this.moduleLoader.loadModuleInstance<T>(name)

    // 桥接模块事件
    try {
      const unsubs: Array<() => void> = []
      const withEvents = instance as any

      if (typeof withEvents.on === 'function') {
        const eventMap: Record<string, string> = {
          network: 'networkChange',
          battery: 'batteryChange',
          geolocation: 'positionChange',
        }

        const eventName = eventMap[name]
        if (eventName) {
          const handler = (info: unknown) => this.emit(eventName as any, info as any)
          withEvents.on(eventName, handler)
          unsubs.push(() => withEvents.off?.(eventName, handler))
        }
      }

      if (unsubs.length > 0) {
        this.moduleEventUnsubscribers.set(name, unsubs)
      }
    } catch { }

    return instance
  }

  async unloadModule(name: string): Promise<void> {
    const unsubs = this.moduleEventUnsubscribers.get(name)
    if (unsubs) {
      unsubs.forEach(fn => {
        try {
          fn()
        } catch { }
      })
      this.moduleEventUnsubscribers.delete(name)
    }
    await this.moduleLoader.unload(name)
  }

  isModuleLoaded(name: string): boolean {
    return this.moduleLoader.isLoaded(name)
  }

  getLoadedModules(): string[] {
    return this.moduleLoader.getLoadedModules()
  }
}

