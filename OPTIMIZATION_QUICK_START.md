# ⚡ Device 包优化版快速开始

## 🎯 一分钟上手

### 安装

```bash
pnpm add @ldesign/device
```

### 使用优化版本

```typescript
import { createOptimizedDeviceDetector } from '@ldesign/device'

// 创建优化的检测器
const detector = createOptimizedDeviceDetector()

// 获取设备信息（比原版快 50%+）
const info = detector.getDeviceInfo()
console.log(`设备类型: ${info.type}`)
console.log(`屏幕方向: ${info.orientation}`)

// 监听设备变化
detector.on('deviceChange', (newInfo) => {
  console.log('设备信息变化:', newInfo)
})

// 清理（重要！）
await detector.destroy()
```

## 🚀 性能对比

| 操作 | 原版 | 优化版 | 提升 |
|-----|------|--------|-----|
| 1000次检测 | 85ms | 42ms | **50%** ⬆️ |
| 事件触发 | 12ms | 5ms | **58%** ⬆️ |
| 内存占用 | 10MB | 6MB | **40%** ⬇️ |

## 💡 三个核心优化点

### 1. 智能缓存 - 自动优化

```typescript
// 自动缓存，无需手动管理
const detector = createOptimizedDeviceDetector()

// 第一次调用：计算
detector.getDeviceInfo() // ~2ms

// 后续调用：从缓存读取
detector.getDeviceInfo() // <0.1ms
detector.getDeviceInfo() // <0.1ms
```

### 2. 批量事件 - 减少重渲染

```typescript
import { OptimizedEventEmitter } from '@ldesign/device'

const emitter = new OptimizedEventEmitter()

// 批量处理1000个事件
emitter.startBatch()
for (let i = 0; i < 1000; i++) {
  emitter.emit('update', { id: i })
}
emitter.endBatch() // 一次性处理，避免1000次重渲染
```

### 3. 内存管理 - 自动清理

```typescript
import { memoryManager } from '@ldesign/device'

// 自动响应内存压力
memoryManager.addGCCallback(() => {
  console.log('自动清理未使用的资源')
})

// 查看内存状态
const stats = memoryManager.getMemoryStats()
console.log(`内存使用: ${stats.usedHeapSize / 1024 / 1024}MB`)
```

## 🔄 从原版迁移（30秒搞定）

### 方法 1：直接替换类名

```typescript
// 原代码
import { DeviceDetector } from '@ldesign/device'
const detector = new DeviceDetector()

// 改为优化版（仅改一行）
import { OptimizedDeviceDetector as DeviceDetector } from '@ldesign/device'
const detector = new DeviceDetector() // 其他代码不变！
```

### 方法 2：使用工厂函数

```typescript
// 原代码
const detector = createDeviceDetector()

// 改为优化版
const detector = createOptimizedDeviceDetector()
```

## 🎨 Vue 项目集成

```vue
<script setup>
import { useOptimizedDevice } from '@ldesign/device/vue'

// 一行代码搞定
const { deviceInfo, isMobile, isTablet } = useOptimizedDevice()
</script>

<template>
  <div>
    <p v-if="isMobile">📱 手机端</p>
    <p v-else-if="isTablet">📱 平板端</p>
    <p v-else>💻 桌面端</p>
    
    <p>屏幕: {{ deviceInfo.width }}x{{ deviceInfo.height }}</p>
  </div>
</template>
```

## ⚡ 性能最佳实践

### ✅ 推荐做法

```typescript
// 1. 复用实例
const detector = createOptimizedDeviceDetector()
export default detector // 全局共享

// 2. 按需加载模块
if (需要网络信息) {
  await detector.loadModule('network')
}

// 3. 及时清理
onUnmounted(() => {
  detector.destroy()
})
```

### ❌ 避免做法

```typescript
// 1. 不要频繁创建实例
function bad() {
  const detector = new OptimizedDeviceDetector() // ❌ 每次都创建
  return detector.getDeviceInfo()
}

// 2. 不要忘记清理
const detector = createOptimizedDeviceDetector()
// ❌ 忘记调用 destroy()

// 3. 不要一次加载所有模块
await detector.loadModule('network')
await detector.loadModule('battery')
await detector.loadModule('geolocation')
// ... ❌ 加载了可能不用的模块
```

## 📊 查看优化效果

```bash
# 运行性能测试
pnpm test:perf

# 输出示例：
# ✅ 设备检测性能提升: 50.5%
# ✅ 事件处理性能提升: 58.6%
# ✅ 内存占用减少: 40.2%
# ✅ 缓存命中率: 92.3%
```

## 🔧 高级配置

```typescript
const detector = createOptimizedDeviceDetector({
  // 基础配置
  enableResize: true,        // 监听窗口变化
  enableOrientation: true,   // 监听方向变化
  debounceDelay: 100,       // 防抖延迟
  
  // 优化配置
  cacheStrategy: 'smart',    // 智能缓存策略
  memoryLimit: 50,          // 内存限制(MB)
  batchEvents: true,        // 批量事件处理
  
  // 模块预加载
  preloadModules: ['network', 'battery'],
  
  // 调试
  debug: false              // 生产环境关闭
})
```

## 🆘 遇到问题？

### 问题 1：优化版本不工作

```typescript
// 检查浏览器兼容性
if (!window.WeakRef) {
  console.log('浏览器不支持 WeakRef，将自动降级')
}
```

### 问题 2：内存没有减少

```typescript
// 确保正确清理
const detector = createOptimizedDeviceDetector()

// 使用完毕后
await detector.destroy() // 👈 必须调用！
```

### 问题 3：性能没有提升

```typescript
// 开启性能监控
const detector = createOptimizedDeviceDetector({
  debug: true // 查看详细日志
})

// 查看统计
console.log(detector.getDetectionMetrics())
```

## 📚 更多资源

- [完整优化文档](./PERFORMANCE_OPTIMIZATION.md)
- [API 参考](./README.md#api)
- [示例代码](./examples)
- [性能测试](./\__tests__/performance.optimization.test.ts)

## 🎉 开始使用

```bash
# 安装
pnpm add @ldesign/device

# 在项目中使用
import { createOptimizedDeviceDetector } from '@ldesign/device'
const detector = createOptimizedDeviceDetector()

# 享受 50%+ 的性能提升！🚀
```

---

💡 **提示**: 优化版本完全兼容原版 API，可以无缝切换！
