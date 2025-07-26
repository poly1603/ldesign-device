import type { Ref } from 'vue'
import { computed, defineComponent, inject, onMounted, onUnmounted, provide, reactive, ref } from 'vue'
import { getGlobalDeviceDetector } from './core'
import type { ReactiveDeviceOptions } from './reactive'
import { createMediaQueryListener, createReactiveDeviceListener, MEDIA_QUERIES } from './reactive'
import type {
  DeviceChangeEvent,
  DeviceDetectionConfig,
  DeviceInfo
} from './types'

/**
 * Vue3 设备信息组合式API
 */
export function useDevice(options: ReactiveDeviceOptions = {}) {
  // 响应式状态
  const deviceInfo = ref<DeviceInfo>({} as DeviceInfo)
  const isLoading = ref(true)
  const error = ref<Error | null>(null)

  // 监听器实例
  let listener: ReturnType<typeof createReactiveDeviceListener> | null = null
  let unsubscribe: (() => void) | null = null

  // 初始化
  const init = () => {
    listener = createReactiveDeviceListener({
      ...options,
      onError: (err) => {
        error.value = err
        options.onError?.(err)
      }
    })

    unsubscribe = listener.subscribe((state) => {
      deviceInfo.value = state.deviceInfo
      isLoading.value = state.isLoading
      error.value = state.error
    })
  }

  // 刷新设备信息
  const refresh = () => {
    listener?.refresh()
  }

  // 计算属性
  const isMobile = computed(() => deviceInfo.value.type === 'mobile')
  const isTablet = computed(() => deviceInfo.value.type === 'tablet')
  const isDesktop = computed(() => deviceInfo.value.type === 'desktop')
  const isPortrait = computed(() => deviceInfo.value.orientation === 'portrait')
  const isLandscape = computed(() => deviceInfo.value.orientation === 'landscape')
  const isTouchDevice = computed(() => deviceInfo.value.isTouchDevice)

  // 生命周期
  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    unsubscribe?.()
    listener?.destroy()
  })

  return {
    // 状态
    deviceInfo: deviceInfo as Ref<DeviceInfo>,
    isLoading,
    error,

    // 计算属性
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    isTouchDevice,

    // 方法
    refresh
  }
}

/**
 * 设备类型检测组合式API
 */
export function useDeviceType(options?: DeviceDetectionConfig) {
  const { deviceInfo } = useDevice(options)

  const deviceType = computed(() => deviceInfo.value.type)
  const isMobile = computed(() => deviceType.value === 'mobile')
  const isTablet = computed(() => deviceType.value === 'tablet')
  const isDesktop = computed(() => deviceType.value === 'desktop')

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop
  }
}

/**
 * 屏幕方向检测组合式API
 */
export function useOrientation(options?: DeviceDetectionConfig) {
  const { deviceInfo } = useDevice(options)

  const orientation = computed(() => deviceInfo.value.orientation)
  const isPortrait = computed(() => orientation.value === 'portrait')
  const isLandscape = computed(() => orientation.value === 'landscape')

  return {
    orientation,
    isPortrait,
    isLandscape
  }
}

/**
 * 屏幕尺寸检测组合式API
 */
export function useScreenSize(options?: DeviceDetectionConfig) {
  const { deviceInfo } = useDevice(options)

  const width = computed(() => deviceInfo.value.width)
  const height = computed(() => deviceInfo.value.height)
  const pixelRatio = computed(() => deviceInfo.value.pixelRatio)

  return {
    width,
    height,
    pixelRatio
  }
}

/**
 * 媒体查询组合式API
 */
export function useMediaQuery(query: string) {
  const matches = ref(false)
  let listener: ReturnType<typeof createMediaQueryListener> | null = null
  let unsubscribe: (() => void) | null = null

  const init = () => {
    listener = createMediaQueryListener(query)
    unsubscribe = listener.subscribe((isMatched) => {
      matches.value = isMatched
    })
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    unsubscribe?.()
    listener?.destroy()
  })

  return matches
}

/**
 * 响应式断点检测组合式API
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile)
  const isTablet = useMediaQuery(MEDIA_QUERIES.tablet)
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop)
  const isPortrait = useMediaQuery(MEDIA_QUERIES.portrait)
  const isLandscape = useMediaQuery(MEDIA_QUERIES.landscape)
  const isRetina = useMediaQuery(MEDIA_QUERIES.retina)
  const isDarkMode = useMediaQuery(MEDIA_QUERIES.darkMode)
  const isLightMode = useMediaQuery(MEDIA_QUERIES.lightMode)
  const prefersReducedMotion = useMediaQuery(MEDIA_QUERIES.reducedMotion)

  // 当前激活的断点
  const activeBreakpoint = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    if (isDesktop.value) return 'desktop'
    return 'unknown'
  })

  return {
    // 设备类型
    isMobile,
    isTablet,
    isDesktop,

    // 方向
    isPortrait,
    isLandscape,

    // 其他特性
    isRetina,
    isDarkMode,
    isLightMode,
    prefersReducedMotion,

    // 当前断点
    activeBreakpoint
  }
}

/**
 * 设备变化监听组合式API
 */
export function useDeviceChange(
  callback: (event: DeviceChangeEvent) => void,
  options?: DeviceDetectionConfig
) {
  let unsubscribe: (() => void) | null = null

  const startListening = () => {
    const detector = getGlobalDeviceDetector(options)
    unsubscribe = detector.onDeviceChange(callback)
  }

  const stopListening = () => {
    unsubscribe?.()
    unsubscribe = null
  }

  onMounted(() => {
    startListening()
  })

  onUnmounted(() => {
    stopListening()
  })

  return {
    startListening,
    stopListening
  }
}

/**
 * 自定义媒体查询组合式API
 */
export function useCustomMediaQuery(queries: Record<string, string>) {
  const results = reactive<Record<string, boolean>>({})

  const listeners: Array<{ key: string; listener: any; unsubscribe: () => void }> = []

  const init = () => {
    Object.entries(queries).forEach(([key, query]) => {
      const listener = createMediaQueryListener(query)
      const unsubscribe = listener.subscribe((matches) => {
        results[key] = matches
      })

      listeners.push({ key, listener, unsubscribe })
    })
  }

  const destroy = () => {
    listeners.forEach(({ listener, unsubscribe }) => {
      unsubscribe()
      listener.destroy()
    })
    listeners.length = 0
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    destroy()
  })

  return results
}

/**
 * 设备特性检测组合式API
 */
export function useDeviceFeatures(options?: DeviceDetectionConfig) {
  const { deviceInfo } = useDevice(options)

  const isTouchDevice = computed(() => deviceInfo.value.isTouchDevice)
  const hasHighDPI = computed(() => deviceInfo.value.pixelRatio > 1)
  const isSmallScreen = computed(() =>
    Math.min(deviceInfo.value.width, deviceInfo.value.height) < 768
  )
  const isLargeScreen = computed(() =>
    Math.min(deviceInfo.value.width, deviceInfo.value.height) >= 1024
  )

  return {
    isTouchDevice,
    hasHighDPI,
    isSmallScreen,
    isLargeScreen
  }
}

/**
 * 设备上下文 Key
 */
export const DEVICE_CONTEXT_KEY = Symbol('device-context')

/**
 * DeviceProvider 组件
 */
export const DeviceProvider = defineComponent({
  name: 'DeviceProvider',
  props: {
    config: {
      type: Object as () => DeviceDetectionConfig,
      default: () => ({})
    }
  },
  setup(props, { slots }) {
    const deviceContext = useDevice(props.config)

    // 提供设备上下文
    provide(DEVICE_CONTEXT_KEY, deviceContext)

    return () => slots.default?.()
  }
})

/**
 * 使用设备上下文
 */
export function useDeviceContext() {
  const context = inject(DEVICE_CONTEXT_KEY)
  if (!context) {
    throw new Error('useDeviceContext must be used within DeviceProvider')
  }
  return context
}
