# 示例项目总览

本页面提供所有示例项目的详细信息和使用指南。

## 🎯 示例列表

我们提供了 6 个完整的示例项目，覆盖不同的技术栈和使用场景。

### 1. Vanilla JavaScript 示例

**路径：** `examples/vanilla-js/`  
**难度：** ⭐  
**技术栈：** Vanilla JS + Vite  
**端口：** 默认（5173）

最基础的示例，适合：
- 初学者了解基本概念
- 无框架项目的集成
- 快速原型开发

**主要功能：**
- 基础设备检测
- 事件监听
- 简单的 UI 展示

**运行方式：**
```bash
cd examples/vanilla-js
npm install
npm run dev
```

### 2. Vue 3 示例

**路径：** `examples/vue-example/`  
**难度：** ⭐⭐  
**技术栈：** Vue 3 + Composition API  
**端口：** 默认（5174）

Vue 3 的完整集成示例，适合：
- Vue 开发者
- 使用 Composition API 的项目
- 响应式数据绑定场景

**主要功能：**
- useDevice composable
- 响应式设备信息
- Vue 指令使用
- 组件化开发

**运行方式：**
```bash
cd examples/vue-example
npm install
npm run dev
```

### 3. React 示例 ⭐ 新增

**路径：** `examples/react-example/`  
**难度：** ⭐⭐  
**技术栈：** React 18 + TypeScript  
**端口：** 3001

React 生态的完整示例，适合：
- React 开发者
- TypeScript 项目
- 需要完整功能模块的场景

**主要功能：**
- React Hooks 集成
- 设备信息卡片
- 电池状态监控
- 网络状态监控
- 地理位置获取
- 响应式布局

**组件列表：**
- `DeviceInfoCard` - 设备信息展示
- `BatteryStatus` - 电池状态
- `NetworkStatus` - 网络状态
- `GeolocationInfo` - 地理位置
- `ResponsiveLayout` - 响应式布局容器

**运行方式：**
```bash
cd examples/react-example
pnpm install
pnpm dev
```

访问：http://localhost:3001

### 4. TypeScript 示例 ⭐ 新增

**路径：** `examples/typescript-example/`  
**难度：** ⭐⭐⭐  
**技术栈：** TypeScript + Vite  
**端口：** 3002

TypeScript 高级特性演示，适合：
- TypeScript 爱好者
- 需要严格类型检查的项目
- 学习类型安全编程

**主要功能：**
- 基础设备检测
- 类型守卫示例
- 事件监听（类型安全）
- 动态模块加载
- 性能基准测试
- 自定义配置

**学习重点：**
- 类型定义的使用
- 类型守卫函数编写
- 泛型和类型推断
- 严格模式下的开发

**运行方式：**
```bash
cd examples/typescript-example
pnpm install
pnpm dev
```

访问：http://localhost:3002

### 5. 完整应用示例 ⭐ 新增

**路径：** `examples/complete-app/`  
**难度：** ⭐⭐⭐  
**技术栈：** Vue 3 + TypeScript  
**端口：** 3003

真实的商业应用场景，适合：
- 需要完整参考的开发者
- 学习最佳实践
- 了解实际项目架构

**应用场景：** 响应式电商网站

**核心特性：**
- 移动端汉堡菜单
- 平板双列布局
- 桌面侧边栏导航
- 响应式商品网格
- 设备调试面板

**组件架构：**
```
src/
├── components/
│   ├── AppHeader.vue          # 应用头部
│   ├── ProductGrid.vue        # 商品网格
│   ├── ProductCard.vue        # 商品卡片
│   ├── Sidebar.vue            # 侧边栏
│   ├── MobileMenu.vue         # 移动端菜单
│   └── DeviceDebugPanel.vue   # 调试面板
├── App.vue                    # 主应用
└── main.ts                    # 入口文件
```

**响应式设计：**
- 移动端（< 768px）：单列，汉堡菜单
- 平板（768-1024px）：双列
- 桌面（> 1024px）：三列 + 侧边栏

**运行方式：**
```bash
cd examples/complete-app
pnpm install
pnpm dev
```

访问：http://localhost:3003

### 6. Playground ⭐ 新增

**路径：** `examples/playground/`  
**难度：** ⭐  
**技术栈：** Vanilla JS + Vite  
**端口：** 3004

交互式演示和测试平台，适合：
- 快速实验和测试
- 学习和教学
- 功能演示

**核心功能：**
- 实时代码编辑器
- 4 个预设示例标签
- 设备信息可视化
- 交互式控制台
- 6 个快速测试按钮
- 键盘快捷键支持

**快速测试功能：**
1. 检测设备 - 获取当前设备信息
2. 模拟窗口变化 - 监听大小变化
3. 测试方向 - 监听屏幕旋转
4. 性能测试 - 基准测试
5. 电池状态 - Battery API
6. 网络状态 - Network API

**运行方式：**
```bash
cd examples/playground
pnpm install
pnpm dev
```

访问：http://localhost:3004

## 🚀 快速启动

### 单个示例

```bash
# 进入示例目录
cd examples/[示例名称]

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 所有示例

我们提供了一键启动所有示例的脚本：

```bash
# 在 device 包根目录运行
node scripts/run-all-examples.js
```

这将依次启动所有示例，你可以在不同端口访问它们。

## 📊 示例对比

| 示例 | 框架 | TypeScript | 难度 | 端口 | 适合场景 |
|------|------|-----------|------|------|----------|
| Vanilla JS | - | ❌ | ⭐ | 5173 | 快速上手 |
| Vue 3 | Vue | ❌ | ⭐⭐ | 5174 | Vue 项目 |
| React | React | ✅ | ⭐⭐ | 3001 | React 项目 |
| TypeScript | - | ✅ | ⭐⭐⭐ | 3002 | 类型安全 |
| Complete App | Vue | ✅ | ⭐⭐⭐ | 3003 | 实战参考 |
| Playground | - | ❌ | ⭐ | 3004 | 快速测试 |

## 🎯 学习路径

### 路径 1: 快速上手
1. **Vanilla JS** - 了解基础 API
2. **Playground** - 交互式实验
3. **Vue 3** 或 **React** - 框架集成

### 路径 2: 深入学习
1. **TypeScript** - 类型系统
2. **Complete App** - 最佳实践
3. **自己的项目** - 实际应用

### 路径 3: 框架专项
#### Vue 开发者
1. **Vue 3** - 基础集成
2. **Complete App** - 完整应用
3. **文档** - API 参考

#### React 开发者
1. **React** - 基础集成
2. **TypeScript** - 类型安全
3. **文档** - API 参考

## 💡 提示和技巧

### 开发调试

所有示例都支持热重载，修改代码后自动刷新。

### 端口冲突

如果端口被占用，可以修改 `vite.config.ts` 或 `vite.config.js` 中的端口配置：

```ts
export default defineConfig({
  server: {
    port: 3005 // 修改为其他端口
  }
})
```

### TypeScript 支持

React、TypeScript 和 Complete App 示例都包含完整的类型定义，可以获得最佳的开发体验。

### 自定义示例

你可以基于现有示例创建自己的版本：

1. 复制一个示例目录
2. 修改 `package.json` 中的名称
3. 根据需求调整代码
4. 运行 `pnpm install` 和 `pnpm dev`

## 🔗 相关链接

- [API 文档](../api/)
- [使用指南](../guide/)
- [最佳实践](./best-practices.md)
- [常见问题](./faq.md)

## 🤝 贡献示例

欢迎贡献新的示例！请确保：

- 代码清晰易懂
- 包含完整的 README
- 遵循项目规范
- 提供使用说明

提交 PR 前请先阅读 [贡献指南](../../CONTRIBUTING.md)。

