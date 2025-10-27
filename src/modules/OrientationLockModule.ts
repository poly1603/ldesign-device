/**
 * 屏幕方向锁定模块
 * 
 * 提供屏幕方向锁定功能，适用于游戏、视频播放等需要固定屏幕方向的场景
 * 
 * @example
 * ```typescript
 * const detector = new DeviceDetector()
 * const orientationModule = await detector.loadModule<OrientationLockModule>('orientationLock')
 * 
 * // 锁定为横屏
 * const success = await orientationModule.lock('landscape')
 * 
 * // 播放视频...
 * 
 * // 解除锁定
 * orientationModule.unlock()
 * ```
 */

import type { DeviceModule, OrientationLockType } from '../types'
import { EventEmitter } from '../core/EventEmitter'

/**
 * 屏幕方向锁定事件
 */
export interface OrientationLockEvents extends Record<string, unknown> {
  /** 锁定成功 */
  locked: { orientation: OrientationLockType }
  /** 解锁成功 */
  unlocked: void
  /** 方向改变 */
  orientationChange: { angle: number, type: string }
  /** 操作失败 */
  error: { message: string, operation: string }
}

/**
 * 屏幕方向锁定模块
 */
export class OrientationLockModule
  extends EventEmitter<OrientationLockEvents>
  implements DeviceModule {
  name = 'orientationLock'
  private isInitialized = false
  private currentLock: OrientationLockType | null = null
  private orientationChangeHandler?: () => void

  /**
   * 初始化模块
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    // 检查是否支持 Screen Orientation API
    if (!this.isSupported()) {
      console.warn('Screen Orientation API is not supported in this browser')
    }
    else {
      // 监听方向变化
      this.setupOrientationListener()
    }

    this.isInitialized = true
  }

  /**
   * 销毁模块
   */
  async destroy(): Promise<void> {
    // 解除锁定
    this.unlock()

    // 移除事件监听
    if (this.orientationChangeHandler && typeof screen !== 'undefined' && screen.orientation) {
      screen.orientation.removeEventListener('change', this.orientationChangeHandler)
      this.orientationChangeHandler = undefined
    }

    this.removeAllListeners()
    this.isInitialized = false
  }

  /**
   * 获取模块数据
   */
  getData(): {
    supported: boolean
    currentOrientation: string | null
    currentAngle: number | null
    isLocked: boolean
  } {
    return {
      supported: this.isSupported(),
      currentOrientation: this.getCurrentOrientation(),
      currentAngle: this.getCurrentAngle(),
      isLocked: this.isLocked(),
    }
  }

  /**
   * 检查是否支持 Screen Orientation API
   */
  isSupported(): boolean {
    return (
      typeof screen !== 'undefined'
      && 'orientation' in screen
      && typeof screen.orientation === 'object'
      && typeof screen.orientation.lock === 'function'
    )
  }

  /**
   * 锁定屏幕方向
   * 
   * @param orientation - 要锁定的方向
   * @returns Promise<boolean> 是否成功锁定
   * 
   * @example
   * ```typescript
   * // 锁定为横屏
   * await orientationModule.lock('landscape')
   * 
   * // 锁定为竖屏
   * await orientationModule.lock('portrait')
   * 
   * // 锁定为自然方向
   * await orientationModule.lock('natural')
   * ```
   */
  async lock(orientation: OrientationLockType): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Screen orientation lock is not supported')
      this.emit('error', {
        message: 'Screen orientation lock not supported',
        operation: 'lock',
      })
      return false
    }

    try {
      await screen.orientation.lock(orientation)
      this.currentLock = orientation
      this.emit('locked', { orientation })
      return true
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.warn(`Failed to lock screen orientation to ${orientation}:`, message)
      this.emit('error', { message, operation: 'lock' })
      return false
    }
  }

  /**
   * 解除屏幕方向锁定
   * 
   * @example
   * ```typescript
   * orientationModule.unlock()
   * ```
   */
  unlock(): void {
    if (!this.isSupported()) {
      return
    }

    try {
      screen.orientation.unlock()
      this.currentLock = null
      this.emit('unlocked', undefined)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.warn('Failed to unlock screen orientation:', message)
      this.emit('error', { message, operation: 'unlock' })
    }
  }

  /**
   * 检查当前是否已锁定方向
   */
  isLocked(): boolean {
    return this.currentLock !== null
  }

  /**
   * 获取当前锁定的方向
   */
  getLockedOrientation(): OrientationLockType | null {
    return this.currentLock
  }

  /**
   * 获取当前屏幕方向
   */
  getCurrentOrientation(): string | null {
    if (!this.isSupported()) {
      return null
    }

    return screen.orientation.type
  }

  /**
   * 获取当前屏幕角度
   */
  getCurrentAngle(): number | null {
    if (!this.isSupported()) {
      return null
    }

    return screen.orientation.angle
  }

  /**
   * 检查是否为横屏
   */
  isLandscape(): boolean {
    const orientation = this.getCurrentOrientation()
    return orientation !== null && orientation.includes('landscape')
  }

  /**
   * 检查是否为竖屏
   */
  isPortrait(): boolean {
    const orientation = this.getCurrentOrientation()
    return orientation !== null && orientation.includes('portrait')
  }

  /**
   * 设置方向变化监听器
   */
  private setupOrientationListener(): void {
    if (!this.isSupported()) {
      return
    }

    this.orientationChangeHandler = () => {
      const angle = screen.orientation.angle
      const type = screen.orientation.type

      this.emit('orientationChange', { angle, type })
    }

    screen.orientation.addEventListener('change', this.orientationChangeHandler)
  }

  /**
   * 锁定为横屏（快捷方法）
   */
  async lockLandscape(): Promise<boolean> {
    return this.lock('landscape')
  }

  /**
   * 锁定为竖屏（快捷方法）
   */
  async lockPortrait(): Promise<boolean> {
    return this.lock('portrait')
  }

  /**
   * 锁定为自然方向（快捷方法）
   */
  async lockNatural(): Promise<boolean> {
    return this.lock('natural')
  }

  /**
   * 获取所有支持的方向锁定类型
   */
  getSupportedOrientations(): OrientationLockType[] {
    return [
      'any',
      'natural',
      'landscape',
      'portrait',
      'portrait-primary',
      'portrait-secondary',
      'landscape-primary',
      'landscape-secondary',
    ]
  }

  /**
   * 检查特定方向是否可以锁定
   * 
   * @param orientation - 要检查的方向
   * @returns Promise<boolean> 是否可以锁定
   */
  async canLock(orientation: OrientationLockType): Promise<boolean> {
    if (!this.isSupported()) {
      return false
    }

    try {
      // 尝试锁定
      await screen.orientation.lock(orientation)
      // 立即解锁
      screen.orientation.unlock()
      return true
    }
    catch {
      return false
    }
  }

  /**
   * 获取屏幕方向信息摘要
   */
  getOrientationInfo(): {
    type: string | null
    angle: number | null
    isLandscape: boolean
    isPortrait: boolean
    isLocked: boolean
    lockedOrientation: OrientationLockType | null
  } {
    return {
      type: this.getCurrentOrientation(),
      angle: this.getCurrentAngle(),
      isLandscape: this.isLandscape(),
      isPortrait: this.isPortrait(),
      isLocked: this.isLocked(),
      lockedOrientation: this.getLockedOrientation(),
    }
  }
}

