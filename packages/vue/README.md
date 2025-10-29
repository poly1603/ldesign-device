# @ldesign/device-vue

> Vue 3 适配器 - 设备检测库

## ✨ 特性

- 🎯 **组合式 API** - 提供 useDevice, useBattery, useNetwork 等 Composables
- 🔄 **响应式** - 自动监听设备变化
- 🎨 **TypeScript** - 完整的类型支持
- 📦 **按需引入** - Tree-shakable
- ⚡ **轻量级** - 零额外依赖

## 📦 安装

```bash
pnpm add @ldesign/device-vue
```

## 🚀 快速开始

```vue
<script setup lang="ts">
import { useDevice, useBattery, useNetwork } from '@ldesign/device-vue'

// 设备检测
const { deviceType, isMobile, isTablet, isDesktop } = useDevice()

// 电池检测
const { level, levelPercentage, isCharging } = useBattery()

// 网络检测
const { isOnline, connectionType } = useNetwork()
</script>

<template>
  <div>
    <p>设备类型: {{ deviceType }}</p>
    <p>是否移动设备: {{ isMobile }}</p>
    <p>电量: {{ levelPercentage }}%</p>
    <p>充电中: {{ isCharging }}</p>
    <p>在线: {{ isOnline }}</p>
    <p>连接类型: {{ connectionType }}</p>
  </div>
</template>
```

## 📚 API 文档

### useDevice()

设备信息检测

```typescript
const {
  deviceInfo,      // 完整设备信息
  deviceType,      // 设备类型: 'desktop' | 'tablet' | 'mobile'
  orientation,     // 屏幕方向: 'portrait' | 'landscape'
  isMobile,        // 是否移动设备
  isTablet,        // 是否平板
  isDesktop,       // 是否桌面
  isTouchDevice,   // 是否触摸设备
  refresh,         // 刷新检测
} = useDevice()
```

### useBattery()

电池信息检测

```typescript
const {
  level,              // 电量 (0-1)
  levelPercentage,    // 电量百分比 (0-100)
  isCharging,         // 是否充电中
  chargingTime,       // 充电时间
  dischargingTime,    // 放电时间
  isSupported,        // 是否支持
  batteryInfo,        // 完整电池信息
} = useBattery()
```

### useNetwork()

网络状态检测

```typescript
const {
  isOnline,          // 是否在线
  connectionType,    // 连接类型
  downlink,          // 下载速度
  rtt,               // 延迟
  saveData,          // 省流量模式
  networkInfo,       // 完整网络信息
} = useNetwork()
```

## 🎯 使用场景

### 响应式设计

```vue
<script setup>
import { useDevice } from '@ldesign/device-vue'

const { isMobile } = useDevice()
</script>

<template>
  <div>
    <MobileLayout v-if="isMobile" />
    <DesktopLayout v-else />
  </div>
</template>
```

### 电量提示

```vue
<script setup>
import { useBattery } from '@ldesign/device-vue'

const { levelPercentage, isCharging } = useBattery()
</script>

<template>
  <div v-if="levelPercentage < 20 && !isCharging" class="low-battery-warning">
    ⚠️ 电量不足，请及时充电
  </div>
</template>
```

### 网络状态

```vue
<script setup>
import { useNetwork } from '@ldesign/device-vue'

const { isOnline } = useNetwork()
</script>

<template>
  <div v-if="!isOnline" class="offline-notice">
    📡 网络已断开
  </div>
</template>
```

## 📄 许可证

MIT License © 2024 ldesign

