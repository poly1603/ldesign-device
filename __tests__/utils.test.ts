import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  debounce,
  detectDeviceTypeByScreenSize,
  detectDeviceTypeByUserAgent,
  detectOrientation,
  getPixelRatio,
  getScreenOrientation,
  getScreenSize,
  getUserAgent,
  isTouchDevice,
  throttle,
} from '../src/utils'
import { DeviceType, Orientation } from '../src/types'

// Mock window and navigator
const mockWindow = {
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 2,
  orientation: 0,
}

const mockDocument = {
  documentElement: {
    clientWidth: 1920,
    clientHeight: 1080,
  },
  body: {
    clientWidth: 1920,
    clientHeight: 1080,
  },
}

const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  maxTouchPoints: 0,
}

const mockScreen = {
  orientation: {
    angle: 0,
  },
}

describe('utils', () => {
  beforeEach(() => {
    // @ts-ignore
    global.window = mockWindow
    // @ts-ignore
    global.document = mockDocument
    // @ts-ignore
    global.navigator = mockNavigator
    // @ts-ignore
    global.screen = mockScreen
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getScreenSize', () => {
    it('should return correct screen size', () => {
      const size = getScreenSize()
      expect(size).toEqual({ width: 1920, height: 1080 })
    })

    it('should return 0 when window is undefined', () => {
      // @ts-ignore
      global.window = undefined
      const size = getScreenSize()
      expect(size).toEqual({ width: 0, height: 0 })
    })
  })

  describe('getPixelRatio', () => {
    it('should return correct pixel ratio', () => {
      const ratio = getPixelRatio()
      expect(ratio).toBe(2)
    })

    it('should return 1 when window is undefined', () => {
      // @ts-ignore
      global.window = undefined
      const ratio = getPixelRatio()
      expect(ratio).toBe(1)
    })
  })

  describe('isTouchDevice', () => {
    it('should return false for non-touch device', () => {
      const isTouch = isTouchDevice()
      expect(isTouch).toBe(false)
    })

    it('should return true when maxTouchPoints > 0', () => {
      // @ts-ignore
      global.navigator.maxTouchPoints = 1
      const isTouch = isTouchDevice()
      expect(isTouch).toBe(true)
    })

    it('should return false when window is undefined', () => {
      // @ts-ignore
      global.window = undefined
      const isTouch = isTouchDevice()
      expect(isTouch).toBe(false)
    })
  })

  describe('getUserAgent', () => {
    it('should return correct user agent', () => {
      const ua = getUserAgent()
      expect(ua).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    })

    it('should return empty string when navigator is undefined', () => {
      // @ts-ignore
      global.navigator = undefined
      const ua = getUserAgent()
      expect(ua).toBe('')
    })
  })

  describe('detectDeviceTypeByUserAgent', () => {
    it('should detect mobile device', () => {
      const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      const type = detectDeviceTypeByUserAgent(mobileUA)
      expect(type).toBe(DeviceType.MOBILE)
    })

    it('should detect tablet device (iPad)', () => {
      const tabletUA = 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)'
      const type = detectDeviceTypeByUserAgent(tabletUA)
      expect(type).toBe(DeviceType.TABLET)
    })

    it('should detect Android tablet', () => {
      const tabletUA = 'Mozilla/5.0 (Linux; Android 10; SM-T510) AppleWebKit/537.36'
      const type = detectDeviceTypeByUserAgent(tabletUA)
      expect(type).toBe(DeviceType.TABLET)
    })

    it('should return null for desktop', () => {
      const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      const type = detectDeviceTypeByUserAgent(desktopUA)
      expect(type).toBe(null)
    })
  })

  describe('detectDeviceTypeByScreenSize', () => {
    it('should detect desktop device', () => {
      const type = detectDeviceTypeByScreenSize(1920, 1080)
      expect(type).toBe(DeviceType.DESKTOP)
    })

    it('should detect tablet device', () => {
      const type = detectDeviceTypeByScreenSize(768, 1024)
      expect(type).toBe(DeviceType.TABLET)
    })

    it('should detect mobile device', () => {
      const type = detectDeviceTypeByScreenSize(375, 667)
      expect(type).toBe(DeviceType.MOBILE)
    })

    it('should use custom thresholds', () => {
      const config = { tabletMinWidth: 600, desktopMinWidth: 1200 }
      const type = detectDeviceTypeByScreenSize(800, 600, config)
      expect(type).toBe(DeviceType.TABLET)
    })
  })

  describe('detectOrientation', () => {
    it('should detect landscape orientation', () => {
      const orientation = detectOrientation(1920, 1080)
      expect(orientation).toBe(Orientation.LANDSCAPE)
    })

    it('should detect portrait orientation', () => {
      const orientation = detectOrientation(375, 667)
      expect(orientation).toBe(Orientation.PORTRAIT)
    })
  })

  describe('getScreenOrientation', () => {
    it('should use screen.orientation API', () => {
      const orientation = getScreenOrientation()
      expect(orientation).toBe(Orientation.PORTRAIT)
    })

    it('should use window.orientation fallback', () => {
      // @ts-ignore
      global.screen = {}
      // @ts-ignore
      global.window.orientation = 90
      const orientation = getScreenOrientation()
      expect(orientation).toBe(Orientation.LANDSCAPE)
    })

    it('should use screen size fallback', () => {
      // @ts-ignore
      global.screen = {}
      // @ts-ignore
      global.window.orientation = undefined
      const orientation = getScreenOrientation()
      expect(orientation).toBe(Orientation.LANDSCAPE)
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(fn).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(fn).toHaveBeenCalledTimes(1)

      await new Promise(resolve => setTimeout(resolve, 150))
      throttledFn()
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})
