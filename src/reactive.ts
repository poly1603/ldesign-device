import type { DeviceInfo, DeviceChangeEvent, DeviceDetectionConfig } from './types'
import { getGlobalDeviceDetector } from './core'

/**
 * 响应式设备信息状态
 */
export interface ReactiveDeviceState {
  /** 当前设备信息 */
  deviceInfo: DeviceInfo
  /** 是否正在加载 */
  isLoading: boolean
  /** 错误信息 */
  error: Error | null
}

/**
 * 响应式设备监听器选项
 */
export interface ReactiveDeviceOptions extends DeviceDetectionConfig {
  /** 是否立即初始化 */
  immediate?: boolean
  /** 错误处理函数 */
  onError?: (error: Error) => void
}

/**
 * 响应式设备监听器
 */
export class ReactiveDeviceListener {
  private state: ReactiveDeviceState
  private listeners: Set<(state: ReactiveDeviceState) => void> = new Set()
  private unsubscribe: (() => void) | null = null
  private options: ReactiveDeviceOptions

  constructor(options: ReactiveDeviceOptions = {}) {
    this.options = { immediate: true, ...options }
    
    // 初始化状态
    this.state = {
      deviceInfo: {} as DeviceInfo,
      isLoading: true,
      error: null
    }

    if (this.options.immediate) {
      this.init()
    }
  }

  /**
   * 初始化监听器
   */
  private init(): void {
    try {
      const detector = getGlobalDeviceDetector(this.options)
      
      // 获取初始设备信息
      this.updateState({
        deviceInfo: detector.getDeviceInfo(),
        isLoading: false,
        error: null
      })

      // 监听设备变化
      this.unsubscribe = detector.onDeviceChange((event: DeviceChangeEvent) => {
        this.updateState({
          deviceInfo: event.current,
          isLoading: false,
          error: null
        })
      })
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.updateState({
        deviceInfo: {} as DeviceInfo,
        isLoading: false,
        error: err
      })
      
      if (this.options.onError) {
        this.options.onError(err)
      }
    }
  }

  /**
   * 更新状态并通知监听器
   */
  private updateState(newState: Partial<ReactiveDeviceState>): void {
    this.state = { ...this.state, ...newState }
    this.notifyListeners()
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state)
      } catch (error) {
        console.error('Reactive device listener error:', error)
      }
    })
  }

  /**
   * 获取当前状态
   */
  getState(): ReactiveDeviceState {
    return { ...this.state }
  }

  /**
   * 订阅状态变化
   */
  subscribe(listener: (state: ReactiveDeviceState) => void): () => void {
    this.listeners.add(listener)
    
    // 立即触发一次
    listener(this.state)
    
    // 返回取消订阅函数
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * 手动刷新设备信息
   */
  refresh(): void {
    if (!this.unsubscribe) {
      this.init()
    } else {
      try {
        const detector = getGlobalDeviceDetector(this.options)
        this.updateState({
          deviceInfo: detector.getDeviceInfo(),
          isLoading: false,
          error: null
        })
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        this.updateState({
          error: err,
          isLoading: false
        })
        
        if (this.options.onError) {
          this.options.onError(err)
        }
      }
    }
  }

  /**
   * 销毁监听器
   */
  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
    
    this.listeners.clear()
  }
}

/**
 * 创建响应式设备监听器
 */
export function createReactiveDeviceListener(
  options?: ReactiveDeviceOptions
): ReactiveDeviceListener {
  return new ReactiveDeviceListener(options)
}

/**
 * 简化的响应式设备信息钩子
 */
export function useDeviceInfo(options?: ReactiveDeviceOptions) {
  const listener = createReactiveDeviceListener(options)
  
  return {
    /** 获取当前状态 */
    getState: () => listener.getState(),
    /** 订阅状态变化 */
    subscribe: (callback: (state: ReactiveDeviceState) => void) => listener.subscribe(callback),
    /** 刷新设备信息 */
    refresh: () => listener.refresh(),
    /** 销毁监听器 */
    destroy: () => listener.destroy()
  }
}

/**
 * 媒体查询监听器
 */
export class MediaQueryListener {
  private mediaQuery: MediaQueryList | null = null
  private listeners: Set<(matches: boolean) => void> = new Set()
  private currentMatches = false

  constructor(private query: string) {
    this.init()
  }

  /**
   * 初始化媒体查询监听器
   */
  private init(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    this.mediaQuery = window.matchMedia(this.query)
    this.currentMatches = this.mediaQuery.matches

    // 监听变化
    const handler = (event: MediaQueryListEvent) => {
      this.currentMatches = event.matches
      this.notifyListeners()
    }

    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', handler)
    } else {
      // 兼容旧版本
      this.mediaQuery.addListener(handler)
    }
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentMatches)
      } catch (error) {
        console.error('Media query listener error:', error)
      }
    })
  }

  /**
   * 获取当前匹配状态
   */
  matches(): boolean {
    return this.currentMatches
  }

  /**
   * 订阅变化
   */
  subscribe(listener: (matches: boolean) => void): () => void {
    this.listeners.add(listener)
    
    // 立即触发一次
    listener(this.currentMatches)
    
    // 返回取消订阅函数
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * 销毁监听器
   */
  destroy(): void {
    this.listeners.clear()
    this.mediaQuery = null
  }
}

/**
 * 创建媒体查询监听器
 */
export function createMediaQueryListener(query: string): MediaQueryListener {
  return new MediaQueryListener(query)
}

/**
 * 常用媒体查询预设
 */
export const MEDIA_QUERIES = {
  /** 移动设备 */
  mobile: '(max-width: 767px)',
  /** 平板设备 */
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  /** 桌面设备 */
  desktop: '(min-width: 1024px)',
  /** 竖屏 */
  portrait: '(orientation: portrait)',
  /** 横屏 */
  landscape: '(orientation: landscape)',
  /** 高分辨率屏幕 */
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  /** 深色模式 */
  darkMode: '(prefers-color-scheme: dark)',
  /** 浅色模式 */
  lightMode: '(prefers-color-scheme: light)',
  /** 减少动画 */
  reducedMotion: '(prefers-reduced-motion: reduce)'
} as const
