/**
 * Vue3 Orientation Lock Composable
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useOrientationLock } from '@ldesign/device/vue'
 * 
 * const { 
 *   lock, 
 *   unlock, 
 *   isLocked, 
 *   currentOrientation 
 * } = useOrientationLock()
 * 
 * async function playFullscreenVideo() {
 *   await lock('landscape')
 *   video.requestFullscreen()
 * }
 * </script>
 * ```
 */

import type { Ref } from 'vue'
import type { OrientationLockType } from '../../types'
import { onUnmounted, ref, readonly } from 'vue'
import { DeviceDetector } from '../../core/DeviceDetector'
import { OrientationLockModule } from '../../modules/OrientationLockModule'

export interface UseOrientationLockReturn {
  /** 是否支持 Screen Orientation API */
  isSupported: Readonly<Ref<boolean>>
  /** 是否已锁定方向 */
  isLocked: Readonly<Ref<boolean>>
  /** 当前屏幕方向 */
  currentOrientation: Readonly<Ref<string | null>>
  /** 当前屏幕角度 */
  currentAngle: Readonly<Ref<number | null>>
  /** 是否横屏 */
  isLandscape: Readonly<Ref<boolean>>
  /** 是否竖屏 */
  isPortrait: Readonly<Ref<boolean>>
  /** 是否已加载模块 */
  isLoaded: Readonly<Ref<boolean>>
  /** 锁定屏幕方向 */
  lock: (orientation: OrientationLockType) => Promise<boolean>
  /** 解除锁定 */
  unlock: () => void
  /** 锁定为横屏 */
  lockLandscape: () => Promise<boolean>
  /** 锁定为竖屏 */
  lockPortrait: () => Promise<boolean>
}

/**
 * Vue3 Orientation Lock Composable
 */
export function useOrientationLock(): UseOrientationLockReturn {
  const isSupported = ref(false)
  const isLocked = ref(false)
  const currentOrientation = ref<string | null>(null)
  const currentAngle = ref<number | null>(null)
  const isLandscape = ref(false)
  const isPortrait = ref(false)
  const isLoaded = ref(false)

  let detector: DeviceDetector | null = null
  let module: OrientationLockModule | null = null

  const updateOrientationInfo = () => {
    if (!module) return

    const info = module.getOrientationInfo()
    currentOrientation.value = info.type
    currentAngle.value = info.angle
    isLandscape.value = info.isLandscape
    isPortrait.value = info.isPortrait
    isLocked.value = info.isLocked
  }

  const loadModule = async () => {
    if (!detector) {
      detector = new DeviceDetector()
    }

    try {
      module = await detector.loadModule<OrientationLockModule>('orientationLock')
      isSupported.value = module.isSupported()
      isLoaded.value = true

      // 更新初始状态
      updateOrientationInfo()

      // 监听事件
      module.on('locked', () => {
        isLocked.value = true
      })

      module.on('unlocked', () => {
        isLocked.value = false
      })

      module.on('orientationChange', () => {
        updateOrientationInfo()
      })
    }
    catch (error) {
      console.warn('Failed to load orientation lock module:', error)
      throw error
    }
  }

  const lock = async (orientation: OrientationLockType) => {
    if (!module) {
      await loadModule()
    }
    const success = await module!.lock(orientation)
    updateOrientationInfo()
    return success
  }

  const unlock = () => {
    if (!module) {
      console.warn('Module not loaded')
      return
    }
    module.unlock()
    updateOrientationInfo()
  }

  const lockLandscape = async () => {
    return lock('landscape')
  }

  const lockPortrait = async () => {
    return lock('portrait')
  }

  onUnmounted(async () => {
    if (module) {
      unlock()
    }
    if (detector) {
      await detector.destroy()
      detector = null
      module = null
    }
  })

  return {
    isSupported: readonly(isSupported),
    isLocked: readonly(isLocked),
    currentOrientation: readonly(currentOrientation),
    currentAngle: readonly(currentAngle),
    isLandscape: readonly(isLandscape),
    isPortrait: readonly(isPortrait),
    isLoaded: readonly(isLoaded),
    lock,
    unlock,
    lockLandscape,
    lockPortrait,
  }
}

