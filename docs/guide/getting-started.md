# 快速开始

本指南将帮助你在几分钟内开始使用 @ldesign/device。

## 📦 安装

### 使用包管理器

::: code-group

```bash [pnpm]
pnpm add @ldesign/device
```

```bash [npm]
npm install @ldesign/device
```

```bash [yarn]
yarn add @ldesign/device
```

:::

### CDN 引入

```html
<!-- 最新版本 -->
<script src="https://unpkg.com/@ldesign/device"></script>

<!-- 指定版本 -->
<script src="https://unpkg.com/@ldesign/device@1.0.0"></script>
```

## 🚀 基础使用

### 获取设备信息

```typescript
import { getDeviceInfo } from '@ldesign/device'

// 获取当前设备信息
const deviceInfo = getDeviceInfo()

console.log(deviceInfo)
// {
//   type: 'desktop',           // 设备类型
//   orientation: 'landscape',  // 屏幕方向
//   width: 1920,              // 屏幕宽度
//   height: 1080,             // 屏幕高度
//   pixelRatio: 2,            // 设备像素比
//   isTouchDevice: false,     // 是否触摸设备
//   userAgent: '...'          // 用户代理字符串
// }
```

### 监听设备变化

```typescript
import { onDeviceChange } from '@ldesign/device'

// 监听设备信息变化
const unsubscribe = onDeviceChange((event) => {
  console.log('设备信息变化:', event.current)
  console.log('变化的属性:', event.changes)
  console.log('之前的信息:', event.previous)
})

// 取消监听
unsubscribe()
```

## 🎨 Vue3 集成

### Composition API

```vue
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

<template>
  <div>
    <h2>设备信息</h2>
    <p>设备类型: {{ deviceInfo.type }}</p>
    <p>屏幕方向: {{ deviceInfo.orientation }}</p>
    <p>屏幕尺寸: {{ deviceInfo.width }} x {{ deviceInfo.height }}</p>

    <!-- 条件渲染 -->
    <div v-if="isMobile">
      📱 移动端专用内容
    </div>
    <div v-else-if="isTablet">
      📱 平板专用内容
    </div>
    <div v-else>
      💻 桌面端专用内容
    </div>
  </div>
</template>
```

### 使用插件

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { DevicePlugin } from '@ldesign/device'

const app = createApp(App)

// 安装设备检测插件
app.use(DevicePlugin, {
  // 可选配置
  tabletMinWidth: 768,
  desktopMinWidth: 1024
})

app.mount('#app')
```

安装插件后，可以在模板中使用全局属性：

```vue
<template>
  <div>
    <p v-if="$isMobile">
      移动设备
    </p>
    <p v-if="$isTablet">
      平板设备
    </p>
    <p v-if="$isDesktop">
      桌面设备
    </p>
  </div>
</template>
```

### 使用指令

```vue
<template>
  <div>
    <!-- 仅在移动设备显示 -->
    <div v-mobile>
      📱 移动端导航
    </div>

    <!-- 仅在非移动设备显示 -->
    <div v-mobile.not>
      💻 桌面端导航
    </div>

    <!-- 根据设备类型显示 -->
    <div v-device="'mobile'">
      移动端
    </div>
    <div v-device="['tablet', 'desktop']">
      平板或桌面
    </div>

    <!-- 根据方向显示 -->
    <div v-portrait>
      竖屏内容
    </div>
    <div v-landscape>
      横屏内容
    </div>

    <!-- 触摸设备专用 -->
    <div v-touch>
      触摸设备内容
    </div>
  </div>
</template>
```

### 使用 Provider

```vue
<script setup>
import { DeviceProvider } from '@ldesign/device'
</script>

<template>
  <DeviceProvider :config="{ tabletMinWidth: 600 }">
    <router-view />
  </DeviceProvider>
</template>
```

在子组件中使用上下文：

```vue
<script setup>
import { useDeviceContext } from '@ldesign/device'

const { deviceInfo, isMobile } = useDeviceContext()
</script>
```

## ⚙️ 配置选项

```typescript
import { getDeviceInfo } from '@ldesign/device'

const deviceInfo = getDeviceInfo({
  // 平板设备的最小宽度阈值 (px)
  tabletMinWidth: 768,

  // 桌面设备的最小宽度阈值 (px)
  desktopMinWidth: 1024,

  // 是否启用用户代理检测
  enableUserAgentDetection: true,

  // 是否启用触摸检测
  enableTouchDetection: true
})
```

## 🎯 实际应用

### 响应式布局

```vue
<script setup>
import { computed } from 'vue'
import MobileLayout from './MobileLayout.vue'
import DesktopLayout from './DesktopLayout.vue'
import { useDevice } from '@ldesign/device'

const { isMobile, isTablet } = useDevice()

const currentComponent = computed(() => {
  return isMobile.value ? MobileLayout : DesktopLayout
})

const containerClass = computed(() => ({
  'container-mobile': isMobile.value,
  'container-tablet': isTablet.value,
  'container-desktop': !isMobile.value && !isTablet.value
}))
</script>

<template>
  <div :class="containerClass">
    <component :is="currentComponent" />
  </div>
</template>
```

### 图片优化

```vue
<script setup>
import { computed } from 'vue'
import { useDevice } from '@ldesign/device'

const props = defineProps<{
  src: string
  alt: string
}>()

const { isMobile, deviceInfo } = useDevice()

const optimizedImageUrl = computed(() => {
  const { src } = props
  const isHighDPI = deviceInfo.value.pixelRatio > 1

  if (isMobile.value) {
    return isHighDPI ? `${src}@2x-mobile.jpg` : `${src}-mobile.jpg`
  }

  return isHighDPI ? `${src}@2x.jpg` : `${src}.jpg`
})
</script>

<template>
  <img :src="optimizedImageUrl" :alt="alt">
</template>
```

## 🔍 调试技巧

### 开发环境调试

```typescript
import { getDeviceInfo, onDeviceChange } from '@ldesign/device'

// 打印当前设备信息
console.table(getDeviceInfo())

// 监听并打印设备变化
onDeviceChange((event) => {
  console.group('设备信息变化')
  console.log('变化属性:', event.changes)
  console.table(event.current)
  console.groupEnd()
})
```

### 模拟不同设备

在浏览器开发者工具中：
1. 打开设备模拟器 (F12 → 设备图标)
2. 选择不同设备预设
3. 观察应用的响应变化

## 📚 下一步

- 了解 [设备类型检测](/guide/device-detection) 的详细原理
- 学习 [Vue 组件](/guide/vue-components) 的高级用法
- 查看 [API 文档](/api/) 了解所有可用功能
- 浏览 [示例代码](/examples/) 获取更多灵感

---

遇到问题？查看 [常见问题](/guide/faq) 或在 [GitHub](https://github.com/poly1603/ldesign-device/issues) 提交 issue。
