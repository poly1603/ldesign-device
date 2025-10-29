# @ldesign/device Monorepo 结构

参考 `@ldesign/engine` 的架构设计

## 📁 目录结构

```
packages/device/
├── src/                          # 主包源代码（聚合所有功能）
│   ├── index.ts                  # 主入口，导出所有子包
│   └── ...                       # 保留现有代码作为参考
├── packages/                     # 子包目录
│   ├── core/                     # 核心包 @ldesign/device-core
│   │   ├── src/
│   │   │   ├── EventEmitter.ts  # 事件系统
│   │   │   ├── types.ts         # 基础类型定义
│   │   │   └── index.ts
│   │   ├── examples/            # 演示示例（基于 @ldesign/launcher）
│   │   ├── package.json
│   │   ├── builder.config.ts    # @ldesign/builder 配置
│   │   ├── tsconfig.json
│   │   └── README.md
│   ├── battery/                 # 电池模块 @ldesign/device-battery
│   │   ├── src/
│   │   │   ├── BatteryModule.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── examples/
│   │   ├── package.json
│   │   ├── builder.config.ts
│   │   └── README.md
│   ├── network/                 # 网络模块 @ldesign/device-network
│   ├── geolocation/             # 地理定位 @ldesign/device-geolocation
│   ├── media/                   # 媒体设备 @ldesign/device-media
│   ├── utils/                   # 工具函数 @ldesign/device-utils
│   ├── vue/                     # Vue 适配 @ldesign/device-vue
│   │   ├── src/
│   │   │   ├── composables/    # 组合式函数
│   │   │   │   ├── useDevice.ts
│   │   │   │   ├── useBattery.ts
│   │   │   │   ├── useNetwork.ts
│   │   │   │   └── index.ts
│   │   │   ├── components/     # Vue 组件
│   │   │   │   ├── DeviceInfo.vue
│   │   │   │   ├── NetworkStatus.vue
│   │   │   │   └── index.ts
│   │   │   ├── directives/     # Vue 指令
│   │   │   │   ├── vDevice.ts
│   │   │   │   ├── vBattery.ts
│   │   │   │   └── index.ts
│   │   │   ├── plugin.ts       # Vue 插件
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── examples/
│   │   │   └── vite-demo/      # 完整的 Vue 应用示例
│   │   ├── package.json
│   │   ├── builder.config.ts
│   │   └── README.md
│   ├── react/                   # React 适配 @ldesign/device-react
│   │   ├── src/
│   │   │   ├── hooks/          # React Hooks
│   │   │   │   ├── useDevice.ts
│   │   │   │   ├── useBattery.ts
│   │   │   │   ├── useNetwork.ts
│   │   │   │   └── index.ts
│   │   │   ├── components/     # React 组件
│   │   │   │   ├── DeviceInfo.tsx
│   │   │   │   ├── NetworkStatus.tsx
│   │   │   │   └── index.ts
│   │   │   ├── context/        # React Context
│   │   │   │   └── DeviceContext.tsx
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── examples/
│   │   │   └── vite-demo/
│   │   ├── package.json
│   │   └── README.md
│   └── solid/                   # Solid 适配 @ldesign/device-solid
│       ├── src/
│       │   ├── hooks/          # Solid Hooks
│       │   ├── components/     # Solid 组件
│       │   ├── types.ts
│       │   └── index.ts
│       ├── examples/
│       ├── package.json
│       └── README.md
├── package.json                 # 主包配置
├── builder.config.ts            # 主包构建配置
├── tsconfig.json
└── README.md

## 📦 包说明

### 核心包

#### @ldesign/device-core
- **功能**: 核心类型定义、EventEmitter、基础工具
- **导出**: 
  ```ts
  export { EventEmitter } from './EventEmitter'
  export * from './types'
  ```
- **依赖**: 无
- **输出格式**: ESM, CJS, UMD

#### @ldesign/device-utils
- **功能**: 工具函数集合
  - DeviceFingerprint（设备指纹）
  - PerformanceMonitor（性能监控）
  - SmartCache（智能缓存）
  - MemoryManager（内存管理）
- **依赖**: `@ldesign/device-core`

### 功能模块包

#### @ldesign/device-battery
- **功能**: 电池信息检测
- **API**: 
  - `BatteryModule` 类
  - `getBatteryInfo()` 方法
  - `batteryChange` 事件
- **依赖**: `@ldesign/device-core`

#### @ldesign/device-network
- **功能**: 网络状态检测
- **API**:
  - `NetworkModule` 类
  - `getNetworkInfo()` 方法
  - `networkChange` 事件
- **依赖**: `@ldesign/device-core`

#### @ldesign/device-geolocation
- **功能**: 地理定位
- **API**:
  - `GeolocationModule` 类
  - `getCurrentPosition()` 方法
  - `watchPosition()` 方法
- **依赖**: `@ldesign/device-core`

#### @ldesign/device-media
- **功能**: 媒体设备检测
- **API**:
  - `MediaModule` 类
  - `enumerateDevices()` 方法
  - `requestPermissions()` 方法
- **依赖**: `@ldesign/device-core`

### 框架适配包

#### @ldesign/device-vue
- **功能**: Vue 3 集成
- **导出**:
  ```ts
  // 组合式函数
  export { useDevice, useBattery, useNetwork, useGeolocation }
  
  // 组件
  export { DeviceInfo, NetworkStatus, BatteryIndicator }
  
  // 指令
  export { vDevice, vBattery, vNetwork }
  
  // 插件
  export { DevicePlugin }
  ```
- **依赖**: 
  - `@ldesign/device-core`
  - `@ldesign/device-battery`
  - `@ldesign/device-network`
  - `@ldesign/device-geolocation`
  - `vue` (peerDependency)

#### @ldesign/device-react
- **功能**: React 18+ 集成
- **导出**:
  ```ts
  // Hooks
  export { useDevice, useBattery, useNetwork, useGeolocation }
  
  // 组件
  export { DeviceInfo, NetworkStatus, BatteryIndicator }
  
  // Context
  export { DeviceProvider, useDeviceContext }
  ```
- **依赖**:
  - `@ldesign/device-core`
  - `@ldesign/device-battery`
  - `@ldesign/device-network`
  - `react` (peerDependency)

#### @ldesign/device-solid
- **功能**: Solid.js 集成
- **导出**:
  ```ts
  // Signals/Hooks
  export { useDevice, useBattery, useNetwork }
  
  // 组件
  export { DeviceInfo, NetworkStatus }
  ```
- **依赖**:
  - `@ldesign/device-core`
  - `solid-js` (peerDependency)

### 主包 @ldesign/device
- **功能**: 聚合所有子包，提供统一导出
- **package.json**:
  ```json
  {
    "dependencies": {
      "@ldesign/device-core": "workspace:*",
      "@ldesign/device-battery": "workspace:*",
      "@ldesign/device-network": "workspace:*",
      "@ldesign/device-geolocation": "workspace:*",
      "@ldesign/device-media": "workspace:*",
      "@ldesign/device-utils": "workspace:*"
    }
  }
  ```
- **src/index.ts**:
  ```ts
  // 重新导出所有子包
  export * from '@ldesign/device-core'
  export * from '@ldesign/device-battery'
  export * from '@ldesign/device-network'
  export * from '@ldesign/device-geolocation'
  export * from '@ldesign/device-media'
  export * from '@ldesign/device-utils'
  ```

## 🔧 构建配置

所有子包使用 `@ldesign/builder` 进行构建：

```typescript
// builder.config.ts
import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs', 'umd'],
    dir: {
      esm: 'es',
      cjs: 'lib',
      umd: 'dist',
    },
    name: 'LDesignDeviceXXX',
  },
  external: ['@ldesign/device-core'], // 根据依赖调整
  minify: true,
  sourcemap: true,
  dts: true,
  clean: true,
})
```

## 📝 开发示例

每个子包都包含基于 `@ldesign/launcher` 的演示示例：

```
packages/xxx/examples/
├── package.json
├── launcher.config.ts
├── index.html
├── src/
│   └── main.ts
└── tsconfig.json
```

## 🚀 使用方式

### 安装单个包
```bash
pnpm add @ldesign/device-battery
```

### 安装完整功能
```bash
pnpm add @ldesign/device
```

### Vue 项目
```bash
pnpm add @ldesign/device-vue
```

### React 项目
```bash
pnpm add @ldesign/device-react
```

## 📊 依赖关系图

```
@ldesign/device (主包)
├── @ldesign/device-core (核心)
├── @ldesign/device-utils (依赖 core)
├── @ldesign/device-battery (依赖 core)
├── @ldesign/device-network (依赖 core)
├── @ldesign/device-geolocation (依赖 core)
└── @ldesign/device-media (依赖 core)

@ldesign/device-vue (依赖所有功能模块)
@ldesign/device-react (依赖所有功能模块)
@ldesign/device-solid (依赖所有功能模块)
```

## ✅ 优势

1. **模块化**: 用户可以按需安装所需功能
2. **类型安全**: 每个包都有完整的 TypeScript 类型
3. **框架适配**: 提供各主流框架的原生集成
4. **独立演示**: 每个包都有独立的示例程序
5. **统一构建**: 使用 @ldesign/builder 统一打包
6. **统一开发**: 使用 @ldesign/launcher 统一开发服务器


