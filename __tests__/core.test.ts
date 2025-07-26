import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DeviceDetectorImpl, createDeviceDetector, getDeviceInfo } from '../src/core'
import { DeviceType, Orientation } from '../src/types'

// Mock DOM APIs
const mockWindow = {
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 2,
  // 移除 orientation 属性，让其回退到屏幕尺寸判断
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}

const mockDocument = {
  documentElement: {
    clientWidth: 1920,
    clientHeight: 1080
  },
  body: {
    clientWidth: 1920,
    clientHeight: 1080
  }
}

const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  maxTouchPoints: 0
}

const mockScreen = {
  // 不提供 orientation API，让其回退到屏幕尺寸判断
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}

describe('DeviceDetector', () => {
  beforeEach(() => {
    // @ts-ignore
    global.window = mockWindow
    // @ts-ignore
    global.document = mockDocument
    // @ts-ignore
    global.navigator = mockNavigator
    // @ts-ignore
    global.screen = mockScreen

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('DeviceDetectorImpl', () => {
    it('should create detector with default config', () => {
      const detector = new DeviceDetectorImpl()
      expect(detector).toBeInstanceOf(DeviceDetectorImpl)
    })

    it('should get device info', () => {
      const detector = new DeviceDetectorImpl()
      const deviceInfo = detector.getDeviceInfo()

      expect(deviceInfo).toMatchObject({
        type: DeviceType.DESKTOP,
        width: 1920,
        height: 1080,
        pixelRatio: 2,
        isTouchDevice: false,
        userAgent: expect.any(String)
      })

      // 方向应该是横屏（宽度 > 高度）
      expect(deviceInfo.orientation).toBe(Orientation.LANDSCAPE)
    })

    it('should register device change listener', () => {
      const detector = new DeviceDetectorImpl()
      const callback = vi.fn()

      const unsubscribe = detector.onDeviceChange(callback)
      expect(typeof unsubscribe).toBe('function')

      // Should not call callback immediately
      expect(callback).not.toHaveBeenCalled()
    })

    it('should unregister device change listener', () => {
      const detector = new DeviceDetectorImpl()
      const callback = vi.fn()

      const unsubscribe = detector.onDeviceChange(callback)
      unsubscribe()

      // Callback should be removed from listeners
      expect(detector['listeners']).toHaveLength(0)
    })

    it('should setup event listeners', () => {
      new DeviceDetectorImpl()

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
      // 由于我们移除了 orientation API，应该使用 orientationchange 事件
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function))
    })

    it('should destroy detector properly', () => {
      const detector = new DeviceDetectorImpl()
      detector.destroy()

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('orientationchange', expect.any(Function))
      expect(detector['isDestroyed']).toBe(true)
    })

    it('should handle custom config', () => {
      const config = {
        tabletMinWidth: 600,
        desktopMinWidth: 1200,
        enableUserAgentDetection: false,
        enableTouchDetection: false
      }

      const detector = new DeviceDetectorImpl(config)
      const deviceInfo = detector.getDeviceInfo()

      expect(deviceInfo.isTouchDevice).toBe(false)
    })

    it('should detect mobile device with small screen', () => {
      // @ts-ignore
      global.window.innerWidth = 375
      // @ts-ignore
      global.window.innerHeight = 667

      const detector = new DeviceDetectorImpl()
      const deviceInfo = detector.getDeviceInfo()

      expect(deviceInfo.type).toBe(DeviceType.MOBILE)
      expect(deviceInfo.orientation).toBe(Orientation.PORTRAIT)
    })

    it('should detect tablet device', () => {
      // @ts-ignore
      global.window.innerWidth = 768
      // @ts-ignore
      global.window.innerHeight = 1024

      const detector = new DeviceDetectorImpl()
      const deviceInfo = detector.getDeviceInfo()

      expect(deviceInfo.type).toBe(DeviceType.TABLET)
    })

    it('should handle errors in listeners gracefully', () => {
      const detector = new DeviceDetectorImpl()
      const errorCallback = vi.fn(() => {
        throw new Error('Test error')
      })
      const normalCallback = vi.fn()

      detector.onDeviceChange(errorCallback)
      detector.onDeviceChange(normalCallback)

      // Simulate device change
      const event = {
        current: detector.getDeviceInfo(),
        previous: null,
        changes: ['width' as const]
      }

      detector['notifyListeners'](event)

      expect(errorCallback).toHaveBeenCalled()
      expect(normalCallback).toHaveBeenCalled()
    })
  })

  describe('createDeviceDetector', () => {
    it('should create detector instance', () => {
      const detector = createDeviceDetector()
      expect(detector).toBeInstanceOf(DeviceDetectorImpl)
    })

    it('should pass config to detector', () => {
      const config = { tabletMinWidth: 600 }
      const detector = createDeviceDetector(config)
      expect(detector).toBeInstanceOf(DeviceDetectorImpl)
    })
  })

  describe('getDeviceInfo', () => {
    it('should return device info', () => {
      const deviceInfo = getDeviceInfo()
      expect(deviceInfo).toMatchObject({
        type: expect.any(String),
        orientation: expect.any(String),
        width: expect.any(Number),
        height: expect.any(Number),
        pixelRatio: expect.any(Number),
        isTouchDevice: expect.any(Boolean),
        userAgent: expect.any(String)
      })
    })
  })
})
