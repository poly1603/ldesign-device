import type { Directive, App } from 'vue'
import { useDevice } from '../vue'
import type { DeviceType, Orientation } from '../types'

/**
 * 设备指令绑定值类型
 */
type DeviceDirectiveValue = DeviceType | DeviceType[] | string | string[]

/**
 * 条件指令修饰符
 */
interface ConditionalModifiers {
  not?: boolean
}

/**
 * 创建设备类型指令
 */
function createDeviceDirective(): Directive<HTMLElement, DeviceDirectiveValue> {
  return {
    mounted(el, binding) {
      const { deviceInfo } = useDevice()
      const targetDevices = Array.isArray(binding.value) ? binding.value : [binding.value]
      
      const updateVisibility = () => {
        const shouldShow = targetDevices.includes(deviceInfo.value.type)
        el.style.display = shouldShow ? '' : 'none'
      }

      updateVisibility()
      
      // 监听设备变化
      const unwatch = deviceInfo.value ? (() => {
        // 这里需要实现响应式监听
        // 暂时使用简单的定时检查
        const interval = setInterval(updateVisibility, 100)
        return () => clearInterval(interval)
      })() : () => {}
      
      // 存储清理函数
      ;(el as any)._deviceDirectiveCleanup = unwatch
    },
    
    updated(el, binding) {
      // 重新计算可见性
      const { deviceInfo } = useDevice()
      const targetDevices = Array.isArray(binding.value) ? binding.value : [binding.value]
      const shouldShow = targetDevices.includes(deviceInfo.value.type)
      el.style.display = shouldShow ? '' : 'none'
    },
    
    unmounted(el) {
      const cleanup = (el as any)._deviceDirectiveCleanup
      if (cleanup) {
        cleanup()
        delete (el as any)._deviceDirectiveCleanup
      }
    }
  }
}

/**
 * 创建条件渲染指令
 */
function createConditionalDirective(
  condition: 'mobile' | 'tablet' | 'desktop' | 'portrait' | 'landscape' | 'touch'
): Directive<HTMLElement, boolean | undefined, ConditionalModifiers> {
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

        // 支持自定义值
        if (binding.value !== undefined) {
          shouldShow = shouldShow && binding.value
        }

        el.style.display = shouldShow ? '' : 'none'
      }

      updateVisibility()
      
      // 监听设备变化
      const unwatch = (() => {
        const interval = setInterval(updateVisibility, 100)
        return () => clearInterval(interval)
      })()
      
      // 存储清理函数
      ;(el as any)._conditionalDirectiveCleanup = unwatch
    },
    
    updated(el, binding) {
      // 重新计算可见性
      const { deviceInfo } = useDevice()
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

      if (binding.modifiers.not) {
        shouldShow = !shouldShow
      }

      if (binding.value !== undefined) {
        shouldShow = shouldShow && binding.value
      }

      el.style.display = shouldShow ? '' : 'none'
    },
    
    unmounted(el) {
      const cleanup = (el as any)._conditionalDirectiveCleanup
      if (cleanup) {
        cleanup()
        delete (el as any)._conditionalDirectiveCleanup
      }
    }
  }
}

/**
 * 所有设备指令
 */
export const deviceDirectives = {
  // v-device - 根据设备类型显示/隐藏
  device: createDeviceDirective(),
  
  // v-mobile - 仅在移动设备显示
  mobile: createConditionalDirective('mobile'),
  
  // v-tablet - 仅在平板设备显示
  tablet: createConditionalDirective('tablet'),
  
  // v-desktop - 仅在桌面设备显示
  desktop: createConditionalDirective('desktop'),
  
  // v-portrait - 仅在竖屏显示
  portrait: createConditionalDirective('portrait'),
  
  // v-landscape - 仅在横屏显示
  landscape: createConditionalDirective('landscape'),
  
  // v-touch - 仅在触摸设备显示
  touch: createConditionalDirective('touch')
}

/**
 * 注册所有设备指令
 */
export function registerDeviceDirectives(app: App): void {
  Object.entries(deviceDirectives).forEach(([name, directive]) => {
    app.directive(name, directive)
  })
}

/**
 * 单独注册指令的函数
 */
export function registerDirective(app: App, name: keyof typeof deviceDirectives): void {
  const directive = deviceDirectives[name]
  if (directive) {
    app.directive(name, directive)
  } else {
    console.warn(`Unknown device directive: ${name}`)
  }
}

/**
 * 获取指令
 */
export function getDirective(name: keyof typeof deviceDirectives): Directive | undefined {
  return deviceDirectives[name]
}

/**
 * 指令使用示例
 * 
 * @example
 * ```vue
 * <template>
 *   <!-- 仅在移动设备显示 -->
 *   <div v-mobile>移动端内容</div>
 *   
 *   <!-- 仅在非移动设备显示 -->
 *   <div v-mobile.not>非移动端内容</div>
 *   
 *   <!-- 根据设备类型显示 -->
 *   <div v-device="'mobile'">移动端</div>
 *   <div v-device="['tablet', 'desktop']">平板或桌面</div>
 *   
 *   <!-- 根据方向显示 -->
 *   <div v-portrait>竖屏内容</div>
 *   <div v-landscape>横屏内容</div>
 *   
 *   <!-- 触摸设备专用 -->
 *   <div v-touch>触摸设备内容</div>
 * </template>
 * ```
 */
