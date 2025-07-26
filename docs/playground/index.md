# 在线演示

在这里你可以实时体验 @ldesign/device 的各种功能。

<script setup>
import { ref, computed, onMounted } from 'vue'

// 模拟设备信息（在实际环境中会自动检测）
const deviceInfo = ref({
  type: 'desktop',
  orientation: 'landscape',
  width: 1920,
  height: 1080,
  pixelRatio: 1,
  isTouchDevice: false,
  userAgent: navigator.userAgent
})

const config = ref({
  tabletMinWidth: 768,
  desktopMinWidth: 1024,
  enableUserAgentDetection: true,
  enableTouchDetection: true
})

// 计算属性
const isMobile = computed(() => deviceInfo.value.type === 'mobile')
const isTablet = computed(() => deviceInfo.value.type === 'tablet')
const isDesktop = computed(() => deviceInfo.value.type === 'desktop')
const isPortrait = computed(() => deviceInfo.value.orientation === 'portrait')
const isLandscape = computed(() => deviceInfo.value.orientation === 'landscape')

// 模拟设备检测
const detectDevice = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  
  let type = 'desktop'
  if (width < config.value.tabletMinWidth) {
    type = 'mobile'
  } else if (width < config.value.desktopMinWidth) {
    type = 'tablet'
  }
  
  const orientation = width > height ? 'landscape' : 'portrait'
  
  deviceInfo.value = {
    type,
    orientation,
    width,
    height,
    pixelRatio: window.devicePixelRatio || 1,
    isTouchDevice: 'ontouchstart' in window,
    userAgent: navigator.userAgent
  }
}

// 监听窗口变化
onMounted(() => {
  detectDevice()
  window.addEventListener('resize', detectDevice)
})

// 手动设置设备类型（用于演示）
const setDeviceType = (type) => {
  deviceInfo.value.type = type
}

const setOrientation = (orientation) => {
  deviceInfo.value.orientation = orientation
}

// 日志
const logs = ref([])
const addLog = (message) => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message
  })
  if (logs.value.length > 10) {
    logs.value.pop()
  }
}

// 模拟设备变化
const simulateChange = (type) => {
  const oldType = deviceInfo.value.type
  setDeviceType(type)
  addLog(`设备类型从 ${oldType} 变更为 ${type}`)
}
</script>

## 🎮 实时设备信息

<div class="playground-container">
  <div class="device-info-panel">
    <h3>📱 当前设备信息</h3>
    <div class="info-grid">
      <div class="info-item">
        <span class="label">设备类型:</span>
        <span class="value" :class="`type-${deviceInfo.type}`">
          {{ deviceInfo.type }}
        </span>
      </div>
      <div class="info-item">
        <span class="label">屏幕方向:</span>
        <span class="value" :class="`orientation-${deviceInfo.orientation}`">
          {{ deviceInfo.orientation }}
        </span>
      </div>
      <div class="info-item">
        <span class="label">屏幕尺寸:</span>
        <span class="value">{{ deviceInfo.width }} × {{ deviceInfo.height }}</span>
      </div>
      <div class="info-item">
        <span class="label">像素比:</span>
        <span class="value">{{ deviceInfo.pixelRatio }}</span>
      </div>
      <div class="info-item">
        <span class="label">触摸设备:</span>
        <span class="value" :class="deviceInfo.isTouchDevice ? 'touch-yes' : 'touch-no'">
          {{ deviceInfo.isTouchDevice ? '是' : '否' }}
        </span>
      </div>
    </div>
  </div>

  <div class="controls-panel">
    <h3>🎛️ 模拟控制</h3>
    <div class="control-group">
      <label>设备类型:</label>
      <div class="button-group">
        <button 
          @click="simulateChange('mobile')"
          :class="{ active: isMobile }"
        >
          📱 Mobile
        </button>
        <button 
          @click="simulateChange('tablet')"
          :class="{ active: isTablet }"
        >
          📱 Tablet
        </button>
        <button 
          @click="simulateChange('desktop')"
          :class="{ active: isDesktop }"
        >
          💻 Desktop
        </button>
      </div>
    </div>
    
    <div class="control-group">
      <label>屏幕方向:</label>
      <div class="button-group">
        <button 
          @click="setOrientation('portrait')"
          :class="{ active: isPortrait }"
        >
          📱 Portrait
        </button>
        <button 
          @click="setOrientation('landscape')"
          :class="{ active: isLandscape }"
        >
          📱 Landscape
        </button>
      </div>
    </div>
  </div>
</div>

## 🎯 条件渲染演示

<div class="demo-container">
  <div class="demo-section">
    <h4>设备类型条件渲染</h4>
    <div class="demo-content">
      <div v-if="isMobile" class="mobile-content">
        📱 移动设备专用内容
        <p>这里显示适合移动设备的简化界面</p>
      </div>
      <div v-else-if="isTablet" class="tablet-content">
        📱 平板设备专用内容
        <p>这里显示适合平板设备的中等复杂度界面</p>
      </div>
      <div v-else class="desktop-content">
        💻 桌面设备专用内容
        <p>这里显示适合桌面设备的完整功能界面</p>
      </div>
    </div>
  </div>

  <div class="demo-section">
    <h4>屏幕方向条件渲染</h4>
    <div class="demo-content">
      <div v-if="isPortrait" class="portrait-content">
        📱 竖屏模式内容
        <p>适合竖屏浏览的垂直布局</p>
      </div>
      <div v-else class="landscape-content">
        📱 横屏模式内容
        <p>适合横屏浏览的水平布局</p>
      </div>
    </div>
  </div>
</div>

## ⚙️ 配置调试

<div class="config-panel">
  <h3>🔧 检测配置</h3>
  <div class="config-grid">
    <div class="config-item">
      <label>平板最小宽度:</label>
      <input 
        v-model.number="config.tabletMinWidth" 
        type="number" 
        min="300" 
        max="1200"
        @input="detectDevice"
      />
      <span class="unit">px</span>
    </div>
    <div class="config-item">
      <label>桌面最小宽度:</label>
      <input 
        v-model.number="config.desktopMinWidth" 
        type="number" 
        min="600" 
        max="1920"
        @input="detectDevice"
      />
      <span class="unit">px</span>
    </div>
    <div class="config-item">
      <label>
        <input 
          v-model="config.enableUserAgentDetection" 
          type="checkbox"
        />
        启用用户代理检测
      </label>
    </div>
    <div class="config-item">
      <label>
        <input 
          v-model="config.enableTouchDetection" 
          type="checkbox"
        />
        启用触摸检测
      </label>
    </div>
  </div>
</div>

## 📝 实时日志

<div class="logs-panel">
  <h3>📋 变化日志</h3>
  <div class="logs-container">
    <div 
      v-for="log in logs" 
      :key="log.time" 
      class="log-item"
    >
      <span class="log-time">{{ log.time }}</span>
      <span class="log-message">{{ log.message }}</span>
    </div>
    <div v-if="logs.length === 0" class="no-logs">
      暂无日志记录
    </div>
  </div>
</div>

## 💻 代码示例

基于当前设备信息，这里是对应的代码：

```typescript
// 当前检测结果
const deviceInfo = {
  type: '{{ deviceInfo.type }}',
  orientation: '{{ deviceInfo.orientation }}',
  width: {{ deviceInfo.width }},
  height: {{ deviceInfo.height }},
  pixelRatio: {{ deviceInfo.pixelRatio }},
  isTouchDevice: {{ deviceInfo.isTouchDevice }},
  userAgent: '{{ deviceInfo.userAgent.substring(0, 50) }}...'
}

// Vue 组合式 API 使用
const { 
  deviceInfo, 
  isMobile, 
  isTablet, 
  isDesktop 
} = useDevice({
  tabletMinWidth: {{ config.tabletMinWidth }},
  desktopMinWidth: {{ config.desktopMinWidth }}
})

// 条件渲染
if (isMobile.value) {
  // 移动端逻辑
} else if (isTablet.value) {
  // 平板端逻辑  
} else {
  // 桌面端逻辑
}
```

<style scoped>
.playground-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .playground-container {
    grid-template-columns: 1fr;
  }
}

.device-info-panel,
.controls-panel,
.config-panel,
.logs-panel {
  padding: 1.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.info-grid,
.config-grid {
  display: grid;
  gap: 1rem;
}

.info-item,
.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--vp-c-bg);
  border-radius: 4px;
}

.label {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.value {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.type-mobile { background: #ffe6e6; color: #d63031; }
.type-tablet { background: #fff3e6; color: #e17055; }
.type-desktop { background: #e6ffe6; color: #00b894; }

.orientation-portrait { background: #f0e6ff; color: #6c5ce7; }
.orientation-landscape { background: #ffe6f0; color: #fd79a8; }

.touch-yes { background: #e6ffe6; color: #00b894; }
.touch-no { background: #f5f5f5; color: #636e72; }

.control-group {
  margin: 1rem 0;
}

.control-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.button-group button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-group button:hover {
  background: var(--vp-c-bg-soft);
}

.button-group button.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.demo-container {
  margin: 2rem 0;
}

.demo-section {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
}

.demo-content > div {
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

.mobile-content { background: #ffe6e6; }
.tablet-content { background: #fff3e6; }
.desktop-content { background: #e6ffe6; }
.portrait-content { background: #f0e6ff; }
.landscape-content { background: #ffe6f0; }

.config-item input[type="number"] {
  width: 80px;
  padding: 0.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
}

.config-item input[type="checkbox"] {
  margin-right: 0.5rem;
}

.unit {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.logs-container {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 0.5rem;
}

.log-item {
  display: flex;
  gap: 1rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.log-time {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  min-width: 80px;
}

.log-message {
  color: var(--vp-c-text-1);
}

.no-logs {
  text-align: center;
  color: var(--vp-c-text-2);
  font-style: italic;
  padding: 1rem;
}
</style>
