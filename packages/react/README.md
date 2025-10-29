# @ldesign/device-react

> React 18+ 适配器 - 设备检测库

## ✨ 特性

- ⚛️ **React Hooks** - 提供 useDevice, useBattery, useNetwork 等
- 🔄 **响应式** - 自动监听设备变化
- 🎨 **组件** - 开箱即用的展示组件
- 🔒 **TypeScript** - 完整的类型支持
- 📦 **按需引入** - Tree-shakable
- ⚡ **轻量级** - 零额外依赖

## 📦 安装

```bash
pnpm add @ldesign/device-react
```

## 🚀 快速开始

### Hooks

```tsx
import { useDevice, useBattery, useNetwork } from '@ldesign/device-react'

function App() {
  // 设备检测
  const { deviceType, isMobile, isTablet, isDesktop } = useDevice()

  // 电池检测
  const { level, levelPercentage, isCharging, isSupported } = useBattery()

  // 网络检测
  const { isOnline, connectionType } = useNetwork()

  return (
    <div>
      <h1>设备信息</h1>
      <p>设备类型: {deviceType}</p>
      <p>是否移动设备: {isMobile ? '是' : '否'}</p>
      
      {isSupported && (
        <>
          <h2>电池信息</h2>
          <p>电量: {levelPercentage}%</p>
          <p>充电中: {isCharging ? '是' : '否'}</p>
        </>
      )}
      
      <h2>网络信息</h2>
      <p>在线: {isOnline ? '是' : '否'}</p>
      <p>连接类型: {connectionType}</p>
    </div>
  )
}
```

### 组件

```tsx
import {
  DeviceInfo,
  BatteryIndicator,
  NetworkStatus,
} from '@ldesign/device-react'

function App() {
  return (
    <div>
      <DeviceInfo />
      <BatteryIndicator />
      <NetworkStatus />
    </div>
  )
}
```

## 📚 API 文档

### Hooks

#### useDevice()

```typescript
const {
  deviceInfo,      // 完整设备信息
  deviceType,      // 设备类型
  orientation,     // 屏幕方向
  isMobile,        // 是否移动设备
  isTablet,        // 是否平板
  isDesktop,       // 是否桌面
  isTouchDevice,   // 是否触摸设备
} = useDevice()
```

#### useBattery()

```typescript
const {
  level,              // 电量 (0-1)
  levelPercentage,    // 电量百分比 (0-100)
  isCharging,         // 是否充电中
  chargingTime,       // 充电时间
  dischargingTime,    // 放电时间
  isSupported,        // 是否支持
  batteryInfo,        // 完整信息
} = useBattery()
```

#### useNetwork()

```typescript
const {
  isOnline,          // 是否在线
  connectionType,    // 连接类型
  downlink,          // 下载速度
  rtt,               // 延迟
  saveData,          // 省流量模式
  networkInfo,       // 完整信息
} = useNetwork()
```

### 组件

- `<DeviceInfo />` - 设备信息展示
- `<BatteryIndicator />` - 电池指示器
- `<NetworkStatus />` - 网络状态

## 🎯 使用场景

### 响应式布局

```tsx
function App() {
  const { isMobile } = useDevice()
  
  return isMobile ? <MobileLayout /> : <DesktopLayout />
}
```

### 电量提示

```tsx
function App() {
  const { levelPercentage, isCharging } = useBattery()
  
  return (
    <>
      {levelPercentage < 20 && !isCharging && (
        <div className="warning">⚠️ 电量不足，请充电</div>
      )}
    </>
  )
}
```

### 网络状态

```tsx
function App() {
  const { isOnline } = useNetwork()
  
  return (
    <>
      {!isOnline && (
        <div className="offline">📡 网络已断开</div>
      )}
    </>
  )
}
```

## 🌐 浏览器支持

- ✅ Chrome 61+
- ✅ Edge 79+
- ✅ Firefox 60+
- ✅ Safari 14+

## 📄 许可证

MIT License © 2024 ldesign

