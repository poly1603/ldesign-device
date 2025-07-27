import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FeatureDetector, getExtendedDeviceInfo, getGlobalFeatureDetector } from '../src/core/FeatureDetector'

// Mock Navigator interfaces
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  platform: 'Win32',
  hardwareConcurrency: 8,
  onLine: true,
}

const mockNetworkInfo = {
  type: '4g',
  effectiveType: '4g',
  downlink: 10,
  rtt: 100,
  saveData: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

const mockBatteryManager = {
  charging: true,
  level: 0.8,
  chargingTime: 3600,
  dischargingTime: Infinity,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

describe('featureDetector', () => {
  let detector: FeatureDetector

  beforeEach(() => {
    // Mock global objects
    vi.stubGlobal('navigator', mockNavigator)
    vi.stubGlobal('document', {
      createElement: vi.fn(() => ({
        getContext: vi.fn(() => ({
          getExtension: vi.fn(() => ({
            UNMASKED_RENDERER_WEBGL: 'NVIDIA GeForce RTX 3080',
          })),
          getParameter: vi.fn(() => 'NVIDIA GeForce RTX 3080'),
        })),
      })),
    })

    detector = new FeatureDetector()
  })

  afterEach(() => {
    detector.destroy()
    vi.unstubAllGlobals()
  })

  describe('oS Detection', () => {
    it('should detect Windows', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      })

      const osInfo = detector.getOSInfo()
      expect(osInfo).toEqual({
        name: 'Windows',
        version: '10.0',
      })
    })

    it('should detect macOS', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      })

      const osInfo = detector.getOSInfo()
      expect(osInfo).toEqual({
        name: 'macOS',
        version: '10.15.7',
      })
    })

    it('should detect iOS', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      })

      const osInfo = detector.getOSInfo()
      expect(osInfo).toEqual({
        name: 'iOS',
        version: '15.0',
      })
    })

    it('should detect Android', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36',
      })

      const osInfo = detector.getOSInfo()
      expect(osInfo).toEqual({
        name: 'Android',
        version: '12',
      })
    })

    it('should detect Linux', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        platform: 'Linux x86_64',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      })

      const osInfo = detector.getOSInfo()
      expect(osInfo).toEqual({
        name: 'Linux',
        version: 'Unknown',
      })
    })

    it('should return null when navigator is undefined', () => {
      vi.stubGlobal('navigator', undefined)

      const osInfo = detector.getOSInfo()
      expect(osInfo).toBeNull()
    })
  })

  describe('browser Detection', () => {
    it('should detect Chrome', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      })

      const browserInfo = detector.getBrowserInfo()
      expect(browserInfo).toEqual({
        name: 'Chrome',
        version: '120.0',
      })
    })

    it('should detect Edge', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      })

      const browserInfo = detector.getBrowserInfo()
      expect(browserInfo).toEqual({
        name: 'Edge',
        version: '120.0',
      })
    })

    it('should detect Firefox', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      })

      const browserInfo = detector.getBrowserInfo()
      expect(browserInfo).toEqual({
        name: 'Firefox',
        version: '120.0',
      })
    })

    it('should detect Safari', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      })

      const browserInfo = detector.getBrowserInfo()
      expect(browserInfo).toEqual({
        name: 'Safari',
        version: '17.0',
      })
    })

    it('should return null when navigator is undefined', () => {
      vi.stubGlobal('navigator', undefined)

      const browserInfo = detector.getBrowserInfo()
      expect(browserInfo).toBeNull()
    })
  })

  describe('hardware Detection', () => {
    it('should detect hardware info', () => {
      const hardwareInfo = detector.getHardwareInfo()

      expect(hardwareInfo.cores).toBe(8)
      expect(hardwareInfo.gpu).toBe('NVIDIA GeForce RTX 3080')
    })

    it('should handle missing hardware info', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        hardwareConcurrency: undefined,
      })

      const hardwareInfo = detector.getHardwareInfo()
      expect(hardwareInfo.cores).toBeUndefined()
    })

    it('should handle WebGL errors', () => {
      vi.stubGlobal('document', {
        createElement: vi.fn(() => ({
          getContext: vi.fn(() => null),
        })),
      })

      const hardwareInfo = detector.getHardwareInfo()
      expect(hardwareInfo.gpu).toBeUndefined()
    })
  })

  describe('network Detection', () => {
    it('should get basic network info', () => {
      const networkInfo = detector.getNetworkInfo()

      expect(networkInfo.online).toBe(true)
      expect(networkInfo.type).toBe('unknown')
    })

    it('should get detailed network info when available', () => {
      // Mock network connection
      detector.networkInfo = mockNetworkInfo

      const networkInfo = detector.getNetworkInfo()

      expect(networkInfo.type).toBe('4g')
      expect(networkInfo.downlink).toBe(10)
      expect(networkInfo.online).toBe(true)
    })

    it('should handle offline state', () => {
      vi.stubGlobal('navigator', {
        ...mockNavigator,
        onLine: false,
      })

      const networkInfo = detector.getNetworkInfo()
      expect(networkInfo.online).toBe(false)
    })
  })

  describe('battery Detection', () => {
    it('should return null when battery manager not available', () => {
      const batteryInfo = detector.getBatteryInfo()
      expect(batteryInfo).toBeNull()
    })

    it('should get battery info when available', () => {
      // Mock battery manager
      detector.batteryManager = mockBatteryManager

      const batteryInfo = detector.getBatteryInfo()

      expect(batteryInfo).toEqual({
        charging: true,
        level: 0.8,
        chargingTime: 3600,
        dischargingTime: undefined, // Infinity should be converted to undefined
      })
    })

    it('should handle infinite charging/discharging time', () => {
      detector.batteryManager = {
        ...mockBatteryManager,
        chargingTime: Infinity,
        dischargingTime: Infinity,
      }

      const batteryInfo = detector.getBatteryInfo()

      expect(batteryInfo?.chargingTime).toBeUndefined()
      expect(batteryInfo?.dischargingTime).toBeUndefined()
    })
  })

  describe('extended Device Info', () => {
    it('should get extended device info', async () => {
      const extendedInfo = await detector.getExtendedDeviceInfo()

      expect(extendedInfo.os).toEqual({
        name: 'Windows',
        version: '10.0',
      })
      expect(extendedInfo.browser).toBeDefined()
      expect(extendedInfo.hardware).toBeDefined()
      expect(extendedInfo.network).toBeDefined()
    })
  })

  describe('event Handling', () => {
    it('should add and remove change listeners', () => {
      const callback = vi.fn()

      const unsubscribe = detector.onChange(callback)
      expect(typeof unsubscribe).toBe('function')

      unsubscribe()
      // Should not throw
    })

    it('should handle listener errors gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Test error')
      })

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      detector.onChange(errorCallback)
      detector.notifyListeners()

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Feature detector listener error:',
        expect.any(Error),
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('cleanup', () => {
    it('should destroy properly', () => {
      const callback = vi.fn()
      detector.onChange(callback)

      detector.destroy()

      // Should not have any listeners
      expect(detector.listeners.size).toBe(0)
      expect(detector.networkInfo).toBeNull()
      expect(detector.batteryManager).toBeNull()
    })
  })
})

describe('global Feature Detector', () => {
  afterEach(() => {
    // Reset global instance
    ;(getGlobalFeatureDetector as any).globalFeatureDetector = null
  })

  it('should return same instance on multiple calls', () => {
    const detector1 = getGlobalFeatureDetector()
    const detector2 = getGlobalFeatureDetector()

    expect(detector1).toBe(detector2)
  })

  it('should get extended device info globally', async () => {
    vi.stubGlobal('navigator', mockNavigator)

    const extendedInfo = await getExtendedDeviceInfo()
    expect(extendedInfo).toBeDefined()
    expect(extendedInfo.os).toBeDefined()
  })
})
