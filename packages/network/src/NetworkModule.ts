import type { DeviceModule, NetworkInfo } from '@ldesign/device-core'

interface NetworkConnection {
  type?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
  addEventListener?: (type: string, listener: () => void) => void
  removeEventListener?: (type: string, listener: () => void) => void
}

/**
 * 网络信息模块
 * 
 * @example
 * ```ts
 * const network = new NetworkModule()
 * await network.init()
 * 
 * console.log('在线状态:', network.isOnline())
 * console.log('连接类型:', network.getConnectionType())
 * 
 * network.on('networkChange', (info) => {
 *   console.log('网络变化:', info)
 * })
 * ```
 */
export class NetworkModule implements DeviceModule {
  name = 'network'
  private networkInfo: NetworkInfo
  private connection: NetworkConnection | null = null
  private eventHandlers = new Map<string, () => void>()
  private customEventHandlers = new Map<string, Set<(data: unknown) => void>>()

  constructor() {
    this.networkInfo = this.detectNetworkInfo()
  }

  async init(): Promise<void> {
    if (typeof window === 'undefined' || typeof navigator === 'undefined')
      return

    // 获取网络连接对象
    const nav = navigator as any
    this.connection = nav.connection || nav.mozConnection || nav.webkitConnection || null

    this.setupEventListeners()
    this.updateNetworkInfo()
  }

  async destroy(): Promise<void> {
    this.removeEventListeners()
    this.connection = null
    this.eventHandlers.clear()
    this.customEventHandlers.clear()
  }

  getData(): NetworkInfo {
    return { ...this.networkInfo }
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }

  getConnectionType(): string {
    return this.connection?.effectiveType || this.connection?.type || 'unknown'
  }

  getDownlink(): number | undefined {
    return this.connection?.downlink
  }

  getRTT(): number | undefined {
    return this.connection?.rtt
  }

  isSaveData(): boolean | undefined {
    return this.connection?.saveData
  }

  on(event: string, handler: (data: unknown) => void): void {
    if (!this.customEventHandlers.has(event)) {
      this.customEventHandlers.set(event, new Set())
    }
    this.customEventHandlers.get(event)!.add(handler)
  }

  off(event: string, handler: (data: unknown) => void): void {
    this.customEventHandlers.get(event)?.delete(handler)
  }

  private emit(event: string, data: unknown): void {
    this.customEventHandlers.get(event)?.forEach(handler => {
      try {
        handler(data)
      }
      catch (error) {
        console.error('Error in network event handler:', error)
      }
    })
  }

  private detectNetworkInfo(): NetworkInfo {
    if (typeof window === 'undefined') {
      return {
        online: true,
        type: 'unknown',
        effectiveType: 'unknown',
      }
    }

    const online = navigator.onLine
    const nav = navigator as any
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection

    return {
      online,
      type: conn?.type || 'unknown',
      effectiveType: conn?.effectiveType || 'unknown',
      downlink: conn?.downlink,
      rtt: conn?.rtt,
      saveData: conn?.saveData,
    }
  }

  private updateNetworkInfo(): void {
    this.networkInfo = this.detectNetworkInfo()
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    const onlineHandler = () => {
      this.updateNetworkInfo()
      this.emit('networkChange', this.networkInfo)
    }

    const offlineHandler = () => {
      this.updateNetworkInfo()
      this.emit('networkChange', this.networkInfo)
    }

    const changeHandler = () => {
      this.updateNetworkInfo()
      this.emit('networkChange', this.networkInfo)
    }

    this.eventHandlers.set('online', onlineHandler)
    this.eventHandlers.set('offline', offlineHandler)

    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)

    if (this.connection?.addEventListener) {
      this.eventHandlers.set('change', changeHandler)
      this.connection.addEventListener('change', changeHandler)
    }
  }

  private removeEventListeners(): void {
    if (typeof window === 'undefined') return

    for (const [event, handler] of this.eventHandlers.entries()) {
      if (event === 'change' && this.connection) {
        this.connection.removeEventListener?.(event, handler)
      }
      else {
        window.removeEventListener(event, handler)
      }
    }

    this.eventHandlers.clear()
  }
}

