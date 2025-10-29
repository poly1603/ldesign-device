# @ldesign/device Monorepo - 完整实施指南

> 参考 `@ldesign/engine` 架构，将 @ldesign/device 重构为模块化 Monorepo

## 🎯 项目目标

将现有的 `@ldesign/device` 拆分为多个独立的子包：

- ✅ **核心功能模块化** - 每个功能独立打包
- ✅ **框架适配分离** - Vue/React/Solid 等框架单独维护
- ✅ **按需引入支持** - 用户可只安装需要的功能
- ✅ **统一构建工具** - 使用 @ldesign/builder
- ✅ **统一开发环境** - 使用 @ldesign/launcher

## 📁 最终目录结构

```
packages/device/
├── src/                            # 主包源代码（聚合导出）
│   └── index.ts
├── packages/                       # 子包目录
│   ├── core/                       # ✅ 已完成
│   ├── battery/                    # ⏳ 待创建
│   ├── network/                    # ⏳ 待创建
│   ├── geolocation/                # ⏳ 待创建
│   ├── media/                      # ⏳ 待创建
│   ├── utils/                      # ⏳ 待创建
│   ├── vue/                        # ⏳ 待创建
│   ├── react/                      # ⏳ 待创建
│   └── solid/                      # ⏳ 待创建
├── MONOREPO_STRUCTURE.md           # ✅ 架构设计文档
├── IMPLEMENTATION_STATUS.md         # ✅ 实施状态文档
├── README_MONOREPO.md              # ✅ 本文档
└── package.json                    # 主包配置
```

## ✅ 已完成的工作

### 1. 架构设计和文档

- [x] **MONOREPO_STRUCTURE.md** - 完整的架构设计，包括：
  - 所有子包的目录结构
  - 每个包的功能说明
  - 依赖关系图
  - 使用示例
  
- [x] **IMPLEMENTATION_STATUS.md** - 实施状态追踪，包括：
  - 已完成任务清单
  - 待完成任务详细说明
  - 快速实施步骤
  - 模板文件

### 2. 核心包 (@ldesign/device-core)

已创建完整的核心包，位于 `packages/device/packages/core/`：

#### 文件结构
```
core/
├── src/
│   ├── EventEmitter.ts          # ✅ 高性能事件系统（367 行）
│   ├── types.ts                 # ✅ 基础类型定义（100+ 类型）
│   └── index.ts                 # ✅ 导出入口
├── package.json                 # ✅ 包配置
├── builder.config.ts            # ✅ @ldesign/builder 配置
├── tsconfig.json                # ✅ TypeScript 配置
└── README.md                    # ✅ 文档
```

#### 核心功能

**EventEmitter 类** (`src/EventEmitter.ts`)
```typescript
// 高性能特性
- 延迟排序优化
- 快速路径（单监听器）
- 性能监控可选
- 支持优先级
- 支持命名空间
- 支持通配符事件
- 完整的错误处理

// API
emitter.on(event, listener, { priority, namespace })
emitter.once(event, listener)
emitter.off(event, listener)
emitter.emit(event, data)
emitter.offNamespace(namespace)
emitter.enablePerformanceMonitoring()
emitter.getPerformanceMetrics()
```

**类型定义** (`src/types.ts`)
```typescript
// 导出类型
EventListener<T>              // 事件监听器
DeviceType                    // 设备类型
Orientation                   // 屏幕方向
DeviceModule                  // 模块接口
DeviceInfo                    // 设备信息
BatteryInfo                   // 电池信息
NetworkInfo                   // 网络信息
GeolocationInfo               // 地理位置信息
```

#### 构建配置

**使用 @ldesign/builder**
```typescript
// builder.config.ts
export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs', 'umd'],  // 三种格式
    dir: {
      esm: 'es',                      // ES Module
      cjs: 'lib',                     // CommonJS
      umd: 'dist',                    // UMD
    },
    name: 'LDesignDeviceCore',
  },
  minify: true,
  sourcemap: true,
  dts: true,                          // 生成类型定义
  clean: true,
})
```

## 📋 待完成的工作

### 功能模块包（优先级：高）

1. **battery** - 电池信息检测
   - 复制 `src/modules/BatteryModule.ts`
   - 调整导入路径为 `@ldesign/device-core`
   - 创建演示示例

2. **network** - 网络状态检测
   - 复制 `src/modules/NetworkModule.ts`
   - 创建演示示例

3. **geolocation** - 地理定位
   - 复制 `src/modules/GeolocationModule.ts`
   - 创建演示示例

4. **media** - 媒体设备
   - 复制 `src/modules/MediaModule.ts`
   - 复制 `src/modules/MediaCapabilitiesModule.ts`
   - 创建演示示例

5. **utils** - 工具函数
   - 复制 `src/utils/` 下所有工具类
   - 创建演示示例

### 框架适配包（优先级：中）

6. **vue** - Vue 3 适配
   - 复制 `src/vue/` 下所有文件
   - 组合式函数：useDevice, useBattery, useNetwork 等
   - 组件：DeviceInfo, NetworkStatus 等
   - 指令：v-device, v-battery 等
   - 创建完整的 Vite 示例应用

7. **react** - React 18+ 适配
   - 创建 Hooks：useDevice, useBattery 等
   - 创建组件：DeviceInfo, NetworkStatus 等
   - 创建 Context: DeviceProvider
   - 创建 Vite 示例应用

8. **solid** - Solid.js 适配
   - 创建 Signals/Hooks
   - 创建组件
   - 创建 Vite 示例应用

### 主包更新（优先级：低）

9. **更新主包** - 聚合所有子包
   - 更新 `package.json` 依赖
   - 更新 `src/index.ts` 导出
   - 更新 `README.md`

## 🚀 快速开始指南

### 创建新子包的标准流程

#### 1. 创建目录结构

```bash
# 示例：创建 battery 包
cd packages/device/packages
mkdir -p battery/{src,examples/src}
```

#### 2. 创建 package.json

```json
{
  "name": "@ldesign/device-battery",
  "version": "0.1.0",
  "description": "Battery information detection module",
  "type": "module",
  "exports": {
    ".": {
      "types": "./es/index.d.ts",
      "import": "./es/index.js",
      "require": "./lib/index.cjs"
    }
  },
  "main": "./lib/index.cjs",
  "module": "./es/index.js",
  "types": "./es/index.d.ts",
  "scripts": {
    "build": "ldesign-builder build -f esm,cjs,umd",
    "dev": "ldesign-builder build --watch"
  },
  "dependencies": {
    "@ldesign/device-core": "workspace:*"
  },
  "devDependencies": {
    "@ldesign/builder": "workspace:*",
    "@ldesign/launcher": "workspace:*",
    "typescript": "^5.7.3"
  }
}
```

#### 3. 创建 builder.config.ts

```typescript
import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs', 'umd'],
    dir: { esm: 'es', cjs: 'lib', umd: 'dist' },
    name: 'LDesignDeviceBattery',
  },
  external: ['@ldesign/device-core'],
  minify: true,
  sourcemap: true,
  dts: true,
  clean: true,
})
```

#### 4. 复制源代码

```bash
# 复制模块文件
cp ../../src/modules/BatteryModule.ts src/

# 调整导入路径
# 将 '../types' 改为 '@ldesign/device-core'
# 将 '../utils' 改为 '@ldesign/device-core' 或创建本地工具
```

#### 5. 创建 index.ts

```typescript
export { BatteryModule } from './BatteryModule'
export type * from './types'
```

#### 6. 创建演示示例

```bash
cd examples

# 创建 package.json
cat > package.json << 'EOF'
{
  "name": "@ldesign/device-battery-example",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "ldesign-launcher dev",
    "build": "ldesign-launcher build"
  },
  "dependencies": {
    "@ldesign/device-battery": "workspace:*"
  },
  "devDependencies": {
    "@ldesign/launcher": "workspace:*"
  }
}
EOF

# 创建 launcher.config.ts
cat > launcher.config.ts << 'EOF'
import { defineConfig } from '@ldesign/launcher'
export default defineConfig({
  server: { port: 3001, open: true }
})
EOF
```

#### 7. 构建和测试

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 检查输出
ls es/    # ES Module
ls lib/   # CommonJS
ls dist/  # UMD

# 运行演示
cd examples
pnpm dev
```

## 📦 使用方式

### 安装单个功能模块

```bash
# 只需要电池检测
pnpm add @ldesign/device-core @ldesign/device-battery

# TypeScript
import { BatteryModule } from '@ldesign/device-battery'

const battery = new BatteryModule()
await battery.init()
const info = battery.getData()
```

### 安装完整功能

```bash
# 安装主包（包含所有功能）
pnpm add @ldesign/device

# TypeScript
import { BatteryModule, NetworkModule } from '@ldesign/device'
```

### Vue 项目

```bash
pnpm add @ldesign/device-vue

# 在 Vue 应用中
import { useDevice, useBattery } from '@ldesign/device-vue'

const { deviceInfo, isMobile } = useDevice()
const { level, isCharging } = useBattery()
```

### React 项目

```bash
pnpm add @ldesign/device-react

// 在 React 应用中
import { useDevice, useBattery } from '@ldesign/device-react'

function App() {
  const { deviceInfo, isMobile } = useDevice()
  const { level, isCharging } = useBattery()
  // ...
}
```

## 🎯 优势总结

### 用户视角

1. **按需引入** - 只安装需要的功能，减小包体积
2. **类型安全** - 完整的 TypeScript 支持
3. **框架原生** - 提供各框架的原生集成
4. **独立演示** - 每个包都有可运行的示例

### 开发视角

1. **模块化** - 功能独立，易于维护
2. **统一构建** - @ldesign/builder 统一打包
3. **统一开发** - @ldesign/launcher 统一开发环境
4. **清晰架构** - 参考 @ldesign/engine 的成熟方案

## 📚 参考资料

- **架构设计**: [MONOREPO_STRUCTURE.md](./MONOREPO_STRUCTURE.md)
- **实施状态**: [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)
- **参考项目**: `packages/engine/` - 完整实现示例

## 🔗 相关链接

- [@ldesign/builder 文档](../../tools/builder/README.md)
- [@ldesign/launcher 文档](../../tools/launcher/README.md)
- [@ldesign/engine 源码](../engine/)

---

**当前状态**: ✅ 架构设计完成，核心包已创建

**下一步**: 按照 `IMPLEMENTATION_STATUS.md` 创建各功能模块包


