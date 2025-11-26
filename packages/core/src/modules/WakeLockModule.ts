/**
 * Wake Lock API 模块
 * 
 * 防止屏幕休眠，适用于视频播放、演示、阅读等需要保持屏幕常亮的场景
 * 
 * @example
 * ```typescript
 * const detector = new DeviceDetector()
 * const wakeLockModule = await detector.loadModule<WakeLockModule>('wakeLock')
 * 
 * // 请求屏幕保持常亮
 * const success = await wakeLockModule.requestWakeLock()
 * if (success) {
 *   console.log('Screen will stay awake')
 * }
 * 
 * // 播放视频时
 * video.play()
 * await wakeLockModule.requestWakeLock()
 * 
 * // 视频结束时
 * video.onended = async () => {
 *   await wakeLockModule.releaseWakeLock()
 * }
 * ```
 */

import type { DeviceModule } from '../types'
import { EventEmitter } from '../core/EventEmitter'

/**
 * Wake Lock 事件
 */
export interface WakeLockEvents extends Record<string, unknown> {
  /** Wake Lock 获取成功 */
  acquired: void
  /** Wake Lock 释放 */
  released: void
  /** Wake Lock 错误 */
  error: { message: string, error: unknown }
}

/**
 * Wake Lock Sentinel 接口
 */
interface WakeLockSentinel extends EventTarget {
  readonly released: boolean
  readonly type: 'screen'
  release(): Promise<void>
}

/**
 * Wake Lock Navigator 接口
 */
interface NavigatorWithWakeLock extends Navigator {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinel>
  }
}

/**
 * Wake Lock API 模块
 */
export class WakeLockModule
  extends EventEmitter<WakeLockEvents>
  implements DeviceModule {
  name = 'wakeLock'
  private wakeLock: WakeLockSentinel | null = null
  private isInitialized = false
  private releaseHandler?: () => void

  /**
   * 初始化模块
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    // 检查是否支持 Wake Lock API
    if (!this.isSupported()) {
      console.warn('Wake Lock API is not supported in this browser')
    }

    this.isInitialized = true
  }

  /**
   * 销毁模块
   */
  async destroy(): Promise<void> {
    // 释放 Wake Lock
    await this.releaseWakeLock()

    this.removeAllListeners()
    this.isInitialized = false
  }

  /**
   * 获取模块数据
   */
  getData(): {
    supported: boolean
    active: boolean
  } {
    return {
      supported: this.isSupported(),
      active: this.isActive(),
    }
  }

  /**
   * 检查是否支持 Wake Lock API
   */
  isSupported(): boolean {
    return (
      typeof navigator !== 'undefined'
      && 'wakeLock' in navigator
      && typeof (navigator as NavigatorWithWakeLock).wakeLock?.request === 'function'
    )
  }

  /**
   * 请求 Wake Lock（防止屏幕休眠）
   * 
   * @returns Promise<boolean> 是否成功获取 Wake Lock
   * 
   * @example
   * ```typescript
   * const success = await wakeLockModule.requestWakeLock()
   * if (success) {
   *   console.log('Screen will stay awake')
   * }
   * ```
   */
  async requestWakeLock(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Wake Lock API is not supported')
      return false
    }

    // 如果已经有活跃的 Wake Lock，直接返回成功
    if (this.isActive()) {
      return true
    }

    try {
      const nav = navigator as NavigatorWithWakeLock
      this.wakeLock = await nav.wakeLock!.request('screen')

      // 监听 Wake Lock 的释放事件
      this.releaseHandler = () => {
        this.handleWakeLockRelease()
      }
      this.wakeLock.addEventListener('release', this.releaseHandler)

      this.emit('acquired', undefined)
      return true
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.warn('Failed to acquire Wake Lock:', errorMessage)

      this.emit('error', {
        message: 'Failed to acquire Wake Lock',
        error,
      })

      return false
    }
  }

  /**
   * 释放 Wake Lock（允许屏幕休眠）
   * 
   * @returns Promise<void>
   * 
   * @example
   * ```typescript
   * await wakeLockModule.releaseWakeLock()
   * console.log('Screen can now sleep')
   * ```
   */
  async releaseWakeLock(): Promise<void> {
    if (!this.wakeLock || this.wakeLock.released) {
      return
    }

    try {
      // 移除事件监听器
      if (this.releaseHandler) {
        this.wakeLock.removeEventListener('release', this.releaseHandler)
        this.releaseHandler = undefined
      }

      await this.wakeLock.release()
      this.wakeLock = null

      this.emit('released', undefined)
    }
    catch (error) {
      console.warn('Failed to release Wake Lock:', error)

      this.emit('error', {
        message: 'Failed to release Wake Lock',
        error,
      })
    }
  }

  /**
   * 检查 Wake Lock 是否处于活跃状态
   * 
   * @returns boolean Wake Lock 是否活跃
   */
  isActive(): boolean {
    return this.wakeLock !== null && !this.wakeLock.released
  }

  /**
   * 处理 Wake Lock 被释放（例如用户切换标签页）
   */
  private handleWakeLockRelease(): void {
    this.wakeLock = null
    this.emit('released', undefined)
  }

  /**
   * 自动重新获取 Wake Lock
   * 
   * 当页面重新可见时，自动重新获取 Wake Lock
   * 这对于视频播放等场景很有用
   * 
   * @param enable - 是否启用自动重新获取
   * 
   * @example
   * ```typescript
   * // 启用自动重新获取
   * wakeLockModule.enableAutoReacquire(true)
   * 
   * // 播放视频
   * video.play()
   * await wakeLockModule.requestWakeLock()
   * 
   * // 当用户切换标签页后再回来，Wake Lock 会自动重新获取
   * ```
   */
  enableAutoReacquire(enable: boolean): void {
    if (!this.isSupported()) {
      return
    }

    if (enable) {
      // 监听页面可见性变化
      document.addEventListener('visibilitychange', this.handleVisibilityChange)
    }
    else {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    }
  }

  /**
   * 处理页面可见性变化
   */
  private handleVisibilityChange = async (): Promise<void> => {
    if (document.visibilityState === 'visible' && !this.isActive()) {
      // 页面重新可见且 Wake Lock 不活跃，尝试重新获取
      await this.requestWakeLock()
    }
  }

  /**
   * 获取 Wake Lock 状态描述
   */
  getStatus(): string {
    if (!this.isSupported()) {
      return 'Not Supported'
    }

    if (this.isActive()) {
      return 'Active'
    }

    return 'Inactive'
  }
}


