<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDevice } from '@ldesign/device'

const { isMobile, isTablet, isDesktop } = useDevice()

const showMobileMenu = ref(false)

const headerClass = computed(() => ({
  'header-mobile': isMobile.value,
  'header-tablet': isTablet.value,
  'header-desktop': isDesktop.value,
}))

const containerClass = computed(() => ({
  'container': true,
  'container-mobile': isMobile.value,
  'container-tablet': isTablet.value,
  'container-desktop': isDesktop.value,
}))

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function closeMobileMenu() {
  showMobileMenu.value = false
}
</script>

<template>
  <header class="header" :class="headerClass">
    <div :class="containerClass">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <h1>📱 Device Demo</h1>
          <span class="version">v1.0.0</span>
        </div>

        <!-- 桌面导航 -->
        <nav v-desktop class="nav-desktop">
          <ul class="nav-links">
            <li><a href="#device-info">设备信息</a></li>
            <li><a href="#features">功能演示</a></li>
            <li><a href="#directives">指令演示</a></li>
            <li><a href="#responsive">响应式布局</a></li>
            <li><a href="#performance">性能优化</a></li>
          </ul>
        </nav>

        <!-- 移动端菜单按钮 -->
        <button
          v-mobile
          class="menu-toggle"
          :class="{ active: showMobileMenu }"
          @click="toggleMobileMenu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <!-- 移动端导航菜单 -->
      <nav
        v-mobile
        class="nav-mobile"
        :class="{ show: showMobileMenu }"
      >
        <ul class="nav-links-mobile">
          <li><a href="#device-info" @click="closeMobileMenu">设备信息</a></li>
          <li><a href="#features" @click="closeMobileMenu">功能演示</a></li>
          <li><a href="#directives" @click="closeMobileMenu">指令演示</a></li>
          <li><a href="#responsive" @click="closeMobileMenu">响应式布局</a></li>
          <li><a href="#performance" @click="closeMobileMenu">性能优化</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: var(--bg-color);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.version {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
}

.nav-desktop .nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--primary-color);
}

/* 移动端菜单按钮 */
.menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.menu-toggle span {
  width: 100%;
  height: 2px;
  background: var(--text-color);
  transition: all 0.3s ease;
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* 移动端导航菜单 */
.nav-mobile {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.nav-mobile.show {
  max-height: 300px;
}

.nav-links-mobile {
  list-style: none;
  margin: 0;
  padding: 1rem 0;
}

.nav-links-mobile li {
  margin: 0.5rem 0;
}

.nav-links-mobile a {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: var(--radius);
  transition: background-color 0.3s ease;
}

.nav-links-mobile a:hover {
  background: var(--bg-secondary);
  color: var(--primary-color);
}

/* 移动端优化 */
.header-mobile .logo h1 {
  font-size: 1.25rem;
}

.header-mobile .version {
  font-size: 0.625rem;
}

/* 平板优化 */
.header-tablet .header-content {
  padding: 1.25rem 0;
}
</style>
