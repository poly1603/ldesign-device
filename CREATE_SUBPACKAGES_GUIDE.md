# Device 子包创建指南

本指南说明如何完成所有 device 子包的创建。目前已完成：

## ✅ 已完成的子包

1. **@ldesign/device-core** - 核心功能（EventEmitter, ModuleLoader）
2. **@ldesign/device-battery** - 电池模块

## 📋 待创建的子包

### 3. @ldesign/device-network (网络模块)

**功能**: 网络连接状态、网络类型、下载速度等

**核心文件**:
- `src/NetworkModule.ts` - 从 `packages/device/src/modules/NetworkModule.ts` 复制并调整
- `src/types.ts` - 网络相关类型定义
- `examples/` - 网络状态实时监控演示

**依赖**:
```json
{
  "dependencies": {
    "@ldesign/device-core": "workspace:*"
  }
}
```

### 4. @ldesign/device-geolocation (地理定位)

**功能**: GPS 定位、坐标获取、位置监听

**核心文件**:
- `src/GeolocationModule.ts`
- `src/types.ts` - 坐标、精度等类型
- `examples/` - 地图定位演示（可集成地图 API）

### 5. @ldesign/device-media (媒体设备)

**功能**: 摄像头、麦克风检测和权限管理

**核心文件**:
- `src/MediaModule.ts`
- `src/MediaCapabilitiesModule.ts`
- `examples/` - 摄像头预览和麦克风音量检测

### 6. @ldesign/device-utils (工具函数)

**功能**: 设备指纹、性能监控、缓存管理等工具

**核心文件**:
- `src/DeviceFingerprint.ts`
- `src/PerformanceMonitor.ts`
- `src/SmartCache.ts`
- `src/MemoryManager.ts`
- 从 `packages/device/src/utils/` 复制所有工具文件

### 7. @ldesign/device-vue (Vue 集成)

**功能**: Vue 3 组件、组合式函数、指令

**核心文件**:
- `src/components/` - DeviceInfo, NetworkStatus 组件
- `src/composables/` - useDevice, useBattery, useNetwork 等
- `src/directives/` - v-device, v-battery 等
- `examples/` - Vue 3 完整应用演示

**依赖**:
```json
{
  "dependencies": {
    "@ldesign/device-core": "workspace:*",
    "@ldesign/device-battery": "workspace:*",
    "@ldesign/device-network": "workspace:*"
  },
  "peerDependencies": {
    "vue": "^3.3.0"
  }
}
```

### 8. @ldesign/device (主包 - 聚合包)

**功能**: 聚合所有子包，提供统一的导出

**package.json**:
```json
{
  "name": "@ldesign/device",
  "version": "0.1.0",
  "description": "Complete device detection library with modular architecture",
  "dependencies": {
    "@ldesign/device-core": "workspace:*",
    "@ldesign/device-battery": "workspace:*",
    "@ldesign/device-network": "workspace:*",
    "@ldesign/device-geolocation": "workspace:*",
    "@ldesign/device-media": "workspace:*",
    "@ldesign/device-utils": "workspace:*",
    "@ldesign/device-vue": "workspace:*"
  }
}
```

**src/index.ts**:
```typescript
// 重新导出所有子包
export * from '@ldesign/device-core'
export * from '@ldesign/device-battery'
export * from '@ldesign/device-network'
export * from '@ldesign/device-geolocation'
export * from '@ldesign/device-media'
export * from '@ldesign/device-utils'
export * from '@ldesign/device-vue'
```

## 📝 创建步骤模板

每个子包的创建步骤：

### 1. 创建基本结构

```bash
mkdir -p packages/device-xxx
cd packages/device-xxx
mkdir -p src examples/src
```

### 2. 创建 package.json

```json
{
  "name": "@ldesign/device-xxx",
  "version": "0.1.0",
  "description": "Device XXX module",
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

### 3. 创建 builder.config.ts

```typescript
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
  external: ['@ldesign/device-core'],
  minify: true,
  sourcemap: true,
  dts: true,
  clean: true,
})
```

### 4. 创建 tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "es",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "es", "lib"]
}
```

### 5. 复制源代码

从 `packages/device/src/` 相应目录复制文件到 `packages/device-xxx/src/`，并调整导入路径。

### 6. 创建演示示例

参考 `device-core/examples/` 和 `device-battery/examples/` 的结构创建。

## 🚀 批量创建脚本

可以创建一个脚本来自动化这个过程：

```typescript
// scripts/create-device-subpackages.ts
import fs from 'fs-extra'
import path from 'path'

const subpackages = [
  {
    name: 'device-network',
    description: 'Network connection detection module',
    modules: ['NetworkModule'],
    port: 3002,
  },
  {
    name: 'device-geolocation',
    description: 'Geolocation detection module',
    modules: ['GeolocationModule'],
    port: 3003,
  },
  // ... 其他子包
]

async function createSubpackage(config) {
  const pkgDir = path.join('packages', config.name)
  await fs.ensureDir(pkgDir)
  
  // 创建 package.json
  // 创建 builder.config.ts
  // 复制源代码
  // 创建演示示例
  // ...
}

for (const config of subpackages) {
  await createSubpackage(config)
}
```

## 📊 目录结构参考

完成后的目录结构：

```
packages/
├── device-core/              # ✅ 已完成
│   ├── src/
│   ├── examples/
│   ├── package.json
│   ├── builder.config.ts
│   └── README.md
├── device-battery/           # ✅ 已完成
│   ├── src/
│   ├── examples/
│   ├── package.json
│   ├── builder.config.ts
│   └── README.md
├── device-network/           # ⏳ 待创建
├── device-geolocation/       # ⏳ 待创建
├── device-media/             # ⏳ 待创建
├── device-utils/             # ⏳ 待创建
├── device-vue/               # ⏳ 待创建
└── device/                   # ⏳ 待更新（聚合包）
```

## ✅ 验证清单

每个子包完成后检查：

- [ ] 使用 `@ldesign/builder` 构建
- [ ] 生成 UMD, ESM, CJS 三种格式
- [ ] 包含完整的 TypeScript 类型定义
- [ ] 有基于 `@ldesign/launcher` 的演示
- [ ] README 文档完整
- [ ] 可以独立安装和使用
- [ ] 演示应用可以正常运行

## 🔧 测试命令

```bash
# 构建所有子包
cd packages/device-core && pnpm build
cd packages/device-battery && pnpm build
# ... 其他子包

# 运行演示
cd packages/device-core/examples && pnpm dev
cd packages/device-battery/examples && pnpm dev
# ... 其他演示

# 测试主包
cd packages/device && pnpm build
```

## 📝 注意事项

1. **导入路径**: 从 `@ldesign/device-core` 导入共享类型和工具
2. **依赖关系**: 避免子包之间的循环依赖
3. **类型定义**: 每个子包都要导出完整的类型
4. **演示端口**: 每个演示使用不同的端口（3000, 3001, 3002...）
5. **浏览器兼容性**: 在 README 中注明浏览器支持情况

---

**模板文件位置**:
- 参考 `packages/device-core/`
- 参考 `packages/device-battery/`


