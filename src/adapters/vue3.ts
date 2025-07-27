import type { App, Directive, Plugin } from 'vue'
import { inject, provide } from 'vue'
import type { DeviceDetectionConfig } from '../types'
import { useDevice, useDeviceType, useOrientation } from '../vue'
import type {
  AdapterConfig,
  AdapterFactory,
  FullFrameworkAdapter,
} from './types'
import { BaseAdapter } from './types'

/**
 * Vue3 设备检测上下文 Key
 */
export const DEVICE_CONTEXT_KEY = Symbol('device-context')

/**
 * Vue3 适配器实现
 */
export class Vue3Adapter extends BaseAdapter implements FullFrameworkAdapter {
  name = 'vue3'
  version = '1.0.0'

  private app: App | null = null

  /**
   * 安装适配器到 Vue 应用
   */
  install(app: App, options: DeviceDetectionConfig = {}): void {
    this.app = app
    this.init(options)

    // 注册全局属性
    app.config.globalProperties.$device = this.createReactiveDeviceInfo(options)

    // 注册组件
    app.component('DeviceProvider', this.createDeviceProviderComponent())
    app.component('DeviceInfo', this.createDeviceInfoComponent())

    // 注册指令
    this.registerDirectives()
  }

  /**
   * 创建响应式设备信息
   */
  createReactiveDeviceInfo(config?: DeviceDetectionConfig) {
    return useDevice(config)
  }

  /**
   * 创建响应式设备类型
   */
  createReactiveDeviceType(config?: DeviceDetectionConfig) {
    return useDeviceType(config)
  }

  /**
   * 创建响应式屏幕方向
   */
  createReactiveOrientation(config?: DeviceDetectionConfig) {
    return useOrientation(config)
  }

  /**
   * 创建设备信息组件
   */
  createDeviceInfoComponent(props?: any) {
    return {
      name: 'DeviceInfo',
      props: {
        detailed: {
          type: Boolean,
          default: false,
        },
        showLoading: {
          type: Boolean,
          default: true,
        },
        config: {
          type: Object,
          default: () => ({}),
        },
      },
      setup(props: any) {
        const { deviceInfo, isLoading, error } = useDevice(props.config)

        return {
          deviceInfo,
          isLoading,
          error,
        }
      },
      template: `
        <div class="ldesign-device-info">
          <div v-if="isLoading && showLoading" class="loading">
            检测设备信息中...
          </div>
          <div v-else-if="error" class="error">
            设备检测失败: {{ error.message }}
          </div>
          <div v-else class="device-info">
            <div class="info-item">
              <span class="label">设备类型:</span>
              <span class="value">{{ deviceInfo.type }}</span>
            </div>
            <div class="info-item">
              <span class="label">屏幕方向:</span>
              <span class="value">{{ deviceInfo.orientation }}</span>
            </div>
            <div class="info-item">
              <span class="label">屏幕尺寸:</span>
              <span class="value">{{ deviceInfo.width }} × {{ deviceInfo.height }}</span>
            </div>
            <div v-if="detailed" class="detailed-info">
              <div class="info-item">
                <span class="label">像素比:</span>
                <span class="value">{{ deviceInfo.pixelRatio }}</span>
              </div>
              <div class="info-item">
                <span class="label">触摸设备:</span>
                <span class="value">{{ deviceInfo.isTouchDevice ? '是' : '否' }}</span>
              </div>
            </div>
          </div>
        </div>
      `,
    }
  }

  /**
   * 创建设备提供者组件
   */
  createDeviceProviderComponent(props?: any) {
    return {
      name: 'DeviceProvider',
      props: {
        config: {
          type: Object,
          default: () => ({}),
        },
      },
      setup(props: any, { slots }: any) {
        const deviceContext = useDevice(props.config)

        // 提供设备上下文
        provide(DEVICE_CONTEXT_KEY, deviceContext)

        return () => slots.default?.()
      },
    }
  }

  /**
   * 注册设备相关指令
   */
  registerDirectives(): void {
    if (!this.app)
return

    // v-device 指令 - 根据设备类型显示/隐藏
    this.app.directive('device', this.createDeviceDirective())

    // v-mobile 指令 - 仅在移动设备显示
    this.app.directive('mobile', this.createConditionalDirective('mobile'))

    // v-tablet 指令 - 仅在平板设备显示
    this.app.directive('tablet', this.createConditionalDirective('tablet'))

    // v-desktop 指令 - 仅在桌面设备显示
    this.app.directive('desktop', this.createConditionalDirective('desktop'))

    // v-portrait 指令 - 仅在竖屏显示
    this.app.directive('portrait', this.createConditionalDirective('portrait'))

    // v-landscape 指令 - 仅在横屏显示
    this.app.directive('landscape', this.createConditionalDirective('landscape'))

    // v-touch 指令 - 仅在触摸设备显示
    this.app.directive('touch', this.createConditionalDirective('touch'))
  }

  /**
   * 创建设备指令
   */
  private createDeviceDirective(): Directive {
    return {
      mounted(el, binding) {
        const { deviceInfo } = useDevice()
        const targetDevices = Array.isArray(binding.value) ? binding.value : [binding.value]

        const updateVisibility = () => {
          const shouldShow = targetDevices.includes(deviceInfo.value.type)
          el.style.display = shouldShow ? '' : 'none'
        }

        updateVisibility()

        // 存储更新函数以便清理
        el._deviceDirectiveUpdate = updateVisibility
      },
      unmounted(el) {
        if (el._deviceDirectiveUpdate) {
          delete el._deviceDirectiveUpdate
        }
      },
    }
  }

  /**
   * 创建条件渲染指令
   */
  createConditionalDirective(condition: string): Directive {
    return {
      mounted(el, binding) {
        const { deviceInfo } = useDevice()

        const updateVisibility = () => {
          let shouldShow = false

          switch (condition) {
            case 'mobile':
              shouldShow = deviceInfo.value.type === 'mobile'
              break
            case 'tablet':
              shouldShow = deviceInfo.value.type === 'tablet'
              break
            case 'desktop':
              shouldShow = deviceInfo.value.type === 'desktop'
              break
            case 'portrait':
              shouldShow = deviceInfo.value.orientation === 'portrait'
              break
            case 'landscape':
              shouldShow = deviceInfo.value.orientation === 'landscape'
              break
            case 'touch':
              shouldShow = deviceInfo.value.isTouchDevice
              break
          }

          // 支持取反
          if (binding.modifiers.not) {
            shouldShow = !shouldShow
          }

          el.style.display = shouldShow ? '' : 'none'
        }

        updateVisibility()

        // 存储更新函数以便清理
        el._conditionalDirectiveUpdate = updateVisibility
      },
      unmounted(el) {
        if (el._conditionalDirectiveUpdate) {
          delete el._conditionalDirectiveUpdate
        }
      },
    }
  }

  /**
   * 销毁适配器
   */
  destroy(): void {
    super.destroy()
    this.app = null
  }
}

/**
 * Vue3 适配器工厂
 */
export class Vue3AdapterFactory implements AdapterFactory {
  create(config?: DeviceDetectionConfig): Vue3Adapter {
    return new Vue3Adapter()
  }

  isCompatible(): boolean {
    try {
      // 检查是否在 Vue 3 环境中
      if (typeof window === 'undefined') {
        return false
      }

      const vue = (window as any).Vue
      return vue && vue.version && vue.version.startsWith('3.')
    }
 catch {
      return false
    }
  }

  getSupportedVersions(): string[] {
    return ['3.0.0', '3.1.0', '3.2.0', '3.3.0', '3.4.0']
  }
}

/**
 * 创建 Vue3 插件
 */
export function createVue3Plugin(options: AdapterConfig = {}): Plugin {
  return {
    install(app: App) {
      const adapter = new Vue3Adapter()
      adapter.install(app, options)
    },
  }
}

/**
 * 使用设备上下文的组合式函数
 */
export function useDeviceContext() {
  const context = inject(DEVICE_CONTEXT_KEY)
  if (!context) {
    throw new Error('useDeviceContext must be used within DeviceProvider')
  }
  return context
}
