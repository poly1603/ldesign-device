# 介绍

@ldesign/device 是一个功能强大的设备信息检测库，专为现代 Web 应用设计。它能够智能识别设备类型、实时监听屏幕方向变化，并提供完整的 Vue3 集成方案。

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

## 🎨 Vue3 深度集成

### Composition API
```typescript
import { useDevice } from '@ldesign/device'

const { deviceInfo, isMobile, isTablet, isDesktop } = useDevice()
```

### 组件支持
```vue
<template>
  <DeviceProvider>
    <YourApp />
  </DeviceProvider>
</template>
```

### 指令系统
```vue
<template>
  <div v-mobile>移动端内容</div>
  <div v-desktop>桌面端内容</div>
  <div v-portrait>竖屏内容</div>
</template>
```

### 插件安装
```typescript
import { createApp } from 'vue'
import { DevicePlugin } from '@ldesign/device'

const app = createApp({})
app.use(DevicePlugin)
```

## 🔧 框架扩展性

设计了抽象的适配器接口，为未来支持更多框架预留扩展点：

- **Vue2 适配器**（规划中）
- **React 适配器**（规划中）
- **Angular 适配器**（规划中）

## 🌟 使用场景

### 响应式布局
根据设备类型动态调整界面布局：

```typescript
const columns = computed(() => {
  if (isMobile.value) return 1
  if (isTablet.value) return 2
  return 3
})
```

### 资源优化
按设备类型加载不同尺寸的资源：

```typescript
const imageUrl = computed(() => {
  const baseUrl = '/images/hero'
  if (isMobile.value) return `${baseUrl}-mobile.jpg`
  if (deviceInfo.value.pixelRatio > 1) return `${baseUrl}-2x.jpg`
  return `${baseUrl}.jpg`
})
```

### 性能优化
针对不同设备进行性能调优：

```typescript
const enableAnimations = computed(() => !isMobile.value)
const touchOptimized = computed(() => isTouchDevice.value)
```

### 用户体验
提供设备特定的交互体验：

```vue
<template>
  <button 
    :class="{ 'touch-optimized': isTouchDevice }"
    @click="handleClick"
  >
    {{ isTouchDevice ? '轻触' : '点击' }}
  </button>
</template>
```

## 🧪 质量保证

- **37+ 单元测试**：覆盖所有核心功能
- **边界情况测试**：模拟各种设备环境
- **持续集成**：自动化测试和构建
- **类型检查**：TypeScript 严格模式

## 📦 轻量级设计

- **核心包体积**：< 10KB (gzipped)
- **零依赖**：不依赖任何第三方库
- **Tree-shaking**：支持按需引入
- **多格式支持**：ESM、CommonJS、UMD

## 🔮 未来规划

- [ ] Vue2 适配器
- [ ] React 适配器  
- [ ] 更多设备特性检测
- [ ] 离线状态检测
- [ ] 设备性能评估
- [ ] PWA 集成支持

## 📄 许可证

[MIT](https://opensource.org/licenses/MIT) © LDesign Team

---

准备好开始了吗？查看 [快速开始](/guide/getting-started) 了解如何在你的项目中使用 @ldesign/device！
