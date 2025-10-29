# @ldesign/device-core

> 设备检测核心库 - 提供基础类型定义和高性能事件系统

## ✨ 特性

- 🎯 **TypeScript 类型定义** - 完整的设备检测相关类型
- 🚀 **高性能 EventEmitter** - 优化的事件系统
- 📦 **零依赖** - 纯 TypeScript 实现
- 🔒 **类型安全** - 完整的类型推导
- ⚡ **Tree-shakable** - 支持按需引入

## 📦 安装

```bash
pnpm add @ldesign/device-core
```

## 🚀 快速开始

```typescript
import { EventEmitter, type DeviceInfo } from '@ldesign/device-core'

// 创建事件发射器
const emitter = new EventEmitter<{ deviceChange: DeviceInfo }>()

// 添加监听器
emitter.on('deviceChange', (info) => {
  console.log('设备信息:', info)
})

// 触发事件
emitter.emit('deviceChange', {
  type: 'mobile',
  orientation: 'portrait',
  width: 375,
  height: 667,
  // ... 其他信息
})
```

## 📚 导出内容

### 类型定义

- `DeviceType` - 设备类型（desktop | tablet | mobile）
- `Orientation` - 屏幕方向（portrait | landscape）
- `DeviceInfo` - 设备信息接口
- `BatteryInfo` - 电池信息接口
- `NetworkInfo` - 网络信息接口
- `GeolocationInfo` - 地理位置信息接口
- `DeviceModule` - 设备模块接口

### 类

- `EventEmitter` - 高性能事件发射器

## 🔧 API 文档

### EventEmitter

详见 EventEmitter 文档

## 📄 许可证

MIT License © 2024 ldesign


