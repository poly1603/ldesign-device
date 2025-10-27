# @ldesign/device API 使用示例

完整的 API 使用示例和最佳实践。

---

## 核心 API

### DeviceDetector

#### 基础使用

```typescript
import { DeviceDetector } from '@ldesign/device'

// 创建检测器
const detector = new DeviceDetector({
  enableResize: true,
  enableOrientation: true,
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  debounceDelay: 300,
  debug: false
})

// 获取设备信息
const info = detector.getDeviceInfo()
console.log('设备类型:', info.type)
console.log('屏幕方向:', info.orientation)
console.log('屏幕尺寸:', info.width, 'x', info.height)

// 快捷方法
console.log('是否移动设备:', detector.isMobile())
console.log('是否平板:', detector.isTablet())
console.log('是否桌面:', detector.isDesktop())
console.log('是否触摸设备:', detector.isTouchDevice())

// 手动刷新
detector.refresh()

// 销毁
await detector.destroy()
```

#### 事件监听

```typescript
// 监听设备变化
detector.on('deviceChange', (deviceInfo) => {
  console.log('设备变化:', deviceInfo.type)
})

// 监听方向变化
detector.on('orientationChange', (orientation) => {
  console.log('方向变化:', orientation)
})

// 监听窗口大小变化
detector.on('resize', ({ width, height }) => {
  console.log('窗口大小:', width, 'x', height)
})

// 一次性监听器
detector.once('deviceChange', (info) => {
  console.log('首次设备变化:', info)
})

// 移除监听器
detector.off('deviceChange', handler)

// 移除所有监听器
detector.removeAllListeners()
```

---

## 模块 API

### NetworkModule

```typescript
const networkModule = await detector.loadModule('network')

// 获取网络信息
const networkInfo = networkModule.getData()
console.log('在线状态:', networkInfo.status)
console.log('连接类型:', networkInfo.type)
console.log('下载速度:', networkInfo.downlink, 'Mbps')
console.log('延迟:', networkInfo.rtt, 'ms')

// 快捷方法
console.log('是否在线:', networkModule.isOnline())
console.log('是否离线:', networkModule.isOffline())
console.log('连接类型:', networkModule.getConnectionType())

// 监听网络变化
detector.on('networkChange', (info) => {
  if (info.status === 'offline') {
    showOfflineNotification()
  }
})
```

### BatteryModule

```typescript
const batteryModule = await detector.loadModule('battery')

// 获取电池信息
const batteryInfo = batteryModule.getData()
console.log('电量:', batteryInfo.level * 100, '%')
console.log('是否充电:', batteryInfo.charging)

// 快捷方法
console.log('电量:', batteryModule.getLevelPercentage(), '%')
console.log('是否充电:', batteryModule.isCharging())
console.log('是否低电量:', batteryModule.isLowBattery(0.2))
console.log('电池状态:', batteryModule.getBatteryStatus())

// 监听电池变化
detector.on('batteryChange', (info) => {
  if (info.level < 0.2 && !info.charging) {
    enablePowerSavingMode()
  }
})
```

### GeolocationModule

```typescript
const geoModule = await detector.loadModule('geolocation')

// 检查支持
if (geoModule.isSupported()) {
  // 获取当前位置
  const position = await geoModule.getCurrentPosition()
  console.log('纬度:', position.latitude)
  console.log('经度:', position.longitude)
  console.log('精度:', position.accuracy, 'm')

  // 开始监听位置变化
  geoModule.startWatching((position) => {
    console.log('位置更新:', position)
    updateMap(position)
  })

  // 停止监听
  geoModule.stopWatching()

  // 计算距离
  const distance = geoModule.calculateDistance(
    39.9042, 116.4074,  // 北京
    31.2304, 121.4737   // 上海
  )
  console.log('距离:', distance / 1000, 'km')
}
```

### PerformanceModule

```typescript
const perfModule = await detector.loadModule('performance')

// 获取性能信息
const perfInfo = perfModule.getData()
console.log('综合评分:', perfInfo.score)
console.log('性能等级:', perfInfo.tier)
console.log('CPU 评分:', perfInfo.metrics.cpu)
console.log('GPU 评分:', perfInfo.metrics.gpu)
console.log('内存评分:', perfInfo.metrics.memory)

// 查看硬件信息
console.log('CPU 核心数:', perfInfo.hardware.cpuCores)
console.log('设备内存:', perfInfo.hardware.deviceMemory, 'GB')

// 查看优化建议
perfInfo.recommendations.forEach(rec => {
  console.log('💡', rec)
})

// 重新运行测试
const newPerfInfo = await perfModule.runTest({
  includeGPU: true,
  includeNetwork: true,
  timeout: 5000
})
```

### MediaCapabilitiesModule

```typescript
const mediaModule = await detector.loadModule('mediaCapabilities')

// 检测视频解码能力
const videoSupport = await mediaModule.checkVideoDecoding({
  contentType: 'video/mp4; codecs="avc1.42E01E"',
  width: 1920,
  height: 1080,
  bitrate: 5000000,
  framerate: 60
})

console.log('是否支持:', videoSupport.supported)
console.log('是否流畅:', videoSupport.smooth)
console.log('是否省电:', videoSupport.powerEfficient)

// 获取推荐视频质量
const recommended = await mediaModule.getRecommendedVideoQuality()
console.log('推荐分辨率:', recommended.resolution)

// 检测 HDR 支持
const hdr = await mediaModule.checkHDRSupport()
if (hdr.supported) {
  console.log('支持的 HDR 类型:', hdr.types)
}

// 获取最大刷新率
const refreshRate = mediaModule.getMaxRefreshRate()
console.log('最大刷新率:', refreshRate, 'Hz')
```

### WakeLockModule

```typescript
const wakeLockModule = await detector.loadModule('wakeLock')

// 请求屏幕保持常亮
const success = await wakeLockModule.requestWakeLock()
if (success) {
  console.log('屏幕将保持常亮')
}

// 检查状态
console.log('是否激活:', wakeLockModule.isActive())
console.log('状态:', wakeLockModule.getStatus())

// 释放 Wake Lock
await wakeLockModule.releaseWakeLock()

// 启用自动重新获取
wakeLockModule.enableAutoReacquire(true)

// 监听事件
wakeLockModule.on('acquired', () => {
  console.log('Wake Lock 已获取')
})

wakeLockModule.on('released', () => {
  console.log('Wake Lock 已释放')
})
```

### VibrationModule

```typescript
const vibrationModule = await detector.loadModule('vibration')

// 简单振动
vibrationModule.vibrate(200)

// 复杂模式
vibrationModule.vibrate([100, 50, 100, 50, 100])

// 使用预设模式
vibrationModule.vibratePattern('success')
vibrationModule.vibratePattern('error')
vibrationModule.vibratePattern('warning')
vibrationModule.vibratePattern('notification')

// 查看所有模式
const patterns = vibrationModule.getAvailablePatterns()
console.log('可用模式:', patterns)

// 添加自定义模式
vibrationModule.addPattern('myPattern', [50, 50, 50])
vibrationModule.vibratePattern('myPattern')

// 停止振动
vibrationModule.stop()

// 监听事件
vibrationModule.on('vibrationStart', (data) => {
  console.log('振动开始:', data.pattern)
})
```

### ClipboardModule

```typescript
const clipboardModule = await detector.loadModule('clipboard')

// 写入文本
const success = await clipboardModule.writeText('Hello World')
if (success) {
  console.log('文本已复制')
}

// 读取文本
const text = await clipboardModule.readText()
console.log('剪贴板内容:', text)

// 写入图片
const blob = await fetch('/image.png').then(r => r.blob())
await clipboardModule.writeImage(blob)

// 读取图片
const imageBlob = await clipboardModule.readImage()
if (imageBlob) {
  const url = URL.createObjectURL(imageBlob)
  img.src = url
}

// 复制选中文本
clipboardModule.copySelection()

// 检查权限
const permission = await clipboardModule.checkPermission('clipboard-read')
console.log('读取权限:', permission)
```

### OrientationLockModule

```typescript
const orientationModule = await detector.loadModule('orientationLock')

// 锁定为横屏
await orientationModule.lock('landscape')

// 快捷方法
await orientationModule.lockLandscape()
await orientationModule.lockPortrait()
await orientationModule.lockNatural()

// 解除锁定
orientationModule.unlock()

// 获取方向信息
const info = orientationModule.getOrientationInfo()
console.log('当前方向:', info.type)
console.log('角度:', info.angle)
console.log('是否锁定:', info.isLocked)

// 检查能力
const canLock = await orientationModule.canLock('landscape')
console.log('可以锁定横屏:', canLock)
```

---

## 工具 API

### PerformanceBudget

```typescript
import { createPerformanceBudget } from '@ldesign/device'

const budget = createPerformanceBudget({
  detectionTime: 50,
  moduleLoadTime: 100,
  eventEmitTime: 5,
  enableWarnings: true,
  collectStats: true
})

// 检查预算
budget.checkBudget('detectionTime', 45)  // OK
budget.checkBudget('detectionTime', 60)  // ⚠️ 超出预算

// 获取统计
const stats = budget.getStats('detectionTime')
console.log('检查次数:', stats.totalChecks)
console.log('超出次数:', stats.budgetExceeded)
console.log('平均耗时:', stats.averageDuration)

// 生成报告
console.log(budget.generateReport())
```

### DeviceFingerprint

```typescript
import { 
  generateDeviceFingerprint,
  generateDetailedFingerprint,
  compareFingerprints,
  calculateFingerprintSimilarity
} from '@ldesign/device'

// 简单指纹
const fp = generateDeviceFingerprint(detector)
console.log('指纹:', fp)

// 详细指纹
const detailed = generateDetailedFingerprint(detector)
console.log('哈希:', detailed.hash)
console.log('置信度:', detailed.confidence)
console.log('组件:', detailed.components)

// 比较指纹
if (compareFingerprints(fp1, fp2)) {
  console.log('同一设备')
}

// 计算相似度
const similarity = calculateFingerprintSimilarity(detailed1, detailed2)
console.log('相似度:', similarity)
```

### AdaptivePerformance

```typescript
import { AdaptivePerformance } from '@ldesign/device'

const perfModule = await detector.loadModule('performance')
const adaptive = new AdaptivePerformance(perfModule)

// 获取推荐配置
const config = adaptive.getRecommendedConfig()
console.log('配置:', config)

// 获取自定义配置
const customConfig = adaptive.getCustomConfig()

// 获取建议
const recommendations = adaptive.getConfigRecommendations()
recommendations.forEach(r => console.log(r))

// 应用配置
adaptive.applyConfig(myApp)

// 自动调整
adaptive.enableAutoAdjust((newConfig) => {
  myApp.updateConfig(newConfig)
})

// 比较配置
const diff = AdaptivePerformance.compareConfigs(config1, config2)
console.log('差异:', diff)
```

---

## Vue3 Composables API

### useDevice

```vue
<script setup lang="ts">
import { useDevice } from '@ldesign/device/vue'

const {
  deviceType,
  orientation,
  deviceInfo,
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,
  refresh
} = useDevice()
</script>

<template>
  <div>
    <p>设备类型: {{ deviceType }}</p>
    <p>屏幕方向: {{ orientation }}</p>
    <p>是否移动: {{ isMobile }}</p>
    <button @click="refresh">刷新</button>
  </div>
</template>
```

### useNetwork

```vue
<script setup lang="ts">
import { useNetwork } from '@ldesign/device/vue'

const {
  networkInfo,
  isOnline,
  connectionType,
  isLoaded,
  loadModule,
  unloadModule
} = useNetwork()

onMounted(() => {
  loadModule()
})
</script>

<template>
  <div v-if="isLoaded">
    <p>网络状态: {{ isOnline ? '在线' : '离线' }}</p>
    <p>连接类型: {{ connectionType }}</p>
  </div>
</template>
```

### useBattery

```vue
<script setup lang="ts">
import { useBattery } from '@ldesign/device/vue'

const {
  batteryLevel,
  isCharging,
  batteryInfo,
  isLoaded,
  loadModule
} = useBattery()

onMounted(() => {
  loadModule()
})
</script>

<template>
  <div v-if="isLoaded && batteryInfo">
    <p>电量: {{ Math.round(batteryLevel * 100) }}%</p>
    <p>充电中: {{ isCharging ? '是' : '否' }}</p>
  </div>
</template>
```

### useMediaCapabilities

```vue
<script setup lang="ts">
import { useMediaCapabilities } from '@ldesign/device/vue'

const {
  isSupported,
  checkVideo,
  getRecommendedQuality,
  loadModule
} = useMediaCapabilities()

onMounted(async () => {
  await loadModule()
  
  const recommended = await getRecommendedQuality()
  console.log('推荐质量:', recommended)
})
</script>

<template>
  <div v-if="isSupported">
    <p>支持媒体能力检测</p>
  </div>
</template>
```

### useWakeLock

```vue
<script setup lang="ts">
import { useWakeLock } from '@ldesign/device/vue'

const {
  isActive,
  request,
  release,
  enableAutoReacquire
} = useWakeLock()

async function playVideo() {
  await request()
  enableAutoReacquire(true)
  // 播放视频...
}

async function stopVideo() {
  await release()
}
</script>

<template>
  <div>
    <p>屏幕常亮: {{ isActive ? '是' : '否' }}</p>
    <button @click="playVideo">播放视频</button>
    <button @click="stopVideo">停止视频</button>
  </div>
</template>
```

### useVibration

```vue
<script setup lang="ts">
import { useVibration } from '@ldesign/device/vue'

const {
  isSupported,
  vibrate,
  vibratePattern,
  stop
} = useVibration()

function handleClick() {
  if (isSupported.value) {
    vibratePattern('success')
  }
}
</script>

<template>
  <div>
    <button @click="handleClick">点击（带振动反馈）</button>
    <button @click="() => vibratePattern('error')">错误振动</button>
    <button @click="stop">停止振动</button>
  </div>
</template>
```

### useClipboard

```vue
<script setup lang="ts">
import { useClipboard } from '@ldesign/device/vue'

const {
  writeText,
  readText,
  copySuccess
} = useClipboard()

async function copy() {
  const success = await writeText('Hello World')
  if (success) {
    alert('复制成功')
  }
}

async function paste() {
  const text = await readText()
  if (text) {
    console.log('粘贴内容:', text)
  }
}
</script>

<template>
  <div>
    <button @click="copy">复制</button>
    <button @click="paste">粘贴</button>
    <p v-if="copySuccess">✅ 复制成功</p>
  </div>
</template>
```

### useOrientationLock

```vue
<script setup lang="ts">
import { useOrientationLock } from '@ldesign/device/vue'

const {
  isLocked,
  currentOrientation,
  lock,
  unlock,
  lockLandscape
} = useOrientationLock()

async function enterFullscreen() {
  await lockLandscape()
  video.requestFullscreen()
}

function exitFullscreen() {
  unlock()
}
</script>

<template>
  <div>
    <p>方向: {{ currentOrientation }}</p>
    <p>已锁定: {{ isLocked ? '是' : '否' }}</p>
    <button @click="enterFullscreen">全屏播放</button>
    <button @click="exitFullscreen">退出全屏</button>
  </div>
</template>
```

---

## Vue 指令 API

### v-device

```vue
<template>
  <!-- 基础使用 -->
  <div v-device="'mobile'">只在移动设备显示</div>
  <div v-device="'tablet'">只在平板显示</div>
  <div v-device="'desktop'">只在桌面显示</div>

  <!-- 多设备 -->
  <div v-device="['mobile', 'tablet']">移动和平板显示</div>

  <!-- 反向匹配 -->
  <div v-device="{ type: 'mobile', inverse: true }">
    非移动设备显示
  </div>

  <!-- 修饰符指令 -->
  <div v-device-mobile>移动端</div>
  <div v-device-tablet>平板端</div>
  <div v-device-desktop>桌面端</div>
</template>
```

---

## Engine 插件 API

### 基础使用

```typescript
import { createDeviceEnginePlugin } from '@ldesign/device'
import { createEngine } from '@ldesign/engine'

const devicePlugin = createDeviceEnginePlugin({
  name: 'device',
  version: '1.0.0',
  enableResize: true,
  enableOrientation: true,
  modules: ['network', 'battery', 'geolocation'],
  globalPropertyName: '$device',
  autoInstall: true,
  debug: false,
  enablePerformanceMonitoring: false
})

const engine = createEngine({
  plugins: [devicePlugin]
})
```

### 在组件中使用

```vue
<script setup>
// 通过全局属性访问
const { $device } = getCurrentInstance().appContext.config.globalProperties

console.log('设备类型:', $device.getDeviceType())

// 或使用 composable
import { useDevice } from '@ldesign/device/vue'
const { deviceInfo } = useDevice()
</script>
```

---

## 工具函数 API

### debounce & throttle

```typescript
import { debounce, throttle } from '@ldesign/device'

// 防抖
const debouncedFn = debounce(() => {
  console.log('执行')
}, 300)

// 取消防抖
debouncedFn.cancel()

// 节流
const throttledFn = throttle(() => {
  console.log('执行')
}, 1000, {
  leading: true,
  trailing: true
})

// 取消节流
throttledFn.cancel()
```

### 其他工具函数

```typescript
import {
  isMobileDevice,
  isTouchDevice,
  getDeviceTypeByWidth,
  getScreenOrientation,
  parseOS,
  parseBrowser,
  getPixelRatio,
  isAPISupported,
  safeNavigatorAccess,
  formatBytes,
  generateId
} from '@ldesign/device'

// 检测移动设备
const isMobile = isMobileDevice()

// 检测触摸设备
const hasTouch = isTouchDevice()

// 根据宽度获取设备类型
const type = getDeviceTypeByWidth(800)  // 'tablet'

// 获取屏幕方向
const orientation = getScreenOrientation()

// 解析 UserAgent
const os = parseOS(navigator.userAgent)
const browser = parseBrowser(navigator.userAgent)

// 获取像素比
const ratio = getPixelRatio()

// 检查 API 支持
const supported = isAPISupported('navigator.geolocation')

// 安全访问 Navigator
const language = safeNavigatorAccess('language', 'en')

// 格式化字节
const size = formatBytes(1024 * 1024)  // '1 MB'

// 生成唯一 ID
const id = generateId('device')  // 'device-abc123xyz'
```

---

## TypeScript 类型导出

### 导入类型

```typescript
import type {
  DeviceInfo,
  DeviceType,
  Orientation,
  NetworkInfo,
  NetworkType,
  NetworkStatus,
  NetworkConnectionType,
  BatteryInfo,
  GeolocationInfo,
  DeviceDetectorOptions,
  DeviceDetectorEvents,
  DeviceModule,
  UseDeviceReturn,
  MediaCapabilityInfo,
  HDRSupport,
  VibrationPatternName,
  OrientationLockType
} from '@ldesign/device'
```

### 类型守卫

```typescript
function isDeviceInfo(obj: unknown): obj is DeviceInfo {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'type' in obj &&
    'orientation' in obj
  )
}

function isNetworkInfo(obj: unknown): obj is NetworkInfo {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'status' in obj &&
    'type' in obj
  )
}
```

---

## 完整应用示例

### 响应式 Web 应用

```typescript
import {
  DeviceDetector,
  AdaptivePerformance,
  generateDeviceFingerprint
} from '@ldesign/device'

class Application {
  private detector: DeviceDetector
  private adaptive: AdaptivePerformance | null = null
  
  async init() {
    // 1. 初始化设备检测器
    this.detector = new DeviceDetector({
      debug: process.env.NODE_ENV === 'development',
      enableResize: true,
      enableOrientation: true,
      debounceDelay: 300
    })
    
    // 2. 生成设备指纹
    const fingerprint = generateDeviceFingerprint(this.detector)
    this.trackDevice(fingerprint)
    
    // 3. 性能评估
    const perfModule = await this.detector.loadModule('performance')
    this.adaptive = new AdaptivePerformance(perfModule)
    const config = this.adaptive.getRecommendedConfig()
    
    // 4. 应用配置
    this.applyConfig(config)
    
    // 5. 设置设备监听
    this.setupDeviceListeners()
    
    // 6. 加载必要模块
    await this.loadModules()
  }
  
  private applyConfig(config: AdaptiveConfig) {
    // 应用性能配置
    this.renderer.setQuality(config.animationQuality)
    this.imageLoader.setQuality(config.imageQuality)
    this.particleSystem.setMaxParticles(config.maxParticles)
  }
  
  private setupDeviceListeners() {
    this.detector.on('deviceChange', (info) => {
      this.handleDeviceChange(info)
    })
    
    this.detector.on('orientationChange', (orientation) => {
      this.handleOrientationChange(orientation)
    })
    
    this.detector.on('safeMode', () => {
      this.enterSafeMode()
    })
  }
  
  private async loadModules() {
    const modules = await Promise.all([
      this.detector.loadModule('network'),
      this.detector.loadModule('battery')
    ])
    
    // 设置网络监听
    this.detector.on('networkChange', (info) => {
      if (info.status === 'offline') {
        this.handleOffline()
      }
    })
    
    // 设置电池监听
    this.detector.on('batteryChange', (info) => {
      if (info.level < 0.2 && !info.charging) {
        this.enablePowerSaving()
      }
    })
  }
  
  async destroy() {
    await this.detector.destroy()
  }
}
```

---

## 相关文档

- [README](../README.md)
- [高级特性](./advanced-features.md)
- [性能优化指南](./performance-guide.md)

