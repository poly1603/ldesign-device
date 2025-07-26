---
layout: home

hero:
  name: "@ldesign/device"
  text: "设备信息检测库"
  tagline: 🔍 功能强大的设备信息检测库，让你的应用智能适配各种设备！
  image:
    src: /logo.svg
    alt: LDesign Device
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看示例
      link: /examples/
    - theme: alt
      text: GitHub
      link: https://github.com/poly1603/ldesign-device

features:
  - icon: 🎯
    title: 精准检测
    details: 智能识别设备类型（desktop/tablet/mobile），结合屏幕尺寸和用户代理的双重检测算法
  
  - icon: 🔄
    title: 实时监听
    details: 响应式监听屏幕方向和尺寸变化，防抖优化的事件监听，性能卓越
  
  - icon: 🚀
    title: 性能优化
    details: 核心功能立即可用，扩展信息按需加载，避免不必要的性能开销
  
  - icon: 💪
    title: TypeScript
    details: 完整的类型定义和类型安全，提供极佳的开发体验和智能提示
  
  - icon: 🎨
    title: Vue3 集成
    details: 提供完整的 Composition API、组件、指令和插件，深度集成 Vue 生态
  
  - icon: 📱
    title: 响应式设计
    details: 完美支持各种屏幕尺寸和设备，助力构建优秀的响应式应用
  
  - icon: 🔧
    title: 高度可配置
    details: 灵活的配置选项和检测阈值，满足各种复杂的业务需求
  
  - icon: 🧪
    title: 测试覆盖
    details: 完整的单元测试保证代码质量，覆盖各种设备环境和边界情况
---

## 🚀 快速体验

```bash
# 安装
pnpm add @ldesign/device

# 使用
import { getDeviceInfo } from '@ldesign/device'

const deviceInfo = getDeviceInfo()
console.log(deviceInfo.type) // 'desktop' | 'tablet' | 'mobile'
```

## 🎯 核心特性

### 设备类型检测
智能识别桌面、平板、移动设备，支持自定义检测阈值

### 屏幕方向检测  
实时检测竖屏/横屏状态，响应设备旋转变化

### Vue3 深度集成
提供 Composition API、组件、指令等完整解决方案

### 框架扩展性
预留适配器接口，支持未来扩展到 Vue2、React 等框架

## 🌟 使用场景

- **📱 响应式布局** - 根据设备类型调整界面布局
- **🖼️ 资源优化** - 按设备类型加载不同尺寸的图片  
- **⚡ 性能优化** - 移动设备禁用复杂动画
- **🎯 用户体验** - 触摸设备启用触摸优化

## 📖 文档导航

<div class="doc-nav">
  <a href="/guide/" class="nav-item">
    <h3>📚 使用指南</h3>
    <p>从安装到高级用法的完整指南</p>
  </a>
  
  <a href="/api/" class="nav-item">
    <h3>🔧 API 文档</h3>
    <p>详细的 API 参考和类型定义</p>
  </a>
  
  <a href="/examples/" class="nav-item">
    <h3>💡 示例代码</h3>
    <p>丰富的使用示例和最佳实践</p>
  </a>
  
  <a href="/playground/" class="nav-item">
    <h3>🎮 在线演示</h3>
    <p>交互式演示和实时效果展示</p>
  </a>
</div>

<style>
.doc-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 40px 0;
}

.nav-item {
  display: block;
  padding: 20px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.nav-item h3 {
  margin: 0 0 8px 0;
  color: var(--vp-c-text-1);
}

.nav-item p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
</style>
