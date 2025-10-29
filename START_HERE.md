# 🚀 从这里开始！

## 欢迎使用 @ldesign/device Monorepo

恭喜！您的设备检测库已经完成模块化改造，现在拥有：

- ✅ **7个独立的包** - 可按需安装
- ✅ **3个框架支持** - Vue, React, Solid
- ✅ **5个演示应用** - 精美的 UI
- ✅ **完整的文档** - 6份详细指南

## 🎯 3分钟快速开始

### 1. 构建包（2分钟）

```bash
# 在 packages/device 目录下
cd packages/device

# 构建核心包
cd packages/core && pnpm install && pnpm build && cd ..

# 构建功能模块
cd packages/battery && pnpm install && pnpm build && cd ..
cd packages/network && pnpm install && pnpm build && cd ..

# 构建框架适配
cd packages/vue && pnpm install && pnpm build && cd ..
cd packages/react && pnpm install && pnpm build && cd ..
```

### 2. 运行演示（1分钟）

```bash
# Vue 演示（推荐）
cd packages/vue/examples
pnpm install
pnpm dev
```

**打开浏览器**: http://localhost:3200

您将看到一个漂亮的演示应用，展示：
- 📱 设备类型检测
- 🔋 电池信息实时监控
- 🌐 网络状态监控
- ✨ 响应式更新

### 3. 在项目中使用

#### Vue 3 项目

```bash
pnpm add @ldesign/device-vue
```

```vue
<script setup>
import { useDevice, useBattery } from '@ldesign/device-vue'

const { isMobile } = useDevice()
const { levelPercentage } = useBattery()
</script>

<template>
  <div>
    <p v-if="isMobile">移动设备检测成功！</p>
    <p>电量: {{ levelPercentage }}%</p>
  </div>
</template>
```

#### React 18 项目

```bash
pnpm add @ldesign/device-react
```

```tsx
import { useDevice, useBattery, BatteryIndicator } from '@ldesign/device-react'

function App() {
  const { isMobile } = useDevice()
  const { levelPercentage } = useBattery()
  
  return (
    <div>
      <BatteryIndicator />
      {isMobile && <p>移动设备检测成功！</p>}
      <p>电量: {levelPercentage}%</p>
    </div>
  )
}
```

## 📚 完整文档导航

### 新手必读 👶

1. **本文档** - `START_HERE.md` (当前)
2. **架构设计** - [MONOREPO_STRUCTURE.md](./MONOREPO_STRUCTURE.md)
3. **构建指南** - [BUILD_AND_RUN_GUIDE.md](./BUILD_AND_RUN_GUIDE.md)

### 进阶阅读 🧑‍💻

4. **实施指南** - [FINAL_IMPLEMENTATION_GUIDE.md](./FINAL_IMPLEMENTATION_GUIDE.md)
5. **完成报告** - [MONOREPO_IMPLEMENTATION_COMPLETE.md](./MONOREPO_IMPLEMENTATION_COMPLETE.md)
6. **最终总结** - [FINAL_SUMMARY.md](./FINAL_SUMMARY.md)

### 包文档 📦

- [Core 包](./packages/core/README.md)
- [Battery 包](./packages/battery/README.md)
- [Network 包](./packages/network/README.md)
- [Vue 适配](./packages/vue/README.md)
- [React 适配](./packages/react/README.md)
- [Solid 适配](./packages/solid/README.md)

## 🎨 查看所有演示

```bash
# 同时运行多个演示（需要多个终端）

# 终端 1: Core EventEmitter 演示
cd packages/core/examples && pnpm dev

# 终端 2: Battery 电池演示
cd packages/battery/examples && pnpm dev

# 终端 3: Vue 完整演示
cd packages/vue/examples && pnpm dev

# 终端 4: React 完整演示
cd packages/react/examples && pnpm dev
```

然后访问：
- Core: http://localhost:3100
- Battery: http://localhost:3101
- Vue: http://localhost:3200
- React: http://localhost:3201

## ❓ 常见问题

### Q: 我应该使用哪个包？

**A**: 根据您的项目类型选择：
- Vue 3 → `@ldesign/device-vue`
- React 18 → `@ldesign/device-react`
- Solid.js → `@ldesign/device-solid`
- 纯 JS → `@ldesign/device-core` + 功能模块

### Q: 如何只安装电池检测功能？

**A**: 
```bash
pnpm add @ldesign/device-core @ldesign/device-battery
```

### Q: 演示无法运行？

**A**: 确保先构建包：
```bash
cd packages/battery
pnpm build
cd examples
pnpm install
pnpm dev
```

### Q: TypeScript 报错？

**A**: 确保安装了所有依赖，并且包已经构建（生成了 .d.ts 文件）

## 🎯 推荐的学习路径

### 第1天：了解架构

1. 阅读 `MONOREPO_STRUCTURE.md`
2. 查看 `packages/` 目录结构
3. 了解各个包的作用

### 第2天：运行演示

1. 构建 core 和 battery 包
2. 运行 battery 演示
3. 运行 Vue 演示
4. 查看实际效果

### 第3天：集成使用

1. 在项目中安装对应的包
2. 按照示例使用
3. 查看 API 文档
4. 根据需求定制

## 💡 快捷命令

```bash
# 构建所有包
pnpm -r --filter './packages/**' build

# 清理所有构建产物
pnpm -r --filter './packages/**' clean

# 运行所有测试
pnpm -r --filter './packages/**' test:run

# Lint 所有代码
pnpm -r --filter './packages/**' lint
```

## 🌟 特色功能

### 1. 按需引入
只安装需要的功能，减小包体积

### 2. 多框架支持
Vue, React, Solid 开箱即用

### 3. TypeScript 完整
100% 类型覆盖，智能提示

### 4. 精美演示
5个完整的演示应用

### 5. 完整文档
每个包都有详细的 README

## 🎊 开始探索

**推荐路线**:
1. 运行 Vue 演示 → http://localhost:3200
2. 查看源代码 → `packages/vue/examples/src/App.vue`
3. 了解 API → `packages/vue/README.md`
4. 在项目中使用 → 按照示例代码

---

**祝您使用愉快！** 🚀

如有问题，请查看详细文档或示例代码。

