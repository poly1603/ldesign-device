# API 概览

@ldesign/device 提供了丰富的 API 来满足各种设备检测需求。

## 📦 模块结构

```
@ldesign/device
├── 核心 API
│   ├── getDeviceInfo()          # 获取设备信息
│   ├── onDeviceChange()         # 监听设备变化
│   ├── createDeviceDetector()   # 创建检测器实例
│   └── getExtendedDeviceInfo()  # 获取扩展信息
├── Vue3 集成
│   ├── useDevice()              # 设备检测 Hook
│   ├── useDeviceType()          # 设备类型 Hook
│   ├── useOrientation()         # 屏幕方向 Hook
│   ├── useBreakpoints()         # 断点检测 Hook
│   ├── DeviceProvider          # 上下文提供者
│   └── 指令系统                 # v-mobile, v-desktop 等
├── 工具函数
│   ├── detectDeviceType()       # 设备类型检测
│   ├── detectOrientation()      # 方向检测
│   ├── getScreenSize()          # 屏幕尺寸
│   └── isTouchDevice()          # 触摸检测
└── 类型定义
    ├── DeviceInfo               # 设备信息接口
    ├── DeviceType               # 设备类型枚举
    └── Orientation              # 方向枚举
```

## 🎯 核心 API

### getDeviceInfo()

获取当前设备信息的快捷函数。

```typescript
function getDeviceInfo(config?: DeviceDetectionConfig): DeviceInfo
```

**参数：**
- `config?` - 可选的检测配置

**返回值：**
- `DeviceInfo` - 设备信息对象

**示例：**
```typescript
import { getDeviceInfo } from '@ldesign/device'

const deviceInfo = getDeviceInfo()
console.log(deviceInfo.type) // 'mobile' | 'tablet' | 'desktop'
```

### onDeviceChange()

监听设备信息变化的快捷函数。

```typescript
function onDeviceChange(
  callback: (event: DeviceChangeEvent) => void,
  config?: DeviceDetectionConfig
): () => void
```

**参数：**
- `callback` - 变化回调函数
- `config?` - 可选的检测配置

**返回值：**
- `() => void` - 取消监听的函数

**示例：**
```typescript
import { onDeviceChange } from '@ldesign/device'

const unsubscribe = onDeviceChange((event) => {
  console.log('设备变化:', event.changes)
})

// 取消监听
unsubscribe()
```

### createDeviceDetector()

创建设备检测器实例，提供更多控制能力。

```typescript
function createDeviceDetector(config?: DeviceDetectionConfig): DeviceDetector
```

**参数：**
- `config?` - 可选的检测配置

**返回值：**
- `DeviceDetector` - 检测器实例

**示例：**
```typescript
import { createDeviceDetector } from '@ldesign/device'

const detector = createDeviceDetector({
  tabletMinWidth: 600,
  desktopMinWidth: 1200
})

const deviceInfo = detector.getDeviceInfo()
const unsubscribe = detector.onDeviceChange(callback)

// 记得销毁
detector.destroy()
```

## 🎨 Vue3 API

### useDevice()

主要的设备检测 Composition API。

```typescript
function useDevice(options?: ReactiveDeviceOptions): {
  deviceInfo: Ref<DeviceInfo>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  isMobile: ComputedRef<boolean>
  isTablet: ComputedRef<boolean>
  isDesktop: ComputedRef<boolean>
  isPortrait: ComputedRef<boolean>
  isLandscape: ComputedRef<boolean>
  isTouchDevice: ComputedRef<boolean>
  refresh: () => void
}
```

**参数：**
- `options?` - 可选的响应式选项

**返回值：**
- 包含设备信息和状态的响应式对象

**示例：**
```typescript
import { useDevice } from '@ldesign/device'

const {
  deviceInfo,
  isMobile,
  isTablet,
  isDesktop
} = useDevice()
```

### useDeviceType()

专门用于设备类型检测的 Hook。

```typescript
function useDeviceType(config?: DeviceDetectionConfig): {
  deviceType: ComputedRef<DeviceType>
  isMobile: ComputedRef<boolean>
  isTablet: ComputedRef<boolean>
  isDesktop: ComputedRef<boolean>
}
```

### useOrientation()

专门用于屏幕方向检测的 Hook。

```typescript
function useOrientation(config?: DeviceDetectionConfig): {
  orientation: ComputedRef<Orientation>
  isPortrait: ComputedRef<boolean>
  isLandscape: ComputedRef<boolean>
}
```

### useBreakpoints()

响应式断点检测 Hook。

```typescript
function useBreakpoints(): {
  isMobile: Ref<boolean>
  isTablet: Ref<boolean>
  isDesktop: Ref<boolean>
  isPortrait: Ref<boolean>
  isLandscape: Ref<boolean>
  isRetina: Ref<boolean>
  isDarkMode: Ref<boolean>
  activeBreakpoint: ComputedRef<string>
}
```

## 🔧 工具函数

### detectDeviceType()

检测设备类型的核心函数。

```typescript
function detectDeviceType(
  width: number,
  height: number,
  userAgent: string,
  config?: DeviceDetectionConfig
): DeviceType
```

### getScreenSize()

获取当前屏幕尺寸。

```typescript
function getScreenSize(): { width: number; height: number }
```

### isTouchDevice()

检测是否为触摸设备。

```typescript
function isTouchDevice(): boolean
```

## 📝 类型定义

### DeviceInfo

设备信息接口。

```typescript
interface DeviceInfo {
  type: DeviceType                // 设备类型
  orientation: Orientation        // 屏幕方向
  width: number                   // 屏幕宽度
  height: number                  // 屏幕高度
  pixelRatio: number             // 设备像素比
  isTouchDevice: boolean         // 是否触摸设备
  userAgent: string              // 用户代理字符串
}
```

### DeviceType

设备类型枚举。

```typescript
enum DeviceType {
  DESKTOP = 'desktop',  // 桌面设备
  TABLET = 'tablet',    // 平板设备
  MOBILE = 'mobile'     // 移动设备
}
```

### Orientation

屏幕方向枚举。

```typescript
enum Orientation {
  PORTRAIT = 'portrait',    // 竖屏
  LANDSCAPE = 'landscape'   // 横屏
}
```

### DeviceDetectionConfig

设备检测配置接口。

```typescript
interface DeviceDetectionConfig {
  tabletMinWidth?: number              // 平板最小宽度 (默认: 768)
  desktopMinWidth?: number             // 桌面最小宽度 (默认: 1024)
  enableUserAgentDetection?: boolean   // 启用UA检测 (默认: true)
  enableTouchDetection?: boolean       // 启用触摸检测 (默认: true)
}
```

## 🎮 指令 API

### v-device

根据设备类型条件渲染。

```vue
<!-- 单个设备类型 -->
<div v-device="'mobile'">移动端内容</div>

<!-- 多个设备类型 -->
<div v-device="['tablet', 'desktop']">平板或桌面内容</div>
```

### v-mobile / v-tablet / v-desktop

设备类型专用指令。

```vue
<div v-mobile>仅移动端显示</div>
<div v-tablet>仅平板显示</div>
<div v-desktop>仅桌面显示</div>

<!-- 支持取反 -->
<div v-mobile.not>非移动端显示</div>
```

### v-portrait / v-landscape

屏幕方向指令。

```vue
<div v-portrait>竖屏内容</div>
<div v-landscape>横屏内容</div>
```

### v-touch

触摸设备指令。

```vue
<div v-touch>触摸设备专用内容</div>
<div v-touch.not>非触摸设备内容</div>
```

## 📚 更多文档

- [设备检测器详细文档](/api/device-detector)
- [Vue Composition API 详细文档](/api/vue-composition)
- [指令系统详细文档](/api/vue-directives)
- [类型定义完整参考](/api/interfaces)
