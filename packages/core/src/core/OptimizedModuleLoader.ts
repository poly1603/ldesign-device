/**
 * 优化的模块加载器
 * 
 * 性能优化：
 * - 并发控制
 * - 内存使用优化
 * - 错误重试机制
 * - 预加载支持
 */

import type { DeviceModule } from '../types'

interface LoadingState {
  promise: Promise<DeviceModule>
  retryCount: number
  lastError?: Error
}

interface ModuleConfig {
  maxRetries?: number
  retryDelay?: number
  timeout?: number
  preload?: boolean
}

export class OptimizedModuleLoader {
  private modules = new Map<string, DeviceModule>()
  private loading = new Map<string, LoadingState>()
  private moduleConfigs = new Map<string, ModuleConfig>()
  private loadOrder: string[] = []

  // 并发控制
  private concurrentLoads = 0
  private readonly maxConcurrent = 3
  private loadQueue: Array<() => void> = []

  // 预加载配置
  private preloadList = new Set<string>()

  constructor() {
    // 配置常用模块的预加载
    this.configureModule('network', { preload: true })
    this.configureModule('battery', { preload: true })
  }

  /**
   * 配置模块加载选项
   */
  configureModule(name: string, config: ModuleConfig): void {
    this.moduleConfigs.set(name, config)
    if (config.preload) {
      this.preloadList.add(name)
    }
  }

  /**
   * 预加载模块
   */
  async preloadModules(): Promise<void> {
    const modules = Array.from(this.preloadList)
    await Promise.allSettled(
      modules.map(name => this.loadModuleInstance(name))
    )
  }

  /**
   * 加载模块实例（带并发控制）
   */
  async loadModuleInstance<T extends DeviceModule = DeviceModule>(
    name: string
  ): Promise<T> {
    // 检查是否已加载
    const existing = this.modules.get(name)
    if (existing) {
      return existing as T
    }

    // 检查是否正在加载
    const loadingState = this.loading.get(name)
    if (loadingState) {
      return loadingState.promise as Promise<T>
    }

    // 并发控制
    if (this.concurrentLoads >= this.maxConcurrent) {
      await new Promise<void>(resolve => {
        this.loadQueue.push(resolve)
      })
    }

    this.concurrentLoads++

    try {
      const promise = this.loadModuleWithRetry(name)
      this.loading.set(name, {
        promise,
        retryCount: 0
      })

      const instance = await promise
      this.modules.set(name, instance)
      this.loading.delete(name)

      // 记录加载顺序（用于优化未来的加载）
      this.loadOrder.push(name)

      return instance as T
    } finally {
      this.concurrentLoads--

      // 处理等待队列
      const next = this.loadQueue.shift()
      if (next) next()
    }
  }

  /**
   * 带重试的模块加载
   */
  private async loadModuleWithRetry(name: string): Promise<DeviceModule> {
    const config = this.moduleConfigs.get(name) || {}
    const maxRetries = config.maxRetries ?? 3
    const retryDelay = config.retryDelay ?? 1000
    const timeout = config.timeout ?? 10000

    let lastError: Error | undefined

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const module = await this.loadModuleWithTimeout(name, timeout)

        // 初始化模块
        if (typeof module.init === 'function') {
          await module.init()
        }

        return module
      } catch (error) {
        lastError = error as Error
        console.warn(`Failed to load module "${name}" (attempt ${attempt + 1}):`, error)

        if (attempt < maxRetries) {
          // 指数退避
          await new Promise(resolve =>
            setTimeout(resolve, retryDelay * Math.pow(2, attempt))
          )
        }
      }
    }

    throw lastError || new Error(`Failed to load module "${name}"`)
  }

  /**
   * 带超时的模块加载
   */
  private async loadModuleWithTimeout(
    name: string,
    timeout: number
  ): Promise<DeviceModule> {
    const loadPromise = this.importModule(name)

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Module "${name}" load timeout`))
      }, timeout)
    })

    return Promise.race([loadPromise, timeoutPromise])
  }

  /**
   * 动态导入模块（优化内存使用）
   */
  private async importModule(name: string): Promise<DeviceModule> {
    // 使用动态导入减少初始包大小
    switch (name) {
      case 'network':
        const { NetworkModule } = await import('../modules/NetworkModule')
        return new NetworkModule()

      case 'battery':
        const { BatteryModule } = await import('../modules/BatteryModule')
        return new BatteryModule()

      case 'geolocation':
        const { GeolocationModule } = await import('../modules/GeolocationModule')
        return new GeolocationModule()

      case 'media':
        const { MediaModule } = await import('../modules/MediaModule')
        return new MediaModule()

      case 'clipboard':
        const { ClipboardModule } = await import('../modules/ClipboardModule')
        return new ClipboardModule()

      case 'vibration':
        const { VibrationModule } = await import('../modules/VibrationModule')
        return new VibrationModule()

      case 'wakeLock':
        const { WakeLockModule } = await import('../modules/WakeLockModule')
        return new WakeLockModule()

      case 'orientation':
        const { OrientationLockModule } = await import('../modules/OrientationLockModule')
        return new OrientationLockModule()

      case 'performance':
        const { PerformanceModule } = await import('../modules/PerformanceModule')
        return new PerformanceModule()

      case 'feature':
        const { FeatureDetectionModule } = await import('../modules/FeatureDetectionModule')
        return new FeatureDetectionModule()

      case 'mediaCapabilities':
        const { MediaCapabilitiesModule } = await import('../modules/MediaCapabilitiesModule')
        return new MediaCapabilitiesModule()

      default:
        throw new Error(`Unknown module: ${name}`)
    }
  }

  /**
   * 卸载模块（释放内存）
   */
  async unload(name: string): Promise<void> {
    const module = this.modules.get(name)
    if (!module) return

    // 调用模块的销毁方法
    if (typeof module.destroy === 'function') {
      try {
        await module.destroy()
      } catch (error) {
        console.error(`Error destroying module "${name}":`, error)
      }
    }

    // 清理引用
    this.modules.delete(name)
    this.loading.delete(name)

    // 从加载顺序中移除
    const index = this.loadOrder.indexOf(name)
    if (index !== -1) {
      this.loadOrder.splice(index, 1)
    }
  }

  /**
   * 卸载所有模块
   */
  async unloadAll(): Promise<void> {
    // 按相反的加载顺序卸载
    const modules = [...this.loadOrder].reverse()

    await Promise.allSettled(
      modules.map(name => this.unload(name))
    )

    // 清理所有状态
    this.modules.clear()
    this.loading.clear()
    this.loadOrder.length = 0
    this.loadQueue.length = 0
  }

  /**
   * 检查模块是否已加载
   */
  isLoaded(name: string): boolean {
    return this.modules.has(name)
  }

  /**
   * 获取已加载的模块列表
   */
  getLoadedModules(): string[] {
    return Array.from(this.modules.keys())
  }

  /**
   * 获取模块实例
   */
  getModule<T extends DeviceModule = DeviceModule>(name: string): T | undefined {
    return this.modules.get(name) as T | undefined
  }

  /**
   * 获取加载统计信息
   */
  getStats() {
    const stats: Record<string, any> = {
      loadedModules: this.modules.size,
      loadingModules: this.loading.size,
      queuedLoads: this.loadQueue.length,
      concurrentLoads: this.concurrentLoads,
      loadOrder: [...this.loadOrder],
      memoryUsage: this.estimateMemoryUsage()
    }

    // 添加各模块的状态
    this.modules.forEach((module, name) => {
      stats[`module_${name}`] = {
        loaded: true,
        hasData: typeof module.getData === 'function'
      }
    })

    return stats
  }

  /**
   * 估算内存使用（粗略估计）
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0

    this.modules.forEach(module => {
      // 基础大小估算
      totalSize += 1024 // 1KB 基础大小

      // 如果模块有数据，增加估算
      if (typeof module.getData === 'function') {
        try {
          const data = module.getData()
          totalSize += JSON.stringify(data).length * 2 // 字符串长度 * 2 (UTF-16)
        } catch { }
      }
    })

    return totalSize
  }

  /**
   * 优化加载顺序（基于历史）
   */
  optimizeLoadOrder(): void {
    // 统计模块加载频率
    const frequency = new Map<string, number>()

    this.loadOrder.forEach(name => {
      frequency.set(name, (frequency.get(name) || 0) + 1)
    })

    // 按频率排序预加载列表
    const sorted = Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3) // 预加载前3个最常用的模块

    this.preloadList.clear()
    sorted.forEach(([name]) => {
      this.preloadList.add(name)
      const config = this.moduleConfigs.get(name) || {}
      config.preload = true
      this.moduleConfigs.set(name, config)
    })
  }
}

