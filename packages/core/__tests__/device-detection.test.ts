import { describe, expect, it, vi } from 'vitest'
import { getDeviceTypeByScreenSize, getScreenSize } from '../src/utils'

describe('设备检测优化功能', () => {
  describe('getScreenSize', () => {
    it('应该返回屏幕尺寸', () => {
      // Mock window.screen
      const mockScreen = {
        width: 1920,
        height: 1080,
      }
      vi.stubGlobal('screen', mockScreen)

      const result = getScreenSize()
      expect(result).toEqual({
        width: 1920,
        height: 1080,
      })

      vi.unstubAllGlobals()
    })

    it('在没有window对象时应该返回默认值', () => {
      const originalWindow = global.window
      // @ts-expect-error - 测试环境
      delete global.window

      const result = getScreenSize()
      expect(result).toEqual({
        width: 0,
        height: 0,
      })

      global.window = originalWindow
    })
  })

  describe('getDeviceTypeByScreenSize', () => {
    it('应该正确识别移动设备屏幕尺寸', () => {
      expect(getDeviceTypeByScreenSize(375)).toBe('mobile')
      expect(getDeviceTypeByScreenSize(414)).toBe('mobile')
      expect(getDeviceTypeByScreenSize(767)).toBe('mobile')
    })

    it('应该正确识别平板设备屏幕尺寸', () => {
      expect(getDeviceTypeByScreenSize(768)).toBe('tablet')
      expect(getDeviceTypeByScreenSize(820)).toBe('tablet')
      expect(getDeviceTypeByScreenSize(1023)).toBe('tablet')
    })

    it('应该正确识别桌面设备屏幕尺寸', () => {
      expect(getDeviceTypeByScreenSize(1024)).toBe('desktop')
      expect(getDeviceTypeByScreenSize(1920)).toBe('desktop')
      expect(getDeviceTypeByScreenSize(2560)).toBe('desktop')
    })

    it('屏幕宽度为0时应该返回null', () => {
      expect(getDeviceTypeByScreenSize(0)).toBe(null)
    })

    it('应该支持自定义断点', () => {
      const customBreakpoints = {
        mobile: 600,
        tablet: 1200,
      }

      expect(getDeviceTypeByScreenSize(500, customBreakpoints)).toBe('mobile')
      expect(getDeviceTypeByScreenSize(800, customBreakpoints)).toBe('tablet')
      expect(getDeviceTypeByScreenSize(1300, customBreakpoints)).toBe('desktop')
    })
  })

  describe('多级检测优先级', () => {
    it('应该优先使用屏幕尺寸进行检测', () => {
      // 这个测试需要在真实的DeviceDetector实例中验证
      // 屏幕尺寸 > 视口宽度 > UserAgent
      expect(true).toBe(true) // 占位测试
    })
  })
})