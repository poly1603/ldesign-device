# @ldesign/device-battery

> 设备电池信息检测模块

## ✨ 特性

- 🔋 **电量检测** - 获取当前电池电量百分比
- ⚡ **充电状态** - 检测设备是否正在充电
- ⏱️ **时间估算** - 充电/放电时间预估
- 🎯 **事件监听** - 电量和充电状态变化事件
- 📊 **状态分级** - full, high, medium, low, critical
- 🔒 **类型安全** - 完整的 TypeScript 类型定义
- 📦 **多格式支持** - ES Module, CommonJS, UMD

## 📦 安装

```bash
# 使用 pnpm
pnpm add @ldesign/device-battery

# 使用 npm
npm install @ldesign/device-battery

# 使用 yarn
yarn add @ldesign/device-battery
```

## 🚀 快速开始

```typescript
import { BatteryModule } from '@ldesign/device-battery'

// 创建电池模块实例
const battery = new BatteryModule()
await battery.init()

// 检查是否支持
if (battery.isSupported()) {
  // 获取电池信息
  const info = battery.getData()
  console.log('电量:', battery.getLevelPercentage() + '%')
  console.log('状态:', battery.getBatteryStatus())
  console.log('充电中:', battery.isCharging())

  // 监听电池变化
  battery.on('batteryChange', (info) => {
    console.log('电池信息更新:', info)
  })
}
```

## 📚 API 文档

### BatteryModule

#### 方法

- `init()` - 初始化模块
- `destroy()` - 销毁模块，清理资源
- `getData()` - 获取完整电池信息
- `getLevel()` - 获取电量（0-1）
- `getLevelPercentage()` - 获取电量百分比（0-100）
- `isCharging()` - 是否正在充电
- `getChargingTime()` - 获取充电时间（秒）
- `getDischargingTime()` - 获取放电时间（秒）
- `getBatteryStatus()` - 获取电池状态
- `isLowBattery(threshold?)` - 检查是否低电量
- `isSupported()` - 检查浏览器是否支持
- `on(event, handler)` - 添加事件监听
- `off(event, handler)` - 移除事件监听

#### 事件

- `batteryChange` - 电池信息变化（电量或充电状态）

### 类型定义

```typescript
interface BatteryInfo {
  level: number          // 电量（0-1）
  charging: boolean      // 是否充电
  chargingTime: number   // 充电时间（秒）
  dischargingTime: number // 放电时间（秒）
}

type BatteryStatus = 
  | 'full'      // >= 90%
  | 'high'      // >= 50%
  | 'medium'    // >= 20%
  | 'low'       // >= 10%
  | 'critical'  // < 10%
```

## 🎯 使用场景

- **省电提示** - 电量低时提醒用户
- **功能降级** - 根据电量调整应用性能
- **充电提醒** - 检测充电状态变化
- **电量监控** - 实时显示电量信息

## 🌐 浏览器支持

- ✅ Chrome 38+
- ✅ Edge 79+
- ✅ Firefox 52+
- ❌ Safari (不支持)
- ✅ Opera 25+

## 📄 许可证

MIT License © 2024 ldesign

