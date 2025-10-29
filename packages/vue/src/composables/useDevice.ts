import { ref, readonly, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { DeviceInfo, DeviceType, Orientation } from '@ldesign/device-core'

/**
 * 设备检测 Composable
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useDevice } from '@ldesign/device-vue'
 * 
 * const { deviceType, isMobile, isTablet, isDesktop } = useDevice()
 * </script>
 * ```
 */
export function useDevice() {
  const deviceInfo = ref<DeviceInfo>({
    type: 'desktop',
    orientation: 'landscape',
    width: 0,
    height: 0,
    pixelRatio: 1,
    isTouchDevice: false,
    userAgent: '',
    os: { name: 'unknown', version: 'unknown' },
    browser: { name: 'unknown', version: 'unknown' },
  }) as Ref<DeviceInfo>

  const deviceType = ref<DeviceType>('desktop')
  const orientation = ref<Orientation>('landscape')
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(true)
  const isTouchDevice = ref(false)

  function detectDevice() {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const height = window.innerHeight

    // 简单的设备类型检测
    if (width < 768) {
      deviceType.value = 'mobile'
      isMobile.value = true
      isTablet.value = false
      isDesktop.value = false
    }
    else if (width < 1024) {
      deviceType.value = 'tablet'
      isMobile.value = false
      isTablet.value = true
      isDesktop.value = false
    }
    else {
      deviceType.value = 'desktop'
      isMobile.value = false
      isTablet.value = false
      isDesktop.value = true
    }

    orientation.value = width > height ? 'landscape' : 'portrait'
    isTouchDevice.value = 'ontouchstart' in window

    deviceInfo.value = {
      type: deviceType.value,
      orientation: orientation.value,
      width,
      height,
      pixelRatio: window.devicePixelRatio || 1,
      isTouchDevice: isTouchDevice.value,
      userAgent: navigator.userAgent,
      os: { name: 'unknown', version: 'unknown' },
      browser: { name: 'unknown', version: 'unknown' },
    }
  }

  let resizeObserver: (() => void) | null = null

  onMounted(() => {
    detectDevice()

    const handler = () => detectDevice()
    window.addEventListener('resize', handler)
    resizeObserver = () => window.removeEventListener('resize', handler)
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver()
    }
  })

  return {
    deviceInfo: readonly(deviceInfo),
    deviceType: readonly(deviceType),
    orientation: readonly(orientation),
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isDesktop: readonly(isDesktop),
    isTouchDevice: readonly(isTouchDevice),
    refresh: detectDevice,
  }
}

