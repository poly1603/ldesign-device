/**
 * Vue3 媒体能力检�?Composable
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useMediaCapabilities } from '@ldesign/device/vue'
 * 
 * const { checkVideo, getRecommendedQuality, checkHDR } = useMediaCapabilities()
 * 
 * const videoSupport = await checkVideo({
 *   contentType: 'video/mp4',
 *   width: 1920,
 *   height: 1080,
 *   bitrate: 5000000,
 *   framerate: 30
 * })
 * </script>
 * ```
 */

import type { Ref } from 'vue'
import type { MediaCapabilityInfo, MediaConfig } from '@ldesign/device-core'
import type { HDRSupport } from '@ldesign/device-core'
import { onUnmounted, ref, readonly } from 'vue'
import { DeviceDetector } from '@ldesign/device-core'
import { MediaCapabilitiesModule } from '@ldesign/device-core'

export interface UseMediaCapabilitiesReturn {
  /** 是否支持 Media Capabilities API */
  isSupported: Readonly<Ref<boolean>>
  /** 是否已加载模�?*/
  isLoaded: Readonly<Ref<boolean>>
  /** 检测视频解码能�?*/
  checkVideo: (config: MediaConfig) => Promise<MediaCapabilityInfo>
  /** 检测音频解码能�?*/
  checkAudio: (config: MediaConfig) => Promise<MediaCapabilityInfo>
  /** 获取推荐视频质量 */
  getRecommendedQuality: () => Promise<{ resolution: string, bitrate: number, framerate: number }>
  /** 检�?HDR 支持 */
  checkHDR: () => Promise<HDRSupport>
  /** 加载模块 */
  loadModule: () => Promise<void>
  /** 卸载模块 */
  unloadModule: () => Promise<void>
}

/**
 * Vue3 媒体能力检�?Composable
 */
export function useMediaCapabilities(): UseMediaCapabilitiesReturn {
  const isSupported = ref(false)
  const isLoaded = ref(false)

  let detector: DeviceDetector | null = null
  let module: MediaCapabilitiesModule | null = null

  const loadModule = async () => {
    if (!detector) {
      detector = new CoreDeviceDetector()
    }

    try {
      module = await detector.loadModule<MediaCapabilitiesModule>('mediaCapabilities')
      isSupported.value = module.isSupported()
      isLoaded.value = true
    }
    catch (error) {
      console.warn('Failed to load media capabilities module:', error)
      throw error
    }
  }

  const unloadModule = async () => {
    if (detector) {
      await detector.unloadModule('mediaCapabilities')
      module = null
      isLoaded.value = false
    }
  }

  const checkVideo = async (config: MediaConfig) => {
    if (!module) {
      await loadModule()
    }
    return module!.checkVideoDecoding(config)
  }

  const checkAudio = async (config: MediaConfig) => {
    if (!module) {
      await loadModule()
    }
    return module!.checkAudioDecoding(config)
  }

  const getRecommendedQuality = async () => {
    if (!module) {
      await loadModule()
    }
    return module!.getRecommendedVideoQuality()
  }

  const checkHDR = async () => {
    if (!module) {
      await loadModule()
    }
    return module!.checkHDRSupport()
  }

  onUnmounted(async () => {
    if (detector) {
      await detector.destroy()
      detector = null
      module = null
    }
  })

  return {
    isSupported: readonly(isSupported),
    isLoaded: readonly(isLoaded),
    checkVideo,
    checkAudio,
    getRecommendedQuality,
    checkHDR,
    loadModule,
    unloadModule,
  }
}

