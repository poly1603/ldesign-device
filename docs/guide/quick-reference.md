# 快速参考

本页面提供常用 API 和代码片段的快速参考。

## 📦 安装

```bash
# pnpm
pnpm add @ldesign/device

# npm
npm install @ldesign/device

# yarn
yarn add @ldesign/device
```

## 🎯 基础使用

### 创建检测器

```typescript
import { DeviceDetector } from '@ldesign/device'

const detector = new DeviceDetector()
```

### 获取设备信息

```typescript
const info = detector.getDeviceInfo()
console.log(info.type)        // 'mobile' | 'tablet' | 'desktop'
console.log(info.orientation) // 'portrait' | 'landscape'
console.log(info.width)        // 屏幕宽度
console.log(info.height)       // 屏幕高度
```

### 快捷判断方法

```typescript
if (detector.isMobile()) {
  // 移动设备逻辑
}

if (detector.isTablet()) {
  // 平板设备逻辑
}

if (detector.isDesktop()) {
  // 桌面设备逻辑
}

if (detector.isTouchDevice()) {
  // 触摸设备逻辑
}
```

## 🔄 事件监听

### 监听设备变化

```typescript
detector.on('deviceChange', (info) => {
  console.log('设备类型:', info.type)
})
```

### 监听方向变化

```typescript
detector.on('orientationChange', (orientation) => {
  console.log('屏幕方向:', orientation)
})
```

### 监听窗口大小

```typescript
detector.on('resize', ({ width, height }) => {
  console.log('窗口大小:', width, height)
})
```

### 移除监听

```typescript
const handler = (info) => console.log(info)
detector.on('deviceChange', handler)
detector.off('deviceChange', handler)
```

## ⚙️ 配置选项

```typescript
const detector = new DeviceDetector({
  // 自定义断点
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  
  // 启用窗口大小监听
  enableResize: true,
  
  // 启用方向变化监听
  enableOrientation: true,
  
  // 事件防抖延迟（毫秒）
  debounceDelay: 300
})
```

## 🎨 Vue 3 集成

### Composition API

```vue
<script setup>
import { useDevice } from '@ldesign/device/vue'

const {
  deviceType,
  isMobile,
  isTablet,
  isDesktop,
  orientation,
  deviceInfo,
  refresh
} = useDevice()
</script>

<template>
  <div v-if="isMobile">移动端</div>
  <div v-else-if="isTablet">平板</div>
  <div v-else>桌面</div>
</template>
```

### 指令

```vue
<template>
  <!-- 只在移动设备显示 -->
  <div v-device="'mobile'">
    移动端内容
  </div>
  
  <!-- 只在平板或桌面显示 -->
  <div v-device="['tablet', 'desktop']">
    非移动端内容
  </div>
  
  <!-- 反向匹配 -->
  <div v-device="{ type: 'mobile', inverse: true }">
    非移动设备内容
  </div>
</template>
```

### 全局插件

```typescript
import { createApp } from 'vue'
import { DevicePlugin } from '@ldesign/device/vue'

const app = createApp(App)

app.use(DevicePlugin, {
  breakpoints: {
    mobile: 768,
    tablet: 1024
  }
})
```

## ⚛️ React 集成

### 自定义 Hook

```typescript
import { useState, useEffect } from 'react'
import { DeviceDetector } from '@ldesign/device'
import type { DeviceInfo } from '@ldesign/device'

function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  
  useEffect(() => {
    const detector = new DeviceDetector()
    setDeviceInfo(detector.getDeviceInfo())
    
    const handler = (info: DeviceInfo) => setDeviceInfo(info)
    detector.on('deviceChange', handler)
    
    return () => {
      detector.off('deviceChange', handler)
      detector.destroy()
    }
  }, [])
  
  return deviceInfo
}
```

### 使用示例

```tsx
function App() {
  const device = useDevice()
  
  if (!device) return <div>Loading...</div>
  
  return (
    <div>
      {device.type === 'mobile' && <MobileLayout />}
      {device.type === 'tablet' && <TabletLayout />}
      {device.type === 'desktop' && <DesktopLayout />}
    </div>
  )
}
```

## 🔋 电池模块

```typescript
import { BatteryModule } from '@ldesign/device/modules/BatteryModule'

const battery = new BatteryModule()

// 检查支持
const supported = await battery.isSupported()

if (supported) {
  // 初始化
  await battery.initialize()
  
  // 获取状态
  const status = battery.getBatteryStatus()
  console.log('电量:', Math.round(status.level * 100) + '%')
  console.log('充电中:', status.charging)
  
  // 监听变化
  battery.on('batteryChange', (status) => {
    console.log('电池状态变化:', status)
  })
}
```

## 📡 网络模块

```typescript
import { NetworkModule } from '@ldesign/device/modules/NetworkModule'

const network = new NetworkModule()

// 检查支持
const supported = await network.isSupported()

if (supported) {
  // 初始化
  await network.initialize()
  
  // 获取状态
  const status = network.getNetworkStatus()
  console.log('在线:', status.online)
  console.log('类型:', status.type)
  console.log('下载速度:', status.downlink, 'Mbps')
  
  // 监听变化
  network.on('networkChange', (status) => {
    console.log('网络状态变化:', status)
  })
}
```

## 📍 地理位置模块

```typescript
import { GeolocationModule } from '@ldesign/device/modules/GeolocationModule'

const geo = new GeolocationModule()

// 检查支持
const supported = await geo.isSupported()

if (supported) {
  // 初始化
  await geo.initialize()
  
  // 获取当前位置
  const position = await geo.getCurrentPosition()
  console.log('纬度:', position.coords.latitude)
  console.log('经度:', position.coords.longitude)
  
  // 监听位置变化
  geo.watchPosition((position) => {
    console.log('位置变化:', position)
  })
}
```

## 🎯 TypeScript 类型

### 导入类型

```typescript
import type {
  DeviceInfo,
  DeviceType,
  Orientation,
  DetectorConfig,
  BatteryStatus,
  NetworkStatus,
  GeolocationPosition
} from '@ldesign/device'
```

### 类型守卫

```typescript
function isMobileDevice(type: DeviceType): type is 'mobile' {
  return type === 'mobile'
}

const deviceType = detector.getDeviceType()
if (isMobileDevice(deviceType)) {
  // TypeScript 知道这里 deviceType 是 'mobile'
}
```

## 🧹 清理资源

```typescript
// 销毁检测器
detector.destroy()

// 销毁模块
battery.destroy()
network.destroy()
geo.destroy()
```

## 💡 常用模式

### 响应式断点

```typescript
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

function getBreakpoint(width: number) {
  if (width >= breakpoints['2xl']) return '2xl'
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  return 'xs'
}
```

### 自适应组件加载

```typescript
async function loadComponent(deviceType: DeviceType) {
  switch (deviceType) {
    case 'mobile':
      return await import('./MobileComponent')
    case 'tablet':
      return await import('./TabletComponent')
    case 'desktop':
      return await import('./DesktopComponent')
  }
}
```

### 设备特定样式

```typescript
const styles = {
  mobile: {
    fontSize: '14px',
    padding: '8px'
  },
  tablet: {
    fontSize: '16px',
    padding: '12px'
  },
  desktop: {
    fontSize: '18px',
    padding: '16px'
  }
}

const currentStyle = styles[detector.getDeviceType()]
```

## 🔗 相关链接

- [完整 API 文档](../api/)
- [使用指南](./getting-started.md)
- [示例集合](./examples-overview.md)
- [最佳实践](./best-practices.md)

