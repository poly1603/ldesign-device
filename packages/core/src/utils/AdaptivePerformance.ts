/**
 * 自适应性能配置
 * 
 * 根据设备性能自动调整应用配置，提供最佳用户体验
 * 
 * @example
 * ```typescript
 * const detector = new DeviceDetector()
 * const performanceModule = await detector.loadModule<PerformanceModule>('performance')
 * 
 * const adaptive = new AdaptivePerformance(performanceModule)
 * const config = adaptive.getRecommendedConfig()
 * 
 * // 应用配置
 * app.setAnimationQuality(config.animationQuality)
 * app.setImageQuality(config.imageQuality)
 * ```
 */

import type { DevicePerformanceInfo } from '../modules/PerformanceModule'
import type { PerformanceModule } from '../modules/PerformanceModule'

/**
 * 动画质量等级
 */
export type AnimationQuality = 'low' | 'medium' | 'high' | 'ultra'

/**
 * 自适应配置选项
 */
export interface AdaptiveConfig {
  /** 动画质量等级 */
  animationQuality: AnimationQuality
  /** 图片质量 (0-1) */
  imageQuality: number
  /** 是否启用阴影 */
  enableShadows: boolean
  /** 最大粒子数 */
  maxParticles: number
  /** 是否启用抗锯齿 */
  enableAntialiasing: boolean
  /** 最大纹理尺寸 */
  maxTextureSize: number
  /** 是否启用后处理效果 */
  enablePostProcessing: boolean
  /** 渲染缩放比例 (0.5-1) */
  renderScale: number
  /** FPS 目标 */
  targetFPS: number
  /** 是否启用物理模拟 */
  enablePhysics: boolean
}

/**
 * 预设配置模板
 */
const PRESET_CONFIGS: Record<'low' | 'medium' | 'high' | 'ultra', AdaptiveConfig> = {
  low: {
    animationQuality: 'low',
    imageQuality: 0.6,
    enableShadows: false,
    maxParticles: 50,
    enableAntialiasing: false,
    maxTextureSize: 512,
    enablePostProcessing: false,
    renderScale: 0.75,
    targetFPS: 30,
    enablePhysics: false,
  },
  medium: {
    animationQuality: 'medium',
    imageQuality: 0.75,
    enableShadows: false,
    maxParticles: 200,
    enableAntialiasing: false,
    maxTextureSize: 1024,
    enablePostProcessing: false,
    renderScale: 0.85,
    targetFPS: 60,
    enablePhysics: true,
  },
  high: {
    animationQuality: 'high',
    imageQuality: 0.9,
    enableShadows: true,
    maxParticles: 500,
    enableAntialiasing: true,
    maxTextureSize: 2048,
    enablePostProcessing: true,
    renderScale: 1.0,
    targetFPS: 60,
    enablePhysics: true,
  },
  ultra: {
    animationQuality: 'ultra',
    imageQuality: 1.0,
    enableShadows: true,
    maxParticles: 1000,
    enableAntialiasing: true,
    maxTextureSize: 4096,
    enablePostProcessing: true,
    renderScale: 1.0,
    targetFPS: 120,
    enablePhysics: true,
  },
}

/**
 * 自适应性能配置类
 */
export class AdaptivePerformance {
  private performanceModule: PerformanceModule
  private currentConfig: AdaptiveConfig | null = null

  constructor(performanceModule: PerformanceModule) {
    this.performanceModule = performanceModule
  }

  /**
   * 获取推荐配置
   * 
   * @returns 推荐的配置
   */
  getRecommendedConfig(): AdaptiveConfig {
    const tier = this.performanceModule.getTier()
    this.currentConfig = { ...PRESET_CONFIGS[tier] }
    return this.currentConfig
  }

  /**
   * 获取自定义配置（基于详细性能指标）
   * 
   * @returns 自定义配置
   */
  getCustomConfig(): AdaptiveConfig {
    const perfInfo = this.performanceModule.getData()
    const config: AdaptiveConfig = {
      animationQuality: this.calculateAnimationQuality(perfInfo),
      imageQuality: this.calculateImageQuality(perfInfo),
      enableShadows: this.shouldEnableShadows(perfInfo),
      maxParticles: this.calculateMaxParticles(perfInfo),
      enableAntialiasing: this.shouldEnableAntialiasing(perfInfo),
      maxTextureSize: this.calculateMaxTextureSize(perfInfo),
      enablePostProcessing: this.shouldEnablePostProcessing(perfInfo),
      renderScale: this.calculateRenderScale(perfInfo),
      targetFPS: this.calculateTargetFPS(perfInfo),
      enablePhysics: this.shouldEnablePhysics(perfInfo),
    }

    this.currentConfig = config
    return config
  }

  /**
   * 获取当前配置
   */
  getCurrentConfig(): AdaptiveConfig | null {
    return this.currentConfig
  }

  /**
   * 计算动画质量
   */
  private calculateAnimationQuality(perfInfo: DevicePerformanceInfo): AnimationQuality {
    const score = perfInfo.score

    if (score >= 80)
      return 'ultra'
    if (score >= 60)
      return 'high'
    if (score >= 40)
      return 'medium'
    return 'low'
  }

  /**
   * 计算图片质量
   */
  private calculateImageQuality(perfInfo: DevicePerformanceInfo): number {
    const score = perfInfo.score

    // 线性映射: 0-100 分数 -> 0.5-1.0 质量
    return Math.max(0.5, Math.min(1.0, 0.5 + (score / 100) * 0.5))
  }

  /**
   * 是否应该启用阴影
   */
  private shouldEnableShadows(perfInfo: DevicePerformanceInfo): boolean {
    return perfInfo.metrics.gpu >= 60 && perfInfo.score >= 60
  }

  /**
   * 计算最大粒子数
   */
  private calculateMaxParticles(perfInfo: DevicePerformanceInfo): number {
    const score = perfInfo.score

    if (score >= 80)
      return 1000
    if (score >= 60)
      return 500
    if (score >= 40)
      return 200
    return 50
  }

  /**
   * 是否应该启用抗锯齿
   */
  private shouldEnableAntialiasing(perfInfo: DevicePerformanceInfo): boolean {
    return perfInfo.metrics.gpu >= 70 && perfInfo.hardware.deviceMemory >= 4
  }

  /**
   * 计算最大纹理尺寸
   */
  private calculateMaxTextureSize(perfInfo: DevicePerformanceInfo): number {
    const gpuScore = perfInfo.metrics.gpu
    const memoryGB = perfInfo.hardware.deviceMemory

    if (gpuScore >= 80 && memoryGB >= 8)
      return 4096
    if (gpuScore >= 60 && memoryGB >= 4)
      return 2048
    if (gpuScore >= 40)
      return 1024
    return 512
  }

  /**
   * 是否应该启用后处理效果
   */
  private shouldEnablePostProcessing(perfInfo: DevicePerformanceInfo): boolean {
    return perfInfo.metrics.gpu >= 65 && perfInfo.score >= 60
  }

  /**
   * 计算渲染缩放比例
   */
  private calculateRenderScale(perfInfo: DevicePerformanceInfo): number {
    const score = perfInfo.score

    if (score >= 70)
      return 1.0
    if (score >= 50)
      return 0.9
    if (score >= 30)
      return 0.8
    return 0.75
  }

  /**
   * 计算目标 FPS
   */
  private calculateTargetFPS(perfInfo: DevicePerformanceInfo): number {
    const score = perfInfo.score

    if (score >= 85)
      return 120
    if (score >= 50)
      return 60
    return 30
  }

  /**
   * 是否应该启用物理模拟
   */
  private shouldEnablePhysics(perfInfo: DevicePerformanceInfo): boolean {
    return perfInfo.metrics.cpu >= 50 && perfInfo.score >= 40
  }

  /**
   * 应用配置到对象
   * 
   * @param target - 目标对象
   * @param config - 要应用的配置（可选，默认使用当前配置）
   * 
   * @example
   * ```typescript
   * const config = adaptive.getRecommendedConfig()
   * adaptive.applyConfig(app, config)
   * ```
   */
  applyConfig(
    target: Record<string, unknown>,
    config?: AdaptiveConfig,
  ): void {
    const configToApply = config || this.currentConfig

    if (!configToApply) {
      throw new Error('No configuration available. Call getRecommendedConfig() first.')
    }

    Object.assign(target, configToApply)
  }

  /**
   * 获取配置建议
   * 
   * @returns 配置建议字符串数组
   */
  getConfigRecommendations(): string[] {
    if (!this.currentConfig) {
      return ['请先调用 getRecommendedConfig() 或 getCustomConfig() 生成配置']
    }

    const recommendations: string[] = []
    const perfInfo = this.performanceModule.getData()

    // 基于性能等级的建议
    switch (perfInfo.tier) {
      case 'low':
        recommendations.push('设备性能较低，建议：')
        recommendations.push('- 减少同时显示的动画元素')
        recommendations.push('- 使用低分辨率图片资源')
        recommendations.push('- 禁用复杂的视觉效果')
        break
      case 'medium':
        recommendations.push('设备性能中等，建议：')
        recommendations.push('- 可以使用适量的动画效果')
        recommendations.push('- 图片质量设为中等')
        recommendations.push('- 选择性启用视觉效果')
        break
      case 'high':
        recommendations.push('设备性能良好，建议：')
        recommendations.push('- 可以启用高质量动画')
        recommendations.push('- 使用高清图片资源')
        recommendations.push('- 启用大部分视觉效果')
        break
      case 'ultra':
        recommendations.push('设备性能优秀，建议：')
        recommendations.push('- 启用所有高级特性')
        recommendations.push('- 使用最高质量资源')
        recommendations.push('- 可以启用实验性功能')
        break
    }

    // 具体指标建议
    if (perfInfo.metrics.gpu < 50) {
      recommendations.push('GPU 性能较低，避免使用复杂的 3D 渲染和后处理效果')
    }

    if (perfInfo.metrics.memory < 50) {
      recommendations.push('内存有限，注意及时清理不用的对象和缓存')
    }

    if (perfInfo.metrics.network < 50) {
      recommendations.push('网络较慢，启用资源懒加载和渐进式加载')
    }

    return recommendations
  }

  /**
   * 监听性能变化并自动调整配置
   * 
   * @param callback - 配置更新时的回调函数
   */
  enableAutoAdjust(callback?: (config: AdaptiveConfig) => void): void {
    this.performanceModule.on('performanceChange', () => {
      const newConfig = this.getRecommendedConfig()
      callback?.(newConfig)
    })
  }

  /**
   * 比较两个配置的差异
   * 
   * @param config1 - 第一个配置
   * @param config2 - 第二个配置
   * @returns 差异描述数组
   */
  static compareConfigs(
    config1: AdaptiveConfig,
    config2: AdaptiveConfig,
  ): string[] {
    const differences: string[] = []

    for (const key in config1) {
      const k = key as keyof AdaptiveConfig
      if (config1[k] !== config2[k]) {
        differences.push(`${key}: ${config1[k]} -> ${config2[k]}`)
      }
    }

    return differences
  }
}

/**
 * 创建自适应性能配置实例
 * 
 * @param performanceModule - PerformanceModule 实例
 * @returns AdaptivePerformance 实例
 */
export function createAdaptivePerformance(
  performanceModule: PerformanceModule,
): AdaptivePerformance {
  return new AdaptivePerformance(performanceModule)
}

