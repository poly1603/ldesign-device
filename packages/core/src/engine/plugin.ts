/**
 * @ldesign/device Engine 插件
 */
import type { DeviceEnginePluginOptions } from './types'
import { DeviceDetector } from '../core/DeviceDetector'

export const deviceStateKeys = {
  DETECTOR: 'device:detector' as const,
  INFO: 'device:info' as const,
} as const

export const deviceEventKeys = {
  INSTALLED: 'device:installed' as const,
  UNINSTALLED: 'device:uninstalled' as const,
  CHANGED: 'device:changed' as const,
} as const

export function createDeviceEnginePlugin(options: DeviceEnginePluginOptions = {}) {
  let detector: DeviceDetector | null = null
  return {
    name: 'device',
    version: '1.0.0',
    dependencies: options.dependencies ?? [],

    async install(context: any) {
      const engine = context.engine || context
      detector = new DeviceDetector(options as any)
      engine.state?.set(deviceStateKeys.DETECTOR, detector)
      engine.state?.set(deviceStateKeys.INFO, detector.getDeviceInfo?.() ?? {})
      engine.events?.emit(deviceEventKeys.INSTALLED, { name: 'device' })
      engine.logger?.info('[Device Plugin] installed')
    },

    async uninstall(context: any) {
      const engine = context.engine || context
      detector?.destroy?.(); detector = null
      engine.state?.delete(deviceStateKeys.DETECTOR)
      engine.state?.delete(deviceStateKeys.INFO)
      engine.events?.emit(deviceEventKeys.UNINSTALLED, {})
      engine.logger?.info('[Device Plugin] uninstalled')
    },
  }
}
