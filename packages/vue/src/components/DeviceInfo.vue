<script setup lang="ts">
import type { DeviceInfo, DeviceType, Orientation } from '@ldesign/device-core'
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
import { useDevice } from '../composables/useDevice'

/**
 * DeviceInfo 组件属性定义
 */
interface Props {
  /** 显示模式：compact（紧凑）或 detailed（详细） */
  mode?: 'compact' | 'detailed'
  /** 是否显示刷新按钮 */
  showRefresh?: boolean
  /** 自动刷新间隔（毫秒），0 表示不自动刷新 */
  autoRefresh?: number
  /** 自定义样式类名 */
  customClass?: string
}

/**
 * 组件事件定义
 */
interface Emits {
  /** 设备信息更新事件 */
  (e: 'update', deviceInfo: DeviceInfo): void
  /** 刷新事件 */
  (e: 'refresh'): void
  /** 错误事件 */
  (e: 'error', error: string): void
}

// 定义 props 和 emits
const props = withDefaults(defineProps<Props>(), {
  mode: 'detailed',
  showRefresh: true,
  autoRefresh: 0,
})

const emit = defineEmits<Emits>()

// 使用设备检测 composable
const { deviceInfo, refresh: refreshDevice } = useDevice()
// 兼容测试环境中传入的伪 ref（仅包含 value 字段）
const info = computed<DeviceInfo | null>(() => {
  const v: any = deviceInfo as any
  if (v && typeof v === 'object' && 'value' in v)
    return v.value as DeviceInfo | null
  return v as DeviceInfo | null
})

// 组件状态（默认不加载，除非没有可用的设备信息或手动刷新）
const isLoading = ref(false)
const errorMessage = ref('')

// 计算属性
const hasError = computed(() => !!errorMessage.value)

// 自动刷新定时器
let autoRefreshTimer: number | null = null

/**
 * 获取设备类型图标
 */
function getDeviceIcon(type: DeviceType): string {
  const icons = {
    mobile: '📱',
    tablet: '📱',
    desktop: '💻',
  }
  return icons[type] || '❓'
}

/**
 * 获取设备类型文本
 */
function getDeviceTypeText(type: DeviceType): string {
  const texts = {
    mobile: '移动设备',
    tablet: '平板设备',
    desktop: '桌面设备',
  }
  return texts[type] || '未知设备'
}

/**
 * 获取屏幕方向文本
 */
function getOrientationText(orientation: Orientation): string {
  const texts = {
    portrait: '竖屏',
    landscape: '横屏',
  }
  return texts[orientation] || '未知'
}

/**
 * 刷新设备信息
 */
async function refresh() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    await Promise.resolve(refreshDevice())

    if (deviceInfo.value) {
      emit('update', deviceInfo.value)
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
  if (props.autoRefresh > 0) {
    autoRefreshTimer = window.setInterval(() => {
      refresh()
    }, props.autoRefresh)
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
onMounted(() => {
  // 如果当前没有可用信息，显示加载占位
  isLoading.value = !deviceInfo.value
  setupAutoRefresh()
})

// 监听 props 变化
watch(() => props.autoRefresh, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    clearAutoRefresh()
    setupAutoRefresh()
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  clearAutoRefresh()
})

// 为测试友好：暴露组合式状态，便于 @vue/test-utils 的 setData / 直接访问
// 注意：defineExpose 仅暴露属性，不改变内部实现
defineExpose({
  isLoading,
  errorMessage,
})

// 兼容某些测试工具对 setData 的实现：尝试在代理上定义同名属性（失败则忽略）
const instance = getCurrentInstance()
if (instance && instance.proxy) {
  try {
    Object.defineProperties(instance.proxy as any, {
      isLoading: {
        get: () => isLoading.value,
        set: (v: boolean) => { isLoading.value = v },
        configurable: true,
        enumerable: true,
      },
      errorMessage: {
        get: () => errorMessage.value,
        set: (v: string) => { errorMessage.value = v },
        configurable: true,
        enumerable: true,
      },
    })
  }
  catch {}
}

// 监听设备信息变化
watch(() => deviceInfo.value, (newInfo) => {
  // 根据设备信息是否可用自动切换加载状态
  isLoading.value = !newInfo
  if (newInfo) {
    emit('update', newInfo)
  }
}, { deep: true })
</script>

<template>
  <div
    class="device-info" :class="[
      `device-info--${mode}`,
      `device-info--${info?.type || 'unknown'}`,
      {
        'device-info--loading': isLoading,
        'device-info--error': hasError,
      },
    ]"
  >
    <!-- 加载状态 -->
    <div v-if="isLoading" class="device-info__loading">
      <div class="device-info__spinner" />
      <span>正在检测设备信息...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="hasError" class="device-info__error">
      <div class="device-info__error-icon">
        ⚠️
      </div>
      <div class="device-info__error-content">
        <h4>设备信息获取失败</h4>
        <p>{{ errorMessage }}</p>
        <button class="device-info__retry-btn" @click="refresh">
          重试
        </button>
      </div>
    </div>

    <!-- 设备信息内容 -->
    <div v-else-if="info" class="device-info__content">
      <!-- 紧凑模式 -->
      <template v-if="mode === 'compact'">
        <div class="device-info__compact">
          <div class="device-info__icon">
            {{ getDeviceIcon(info.type) }}
          </div>
          <div class="device-info__basic">
            <span class="device-info__type">{{ getDeviceTypeText(info.type) }}</span>
            <span class="device-info__size">{{ info.screen?.width }}×{{ info.screen?.height }}</span>
          </div>
          <div v-if="showRefresh" class="device-info__actions">
            <button class="device-info__refresh-btn" title="刷新" @click="refresh">
              🔄
            </button>
          </div>
        </div>
      </template>

      <!-- 详细模式 -->
      <template v-else>
        <div class="device-info__header">
          <div class="device-info__title">
            <span class="device-info__icon">{{ getDeviceIcon(info.type) }}</span>
            <h3>{{ getDeviceTypeText(info.type) }}</h3>
          </div>
          <button v-if="showRefresh" class="device-info__refresh-btn" @click="refresh">
            刷新
          </button>
        </div>

        <div class="device-info__sections">
          <!-- 基本信息 -->
          <div class="device-info__section">
            <h4>基本信息</h4>
            <div class="device-info__grid">
              <div class="device-info__item">
                <label>设备类型</label>
                <span>{{ getDeviceTypeText(info.type) }}</span>
              </div>
              <div class="device-info__item">
                <label>屏幕方向</label>
                <span>{{ getOrientationText(info.orientation) }}</span>
              </div>
              <div class="device-info__item">
                <label>触摸支持</label>
                <span>{{ info.features?.touch ? '支持' : '不支持' }}</span>
              </div>
            </div>
          </div>

          <!-- 屏幕信息 -->
          <div class="device-info__section">
            <h4>屏幕信息</h4>
            <div class="device-info__grid">
              <div class="device-info__item">
                <label>视口尺寸</label>
                <span>{{ info.screen?.width }}×{{ info.screen?.height }}</span>
              </div>
              <div class="device-info__item">
                <label>设备像素比</label>
                <span>{{ info.screen?.pixelRatio }}</span>
              </div>
              <div class="device-info__item">
                <label>可用尺寸</label>
                <span>{{ info.screen?.availWidth }}×{{ info.screen?.availHeight }}</span>
              </div>
            </div>
          </div>

          <!-- 浏览器信息 -->
          <div class="device-info__section">
            <h4>浏览器信息</h4>
            <div class="device-info__grid">
              <div class="device-info__item">
                <label>浏览器</label>
                <span>{{ info.browser?.name }} {{ info.browser?.version }}</span>
              </div>
              <div class="device-info__item">
                <label>引擎</label>
                <span>{{ info.browser?.engine }}</span>
              </div>
            </div>
          </div>

          <!-- 操作系统信息 -->
          <div class="device-info__section">
            <h4>操作系统</h4>
            <div class="device-info__grid">
              <div class="device-info__item">
                <label>系统</label>
                <span>{{ info.os?.name }} {{ info.os?.version }}</span>
              </div>
              <div class="device-info__item">
                <label>平台</label>
                <span>{{ info.os?.platform }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 自定义插槽 -->
    <div v-if="$slots.default" class="device-info__custom">
      <slot :device-info="info" :refresh="refresh" :is-loading="isLoading" />
    </div>
  </div>
</template>

<style scoped>
/* ==================== CSS 变量定义 ==================== */
.device-info {
  /* 颜色变量 - 浅色主题 */
  --di-bg-primary: #ffffff;
  --di-bg-secondary: #f8f9fa;
  --di-bg-tertiary: #e9ecef;
  --di-border-color: #e1e5e9;
  --di-text-primary: #212529;
  --di-text-secondary: #6c757d;
  --di-text-muted: #adb5bd;
  --di-accent-color: #4f46e5;
  --di-accent-hover: #4338ca;
  --di-success-color: #10b981;
  --di-warning-color: #f59e0b;
  --di-error-color: #ef4444;
  --di-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --di-shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --di-radius: 12px;
  --di-radius-sm: 8px;
  --di-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  border: 1px solid var(--di-border-color);
  border-radius: var(--di-radius);
  background: var(--di-bg-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  color: var(--di-text-primary);
  box-shadow: var(--di-shadow);
  transition: var(--di-transition);
  overflow: hidden;
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .device-info {
    --di-bg-primary: #1e1e2e;
    --di-bg-secondary: #2a2a3e;
    --di-bg-tertiary: #363650;
    --di-border-color: #3f3f5c;
    --di-text-primary: #e4e4e7;
    --di-text-secondary: #a1a1aa;
    --di-text-muted: #71717a;
    --di-accent-color: #818cf8;
    --di-accent-hover: #a5b4fc;
    --di-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
    --di-shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

/* 强制深色模式类 */
.device-info.dark {
  --di-bg-primary: #1e1e2e;
  --di-bg-secondary: #2a2a3e;
  --di-bg-tertiary: #363650;
  --di-border-color: #3f3f5c;
  --di-text-primary: #e4e4e7;
  --di-text-secondary: #a1a1aa;
  --di-text-muted: #71717a;
  --di-accent-color: #818cf8;
  --di-accent-hover: #a5b4fc;
}

.device-info--compact {
  padding: 16px;
}

.device-info--detailed {
  padding: 20px;
}

.device-info--loading {
  opacity: 0.8;
}

.device-info:hover {
  box-shadow: var(--di-shadow-lg);
}

/* ==================== 加载状态 ==================== */
.device-info__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  color: var(--di-text-secondary);
  gap: 16px;
}

.device-info__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--di-bg-tertiary);
  border-top: 3px solid var(--di-accent-color);
  border-radius: 50%;
  animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 骨架屏效果 */
.device-info__skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.device-info__skeleton-item {
  height: 16px;
  background: linear-gradient(
    90deg,
    var(--di-bg-secondary) 25%,
    var(--di-bg-tertiary) 50%,
    var(--di-bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.device-info__skeleton-item:nth-child(1) { width: 60%; }
.device-info__skeleton-item:nth-child(2) { width: 80%; }
.device-info__skeleton-item:nth-child(3) { width: 40%; }

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ==================== 错误状态 ==================== */
.device-info__error {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%);
  border-radius: var(--di-radius-sm);
  margin: 8px;
}

.device-info__error-icon {
  font-size: 28px;
  margin-right: 16px;
  flex-shrink: 0;
}

.device-info__error-content h4 {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--di-error-color);
}

.device-info__error-content p {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: var(--di-text-secondary);
  line-height: 1.5;
}

.device-info__retry-btn {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  background: var(--di-error-color);
  color: white;
  border: none;
  border-radius: var(--di-radius-sm);
  cursor: pointer;
  transition: var(--di-transition);
}

.device-info__retry-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.device-info__retry-btn:active {
  transform: translateY(0);
}

/* ==================== 内容区域 ==================== */
.device-info__content {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== 紧凑模式 ==================== */
.device-info__compact {
  display: flex;
  align-items: center;
  gap: 16px;
}

.device-info__icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--di-bg-secondary);
  border-radius: var(--di-radius-sm);
  flex-shrink: 0;
}

.device-info__basic {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.device-info__type {
  font-weight: 600;
  font-size: 15px;
  color: var(--di-text-primary);
}

.device-info__size {
  font-size: 13px;
  color: var(--di-text-secondary);
  font-variant-numeric: tabular-nums;
}

.device-info__actions {
  flex-shrink: 0;
}

/* ==================== 详细模式 ==================== */
.device-info__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--di-border-color);
}

.device-info__title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.device-info__title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--di-text-primary);
}

.device-info__refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  background: var(--di-accent-color);
  color: white;
  border: none;
  border-radius: var(--di-radius-sm);
  cursor: pointer;
  transition: var(--di-transition);
}

.device-info__refresh-btn:hover {
  background: var(--di-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.device-info__refresh-btn:active {
  transform: translateY(0);
}

.device-info__sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.device-info__section {
  animation: slideIn 0.3s ease-out;
  animation-fill-mode: both;
}

.device-info__section:nth-child(1) { animation-delay: 0s; }
.device-info__section:nth-child(2) { animation-delay: 0.05s; }
.device-info__section:nth-child(3) { animation-delay: 0.1s; }
.device-info__section:nth-child(4) { animation-delay: 0.15s; }

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.device-info__section h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--di-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.device-info__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.device-info__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: var(--di-bg-secondary);
  border-radius: var(--di-radius-sm);
  transition: var(--di-transition);
  border: 1px solid transparent;
}

.device-info__item:hover {
  background: var(--di-bg-tertiary);
  border-color: var(--di-border-color);
}

.device-info__item label {
  font-size: 12px;
  color: var(--di-text-secondary);
  font-weight: 500;
}

.device-info__item span {
  font-size: 13px;
  font-weight: 600;
  color: var(--di-text-primary);
  font-variant-numeric: tabular-nums;
}

/* ==================== 自定义内容 ==================== */
.device-info__custom {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--di-border-color);
}

/* ==================== 设备类型指示器 ==================== */
.device-info--mobile .device-info__icon {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: white;
}

.device-info--tablet .device-info__icon {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  color: white;
}

.device-info--desktop .device-info__icon {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 768px) {
  .device-info {
    --di-radius: 8px;
  }

  .device-info--detailed {
    padding: 16px;
  }

  .device-info__grid {
    grid-template-columns: 1fr;
  }

  .device-info__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .device-info__refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .device-info__item {
    padding: 10px 12px;
  }
}

/* ==================== 无障碍支持 ==================== */
@media (prefers-reduced-motion: reduce) {
  .device-info,
  .device-info__spinner,
  .device-info__content,
  .device-info__section,
  .device-info__item,
  .device-info__refresh-btn,
  .device-info__retry-btn {
    animation: none;
    transition: none;
  }
}

/* ==================== 高对比度模式 ==================== */
@media (prefers-contrast: high) {
  .device-info {
    border-width: 2px;
  }

  .device-info__item {
    border: 1px solid var(--di-border-color);
  }
}
</style>
