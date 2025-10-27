/**
 * 辅助类型定义
 */

// Navigator 扩展类型
export type ExtendedNavigator = Navigator & {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
  getBattery?: () => Promise<any>
  battery?: any
  mozBattery?: any
  webkitBattery?: any
  deviceMemory?: number
  hardwareConcurrency?: number
}

// Network Information API
export interface NetworkInformation {
  type?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
  addEventListener?: (type: string, listener: () => void) => void
  removeEventListener?: (type: string, listener: () => void) => void
}

// Battery Manager API
export interface BatteryManager {
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

// Performance 扩展类型
export interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

// Window 扩展类型
export type ExtendedWindow = Window & {
  ononline?: (() => void) | null
  onoffline?: (() => void) | null
}

// Engine Context 类型
export interface EngineContext {
  engine?: {
    getApp: () => unknown
    state?: {
      set: (key: string, value: unknown) => void
      get: (key: string) => unknown
      delete: (key: string) => void
    }
    events?: {
      on: (event: string, handler: () => void) => void
      once: (event: string, handler: () => void) => void
    }
    logger?: {
      info: (message: string, data?: unknown) => void
      error: (message: string, data?: unknown) => void
      warn: (message: string, data?: unknown) => void
    }
  }
}

// 通用函数类型
export type AnyFunction = (...args: unknown[]) => unknown
export type AnyAsyncFunction = (...args: unknown[]) => Promise<unknown>

// 通用对象类型
export type AnyObject = Record<string, unknown>

// Vue Directive Binding 类型
export interface DirectiveBinding<T = unknown> {
  value: T
  oldValue: T | undefined
  arg?: string
  modifiers: Record<string, boolean>
  instance: unknown
  dir: unknown
}

// HTML Element 扩展类型
export type ExtendedHTMLElement = HTMLElement & Record<string, unknown>

// Wake Lock API 类型
export interface WakeLockNavigator extends Navigator {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinel>
  }
}

export interface WakeLockSentinel extends EventTarget {
  readonly released: boolean
  readonly type: 'screen'
  release(): Promise<void>
}

// Screen Orientation API 类型
export interface ScreenOrientationAPI {
  type: string
  angle: number
  lock: (orientation: string) => Promise<void>
  unlock: () => void
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

export interface ScreenWithOrientation extends Screen {
  orientation: ScreenOrientationAPI
  refreshRate?: number
}

// Media Capabilities API 类型
export interface MediaCapabilitiesAPI {
  decodingInfo: (config: MediaDecodingConfiguration) => Promise<MediaCapabilitiesDecodingInfo>
  encodingInfo: (config: MediaEncodingConfiguration) => Promise<MediaCapabilitiesEncodingInfo>
}

export interface MediaDecodingConfiguration {
  type: 'file' | 'media-source'
  video?: VideoConfiguration
  audio?: AudioConfiguration
}

export interface MediaEncodingConfiguration {
  type: 'record' | 'transmission'
  video?: VideoConfiguration
  audio?: AudioConfiguration
}

export interface VideoConfiguration {
  contentType: string
  width: number
  height: number
  bitrate: number
  framerate: number
}

export interface AudioConfiguration {
  contentType: string
  channels?: number
  bitrate?: number
  samplerate?: number
}

export interface MediaCapabilitiesDecodingInfo {
  supported: boolean
  smooth: boolean
  powerEfficient: boolean
}

export interface MediaCapabilitiesEncodingInfo {
  supported: boolean
  smooth: boolean
  powerEfficient: boolean
}

export interface NavigatorWithMediaCapabilities extends Navigator {
  mediaCapabilities: MediaCapabilitiesAPI
}

// Clipboard API 类型
export interface ClipboardAPI {
  writeText: (text: string) => Promise<void>
  readText: () => Promise<string>
  write?: (data: ClipboardItem[]) => Promise<void>
  read?: () => Promise<ClipboardItem[]>
}

export interface NavigatorWithClipboard extends Navigator {
  clipboard: ClipboardAPI
}

// Vibration API 类型
export interface NavigatorWithVibration extends Navigator {
  vibrate: (pattern: number | number[]) => boolean
}