# @ldesign/device Playground

交互式演示和测试平台，让你可以实时测试和体验 `@ldesign/device` 的所有功能。

## 🎯 特性

- ✅ 实时代码编辑器
- ✅ 即时运行和输出
- ✅ 设备信息可视化
- ✅ 多个预设示例
- ✅ 快速测试按钮
- ✅ 交互式控制台
- ✅ 键盘快捷键支持

## 🚀 使用方法

### 本地运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview
```

### 在线体验

访问在线版本：[https://device-playground.ldesign.dev](https://device-playground.ldesign.dev)

## 💡 功能说明

### 代码编辑器

左侧是代码编辑器，你可以：
- 选择预设的示例代码
- 编写自定义代码
- 使用 `Ctrl/Cmd + Enter` 快速运行
- 使用 `Tab` 键进行缩进

### 输出面板

右侧分为两部分：

1. **设备可视化**
   - 实时显示当前设备类型
   - 显示关键设备信息
   - 图标化展示设备状态

2. **控制台**
   - 显示代码运行结果
   - 支持 log/error/warn 不同类型
   - 带时间戳的输出
   - 可清空历史记录

### 快速测试

底部提供了常用功能的快速测试按钮：

- **检测设备** - 获取当前设备信息
- **模拟窗口变化** - 监听窗口大小变化
- **测试方向** - 监听屏幕方向变化
- **性能测试** - 测试库的性能表现
- **电池状态** - 获取电池信息（需浏览器支持）
- **网络状态** - 获取网络信息（需浏览器支持）

## 📝 示例代码

### 基础检测

```javascript
const detector = new DeviceDetector()
const info = detector.getDeviceInfo()

console.log('设备类型:', info.type)
console.log('屏幕方向:', info.orientation)
```

### 事件监听

```javascript
const detector = new DeviceDetector({
  enableResize: true,
  enableOrientation: true
})

detector.on('deviceChange', (info) => {
  console.log('设备变化:', info.type)
})
```

### 模块功能

```javascript
const battery = new BatteryModule()
await battery.initialize()
const status = battery.getBatteryStatus()

console.log('电池电量:', Math.round(status.level * 100) + '%')
```

## ⌨️ 键盘快捷键

- `Ctrl/Cmd + Enter` - 运行代码
- `Tab` - 插入缩进
- `Ctrl/Cmd + /` - 注释/取消注释（计划中）

## 🎨 自定义

Playground 采用深色主题，灵感来自 VS Code。你可以：

- 修改 `style.css` 调整主题颜色
- 在 `main.js` 中添加更多预设示例
- 扩展快速测试功能

## 🔧 技术栈

- 原生 JavaScript
- Vite（构建工具）
- CSS3（样式）
- @ldesign/device（核心库）

## 📱 响应式支持

Playground 完全响应式，支持：
- 桌面浏览器（最佳体验）
- 平板设备
- 移动设备

在移动设备上，编辑器和输出面板会垂直排列。

## 🐛 反馈

如果你发现任何问题或有功能建议，欢迎：
- 提交 Issue
- 发起 Pull Request
- 联系我们

## 许可证

MIT


