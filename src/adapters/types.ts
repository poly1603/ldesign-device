import type { DeviceDetectionConfig } from '../types'

/**
 * 框架适配器接口
 */
export interface FrameworkAdapter {
  /** 适配器名称 */
  name: string
  /** 适配器版本 */
  version: string
  /** 初始化适配器 */
  init: (config?: DeviceDetectionConfig) => void
  /** 销毁适配器 */
  destroy: () => void
}

/**
 * 响应式适配器接口
 */
export interface ReactiveAdapter extends FrameworkAdapter {
  /** 创建响应式设备信息 */
  createReactiveDeviceInfo: (config?: DeviceDetectionConfig) => any
  /** 创建响应式设备类型 */
  createReactiveDeviceType: (config?: DeviceDetectionConfig) => any
  /** 创建响应式屏幕方向 */
  createReactiveOrientation: (config?: DeviceDetectionConfig) => any
}

/**
 * 组件适配器接口
 */
export interface ComponentAdapter extends FrameworkAdapter {
  /** 创建设备信息组件 */
  createDeviceInfoComponent: (props?: any) => any
  /** 创建设备提供者组件 */
  createDeviceProviderComponent: (props?: any) => any
}

/**
 * 指令适配器接口
 */
export interface DirectiveAdapter extends FrameworkAdapter {
  /** 注册设备相关指令 */
  registerDirectives: () => void
  /** 创建条件渲染指令 */
  createConditionalDirective: (condition: string) => any
}

/**
 * 完整的框架适配器接口
 */
export interface FullFrameworkAdapter extends ReactiveAdapter, ComponentAdapter, DirectiveAdapter {
  /** 安装适配器到框架实例 */
  install: (app: any, options?: DeviceDetectionConfig) => void
}

/**
 * 适配器工厂接口
 */
export interface AdapterFactory {
  /** 创建适配器实例 */
  create: (config?: DeviceDetectionConfig) => FullFrameworkAdapter
  /** 检查框架兼容性 */
  isCompatible: () => boolean
  /** 获取支持的框架版本 */
  getSupportedVersions: () => string[]
}

/**
 * 适配器注册表
 */
export interface AdapterRegistry {
  /** 注册适配器 */
  register: (name: string, factory: AdapterFactory) => void
  /** 获取适配器 */
  get: (name: string) => AdapterFactory | undefined
  /** 获取所有适配器 */
  getAll: () => Map<string, AdapterFactory>
  /** 自动检测并获取适配器 */
  detect: () => AdapterFactory | undefined
}

/**
 * 适配器配置
 */
export interface AdapterConfig extends DeviceDetectionConfig {
  /** 适配器名称 */
  adapter?: string
  /** 是否自动检测适配器 */
  autoDetect?: boolean
  /** 自定义适配器选项 */
  adapterOptions?: Record<string, any>
}

/**
 * 框架检测结果
 */
export interface FrameworkDetectionResult {
  /** 框架名称 */
  name: string
  /** 框架版本 */
  version: string
  /** 是否支持 */
  supported: boolean
  /** 置信度 (0-1) */
  confidence: number
}

/**
 * 抽象适配器基类
 */
export abstract class BaseAdapter implements FrameworkAdapter {
  abstract name: string
  abstract version: string

  protected config: DeviceDetectionConfig = {}
  protected isInitialized = false

  init(config?: DeviceDetectionConfig): void {
    this.config = { ...this.config, ...config }
    this.isInitialized = true
  }

  destroy(): void {
    this.isInitialized = false
    this.config = {}
  }

  protected checkInitialized(): void {
    if (!this.isInitialized) {
      throw new Error(`${this.name} adapter is not initialized`)
    }
  }
}

/**
 * 框架检测工具
 */
export class FrameworkDetector {
  /**
   * 检测当前运行的框架
   */
  static detect(): FrameworkDetectionResult[] {
    const results: FrameworkDetectionResult[] = []

    if (typeof window === 'undefined') {
      return results
    }

    const win = window as any

    // 检测 Vue
    if (win.Vue) {
      const vue = win.Vue
      if (vue.version) {
        if (vue.version.startsWith('3.')) {
          results.push({
            name: 'vue3',
            version: vue.version,
            supported: true,
            confidence: 0.9,
          })
        }
 else if (vue.version.startsWith('2.')) {
          results.push({
            name: 'vue2',
            version: vue.version,
            supported: false, // 暂未实现
            confidence: 0.9,
          })
        }
      }
    }

    // 检测 React
    if (win.React) {
      const react = win.React
      results.push({
        name: 'react',
        version: react.version || 'unknown',
        supported: false, // 暂未实现
        confidence: 0.8,
      })
    }

    return results.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * 获取最佳匹配的框架
   */
  static getBestMatch(): FrameworkDetectionResult | null {
    const results = this.detect()
    return results.find(r => r.supported) || results[0] || null
  }
}
