# @ldesign/device - 包目录

## 📦 可用的包

### 核心包

#### 1. [@ldesign/device-core](./packages/core)
- **描述**: 核心功能 - 事件系统和类型定义
- **大小**: ~15KB
- **依赖**: 零依赖
- **导出**: EventEmitter, 类型定义
- **演示**: ✅ http://localhost:3100
- **文档**: [README](./packages/core/README.md)

```bash
pnpm add @ldesign/device-core
```

```typescript
import { EventEmitter } from '@ldesign/device-core'
const emitter = new EventEmitter()
```

### 功能模块

#### 2. [@ldesign/device-battery](./packages/battery)
- **描述**: 电池信息检测
- **大小**: ~8KB
- **依赖**: @ldesign/device-core
- **演示**: ✅ http://localhost:3101
- **文档**: [README](./packages/battery/README.md)

```bash
pnpm add @ldesign/device-battery
```

```typescript
import { BatteryModule } from '@ldesign/device-battery'
const battery = new BatteryModule()
await battery.init()
console.log('电量:', battery.getLevelPercentage() + '%')
```

#### 3. [@ldesign/device-network](./packages/network)
- **描述**: 网络状态检测
- **大小**: ~8KB
- **依赖**: @ldesign/device-core
- **文档**: [README](./packages/network/README.md)

```bash
pnpm add @ldesign/device-network
```

```typescript
import { NetworkModule } from '@ldesign/device-network'
const network = new NetworkModule()
await network.init()
console.log('在线:', network.isOnline())
```

### 框架适配

#### 4. [@ldesign/device-vue](./packages/vue)
- **描述**: Vue 3 适配器
- **大小**: ~12KB
- **依赖**: vue, @ldesign/device-core, battery, network
- **演示**: ✅ http://localhost:3200
- **文档**: [README](./packages/vue/README.md)

```bash
pnpm add @ldesign/device-vue
```

```vue
<script setup>
import { useDevice, useBattery } from '@ldesign/device-vue'
const { isMobile } = useDevice()
const { levelPercentage } = useBattery()
</script>
```

#### 5. [@ldesign/device-react](./packages/react)
- **描述**: React 18+ 适配器
- **大小**: ~12KB
- **依赖**: react, @ldesign/device-core, battery, network
- **演示**: ✅ http://localhost:3201
- **文档**: [README](./packages/react/README.md)

```bash
pnpm add @ldesign/device-react
```

```tsx
import { useDevice, useBattery } from '@ldesign/device-react'
function App() {
  const { isMobile } = useDevice()
  const { levelPercentage } = useBattery()
  return <div>电量: {levelPercentage}%</div>
}
```

#### 6. [@ldesign/device-solid](./packages/solid)
- **描述**: Solid.js 适配器
- **大小**: ~10KB
- **依赖**: solid-js, @ldesign/device-core, battery, network
- **文档**: [README](./packages/solid/README.md)

```bash
pnpm add @ldesign/device-solid
```

```tsx
import { useDevice, useBattery } from '@ldesign/device-solid'
function App() {
  const { isMobile } = useDevice()
  const { levelPercentage } = useBattery()
  return <div>电量: {levelPercentage()}%</div>
}
```

### 主包（聚合）

#### 7. [@ldesign/device](.)
- **描述**: 聚合所有功能的主包
- **依赖**: 所有子包
- **文档**: [README](./README.md)

```bash
pnpm add @ldesign/device
```

```typescript
// 可以从主包导入所有功能
import { BatteryModule, NetworkModule } from '@ldesign/device'
```

## 🎯 快速选择

### 我该安装哪个包？

**Vue 3 项目** → `@ldesign/device-vue`
**React 18 项目** → `@ldesign/device-react`
**Solid.js 项目** → `@ldesign/device-solid`
**纯 JS/TS 项目** → `@ldesign/device-core` + 功能模块
**需要所有功能** → `@ldesign/device`

## 📊 包大小对比

| 包 | Gzip 大小 | 功能 |
|---|----------|------|
| device-core | ~5KB | 核心功能 |
| device-battery | ~3KB | 电池检测 |
| device-network | ~3KB | 网络检测 |
| device-vue | ~4KB | Vue 适配 |
| device-react | ~4KB | React 适配 |
| device-solid | ~3KB | Solid 适配 |
| **总计（按需）** | **5-15KB** | **按需引入** |
| device（完整）| ~50KB | 所有功能 |

## 🚀 演示链接

| 演示 | 地址 | 描述 |
|-----|------|------|
| Core | http://localhost:3100 | EventEmitter 演示 |
| Battery | http://localhost:3101 | 电池检测演示 |
| Network | http://localhost:3102 | 网络监控演示 |
| Vue 3 | http://localhost:3200 | Vue 完整应用 |
| React 18 | http://localhost:3201 | React 完整应用 |

## 📚 文档索引

### 架构和设计
- [MONOREPO_STRUCTURE.md](./MONOREPO_STRUCTURE.md) - 架构设计
- [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - 实施状态

### 使用指南
- [BUILD_AND_RUN_GUIDE.md](./BUILD_AND_RUN_GUIDE.md) - 构建和运行
- [FINAL_IMPLEMENTATION_GUIDE.md](./FINAL_IMPLEMENTATION_GUIDE.md) - 详细指南

### 完成报告
- [MONOREPO_IMPLEMENTATION_COMPLETE.md](./MONOREPO_IMPLEMENTATION_COMPLETE.md) - 实施完成
- [FINAL_SUMMARY.md](./FINAL_SUMMARY.md) - 最终总结
- [README_COMPLETED.md](./README_COMPLETED.md) - 完成报告

---

**🎉 所有包都已准备就绪，可以开始使用了！**

