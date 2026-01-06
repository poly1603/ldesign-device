<script setup lang="ts">
import type { NetworkInfo } from '@ldesign/device-core'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useNetwork } from '../composables/useNetwork'

/**
 * 网络状态类型
 */
type NetworkStatus = 'online' | 'offline' | 'slow'

/**
 * 网络类型
 */
type NetworkType = 'wifi' | '4g' | '3g' | '2g' | 'slow-2g' | 'unknown'

/**
 * NetworkStatus 组件属性定义
 */
interface Props {
  /** 显示模式 */
  displayMode?: 'icon' | 'text' | 'detailed' | 'progress'
  /** 是否显示详细信息（仅在 detailed 模式下有效） */
  showDetails?: boolean
  /** 是否显示刷新按钮 */
  showRefresh?: boolean
  /** 自动刷新间隔（毫秒），0 表示不自动刷新 */
  autoRefresh?: number
  /** 刷新间隔（毫秒） */
  refreshInterval?: number
}

/**
 * 组件事件定义
 */
interface Emits {
  /** 网络状态更新事件 */
  (e: 'update', networkInfo: NetworkInfo): void
  /** 状态变化事件 */
  (e: 'statusChange', status: NetworkStatus): void
  /** 刷新事件 */
  (e: 'refresh'): void
  /** 错误事件 */
  (e: 'error', error: string): void
}

// 定义 props 和 emits
const props = withDefaults(defineProps<Props>(), {
  displayMode: 'detailed',
  showDetails: true,
  showRefresh: false,
  autoRefresh: 0,
  refreshInterval: 30000,
})

const emit = defineEmits<Emits>()

// 使用网络检测 composable
const { networkInfo, isLoaded, loadModule } = useNetwork()

// 组件状态
const isLoading = ref(true)
const errorMessage = ref('')
const lastStatus = ref<NetworkStatus>()

// 计算属性
const hasError = computed(() => !!errorMessage.value)

// 自动刷新定时器
let autoRefreshTimer: number | null = null

/**
 * 获取网络状态图标
 */
function getStatusIcon(status: NetworkStatus): string {
  const icons = {
    online: '🟢',
    offline: '🔴',
  }
  return icons[status] || '⚪'
}

/**
 * 获取网络状态文本
 */
function getStatusText(status: NetworkStatus): string {
  const texts = {
    online: '在线',
    offline: '离线',
  }
  return texts[status] || '未知'
}

/**
 * 获取连接类型文本
 */
function getConnectionTypeText(type: NetworkType): string {
  const texts = {
    wifi: 'WiFi',
    cellular: '移动网络',
    ethernet: '以太网',
    bluetooth: '蓝牙',
    wimax: 'WiMAX',
    other: '其他',
    unknown: '未知',
    none: '无连接',
  }
  return texts[type] || '未知'
}

/**
 * 获取网速百分比（用于进度条显示）
 */
function getSpeedPercentage(speed?: number): number {
  if (!speed)
    return 0
  // 假设 100 Mbps 为满速
  return Math.min((speed / 100) * 100, 100)
}

/**
 * 刷新网络状态
 */
async function refresh() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    if (!isLoaded.value) {
      await loadModule()
    }

    emit('refresh')
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '刷新失败'
    errorMessage.value = message
    emit('error', message)
  }
  finally {
    isLoading.value = false
  }
}

/**
 * 设置自动刷新
 */
function setupAutoRefresh() {
  const interval = props.autoRefresh || props.refreshInterval
  if (interval > 0) {
    autoRefreshTimer = window.setInterval(() => {
      refresh()
    }, interval)
  }
}

/**
 * 清理自动刷新
 */
function clearAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
}

// 生命周期
onMounted(async () => {
  await refresh()
  setupAutoRefresh()
})

onUnmounted(() => {
  clearAutoRefresh()
})

// 监听网络信息变化
watch(networkInfo, (newInfo) => {
  if (newInfo) {
    emit('update', newInfo)

    // 检查状态是否变化
    if (lastStatus.value !== newInfo.status) {
      lastStatus.value = newInfo.status
      emit('statusChange', newInfo.status)
    }
  }
}, { deep: true })

// 监听 props 变化
watch(() => [props.autoRefresh, props.refreshInterval], () => {
  clearAutoRefresh()
  setupAutoRefresh()
})
</script>

<template>
  <div
    class="network-status" :class="[
      `network-status--${displayMode}`,
      `network-status--${networkInfo?.status || 'unknown'}`,
      {
        'network-status--loading': isLoading,
        'network-status--error': hasError,
      },
    ]"
  >
    <!-- 加载状态 -->
    <div v-if="isLoading" class="network-status__loading">
      <div class="network-status__spinner" />
      <span v-if="displayMode !== 'icon'">检测网络状态...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="hasError" class="network-status__error">
      <span class="network-status__error-icon">⚠️</span>
      <span v-if="displayMode !== 'icon'">网络检测失败</span>
    </div>

    <!-- 网络状态内容 -->
    <div v-else-if="networkInfo" class="network-status__content">
      <!-- 图标模式 -->
      <template v-if="displayMode === 'icon'">
        <span
          class="network-status__icon" :class="[`network-status__icon--${networkInfo.status}`]"
          :title="getStatusText(networkInfo.status)"
        >
          {{ getStatusIcon(networkInfo.status) }}
        </span>
      </template>

      <!-- 文字模式 -->
      <template v-else-if="displayMode === 'text'">
        <span class="network-status__text">
          {{ getStatusText(networkInfo.status) }}
        </span>
      </template>

      <!-- 详细模式 -->
      <template v-else-if="displayMode === 'detailed'">
        <div class="network-status__detailed">
          <div class="network-status__main">
            <span class="network-status__icon">{{ getStatusIcon(networkInfo.status) }}</span>
            <div class="network-status__info">
              <div class="network-status__status">
                {{ getStatusText(networkInfo.status) }}
              </div>
              <div class="network-status__type">
                {{ getConnectionTypeText(networkInfo.type) }}
              </div>
            </div>
          </div>

          <div v-if="showDetails && networkInfo.status === 'online'" class="network-status__details">
            <div v-if="networkInfo.downlink" class="network-status__detail">
              <label>下载速度</label>
              <span>{{ networkInfo.downlink.toFixed(1) }} Mbps</span>
            </div>
            <div v-if="networkInfo.rtt" class="network-status__detail">
              <label>延迟</label>
              <span>{{ networkInfo.rtt }} ms</span>
            </div>
            <div v-if="networkInfo.saveData !== undefined" class="network-status__detail">
              <label>省流模式</label>
              <span>{{ networkInfo.saveData ? '开启' : '关闭' }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- 进度条模式 -->
      <template v-else-if="displayMode === 'progress'">
        <div class="network-status__progress">
          <div class="network-status__progress-header">
            <span>{{ getStatusText(networkInfo.status) }}</span>
            <span v-if="networkInfo.downlink">{{ networkInfo.downlink.toFixed(1) }} Mbps</span>
          </div>
          <div class="network-status__progress-bar">
            <div
              class="network-status__progress-fill"
              :style="{ width: `${getSpeedPercentage(networkInfo.downlink)}%` }"
            />
          </div>
        </div>
      </template>
    </div>

    <!-- 刷新按钮 -->
    <button
      v-if="showRefresh && displayMode !== 'icon'"
      class="network-status__refresh"
      :disabled="isLoading"
      @click="refresh"
    >
      🔄
    </button>
  </div>
</template>

<style scoped>
/* ==================== CSS 变量定义 ==================== */
.network-status {
  /* 颜色变量 - 浅色主题 */
  --ns-bg-primary: #ffffff;
  --ns-bg-secondary: #f8f9fa;
  --ns-bg-tertiary: #e9ecef;
  --ns-border-color: #e1e5e9;
  --ns-text-primary: #212529;
  --ns-text-secondary: #6c757d;
  --ns-online-color: #10b981;
  --ns-online-bg: rgba(16, 185, 129, 0.1);
  --ns-offline-color: #ef4444;
  --ns-offline-bg: rgba(239, 68, 68, 0.1);
  --ns-slow-color: #f59e0b;
  --ns-slow-bg: rgba(245, 158, 11, 0.1);
  --ns-accent-color: #4f46e5;
  --ns-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --ns-shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1);
  --ns-radius: 12px;
  --ns-radius-sm: 8px;
  --ns-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  color: var(--ns-text-primary);
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .network-status {
    --ns-bg-primary: #1e1e2e;
    --ns-bg-secondary: #2a2a3e;
    --ns-bg-tertiary: #363650;
    --ns-border-color: #3f3f5c;
    --ns-text-primary: #e4e4e7;
    --ns-text-secondary: #a1a1aa;
    --ns-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    --ns-shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.3);
  }
}

/* 强制深色模式类 */
.network-status.dark {
  --ns-bg-primary: #1e1e2e;
  --ns-bg-secondary: #2a2a3e;
  --ns-bg-tertiary: #363650;
  --ns-border-color: #3f3f5c;
  --ns-text-primary: #e4e4e7;
  --ns-text-secondary: #a1a1aa;
}

/* ==================== 加载状态 ==================== */
.network-status__loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ns-text-secondary);
  padding: 8px 0;
}

.network-status__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--ns-bg-tertiary);
  border-top: 2px solid var(--ns-accent-color);
  border-radius: 50%;
  animation: ns-spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes ns-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ==================== 错误状态 ==================== */
.network-status__error {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ns-offline-color);
  font-size: 13px;
  padding: 6px 10px;
  background: var(--ns-offline-bg);
  border-radius: var(--ns-radius-sm);
}

.network-status__error-icon {
  font-size: 16px;
}

/* ==================== 图标模式 ==================== */
.network-status__icon {
  font-size: 20px;
  cursor: default;
  transition: var(--ns-transition);
}

.network-status__icon--online {
  color: var(--ns-online-color);
  animation: ns-pulse 2s ease-in-out infinite;
}

.network-status__icon--offline {
  color: var(--ns-offline-color);
}

@keyframes ns-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
}

/* ==================== 文字模式 ==================== */
.network-status__text {
  font-size: 14px;
  font-weight: 500;
  transition: var(--ns-transition);
}

.network-status--online .network-status__text {
  color: var(--ns-online-color);
}

.network-status--offline .network-status__text {
  color: var(--ns-offline-color);
}

/* ==================== 详细模式 ==================== */
.network-status__detailed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.network-status__main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.network-status__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.network-status__status {
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.network-status--online .network-status__status {
  color: var(--ns-online-color);
}

.network-status--offline .network-status__status {
  color: var(--ns-offline-color);
}

/* 状态指示器小圆点 */
.network-status__indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.network-status--online .network-status__indicator {
  background: var(--ns-online-color);
  box-shadow: 0 0 8px var(--ns-online-color);
  animation: ns-glow 2s ease-in-out infinite;
}

.network-status--offline .network-status__indicator {
  background: var(--ns-offline-color);
}

@keyframes ns-glow {
  0%, 100% { box-shadow: 0 0 4px var(--ns-online-color); }
  50% { box-shadow: 0 0 12px var(--ns-online-color); }
}

.network-status__type {
  font-size: 12px;
  color: var(--ns-text-secondary);
}

.network-status__details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--ns-bg-secondary);
  border-radius: var(--ns-radius-sm);
  margin-top: 4px;
}

.network-status__detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.network-status__detail label {
  color: var(--ns-text-secondary);
  font-weight: 500;
}

.network-status__detail span {
  font-weight: 600;
  color: var(--ns-text-primary);
  font-variant-numeric: tabular-nums;
}

/* ==================== 进度条模式 ==================== */
.network-status__progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
  width: 100%;
}

.network-status__progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.network-status__progress-header span:first-child {
  font-weight: 600;
  color: var(--ns-text-primary);
}

.network-status__progress-header span:last-child {
  color: var(--ns-text-secondary);
  font-variant-numeric: tabular-nums;
}

.network-status__progress-bar {
  height: 6px;
  background: var(--ns-bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.network-status__progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.network-status--online .network-status__progress-fill {
  background: linear-gradient(90deg, var(--ns-online-color) 0%, #34d399 100%);
}

.network-status--offline .network-status__progress-fill {
  background: var(--ns-offline-color);
  width: 100%;
}

/* 进度条动画效果 */
.network-status__progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: ns-shimmer 2s infinite;
}

@keyframes ns-shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* ==================== 信号强度指示器 ==================== */
.network-status__signal {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
}

.network-status__signal-bar {
  width: 4px;
  background: var(--ns-bg-tertiary);
  border-radius: 2px;
  transition: var(--ns-transition);
}

.network-status__signal-bar:nth-child(1) { height: 4px; }
.network-status__signal-bar:nth-child(2) { height: 8px; }
.network-status__signal-bar:nth-child(3) { height: 12px; }
.network-status__signal-bar:nth-child(4) { height: 16px; }

.network-status--online .network-status__signal-bar.active {
  background: var(--ns-online-color);
}

.network-status--offline .network-status__signal-bar {
  background: var(--ns-offline-color);
  opacity: 0.3;
}

/* ==================== 刷新按钮 ==================== */
.network-status__refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  background: var(--ns-bg-secondary);
  border: 1px solid var(--ns-border-color);
  border-radius: var(--ns-radius-sm);
  cursor: pointer;
  font-size: 14px;
  transition: var(--ns-transition);
}

.network-status__refresh:hover {
  background: var(--ns-bg-tertiary);
  transform: rotate(180deg);
}

.network-status__refresh:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.network-status__refresh:active {
  transform: rotate(180deg) scale(0.95);
}

/* ==================== 显示模式样式 ==================== */
.network-status--icon {
  justify-content: center;
  padding: 8px;
}

.network-status--text {
  justify-content: flex-start;
  padding: 8px 12px;
}

.network-status--detailed {
  flex-direction: column;
  padding: 16px;
  border: 1px solid var(--ns-border-color);
  border-radius: var(--ns-radius);
  background: var(--ns-bg-primary);
  box-shadow: var(--ns-shadow);
  transition: var(--ns-transition);
}

.network-status--detailed:hover {
  box-shadow: var(--ns-shadow-lg);
}

.network-status--progress {
  flex-direction: column;
  padding: 14px 16px;
  border: 1px solid var(--ns-border-color);
  border-radius: var(--ns-radius);
  background: var(--ns-bg-primary);
  box-shadow: var(--ns-shadow);
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 768px) {
  .network-status--detailed,
  .network-status--progress {
    padding: 12px;
  }

  .network-status__details {
    padding: 10px;
  }
}

/* ==================== 无障碍支持 ==================== */
@media (prefers-reduced-motion: reduce) {
  .network-status__spinner,
  .network-status__icon--online,
  .network-status__progress-fill,
  .network-status__progress-fill::after,
  .network-status__refresh,
  .network-status--online .network-status__indicator {
    animation: none;
  }

  .network-status__progress-fill::after {
    display: none;
  }
}
</style>
