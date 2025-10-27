# @ldesign/device React 示例

这是一个完整的 React 应用示例，展示了如何在 React 中使用 `@ldesign/device` 库。

## 功能展示

- ✅ 设备信息检测和显示
- ✅ 电池状态监控
- ✅ 网络状态监控
- ✅ 地理位置获取
- ✅ 响应式布局
- ✅ TypeScript 类型支持

## 运行示例

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── DeviceInfoCard.tsx    # 设备信息卡片
│   ├── BatteryStatus.tsx     # 电池状态
│   ├── NetworkStatus.tsx     # 网络状态
│   ├── GeolocationInfo.tsx   # 地理位置
│   ├── ResponsiveLayout.tsx  # 响应式布局
│   ├── Card.css             # 卡片样式
│   └── ResponsiveLayout.css # 布局样式
├── App.tsx              # 主应用组件
├── App.css              # 应用样式
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 核心特性

### 1. 使用 Hooks 管理状态

```tsx
const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
const [detector] = useState(() => new DeviceDetector())

useEffect(() => {
  setDeviceInfo(detector.getDeviceInfo())
  
  detector.on('deviceChange', handleDeviceChange)
  
  return () => {
    detector.off('deviceChange', handleDeviceChange)
    detector.destroy()
  }
}, [detector])
```

### 2. 模块化组件设计

每个功能都封装成独立的组件：
- `DeviceInfoCard` - 设备基本信息
- `BatteryStatus` - 电池状态（使用 Battery API）
- `NetworkStatus` - 网络状态（使用 Network Information API）
- `GeolocationInfo` - 地理位置（使用 Geolocation API）

### 3. 响应式布局

根据设备类型自动调整布局：
- 移动设备：单列布局
- 平板设备：双列布局
- 桌面设备：双列或多列布局

### 4. TypeScript 支持

完整的类型定义，获得最佳的开发体验：

```tsx
import type { DeviceInfo, BatteryStatus, NetworkStatus } from '@ldesign/device'
```

## 学习要点

1. **React Hooks 集成** - 如何在 React 中使用设备检测
2. **生命周期管理** - 正确初始化和清理资源
3. **事件监听** - 监听设备变化并更新 UI
4. **错误处理** - 优雅地处理 API 不支持等情况
5. **响应式设计** - 根据设备类型适配界面

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT


