# 🚀 快速开始指南

5 分钟快速上手 @ldesign/device！

## 📦 第一步：安装

```bash
pnpm add @ldesign/device
```

## 🎯 第二步：基础使用

### Vanilla JavaScript

```javascript
import { DeviceDetector } from '@ldesign/device'

const detector = new DeviceDetector()
const info = detector.getDeviceInfo()

console.log('设备类型:', info.type)  // 'mobile' | 'tablet' | 'desktop'
```

### Vue 3

```vue
<script setup>
import { useDevice } from '@ldesign/device/vue'

const { isMobile, isTablet, isDesktop } = useDevice()
</script>

<template>
  <div v-if="isMobile">移动端布局</div>
  <div v-else-if="isTablet">平板布局</div>
  <div v-else>桌面布局</div>
</template>
```

### React

```tsx
import { useState, useEffect } from 'react'
import { DeviceDetector } from '@ldesign/device'

function App() {
  const [device, setDevice] = useState(null)
  
  useEffect(() => {
    const detector = new DeviceDetector()
    setDevice(detector.getDeviceInfo())
  }, [])
  
  return <div>{device?.type}</div>
}
```

## 🎮 第三步：查看示例

```bash
# 克隆仓库
git clone https://github.com/ldesign/device.git
cd device/packages/device

# 运行 Playground
cd examples/playground
pnpm install
pnpm dev
```

访问 http://localhost:3004 体验交互式演示！

## 📚 第四步：深入学习

- 📖 [完整文档](./docs/)
- ⚛️ [React 示例](./examples/react-example/)
- 🛒 [完整应用](./examples/complete-app/)
- 💡 [API 参考](./docs/api/)

## 💡 常用 API

```typescript
// 检测设备类型
detector.isMobile()    // 是否移动设备
detector.isTablet()    // 是否平板
detector.isDesktop()   // 是否桌面

// 监听变化
detector.on('deviceChange', (info) => {
  console.log('设备变化:', info.type)
})

// 获取完整信息
const info = detector.getDeviceInfo()
// {
//   type: 'mobile',
//   orientation: 'portrait',
//   width: 375,
//   height: 812,
//   ...
// }
```

## 🎉 完成！

现在你已经掌握了基础用法，可以开始构建响应式应用了！

需要帮助？查看：
- [完整文档](./docs/)
- [示例项目](./examples/)
- [常见问题](./docs/guide/faq.md)
- [GitHub Issues](https://github.com/ldesign/device/issues)

