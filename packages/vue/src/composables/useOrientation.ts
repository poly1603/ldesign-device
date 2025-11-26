import type { Ref } from 'vue'
import type { DeviceDetectorOptions, DeviceInfo, Orientation, OrientationLockType } from '../../types'
import { computed, onMounted, onUnmounted, readonly, ref } from 'vue'
import { DeviceDetector } from '@ldesign/device-core'

/**
 * 屏幕方向检�?Composition API
 *
 * 提供屏幕方向检测和变化监听功能
 *
 * @param options 设备检测器配置选项
 * @returns 屏幕方向相关的响应式数据和方�?
 *
 * @example
 * ```vue
 * <script setup>
 * import { useOrientation } from '@ldesign/device/vue'
 *
 * const {
 *   orientation,
 *   isPortrait,
 *   isLandscape,
 *   angle,
 *   lockOrientation,
 *   unlockOrientation,
 *   refresh
 * } = useOrientation({
 *   enableOrientation: true
 * })
 *
 * // 监听方向变化
 * watch(orientation, (newOrientation) => {
 *   
 * })
 * </script>
 *
 * <template>
 *   <div>
 *     <p>当前方向: {{ orientation }}</p>
 *     <p>是否竖屏: {{ isPortrait }}</p>
 *     <p>是否横屏: {{ isLandscape }}</p>
 *     <p>旋转角度: {{ angle }}°</p>
 *
 *     <button @click="lockOrientation('portrait')">锁定竖屏</button>
 *     <button @click="lockOrientation('landscape')">锁定横屏</button>
 *     <button @click="unlockOrientation">解锁方向</button>
 *   </div>
 * </template>
 * ```
 */
export function useOrientation(options: DeviceDetectorOptions = {}) {
  // 响应式状�?
  const orientation = ref<Orientation>('landscape') as Ref<Orientation>
  const angle = ref(0)
  const isLocked = ref(false)
  const error = ref<string | null>(null)

  // 设备检测器实例
  let detector: DeviceDetector | null = null
  let isInitialized = false
  let cleanupFunctions: Array<() => void> = []

  // 计算属�?
  const isPortrait = readonly(computed(() => orientation.value === 'portrait'))
  const isLandscape = readonly(computed(() => orientation.value === 'landscape'))
  const isPrimaryPortrait = readonly(computed(() => angle.value === 0))
  const isSecondaryPortrait = readonly(computed(() => angle.value === 180))
  const isPrimaryLandscape = readonly(computed(() => angle.value === 90))
  const isSecondaryLandscape = readonly(computed(() => angle.value === 270))

  /**
   * 更新方向信息
   */
  const updateOrientation = (deviceInfo: DeviceInfo) => {
    if (orientation.value !== deviceInfo.orientation) {
      orientation.value = deviceInfo.orientation
    }

    // 更新角度信息
    if (typeof screen !== 'undefined' && screen.orientation) {
      angle.value = screen.orientation.angle || 0
    }
  }

  /**
   * 刷新方向信息
   */
  const refresh = () => {
    if (detector && isInitialized) {
      const currentInfo = detector.getDeviceInfo()
      updateOrientation(currentInfo)
    }
  }

  /**
   * 锁定屏幕方向
   */
  const lockOrientation = async (targetOrientation: OrientationLockType) => {
    try {
      if (typeof screen !== 'undefined' && (screen as any).orientation && typeof (screen as any).orientation.lock === 'function') {
        await (screen as any).orientation.lock(targetOrientation)
        isLocked.value = true
        error.value = null
      }
      else {
        throw new Error('Screen orientation lock is not supported')
      }
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to lock orientation'
      error.value = message
      console.warn('Failed to lock orientation:', err)
      throw err
    }
  }

  /**
   * 解锁屏幕方向
   */
  const unlockOrientation = () => {
    try {
      if (typeof screen !== 'undefined' && (screen as any).orientation && typeof (screen as any).orientation.unlock === 'function') {
        (screen as any).orientation.unlock()
        isLocked.value = false
        error.value = null
      }
      else {
        throw new Error('Screen orientation unlock is not supported')
      }
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unlock orientation'
      error.value = message
      console.warn('Failed to unlock orientation:', err)
      throw err
    }
  }

  /**
   * 检查是否支持方向锁�?
   */
  const isOrientationLockSupported = computed(() => {
    return typeof screen !== 'undefined'
      && (screen as any).orientation
      && typeof (screen as any).orientation.lock === 'function'
  })

  /**
   * 获取支持的方向列�?
   */
  const getSupportedOrientations = (): OrientationLockType[] => {
    // 标准的方向类�?
    return [
      'portrait-primary',
      'portrait-secondary',
      'landscape-primary',
      'landscape-secondary',
      'portrait',
      'landscape',
      'natural',
    ]
  }

  /**
   * 初始化方向检测器
   */
  const initDetector = () => {
    if (detector || isInitialized) {
      return
    }

    try {
      detector = new CoreDeviceDetector({
        enableOrientation: true,
        ...options,
      })
      isInitialized = true

      // 获取初始方向信息
      updateOrientation(detector.getDeviceInfo())

      // 监听方向变化
      const orientationChangeHandler = (newOrientation: Orientation) => {
        if (orientation.value !== newOrientation) {
          orientation.value = newOrientation
        }
      }

      const deviceChangeHandler = (deviceInfo: DeviceInfo) => {
        updateOrientation(deviceInfo)
      }

      detector.on('orientationChange', orientationChangeHandler)
      detector.on('deviceChange', deviceChangeHandler)

      // 监听原生方向变化事件
      const handleOrientationChange = () => {
        if (typeof screen !== 'undefined' && screen.orientation) {
          angle.value = screen.orientation.angle || 0
        }
        refresh()
      }

      if (typeof screen !== 'undefined' && screen.orientation) {
        screen.orientation.addEventListener('change', handleOrientationChange)
        cleanupFunctions.push(() => {
          screen.orientation.removeEventListener('change', handleOrientationChange)
        })
      }

      // 保存清理函数
      cleanupFunctions.push(
        () => detector?.off('orientationChange', orientationChangeHandler),
        () => detector?.off('deviceChange', deviceChangeHandler),
      )
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize orientation detector'
      error.value = message
      console.error('Failed to initialize orientation detector:', err)
      isInitialized = false
    }
  }

  /**
   * 销毁方向检测器
   */
  const destroyDetector = async () => {
    try {
      // 解锁方向（如果已锁定�?
      if (isLocked.value) {
        try {
          unlockOrientation()
        }
        catch {
          // 忽略解锁错误
        }
      }

      // 清理事件监听�?
      cleanupFunctions.forEach(cleanup => cleanup())
      cleanupFunctions = []

      // 销毁检测器
      if (detector) {
        await detector.destroy()
        detector = null
      }

      isInitialized = false
    }
    catch (err) {
      console.error('Failed to destroy orientation detector:', err)
    }
  }

  // 生命周期钩子
  onMounted(() => {
    initDetector()
  })

  onUnmounted(() => {
    destroyDetector()
  })

  return {
    orientation: readonly(orientation),
    angle: readonly(angle),
    isLocked: readonly(isLocked),
    error: readonly(error),
    isPortrait,
    isLandscape,
    isPrimaryPortrait,
    isSecondaryPortrait,
    isPrimaryLandscape,
    isSecondaryLandscape,
    isOrientationLockSupported,
    lockOrientation,
    unlockOrientation,
    getSupportedOrientations,
    refresh,
  }
}
