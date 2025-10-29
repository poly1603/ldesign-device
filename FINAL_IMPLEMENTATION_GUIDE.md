# @ldesign/device Monorepo - 最终实施指南

> 参考 `@ldesign/engine` 的完整架构，创建模块化的设备检测库

## ✅ 已完成的工作

### 1. 架构设计文档 ✨

- **MONOREPO_STRUCTURE.md** - 完整架构设计
- **IMPLEMENTATION_STATUS.md** - 实施状态追踪
- **README_MONOREPO.md** - 使用指南
- **FINAL_IMPLEMENTATION_GUIDE.md** - 本文档

### 2. 核心包 `@ldesign/device-core` ✅

位置: `packages/device/packages/core/`

**完成内容**:
```
core/
├── src/
│   ├── EventEmitter.ts      ✅ 高性能事件系统
│   ├── types.ts             ✅ 完整类型定义
│   └── index.ts             ✅ 导出入口
├── package.json             ✅ 完整的 exports 配置
├── builder.config.ts        ✅ @ldesign/builder 配置
├── tsconfig.json            ✅ TypeScript 配置
└── README.md               ✅ 文档
```

**package.json 特点**:
- ✅ 详细的 exports 字段（参考 @engine/core）
- ✅ 支持子模块导入：`@ldesign/device-core/events`, `@ldesign/device-core/types`
- ✅ 使用 `@ldesign/builder` 构建
- ✅ 输出格式：ESM, CJS, UMD, DTS

### 3. Battery 模块包 `@ldesign/device-battery` ✅

位置: `packages/device/packages/battery/`

**完成内容**:
```
battery/
├── src/
│   ├── BatteryModule.ts     ✅ 完整的电池检测模块
│   └── index.ts             ✅ 导出入口
├── package.json             ✅ 依赖 @ldesign/device-core
├── builder.config.ts        ✅ 构建配置
├── tsconfig.json            ✅ TS 配置
└── README.md               ✅ 完整文档
```

**特点**:
- ✅ 独立的模块，无需其他功能依赖
- ✅ 完整的 API：getData(), getLevel(), isCharging() 等
- ✅ 事件支持：batteryChange
- ✅ TypeScript 类型完整
- ⏳ 示例项目（需创建）

## 📋 待完成的包

### 4. Network 模块 `@ldesign/device-network` ⏳

**创建步骤**:

```bash
# 1. 创建目录
mkdir -p packages/device/packages/network/{src,examples/src}

# 2. 复制配置文件模板（从 battery 包复制）
cp packages/device/packages/battery/package.json packages/device/packages/network/
cp packages/device/packages/battery/builder.config.ts packages/device/packages/network/
cp packages/device/packages/battery/tsconfig.json packages/device/packages/network/

# 3. 修改 package.json
- name: "@ldesign/device-network"
- description: "Network connection detection module"
- builder output name: "LDesignDeviceNetwork"

# 4. 复制源代码
cp packages/device/src/modules/NetworkModule.ts packages/device/packages/network/src/
# 调整导入：'../types' -> '@ldesign/device-core'

# 5. 创建 index.ts
cat > packages/device/packages/network/src/index.ts << 'EOF'
export { NetworkModule } from './NetworkModule'
export type { NetworkInfo, DeviceModule } from '@ldesign/device-core'
EOF

# 6. 构建
cd packages/device/packages/network
pnpm install
pnpm build
```

### 5. Geolocation 模块 `@ldesign/device-geolocation` ⏳

类似 network，复制 `src/modules/GeolocationModule.ts`

### 6. Media 模块 `@ldesign/device-media` ⏳

复制以下文件：
- `src/modules/MediaModule.ts`
- `src/modules/MediaCapabilitiesModule.ts`

### 7. Utils 工具包 `@ldesign/device-utils` ⏳

复制整个 `src/utils/` 目录，包括：
- DeviceFingerprint.ts
- PerformanceMonitor.ts
- SmartCache.ts
- MemoryManager.ts
- 其他工具函数

## 🎨 框架适配包

### 8. Vue 适配 `@ldesign/device-vue` ⏳

**目录结构**:
```
packages/device/packages/vue/
├── src/
│   ├── composables/          # 组合式函数
│   │   ├── useDevice.ts
│   │   ├── useBattery.ts
│   │   ├── useNetwork.ts
│   │   ├── useGeolocation.ts
│   │   └── index.ts
│   ├── components/           # Vue 组件
│   │   ├── DeviceInfo.vue
│   │   ├── NetworkStatus.vue
│   │   ├── BatteryIndicator.vue
│   │   └── index.ts
│   ├── directives/           # Vue 指令
│   │   ├── vDevice.ts
│   │   ├── vBattery.ts
│   │   ├── vNetwork.ts
│   │   └── index.ts
│   ├── plugin.ts             # Vue 插件
│   ├── types.ts
│   └── index.ts
├── examples/
│   └── vite-demo/            # 完整 Vue 应用
│       ├── package.json
│       ├── launcher.config.ts
│       ├── index.html
│       ├── src/
│       │   ├── App.vue
│       │   ├── main.ts
│       │   └── components/
│       └── tsconfig.json
├── package.json
├── builder.config.ts
└── README.md
```

**package.json 关键配置**:
```json
{
  "name": "@ldesign/device-vue",
  "exports": {
    ".": {...},
    "./composables": {...},
    "./components": {...},
    "./directives": {...}
  },
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

**创建步骤**:
1. 复制 `packages/device/src/vue/` 的所有文件
2. 调整导入路径到各个子包
3. 创建完整的 vite-demo 示例
4. 使用 @ldesign/launcher 作为开发服务器

### 9. React 适配 `@ldesign/device-react` ⏳

**目录结构**:
```
packages/device/packages/react/
├── src/
│   ├── hooks/                # React Hooks
│   │   ├── useDevice.ts
│   │   ├── useBattery.ts
│   │   ├── useNetwork.ts
│   │   ├── useGeolocation.ts
│   │   └── index.ts
│   ├── components/           # React 组件
│   │   ├── DeviceInfo.tsx
│   │   ├── NetworkStatus.tsx
│   │   ├── BatteryIndicator.tsx
│   │   └── index.ts
│   ├── context/              # React Context
│   │   ├── DeviceContext.tsx
│   │   └── index.ts
│   ├── types.ts
│   └── index.ts
├── examples/
│   └── vite-demo/
├── package.json
└── README.md
```

**package.json 配置**:
```json
{
  "name": "@ldesign/device-react",
  "exports": {
    ".": {...},
    "./hooks": {...},
    "./components": {...},
    "./context": {...}
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### 10. Solid 适配 `@ldesign/device-solid` ⏳

参考 `@ldesign/engine-solid` 的结构

### 11. Svelte 适配 `@ldesign/device-svelte` ⏳

参考 `@ldesign/engine-svelte` 的结构

### 12. Angular 适配 `@ldesign/device-angular` ⏳

参考 `@ldesign/engine-angular` 的结构

## 📦 主包更新

### 更新 `packages/device/package.json`

```json
{
  "name": "@ldesign/device",
  "version": "0.2.0",
  "description": "Complete device detection library with modular architecture",
  "keywords": [
    "device",
    "detection",
    "responsive",
    "battery",
    "network",
    "geolocation",
    "typescript"
  ],
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
    "build": "ldesign-builder build -f esm,cjs,umd,dts",
    "build:all": "pnpm -r --filter './packages/**' build",
    "dev": "ldesign-builder build -f esm,cjs,dts --watch"
  },
  "dependencies": {
    "@ldesign/device-core": "workspace:*",
    "@ldesign/device-battery": "workspace:*",
    "@ldesign/device-network": "workspace:*",
    "@ldesign/device-geolocation": "workspace:*",
    "@ldesign/device-media": "workspace:*",
    "@ldesign/device-utils": "workspace:*"
  },
  "devDependencies": {
    "@ldesign/builder": "workspace:*"
  }
}
```

### 更新 `packages/device/src/index.ts`

```typescript
/**
 * @ldesign/device
 * 
 * 完整的设备检测库 - 聚合所有功能模块
 * 
 * @packageDocumentation
 */

// 重新导出所有子包
export * from '@ldesign/device-core'
export * from '@ldesign/device-battery'
export * from '@ldesign/device-network'
export * from '@ldesign/device-geolocation'
export * from '@ldesign/device-media'
export * from '@ldesign/device-utils'

// 版本信息
export const VERSION = '0.2.0'
```

## 🚀 批量创建脚本

创建 `scripts/create-all-packages.sh`:

```bash
#!/bin/bash

# 功能模块包
MODULES=("network" "geolocation" "media")

for module in "${MODULES[@]}"; do
  echo "Creating @ldesign/device-$module..."
  
  mkdir -p packages/device/packages/$module/{src,examples/src}
  
  # 复制配置文件
  cp packages/device/packages/battery/package.json packages/device/packages/$module/
  cp packages/device/packages/battery/builder.config.ts packages/device/packages/$module/
  cp packages/device/packages/battery/tsconfig.json packages/device/packages/$module/
  
  # 根据模块名修改配置
  sed -i "s/battery/$module/g" packages/device/packages/$module/package.json
  sed -i "s/Battery/$(echo $module | sed 's/.*/\u&/')/" packages/device/packages/$module/package.json
  
  echo "✅ Created $module package structure"
done

echo "🎉 All packages created!"
```

## 📊 构建顺序

```bash
# 1. 构建核心包
cd packages/device/packages/core
pnpm install
pnpm build

# 2. 构建功能模块（可并行）
cd packages/device/packages/battery && pnpm build
cd packages/device/packages/network && pnpm build
cd packages/device/packages/geolocation && pnpm build
cd packages/device/packages/media && pnpm build
cd packages/device/packages/utils && pnpm build

# 3. 构建框架适配（依赖功能模块）
cd packages/device/packages/vue && pnpm build
cd packages/device/packages/react && pnpm build
cd packages/device/packages/solid && pnpm build

# 4. 构建主包
cd packages/device
pnpm build

# 或使用批量构建
pnpm -r --filter './packages/device/packages/**' build
```

## 🎯 示例项目结构

每个功能模块包都应包含示例：

```
packages/xxx/examples/
├── package.json
├── launcher.config.ts     # @ldesign/launcher 配置
├── index.html
├── src/
│   └── main.ts           # 演示代码
└── tsconfig.json
```

**示例 launcher.config.ts**:
```typescript
import { defineConfig } from '@ldesign/launcher'

export default defineConfig({
  server: {
    port: 3001,  // 每个包使用不同端口
    open: true,
  },
  build: {
    outDir: 'dist',
  },
})
```

## ✅ 验证清单

完成后检查每个包：

### 功能模块包
- [ ] 使用 `@ldesign/builder` 构建
- [ ] 生成 ESM, CJS, UMD 三种格式
- [ ] 包含完整的 TypeScript 类型定义
- [ ] 有独立的示例项目（基于 @ldesign/launcher）
- [ ] README 文档完整
- [ ] 可以独立安装和使用

### 框架适配包
- [ ] 依赖相应的功能模块包
- [ ] peerDependencies 配置正确
- [ ] 提供完整的 Hooks/Composables
- [ ] 提供实用的组件
- [ ] 有完整的 vite-demo
- [ ] TypeScript 类型完整

### 主包
- [ ] 正确聚合所有子包
- [ ] 可以一次性安装所有功能
- [ ] 文档说明清晰

## 📝 后续优化

1. **CI/CD 配置** - 自动构建和发布
2. **Monorepo 工具** - 考虑使用 Turborepo
3. **版本管理** - 使用 Changesets
4. **文档网站** - 使用 VitePress
5. **测试覆盖** - 为每个包添加单元测试

## 🔗 参考资源

- **@ldesign/engine** - 完整的 Monorepo 实现
- **@ldesign/builder** - 统一构建工具
- **@ldesign/launcher** - 统一开发服务器

---

**当前状态**: ✅ Core 和 Battery 包已完成

**下一步**: 按照本指南创建剩余的功能模块包和框架适配包

