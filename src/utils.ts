import type { DeviceDetectionConfig, DeviceType, Orientation } from './types'
import { DEFAULT_DEVICE_CONFIG, DeviceType as DeviceTypeEnum, Orientation as OrientationEnum } from './types'

/**
 * 获取当前屏幕尺寸
 */
export function getScreenSize(): { width: number, height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
  }
}

/**
 * 获取设备像素比
 */
export function getPixelRatio(): number {
  if (typeof window === 'undefined') {
    return 1
  }

  return window.devicePixelRatio || 1
}

/**
 * 检测是否为触摸设备
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return (
    'ontouchstart' in window
    || navigator.maxTouchPoints > 0
    // @ts-ignore - 兼容旧版本
    || navigator.msMaxTouchPoints > 0
  )
}

/**
 * 获取用户代理字符串
 */
export function getUserAgent(): string {
  if (typeof navigator === 'undefined') {
    return ''
  }

  return navigator.userAgent || ''
}

/**
 * 基于用户代理检测设备类型
 */
export function detectDeviceTypeByUserAgent(userAgent: string): DeviceType | null {
  const ua = userAgent.toLowerCase()

  // 移动设备检测
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
  if (mobileRegex.test(ua)) {
    // iPad 特殊处理
    if (/ipad/i.test(ua)) {
      return DeviceTypeEnum.TABLET
    }
    // Android 平板检测
    if (/android/i.test(ua) && !/mobile/i.test(ua)) {
      return DeviceTypeEnum.TABLET
    }
    return DeviceTypeEnum.MOBILE
  }

  // 平板设备检测
  const tabletRegex = /tablet|ipad|playbook|silk/i
  if (tabletRegex.test(ua)) {
    return DeviceTypeEnum.TABLET
  }

  return null
}

/**
 * 基于屏幕尺寸检测设备类型
 */
export function detectDeviceTypeByScreenSize(
  width: number,
  height: number,
  config: DeviceDetectionConfig = {},
): DeviceType {
  const { tabletMinWidth, desktopMinWidth } = { ...DEFAULT_DEVICE_CONFIG, ...config }

  // 使用较小的尺寸作为判断依据（考虑横竖屏切换）
  const minDimension = Math.min(width, height)

  if (minDimension >= desktopMinWidth) {
    return DeviceTypeEnum.DESKTOP
  }
 else if (minDimension >= tabletMinWidth) {
    return DeviceTypeEnum.TABLET
  }
 else {
    return DeviceTypeEnum.MOBILE
  }
}

/**
 * 综合检测设备类型
 */
export function detectDeviceType(
  width: number,
  height: number,
  userAgent: string,
  config: DeviceDetectionConfig = {},
): DeviceType {
  const { enableUserAgentDetection } = { ...DEFAULT_DEVICE_CONFIG, ...config }

  // 优先使用用户代理检测
  if (enableUserAgentDetection) {
    const uaResult = detectDeviceTypeByUserAgent(userAgent)
    if (uaResult) {
      return uaResult
    }
  }

  // 回退到屏幕尺寸检测
  return detectDeviceTypeByScreenSize(width, height, config)
}

/**
 * 检测屏幕方向
 */
export function detectOrientation(width: number, height: number): Orientation {
  return width > height ? OrientationEnum.LANDSCAPE : OrientationEnum.PORTRAIT
}

/**
 * 获取屏幕方向（使用原生API）
 */
export function getScreenOrientation(): Orientation {
  if (typeof window === 'undefined') {
    return OrientationEnum.PORTRAIT
  }

  // 优先使用 Screen Orientation API
  if (screen.orientation) {
    const angle = screen.orientation.angle
    return (angle === 90 || angle === 270) ? OrientationEnum.LANDSCAPE : OrientationEnum.PORTRAIT
  }

  // 回退到 window.orientation
  if (typeof window.orientation !== 'undefined') {
    const angle = Math.abs(window.orientation)
    return angle === 90 ? OrientationEnum.LANDSCAPE : OrientationEnum.PORTRAIT
  }

  // 最后使用屏幕尺寸判断
  const { width, height } = getScreenSize()
  return detectOrientation(width, height)
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let lastTime = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}
