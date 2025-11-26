/**
 * 振动 API 模块
 * 
 * 提供设备振动功能，增强移动端交互体验
 * 适用于游戏、通知、用户反馈等场景
 * 
 * @example
 * ```typescript
 * const detector = new DeviceDetector()
 * const vibrationModule = await detector.loadModule<VibrationModule>('vibration')
 * 
 * // 简单振动
 * vibrationModule.vibrate(200)
 * 
 * // 复杂振动模式
 * vibrationModule.vibrate([100, 50, 100, 50, 100])
 * 
 * // 使用预设模式
 * vibrationModule.vibratePattern('success')
 * ```
 */

import type { DeviceModule } from '../types'
import { EventEmitter } from '../core/EventEmitter'

/**
 * 振动模式类型
 */
export type VibrationPatternName = 'success' | 'error' | 'warning' | 'notification' | 'heartbeat' | 'double' | 'triple'

/**
 * 振动事件
 */
export interface VibrationEvents extends Record<string, unknown> {
  /** 振动开始 */
  vibrationStart: { pattern: number | number[], name?: VibrationPatternName }
  /** 振动结束 */
  vibrationEnd: void
  /** 振动错误 */
  error: { message: string }
}

/**
 * 振动 API 模块
 */
export class VibrationModule
  extends EventEmitter<VibrationEvents>
  implements DeviceModule {
  name = 'vibration'
  private isInitialized = false
  private currentVibration: number | null = null

  /**
   * 预设振动模式
   * 
   * 数组中的数字交替表示振动和暂停的毫秒数
   * 例如 [100, 50, 100] 表示：振动100ms -> 暂停50ms -> 振动100ms
   */
  readonly patterns: Record<VibrationPatternName, number[]> = {
    /** 成功提示：短促的双振动 */
    success: [10, 50, 10],
    /** 错误提示：较长的三次振动 */
    error: [100, 50, 100, 50, 100],
    /** 警告提示：中等长度的两次振动 */
    warning: [50, 100, 50],
    /** 通知提示：短促的三次振动 */
    notification: [20, 20, 20, 20, 20],
    /** 心跳模式：模拟心跳的节奏 */
    heartbeat: [50, 100, 100, 100],
    /** 双击模式：两次短振动 */
    double: [30, 50, 30],
    /** 三击模式：三次短振动 */
    triple: [30, 50, 30, 50, 30],
  }

  /**
   * 初始化模块
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    // 检查是否支持振动 API
    if (!this.isSupported()) {
      console.warn('Vibration API is not supported in this browser/device')
    }

    this.isInitialized = true
  }

  /**
   * 销毁模块
   */
  async destroy(): Promise<void> {
    // 停止当前振动
    this.stop()

    this.removeAllListeners()
    this.isInitialized = false
  }

  /**
   * 获取模块数据
   */
  getData(): {
    supported: boolean
    isVibrating: boolean
  } {
    return {
      supported: this.isSupported(),
      isVibrating: this.isVibrating(),
    }
  }

  /**
   * 检查是否支持振动 API
   */
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator
  }

  /**
   * 触发振动
   * 
   * @param pattern - 振动模式：单个数字表示振动毫秒数，数组表示复杂模式
   * @returns boolean 是否成功触发振动
   * 
   * @example
   * ```typescript
   * // 振动 200 毫秒
   * vibrationModule.vibrate(200)
   * 
   * // 复杂模式：振动100ms -> 暂停50ms -> 振动100ms
   * vibrationModule.vibrate([100, 50, 100])
   * ```
   */
  vibrate(pattern: number | number[]): boolean {
    if (!this.isSupported()) {
      this.emit('error', { message: 'Vibration API is not supported' })
      return false
    }

    try {
      const success = navigator.vibrate(pattern)

      if (success) {
        this.currentVibration = Date.now()
        this.emit('vibrationStart', { pattern })

        // 计算振动总时长并设置结束事件
        const duration = this.calculateDuration(pattern)
        setTimeout(() => {
          this.currentVibration = null
          this.emit('vibrationEnd', undefined)
        }, duration)
      }

      return success
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.emit('error', { message })
      return false
    }
  }

  /**
   * 使用预设振动模式
   * 
   * @param name - 预设模式名称
   * @returns boolean 是否成功触发振动
   * 
   * @example
   * ```typescript
   * // 成功提示振动
   * vibrationModule.vibratePattern('success')
   * 
   * // 错误提示振动
   * vibrationModule.vibratePattern('error')
   * ```
   */
  vibratePattern(name: VibrationPatternName): boolean {
    const pattern = this.patterns[name]
    if (!pattern) {
      this.emit('error', { message: `Unknown pattern: ${name}` })
      return false
    }

    const success = this.vibrate(pattern)

    if (success) {
      const currentEvent = this.listeners('vibrationStart')[0]
      if (currentEvent) {
        // 更新事件数据以包含模式名称
        this.emit('vibrationStart', { pattern, name })
      }
    }

    return success
  }

  /**
   * 停止振动
   * 
   * @returns boolean 是否成功停止振动
   * 
   * @example
   * ```typescript
   * vibrationModule.stop()
   * ```
   */
  stop(): boolean {
    if (!this.isSupported()) {
      return false
    }

    try {
      const success = navigator.vibrate(0)

      if (success) {
        this.currentVibration = null
        this.emit('vibrationEnd', undefined)
      }

      return success
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.emit('error', { message })
      return false
    }
  }

  /**
   * 检查是否正在振动
   */
  isVibrating(): boolean {
    // 简化版本：基于最后一次振动的时间戳判断
    // 实际情况中，浏览器没有提供直接的 API 来检查振动状态
    if (this.currentVibration === null) {
      return false
    }

    // 如果距离上次振动开始不到3秒，认为可能还在振动
    return Date.now() - this.currentVibration < 3000
  }

  /**
   * 计算振动模式的总时长
   */
  private calculateDuration(pattern: number | number[]): number {
    if (typeof pattern === 'number') {
      return pattern
    }

    return pattern.reduce((sum, duration) => sum + duration, 0)
  }

  /**
   * 创建自定义振动模式
   * 
   * @param vibrations - 振动时长数组（毫秒）
   * @param pauses - 暂停时长数组（毫秒）
   * @returns 振动模式数组
   * 
   * @example
   * ```typescript
   * // 创建：振动100ms -> 暂停50ms -> 振动200ms -> 暂停100ms -> 振动100ms
   * const pattern = vibrationModule.createPattern([100, 200, 100], [50, 100])
   * vibrationModule.vibrate(pattern)
   * ```
   */
  createPattern(vibrations: number[], pauses: number[]): number[] {
    const pattern: number[] = []

    for (let i = 0; i < vibrations.length; i++) {
      pattern.push(vibrations[i])

      // 添加暂停时间（如果有）
      if (i < pauses.length) {
        pattern.push(pauses[i])
      }
    }

    return pattern
  }

  /**
   * 获取所有可用的预设模式名称
   */
  getAvailablePatterns(): VibrationPatternName[] {
    return Object.keys(this.patterns) as VibrationPatternName[]
  }

  /**
   * 添加自定义预设模式
   * 
   * @param name - 模式名称
   * @param pattern - 振动模式
   * 
   * @example
   * ```typescript
   * vibrationModule.addPattern('custom', [100, 100, 100])
   * vibrationModule.vibratePattern('custom')
   * ```
   */
  addPattern(name: string, pattern: number[]): void {
    (this.patterns as Record<string, number[]>)[name] = pattern
  }

  /**
   * 移除自定义预设模式
   */
  removePattern(name: string): boolean {
    if (name in this.patterns) {
      delete (this.patterns as Record<string, number[]>)[name]
      return true
    }
    return false
  }
}


