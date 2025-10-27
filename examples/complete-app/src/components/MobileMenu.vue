<script setup lang="ts">
defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const menuItems = [
  { name: '首页', icon: '🏠' },
  { name: '分类', icon: '📦' },
  { name: '优惠', icon: '🎁' },
  { name: '购物车', icon: '🛒' },
  { name: '我的', icon: '👤' },
]
</script>

<template>
  <Transition name="menu">
    <div v-if="show" class="mobile-menu-overlay" @click="emit('close')">
      <div class="mobile-menu" @click.stop>
        <div class="menu-header">
          <h2>菜单</h2>
          <button class="close-button" @click="emit('close')">✕</button>
        </div>
        <nav class="menu-nav">
          <a 
            v-for="item in menuItems" 
            :key="item.name"
            href="#" 
            class="menu-item"
            @click="emit('close')"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            <span class="menu-name">{{ item.name }}</span>
            <span class="menu-arrow">›</span>
          </a>
        </nav>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.mobile-menu {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  max-width: 300px;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.menu-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.close-button {
  padding: 8px;
  border: none;
  background: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
}

.menu-nav {
  padding: 12px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  text-decoration: none;
  color: #333;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-icon {
  font-size: 1.5rem;
}

.menu-name {
  flex: 1;
  font-weight: 500;
}

.menu-arrow {
  font-size: 1.5rem;
  color: #999;
}

/* 动画 */
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s;
}

.menu-enter-active .mobile-menu,
.menu-leave-active .mobile-menu {
  transition: transform 0.3s;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.menu-enter-from .mobile-menu,
.menu-leave-to .mobile-menu {
  transform: translateX(100%);
}
</style>


