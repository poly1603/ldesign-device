import type { Ref } from 'vue'
import type { GeolocationInfo, GeolocationModule } from '../../types'
import { computed, onUnmounted, readonly, ref } from 'vue'
import { DeviceDetector } from '@ldesign/device-core'

/**
 * 地理位置检�?Composition API
 *
 * 提供设备地理位置获取、位置监听、精度控制等功能的响应式接口
 *
 * @returns 地理位置相关的响应式数据和方�?
 *
 * @example
 * ```vue
 * <script setup>
 * import { useGeolocation } from '@ldesign/device/vue'
 *
 * const {
 *   position,
 *   latitude,
 *   longitude,
 *   accuracy,
 *   error,
 *   isSupported,
 *   isWatching,
 *   isLoaded,
 *   loadModule,
 *   getCurrentPosition,
 *   startWatching,
 *   stopWatching
 * } = useGeolocation()
 *
 * // 加载地理位置模块
 * onMounted(async () => {
 *   try {
 *     await loadModule()
 *     if (isSupported.value) {
 *       await getCurrentPosition()
 *     }
 *   } catch (error) {
 *     console.warn('无法获取地理位置:', error)
 *   }
 * })
 * </script>
 *
 * <template>
 *   <div>
 *     <div v-if="!isSupported">
 *       <p>设备不支持地理位�?API</p>
 *     </div>
 *     <div v-else-if="error">
 *       <p>获取位置失败: {{ error }}</p>
 *       <button @click="getCurrentPosition">重试</button>
 *     </div>
 *     <div v-else-if="position">
 *       <h3>当前位置</h3>
 *       <p>纬度: {{ latitude?.toFixed(6) }}</p>
 *       <p>经度: {{ longitude?.toFixed(6) }}</p>
 *       <p>精度: {{ accuracy }}�?/p>
 *       <div>
 *         <button v-if="!isWatching" @click="startWatching">
 *           开始监听位置变�?
 *         </button>
 *         <button v-else @click="stopWatching">
 *           停止监听位置变化
 *         </button>
 *       </div>
 *     </div>
 *     <div v-else>
 *       <p>正在获取位置信息...</p>
 *     </div>
 *   </div>
 * </template>
 * ```
 */
export function useGeolocation() {
  const position = ref<GeolocationInfo | null>(null) as Ref<GeolocationInfo | null>
  const latitude = ref<number | null>(null)
  const longitude = ref<number | null>(null)
  const accuracy = ref<number | null>(null)
  const altitude = ref<number | null>(null)
  const heading = ref<number | null>(null)
  const speed = ref<number | null>(null)
  const error = ref<string | null>(null)
  const isSupported = ref(false)
  const isLoaded = ref(false)
  const isWatching = ref(false)
  const isLoading = ref(false)

  let detector: DeviceDetector | null = null
  let geolocationModule: GeolocationModule | null = null
  let cleanupFunctions: Array<() => void> = []

  /**
   * 更新位置信息
   */
  const updatePosition = (pos: GeolocationInfo) => {
    position.value = pos
    latitude.value = pos.latitude
    longitude.value = pos.longitude
    accuracy.value = pos.accuracy
    altitude.value = pos.altitude ?? null
    heading.value = pos.heading ?? null
    speed.value = pos.speed ?? null
    error.value = null
  }

  /**
   * 加载地理位置模块
   */
  const loadModule = async () => {
    if (!detector) {
      detector = new CoreDeviceDetector()
    }

    try {
      geolocationModule = await detector.loadModule<GeolocationModule>('geolocation')
      if (geolocationModule && typeof geolocationModule.isSupported === 'function') {
        isSupported.value = geolocationModule.isSupported()
        isLoaded.value = true
        error.value = null
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load geolocation module'
      console.warn('Failed to load geolocation module:', err)
      throw err
    }
  }

  /**
   * 停止监听位置变化
   */
  const stopWatching = async () => {
    if (!geolocationModule || !isWatching.value)
      return

    try {
      if (geolocationModule && typeof geolocationModule.stopWatching === 'function') {
        geolocationModule.stopWatching()
        isWatching.value = false
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to stop watching position'
      throw err
    }
  }

  /**
   * 卸载地理位置模块
   */
  const unloadModule = async () => {
    // 停止监听
    if (isWatching.value) {
      await stopWatching()
    }

    // 清理事件监听�?
    cleanupFunctions.forEach(cleanup => cleanup())
    cleanupFunctions = []

    if (detector) {
      await detector.unloadModule('geolocation')
      geolocationModule = null
      position.value = null
      latitude.value = null
      longitude.value = null
      accuracy.value = null
      altitude.value = null
      heading.value = null
      speed.value = null
      isLoaded.value = false
      error.value = null
    }
  }

  /**
   * 获取当前位置
   */
  const getCurrentPosition = async (options?: PositionOptions) => {
    if (!geolocationModule) {
      await loadModule()
    }

    isLoading.value = true
    try {
      if (!isSupported.value) {
        const err = new Error('Geolocation is not supported')
        error.value = err.message
        throw err
      }

      if (geolocationModule && typeof geolocationModule.getCurrentPosition === 'function') {
        const pos = await geolocationModule.getCurrentPosition(options)
        updatePosition(pos)
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get current position'
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * 开始监听位置变�?
   */
  const startWatching = async () => {
    if (!geolocationModule || isWatching.value) {
      if (!geolocationModule) {
        await loadModule()
      }
      if (isWatching.value)
        return
    }

    if (!isSupported.value) {
      throw new Error('Geolocation is not supported')
    }

    try {
      if (geolocationModule && typeof geolocationModule.startWatching === 'function') {
        const positionHandler = (pos: GeolocationInfo) => {
          updatePosition(pos)
        }

        geolocationModule.startWatching(positionHandler)
        isWatching.value = true
        error.value = null

        // 保存清理函数
        cleanupFunctions.push(() => {
          if (geolocationModule && typeof geolocationModule.stopWatching === 'function') {
            geolocationModule.stopWatching()
          }
        })
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to start watching position'
      throw err
    }
  }

  /**
   * 销毁地理位置检测器
   */
  const destroyGeolocation = async () => {
    await unloadModule()
    if (detector) {
      await detector.destroy()
      detector = null
    }
  }

  // 计算属�?
  const hasPosition = computed(() => position.value !== null)
  const isHighAccuracy = computed(() => (accuracy.value ?? 0) < 100)
  const coordinates = computed(() => {
    if (!latitude.value || !longitude.value)
      return null
    return {
      lat: latitude.value,
      lng: longitude.value,
    }
  })

  onUnmounted(() => {
    destroyGeolocation()
  })

  return {
    position: readonly(position),
    latitude: readonly(latitude),
    longitude: readonly(longitude),
    accuracy: readonly(accuracy),
    altitude: readonly(altitude),
    heading: readonly(heading),
    speed: readonly(speed),
    error: readonly(error),
    isSupported: readonly(isSupported),
    isWatching: readonly(isWatching),
    isLoaded: readonly(isLoaded),
    isLoading: readonly(isLoading),
    hasPosition,
    isHighAccuracy,
    coordinates,
    loadModule,
    unloadModule,
    getCurrentPosition,
    startWatching,
    stopWatching,
  }
}
