<template>
  <section id="device-info" class="device-info-section">
    <div class="section-header">
      <h2>📱 设备信息检测</h2>
      <p>实时显示当前设备的详细信息</p>
    </div>
    
    <div :class="gridClass">
      <!-- 基础设备信息 -->
      <div class="info-card">
        <h3>🎯 基础信息</h3>
        <div class="info-list">
          <div class="info-item">
            <span class="label">设备类型:</span>
            <span :class="`status status-${deviceInfo.type}`">
              {{ getDeviceTypeLabel(deviceInfo.type) }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">屏幕方向:</span>
            <span :class="`status status-${deviceInfo.orientation}`">
              {{ getOrientationLabel(deviceInfo.orientation) }}
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
            <span :class="deviceInfo.isTouchDevice ? 'status-success' : 'status-default'">
              {{ deviceInfo.isTouchDevice ? '是' : '否' }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 设备特性 -->
      <div class="info-card">
        <h3>✨ 设备特性</h3>
        <div class="features-list">
          <div class="feature-item" :class="{ active: isMobile }">
            <span class="icon">📱</span>
            <span>移动设备</span>
          </div>
          <div class="feature-item" :class="{ active: isTablet }">
            <span class="icon">📱</span>
            <span>平板设备</span>
          </div>
          <div class="feature-item" :class="{ active: isDesktop }">
            <span class="icon">💻</span>
            <span>桌面设备</span>
          </div>
          <div class="feature-item" :class="{ active: isPortrait }">
            <span class="icon">📱</span>
            <span>竖屏模式</span>
          </div>
          <div class="feature-item" :class="{ active: isLandscape }">
            <span class="icon">📱</span>
            <span>横屏模式</span>
          </div>
          <div class="feature-item" :class="{ active: isTouchDevice }">
            <span class="icon">👆</span>
            <span>触摸支持</span>
          </div>
          <div class="feature-item" :class="{ active: hasHighDPI }">
            <span class="icon">🔍</span>
            <span>高分辨率</span>
          </div>
          <div class="feature-item" :class="{ active: isSmallScreen }">
            <span class="icon">📏</span>
            <span>小屏幕</span>
          </div>
        </div>
      </div>
      
      <!-- 实时监听 -->
      <div class="info-card">
        <h3>🔄 实时监听</h3>
        <div class="monitoring">
          <p class="monitoring-status">
            <span class="status-indicator active"></span>
            监听器状态: 活跃
          </p>
          <div class="change-log">
            <h4>变化日志:</h4>
            <div class="log-container">
              <div 
                v-for="log in changeLogs" 
                :key="log.id"
                class="log-item"
              >
                <span class="log-time">{{ log.time }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
              <div v-if="changeLogs.length === 0" class="no-logs">
                暂无变化记录
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="actions">
      <button class="btn" @click="refreshDeviceInfo">
        🔄 刷新设备信息
      </button>
      <button class="btn" @click="clearLogs">
        🗑️ 清空日志
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDevice, useDeviceFeatures, onDeviceChange } from '@ldesign/device'

const { 
  deviceInfo, 
  isMobile, 
  isTablet, 
  isDesktop, 
  isPortrait, 
  isLandscape, 
  isTouchDevice,
  refresh 
} = useDevice()

const { hasHighDPI, isSmallScreen } = useDeviceFeatures()

const changeLogs = ref<Array<{ id: number; time: string; message: string }>>([])
let logId = 0

const gridClass = computed(() => ({
  'grid': true,
  'grid-mobile': isMobile.value,
  'grid-tablet': isTablet.value,
  'grid-desktop': isDesktop.value
}))

const getDeviceTypeLabel = (type: string) => {
  const labels = {
    mobile: '📱 移动设备',
    tablet: '📱 平板设备',
    desktop: '💻 桌面设备'
  }
  return labels[type as keyof typeof labels] || '❓ 未知设备'
}

const getOrientationLabel = (orientation: string) => {
  const labels = {
    portrait: '📱 竖屏',
    landscape: '📱 横屏'
  }
  return labels[orientation as keyof typeof labels] || '❓ 未知方向'
}

const addLog = (message: string) => {
  changeLogs.value.unshift({
    id: ++logId,
    time: new Date().toLocaleTimeString(),
    message
  })
  
  // 保持最多10条记录
  if (changeLogs.value.length > 10) {
    changeLogs.value.pop()
  }
}

const refreshDeviceInfo = () => {
  refresh()
  addLog('手动刷新设备信息')
}

const clearLogs = () => {
  changeLogs.value = []
}

// 监听设备变化
let unsubscribe: (() => void) | null = null

onMounted(() => {
  unsubscribe = onDeviceChange((event) => {
    const changes = event.changes.join(', ')
    addLog(`设备信息变化: ${changes}`)
  })
  
  addLog('设备检测器初始化完成')
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style scoped>
.device-info-section {
  margin-bottom: 3rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.section-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.info-card {
  background: var(--bg-color);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.info-card h3 {
  margin-bottom: 1rem;
  color: var(--text-color);
  font-size: 1.25rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 4px;
}

.label {
  font-weight: 500;
  color: var(--text-secondary);
}

.value {
  font-weight: 600;
  color: var(--text-color);
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  transition: all 0.3s ease;
  opacity: 0.5;
}

.feature-item.active {
  opacity: 1;
  background: var(--primary-color);
  color: white;
  transform: scale(1.05);
}

.feature-item .icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.monitoring-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success-color);
}

.change-log h4 {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.log-container {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.5rem;
}

.log-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: var(--text-secondary);
  min-width: 80px;
}

.log-message {
  color: var(--text-color);
}

.no-logs {
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
  padding: 1rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.status-success {
  color: var(--success-color);
  font-weight: 600;
}

.status-default {
  color: var(--text-secondary);
}

/* 移动端优化 */
@media (max-width: 767px) {
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .info-card {
    padding: 1rem;
  }
  
  .features-list {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
