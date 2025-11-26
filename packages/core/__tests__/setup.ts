// Vitest 测试环境设置文件
import { vi } from 'vitest'

// Mock window 对象
global.window = global.window || ({} as Window & typeof globalThis)

// Mock screen 对象
Object.defineProperty(global.window, 'screen', {
  writable: true,
  configurable: true,
  value: {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1080,
  },
})

// Mock navigator 对象
Object.defineProperty(global.window, 'navigator', {
  writable: true,
  configurable: true,
  value: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    maxTouchPoints: 0,
  },
})

// Mock innerWidth 和 innerHeight
Object.defineProperty(global.window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1920,
})

Object.defineProperty(global.window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 1080,
})