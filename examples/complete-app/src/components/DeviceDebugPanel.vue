<script setup lang="ts">
import { useDevice } from '@ldesign/device/vue'

defineEmits<{
  (e: 'close'): void
}>()

const { deviceInfo, refresh } = useDevice()
</script>

<template>
  <div class="debug-panel-overlay" @click="$emit('close')">
    <div class="debug-panel" @click.stop>
      <div class="panel-header">
        <h3>🔧 设备调试面板</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      
      <div class="panel-content">
        <div class="info-section">
          <h4>设备信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">类型:</span>
              <span class="value">{{ deviceInfo.type }}</span>
            </div>
            <div class="info-item">
              <span class="label">方向:</span>
              <span class="value">{{ deviceInfo.orientation }}</span>
            </div>
            <div class="info-item">
              <span class="label">尺寸:</span>
              <span class="value">{{ deviceInfo.width }}×{{ deviceInfo.height }}</span>
            </div>
            <div class="info-item">
              <span class="label">像素比:</span>
              <span class="value">{{ deviceInfo.pixelRatio }}</span>
            </div>
            <div class="info-item">
              <span class="label">触摸:</span>
              <span class="value">{{ deviceInfo.isTouchDevice ? '是' : '否' }}</span>
            </div>
          </div>
        </div>

        <div class="info-section" v-if="deviceInfo.browser">
          <h4>浏览器</h4>
          <p>{{ deviceInfo.browser.name }} {{ deviceInfo.browser.version }}</p>
        </div>

        <div class="info-section" v-if="deviceInfo.os">
          <h4>操作系统</h4>
          <p>{{ deviceInfo.os.name }} {{ deviceInfo.os.version }}</p>
        </div>

        <button class="refresh-btn" @click="refresh">刷新信息</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.debug-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.debug-panel {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.close-btn {
  padding: 4px 8px;
  border: none;
  background: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
}

.panel-content {
  padding: 20px;
}

.info-section {
  margin-bottom: 24px;
}

.info-section h4 {
  margin: 0 0 12px 0;
  font-size: 1rem;
  color: #666;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.75rem;
  color: #999;
}

.value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.refresh-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: #4facfe;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #3f9cee;
}
</style>


