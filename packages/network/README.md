# @ldesign/device-network

> 网络连接状态检测模块

## ✨ 特性

- 🌐 **在线检测** - 检测设备是否在线
- 📶 **连接类型** - 获取网络连接类型（WiFi、4G等）
- 📊 **网络质量** - 下载速度、RTT延迟检测
- 🎯 **事件监听** - 监听网络状态变化
- 💾 **省流量模式** - 检测是否启用省流量
- 🔒 **类型安全** - 完整的 TypeScript 类型定义

## 📦 安装

```bash
pnpm add @ldesign/device-network
```

## 🚀 快速开始

```typescript
import { NetworkModule } from '@ldesign/device-network'

const network = new NetworkModule()
await network.init()

// 检查在线状态
console.log('在线:', network.isOnline())

// 获取连接信息
console.log('连接类型:', network.getConnectionType())
console.log('下载速度:', network.getDownlink() + ' Mbps')
console.log('延迟:', network.getRTT() + ' ms')

// 监听网络变化
network.on('networkChange', (info) => {
  console.log('网络变化:', info)
})
```

## 📚 API 文档

### NetworkModule

#### 方法

- `init()` - 初始化模块
- `destroy()` - 销毁模块
- `getData()` - 获取完整网络信息
- `isOnline()` - 是否在线
- `getConnectionType()` - 获取连接类型
- `getDownlink()` - 获取下载速度（Mbps）
- `getRTT()` - 获取往返时间（ms）
- `isSaveData()` - 是否省流量模式
- `on(event, handler)` - 添加事件监听
- `off(event, handler)` - 移除事件监听

#### 事件

- `networkChange` - 网络状态变化

### 类型定义

```typescript
interface NetworkInfo {
  online: boolean
  type?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}
```

## 🌐 浏览器支持

- ✅ Chrome 61+
- ✅ Edge 79+
- ✅ Firefox 31+
- ⚠️ Safari (部分支持)

## 📄 许可证

MIT License © 2024 ldesign

