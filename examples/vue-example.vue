<template>
  <div class="device-example">
    <header class="header">
      <h1>🔍 Vue 设备检测示例</h1>
      <p>这个示例展示了如何在 Vue 3 项目中使用 @ldesign/device</p>
    </header>

    <!-- 设备信息卡片 -->
    <section class="section">
      <h2>📱 设备信息</h2>
      <DeviceInfo :detailed="true" class="device-info-card" />
    </section>

    <!-- 响应式组件演示 -->
    <section class="section">
      <h2>🎨 响应式组件演示</h2>
      <div class="responsive-grid">
        <div v-if="isMobile" class="demo-card mobile">
          <h3>📱 移动端视图</h3>
          <p>当前是移动设备，显示简化的单列布局</p>
          <ul>
            <li>单列布局</li>
            <li>大号触摸按钮</li>
            <li>简化导航</li>
          </ul>
        </div>
        
        <div v-else-if="isTablet" class="demo-card tablet">
          <h3>📱 平板视图</h3>
          <p>当前是平板设备，显示适中的双列布局</p>
          <ul>
            <li>双列布局</li>
            <li>中等尺寸按钮</li>
            <li>侧边导航</li>
          </ul>
        </div>
        
        <div v-else class="demo-card desktop">
          <h3>💻 桌面视图</h3>
          <p>当前是桌面设备，显示完整的多列布局</p>
          <ul>
            <li>多列布局</li>
            <li>精确点击按钮</li>
            <li>完整导航栏</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 方向检测演示 -->
    <section class="section">
      <h2>🔄 屏幕方向检测</h2>
      <div class="orientation-demo" :class="orientationClass">
        <div class="orientation-indicator">
          <span class="icon">{{ orientationIcon }}</span>
          <span class="text">{{ orientationText }}</span>
        </div>
        <p>旋转设备或调整窗口大小来查看方向变化</p>
      </div>
    </section>

    <!-- 断点检测演示 -->
    <section class="section">
      <h2>📏 断点检测演示</h2>
      <div class="breakpoints-demo">
        <div class="breakpoint-item" :class="{ active: breakpoints.isMobile }">
          <span class="indicator"></span>
          <span>Mobile (< 768px)</span>
        </div>
        <div class="breakpoint-item" :class="{ active: breakpoints.isTablet }">
          <span class="indicator"></span>
          <span>Tablet (768px - 1023px)</span>
        </div>
        <div class="breakpoint-item" :class="{ active: breakpoints.isDesktop }">
          <span class="indicator"></span>
          <span>Desktop (≥ 1024px)</span>
        </div>
        <div class="breakpoint-item" :class="{ active: breakpoints.isRetina }">
          <span class="indicator"></span>
          <span>Retina Display</span>
        </div>
        <div class="breakpoint-item" :class="{ active: breakpoints.isDarkMode }">
          <span class="indicator"></span>
          <span>Dark Mode</span>
        </div>
      </div>
    </section>

    <!-- 媒体查询演示 -->
    <section class="section">
      <h2>🎯 自定义媒体查询</h2>
      <div class="media-queries">
        <div v-for="(matches, query) in customQueries" :key="query" class="query-item">
          <span class="query-name">{{ query }}:</span>
          <span class="query-result" :class="{ active: matches }">
            {{ matches ? '✅ 匹配' : '❌ 不匹配' }}
          </span>
        </div>
      </div>
    </section>

    <!-- 性能优化演示 -->
    <section class="section">
      <h2>⚡ 性能优化演示</h2>
      <div class="performance-demo">
        <div class="optimization-item">
          <h4>动画优化</h4>
          <p>移动设备: {{ isMobile ? '禁用复杂动画' : '启用完整动画' }}</p>
          <div class="animation-demo" :class="{ 'reduced-motion': isMobile }">
            <div class="animated-box"></div>
          </div>
        </div>
        
        <div class="optimization-item">
          <h4>图片优化</h4>
          <p>当前加载: {{ imageSize }} 尺寸图片</p>
          <img :src="optimizedImageUrl" alt="响应式图片" class="responsive-image" />
        </div>
        
        <div class="optimization-item">
          <h4>触摸优化</h4>
          <p>触摸设备: {{ isTouchDevice ? '启用触摸优化' : '使用鼠标优化' }}</p>
          <button class="touch-button" :class="{ 'touch-optimized': isTouchDevice }">
            {{ isTouchDevice ? '大号触摸按钮' : '精确点击按钮' }}
          </button>
        </div>
      </div>
    </section>

    <!-- 实时监听演示 -->
    <section class="section">
      <h2>📊 实时监听日志</h2>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" class="log-entry">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      <button @click="clearLogs" class="clear-button">清空日志</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { 
  useDevice, 
  useBreakpoints, 
  useCustomMediaQuery,
  useDeviceChange,
  DeviceInfo 
} from '@ldesign/device'

// 设备检测
const {
  deviceInfo,
  isMobile,
  isTablet,
  isDesktop,
  isPortrait,
  isLandscape,
  isTouchDevice
} = useDevice()

// 断点检测
const breakpoints = useBreakpoints()

// 自定义媒体查询
const customQueries = useCustomMediaQuery({
  'small-height': '(max-height: 600px)',
  'large-screen': '(min-width: 1440px)',
  'high-dpi': '(-webkit-min-device-pixel-ratio: 2)',
  'landscape-phone': '(max-width: 767px) and (orientation: landscape)'
})

// 日志系统
const logs = ref<Array<{ time: string; message: string }>>([])

const addLog = (message: string) => {
  logs.value.push({
    time: new Date().toLocaleTimeString(),
    message
  })
  
  // 限制日志数量
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(-50)
  }
}

const clearLogs = () => {
  logs.value = []
  addLog('日志已清空')
}

// 监听设备变化
useDeviceChange((event) => {
  addLog(`设备变化: ${event.changes.join(', ')}`)
  addLog(`新设备类型: ${event.current.type} (${event.current.width}×${event.current.height})`)
})

// 计算属性
const orientationClass = computed(() => ({
  'orientation-portrait': isPortrait.value,
  'orientation-landscape': isLandscape.value
}))

const orientationIcon = computed(() => {
  return isPortrait.value ? '📱' : '📱'
})

const orientationText = computed(() => {
  return isPortrait.value ? '竖屏模式' : '横屏模式'
})

const imageSize = computed(() => {
  if (isMobile.value) return 'small'
  if (isTablet.value) return 'medium'
  return 'large'
})

const optimizedImageUrl = computed(() => {
  const baseUrl = 'https://picsum.photos'
  if (isMobile.value) return `${baseUrl}/300/200`
  if (isTablet.value) return `${baseUrl}/500/300`
  return `${baseUrl}/800/400`
})

// 生命周期
onMounted(() => {
  addLog('Vue 设备检测示例初始化完成')
  addLog(`检测到设备: ${deviceInfo.value.type}`)
})
</script>

<style lang="less" scoped>
.device-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    color: #1890ff;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 16px;
  }
}

.section {
  margin-bottom: 40px;
  
  h2 {
    color: #333;
    border-bottom: 2px solid #1890ff;
    padding-bottom: 8px;
    margin-bottom: 20px;
  }
}

.device-info-card {
  margin-bottom: 20px;
}

.responsive-grid {
  display: grid;
  gap: 20px;
}

.demo-card {
  padding: 20px;
  border-radius: 12px;
  color: white;
  
  &.mobile {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  }
  
  &.tablet {
    background: linear-gradient(135deg, #ffa726, #ff9800);
  }
  
  &.desktop {
    background: linear-gradient(135deg, #66bb6a, #4caf50);
  }
  
  h3 {
    margin-top: 0;
  }
  
  ul {
    margin: 15px 0;
    padding-left: 20px;
  }
}

.orientation-demo {
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  
  &.orientation-portrait {
    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  }
  
  &.orientation-landscape {
    background: linear-gradient(135deg, #f3e5f5, #e1bee7);
  }
}

.orientation-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  
  .icon {
    font-size: 24px;
  }
}

.breakpoints-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.breakpoint-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: #f5f5f5;
  transition: all 0.3s ease;
  
  &.active {
    background: #e6f7ff;
    border-left: 4px solid #1890ff;
  }
  
  .indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #d9d9d9;
    transition: background 0.3s ease;
  }
  
  &.active .indicator {
    background: #52c41a;
  }
}

.media-queries {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.query-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  
  .query-name {
    font-weight: 600;
    color: #333;
  }
  
  .query-result {
    font-weight: 500;
    
    &.active {
      color: #52c41a;
    }
  }
}

.performance-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.optimization-item {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  
  h4 {
    margin-top: 0;
    color: #1890ff;
  }
}

.animation-demo {
  height: 60px;
  background: #f0f0f0;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  
  .animated-box {
    width: 40px;
    height: 40px;
    background: #1890ff;
    border-radius: 6px;
    position: absolute;
    top: 10px;
    left: 10px;
    animation: slide 2s infinite ease-in-out;
  }
  
  &.reduced-motion .animated-box {
    animation: none;
    background: #999;
  }
}

@keyframes slide {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(calc(100% + 20px)); }
}

.responsive-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 6px;
  margin-top: 10px;
}

.touch-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background: #1890ff;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.touch-optimized {
    padding: 16px 32px;
    font-size: 16px;
  }
  
  &:hover {
    background: #40a9ff;
  }
}

.log-container {
  background: #1f1f1f;
  color: #00ff00;
  padding: 15px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
}

.log-entry {
  display: block;
  margin-bottom: 5px;
  
  .log-time {
    color: #888;
    margin-right: 10px;
  }
}

.clear-button {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #ff7875;
  }
}

// 响应式样式
@media (max-width: 767px) {
  .device-example {
    padding: 15px;
  }
  
  .performance-demo,
  .breakpoints-demo,
  .media-queries {
    grid-template-columns: 1fr;
  }
}
</style>
