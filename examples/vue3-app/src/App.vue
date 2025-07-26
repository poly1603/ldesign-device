<template>
  <LDeviceProvider>
    <div id="app" :class="appClass">
      <!-- 导航栏 -->
      <AppHeader />
      
      <!-- 主要内容 -->
      <main class="main">
        <div :class="containerClass">
          <!-- 设备信息展示 -->
          <DeviceInfoSection />
          
          <!-- 功能演示 -->
          <FeaturesDemo />
          
          <!-- 指令演示 -->
          <DirectivesDemo />
          
          <!-- 响应式布局演示 -->
          <ResponsiveLayoutDemo />
          
          <!-- 性能优化演示 -->
          <PerformanceDemo />
        </div>
      </main>
      
      <!-- 页脚 -->
      <AppFooter />
    </div>
  </LDeviceProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDevice } from '@ldesign/device'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import DeviceInfoSection from './components/DeviceInfoSection.vue'
import FeaturesDemo from './components/FeaturesDemo.vue'
import DirectivesDemo from './components/DirectivesDemo.vue'
import ResponsiveLayoutDemo from './components/ResponsiveLayoutDemo.vue'
import PerformanceDemo from './components/PerformanceDemo.vue'

const { isMobile, isTablet, isDesktop } = useDevice()

const appClass = computed(() => ({
  'app-mobile': isMobile.value,
  'app-tablet': isTablet.value,
  'app-desktop': isDesktop.value
}))

const containerClass = computed(() => ({
  'container': true,
  'container-mobile': isMobile.value,
  'container-tablet': isTablet.value,
  'container-desktop': isDesktop.value
}))
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.app-mobile .main {
  padding: 1rem 0;
}

.app-tablet .main {
  padding: 1.5rem 0;
}

.app-desktop .main {
  padding: 2rem 0;
}
</style>
