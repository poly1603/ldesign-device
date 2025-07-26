import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  AdapterRegistryImpl,
  detectAdapter,
  FrameworkDetector,
  getAdapter,
  globalAdapterRegistry,
  registerAdapter,
  Vue3AdapterFactory
} from '../src/adapters'
import type { AdapterFactory } from '../src/adapters/types'

describe('AdapterRegistry', () => {
  let registry: AdapterRegistryImpl

  beforeEach(() => {
    registry = new AdapterRegistryImpl()
  })

  describe('AdapterRegistryImpl', () => {
    it('should register and get adapters', () => {
      const mockFactory: AdapterFactory = {
        create: vi.fn(),
        isCompatible: vi.fn(() => true),
        getSupportedVersions: vi.fn(() => ['1.0.0'])
      }

      registry.register('test', mockFactory)

      expect(registry.get('test')).toBe(mockFactory)
      expect(registry.get('nonexistent')).toBeUndefined()
    })

    it('should return all adapters', () => {
      const factory1: AdapterFactory = {
        create: vi.fn(),
        isCompatible: vi.fn(() => true),
        getSupportedVersions: vi.fn(() => ['1.0.0'])
      }

      const factory2: AdapterFactory = {
        create: vi.fn(),
        isCompatible: vi.fn(() => true),
        getSupportedVersions: vi.fn(() => ['2.0.0'])
      }

      registry.register('adapter1', factory1)
      registry.register('adapter2', factory2)

      const all = registry.getAll()
      expect(all.size).toBe(2)
      expect(all.get('adapter1')).toBe(factory1)
      expect(all.get('adapter2')).toBe(factory2)
    })

    it('should detect compatible adapter', () => {
      const compatibleFactory: AdapterFactory = {
        create: vi.fn(),
        isCompatible: vi.fn(() => true),
        getSupportedVersions: vi.fn(() => ['1.0.0'])
      }

      const incompatibleFactory: AdapterFactory = {
        create: vi.fn(),
        isCompatible: vi.fn(() => false),
        getSupportedVersions: vi.fn(() => ['1.0.0'])
      }

      registry.register('compatible', compatibleFactory)
      registry.register('incompatible', incompatibleFactory)

      // Mock FrameworkDetector
      vi.spyOn(FrameworkDetector, 'detect').mockReturnValue([
        { name: 'compatible', version: '1.0.0', supported: true, confidence: 0.9 },
        { name: 'incompatible', version: '1.0.0', supported: false, confidence: 0.8 }
      ])

      const detected = registry.detect()
      expect(detected).toBe(compatibleFactory)
    })

    it('should clear all adapters', () => {
      const mockFactory: AdapterFactory = {
        create: vi.fn(),
        isCompatible: vi.fn(() => true),
        getSupportedVersions: vi.fn(() => ['1.0.0'])
      }

      registry.register('test', mockFactory)
      expect(registry.getAll().size).toBe(1)

      registry.clear()
      expect(registry.getAll().size).toBe(0)
    })

    it('should get supported frameworks', () => {
      const factory1: AdapterFactory = {
        create: vi.fn(),
        isCompatible: vi.fn(() => true),
        getSupportedVersions: vi.fn(() => ['1.0.0'])
      }

      registry.register('vue3', factory1)
      registry.register('react', factory1)

      const supported = registry.getSupportedFrameworks()
      expect(supported).toEqual(['vue3', 'react'])
    })

    it('should check framework support', () => {
      const compatibleFactory: AdapterFactory = {
        create: vi.fn(),
        isCompatible: vi.fn(() => true),
        getSupportedVersions: vi.fn(() => ['1.0.0'])
      }

      registry.register('vue3', compatibleFactory)

      expect(registry.isSupported('vue3')).toBe(true)
      expect(registry.isSupported('react')).toBe(false)
    })
  })

  describe('Global Registry Functions', () => {
    beforeEach(() => {
      globalAdapterRegistry.clear()
    })

    it('should register adapter globally', () => {
      const mockFactory: AdapterFactory = {
        create: vi.fn(),
        isCompatible: vi.fn(() => true),
        getSupportedVersions: vi.fn(() => ['1.0.0'])
      }

      registerAdapter('test', mockFactory)
      expect(getAdapter('test')).toBe(mockFactory)
    })

    it('should detect adapter globally', () => {
      const mockFactory: AdapterFactory = {
        create: vi.fn(),
        isCompatible: vi.fn(() => true),
        getSupportedVersions: vi.fn(() => ['1.0.0'])
      }

      registerAdapter('vue3', mockFactory)

      // Mock FrameworkDetector
      vi.spyOn(FrameworkDetector, 'detect').mockReturnValue([
        { name: 'vue3', version: '3.0.0', supported: true, confidence: 0.9 }
      ])

      const detected = detectAdapter()
      expect(detected).toBe(mockFactory)
    })
  })

  describe('FrameworkDetector', () => {
    beforeEach(() => {
      // 清理全局对象
      delete (globalThis as any).window
      delete (globalThis as any).Vue
      delete (globalThis as any).React
    })

    it('should detect Vue 3', () => {
      // Mock Vue 3 environment
      ; (globalThis as any).window = {
        Vue: {
          version: '3.4.0'
        }
      }

      const results = FrameworkDetector.detect()
      const vue3Result = results.find(r => r.name === 'vue3')

      expect(vue3Result).toBeDefined()
      expect(vue3Result?.version).toBe('3.4.0')
      expect(vue3Result?.supported).toBe(true)
      expect(vue3Result?.confidence).toBe(0.9)
    })

    it('should detect Vue 2', () => {
      // Mock Vue 2 environment
      ; (globalThis as any).window = {
        Vue: {
          version: '2.7.0'
        }
      }

      const results = FrameworkDetector.detect()
      const vue2Result = results.find(r => r.name === 'vue2')

      expect(vue2Result).toBeDefined()
      expect(vue2Result?.version).toBe('2.7.0')
      expect(vue2Result?.supported).toBe(false) // 暂未实现
      expect(vue2Result?.confidence).toBe(0.9)
    })

    it('should detect React', () => {
      // Mock React environment
      ; (globalThis as any).window = {
        React: {
          version: '18.0.0'
        }
      }

      const results = FrameworkDetector.detect()
      const reactResult = results.find(r => r.name === 'react')

      expect(reactResult).toBeDefined()
      expect(reactResult?.version).toBe('18.0.0')
      expect(reactResult?.supported).toBe(false) // 暂未实现
      expect(reactResult?.confidence).toBe(0.8)
    })

    it('should return empty array when no frameworks detected', () => {
      // 确保没有框架环境
      ; (globalThis as any).window = {}

      const results = FrameworkDetector.detect()
      expect(results).toEqual([])
    })

    it('should get best match', () => {
      // Mock multiple frameworks
      ; (globalThis as any).window = {
        Vue: { version: '3.4.0' },
        React: { version: '18.0.0' }
      }

      const bestMatch = FrameworkDetector.getBestMatch()
      expect(bestMatch?.name).toBe('vue3') // Vue3 has higher confidence and is supported
    })

    it('should return null when no frameworks available', () => {
      // 确保没有框架环境
      ; (globalThis as any).window = {}

      const bestMatch = FrameworkDetector.getBestMatch()
      expect(bestMatch).toBeNull()
    })
  })

  describe('Vue3AdapterFactory', () => {
    let factory: Vue3AdapterFactory

    beforeEach(() => {
      factory = new Vue3AdapterFactory()
    })

    it('should create Vue3 adapter', () => {
      const adapter = factory.create()
      expect(adapter).toBeDefined()
      expect(adapter.name).toBe('vue3')
    })

    it('should check compatibility', () => {
      // Mock Vue 3 environment
      ; (globalThis as any).window = {
        Vue: {
          version: '3.4.0'
        }
      }

      expect(factory.isCompatible()).toBe(true)
    })

    it('should return false for incompatible environment', () => {
      // 确保没有Vue环境
      ; (globalThis as any).window = {}

      expect(factory.isCompatible()).toBe(false)
    })

    it('should return supported versions', () => {
      const versions = factory.getSupportedVersions()
      expect(versions).toContain('3.0.0')
      expect(versions).toContain('3.4.0')
    })
  })
})
