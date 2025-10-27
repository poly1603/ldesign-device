# 响应式电商网站 - 完整应用示例

这是一个完整的响应式电商网站示例，展示了如何在实际项目中使用 `@ldesign/device` 实现完美的跨设备体验。

## 🎯 功能特点

- ✅ 完整的响应式设计
- ✅ 移动端/平板/桌面自适应布局
- ✅ 移动端侧边栏菜单
- ✅ 响应式商品网格
- ✅ 设备调试面板
- ✅ Vue 3 + TypeScript
- ✅ 现代化UI设计

## 📱 响应式特性

### 移动端（< 768px）
- 单列商品展示
- 汉堡菜单导航
- 紧凑的卡片设计
- 优化的触摸交互

### 平板（768px - 1024px）
- 双列商品展示
- 适中的间距和字体
- 优化的布局密度

### 桌面（> 1024px）
- 三列商品展示
- 侧边栏分类导航
- 宽敞的布局
- 完整的功能展示

## 🚀 运行示例

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览
pnpm preview
```

## 📂 项目结构

```
src/
├── components/
│   ├── AppHeader.vue          # 应用头部
│   ├── ProductGrid.vue        # 商品网格
│   ├── ProductCard.vue        # 商品卡片
│   ├── Sidebar.vue            # 侧边栏（桌面端）
│   ├── MobileMenu.vue         # 移动端菜单
│   └── DeviceDebugPanel.vue   # 调试面板
├── App.vue                    # 主应用
├── main.ts                    # 入口文件
└── style.css                  # 全局样式
```

## 🎨 设计亮点

### 1. 智能布局切换
根据设备类型自动调整布局：
```vue
<template>
  <div :class="['app', `device-${deviceType}`]">
    <!-- 内容会根据 deviceType 自动调整 -->
  </div>
</template>
```

### 2. 响应式网格
商品网格列数自动适配：
```typescript
const gridColumns = computed(() => {
  if (isMobile.value) return 1
  if (isTablet.value) return 2
  return 3
})
```

### 3. 条件渲染
根据设备类型显示不同组件：
```vue
<Sidebar v-if="isDesktop" />
<MobileMenu v-if="isMobile" />
```

### 4. 调试面板
内置设备信息调试面板，方便开发和测试。

## 📚 学习要点

1. **Vue 3 插件集成** - 全局安装设备检测
2. **Composition API** - 使用 `useDevice` composable
3. **响应式设计** - 移动优先的设计理念
4. **组件化开发** - 模块化的组件结构
5. **类型安全** - 完整的 TypeScript 支持
6. **用户体验** - 流畅的动画和过渡效果

## 💡 最佳实践

### 1. 插件配置
```typescript
app.use(DevicePlugin, {
  enableResize: true,
  enableOrientation: true,
  breakpoints: {
    mobile: 768,
    tablet: 1024
  }
})
```

### 2. 响应式布局
```vue
<div :class="['layout', `device-${deviceType}`]">
  <!-- 使用 CSS 类控制不同设备的样式 -->
</div>
```

### 3. 性能优化
- 使用 v-if 而不是 v-show 控制大型组件
- 合理使用计算属性缓存
- 避免不必要的重新渲染

## 🌟 扩展建议

可以基于这个示例继续添加：

- 购物车功能
- 用户登录/注册
- 商品搜索和筛选
- 订单管理
- 支付集成
- 用户评价系统

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT


