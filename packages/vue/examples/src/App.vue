<script setup lang="ts">
import { useDevice, useBattery, useNetwork } from '@ldesign/device-vue'

// 设备检测
const { deviceType, isMobile, isTablet, isDesktop, deviceInfo, orientation } = useDevice()

// 电池检测
const { levelPercentage, isCharging, isSupported, level } = useBattery()

// 网络检测
const { isOnline, connectionType, downlink, rtt } = useNetwork()

function getLevelColor(level: number) {
  if (level >= 0.8) return '#10b981'
  if (level >= 0.5) return '#3b82f6'
  if (level >= 0.2) return '#f59e0b'
  return '#ef4444'
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>🎯 @ldesign/device-vue</h1>
      <p>Vue 3 设备检测演示</p>
    </header>

    <div class="grid">
      <!-- 设备信息卡片 -->
      <div class="card">
        <h2>📱 设备信息</h2>
        <div class="info-list">
          <div class="info-item">
            <span class="label">设备类型:</span>
            <span class="value">
              <span v-if="isMobile" class="badge badge-mobile">📱 Mobile</span>
              <span v-if="isTablet" class="badge badge-tablet">📱 Tablet</span>
              <span v-if="isDesktop" class="badge badge-desktop">💻 Desktop</span>
            </span>
          </div>
          <div class="info-item">
            <span class="label">屏幕方向:</span>
            <span class="value">{{ orientation }}</span>
          </div>
          <div class="info-item">
            <span class="label">屏幕尺寸:</span>
            <span class="value">{{ deviceInfo.width }} x {{ deviceInfo.height }}</span>
          </div>
          <div class="info-item">
            <span class="label">像素比:</span>
            <span class="value">{{ deviceInfo.pixelRatio }}</span>
          </div>
          <div class="info-item">
            <span class="label">触摸支持:</span>
            <span class="value">{{ deviceInfo.isTouchDevice ? '✅ 支持' : '❌ 不支持' }}</span>
          </div>
        </div>
      </div>

      <!-- 电池信息卡片 -->
      <div class="card">
        <h2>🔋 电池信息</h2>
        <div v-if="!isSupported" class="alert alert-warning">
          ⚠️ 浏览器不支持 Battery API
        </div>
        <template v-else>
          <div class="battery-display">
            <div class="battery-icon">{{ isCharging ? '⚡' : '🔋' }}</div>
            <div 
              class="battery-level" 
              :style="{ color: getLevelColor(level) }"
            >
              {{ levelPercentage }}%
            </div>
            <div class="charging-status" :class="{ charging: isCharging }">
              {{ isCharging ? '⚡ 充电中' : '🔌 未充电' }}
            </div>
          </div>
        </template>
      </div>

      <!-- 网络信息卡片 -->
      <div class="card">
        <h2>🌐 网络信息</h2>
        <div class="info-list">
          <div class="info-item">
            <span class="label">在线状态:</span>
            <span class="value">
              <span :class="isOnline ? 'status-online' : 'status-offline'">
                {{ isOnline ? '🟢 在线' : '🔴 离线' }}
              </span>
            </span>
          </div>
          <div class="info-item">
            <span class="label">连接类型:</span>
            <span class="value">{{ connectionType }}</span>
          </div>
          <div v-if="downlink !== undefined" class="info-item">
            <span class="label">下载速度:</span>
            <span class="value">{{ downlink }} Mbps</span>
          </div>
          <div v-if="rtt !== undefined" class="info-item">
            <span class="label">延迟:</span>
            <span class="value">{{ rtt }} ms</span>
          </div>
        </div>
      </div>

      <!-- 实时监控 -->
      <div class="card">
        <h2>📊 实时监控</h2>
        <div class="monitor">
          <div class="monitor-item">
            <div class="monitor-icon">📱</div>
            <div class="monitor-label">当前设备</div>
            <div class="monitor-value">{{ deviceType }}</div>
          </div>
          <div class="monitor-item" v-if="isSupported">
            <div class="monitor-icon">🔋</div>
            <div class="monitor-label">电池电量</div>
            <div class="monitor-value">{{ levelPercentage }}%</div>
          </div>
          <div class="monitor-item">
            <div class="monitor-icon">🌐</div>
            <div class="monitor-label">网络状态</div>
            <div class="monitor-value">{{ isOnline ? '在线' : '离线' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #667eea;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.label {
  font-weight: 500;
  color: #64748b;
}

.value {
  font-weight: 600;
  color: #1e293b;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-mobile {
  background: #dbeafe;
  color: #1e40af;
}

.badge-tablet {
  background: #fef3c7;
  color: #92400e;
}

.badge-desktop {
  background: #d1fae5;
  color: #065f46;
}

.status-online {
  color: #10b981;
  font-weight: 600;
}

.status-offline {
  color: #ef4444;
  font-weight: 600;
}

.battery-display {
  text-align: center;
  padding: 2rem;
}

.battery-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.battery-level {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.charging-status {
  font-size: 1.25rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  background: #fee2e2;
  color: #991b1b;
}

.charging-status.charging {
  background: #d1fae5;
  color: #065f46;
}

.monitor {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.monitor-item {
  text-align: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
}

.monitor-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.monitor-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.monitor-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1e293b;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.alert-warning {
  background: #fef3c7;
  color: #92400e;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .monitor {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>

