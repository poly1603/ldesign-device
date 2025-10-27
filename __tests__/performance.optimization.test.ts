/**
 * 性能优化对比测试
 * 
 * 对比原版和优化版的性能差异：
 * - 内存使用
 * - 执行速度
 * - 缓存效率
 * - 并发处理能力
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { DeviceDetector } from '../src/core/DeviceDetector'
import { OptimizedDeviceDetector } from '../src/core/OptimizedDeviceDetector'
import { EventEmitter } from '../src/core/EventEmitter'
import { OptimizedEventEmitter } from '../src/core/OptimizedEventEmitter'
import { ModuleLoader } from '../src/core/ModuleLoader'
import { OptimizedModuleLoader } from '../src/core/OptimizedModuleLoader'
import { PerformanceMonitor } from '../src/utils/PerformanceMonitor'

// 性能监控器
const perfMonitor = new PerformanceMonitor({
  enabled: true,
  thresholds: {
    fps: 30,
    memory: 80,
    executionTime: 100
  }
})

// 测试结果收集
interface TestResult {
  name: string
  original: number
  optimized: number
  improvement: string
  details?: string
}

const results: TestResult[] = []

describe('性能优化对比测试', () => {
  beforeAll(() => {
    perfMonitor.start()
    console.log('🚀 开始性能优化对比测试...\n')
  })

  afterAll(() => {
    perfMonitor.stop()

    // 打印测试结果表格
    console.log('\n📊 性能优化测试结果\n')
    console.log('┌─────────────────────────┬──────────────┬──────────────┬──────────────┬────────────┐')
    console.log('│ 测试项目                │ 原版耗时(ms) │ 优化版耗时(ms)│ 性能提升     │ 详情       │')
    console.log('├─────────────────────────┼──────────────┼──────────────┼──────────────┼────────────┤')

    results.forEach(result => {
      const name = result.name.padEnd(23)
      const original = result.original.toFixed(2).padStart(12)
      const optimized = result.optimized.toFixed(2).padStart(13)
      const improvement = result.improvement.padStart(12)
      const details = (result.details || '').padEnd(10)
      console.log(`│ ${name} │ ${original} │ ${optimized} │ ${improvement} │ ${details} │`)
    })

    console.log('└─────────────────────────┴──────────────┴──────────────┴──────────────┴────────────┘')

    // 计算总体改进
    const totalOriginal = results.reduce((sum, r) => sum + r.original, 0)
    const totalOptimized = results.reduce((sum, r) => sum + r.optimized, 0)
    const totalImprovement = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1)

    console.log(`\n✅ 总体性能提升: ${totalImprovement}%`)
    console.log(`   原版总耗时: ${totalOriginal.toFixed(2)}ms`)
    console.log(`   优化版总耗时: ${totalOptimized.toFixed(2)}ms`)
  })

  describe('设备检测性能对比', () => {
    it('1000次设备检测', async () => {
      const iterations = 1000

      // 测试原版
      const detector1 = new DeviceDetector()
      const originalTime = await perfMonitor.measureAsync('original-detection', async () => {
        for (let i = 0; i < iterations; i++) {
          detector1.getDeviceInfo()
        }
      })

      // 测试优化版
      const detector2 = new OptimizedDeviceDetector()
      const optimizedTime = await perfMonitor.measureAsync('optimized-detection', async () => {
        for (let i = 0; i < iterations; i++) {
          detector2.getDeviceInfo()
        }
      })

      const improvement = ((originalTime - optimizedTime) / originalTime * 100).toFixed(1)

      results.push({
        name: '设备检测(1000次)',
        original: originalTime,
        optimized: optimizedTime,
        improvement: `${improvement}%`
      })

      expect(optimizedTime).toBeLessThan(originalTime)

      await detector1.destroy()
      await detector2.destroy()
    })

    it('频繁尺寸变化检测', async () => {
      const changes = 100

      // 测试原版
      const detector1 = new DeviceDetector()
      const originalTime = await perfMonitor.measureAsync('original-resize', async () => {
        for (let i = 0; i < changes; i++) {
          // 模拟窗口大小变化
          (window as any).innerWidth = 300 + i * 10
          detector1.refresh()
        }
      })

      // 测试优化版
      const detector2 = new OptimizedDeviceDetector()
      const optimizedTime = await perfMonitor.measureAsync('optimized-resize', async () => {
        for (let i = 0; i < changes; i++) {
          (window as any).innerWidth = 300 + i * 10
          detector2.refresh()
        }
      })

      const improvement = ((originalTime - optimizedTime) / originalTime * 100).toFixed(1)

      results.push({
        name: '窗口变化检测(100次)',
        original: originalTime,
        optimized: optimizedTime,
        improvement: `${improvement}%`
      })

      expect(optimizedTime).toBeLessThan(originalTime)

      await detector1.destroy()
      await detector2.destroy()
    })
  })

  describe('事件系统性能对比', () => {
    it('大量监听器处理', () => {
      const listenerCount = 1000
      const emitCount = 100

      // 测试原版
      const emitter1 = new EventEmitter()
      const listeners1: Array<() => void> = []

      for (let i = 0; i < listenerCount; i++) {
        const listener = () => { /* noop */ }
        listeners1.push(listener)
        emitter1.on('test', listener)
      }

      const originalTime = perfMonitor.measure('original-emit', () => {
        for (let i = 0; i < emitCount; i++) {
          emitter1.emit('test', {})
        }
      })

      // 测试优化版
      const emitter2 = new OptimizedEventEmitter()
      const listeners2: Array<() => void> = []

      for (let i = 0; i < listenerCount; i++) {
        const listener = () => { /* noop */ }
        listeners2.push(listener)
        emitter2.on('test', listener)
      }

      const optimizedTime = perfMonitor.measure('optimized-emit', () => {
        for (let i = 0; i < emitCount; i++) {
          emitter2.emit('test', {})
        }
      })

      const improvement = ((originalTime - optimizedTime) / originalTime * 100).toFixed(1)

      results.push({
        name: '事件触发(1000监听器)',
        original: originalTime,
        optimized: optimizedTime,
        improvement: `${improvement}%`
      })

      expect(optimizedTime).toBeLessThan(originalTime)
    })

    it('批量事件处理', () => {
      const eventCount = 1000

      // 测试原版（没有批量功能，直接触发）
      const emitter1 = new EventEmitter()
      let counter1 = 0
      emitter1.on('test', () => { counter1++ })

      const originalTime = perfMonitor.measure('original-batch', () => {
        for (let i = 0; i < eventCount; i++) {
          emitter1.emit('test', { value: i })
        }
      })

      // 测试优化版（使用批量处理）
      const emitter2 = new OptimizedEventEmitter()
      let counter2 = 0
      emitter2.on('test', () => { counter2++ })

      const optimizedTime = perfMonitor.measure('optimized-batch', () => {
        emitter2.startBatch()
        for (let i = 0; i < eventCount; i++) {
          emitter2.emit('test', { value: i })
        }
        emitter2.endBatch()
      })

      const improvement = ((originalTime - optimizedTime) / originalTime * 100).toFixed(1)

      results.push({
        name: '批量事件(1000个)',
        original: originalTime,
        optimized: optimizedTime,
        improvement: `${improvement}%`,
        details: '批量处理'
      })

      expect(counter1).toBe(eventCount)
      expect(counter2).toBe(eventCount)
      expect(optimizedTime).toBeLessThan(originalTime)
    })
  })

  describe('模块加载性能对比', () => {
    it('并发模块加载', async () => {
      const modules = ['network', 'battery', 'performance']

      // 测试原版
      const loader1 = new ModuleLoader()
      const originalTime = await perfMonitor.measureAsync('original-load', async () => {
        await Promise.all(modules.map(m => loader1.loadModuleInstance(m)))
      })

      // 测试优化版
      const loader2 = new OptimizedModuleLoader()
      const optimizedTime = await perfMonitor.measureAsync('optimized-load', async () => {
        await Promise.all(modules.map(m => loader2.loadModuleInstance(m)))
      })

      const improvement = ((originalTime - optimizedTime) / originalTime * 100).toFixed(1)

      results.push({
        name: '并发模块加载(3个)',
        original: originalTime,
        optimized: optimizedTime,
        improvement: `${improvement}%`,
        details: '并发控制'
      })

      expect(optimizedTime).toBeLessThanOrEqual(originalTime * 1.1) // 允许10%的误差

      await loader1.unloadAll()
      await loader2.unloadAll()
    })

    it('模块卸载和清理', async () => {
      const modules = ['network', 'battery', 'performance', 'media', 'geolocation']

      // 预加载模块
      const loader1 = new ModuleLoader()
      const loader2 = new OptimizedModuleLoader()

      await Promise.all(modules.map(m => loader1.loadModuleInstance(m)))
      await Promise.all(modules.map(m => loader2.loadModuleInstance(m)))

      // 测试原版卸载
      const originalTime = await perfMonitor.measureAsync('original-unload', async () => {
        await loader1.unloadAll()
      })

      // 重新加载用于优化版测试
      await Promise.all(modules.map(m => loader2.loadModuleInstance(m)))

      // 测试优化版卸载
      const optimizedTime = await perfMonitor.measureAsync('optimized-unload', async () => {
        await loader2.unloadAll()
      })

      const improvement = ((originalTime - optimizedTime) / originalTime * 100).toFixed(1)

      results.push({
        name: '模块卸载(5个)',
        original: originalTime,
        optimized: optimizedTime,
        improvement: `${improvement}%`,
        details: '批量卸载'
      })

      expect(optimizedTime).toBeLessThanOrEqual(originalTime * 1.1)
    })
  })

  describe('内存使用对比', () => {
    it('长时间运行内存占用', async () => {
      const duration = 1000 // 1秒测试
      const startMemory = getMemoryUsage()

      // 测试原版
      const detector1 = new DeviceDetector()
      const startTime1 = Date.now()
      let operations1 = 0

      while (Date.now() - startTime1 < duration) {
        detector1.getDeviceInfo()
        detector1.refresh()
        operations1++
      }

      const memory1 = getMemoryUsage() - startMemory
      await detector1.destroy()

      // 等待GC
      await new Promise(resolve => setTimeout(resolve, 100))

      // 测试优化版
      const startMemory2 = getMemoryUsage()
      const detector2 = new OptimizedDeviceDetector()
      const startTime2 = Date.now()
      let operations2 = 0

      while (Date.now() - startTime2 < duration) {
        detector2.getDeviceInfo()
        detector2.refresh()
        operations2++
      }

      const memory2 = getMemoryUsage() - startMemory2
      await detector2.destroy()

      const memoryImprovement = ((memory1 - memory2) / memory1 * 100).toFixed(1)

      results.push({
        name: '内存占用',
        original: memory1,
        optimized: memory2,
        improvement: `${memoryImprovement}%`,
        details: `${operations2}ops`
      })

      // 优化版应该使用更少的内存
      expect(memory2).toBeLessThanOrEqual(memory1 * 1.2) // 允许20%的误差
    })
  })

  describe('缓存效率对比', () => {
    it('缓存命中率', async () => {
      const iterations = 1000

      // 测试原版（简单缓存）
      const detector1 = new DeviceDetector()
      detector1.getDeviceInfo() // 预热

      const originalTime = await perfMonitor.measureAsync('original-cache', async () => {
        for (let i = 0; i < iterations; i++) {
          detector1['detectDevice']()
        }
      })

      // 测试优化版（智能缓存）
      const detector2 = new OptimizedDeviceDetector()
      detector2.getDeviceInfo() // 预热

      const optimizedTime = await perfMonitor.measureAsync('optimized-cache', async () => {
        for (let i = 0; i < iterations; i++) {
          detector2['detectDevice']()
        }
      })

      const improvement = ((originalTime - optimizedTime) / originalTime * 100).toFixed(1)

      results.push({
        name: '缓存效率(1000次)',
        original: originalTime,
        optimized: optimizedTime,
        improvement: `${improvement}%`,
        details: '智能缓存'
      })

      expect(optimizedTime).toBeLessThan(originalTime)

      await detector1.destroy()
      await detector2.destroy()
    })
  })
})

/**
 * 获取内存使用量（MB）
 */
function getMemoryUsage(): number {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage().heapUsed / 1024 / 1024
  }

  if (typeof window !== 'undefined' && (performance as any).memory) {
    return (performance as any).memory.usedJSHeapSize / 1024 / 1024
  }

  return 0
}
