# 示例代码

这里提供了丰富的示例代码，帮助你快速上手 @ldesign/device 的各种功能。

## 🚀 基础示例

### 设备信息检测

<div class="example-container">

```typescript
import { getDeviceInfo, onDeviceChange } from '@ldesign/device'

// 获取当前设备信息
const deviceInfo = getDeviceInfo()
console.log('设备类型:', deviceInfo.type)
console.log('屏幕方向:', deviceInfo.orientation)
console.log('屏幕尺寸:', `${deviceInfo.width}x${deviceInfo.height}`)

// 监听设备变化
const unsubscribe = onDeviceChange((event) => {
  console.log('设备信息变化:', event.changes)
  
  if (event.changes.includes('type')) {
    console.log('设备类型变化:', event.current.type)
  }
  
  if (event.changes.includes('orientation')) {
    console.log('屏幕方向变化:', event.current.orientation)
  }
})

// 记得取消监听
// unsubscribe()
```

</div>

### 响应式布局

<div class="example-container">

```vue
<template>
  <div class="responsive-layout" :class="layoutClass">
    <header class="header">
      <h1>{{ title }}</h1>
      <nav v-if="!isMobile" class="desktop-nav">
        <a href="#home">首页</a>
        <a href="#about">关于</a>
        <a href="#contact">联系</a>
      </nav>
      <button v-else class="mobile-menu-btn" @click="toggleMenu">
        ☰
      </button>
    </header>
    
    <main class="main">
      <div class="content-grid">
        <article 
          v-for="item in items" 
          :key="item.id"
          class="content-item"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </main>
    
    <aside v-if="!isMobile" class="sidebar">
      <h3>侧边栏</h3>
      <p>桌面端专用侧边栏内容</p>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDevice } from '@ldesign/device'

const { deviceInfo, isMobile, isTablet, isDesktop } = useDevice()

const title = computed(() => {
  if (isMobile.value) return '移动版'
  if (isTablet.value) return '平板版'
  return '桌面版'
})

const layoutClass = computed(() => ({
  'layout-mobile': isMobile.value,
  'layout-tablet': isTablet.value,
  'layout-desktop': isDesktop.value
}))

const items = ref([
  { id: 1, title: '文章1', description: '这是第一篇文章的描述' },
  { id: 2, title: '文章2', description: '这是第二篇文章的描述' },
  { id: 3, title: '文章3', description: '这是第三篇文章的描述' }
])

const showMobileMenu = ref(false)
const toggleMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>

<style scoped>
.responsive-layout {
  min-height: 100vh;
  display: grid;
}

/* 桌面布局 */
.layout-desktop {
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "header header"
    "main sidebar";
}

/* 平板布局 */
.layout-tablet {
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "header"
    "main";
}

/* 移动布局 */
.layout-mobile {
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "header"
    "main";
}

.header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f5f5f5;
}

.main {
  grid-area: main;
  padding: 1rem;
}

.sidebar {
  grid-area: sidebar;
  padding: 1rem;
  background: #fafafa;
}

.content-grid {
  display: grid;
  gap: 1rem;
}

/* 响应式网格 */
.layout-desktop .content-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.layout-tablet .content-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.layout-mobile .content-grid {
  grid-template-columns: 1fr;
}

.content-item {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.desktop-nav a {
  margin-left: 1rem;
  text-decoration: none;
  color: #333;
}

.mobile-menu-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
```

</div>

## 🎨 Vue 指令示例

### 条件渲染

<div class="example-container">

```vue
<template>
  <div class="directive-examples">
    <!-- 设备类型指令 -->
    <div v-mobile class="mobile-only">
      📱 这个内容只在移动设备显示
    </div>
    
    <div v-tablet class="tablet-only">
      📱 这个内容只在平板设备显示
    </div>
    
    <div v-desktop class="desktop-only">
      💻 这个内容只在桌面设备显示
    </div>
    
    <!-- 取反指令 -->
    <div v-mobile.not class="not-mobile">
      🚫 这个内容在非移动设备显示
    </div>
    
    <!-- 方向指令 -->
    <div v-portrait class="portrait-only">
      📱 竖屏专用内容
    </div>
    
    <div v-landscape class="landscape-only">
      📱 横屏专用内容
    </div>
    
    <!-- 触摸设备指令 -->
    <div v-touch class="touch-only">
      👆 触摸设备专用交互
    </div>
    
    <!-- 组合指令 -->
    <div v-device="'mobile'" class="specific-device">
      指定移动设备显示
    </div>
    
    <div v-device="['tablet', 'desktop']" class="multiple-devices">
      平板或桌面设备显示
    </div>
  </div>
</template>

<style scoped>
.directive-examples > div {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.mobile-only {
  background: #ffe6e6;
  border: 2px solid #ff9999;
}

.tablet-only {
  background: #fff3e6;
  border: 2px solid #ffcc99;
}

.desktop-only {
  background: #e6ffe6;
  border: 2px solid #99ff99;
}

.not-mobile {
  background: #e6f3ff;
  border: 2px solid #99ccff;
}

.portrait-only {
  background: #f0e6ff;
  border: 2px solid #cc99ff;
}

.landscape-only {
  background: #ffe6f0;
  border: 2px solid #ff99cc;
}

.touch-only {
  background: #f5f5e6;
  border: 2px solid #cccc99;
}
</style>
```

</div>

## 🖼️ 图片优化示例

### 响应式图片加载

<div class="example-container">

```vue
<template>
  <div class="image-optimization">
    <h3>响应式图片示例</h3>
    
    <!-- 基础响应式图片 -->
    <ResponsiveImage
      src="/images/hero"
      alt="响应式图片示例"
      class="hero-image"
    />
    
    <!-- 带加载状态的图片 -->
    <LazyImage
      src="/images/gallery/photo1"
      alt="懒加载图片"
      :loading="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useDevice } from '@ldesign/device'

// 响应式图片组件
const ResponsiveImage = defineComponent({
  props: {
    src: String,
    alt: String
  },
  setup(props) {
    const { isMobile, isTablet, deviceInfo } = useDevice()
    
    const optimizedSrc = computed(() => {
      const { src } = props
      const isHighDPI = deviceInfo.value.pixelRatio > 1
      
      // 移动设备
      if (isMobile.value) {
        const size = isHighDPI ? '@2x-mobile' : '-mobile'
        return `${src}${size}.jpg`
      }
      
      // 平板设备
      if (isTablet.value) {
        const size = isHighDPI ? '@2x-tablet' : '-tablet'
        return `${src}${size}.jpg`
      }
      
      // 桌面设备
      const size = isHighDPI ? '@2x' : ''
      return `${src}${size}.jpg`
    })
    
    return () => h('img', {
      src: optimizedSrc.value,
      alt: props.alt,
      loading: 'lazy'
    })
  }
})

// 懒加载图片组件
const LazyImage = defineComponent({
  props: {
    src: String,
    alt: String,
    loading: Boolean
  },
  setup(props) {
    const { isMobile } = useDevice()
    const imageRef = ref<HTMLImageElement>()
    const isLoaded = ref(false)
    const isInView = ref(false)
    
    const imageSrc = computed(() => {
      if (!isInView.value) return ''
      
      const { src } = props
      return isMobile.value ? `${src}-mobile.jpg` : `${src}.jpg`
    })
    
    onMounted(() => {
      if (!imageRef.value) return
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            isInView.value = true
            observer.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      
      observer.observe(imageRef.value)
    })
    
    return () => h('div', {
      ref: imageRef,
      class: 'lazy-image-container'
    }, [
      props.loading && !isLoaded.value && h('div', {
        class: 'loading-placeholder'
      }, '加载中...'),
      
      imageSrc.value && h('img', {
        src: imageSrc.value,
        alt: props.alt,
        onLoad: () => { isLoaded.value = true }
      })
    ])
  }
})
</script>

<style scoped>
.image-optimization {
  max-width: 800px;
  margin: 0 auto;
}

.hero-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.lazy-image-container {
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-placeholder {
  position: absolute;
  color: #666;
  font-size: 14px;
}
</style>
```

</div>

## ⚡ 性能优化示例

### 动画和交互优化

<div class="example-container">

```vue
<template>
  <div class="performance-optimization">
    <h3>性能优化示例</h3>
    
    <!-- 根据设备性能调整动画 -->
    <div 
      class="animated-element"
      :class="animationClass"
      @click="handleClick"
    >
      点击我看动画效果
    </div>
    
    <!-- 触摸优化按钮 -->
    <button 
      class="interactive-button"
      :class="buttonClass"
      @click="handleButtonClick"
    >
      {{ buttonText }}
    </button>
    
    <!-- 条件加载复杂组件 -->
    <Suspense v-if="shouldLoadHeavyComponent">
      <template #default>
        <HeavyComponent />
      </template>
      <template #fallback>
        <div class="loading">加载中...</div>
      </template>
    </Suspense>
    
    <div v-else class="simple-placeholder">
      简化版内容（移动设备）
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useDevice, useDeviceFeatures } from '@ldesign/device'

const { 
  isMobile, 
  isTablet, 
  isTouchDevice, 
  deviceInfo 
} = useDevice()

const { 
  hasHighDPI, 
  isSmallScreen 
} = useDeviceFeatures()

// 根据设备性能决定动画复杂度
const animationClass = computed(() => ({
  'simple-animation': isMobile.value || isSmallScreen.value,
  'complex-animation': !isMobile.value && !isSmallScreen.value,
  'high-dpi': hasHighDPI.value
}))

// 触摸优化
const buttonClass = computed(() => ({
  'touch-optimized': isTouchDevice.value,
  'mouse-optimized': !isTouchDevice.value
}))

const buttonText = computed(() => {
  return isTouchDevice.value ? '轻触按钮' : '点击按钮'
})

// 条件加载重型组件
const shouldLoadHeavyComponent = computed(() => {
  // 只在桌面设备或高性能设备上加载复杂组件
  return !isMobile.value && deviceInfo.value.pixelRatio <= 2
})

// 懒加载重型组件
const HeavyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)

const handleClick = () => {
  if (isMobile.value) {
    // 移动设备使用简单反馈
    console.log('简单点击反馈')
  } else {
    // 桌面设备可以有更复杂的交互
    console.log('复杂点击反馈')
  }
}

const handleButtonClick = () => {
  // 根据设备类型提供不同的反馈
  if (isTouchDevice.value) {
    // 触摸设备：触觉反馈
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  } else {
    // 非触摸设备：视觉反馈
    console.log('鼠标点击反馈')
  }
}
</script>

<style scoped>
.performance-optimization {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.animated-element {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 8px;
  margin: 2rem auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transition: transform 0.3s ease;
}

/* 简单动画（移动设备） */
.simple-animation:hover {
  transform: scale(1.05);
}

/* 复杂动画（桌面设备） */
.complex-animation {
  animation: float 3s ease-in-out infinite;
}

.complex-animation:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* 高分辨率优化 */
.high-dpi {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.interactive-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 触摸优化 */
.touch-optimized {
  padding: 16px 32px;
  font-size: 18px;
  min-height: 48px;
  min-width: 120px;
}

/* 鼠标优化 */
.mouse-optimized:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.simple-placeholder {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #666;
}
</style>
```

</div>

## 📱 完整应用示例

查看 [Vue 完整应用示例](/examples/vue-app) 了解如何在真实项目中集成 @ldesign/device。

## 🔗 更多示例

- [设备检测详细示例](/examples/device-detection)
- [Vue Composition API 示例](/examples/vue-composition)
- [指令系统示例](/examples/vue-directives)
- [用户体验优化示例](/examples/user-experience)

<style scoped>
.example-container {
  margin: 2rem 0;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
}

.example-container pre {
  margin: 0;
  border-radius: 0;
}
</style>
