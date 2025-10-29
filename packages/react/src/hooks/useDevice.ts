import { useState, useEffect } from 'react'
import type { DeviceInfo, DeviceType, Orientation } from '@ldesign/device-core'

/**
 * 设备检测 Hook
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { deviceType, isMobile, isTablet, isDesktop } = useDevice()
 *   
 *   return (
 *     <div>
 *       <p>设备类型: {deviceType}</p>
 *       <p>是否移动设备: {isMobile ? '是' : '否'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
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

  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')
  const [orientation, setOrientation] = useState<Orientation>('landscape')
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    function detectDevice() {
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

    detectDevice()

    window.addEventListener('resize', detectDevice)
    return () => {
      window.removeEventListener('resize', detectDevice)
    }
  }, [])

  return {
    deviceInfo,
    deviceType,
    orientation,
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
  }
}

