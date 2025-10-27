/**
 * 媒体能力检测模块
 * 
 * 检测设备支持的音视频编解码器、HDR、高帧率等能力
 * 帮助应用根据设备能力选择合适的媒体格式和质量
 * 
 * @example
 * ```typescript
 * const detector = new DeviceDetector()
 * const mediaModule = await detector.loadModule<MediaCapabilitiesModule>('mediaCapabilities')
 * 
 * // 检测视频解码能力
 * const videoSupport = await mediaModule.checkVideoDecoding({
 *   contentType: 'video/mp4; codecs="avc1.42E01E"',
 *   width: 1920,
 *   height: 1080,
 *   bitrate: 5000000,
 *   framerate: 30
 * })
 * 
 * if (videoSupport.supported && videoSupport.smooth) {
 *   // 播放高质量视频
 * }
 * ```
 */

import type { DeviceModule } from '../types'
import { EventEmitter } from '../core/EventEmitter'

/**
 * 媒体配置信息
 */
export interface MediaConfig {
  /** 媒体类型，如 'video/mp4; codecs="avc1.42E01E"' */
  contentType: string
  /** 视频宽度 */
  width?: number
  /** 视频高度 */
  height?: number
  /** 比特率 */
  bitrate?: number
  /** 帧率 */
  framerate?: number
  /** 音频通道数 */
  channels?: number
  /** 音频采样率 */
  samplerate?: number
}

/**
 * 媒体能力信息
 */
export interface MediaCapabilityInfo {
  /** 是否支持 */
  supported: boolean
  /** 是否流畅播放 */
  smooth: boolean
  /** 是否省电 */
  powerEfficient: boolean
}

/**
 * HDR 支持信息
 */
export interface HDRSupport {
  /** 是否支持 HDR */
  supported: boolean
  /** 支持的 HDR 类型列表 */
  types: string[]
}

/**
 * 媒体能力检测模块事件
 */
export interface MediaCapabilitiesEvents extends Record<string, unknown> {
  capabilityChecked: MediaCapabilityInfo
}

/**
 * 媒体能力检测模块
 */
export class MediaCapabilitiesModule
  extends EventEmitter<MediaCapabilitiesEvents>
  implements DeviceModule {
  name = 'mediaCapabilities'
  private isInitialized = false

  /**
   * 初始化模块
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    // 检查是否支持 Media Capabilities API
    if (!this.isSupported()) {
      console.warn('Media Capabilities API is not supported in this browser')
    }

    this.isInitialized = true
  }

  /**
   * 销毁模块
   */
  async destroy(): Promise<void> {
    this.removeAllListeners()
    this.isInitialized = false
  }

  /**
   * 获取模块数据
   */
  getData(): { supported: boolean } {
    return {
      supported: this.isSupported(),
    }
  }

  /**
   * 检查是否支持 Media Capabilities API
   */
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'mediaCapabilities' in navigator
  }

  /**
   * 检测视频解码能力
   * 
   * @param config - 视频配置
   * @returns Promise<媒体能力信息>
   * 
   * @example
   * ```typescript
   * const support = await mediaModule.checkVideoDecoding({
   *   contentType: 'video/mp4; codecs="avc1.42E01E"',
   *   width: 1920,
   *   height: 1080,
   *   bitrate: 5000000,
   *   framerate: 30
   * })
   * ```
   */
  async checkVideoDecoding(config: MediaConfig): Promise<MediaCapabilityInfo> {
    if (!this.isSupported()) {
      // 降级方案：基本的格式检测
      return this.fallbackCheck(config.contentType)
    }

    try {
      const result = await navigator.mediaCapabilities.decodingInfo({
        type: 'file',
        video: {
          contentType: config.contentType,
          width: config.width ?? 1920,
          height: config.height ?? 1080,
          bitrate: config.bitrate ?? 5000000,
          framerate: config.framerate ?? 30,
        },
      })

      const info: MediaCapabilityInfo = {
        supported: result.supported,
        smooth: result.smooth,
        powerEfficient: result.powerEfficient,
      }

      this.emit('capabilityChecked', info)
      return info
    }
    catch (error) {
      console.warn('Failed to check video decoding capability:', error)
      return this.fallbackCheck(config.contentType)
    }
  }

  /**
   * 检测音频解码能力
   * 
   * @param config - 音频配置
   * @returns Promise<媒体能力信息>
   */
  async checkAudioDecoding(config: MediaConfig): Promise<MediaCapabilityInfo> {
    if (!this.isSupported()) {
      return this.fallbackCheck(config.contentType)
    }

    try {
      const result = await navigator.mediaCapabilities.decodingInfo({
        type: 'file',
        audio: {
          contentType: config.contentType,
          channels: config.channels ?? 2,
          bitrate: config.bitrate ?? 128000,
          samplerate: config.samplerate ?? 44100,
        },
      })

      const info: MediaCapabilityInfo = {
        supported: result.supported,
        smooth: result.smooth,
        powerEfficient: result.powerEfficient,
      }

      this.emit('capabilityChecked', info)
      return info
    }
    catch (error) {
      console.warn('Failed to check audio decoding capability:', error)
      return this.fallbackCheck(config.contentType)
    }
  }

  /**
   * 检测视频编码能力
   * 
   * @param config - 视频配置
   * @returns Promise<媒体能力信息>
   */
  async checkVideoEncoding(config: MediaConfig): Promise<MediaCapabilityInfo> {
    if (!this.isSupported()) {
      return this.fallbackCheck(config.contentType)
    }

    try {
      const result = await navigator.mediaCapabilities.encodingInfo({
        type: 'record',
        video: {
          contentType: config.contentType,
          width: config.width ?? 1920,
          height: config.height ?? 1080,
          bitrate: config.bitrate ?? 5000000,
          framerate: config.framerate ?? 30,
        },
      })

      const info: MediaCapabilityInfo = {
        supported: result.supported,
        smooth: result.smooth,
        powerEfficient: result.powerEfficient,
      }

      this.emit('capabilityChecked', info)
      return info
    }
    catch (error) {
      console.warn('Failed to check video encoding capability:', error)
      return this.fallbackCheck(config.contentType)
    }
  }

  /**
   * 检测 HDR 支持
   * 
   * @returns Promise<HDR支持信息>
   */
  async checkHDRSupport(): Promise<HDRSupport> {
    const supportedTypes: string[] = []

    // 检测 HDR10
    if (await this.checkHDRType('hdr10')) {
      supportedTypes.push('HDR10')
    }

    // 检测 HLG (Hybrid Log-Gamma)
    if (await this.checkHDRType('hlg')) {
      supportedTypes.push('HLG')
    }

    // 检测 Dolby Vision
    if (await this.checkHDRType('pq')) {
      supportedTypes.push('PQ')
    }

    return {
      supported: supportedTypes.length > 0,
      types: supportedTypes,
    }
  }

  /**
   * 检测特定 HDR 类型的支持
   */
  private async checkHDRType(type: string): Promise<boolean> {
    if (!this.isSupported()) {
      return false
    }

    try {
      // 使用 HEVC 编码的 HDR 视频进行测试
      const result = await navigator.mediaCapabilities.decodingInfo({
        type: 'file',
        video: {
          contentType: `video/mp4; codecs="hev1.2.4.L153.B0"; eotf="${type}"`,
          width: 1920,
          height: 1080,
          bitrate: 10000000,
          framerate: 30,
        },
      })

      return result.supported
    }
    catch {
      return false
    }
  }

  /**
   * 获取最大刷新率
   * 
   * @returns 最大刷新率（Hz）
   */
  getMaxRefreshRate(): number {
    if (typeof window === 'undefined' || !window.screen) {
      return 60
    }

    // 检查 Screen 对象是否有 refreshRate 属性（实验性 API）
    type ScreenWithRefreshRate = Screen & { refreshRate?: number }
    const screen = window.screen as ScreenWithRefreshRate

    if (typeof screen.refreshRate === 'number') {
      return screen.refreshRate
    }

    // 降级方案：通过 requestAnimationFrame 检测
    return this.detectRefreshRateViaRAF()
  }

  /**
   * 通过 requestAnimationFrame 检测刷新率
   */
  private detectRefreshRateViaRAF(): number {
    // 默认返回 60Hz
    // 实际检测需要多帧采样，这里简化为默认值
    // 真实实现可以使用 requestAnimationFrame 计算帧间隔
    return 60
  }

  /**
   * 降级检查（基于媒体类型字符串的简单检测）
   */
  private fallbackCheck(contentType: string): MediaCapabilityInfo {
    // 检测浏览器是否支持该媒体类型
    let supported = false

    if (typeof document !== 'undefined') {
      // 使用 HTMLMediaElement.canPlayType 作为降级方案
      const video = document.createElement('video')
      const canPlay = video.canPlayType(contentType)
      supported = canPlay === 'probably' || canPlay === 'maybe'
    }

    return {
      supported,
      smooth: supported, // 降级方案中假设支持就是流畅的
      powerEfficient: false, // 无法判断，默认false
    }
  }

  /**
   * 批量检测多个媒体配置
   * 
   * @param configs - 媒体配置数组
   * @returns Promise<媒体能力信息数组>
   */
  async checkMultiple(configs: MediaConfig[]): Promise<MediaCapabilityInfo[]> {
    const results = await Promise.all(
      configs.map(config => this.checkVideoDecoding(config)),
    )
    return results
  }

  /**
   * 获取推荐的视频质量
   * 
   * 根据设备能力返回推荐的视频质量配置
   * 
   * @returns Promise<推荐的视频配置>
   */
  async getRecommendedVideoQuality(): Promise<{
    resolution: string
    bitrate: number
    framerate: number
  }> {
    // 测试不同质量级别
    const qualities = [
      {
        name: '4K',
        config: {
          contentType: 'video/mp4; codecs="avc1.640033"',
          width: 3840,
          height: 2160,
          bitrate: 25000000,
          framerate: 60,
        },
      },
      {
        name: '1080p60',
        config: {
          contentType: 'video/mp4; codecs="avc1.640028"',
          width: 1920,
          height: 1080,
          bitrate: 10000000,
          framerate: 60,
        },
      },
      {
        name: '1080p',
        config: {
          contentType: 'video/mp4; codecs="avc1.42E01E"',
          width: 1920,
          height: 1080,
          bitrate: 5000000,
          framerate: 30,
        },
      },
      {
        name: '720p',
        config: {
          contentType: 'video/mp4; codecs="avc1.42E01E"',
          width: 1280,
          height: 720,
          bitrate: 2500000,
          framerate: 30,
        },
      },
      {
        name: '480p',
        config: {
          contentType: 'video/mp4; codecs="avc1.42E01E"',
          width: 854,
          height: 480,
          bitrate: 1000000,
          framerate: 30,
        },
      },
    ]

    // 从高到低测试，找到第一个支持且流畅的配置
    for (const quality of qualities) {
      const result = await this.checkVideoDecoding(quality.config)
      if (result.supported && result.smooth) {
        return {
          resolution: quality.name,
          bitrate: quality.config.bitrate!,
          framerate: quality.config.framerate!,
        }
      }
    }

    // 默认返回 480p
    return {
      resolution: '480p',
      bitrate: 1000000,
      framerate: 30,
    }
  }
}


