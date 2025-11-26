import type { DeviceDetectorOptions, DeviceInfo } from '../../types'
import { computed, onMounted, onUnmounted, readonly, ref } from 'vue'
import { DeviceDetector } from '@ldesign/device-core'

/**
 * 断点配置接口
 */
export interface BreakpointConfig {
  /** 移动设备断点 */
  mobile: number
  /** 平板设备断点 */
  tablet: number
  /** 桌面设备断点 */
  desktop: number
  /** 大屏设备断点 */
  xl?: number
  /** 超大屏设备断�?*/
  xxl?: number
}

/**
 * 默认断点配置
 */
const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
  xl: 1400,
  xxl: 1600,
}

/**
 * 响应式断点管�?Composition API
 *
 * 提供基于屏幕宽度的响应式断点检测和管理功能
 *
 * @param breakpoints 自定义断点配�?
 * @param options 设备检测器配置选项
 * @returns 断点相关的响应式数据和方�?
 *
 * @example
 * ```vue
 * <script setup>
 * import { useBreakpoints } from '@ldesign/device/vue'
 *
 * const {
 *   current,
 *   width,
 *   height,
 *   isMobile,
 *   isTablet,
 *   isDesktop,
 *   isXL,
 *   isXXL,
 *   greaterThan,
 *   lessThan,
 *   between,
 *   breakpoints
 * } = useBreakpoints({
 *   mobile: 768,
 *   tablet: 1024,
 *   desktop: 1200
 * })
 *
 * // 监听断点变化
 * watch(current, (newBreakpoint) => {
 *   
 * })
 * </script>
 *
 * <template>
 *   <div>
 *     <p>当前断点: {{ current }}</p>
 *     <p>屏幕宽度: {{ width }}px</p>
 *     <p>屏幕高度: {{ height }}px</p>
 *
 *     <div v-if="isMobile">移动端布局</div>
 *     <div v-else-if="isTablet">平板布局</div>
 *     <div v-else-if="isDesktop">桌面布局</div>
 *
 *     <div v-if="greaterThan('tablet')">大于平板尺寸</div>
 *     <div v-if="between('tablet', 'desktop')">平板到桌面之�?/div>
 *   </div>
 * </template>
 * ```
 */
export function useBreakpoints(
  breakpoints: Partial<BreakpointConfig> = {},
  options: DeviceDetectorOptions = {},
) {
  // 合并断点配置
  const config = { ...DEFAULT_BREAKPOINTS, ...breakpoints }

  // 响应式状�?
  const width = ref(0)
  const height = ref(0)
  const current = ref<keyof BreakpointConfig>('mobile')

  // 设备检测器实例
  let detector: DeviceDetector | null = null
  let isInitialized = false
  let cleanupFunctions: Array<() => void> = []

  /**
   * 根据宽度确定当前断点
   */
  const getCurrentBreakpoint = (screenWidth: number): keyof BreakpointConfig => {
    if (config.xxl && screenWidth >= config.xxl)
      return 'xxl'
    if (config.xl && screenWidth >= config.xl)
      return 'xl'
    if (screenWidth >= config.desktop)
      return 'desktop'
    if (screenWidth >= config.tablet)
      return 'tablet'
    return 'mobile'
  }

  /**
   * 更新屏幕尺寸和断�?
   */
  const updateDimensions = (deviceInfo: DeviceInfo) => {
    const newWidth = deviceInfo.screen.width
    const newHeight = deviceInfo.screen.height
    const newBreakpoint = getCurrentBreakpoint(newWidth)

    // 只在值真正改变时更新
    if (width.value !== newWidth) {
      width.value = newWidth
    }
    if (height.value !== newHeight) {
      height.value = newHeight
    }
    if (current.value !== newBreakpoint) {
      current.value = newBreakpoint
    }
  }

  // 计算属�?- 断点检�?
  const isMobile = readonly(computed(() => current.value === 'mobile'))
  const isTablet = readonly(computed(() => current.value === 'tablet'))
  const isDesktop = readonly(computed(() => current.value === 'desktop'))
  const isXL = readonly(computed(() => current.value === 'xl'))
  const isXXL = readonly(computed(() => current.value === 'xxl'))

  // 计算属�?- 屏幕尺寸类别
  const isSmallScreen = readonly(computed(() => width.value < config.tablet))
  const isMediumScreen = readonly(computed(() =>
    width.value >= config.tablet && width.value < config.desktop,
  ))
  const isLargeScreen = readonly(computed(() => width.value >= config.desktop))

  // 计算属�?- 屏幕比例
  const aspectRatio = readonly(computed(() =>
    height.value > 0 ? width.value / height.value : 0,
  ))
  const isWideScreen = readonly(computed(() => aspectRatio.value > 1.5))
  const isSquareScreen = readonly(computed(() =>
    Math.abs(aspectRatio.value - 1) < 0.2,
  ))

  /**
   * 检查当前断点是否大于指定断�?
   */
  const greaterThan = (breakpoint: keyof BreakpointConfig): boolean => {
    const breakpointOrder: (keyof BreakpointConfig)[] = ['mobile', 'tablet', 'desktop', 'xl', 'xxl']
    const currentIndex = breakpointOrder.indexOf(current.value)
    const targetIndex = breakpointOrder.indexOf(breakpoint)
    return currentIndex > targetIndex
  }

  /**
   * 检查当前断点是否小于指定断�?
   */
  const lessThan = (breakpoint: keyof BreakpointConfig): boolean => {
    const breakpointOrder: (keyof BreakpointConfig)[] = ['mobile', 'tablet', 'desktop', 'xl', 'xxl']
    const currentIndex = breakpointOrder.indexOf(current.value)
    const targetIndex = breakpointOrder.indexOf(breakpoint)
    return currentIndex < targetIndex
  }

  /**
   * 检查当前断点是否在指定范围�?
   */
  const between = (
    minBreakpoint: keyof BreakpointConfig,
    maxBreakpoint: keyof BreakpointConfig,
  ): boolean => {
    const breakpointOrder: (keyof BreakpointConfig)[] = ['mobile', 'tablet', 'desktop', 'xl', 'xxl']
    const currentIndex = breakpointOrder.indexOf(current.value)
    const minIndex = breakpointOrder.indexOf(minBreakpoint)
    const maxIndex = breakpointOrder.indexOf(maxBreakpoint)
    return currentIndex >= minIndex && currentIndex <= maxIndex
  }

  /**
   * 检查当前宽度是否匹配指定断�?
   */
  const matches = (breakpoint: keyof BreakpointConfig): boolean => {
    return current.value === breakpoint
  }

  /**
   * 获取断点对应的像素�?
   */
  const getBreakpointValue = (breakpoint: keyof BreakpointConfig): number => {
    return config[breakpoint] || 0
  }

  /**
   * 刷新尺寸信息
   */
  const refresh = () => {
    if (detector && isInitialized) {
      const currentInfo = detector.getDeviceInfo()
      updateDimensions(currentInfo)
    }
  }

  /**
   * 初始化断点检测器
   */
  const initDetector = () => {
    if (detector || isInitialized) {
      return
    }

    try {
      detector = new CoreDeviceDetector({
        enableResize: true,
        breakpoints: config,
        ...options,
      })
      isInitialized = true

      // 获取初始尺寸信息
      updateDimensions(detector.getDeviceInfo())

      // 监听设备变化
      const deviceChangeHandler = (deviceInfo: DeviceInfo) => {
        updateDimensions(deviceInfo)
      }

      detector.on('deviceChange', deviceChangeHandler)

      // 保存清理函数
      cleanupFunctions.push(
        () => detector?.off('deviceChange', deviceChangeHandler),
      )
    }
    catch (error) {
      console.error('Failed to initialize breakpoint detector:', error)
      isInitialized = false
    }
  }

  /**
   * 销毁断点检测器
   */
  const destroyDetector = async () => {
    try {
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
    catch (error) {
      console.error('Failed to destroy breakpoint detector:', error)
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
    // 基本状�?
    current: readonly(current),
    width: readonly(width),
    height: readonly(height),

    // 断点检�?
    isMobile,
    isTablet,
    isDesktop,
    isXL,
    isXXL,

    // 屏幕尺寸类别
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,

    // 屏幕比例
    aspectRatio,
    isWideScreen,
    isSquareScreen,

    // 断点比较方法
    greaterThan: readonly(computed(() => greaterThan)),
    lessThan: readonly(computed(() => lessThan)),
    between: readonly(computed(() => between)),
    matches: readonly(computed(() => matches)),

    // 工具方法
    getBreakpointValue,
    refresh,

    // 配置信息
    breakpoints: readonly(ref(config)),
  }
}
