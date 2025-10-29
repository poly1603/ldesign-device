import type { BatteryInfo, DeviceModule } from '@ldesign/device-core'

/**
 * 电池管理器接口（浏览器原生API）
 */
interface BatteryManager {
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

/**
 * 电池信息模块
 * 
 * 提供电池电量、充电状态等信息的检测和监听
 * 
 * @example
 * ```ts
 * const battery = new BatteryModule()
 * await battery.init()
 * 
 * // 获取电池信息
 * const info = battery.getData()
 * console.log('电量:', battery.getLevelPercentage() + '%')
 * console.log('充电状态:', battery.isCharging() ? '充电中' : '未充电')
 * 
 * // 监听电量变化
 * battery.on('batteryChange', (info) => {
 *   console.log('电量变化:', info)
 * })
 * ```
 */
export class BatteryModule implements DeviceModule {
  name = 'battery'
  private batteryInfo: BatteryInfo
  private battery: BatteryManager | null = null
  private eventHandlers = new Map<string, () => void>()
  private customEventHandlers = new Map<string, Set<(data: unknown) => void>>()

  constructor() {
    this.batteryInfo = this.getDefaultBatteryInfo()
  }

  /**
   * 初始化模块
   */
  async init(): Promise<void> {
    if (typeof window === 'undefined' || typeof navigator === 'undefined')
      return

    try {
      // 获取电池 API
      if ('getBattery' in navigator && typeof (navigator as any).getBattery === 'function') {
        this.battery = await (navigator as any).getBattery()
      }

      if (this.battery) {
        this.updateBatteryInfo()
        this.setupEventListeners()
      }
    }
    catch (error) {
      console.warn('Battery API not supported or failed to initialize:', error)
    }
  }

  /**
   * 销毁模块
   */
  async destroy(): Promise<void> {
    this.removeEventListeners()
    this.battery = null
    this.eventHandlers.clear()
    this.customEventHandlers.clear()
  }

  /**
   * 获取电池信息
   */
  getData(): BatteryInfo {
    this.updateBatteryInfo()
    return { ...this.batteryInfo }
  }

  /**
   * 获取电池电量（0-1）
   */
  getLevel(): number {
    return this.batteryInfo.level
  }

  /**
   * 获取电池电量百分比（0-100）
   */
  getLevelPercentage(): number {
    return Math.round(this.batteryInfo.level * 100)
  }

  /**
   * 检查是否正在充电
   */
  isCharging(): boolean {
    return this.batteryInfo.charging
  }

  /**
   * 获取充电时间（秒）
   */
  getChargingTime(): number {
    return this.batteryInfo.chargingTime
  }

  /**
   * 获取放电时间（秒）
   */
  getDischargingTime(): number {
    return this.batteryInfo.dischargingTime
  }

  /**
   * 检查是否支持电池 API
   */
  isSupported(): boolean {
    return this.battery !== null
  }

  /**
   * 检查电池是否电量低
   */
  isLowBattery(threshold = 0.2): boolean {
    return this.batteryInfo.level <= threshold
  }

  /**
   * 获取电池状态
   */
  getBatteryStatus(): 'full' | 'high' | 'medium' | 'low' | 'critical' {
    const level = this.batteryInfo.level

    if (level >= 0.9) return 'full'
    if (level >= 0.5) return 'high'
    if (level >= 0.2) return 'medium'
    if (level >= 0.1) return 'low'
    return 'critical'
  }

  /**
   * 添加事件监听器
   */
  on(event: string, handler: (data: unknown) => void): void {
    if (!this.customEventHandlers.has(event)) {
      this.customEventHandlers.set(event, new Set())
    }
    this.customEventHandlers.get(event)!.add(handler)
  }

  /**
   * 移除事件监听器
   */
  off(event: string, handler: (data: unknown) => void): void {
    const handlers = this.customEventHandlers.get(event)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  /**
   * 触发自定义事件
   */
  private emit(event: string, data: unknown): void {
    const handlers = this.customEventHandlers.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        }
        catch (error) {
          console.error('Error in battery event handler:', error)
        }
      })
    }
  }

  /**
   * 获取默认电池信息
   */
  private getDefaultBatteryInfo(): BatteryInfo {
    return {
      level: 1,
      charging: false,
      chargingTime: Infinity,
      dischargingTime: Infinity,
    }
  }

  /**
   * 更新电池信息
   */
  private updateBatteryInfo(): void {
    if (!this.battery) return

    this.batteryInfo = {
      level: this.battery.level,
      charging: this.battery.charging,
      chargingTime: this.battery.chargingTime,
      dischargingTime: this.battery.dischargingTime,
    }
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    if (!this.battery) return

    const levelChangeHandler = () => {
      this.updateBatteryInfo()
      this.emit('batteryChange', this.batteryInfo)
    }

    const chargingChangeHandler = () => {
      this.updateBatteryInfo()
      this.emit('batteryChange', this.batteryInfo)
    }

    this.eventHandlers.set('levelchange', levelChangeHandler)
    this.eventHandlers.set('chargingchange', chargingChangeHandler)

    this.battery.addEventListener('levelchange', levelChangeHandler)
    this.battery.addEventListener('chargingchange', chargingChangeHandler)
  }

  /**
   * 移除事件监听器
   */
  private removeEventListeners(): void {
    if (!this.battery) return

    for (const [event, handler] of this.eventHandlers.entries()) {
      this.battery.removeEventListener(event, handler)
    }

    this.eventHandlers.clear()
  }
}

