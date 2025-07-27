import type { App, Plugin } from 'vue'
import type { DeviceDetectionConfig } from '../types'
import { DeviceProvider, useDevice } from '../vue'
import { registerDeviceDirectives } from './directives'

/**
 * Vue 插件选项
 */
export interface DevicePluginOptions extends DeviceDetectionConfig {
  /** 是否注册全局组件 */
  registerComponents?: boolean
  /** 是否注册指令 */
  registerDirectives?: boolean
  /** 是否注册全局属性 */
  registerGlobalProperties?: boolean
  /** 组件名称前缀 */
  componentPrefix?: string
}

/**
 * 默认插件选项
 */
const defaultOptions: Required<DevicePluginOptions> = {
  tabletMinWidth: 768,
  desktopMinWidth: 1024,
  enableUserAgentDetection: true,
  enableTouchDetection: true,
  registerComponents: true,
  registerDirectives: true,
  registerGlobalProperties: true,
  componentPrefix: 'L',
}

/**
 * 设备检测 Vue 插件
 */
export const DevicePlugin: Plugin = {
  install(app: App, options: DevicePluginOptions = {}) {
    const opts = { ...defaultOptions, ...options }

    // 注册全局组件
    if (opts.registerComponents) {
      app.component(`${opts.componentPrefix}DeviceProvider`, DeviceProvider)
    }

    // 注册指令
    if (opts.registerDirectives) {
      registerDeviceDirectives(app)
    }

    // 注册全局属性
    if (opts.registerGlobalProperties) {
      const deviceAPI = useDevice(opts)

      app.config.globalProperties.$device = deviceAPI.deviceInfo
      app.config.globalProperties.$isMobile = deviceAPI.isMobile
      app.config.globalProperties.$isTablet = deviceAPI.isTablet
      app.config.globalProperties.$isDesktop = deviceAPI.isDesktop
      app.config.globalProperties.$isPortrait = deviceAPI.isPortrait
      app.config.globalProperties.$isLandscape = deviceAPI.isLandscape
      app.config.globalProperties.$isTouchDevice = deviceAPI.isTouchDevice
    }

    // 提供全局配置
    app.provide('deviceConfig', opts)
  },
}

/**
 * 创建设备检测插件
 */
export function createDevicePlugin(options: DevicePluginOptions = {}): Plugin {
  return {
    install(app: App) {
      DevicePlugin.install!(app, options)
    },
  }
}

/**
 * 安装设备检测插件的便捷函数
 */
export function installDevicePlugin(app: App, options: DevicePluginOptions = {}): void {
  app.use(DevicePlugin, options)
}

/**
 * Vue 3 类型声明扩展
 */
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $device: any
    $isMobile: boolean
    $isTablet: boolean
    $isDesktop: boolean
    $isPortrait: boolean
    $isLandscape: boolean
    $isTouchDevice: boolean
  }
}

/**
 * 插件使用示例
 *
 * @example
 * ```typescript
 * import { createApp } from 'vue'
 * import { DevicePlugin } from '@ldesign/device'
 *
 * const app = createApp({})
 *
 * // 使用默认配置
 * app.use(DevicePlugin)
 *
 * // 使用自定义配置
 * app.use(DevicePlugin, {
 *   tabletMinWidth: 600,
 *   desktopMinWidth: 1200,
 *   registerComponents: true,
 *   registerDirectives: true,
 *   componentPrefix: 'My'
 * })
 *
 * // 或者使用工厂函数
 * app.use(createDevicePlugin({
 *   enableUserAgentDetection: false
 * }))
 * ```
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 使用全局属性 -->
 *   <div v-if="$isMobile">移动端内容</div>
 *
 *   <!-- 使用指令 -->
 *   <div v-mobile>移动端内容</div>
 *   <div v-desktop>桌面端内容</div>
 *
 *   <!-- 使用组件 -->
 *   <LDeviceProvider>
 *     <YourComponent />
 *   </LDeviceProvider>
 * </template>
 *
 * <script setup>
 * // 在组合式 API 中使用
 * import { useDevice } from '@ldesign/device'
 *
 * const { deviceInfo, isMobile, isTablet } = useDevice()
 * </script>
 * ```
 */
