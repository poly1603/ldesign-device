<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDevice } from '@ldesign/device/vue'
import AppHeader from './components/AppHeader.vue'
import ProductGrid from './components/ProductGrid.vue'
import ProductCard from './components/ProductCard.vue'
import Sidebar from './components/Sidebar.vue'
import MobileMenu from './components/MobileMenu.vue'
import DeviceDebugPanel from './components/DeviceDebugPanel.vue'

const { isMobile, isTablet, isDesktop, deviceType, orientation } = useDevice()

const showMobileMenu = ref(false)
const showDebugPanel = ref(false)

// 模拟商品数据
const products = ref([
  { id: 1, name: '智能手机', price: 3999, image: '📱', category: '电子产品' },
  { id: 2, name: '笔记本电脑', price: 6999, image: '💻', category: '电子产品' },
  { id: 3, name: '无线耳机', price: 899, image: '🎧', category: '配件' },
  { id: 4, name: '智能手表', price: 2199, image: '⌚', category: '穿戴设备' },
  { id: 5, name: '平板电脑', price: 4299, image: '📱', category: '电子产品' },
  { id: 6, name: '相机', price: 8999, image: '📷', category: '电子产品' },
  { id: 7, name: '蓝牙音箱', price: 599, image: '🔊', category: '配件' },
  { id: 8, name: '键盘', price: 399, image: '⌨️', category: '配件' },
])

// 根据设备类型计算列数
const gridColumns = computed(() => {
  if (isMobile.value) return 1
  if (isTablet.value) return 2
  return 3
})

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const toggleDebugPanel = () => {
  showDebugPanel.value = !showDebugPanel.value
}
</script>

<template>
  <div :class="['app', `device-${deviceType}`, `orientation-${orientation}`]">
    <!-- 头部导航 -->
    <AppHeader 
      :is-mobile="isMobile" 
      @toggle-menu="toggleMobileMenu"
      @toggle-debug="toggleDebugPanel"
    />

    <!-- 移动端菜单 -->
    <MobileMenu v-if="isMobile" :show="showMobileMenu" @close="showMobileMenu = false" />

    <div class="app-container">
      <!-- 侧边栏（仅桌面显示） -->
      <Sidebar v-if="isDesktop" />

      <!-- 主内容区 -->
      <main class="app-main">
        <div class="welcome-section">
          <h1>📱 响应式电商网站</h1>
          <p class="subtitle">
            体验根据设备类型自适应的购物界面
          </p>
          <div class="device-info">
            当前设备: <strong>{{ deviceType }}</strong> 
            | 方向: <strong>{{ orientation }}</strong>
            | 列数: <strong>{{ gridColumns }}</strong>
          </div>
        </div>

        <!-- 商品网格 -->
        <ProductGrid :columns="gridColumns">
          <ProductCard 
            v-for="product in products" 
            :key="product.id"
            :product="product"
            :compact="isMobile"
          />
        </ProductGrid>
      </main>
    </div>

    <!-- 调试面板 -->
    <DeviceDebugPanel v-if="showDebugPanel" @close="showDebugPanel = false" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #f5f5f5;
}

.app-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.app-main {
  flex: 1;
  min-width: 0;
}

.welcome-section {
  background: white;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-section h1 {
  margin: 0 0 12px 0;
  font-size: 2rem;
  color: #333;
}

.subtitle {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  color: #666;
}

.device-info {
  padding: 12px 16px;
  background: #f0f7ff;
  border-radius: 8px;
  border-left: 4px solid #4facfe;
  font-size: 0.875rem;
  color: #666;
}

.device-info strong {
  color: #4facfe;
  font-weight: 600;
}

/* 移动端样式 */
.device-mobile .app-container {
  padding: 12px;
}

.device-mobile .welcome-section {
  padding: 20px;
}

.device-mobile .welcome-section h1 {
  font-size: 1.5rem;
}

/* 平板样式 */
.device-tablet .app-container {
  padding: 16px;
}

.device-tablet .welcome-section {
  padding: 24px;
}

/* 横屏优化 */
.orientation-landscape .welcome-section {
  padding: 20px 32px;
}

@media (max-width: 768px) {
  .app-container {
    padding: 12px;
  }
}
</style>


