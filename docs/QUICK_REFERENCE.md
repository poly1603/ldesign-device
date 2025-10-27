# @ldesign/device 快速参考

快速查找常用 API 和代码片段。

---

## 📦 安装

```bash
pnpm add @ldesign/device
```

---

## 🚀 基础使用

### 创建检测器

```typescript
import { DeviceDetector } from '@ldesign/device'

const detector = new DeviceDetector({
  enableResize: true,      // 监听窗口大小变化
  enableOrientation: true, // 监听方向变化
  debounceDelay: 300,     // 防抖延迟（毫秒）
  debug: false            // 调试模式
})
```

### 获取设备信息

```typescript
const info = detector.getDeviceInfo()
// info.type: 'mobile' | 'tablet' | 'desktop'
// info.orientation: 'portrait' | 'landscape'
// info.width, info.height, info.pixelRatio
```

### 快捷方法

```typescript
detector.isMobile()       // boolean
detector.isTablet()       // boolean
detector.isDesktop()      // boolean
detector.isTouchDevice()  // boolean
```

---

## 📡 事件监听

```typescript
// 设备变化
detector.on('deviceChange', (info) => {})

// 方向变化
detector.on('orientationChange', (orientation) => {})

// 窗口大小变化
detector.on('resize', ({ width, height }) => {})

// 安全模式（v0.2.0+）
detector.on('safeMode', (data) => {})
```

---

## 🧩 模块加载

### 加载模块

```typescript
// 基础模块
const network = await detector.loadModule('network')
const battery = await detector.loadModule('battery')
const geo = await detector.loadModule('geolocation')

// 新增模块（v0.2.0+）
const media = await detector.loadModule('mediaCapabilities')
const wakeLock = await detector.loadModule('wakeLock')
const vibration = await detector.loadModule('vibration')
const clipboard = await detector.loadModule('clipboard')
const orientation = await detector.loadModule('orientationLock')
```

### 模块使用

```typescript
// Network
const networkInfo = network.getData()
network.isOnline()  // boolean

// Battery
const batteryInfo = battery.getData()
battery.getLevelPercentage()  // 0-100

// Geolocation
const position = await geo.getCurrentPosition()
```

---

## 🎨 Vue3 集成

### Composables

```vue
<script setup>
import {
  useDevice,
  useNetwork,
  useBattery,
  useGeolocation,
  // v0.2.0+ 新增
  useMediaCapabilities,
  useWakeLock,
  useVibration,
  useClipboard,
  useOrientationLock
} from '@ldesign/device/vue'

const { deviceType, isMobile } = useDevice()
const { isOnline } = useNetwork()
const { batteryLevel } = useBattery()
</script>
```

### 指令

```vue
<template>
  <!-- 基础指令 -->
  <div v-device="'mobile'">移动端</div>
  <div v-device="'tablet'">平板端</div>
  <div v-device="'desktop'">桌面端</div>
  
  <!-- 快捷指令 -->
  <div v-device-mobile>移动端</div>
  <div v-device-tablet>平板端</div>
  <div v-device-desktop>桌面端</div>
  
  <!-- 多设备 -->
  <div v-device="['mobile', 'tablet']">移动和平板</div>
  
  <!-- 反向 -->
  <div v-device="{ type: 'mobile', inverse: true }">
    非移动端
  </div>
</template>
```

---

## 🆕 v0.2.0 新功能速查

### 媒体能力

```typescript
const media = await detector.loadModule('mediaCapabilities')

// 检测视频
await media.checkVideoDecoding({
  contentType: 'video/mp4',
  width: 1920,
  height: 1080,
  bitrate: 5000000,
  framerate: 30
})

// 推荐质量
await media.getRecommendedVideoQuality()

// HDR 支持
await media.checkHDRSupport()
```

### Wake Lock

```typescript
const wakeLock = await detector.loadModule('wakeLock')

await wakeLock.requestWakeLock()  // 请求
await wakeLock.releaseWakeLock()  // 释放
wakeLock.isActive()              // 检查状态
```

### 振动

```typescript
const vib = await detector.loadModule('vibration')

vib.vibrate(200)                  // 简单振动
vib.vibratePattern('success')     // 预设模式
vib.stop()                        // 停止
```

### 剪贴板

```typescript
const clip = await detector.loadModule('clipboard')

await clip.writeText('text')      // 写入文本
await clip.readText()             // 读取文本
await clip.writeImage(blob)       // 写入图片
await clip.readImage()            // 读取图片
```

### 方向锁定

```typescript
const orient = await detector.loadModule('orientationLock')

await orient.lock('landscape')    // 锁定横屏
await orient.lockPortrait()       // 锁定竖屏
orient.unlock()                   // 解锁
```

### 设备指纹

```typescript
import { generateDeviceFingerprint } from '@ldesign/device'

const fp = generateDeviceFingerprint(detector)
// 返回: 'a3f5c2d8' (8位哈希)
```

### 自适应配置

```typescript
import { AdaptivePerformance } from '@ldesign/device'

const perf = await detector.loadModule('performance')
const adaptive = new AdaptivePerformance(perf)
const config = adaptive.getRecommendedConfig()

// config.animationQuality: 'low' | 'medium' | 'high' | 'ultra'
// config.imageQuality: 0-1
// config.maxParticles: 50-1000
```

### 性能预算

```typescript
import { createPerformanceBudget } from '@ldesign/device'

const budget = createPerformanceBudget({ debug: true })
budget.checkBudget('operationName', duration)
```

---

## 🔧 工具函数

```typescript
import {
  debounce,
  throttle,
  isMobileDevice,
  isTouchDevice,
  formatBytes,
  generateId,
  // v0.2.0+ 新增
  generateDeviceFingerprint,
  generateDetailedFingerprint,
  createPerformanceBudget,
  createAdaptivePerformance
} from '@ldesign/device'
```

---

## 💾 内存管理

```typescript
import { memoryManager } from '@ldesign/device'

// 内存统计
const stats = memoryManager.getMemoryStats()

// 检查压力
memoryManager.checkMemoryPressure()

// 建议 GC
memoryManager.suggestGC()

// 对象池
import { createReusablePool } from '@ldesign/device'
const pool = createReusablePool('name', createFn, resetFn, 100)
```

---

## 🎯 常用模式

### 响应式布局

```typescript
detector.on('deviceChange', (info) => {
  switch (info.type) {
    case 'mobile':
      applyMobileLayout()
      break
    case 'tablet':
      applyTabletLayout()
      break
    case 'desktop':
      applyDesktopLayout()
      break
  }
})
```

### 性能优化

```typescript
detector.on('networkChange', (info) => {
  if (info.type === '2g' || info.saveData) {
    enableDataSavingMode()
  }
})

detector.on('batteryChange', (info) => {
  if (info.level < 0.2) {
    enablePowerSavingMode()
  }
})
```

### 视频播放器

```typescript
const media = await detector.loadModule('mediaCapabilities')
const wakeLock = await detector.loadModule('wakeLock')
const orient = await detector.loadModule('orientationLock')

// 播放时
video.play()
await wakeLock.requestWakeLock()
await orient.lockLandscape()

// 结束时
video.onended = async () => {
  await wakeLock.releaseWakeLock()
  orient.unlock()
}
```

---

## 📱 移动端优化

```typescript
// 触摸设备优化
if (detector.isTouchDevice()) {
  enableTouchGestures()
  increaseTapTargetSize()
}

// 低性能设备优化
const perf = await detector.loadModule('performance')
if (perf.getTier() === 'low') {
  reduceAnimations()
  disableNonEssentialFeatures()
}

// 低电量优化
const battery = await detector.loadModule('battery')
if (battery.isLowBattery()) {
  enablePowerSavingMode()
}
```

---

## 🔗 链接

- [完整文档](../README.md)
- [API 示例](./api-examples.md)
- [高级特性](./advanced-features.md)
- [性能指南](./performance-guide.md)
- [迁移指南](./MIGRATION.md)

---

**快速参考 v0.2.0**

