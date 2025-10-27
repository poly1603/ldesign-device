# 迁移指南

从旧版本升级到 v0.2.0 的完整迁移指南。

---

## 从 v0.1.x 升级到 v0.2.0

### 💡 概述

v0.2.0 版本是一个**向后兼容**的更新，主要添加了新功能和性能优化，现有代码无需修改即可使用。

### ✅ 无需修改的代码

以下代码在 v0.2.0 中可以正常工作：

```typescript
// ✅ 所有现有 API 保持兼容
const detector = new DeviceDetector()
const info = detector.getDeviceInfo()
detector.on('deviceChange', handler)
```

---

## 🆕 新增功能

### 1. 新增模块（可选使用）

#### MediaCapabilitiesModule

```typescript
// 新增：媒体能力检测
const mediaModule = await detector.loadModule('mediaCapabilities')
const videoSupport = await mediaModule.checkVideoDecoding({
  contentType: 'video/mp4',
  width: 1920,
  height: 1080,
  bitrate: 5000000,
  framerate: 30
})
```

#### WakeLockModule

```typescript
// 新增：屏幕常亮控制
const wakeLockModule = await detector.loadModule('wakeLock')
await wakeLockModule.requestWakeLock()
```

#### VibrationModule

```typescript
// 新增：振动控制
const vibrationModule = await detector.loadModule('vibration')
vibrationModule.vibratePattern('success')
```

#### ClipboardModule

```typescript
// 新增：剪贴板操作
const clipboardModule = await detector.loadModule('clipboard')
await clipboardModule.writeText('Hello')
```

#### OrientationLockModule

```typescript
// 新增：屏幕方向锁定
const orientationModule = await detector.loadModule('orientationLock')
await orientationModule.lock('landscape')
```

### 2. 新增工具函数

#### 设备指纹

```typescript
// 新增：设备指纹生成
import { generateDeviceFingerprint } from '@ldesign/device'

const fingerprint = generateDeviceFingerprint(detector)
```

#### 自适应性能配置

```typescript
// 新增：自适应性能配置
import { AdaptivePerformance } from '@ldesign/device'

const perfModule = await detector.loadModule('performance')
const adaptive = new AdaptivePerformance(perfModule)
const config = adaptive.getRecommendedConfig()
```

#### 性能预算监控

```typescript
// 新增：性能预算监控
import { createPerformanceBudget } from '@ldesign/device'

const budget = createPerformanceBudget()
budget.checkBudget('detectionTime', duration)
```

### 3. 新增 Vue Composables

```typescript
// 新增 Vue3 组合式 API
import {
  useMediaCapabilities,
  useWakeLock,
  useVibration,
  useClipboard,
  useOrientationLock
} from '@ldesign/device/vue'
```

---

## ⚡ 性能优化（自动生效）

以下性能优化会自动生效，无需代码修改：

1. **Passive Event Listeners** - 提升滚动/缩放性能
2. **requestIdleCallback** - 优化缓存清理时机
3. **OffscreenCanvas** - 更快的 WebGL 检测
4. **单监听器快速路径** - 提升事件触发性能
5. **内存压力感知** - 自动清理缓存

---

## 🔧 配置选项更新

### 新增配置选项

```typescript
const detector = new DeviceDetector({
  // 现有选项...
  enableResize: true,
  enableOrientation: true,
  breakpoints: { mobile: 768, tablet: 1024 },
  debounceDelay: 100,
  
  // ✨ 新增：调试模式
  debug: false  // 启用性能预算警告和详细日志
})
```

---

## 📝 类型更新

### 新增类型导出

```typescript
// 新增类型
import type {
  // 网络类型
  NetworkConnectionType,
  
  // 媒体能力
  MediaCapabilityInfo,
  MediaConfig,
  HDRSupport,
  
  // 振动
  VibrationPatternName,
  
  // 指纹
  DeviceFingerprintInfo,
  
  // 性能配置
  AdaptiveConfig,
  AnimationQuality
} from '@ldesign/device'
```

### 更新的接口

```typescript
// NetworkInfo 接口更新
interface NetworkInfo {
  // ...现有字段
  effectiveType?: NetworkConnectionType | string  // 更精确的类型
}

// DeviceDetectorEvents 接口更新
interface DeviceDetectorEvents {
  // ...现有事件
  safeMode: { errorCount: number, timestamp: number }  // 新增事件
}
```

---

## 🎯 最佳实践建议

### 1. 启用调试模式（开发环境）

```typescript
// ❌ 旧的做法
const detector = new DeviceDetector()

// ✅ 新的做法：开发环境启用调试
const detector = new DeviceDetector({
  debug: process.env.NODE_ENV === 'development'
})
```

### 2. 使用安全模式监听

```typescript
// ✨ 新增：监听安全模式事件
detector.on('safeMode', (data) => {
  console.warn('设备检测进入安全模式')
  // 降级到基础功能
  app.useFallbackMode()
})
```

### 3. 使用性能预算

```typescript
// ✨ 新增：在测试中使用性能预算
import { globalPerformanceBudget } from '@ldesign/device'

test('device detection performance', () => {
  const start = performance.now()
  detector.getDeviceInfo()
  const duration = performance.now() - start
  
  const exceeded = globalPerformanceBudget.checkBudget('detectionTime', duration)
  expect(exceeded).toBe(false)
})
```

---

## 🐛 已知问题和解决方案

### 问题 1：TypeScript 类型错误

**症状**: 导入新类型时 TypeScript 报错

**解决方案**:
```bash
# 重新安装依赖
pnpm install

# 重新生成类型
pnpm build
```

### 问题 2：模块加载失败

**症状**: 新模块加载时抛出 "Unknown module" 错误

**解决方案**:
```typescript
// 确保使用正确的模块名称
await detector.loadModule('mediaCapabilities')  // ✅
await detector.loadModule('media-capabilities')  // ❌
```

---

## 📦 依赖更新

### package.json 更新

无需修改依赖，所有新功能都是可选的：

```json
{
  "dependencies": {
    "@ldesign/device": "^0.2.0"
  }
}
```

### peerDependencies

无变化，Vue 依然是可选的：

```json
{
  "peerDependencies": {
    "vue": "^3.3.0"
  },
  "peerDependenciesMeta": {
    "vue": {
      "optional": true
    }
  }
}
```

---

## ⚠️ 破坏性变更

### 无破坏性变更

v0.2.0 是一个**完全向后兼容**的版本，所有现有代码都可以继续使用。

---

## 🚀 推荐升级步骤

### 步骤 1：更新依赖

```bash
pnpm update @ldesign/device
```

### 步骤 2：测试现有功能

```bash
pnpm test
```

### 步骤 3：（可选）尝试新功能

```typescript
// 尝试新模块
const wakeLockModule = await detector.loadModule('wakeLock')
```

### 步骤 4：（可选）启用性能监控

```typescript
const detector = new DeviceDetector({ debug: true })
```

---

## 📚 更多资源

- [完整 CHANGELOG](../CHANGELOG.md)
- [API 文档](./api/)
- [高级特性](./advanced-features.md)
- [性能优化指南](./performance-guide.md)

---

## 💬 获取帮助

如果在迁移过程中遇到问题：

1. 查看 [FAQ](./faq.md)
2. 提交 [Issue](https://github.com/ldesign/device/issues)
3. 加入 [Discord 社区](https://discord.gg/ldesign)

---

**祝升级顺利！** 🎉

