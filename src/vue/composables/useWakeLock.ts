/**
 * Vue3 Wake Lock Composable
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useWakeLock } from '@ldesign/device/vue'
 * 
 * const { isActive, request, release, isSupported } = useWakeLock()
 * 
 * async function playVideo() {
 *   await request()
 *   video.play()
 * }
 * </script>
 * ```
 */

import type { Ref } from 'vue'
import { onUnmounted, ref, readonly } from 'vue'
import { DeviceDetector } from '../../core/DeviceDetector'
import { WakeLockModule } from '../../modules/WakeLockModule'

export interface UseWakeLockReturn {
  /** 是否支持 Wake Lock API */
  isSupported: Readonly<Ref<boolean>>
  /** Wake Lock 是否激活 */
  isActive: Readonly<Ref<boolean>>
  /** 是否已加载模块 */
  isLoaded: Readonly<Ref<boolean>>
  /** 请求 Wake Lock */
  request: () => Promise<boolean>
  /** 释放 Wake Lock */
  release: () => Promise<void>
  /** 启用自动重新获取 */
  enableAutoReacquire: (enable: boolean) => void
}

/**
 * Vue3 Wake Lock Composable
 */
export function useWakeLock(): UseWakeLockReturn {
  const isSupported = ref(false)
  const isActive = ref(false)
  const isLoaded = ref(false)

  let detector: DeviceDetector | null = null
  let module: WakeLockModule | null = null

  const loadModule = async () => {
    if (!detector) {
      detector = new DeviceDetector()
    }

    try {
      module = await detector.loadModule<WakeLockModule>('wakeLock')
      isSupported.value = module.isSupported()
      isActive.value = module.isActive()
      isLoaded.value = true

      // 监听事件
      module.on('acquired', () => {
        isActive.value = true
      })

      module.on('released', () => {
        isActive.value = false
      })
    }
    catch (error) {
      console.warn('Failed to load wake lock module:', error)
      throw error
    }
  }

  const request = async () => {
    if (!module) {
      await loadModule()
    }
    const success = await module!.requestWakeLock()
    isActive.value = module!.isActive()
    return success
  }

  const release = async () => {
    if (!module) {
      return
    }
    await module.releaseWakeLock()
    isActive.value = false
  }

  const enableAutoReacquire = (enable: boolean) => {
    if (!module) {
      console.warn('Module not loaded')
      return
    }
    module.enableAutoReacquire(enable)
  }

  onUnmounted(async () => {
    if (module) {
      await release()
    }
    if (detector) {
      await detector.destroy()
      detector = null
      module = null
    }
  })

  return {
    isSupported: readonly(isSupported),
    isActive: readonly(isActive),
    isLoaded: readonly(isLoaded),
    request,
    release,
    enableAutoReacquire,
  }
}

