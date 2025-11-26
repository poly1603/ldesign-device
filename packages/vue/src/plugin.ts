import type { App, Plugin } from 'vue'
import { inject } from 'vue'
import type { DeviceDetector } from '@ldesign/device-core'
import { DeviceDetector as CoreDeviceDetector } from '@ldesign/device-core'
import { vDevice } from './directives/vDevice'
import { DEVICE_INJECTION_KEY } from './constants'

/**
 * Device 插件选项
 */
export interface DevicePluginOptions {
  /** 全局属性名称 */
  globalPropertyName?: string
  /** 是否注册组件 */
  registerComponents?: boolean
  /** 是否注册指令 */
  registerDirectives?: boolean
  /** 设备检测器配置 */
  enableResize?: boolean
  enableOrientation?: boolean
  modules?: string[]
}

/**
 * 创建 Device Vue 插件
 *
 * @param detector - 设备检测器实例(可选,如果不提供则自动创建)
 * @param options - 插件选项
 * @returns Vue Plugin
 */
export function createDevicePlugin(
  detector?: DeviceDetector,
  options: DevicePluginOptions = {}
): Plugin {
  const {
    globalPropertyName = '$device',
    registerComponents = true,
    registerDirectives = true,
    enableResize = true,
    enableOrientation = true,
    modules = [],
  } = options

  return {
    install(app: App) {
      // 创建或使用提供的检测器实例
      const deviceDetector = detector || new CoreDeviceDetector({
        enableResize,
        enableOrientation,
      })

      // 加载模块
      if (!detector && modules.length > 0) {
        for (const moduleName of modules) {
          deviceDetector.loadModule(moduleName).catch((error) => {
            console.warn(`[Device Plugin] Failed to load module: ${moduleName}`, error)
          })
        }
      }

      // 注册全局属性
      if (globalPropertyName) {
        app.config.globalProperties[globalPropertyName] = deviceDetector
      }

      // 提供依赖注入
      app.provide(DEVICE_INJECTION_KEY, deviceDetector)

      // 注册指令
      if (registerDirectives) {
        app.directive('device', vDevice)
      }

      // 在应用卸载时清理资源
      const originalUnmount = app.unmount
      app.unmount = function () {
        if (typeof deviceDetector.destroy === 'function') {
          deviceDetector.destroy()
        }
        return originalUnmount.call(this)
      }
    },
  }
}

/**
 * 在组合式 API 中获取设备检测器实例
 *
 * @returns DeviceDetector 实例
 */
export function useDeviceDetector(): DeviceDetector | null {
  return inject(DEVICE_INJECTION_KEY, null)
}
