# @ldesign/device-solid

> Solid.js 适配器 - 设备检测库

## ✨ 特性

- ⚡ **Solid Signals** - 使用 Solid 的响应式系统
- 🎯 **TypeScript** - 完整的类型支持
- 📦 **按需引入** - Tree-shakable
- 🔒 **类型安全** - 完整的类型推导
- ⚡ **高性能** - Solid.js 的极致性能

## 📦 安装

```bash
pnpm add @ldesign/device-solid
```

## 🚀 快速开始

```tsx
import { useDevice, useBattery, useNetwork } from '@ldesign/device-solid'

function App() {
  // 设备检测
  const { deviceType, isMobile, isTablet, isDesktop } = useDevice()

  // 电池检测
  const { levelPercentage, isCharging, isSupported } = useBattery()

  // 网络检测
  const { isOnline, connectionType } = useNetwork()

  return (
    <div>
      <h1>设备信息</h1>
      <p>设备类型: {deviceType()}</p>
      <p>是否移动设备: {isMobile() ? '是' : '否'}</p>
      
      {isSupported() && (
        <>
          <h2>电池信息</h2>
          <p>电量: {levelPercentage()}%</p>
          <p>充电中: {isCharging() ? '是' : '否'}</p>
        </>
      )}
      
      <h2>网络信息</h2>
      <p>在线: {isOnline() ? '是' : '否'}</p>
      <p>连接类型: {connectionType()}</p>
    </div>
  )
}
```

## 📚 API 文档

### useDevice()

```typescript
const {
  deviceInfo,      // Accessor<DeviceInfo>
  deviceType,      // Accessor<DeviceType>
  orientation,     // Accessor<Orientation>
  isMobile,        // Accessor<boolean>
  isTablet,        // Accessor<boolean>
  isDesktop,       // Accessor<boolean>
  isTouchDevice,   // Accessor<boolean>
} = useDevice()
```

### useBattery()

```typescript
const {
  level,              // Accessor<number>
  levelPercentage,    // Accessor<number>
  isCharging,         // Accessor<boolean>
  chargingTime,       // Accessor<number>
  dischargingTime,    // Accessor<number>
  isSupported,        // Accessor<boolean>
  batteryInfo,        // Accessor<BatteryInfo | null>
} = useBattery()
```

### useNetwork()

```typescript
const {
  isOnline,          // Accessor<boolean>
  connectionType,    // Accessor<string>
  downlink,          // Accessor<number | undefined>
  rtt,               // Accessor<number | undefined>
  saveData,          // Accessor<boolean | undefined>
  networkInfo,       // Accessor<NetworkInfo | null>
} = useNetwork()
```

## 🎯 使用场景

### 响应式布局

```tsx
function App() {
  const { isMobile } = useDevice()
  
  return (
    <>
      {isMobile() ? <MobileLayout /> : <DesktopLayout />}
    </>
  )
}
```

### 条件渲染

```tsx
function App() {
  const { levelPercentage, isCharging } = useBattery()
  const { isOnline } = useNetwork()
  
  return (
    <div>
      {levelPercentage() < 20 && !isCharging() && (
        <div class="warning">⚠️ 电量不足</div>
      )}
      
      {!isOnline() && (
        <div class="offline">📡 网络已断开</div>
      )}
    </div>
  )
}
```

## 📄 许可证

MIT License © 2024 ldesign

