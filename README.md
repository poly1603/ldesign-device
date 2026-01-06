# @ldesign/device

<div align="center">

**🎯 现代化设备检测库 - 轻量、高效、类型安全**

[![npm version](https://img.shields.io/npm/v/@ldesign/device.svg?style=flat-square&color=4f46e5)](https://www.npmjs.com/package/@ldesign/device)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@ldesign/device.svg?style=flat-square&color=10b981)](./LICENSE)

</div>

---

## ✨ 特性

- 🪶 **轻量** - 核心库 ~8KB (gzipped)，零依赖
- 🎯 **精准** - 多级检测优先级，智能设备识别
- 📱 **响应式** - 实时监听设备变化
- 🔌 **模块化** - 按需加载电池、网络、地理位置等扩展
- 🎨 **Vue 3 集成** - Composition API + 指令 + 组件
- 🌙 **深色模式** - 内置组件支持自动/手动深色主题
- 📘 **TypeScript** - 完整类型定义

## 📦 安装

```bash
pnpm add @ldesign/device
# 或
npm install @ldesign/device
```

## 🚀 快速开始

### 基础使用

```typescript
import { DeviceDetector } from '@ldesign/device'

const detector = new DeviceDetector()
const device = detector.getDeviceInfo()

console.log(device.type)        // 'mobile' | 'tablet' | 'desktop'
console.log(device.orientation) // 'portrait' | 'landscape'
console.log(device.isTouchDevice)

// 监听变化
detector.on('deviceChange', (info) => {
  console.log('设备类型变化:', info.type)
})

detector.on('orientationChange', (orientation) => {
  console.log('屏幕方向:', orientation)
})
```

### Vue 3 集成

```vue
<script setup>
import { useDevice, useNetwork, useBattery } from '@ldesign/device/vue'

// 设备检测
const { deviceType, isMobile, isDesktop, orientation } = useDevice()

// 网络状态
const { isOnline, connectionType, networkInfo } = useNetwork()

// 电池信息
const { level, isCharging } = useBattery()
</script>

<template>
  <div>
    <p>设备: {{ deviceType }}</p>
    <p>网络: {{ isOnline ? '在线' : '离线' }}</p>
    <p v-if="level">电量: {{ Math.round(level * 100) }}%</p>
  </div>
</template>
```

### Vue 指令

```vue
<template>
  <!-- 仅在移动设备显示 -->
  <nav v-device="'mobile'">移动端导航</nav>
  
  <!-- 仅在桌面设备显示 -->
  <aside v-device="'desktop'">桌面端侧边栏</aside>
  
  <!-- 多设备匹配 -->
  <div v-device="['tablet', 'desktop']">平板或桌面</div>
</template>
```

### 内置组件

```vue
<script setup>
import { DeviceInfo, NetworkStatus } from '@ldesign/device/vue'
</script>

<template>
  <!-- 设备信息卡片 -->
  <DeviceInfo mode="detailed" />
  
  <!-- 网络状态指示器 -->
  <NetworkStatus display-mode="progress" />
</template>
```

## 📖 API 参考

### DeviceDetector

```typescript
const detector = new DeviceDetector({
  enableResize: true,        // 监听窗口大小变化
  enableOrientation: true,   // 监听屏幕方向变化
  debounceDelay: 100,        // 防抖延迟 (ms)
  breakpoints: {
    mobile: 768,
    tablet: 1024,
  },
})

// 方法
detector.getDeviceInfo()     // 获取设备信息
detector.isMobile()          // 是否移动设备
detector.isTablet()          // 是否平板
detector.isDesktop()         // 是否桌面
detector.isTouchDevice()     // 是否触摸设备
detector.refresh()           // 刷新检测

// 模块
await detector.loadModule('network')     // 加载网络模块
await detector.loadModule('battery')     // 加载电池模块
await detector.loadModule('geolocation') // 加载地理位置模块

// 事件
detector.on('deviceChange', handler)
detector.on('orientationChange', handler)
detector.on('resize', handler)
detector.on('networkChange', handler)
detector.on('batteryChange', handler)

// 销毁
await detector.destroy()
```

### DeviceInfo 类型

```typescript
interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile'
  orientation: 'portrait' | 'landscape'
  width: number               // 视口宽度
  height: number              // 视口高度
  screenWidth: number         // 屏幕宽度
  screenHeight: number        // 屏幕高度
  pixelRatio: number          // 设备像素比
  isTouchDevice: boolean
  userAgent: string
  os: { name: string; version: string }
  browser: { name: string; version: string }
  detection: {
    method: 'screen' | 'viewport' | 'userAgent'
    priority: number
    isDynamic: boolean
  }
}
```

### Vue Composables

| Composable | 说明 |
|------------|------|
| `useDevice()` | 设备类型、方向、触摸支持 |
| `useNetwork()` | 网络状态、连接类型、速度 |
| `useBattery()` | 电量、充电状态 |
| `useGeolocation()` | 地理位置 |
| `useOrientation()` | 屏幕方向 |
| `useBreakpoints()` | 响应式断点 |
| `useClipboard()` | 剪贴板操作 |
| `useVibration()` | 设备振动 |
| `useWakeLock()` | 屏幕唤醒锁 |

## 🎨 组件主题

组件支持 CSS 变量自定义主题：

```css
.device-info {
  --di-bg-primary: #ffffff;
  --di-bg-secondary: #f8f9fa;
  --di-text-primary: #212529;
  --di-accent-color: #4f46e5;
  --di-radius: 12px;
}

/* 深色模式 */
.device-info.dark {
  --di-bg-primary: #1e1e2e;
  --di-text-primary: #e4e4e7;
}
```

## 🌐 浏览器支持

| 浏览器 | 版本 |
|--------|------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |
| iOS Safari | 12+ |

## 🛠️ 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 类型检查
pnpm type-check
```

## 📄 许可证

[MIT](./LICENSE)
