import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { DeviceInfo, DeviceType, Orientation } from '@ldesign/device-core'

/**
 * 设备检测 Hook (Solid.js)
 * 
 * @example
 * ```tsx
 * import { useDevice } from '@ldesign/device-solid'
 * 
 * function App() {
 *   const { deviceType, isMobile, isTablet, isDesktop } = useDevice()
 *   
 *   return (
 *     <div>
 *       <p>设备类型: {deviceType()}</p>
 *       <p>是否移动设备: {isMobile() ? '是' : '否'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useDevice() {
  const [deviceInfo, setDeviceInfo] = createSignal<DeviceInfo>({
    type: 'desktop',
    orientation: 'landscape',
    width: 0,
    height: 0,
    pixelRatio: 1,
    isTouchDevice: false,
    userAgent: '',
    os: { name: 'unknown', version: 'unknown' },
    browser: { name: 'unknown', version: 'unknown' },
  })

  const [deviceType, setDeviceType] = createSignal<DeviceType>('desktop')
  const [orientation, setOrientation] = createSignal<Orientation>('landscape')
  const [isMobile, setIsMobile] = createSignal(false)
  const [isTablet, setIsTablet] = createSignal(false)
  const [isDesktop, setIsDesktop] = createSignal(true)
  const [isTouchDevice, setIsTouchDevice] = createSignal(false)

  function detectDevice() {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const height = window.innerHeight

    // 设备类型检测
    let type: DeviceType
    if (width < 768) {
      type = 'mobile'
      setIsMobile(true)
      setIsTablet(false)
      setIsDesktop(false)
    }
    else if (width < 1024) {
      type = 'tablet'
      setIsMobile(false)
      setIsTablet(true)
      setIsDesktop(false)
    }
    else {
      type = 'desktop'
      setIsMobile(false)
      setIsTablet(false)
      setIsDesktop(true)
    }

    const orient: Orientation = width > height ? 'landscape' : 'portrait'
    const touch = 'ontouchstart' in window

    setDeviceType(type)
    setOrientation(orient)
    setIsTouchDevice(touch)

    setDeviceInfo({
      type,
      orientation: orient,
      width,
      height,
      pixelRatio: window.devicePixelRatio || 1,
      isTouchDevice: touch,
      userAgent: navigator.userAgent,
      os: { name: 'unknown', version: 'unknown' },
      browser: { name: 'unknown', version: 'unknown' },
    })
  }

  createEffect(() => {
    detectDevice()

    window.addEventListener('resize', detectDevice)
    onCleanup(() => {
      window.removeEventListener('resize', detectDevice)
    })
  })

  return {
    deviceInfo: deviceInfo as Accessor<DeviceInfo>,
    deviceType: deviceType as Accessor<DeviceType>,
    orientation: orientation as Accessor<Orientation>,
    isMobile: isMobile as Accessor<boolean>,
    isTablet: isTablet as Accessor<boolean>,
    isDesktop: isDesktop as Accessor<boolean>,
    isTouchDevice: isTouchDevice as Accessor<boolean>,
  }
}

