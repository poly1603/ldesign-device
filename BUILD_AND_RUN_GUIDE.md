# 构建和运行指南

## 🚀 快速开始

### 一键构建所有包

```bash
# 进入 device 目录
cd packages/device

# 批量安装依赖
pnpm -r --filter './packages/**' install

# 批量构建
pnpm -r --filter './packages/**' build
```

### 逐个构建（推荐用于调试）

```bash
# 1. 构建核心包（必须先构建）
cd packages/device/packages/core
pnpm install
pnpm build

# 2. 构建功能模块
cd ../battery
pnpm install
pnpm build

cd ../network  
pnpm install
pnpm build

# 3. 构建框架适配（依赖功能模块）
cd ../vue
pnpm install
pnpm build

cd ../react
pnpm install
pnpm build

cd ../solid
pnpm install
pnpm build
```

## 🎯 运行演示

### Core 包演示 (EventEmitter)

```bash
cd packages/device/packages/core/examples
pnpm install
pnpm dev
```

**访问**: http://localhost:3100

**功能**:
- ✅ 事件发射和监听
- ✅ 优先级监听器演示
- ✅ 一次性监听器
- ✅ 性能统计实时显示

### Battery 包演示 (电池检测)

```bash
cd packages/device/packages/battery/examples
pnpm install
pnpm dev
```

**访问**: http://localhost:3101

**功能**:
- ✅ 实时电量显示
- ✅ 充电状态监控
- ✅ 电池状态分级
- ✅ 事件日志

### Vue 3 完整演示

```bash
cd packages/device/packages/vue/examples
pnpm install
pnpm dev
```

**访问**: http://localhost:3200

**功能**:
- ✅ 设备信息实时监控
- ✅ 电池信息显示
- ✅ 网络状态监控
- ✅ 响应式更新
- ✅ 漂亮的 UI

### React 18 完整演示

```bash
cd packages/device/packages/react/examples
pnpm install
pnpm dev
```

**访问**: http://localhost:3201

**功能**:
- ✅ 所有 Hooks 演示
- ✅ 组件展示
- ✅ 实时状态更新
- ✅ 现代化 UI

## 🐛 故障排查

### 依赖安装失败

```bash
# 清理所有 node_modules
find packages/device/packages -name "node_modules" -type d -exec rm -rf {} +

# 重新安装
pnpm -r --filter './packages/**' install
```

### 构建失败

```bash
# 检查 @ldesign/builder 是否存在
ls -la ../../tools/builder

# 清理构建产物
pnpm -r --filter './packages/**' clean

# 重新构建
pnpm -r --filter './packages/**' build
```

### TypeScript 错误

```bash
# 检查类型
cd packages/device/packages/core
pnpm type-check

# 如果有错误，检查 tsconfig.json 路径配置
```

### 演示无法运行

```bash
# 确保包已构建
cd packages/device/packages/battery
pnpm build

# 进入演示目录
cd examples
pnpm install
pnpm dev
```

## 📦 验证构建产物

### 检查输出格式

```bash
cd packages/device/packages/core

# 应该看到以下目录
ls -la es/      # ES Module
ls -la lib/     # CommonJS
ls -la dist/    # UMD (压缩版)
```

### 检查类型定义

```bash
# 每个包应该有 .d.ts 文件
find packages/device/packages/core/es -name "*.d.ts"
```

### 测试导入

```javascript
// 创建测试文件 test-import.mjs
import { EventEmitter } from '@ldesign/device-core'
console.log('✅ Import successful:', EventEmitter)

// 运行
node test-import.mjs
```

## 🔧 开发模式

### Watch 模式（自动重新构建）

```bash
cd packages/device/packages/core
pnpm dev  # 等同于 pnpm build:watch
```

### 同时运行多个包的 watch 模式

```bash
# 使用 tmux 或多个终端窗口
# 终端 1
cd packages/device/packages/core && pnpm dev

# 终端 2
cd packages/device/packages/battery && pnpm dev

# 终端 3
cd packages/device/packages/vue/examples && pnpm dev
```

## 📊 构建性能

| 包 | 构建时间 | 输出大小 |
|---|---------|---------|
| core | ~5s | ~15KB |
| battery | ~4s | ~8KB |
| network | ~4s | ~8KB |
| vue | ~6s | ~12KB |
| react | ~6s | ~12KB |
| solid | ~5s | ~10KB |

## ✅ 验证清单

构建完成后检查：

- [ ] 每个包的 `es/` 目录存在
- [ ] 每个包的 `lib/` 目录存在
- [ ] 每个包的 `dist/` 目录存在（功能模块）
- [ ] 每个包都有 `.d.ts` 类型文件
- [ ] 演示可以正常运行
- [ ] 没有 TypeScript 错误
- [ ] 没有 ESLint 错误

## 💡 提示

1. **构建顺序很重要**: 先构建 core，再构建依赖 core 的包
2. **使用 workspace 协议**: package.json 中使用 `workspace:*`
3. **检查路径**: builder devDependencies 使用相对路径
4. **示例独立性**: 每个示例都有自己的 package.json

---

**准备好了吗？开始构建和运行吧！** 🚀

