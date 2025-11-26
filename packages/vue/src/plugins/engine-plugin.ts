/**
 * Device Engine Plugin
 * 
 * 将 Device 功能集成到 LDesign Engine
 * 
 * @example
 * ```ts
 * import { createVueEngine } from '@ldesign/engine-vue3'
 * import { createDeviceEnginePlugin } from '@ldesign/device-vue/plugins'
 * 
 * const engine = createVueEngine({
 *   plugins: [
 *     createDeviceEnginePlugin({
 *       enableResize: true,
 *       enableOrientation: true,
 *       modules: ['network', 'battery'],
 *     })
 *   ]
 * })
 * ```
 */
import type { DeviceDetector } from '@ldesign/device-core'
import { DeviceDetector as CoreDeviceDetector } from '@ldesign/device-core'
import { createDevicePlugin } from '../plugin'

/**
 * Engine Plugin 接口 (临时定义,等待 @ldesign/engine-core 包)
 */
export interface Plugin<Options = Record<string, unknown>> {
  readonly name: string
  readonly version?: string
  readonly dependencies?: string[]
  install: (context: PluginContext, options?: Options) => void | Promise<void>
  uninstall?: (context: PluginContext) => void | Promise<void>
}

/**
 * Plugin API 接口
 */
export interface PluginAPI {
  name: string
  version: string
  [key: string]: unknown
}

/**
 * Plugin Context 接口 (临时定义)
 */
export interface PluginContext {
  engine: {
    state: {
      set: (key: string, value: unknown) => void
      get: (key: string) => unknown
      delete: (key: string) => void
    }
    api: {
      /** 注册插件 API，接收包含 name 和 version 的对象 */
      register: (api: PluginAPI) => void
      get: (name: string) => unknown
      unregister: (name: string) => void
    }
    events: {
      emit: (event: string, data?: unknown) => void
      on: (event: string, handler: (data?: unknown) => void) => void
      off: (event: string, handler: (data?: unknown) => void) => void
    }
    getApp: () => unknown
  }
}

/**
 * Device Engine 插件选项
 */
export interface DeviceEnginePluginOptions {
  /** 插件名称 */
  name?: string
  /** 插件版本 */
  version?: string
  /** 是否启用调试 */
  debug?: boolean
  /** 设备检测器配置 */
  enableResize?: boolean
  enableOrientation?: boolean
  modules?: string[]
  /** Vue 插件配置 */
  globalPropertyName?: string
  registerComponents?: boolean
  registerDirectives?: boolean
}

/**
 * 创建 Device Engine 插件
 * 
 * @param options - 插件配置选项
 * @returns Engine Plugin
 */
export function createDeviceEnginePlugin(
  options: DeviceEnginePluginOptions = {}
): Plugin {
  const {
    name = 'device',
    version = '1.0.0',
    debug = false,
    enableResize = true,
    enableOrientation = true,
    modules = ['network', 'battery'],
    globalPropertyName = '$device',
    registerComponents = true,
    registerDirectives = true,
  } = options

  return {
    name,
    version,

    async install(context: PluginContext) {
      const { engine } = context

      if (debug) {
        console.log('[Device Plugin] Installing...')
      }

      // 1. 创建设备检测器实例
      const detector = new CoreDeviceDetector({
        enableResize,
        enableOrientation,
      })

      // 2. 加载模块
      for (const moduleName of modules) {
        try {
          await detector.loadModule(moduleName)
          if (debug) {
            console.log(`[Device Plugin] Module loaded: ${moduleName}`)
          }
        }
        catch (error) {
          console.warn(`[Device Plugin] Failed to load module: ${moduleName}`, error)
        }
      }

      // 3. 注册到 Engine State (全局状态)
      engine.state.set('device:instance', detector)
      engine.state.set('device:info', detector.getDeviceInfo())

      // 4. 注册到 Engine API (API 访问)
      engine.api.register({
        name,
        version,

        /** 获取设备检测器实例 */
        getInstance: () => detector,

        /** 获取设备信息 */
        getDeviceInfo: () => detector.getDeviceInfo(),

        /** 获取设备类型 */
        getDeviceType: () => detector.getDeviceInfo().type,

        /** 是否移动设备 */
        isMobile: () => detector.getDeviceInfo().type === 'mobile',

        /** 是否平板设备 */
        isTablet: () => detector.getDeviceInfo().type === 'tablet',

        /** 是否桌面设备 */
        isDesktop: () => detector.getDeviceInfo().type === 'desktop',

        /** 刷新设备信息 */
        refresh: () => {
          const info = detector.getDeviceInfo()
          engine.state.set('device:info', info)
          return info
        },
      })

      // 5. 监听设备变化,更新 Engine State
      detector.on('deviceChange', (info) => {
        engine.state.set('device:info', info)
        engine.events.emit('device:change', info)
      })

      detector.on('orientationChange', (orientation) => {
        engine.events.emit('device:orientation-change', orientation)
      })

      // 6. 安装 Vue 插件
      const app = engine.getApp()
      if (app && typeof app === 'object' && 'use' in app) {
        (app as { use: (plugin: unknown) => void }).use(createDevicePlugin(detector, {
          globalPropertyName,
          registerComponents,
          registerDirectives,
        }))
      }

      if (debug) {
        console.log('[Device Plugin] Installed successfully')
        console.log('[Device Plugin] Device Info:', detector.getDeviceInfo())
      }
    },

    async uninstall(context: PluginContext) {
      const { engine } = context

      // 清理资源
      const detector = engine.state.get('device:instance') as DeviceDetector | undefined
      if (detector && typeof detector.destroy === 'function') {
        detector.destroy()
      }

      // 清理状态
      engine.state.delete('device:instance')
      engine.state.delete('device:info')

      // 注销 API
      engine.api.unregister('device')
    },
  }
}

/**
 * 默认 Device Engine 插件
 */
export const devicePlugin = createDeviceEnginePlugin()

