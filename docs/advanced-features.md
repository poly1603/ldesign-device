# @ldesign/device 高级特性指南

本文档介绍 `@ldesign/device` 包的所有高级功能和最佳实践。

---

## 📋 目录

1. [性能监控和优化](#性能监控和优化)
2. [媒体能力检测](#媒体能力检测)
3. [屏幕常亮控制](#屏幕常亮控制)
4. [振动反馈](#振动反馈)
5. [剪贴板操作](#剪贴板操作)
6. [屏幕方向锁定](#屏幕方向锁定)
7. [设备指纹](#设备指纹)
8. [自适应性能配置](#自适应性能配置)
9. [错误处理和安全模式](#错误处理和安全模式)

---

## 性能监控和优化

### 启用性能预算监控

```typescript
import { DeviceDetector } from '@ldesign/device'

// 启用调试模式以激活性能预算监控
const detector = new DeviceDetector({ 
  debug: true  // 启用性能预算警告
})

// 获取检测性能指标
const metrics = detector.getDetectionMetrics()
console.log('检测次数:', metrics.detectionCount)
console.log('平均检测时间:', metrics.averageDetectionTime, 'ms')
console.log('最后检测时间:', metrics.lastDetectionDuration, 'ms')
```

### 监听安全模式事件

```typescript
// 当检测器遇到过多错误时，会进入安全模式
detector.on('safeMode', (data) => {
  console.warn('设备检测器进入安全模式')
  console.log('错误次数:', data.errorCount)
  console.log('时间戳:', new Date(data.timestamp))
  
  // 提示用户或降级功能
  showNotification('设备检测功能受限，部分功能可能不可用')
})

// 检查是否处于安全模式
if (detector.isInSafeModeState()) {
  console.log('当前处于安全模式')
}
```

---

## 媒体能力检测

### 检测视频解码能力

```typescript
const mediaModule = await detector.loadModule('mediaCapabilities')

// 检测 4K 视频支持
const support4K = await mediaModule.checkVideoDecoding({
  contentType: 'video/mp4; codecs="avc1.640033"',
  width: 3840,
  height: 2160,
  bitrate: 25000000,
  framerate: 60
})

if (support4K.supported && support4K.smooth) {
  console.log('设备支持流畅播放 4K 60fps 视频')
  loadHighQualityVideo()
} else {
  console.log('降低视频质量')
  loadStandardVideo()
}
```

### 获取推荐视频质量

```typescript
const recommended = await mediaModule.getRecommendedVideoQuality()

console.log('推荐分辨率:', recommended.resolution)  // '1080p', '720p', etc.
console.log('推荐比特率:', recommended.bitrate)
console.log('推荐帧率:', recommended.framerate)

// 使用推荐配置
videoPlayer.setQuality(recommended.resolution)
```

### 检测 HDR 支持

```typescript
const hdrSupport = await mediaModule.checkHDRSupport()

if (hdrSupport.supported) {
  console.log('支持 HDR 类型:', hdrSupport.types)
  // ['HDR10', 'HLG', 'PQ']
  
  enableHDRMode()
}
```

### 检测音频能力

```typescript
const audioSupport = await mediaModule.checkAudioDecoding({
  contentType: 'audio/mp4; codecs="mp4a.40.2"',
  channels: 2,
  bitrate: 128000,
  samplerate: 44100
})

if (audioSupport.supported) {
  console.log('支持该音频格式')
}
```

---

## 屏幕常亮控制

### 视频播放时保持屏幕常亮

```typescript
const wakeLockModule = await detector.loadModule('wakeLock')

// 监听事件
wakeLockModule.on('acquired', () => {
  console.log('屏幕保持常亮已激活')
})

wakeLockModule.on('released', () => {
  console.log('屏幕保持常亮已释放')
})

// 播放视频时
videoElement.play()
const success = await wakeLockModule.requestWakeLock()

if (success) {
  console.log('屏幕将保持常亮')
}

// 视频结束时释放
videoElement.onended = async () => {
  await wakeLockModule.releaseWakeLock()
}
```

### 自动重新获取 Wake Lock

```typescript
// 启用自动重新获取（当用户切换标签页后再回来）
wakeLockModule.enableAutoReacquire(true)

// 现在当用户切换标签页再回来时，Wake Lock 会自动重新激活
```

### 检查 Wake Lock 状态

```typescript
console.log('是否支持:', wakeLockModule.isSupported())
console.log('是否激活:', wakeLockModule.isActive())
console.log('状态:', wakeLockModule.getStatus())  // 'Active', 'Inactive', 'Not Supported'
```

---

## 振动反馈

### 基础振动

```typescript
const vibrationModule = await detector.loadModule('vibration')

// 检查支持
if (vibrationModule.isSupported()) {
  // 振动 200 毫秒
  vibrationModule.vibrate(200)
  
  // 复杂振动模式
  vibrationModule.vibrate([100, 50, 100, 50, 100])
}
```

### 使用预设模式

```typescript
// 成功提示振动
vibrationModule.vibratePattern('success')  // 短促双振动

// 错误提示振动
vibrationModule.vibratePattern('error')    // 较长三次振动

// 警告提示振动
vibrationModule.vibratePattern('warning')  // 中等两次振动

// 通知振动
vibrationModule.vibratePattern('notification')

// 查看所有可用模式
const patterns = vibrationModule.getAvailablePatterns()
console.log('可用模式:', patterns)
```

### 创建自定义模式

```typescript
// 创建自定义振动模式
const customPattern = vibrationModule.createPattern(
  [100, 200, 100],  // 振动时长
  [50, 100]         // 暂停时长
)

vibrationModule.vibrate(customPattern)

// 或者添加为预设
vibrationModule.addPattern('myCustom', [50, 50, 50, 50, 50])
vibrationModule.vibratePattern('myCustom')
```

### 停止振动

```typescript
// 停止当前振动
vibrationModule.stop()
```

### 监听振动事件

```typescript
vibrationModule.on('vibrationStart', (data) => {
  console.log('振动开始:', data.pattern)
  if (data.name) {
    console.log('模式名称:', data.name)
  }
})

vibrationModule.on('vibrationEnd', () => {
  console.log('振动结束')
})
```

---

## 剪贴板操作

### 写入和读取文本

```typescript
const clipboardModule = await detector.loadModule('clipboard')

// 写入文本到剪贴板
const writeSuccess = await clipboardModule.writeText('Hello, World!')

if (writeSuccess) {
  console.log('文本已复制到剪贴板')
  showToast('复制成功')
}

// 从剪贴板读取文本
const text = await clipboardModule.readText()
if (text) {
  console.log('剪贴板内容:', text)
}
```

### 复制图片

```typescript
// 从 URL 复制图片
const response = await fetch('/path/to/image.png')
const blob = await response.blob()

const success = await clipboardModule.writeImage(blob)
if (success) {
  console.log('图片已复制到剪贴板')
}
```

### 从剪贴板读取图片

```typescript
const imageBlob = await clipboardModule.readImage()

if (imageBlob) {
  // 显示图片
  const url = URL.createObjectURL(imageBlob)
  imageElement.src = url
}
```

### 复制当前选中文本

```typescript
// 用户选中文本后
const success = clipboardModule.copySelection()
if (success) {
  showToast('已复制选中内容')
}
```

### 检查权限

```typescript
// 检查读取权限
const readPermission = await clipboardModule.checkPermission('clipboard-read')
console.log('读取权限:', readPermission)  // 'granted', 'denied', 'prompt', 'unknown'

// 检查写入权限
const writePermission = await clipboardModule.checkPermission('clipboard-write')
console.log('写入权限:', writePermission)
```

### 监听剪贴板事件

```typescript
clipboardModule.on('writeSuccess', (data) => {
  console.log('写入成功:', data.type)
})

clipboardModule.on('readSuccess', (data) => {
  console.log('读取成功:', data.type)
})

clipboardModule.on('error', (data) => {
  console.error('操作失败:', data.operation, data.message)
})
```

---

## 屏幕方向锁定

### 锁定屏幕方向

```typescript
const orientationModule = await detector.loadModule('orientationLock')

// 锁定为横屏
const success = await orientationModule.lock('landscape')

if (success) {
  console.log('屏幕已锁定为横屏')
  
  // 播放全屏视频...
  video.play()
}
```

### 快捷锁定方法

```typescript
// 锁定为横屏
await orientationModule.lockLandscape()

// 锁定为竖屏
await orientationModule.lockPortrait()

// 锁定为自然方向
await orientationModule.lockNatural()
```

### 解除锁定

```typescript
// 视频结束后解除锁定
video.onended = () => {
  orientationModule.unlock()
}
```

### 获取方向信息

```typescript
const info = orientationModule.getOrientationInfo()

console.log('当前方向:', info.type)           // 'portrait-primary', 'landscape-primary', etc.
console.log('当前角度:', info.angle)          // 0, 90, 180, 270
console.log('是否横屏:', info.isLandscape)    // true/false
console.log('是否竖屏:', info.isPortrait)     // true/false
console.log('是否锁定:', info.isLocked)       // true/false
```

### 监听方向变化

```typescript
orientationModule.on('orientationChange', (data) => {
  console.log('方向改变:', data.type)
  console.log('角度:', data.angle)
  
  // 更新 UI 布局
  updateLayout(data.type)
})

orientationModule.on('locked', (data) => {
  console.log('方向已锁定为:', data.orientation)
})

orientationModule.on('unlocked', () => {
  console.log('方向锁定已解除')
})
```

### 检查方向锁定能力

```typescript
// 检查设备是否能锁定特定方向
const canLockLandscape = await orientationModule.canLock('landscape')
const canLockPortrait = await orientationModule.canLock('portrait')

console.log('可以锁定横屏:', canLockLandscape)
console.log('可以锁定竖屏:', canLockPortrait)

// 获取所有支持的方向
const supported = orientationModule.getSupportedOrientations()
console.log('支持的方向:', supported)
```

---

## 设备指纹

### 生成简单指纹

```typescript
import { generateDeviceFingerprint } from '@ldesign/device'

const detector = new DeviceDetector()
const fingerprint = generateDeviceFingerprint(detector)

console.log('设备指纹:', fingerprint)  // 例如: 'a3f5c2d8'

// 存储指纹用于设备识别
localStorage.setItem('deviceFingerprint', fingerprint)
```

### 生成详细指纹

```typescript
import { generateDetailedFingerprint } from '@ldesign/device'

const detailed = generateDetailedFingerprint(detector)

console.log('指纹哈希:', detailed.hash)
console.log('置信度:', detailed.confidence)  // 0-1
console.log('组成部分:', detailed.components)
console.log('生成时间:', new Date(detailed.timestamp))

// 详细组件信息
console.log('User Agent:', detailed.components.userAgent)
console.log('屏幕尺寸:', detailed.components.screen)
console.log('时区偏移:', detailed.components.timezone)
console.log('语言:', detailed.components.language)
console.log('Canvas 指纹:', detailed.components.canvas)
```

### 比较指纹

```typescript
import { compareFingerprints, calculateFingerprintSimilarity } from '@ldesign/device'

// 简单比较
const fp1 = generateDeviceFingerprint(detector1)
const fp2 = generateDeviceFingerprint(detector2)

if (compareFingerprints(fp1, fp2)) {
  console.log('同一设备')
}

// 相似度计算
const detailed1 = generateDetailedFingerprint(detector1)
const detailed2 = generateDetailedFingerprint(detector2)

const similarity = calculateFingerprintSimilarity(detailed1, detailed2)
console.log('相似度:', similarity)  // 0-1

if (similarity > 0.9) {
  console.log('很可能是同一设备')
}
```

### 序列化和存储

```typescript
import { serializeFingerprint, deserializeFingerprint } from '@ldesign/device'

const detailed = generateDetailedFingerprint(detector)

// 序列化
const serialized = serializeFingerprint(detailed)
localStorage.setItem('fingerprint', serialized)

// 反序列化
const stored = localStorage.getItem('fingerprint')
if (stored) {
  const fingerprint = deserializeFingerprint(stored)
  if (fingerprint) {
    console.log('恢复的指纹:', fingerprint.hash)
  }
}
```

---

## 自适应性能配置

### 获取推荐配置

```typescript
import { AdaptivePerformance } from '@ldesign/device'

const perfModule = await detector.loadModule('performance')
const adaptive = new AdaptivePerformance(perfModule)

// 获取推荐配置（基于预设）
const config = adaptive.getRecommendedConfig()

console.log('动画质量:', config.animationQuality)      // 'low' | 'medium' | 'high' | 'ultra'
console.log('图片质量:', config.imageQuality)          // 0-1
console.log('启用阴影:', config.enableShadows)         // true/false
console.log('最大粒子数:', config.maxParticles)        // 50-1000
console.log('渲染缩放:', config.renderScale)           // 0.75-1.0
console.log('目标FPS:', config.targetFPS)              // 30-120

// 应用配置到应用
app.setAnimationQuality(config.animationQuality)
app.setImageQuality(config.imageQuality)
app.enableShadows(config.enableShadows)
app.setMaxParticles(config.maxParticles)
```

### 获取自定义配置

```typescript
// 基于详细性能指标的自定义配置
const customConfig = adaptive.getCustomConfig()

console.log('自定义配置:', customConfig)
```

### 获取配置建议

```typescript
const recommendations = adaptive.getConfigRecommendations()

recommendations.forEach(rec => {
  console.log('💡', rec)
})

// 示例输出:
// 💡 设备性能良好，建议：
// 💡 - 可以启用高质量动画
// 💡 - 使用高清图片资源
// 💡 - 启用大部分视觉效果
```

### 应用配置到对象

```typescript
const appSettings = {}

// 直接应用配置
adaptive.applyConfig(appSettings)

console.log('应用设置:', appSettings)
```

### 自动调整配置

```typescript
// 启用自动调整（当设备性能变化时）
adaptive.enableAutoAdjust((newConfig) => {
  console.log('性能配置已更新:', newConfig)
  
  // 应用新配置
  app.updateSettings(newConfig)
})
```

### 比较配置差异

```typescript
const config1 = adaptive.getRecommendedConfig()

// 重新运行性能测试
await perfModule.runTest()

const config2 = adaptive.getRecommendedConfig()

// 比较差异
const differences = AdaptivePerformance.compareConfigs(config1, config2)
console.log('配置变化:', differences)
```

---

## 错误处理和安全模式

### 监听错误事件

```typescript
detector.on('error', (data) => {
  console.error('检测器错误:', data.message)
  console.error('错误次数:', data.count)
  console.error('最后错误:', data.lastError)
  
  // 记录错误
  logError('DeviceDetector', data)
})
```

### 安全模式处理

```typescript
detector.on('safeMode', (data) => {
  // 进入安全模式时的处理
  console.warn('进入安全模式')
  
  // 禁用依赖设备检测的功能
  disableAdvancedFeatures()
  
  // 使用静态配置
  useStaticDeviceConfig()
  
  // 提示用户
  showNotification({
    type: 'warning',
    message: '设备检测功能受限，部分功能可能不可用',
    action: '刷新页面',
    onAction: () => window.location.reload()
  })
})
```

---

## 综合示例

### 完整的多媒体应用

```typescript
import { 
  DeviceDetector, 
  AdaptivePerformance,
  generateDeviceFingerprint 
} from '@ldesign/device'

// 1. 初始化设备检测器
const detector = new DeviceDetector({ 
  debug: true,
  enableResize: true,
  enableOrientation: true
})

// 2. 生成设备指纹
const fingerprint = generateDeviceFingerprint(detector)
analytics.track('device_fingerprint', { fingerprint })

// 3. 加载必要模块
const [
  perfModule,
  mediaModule,
  wakeLockModule,
  vibrationModule,
  clipboardModule
] = await Promise.all([
  detector.loadModule('performance'),
  detector.loadModule('mediaCapabilities'),
  detector.loadModule('wakeLock'),
  detector.loadModule('vibration'),
  detector.loadModule('clipboard')
])

// 4. 获取自适应配置
const adaptive = new AdaptivePerformance(perfModule)
const config = adaptive.getRecommendedConfig()

// 5. 应用配置
app.configure(config)

// 6. 检测最佳视频质量
const videoQuality = await mediaModule.getRecommendedVideoQuality()
videoPlayer.setQuality(videoQuality.resolution)

// 7. 设置视频播放行为
videoPlayer.on('play', async () => {
  // 保持屏幕常亮
  await wakeLockModule.requestWakeLock()
  
  // 锁定屏幕方向（如果需要）
  if (videoPlayer.isFullscreen) {
    const orientationModule = await detector.loadModule('orientationLock')
    await orientationModule.lockLandscape()
  }
})

videoPlayer.on('pause', async () => {
  // 释放屏幕锁定
  await wakeLockModule.releaseWakeLock()
})

// 8. 添加用户反馈
button.on('click', () => {
  // 提供振动反馈
  if (vibrationModule.isSupported()) {
    vibrationModule.vibratePattern('success')
  }
})

// 9. 复制分享
shareButton.on('click', async () => {
  const shareText = generateShareText()
  const success = await clipboardModule.writeText(shareText)
  
  if (success) {
    vibrationModule.vibratePattern('success')
    showToast('链接已复制')
  }
})

// 10. 错误处理
detector.on('safeMode', () => {
  // 降级为基础功能
  app.useFallbackMode()
})
```

---

## 🎯 最佳实践

### 1. 模块按需加载

```typescript
// ❌ 不好的做法：一次性加载所有模块
await Promise.all([
  detector.loadModule('network'),
  detector.loadModule('battery'),
  detector.loadModule('geolocation'),
  detector.loadModule('mediaCapabilities'),
  // ... 所有模块
])

// ✅ 好的做法：按需加载
// 只加载需要的模块
if (needsVideoPlayback) {
  await detector.loadModule('mediaCapabilities')
  await detector.loadModule('wakeLock')
}

if (needsLocationTracking) {
  await detector.loadModule('geolocation')
}
```

### 2. 合理使用缓存

```typescript
// 设备检测器实例应该在应用中复用
// ❌ 不好的做法：频繁创建新实例
function someFunction() {
  const detector = new DeviceDetector()  // 每次都创建
  // ...
}

// ✅ 好的做法：复用实例
const globalDetector = new DeviceDetector()

function someFunction() {
  const info = globalDetector.getDeviceInfo()
  // ...
}
```

### 3. 及时清理资源

```typescript
// Vue 组件中
export default {
  setup() {
    const detector = new DeviceDetector()
    
    onUnmounted(async () => {
      // 清理资源
      await detector.destroy()
    })
  }
}
```

### 4. 错误处理

```typescript
// 始终处理可能的错误
try {
  const module = await detector.loadModule('wakeLock')
  await module.requestWakeLock()
} catch (error) {
  console.warn('Wake Lock 不可用:', error)
  // 继续使用应用的其他功能
}
```

---

## 📊 性能优化技巧

### 1. 使用性能预算

```typescript
// 在开发环境启用性能预算监控
const detector = new DeviceDetector({ 
  debug: process.env.NODE_ENV === 'development'
})
```

### 2. 监控内存使用

```typescript
import { memoryManager } from '@ldesign/device'

// 定期检查内存统计
setInterval(() => {
  const stats = memoryManager.getMemoryStats()
  if (stats) {
    const usage = stats.usedHeapSize / stats.heapLimit
    console.log('内存使用率:', (usage * 100).toFixed(2) + '%')
    
    if (usage > 0.8) {
      console.warn('内存使用率较高，建议清理')
      memoryManager.suggestGC()
    }
  }
}, 30000)
```

### 3. 批量加载模块

```typescript
// 使用模块加载器的批量加载功能
const moduleLoader = detector['moduleLoader']  // 内部访问
const modules = await moduleLoader.loadMultiple([
  'network',
  'battery',
  'geolocation'
], 3)  // 最多 3 个并发
```

---

## 🔗 相关资源

- [主文档](../README.md)
- [API 参考](./api/)
- [性能优化指南](./performance-guide.md)
- [优化总结](../OPTIMIZATION_SUMMARY.md)

---

**最后更新**: 2025-10-25

