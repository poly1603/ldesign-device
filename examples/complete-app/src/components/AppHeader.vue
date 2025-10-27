<script setup lang="ts">
defineProps<{
  isMobile: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-menu'): void
  (e: 'toggle-debug'): void
}>()
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Logo -->
      <div class="logo">
        <span class="logo-icon">🛒</span>
        <span class="logo-text">云商城</span>
      </div>

      <!-- 移动端菜单按钮 -->
      <button v-if="isMobile" class="menu-button" @click="emit('toggle-menu')">
        ☰
      </button>

      <!-- 桌面端导航 -->
      <nav v-else class="nav">
        <a href="#" class="nav-link">首页</a>
        <a href="#" class="nav-link">分类</a>
        <a href="#" class="nav-link">优惠</a>
        <a href="#" class="nav-link">购物车</a>
      </nav>

      <!-- 调试按钮 -->
      <button class="debug-button" @click="emit('toggle-debug')" title="设备调试面板">
        🔧
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.logo-icon {
  font-size: 1.5rem;
}

.nav {
  flex: 1;
  display: flex;
  gap: 24px;
  margin-left: 40px;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #4facfe;
}

.menu-button,
.debug-button {
  padding: 8px 12px;
  border: none;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-button:hover,
.debug-button:hover {
  background: #e0e0e0;
}

.menu-button {
  margin-left: auto;
}

.debug-button {
  margin-left: auto;
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }

  .logo {
    font-size: 1.125rem;
  }
}
</style>


