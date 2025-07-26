# 🔍 @ldesign/device

> 功能强大的设备信息检测库，让你的应用智能适配各种设备！

[![npm version](https://img.shields.io/npm/v/@ldesign/device.svg)](https://www.npmjs.com/package/@ldesign/device)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 核心特性

### 🎯 精准检测
- **设备类型识别**：准确区分 desktop、tablet、mobile
- **双重检测算法**：结合屏幕尺寸和用户代理字符串
- **自定义阈值**：灵活配置检测边界值

### 🔄 实时响应
- **屏幕方向检测**：实时监听 portrait/landscape 变化
- **窗口尺寸监听**：响应浏览器窗口大小调整
- **防抖优化**：避免频繁触发，保证性能

### 🚀 性能优先
- **核心功能立即可用**：基础检测无延迟
- **按需加载**：扩展特性（OS、浏览器、硬件信息）按需获取
- **内存友好**：合理的事件监听和清理机制

### 💪 TypeScript 支持
- **完整类型定义**：所有 API 都有详细的类型注解
- **智能提示**：IDE 中获得完整的代码补全
- **类型安全**：编译时捕获类型错误

### 🎨 Vue3 深度集成
- **Composition API**：useDevice、useDeviceType、useOrientation 等
- **组件支持**：DeviceProvider、DeviceInfo 等
- **指令系统**：v-mobile、v-desktop、v-portrait 等
- **插件安装**：一键安装，全局可用

### 🔧 框架扩展性
- **适配器模式**：抽象的框架适配器接口
- **Vue2 支持**：规划中
- **React 支持**：规划中

### 🌟 扩展特性
- **操作系统检测**：Windows、macOS、iOS、Android、Linux
- **浏览器检测**：Chrome、Firefox、Safari、Edge
- **硬件信息**：CPU 核心数、内存、GPU 信息
- **网络状态**：在线状态、连接类型、网速
- **电池状态**：充电状态、电量、充电时间

## 🚀 快速开始

### 安装

```bash
# 使用 pnpm（推荐）
pnpm add @ldesign/device

# 使用 npm
npm install @ldesign/device

# 使用 yarn
yarn add @ldesign/device
```

### 基础使用

```typescript
import { getDeviceInfo, onDeviceChange } from '@ldesign/device'

// 获取当前设备信息
const deviceInfo = getDeviceInfo()
console.log(deviceInfo)
// {
//   type: 'desktop',
//   orientation: 'landscape',
//   width: 1920,
//   height: 1080,
//   pixelRatio: 2,
//   isTouchDevice: false,
//   userAgent: '...'
// }

// 监听设备变化
const unsubscribe = onDeviceChange((event) => {
  console.log('设备信息变化:', event.current)
  console.log('变化的属性:', event.changes)
})

// 取消监听
unsubscribe()
```

### Vue 3 集成

```vue
<template>
  <div>
    <h2>设备信息</h2>
    <p>设备类型: {{ deviceInfo.type }}</p>
    <p>屏幕方向: {{ deviceInfo.orientation }}</p>
    <p>屏幕尺寸: {{ deviceInfo.width }} x {{ deviceInfo.height }}</p>

    <!-- 条件渲染 -->
    <div v-if="isMobile">移动端专用内容</div>
    <div v-else-if="isTablet">平板专用内容</div>
    <div v-else>桌面端专用内容</div>
  </div>
</template>

<script setup lang="ts">
import { useDevice } from '@ldesign/device'

const {
  deviceInfo,
  isMobile,
  isTablet,
  isDesktop,
  isPortrait,
  isLandscape
} = useDevice()
</script>
```

### Vue3 插件使用

```typescript
// main.ts
import { createApp } from 'vue'
import { DevicePlugin } from '@ldesign/device'
import App from './App.vue'

const app = createApp(App)

// 安装设备检测插件
app.use(DevicePlugin, {
  tabletMinWidth: 768,
  desktopMinWidth: 1024
})

app.mount('#app')
```

### Vue3 指令

```vue
<template>
  <div>
    <!-- 设备类型指令 -->
    <div v-mobile>📱 仅移动端显示</div>
    <div v-tablet>📱 仅平板显示</div>
    <div v-desktop>💻 仅桌面显示</div>

    <!-- 取反指令 -->
    <div v-mobile.not>🚫 非移动端显示</div>

    <!-- 方向指令 -->
    <div v-portrait>📱 竖屏内容</div>
    <div v-landscape>📱 横屏内容</div>

    <!-- 触摸设备指令 -->
    <div v-touch>👆 触摸设备专用</div>

    <!-- 组合指令 -->
    <div v-device="['tablet', 'desktop']">平板或桌面</div>
  </div>
</template>
```

### 扩展设备信息

```typescript
import { getExtendedDeviceInfo } from '@ldesign/device'

// 获取扩展设备信息
const extendedInfo = await getExtendedDeviceInfo()

console.log(extendedInfo)
// {
//   type: 'desktop',
//   orientation: 'landscape',
//   width: 1920,
//   height: 1080,
//   pixelRatio: 2,
//   isTouchDevice: false,
//   userAgent: '...',
//   os: { name: 'Windows', version: '10.0' },
//   browser: { name: 'Chrome', version: '120.0' },
//   hardware: { cores: 8, memory: 16, gpu: 'NVIDIA GeForce RTX 3080' },
//   network: { type: '4g', online: true, downlink: 10 },
//   battery: { charging: true, level: 0.8 }
// }
```

## 📖 API 文档

### 核心 API

#### `getDeviceInfo(config?)`

获取当前设备信息。

```typescript
import { getDeviceInfo } from '@ldesign/device'

const deviceInfo = getDeviceInfo({
  tabletMinWidth: 768,
  desktopMinWidth: 1024
})
```

#### `onDeviceChange(callback, config?)`

监听设备信息变化。

```typescript
import { onDeviceChange } from '@ldesign/device'

const unsubscribe = onDeviceChange((event) => {
  console.log('当前设备:', event.current)
  console.log('之前设备:', event.previous)
  console.log('变化属性:', event.changes)
})
```

#### `createDeviceDetector(config?)`

创建设备检测器实例。

```typescript
import { createDeviceDetector } from '@ldesign/device'

const detector = createDeviceDetector({
  enableUserAgentDetection: true,
  enableTouchDetection: true
})

const deviceInfo = detector.getDeviceInfo()
const unsubscribe = detector.onDeviceChange(callback)

// 记得销毁
detector.destroy()
```

#### `getExtendedDeviceInfo(): Promise<ExtendedDeviceInfo>`

获取扩展设备信息，包括操作系统、浏览器、硬件等详细信息。

```typescript
import { getExtendedDeviceInfo } from '@ldesign/device'

const extendedInfo = await getExtendedDeviceInfo()
console.log(extendedInfo.os)       // 操作系统信息
console.log(extendedInfo.browser)  // 浏览器信息
console.log(extendedInfo.hardware) // 硬件信息
console.log(extendedInfo.network)  // 网络信息
console.log(extendedInfo.battery)  // 电池信息
```

### 框架适配器 API

#### `registerAdapter(name: string, factory: AdapterFactory)`

注册框架适配器。

```typescript
import { registerAdapter } from '@ldesign/device'

registerAdapter('vue3', new Vue3AdapterFactory())
```

#### `detectAdapter(): AdapterFactory | undefined`

自动检测当前环境的框架适配器。

```typescript
import { detectAdapter } from '@ldesign/device'

const adapter = detectAdapter()
if (adapter) {
  const instance = adapter.create()
}
```

### Vue 3 Composition API

#### `useDevice(options?)`

主要的设备检测 Hook。

```typescript
import { useDevice } from '@ldesign/device'

const {
  deviceInfo,      // 设备信息
  isLoading,       // 加载状态
  error,           // 错误信息
  isMobile,        // 是否移动设备
  isTablet,        // 是否平板设备
  isDesktop,       // 是否桌面设备
  isPortrait,      // 是否竖屏
  isLandscape,     // 是否横屏
  isTouchDevice,   // 是否触摸设备
  refresh          // 刷新设备信息
} = useDevice()
```

#### `useDeviceType(config?)`

设备类型检测 Hook。

```typescript
import { useDeviceType } from '@ldesign/device'

const {
  deviceType,  // 'mobile' | 'tablet' | 'desktop'
  isMobile,
  isTablet,
  isDesktop
} = useDeviceType()
```

#### `useOrientation(config?)`

屏幕方向检测 Hook。

```typescript
import { useOrientation } from '@ldesign/device'

const {
  orientation,  // 'portrait' | 'landscape'
  isPortrait,
  isLandscape
} = useOrientation()
```

#### `useBreakpoints()`

响应式断点检测 Hook。

```typescript
import { useBreakpoints } from '@ldesign/device'

const {
  isMobile,
  isTablet,
  isDesktop,
  isPortrait,
  isLandscape,
  isRetina,
  isDarkMode,
  activeBreakpoint  // 当前激活的断点
} = useBreakpoints()
```

#### `useMediaQuery(query)`

媒体查询 Hook。

```typescript
import { useMediaQuery } from '@ldesign/device'

const isMobile = useMediaQuery('(max-width: 767px)')
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
const isRetina = useMediaQuery('(-webkit-min-device-pixel-ratio: 2)')
```

### Vue 组件

#### `DeviceInfo`

设备信息展示组件。

```vue
<template>
  <!-- 基础使用 -->
  <DeviceInfo />

  <!-- 详细模式 -->
  <DeviceInfo :detailed="true" />

  <!-- 自定义配置 -->
  <DeviceInfo
    :config="{ tabletMinWidth: 600 }"
    :detailed="true"
    :show-loading="false"
    class="my-device-info"
  />
</template>

<script setup>
import { DeviceInfo } from '@ldesign/device'
</script>
```

## ⚙️ 配置选项

```typescript
interface DeviceDetectionConfig {
  /** 平板设备的最小宽度阈值 (px) */
  tabletMinWidth?: number        // 默认: 768

  /** 桌面设备的最小宽度阈值 (px) */
  desktopMinWidth?: number       // 默认: 1024

  /** 是否启用用户代理检测 */
  enableUserAgentDetection?: boolean  // 默认: true

  /** 是否启用触摸检测 */
  enableTouchDetection?: boolean      // 默认: true
}
```

## 🎯 使用场景

### 响应式布局

```typescript
import { useDevice } from '@ldesign/device'

const { isMobile, isTablet, isDesktop } = useDevice()

// 根据设备类型调整布局
const columns = computed(() => {
  if (isMobile.value) return 1
  if (isTablet.value) return 2
  return 3
})
```

### 条件加载资源

```typescript
import { useDevice } from '@ldesign/device'

const { isMobile, deviceInfo } = useDevice()

// 根据设备类型加载不同尺寸的图片
const imageUrl = computed(() => {
  const baseUrl = '/images/hero'
  if (isMobile.value) return `${baseUrl}-mobile.jpg`
  if (deviceInfo.value.pixelRatio > 1) return `${baseUrl}-2x.jpg`
  return `${baseUrl}.jpg`
})
```

### 性能优化

```typescript
import { useDevice } from '@ldesign/device'

const { isMobile, isTouchDevice } = useDevice()

// 移动设备禁用复杂动画
const enableAnimations = computed(() => !isMobile.value)

// 触摸设备启用触摸优化
const touchOptimized = computed(() => isTouchDevice.value)
```

### 自适应组件

```vue
<template>
  <div :class="containerClass">
    <component :is="currentComponent" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDevice } from '@ldesign/device'
import MobileNav from './MobileNav.vue'
import DesktopNav from './DesktopNav.vue'

const { isMobile, isTablet } = useDevice()

const currentComponent = computed(() => {
  return isMobile.value ? MobileNav : DesktopNav
})

const containerClass = computed(() => ({
  'container-mobile': isMobile.value,
  'container-tablet': isTablet.value,
  'container-desktop': !isMobile.value && !isTablet.value
}))
</script>
```

## 🔧 高级用法

### 自定义设备检测器

```typescript
import { createDeviceDetector } from '@ldesign/device'

class CustomDeviceDetector {
  private detector = createDeviceDetector({
    tabletMinWidth: 600,
    desktopMinWidth: 1200,
    enableUserAgentDetection: true
  })

  constructor() {
    this.detector.onDeviceChange(this.handleDeviceChange)
  }

  private handleDeviceChange = (event) => {
    // 自定义处理逻辑
    this.updateLayout(event.current.type)
    this.optimizePerformance(event.current)
  }

  private updateLayout(deviceType) {
    document.body.className = `device-${deviceType}`
  }

  private optimizePerformance(deviceInfo) {
    if (deviceInfo.type === 'mobile') {
      // 移动端性能优化
      this.disableHeavyAnimations()
    }
  }

  destroy() {
    this.detector.destroy()
  }
}
```

### 媒体查询管理器

```typescript
import { createMediaQueryListener, MEDIA_QUERIES } from '@ldesign/device'

class MediaQueryManager {
  private listeners = new Map()

  constructor() {
    this.setupQueries()
  }

  private setupQueries() {
    Object.entries(MEDIA_QUERIES).forEach(([name, query]) => {
      const listener = createMediaQueryListener(query)
      listener.subscribe((matches) => {
        this.handleQueryChange(name, matches)
      })
      this.listeners.set(name, listener)
    })
  }

  private handleQueryChange(queryName, matches) {
    console.log(`${queryName}: ${matches}`)

    // 根据查询结果执行相应操作
    switch (queryName) {
      case 'mobile':
        this.toggleMobileMode(matches)
        break
      case 'darkMode':
        this.toggleDarkMode(matches)
        break
    }
  }

  destroy() {
    this.listeners.forEach(listener => listener.destroy())
    this.listeners.clear()
  }
}
```

## 🎨 样式集成

### CSS 变量

```css
:root {
  --device-type: 'desktop';
  --screen-width: 1920px;
  --screen-height: 1080px;
}

.device-mobile {
  --device-type: 'mobile';
}

.device-tablet {
  --device-type: 'tablet';
}

/* 根据设备类型调整样式 */
.responsive-component {
  padding: var(--device-type) == 'mobile' ? 8px : 16px;
}
```

### Tailwind CSS 集成

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'mobile': {'max': '767px'},
      'tablet': {'min': '768px', 'max': '1023px'},
      'desktop': {'min': '1024px'},
    }
  }
}
```

```vue
<template>
  <div :class="responsiveClasses">
    响应式内容
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDevice } from '@ldesign/device'

const { isMobile, isTablet } = useDevice()

const responsiveClasses = computed(() => [
  'p-4',
  {
    'text-sm': isMobile.value,
    'text-base': isTablet.value,
    'text-lg': !isMobile.value && !isTablet.value
  }
])
</script>
```

## 🧪 测试

```bash
# 运行测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 运行测试 UI
pnpm test:ui
```

### 测试示例

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { useDevice } from '@ldesign/device'

describe('useDevice', () => {
  it('should detect device type correctly', () => {
    // Mock window size
    Object.defineProperty(window, 'innerWidth', { value: 375 })
    Object.defineProperty(window, 'innerHeight', { value: 667 })

    const { deviceInfo } = useDevice()
    expect(deviceInfo.value.type).toBe('mobile')
  })
})
```

## 🤝 贡献

欢迎贡献代码！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

## 📄 许可证

[MIT](LICENSE) © LDesign Team

## 🔗 相关链接

- [GitHub 仓库](https://github.com/poly1603/ldesign-device)
- [问题反馈](https://github.com/poly1603/ldesign-device/issues)
- [更新日志](CHANGELOG.md)
- [LDesign 官网](https://ldesign.dev)

---

<div align="center">
  <p>如果这个项目对你有帮助，请给个 ⭐️ 支持一下！</p>
  <p>Made with ❤️ by LDesign Team</p>
</div>
```
