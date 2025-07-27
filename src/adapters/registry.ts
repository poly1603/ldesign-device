import type { AdapterFactory, AdapterRegistry, FrameworkDetectionResult } from './types'
import { FrameworkDetector } from './types'

/**
 * 适配器注册表实现
 */
export class AdapterRegistryImpl implements AdapterRegistry {
  private adapters = new Map<string, AdapterFactory>()

  /**
   * 注册适配器
   */
  register(name: string, factory: AdapterFactory): void {
    this.adapters.set(name, factory)
  }

  /**
   * 获取适配器
   */
  get(name: string): AdapterFactory | undefined {
    return this.adapters.get(name)
  }

  /**
   * 获取所有适配器
   */
  getAll(): Map<string, AdapterFactory> {
    return new Map(this.adapters)
  }

  /**
   * 自动检测并获取适配器
   */
  detect(): AdapterFactory | undefined {
    const frameworks = FrameworkDetector.detect()

    for (const framework of frameworks) {
      const adapter = this.adapters.get(framework.name)
      if (adapter && adapter.isCompatible()) {
        return adapter
      }
    }

    return undefined
  }

  /**
   * 清空注册表
   */
  clear(): void {
    this.adapters.clear()
  }

  /**
   * 获取支持的框架列表
   */
  getSupportedFrameworks(): string[] {
    return Array.from(this.adapters.keys())
  }

  /**
   * 检查框架是否支持
   */
  isSupported(framework: string): boolean {
    const adapter = this.adapters.get(framework)
    return adapter ? adapter.isCompatible() : false
  }
}

/**
 * 全局适配器注册表实例
 */
export const globalAdapterRegistry = new AdapterRegistryImpl()

/**
 * 注册适配器的便捷函数
 */
export function registerAdapter(name: string, factory: AdapterFactory): void {
  globalAdapterRegistry.register(name, factory)
}

/**
 * 获取适配器的便捷函数
 */
export function getAdapter(name: string): AdapterFactory | undefined {
  return globalAdapterRegistry.get(name)
}

/**
 * 自动检测适配器的便捷函数
 */
export function detectAdapter(): AdapterFactory | undefined {
  return globalAdapterRegistry.detect()
}

/**
 * 获取所有支持的框架
 */
export function getSupportedFrameworks(): string[] {
  return globalAdapterRegistry.getSupportedFrameworks()
}

/**
 * 检查框架支持情况
 */
export function checkFrameworkSupport(): FrameworkDetectionResult[] {
  return FrameworkDetector.detect()
}
