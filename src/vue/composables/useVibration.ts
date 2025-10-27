/**
 * Vue3 Vibration Composable
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useVibration } from '@ldesign/device/vue'
 * 
 * const { vibrate, vibratePattern, stop, isSupported } = useVibration()
 * 
 * function onSuccess() {
 *   vibratePattern('success')
 * }
 * </script>
 * ```
 */

import type { Ref } from 'vue'
import type { VibrationPatternName } from '../../modules/VibrationModule'
import { onUnmounted, ref, readonly } from 'vue'
import { DeviceDetector } from '../../core/DeviceDetector'
import { VibrationModule } from '../../modules/VibrationModule'

export interface UseVibrationReturn {
  /** 是否支持振动 API */
  isSupported: Readonly<Ref<boolean>>
  /** 是否正在振动 */
  isVibrating: Readonly<Ref<boolean>>
  /** 是否已加载模块 */
  isLoaded: Readonly<Ref<boolean>>
  /** 触发振动 */
  vibrate: (pattern: number | number[]) => boolean
  /** 使用预设模式振动 */
  vibratePattern: (name: VibrationPatternName) => boolean
  /** 停止振动 */
  stop: () => boolean
  /** 获取可用模式 */
  getPatterns: () => VibrationPatternName[]
}

/**
 * Vue3 Vibration Composable
 */
export function useVibration(): UseVibrationReturn {
  const isSupported = ref(false)
  const isVibrating = ref(false)
  const isLoaded = ref(false)

  let detector: DeviceDetector | null = null
  let module: VibrationModule | null = null

  const loadModule = async () => {
    if (!detector) {
      detector = new DeviceDetector()
    }

    try {
      module = await detector.loadModule<VibrationModule>('vibration')
      isSupported.value = module.isSupported()
      isLoaded.value = true

      // 监听振动事件
      module.on('vibrationStart', () => {
        isVibrating.value = true
      })

      module.on('vibrationEnd', () => {
        isVibrating.value = false
      })
    }
    catch (error) {
      console.warn('Failed to load vibration module:', error)
      throw error
    }
  }

  const vibrate = (pattern: number | number[]) => {
    if (!module) {
      console.warn('Module not loaded')
      return false
    }
    return module.vibrate(pattern)
  }

  const vibratePattern = (name: VibrationPatternName) => {
    if (!module) {
      console.warn('Module not loaded')
      return false
    }
    return module.vibratePattern(name)
  }

  const stop = () => {
    if (!module) {
      return false
    }
    return module.stop()
  }

  const getPatterns = () => {
    if (!module) {
      return []
    }
    return module.getAvailablePatterns()
  }

  // 自动加载模块
  loadModule().catch(() => {
    // 加载失败时静默处理
  })

  onUnmounted(async () => {
    if (module) {
      stop()
    }
    if (detector) {
      await detector.destroy()
      detector = null
      module = null
    }
  })

  return {
    isSupported: readonly(isSupported),
    isVibrating: readonly(isVibrating),
    isLoaded: readonly(isLoaded),
    vibrate,
    vibratePattern,
    stop,
    getPatterns,
  }
}

