/**
 * @ldesign/device 辅助类型定义
 *
 * 提供浏览器 API 扩展类型、工具类型和通用类型定义
 *
 * @packageDocumentation
 */

// ==================== 类型工具 ====================

/**
 * 深度只读类型
 * 将对象及其所有嵌套属性设为只读
 *
 * @template T - 要转换的类型
 * @example
 * ```typescript
 * type ReadonlyUser = DeepReadonly<{ name: string; address: { city: string } }>
 * // { readonly name: string; readonly address: { readonly city: string } }
 * ```
 */
export type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T

/**
 * 深度可选类型
 * 将对象及其所有嵌套属性设为可选
 *
 * @template T - 要转换的类型
 */
export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

/**
 * 深度必选类型
 * 将对象及其所有嵌套属性设为必选
 *
 * @template T - 要转换的类型
 */
export type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T

/**
 * 从类型中提取非空属性
 *
 * @template T - 源类型
 */
export type NonNullableProperties<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

/**
 * 提取事件处理器参数类型
 *
 * @template T - 事件映射类型
 * @template K - 事件名称
 */
export type EventPayload<
  T extends Record<string, unknown>,
  K extends keyof T,
> = T[K]

/**
 * 可为空类型
 *
 * @template T - 源类型
 */
export type Nullable<T> = T | null

/**
 * 可选可空类型
 *
 * @template T - 源类型
 */
export type Maybe<T> = T | null | undefined

/**
 * 字符串字面量类型的自动补全
 * 允许自动补全的同时也允许任意字符串
 *
 * @template T - 字面量类型
 */
export type LiteralUnion<T extends string> = T | (string & Record<never, never>)

// ==================== Navigator 扩展类型 ====================

/**
 * 扩展的 Navigator 接口
 * 包含各浏览器的私有 API 和实验性 API
 */
export type ExtendedNavigator = Navigator & {
  /** Network Information API */
  connection?: NetworkInformation
  /** Firefox Network Information API */
  mozConnection?: NetworkInformation
  /** WebKit Network Information API */
  webkitConnection?: NetworkInformation
  /** Battery Status API */
  getBattery?: () => Promise<BatteryManager>
  /** 旧版 Battery API */
  battery?: BatteryManager
  /** Firefox Battery API */
  mozBattery?: BatteryManager
  /** WebKit Battery API */
  webkitBattery?: BatteryManager
  /** 设备内存大小 (GB) */
  deviceMemory?: number
  /** 逻辑处理器数量 */
  hardwareConcurrency?: number
}

// ==================== Network Information API ====================

/**
 * Network Information API 接口
 * 提供网络连接信息和状态
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */
export interface NetworkInformation {
  /**
   * 连接类型
   * @example 'wifi', 'cellular', 'ethernet', 'bluetooth', 'none', 'other', 'unknown'
   */
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'
  /**
   * 有效连接类型（基于实际网络性能估算）
   * @example 'slow-2g', '2g', '3g', '4g'
   */
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  /** 下行链路速度估算 (Mbps) */
  downlink?: number
  /** 往返时延估算 (ms) */
  rtt?: number
  /** 用户是否启用了数据节省模式 */
  saveData?: boolean
  /** 下行链路最大速度 (Mbps) */
  downlinkMax?: number
  /** 添加事件监听器 */
  addEventListener?: (type: 'change', listener: () => void) => void
  /** 移除事件监听器 */
  removeEventListener?: (type: 'change', listener: () => void) => void
}

// ==================== Battery Status API ====================

/**
 * Battery Status API 电池管理器接口
 * 提供设备电池状态信息
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BatteryManager
 */
export interface BatteryManager extends EventTarget {
  /** 电池电量 (0.0 - 1.0) */
  readonly level: number
  /** 是否正在充电 */
  readonly charging: boolean
  /** 距离充满的时间 (秒)，Infinity 表示未在充电 */
  readonly chargingTime: number
  /** 距离电量耗尽的时间 (秒)，Infinity 表示正在充电 */
  readonly dischargingTime: number
  /** 充电状态变化事件 */
  onchargingchange: ((this: BatteryManager, ev: Event) => void) | null
  /** 充电时间变化事件 */
  onchargingtimechange: ((this: BatteryManager, ev: Event) => void) | null
  /** 放电时间变化事件 */
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => void) | null
  /** 电量变化事件 */
  onlevelchange: ((this: BatteryManager, ev: Event) => void) | null
  /** 添加事件监听器 */
  addEventListener: (
    type: 'chargingchange' | 'chargingtimechange' | 'dischargingtimechange' | 'levelchange',
    listener: () => void
  ) => void
  /** 移除事件监听器 */
  removeEventListener: (
    type: 'chargingchange' | 'chargingtimechange' | 'dischargingtimechange' | 'levelchange',
    listener: () => void
  ) => void
}

// ==================== Performance 扩展类型 ====================

/**
 * 内存信息接口 (Chrome 专有)
 */
export interface MemoryInfo {
  /** 已使用的 JS 堆内存大小 (bytes) */
  usedJSHeapSize: number
  /** JS 堆内存总大小 (bytes) */
  totalJSHeapSize: number
  /** JS 堆内存大小限制 (bytes) */
  jsHeapSizeLimit: number
}

/**
 * 扩展的 Performance 接口
 * 包含非标准的 memory 属性
 */
export interface ExtendedPerformance extends Performance {
  /** Chrome 专有的内存信息 */
  memory?: MemoryInfo
}

// ==================== Window 扩展类型 ====================

/**
 * 扩展的 Window 接口
 * 包含在线/离线事件处理器
 */
export type ExtendedWindow = Window & {
  /** 网络上线事件处理器 */
  ononline?: ((this: Window, ev: Event) => void) | null
  /** 网络离线事件处理器 */
  onoffline?: ((this: Window, ev: Event) => void) | null
}

// ==================== LDesign Engine 类型 ====================

/**
 * Engine 状态管理接口
 */
export interface EngineState {
  /** 设置状态 */
  set: <T = unknown>(key: string, value: T) => void
  /** 获取状态 */
  get: <T = unknown>(key: string) => T | undefined
  /** 删除状态 */
  delete: (key: string) => boolean
  /** 检查状态是否存在 */
  has?: (key: string) => boolean
}

/**
 * Engine 事件系统接口
 */
export interface EngineEvents {
  /** 订阅事件 */
  on: <T = unknown>(event: string, handler: (data: T) => void) => void
  /** 订阅一次性事件 */
  once: <T = unknown>(event: string, handler: (data: T) => void) => void
  /** 取消订阅 */
  off?: <T = unknown>(event: string, handler?: (data: T) => void) => void
  /** 触发事件 */
  emit?: <T = unknown>(event: string, data?: T) => void
}

/**
 * Engine 日志系统接口
 */
export interface EngineLogger {
  /** 信息日志 */
  info: (message: string, data?: unknown) => void
  /** 错误日志 */
  error: (message: string, data?: unknown) => void
  /** 警告日志 */
  warn: (message: string, data?: unknown) => void
  /** 调试日志 */
  debug?: (message: string, data?: unknown) => void
}

/**
 * LDesign Engine 上下文接口
 * 用于 Engine 插件集成
 */
export interface EngineContext {
  engine?: {
    /** 获取 Vue 应用实例 */
    getApp: () => unknown
    /** 状态管理 */
    state?: EngineState
    /** 事件系统 */
    events?: EngineEvents
    /** 日志系统 */
    logger?: EngineLogger
    /** 插件配置 */
    config?: Record<string, unknown>
  }
}

// ==================== 通用类型 ====================

/**
 * 任意函数类型
 */
export type AnyFunction = (...args: unknown[]) => unknown

/**
 * 任意异步函数类型
 */
export type AnyAsyncFunction = (...args: unknown[]) => Promise<unknown>

/**
 * 任意对象类型
 */
export type AnyObject = Record<string, unknown>

/**
 * 提取 Promise 内部类型
 *
 * @template T - Promise 类型
 */
export type Awaited<T> = T extends Promise<infer R> ? R : T

/**
 * 函数参数类型（第一个参数）
 *
 * @template T - 函数类型
 */
export type FirstParameter<T extends AnyFunction> = T extends (first: infer F, ...args: unknown[]) => unknown ? F : never

/**
 * 函数返回类型（如果是 Promise 则解包）
 *
 * @template T - 函数类型
 */
export type AsyncReturnType<T extends AnyAsyncFunction> = T extends (...args: unknown[]) => Promise<infer R> ? R : never

// ==================== Vue 相关类型 ====================

/**
 * Vue 指令绑定类型
 *
 * @template T - 绑定值类型
 */
export interface DirectiveBinding<T = unknown> {
  /** 当前绑定值 */
  value: T
  /** 旧绑定值 */
  oldValue: T | undefined
  /** 指令参数 (v-directive:arg) */
  arg?: string
  /** 指令修饰符 (v-directive.modifier) */
  modifiers: Record<string, boolean>
  /** 组件实例 */
  instance: unknown
  /** 指令定义对象 */
  dir: unknown
}

/**
 * 扩展的 HTMLElement 类型
 * 允许存储自定义属性
 */
export type ExtendedHTMLElement = HTMLElement & Record<string, unknown>

/**
 * 带有设备指令状态的元素
 */
export interface DeviceDirectiveElement extends HTMLElement {
  /** 原始 display 样式 */
  _originalDisplay?: string
  /** 设备指令处理状态 */
  _deviceDirective?: {
    mounted: boolean
    cleanup?: () => void
  }
}

// ==================== Wake Lock API ====================

/**
 * Wake Lock API Navigator 扩展
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
 */
export interface WakeLockNavigator extends Navigator {
  wakeLock?: WakeLock
}

/**
 * Wake Lock 接口
 */
export interface WakeLock {
  /**
   * 请求屏幕唤醒锁
   *
   * @param type - 锁类型，目前仅支持 'screen'
   * @returns WakeLockSentinel 实例
   */
  request: (type: 'screen') => Promise<WakeLockSentinel>
}

/**
 * Wake Lock Sentinel 接口
 * 表示一个活跃的唤醒锁
 */
export interface WakeLockSentinel extends EventTarget {
  /** 是否已释放 */
  readonly released: boolean
  /** 锁类型 */
  readonly type: 'screen'
  /** 释放事件 */
  onrelease: ((this: WakeLockSentinel, ev: Event) => void) | null
  /** 释放唤醒锁 */
  release(): Promise<void>
}

// ==================== Screen Orientation API ====================

/**
 * 屏幕方向锁定类型
 */
export type OrientationLockType =
  | 'any'
  | 'natural'
  | 'landscape'
  | 'portrait'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape-primary'
  | 'landscape-secondary'

/**
 * 屏幕方向类型
 */
export type OrientationType =
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape-primary'
  | 'landscape-secondary'

/**
 * Screen Orientation API 接口
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation
 */
export interface ScreenOrientationAPI extends EventTarget {
  /** 当前方向类型 */
  readonly type: OrientationType
  /** 当前方向角度 (0, 90, 180, 270) */
  readonly angle: number
  /** 方向变化事件 */
  onchange: ((this: ScreenOrientationAPI, ev: Event) => void) | null
  /**
   * 锁定屏幕方向
   *
   * @param orientation - 目标方向
   * @returns Promise，锁定成功时 resolve
   */
  lock: (orientation: OrientationLockType) => Promise<void>
  /** 解除方向锁定 */
  unlock: () => void
  /** 添加事件监听器 */
  addEventListener: (type: 'change', listener: () => void) => void
  /** 移除事件监听器 */
  removeEventListener: (type: 'change', listener: () => void) => void
}

/**
 * 带有 Orientation API 的 Screen 接口
 */
export interface ScreenWithOrientation extends Screen {
  /** Screen Orientation API */
  orientation: ScreenOrientationAPI
  /** 屏幕刷新率 (Hz) */
  refreshRate?: number
}

// ==================== Media Capabilities API ====================

/**
 * Media Capabilities API 接口
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaCapabilities
 */
export interface MediaCapabilitiesAPI {
  /**
   * 查询媒体解码能力
   *
   * @param config - 解码配置
   * @returns 解码能力信息
   */
  decodingInfo: (config: MediaDecodingConfiguration) => Promise<MediaCapabilitiesDecodingInfo>
  /**
   * 查询媒体编码能力
   *
   * @param config - 编码配置
   * @returns 编码能力信息
   */
  encodingInfo: (config: MediaEncodingConfiguration) => Promise<MediaCapabilitiesEncodingInfo>
}

/**
 * 媒体解码配置
 */
export interface MediaDecodingConfiguration {
  /** 解码类型 */
  type: 'file' | 'media-source' | 'webrtc'
  /** 视频配置 */
  video?: VideoConfiguration
  /** 音频配置 */
  audio?: AudioConfiguration
}

/**
 * 媒体编码配置
 */
export interface MediaEncodingConfiguration {
  /** 编码类型 */
  type: 'record' | 'transmission' | 'webrtc'
  /** 视频配置 */
  video?: VideoConfiguration
  /** 音频配置 */
  audio?: AudioConfiguration
}

/**
 * 视频配置
 */
export interface VideoConfiguration {
  /** MIME 类型 (如 'video/mp4; codecs="avc1.42E01E"') */
  contentType: string
  /** 视频宽度 (px) */
  width: number
  /** 视频高度 (px) */
  height: number
  /** 比特率 (bps) */
  bitrate: number
  /** 帧率 (fps) */
  framerate: number
  /** 是否为 HDR 内容 */
  hdrMetadataType?: 'smpteSt2086' | 'smpteSt2094-10' | 'smpteSt2094-40'
  /** 色彩空间 */
  colorGamut?: 'srgb' | 'p3' | 'rec2020'
  /** 传输函数 */
  transferFunction?: 'srgb' | 'pq' | 'hlg'
}

/**
 * 音频配置
 */
export interface AudioConfiguration {
  /** MIME 类型 (如 'audio/mp4; codecs="mp4a.40.2"') */
  contentType: string
  /** 声道数 */
  channels?: number
  /** 比特率 (bps) */
  bitrate?: number
  /** 采样率 (Hz) */
  samplerate?: number
  /** 是否为空间音频 */
  spatialRendering?: boolean
}

/**
 * 媒体解码能力信息
 */
export interface MediaCapabilitiesDecodingInfo {
  /** 是否支持解码 */
  supported: boolean
  /** 是否能流畅播放 */
  smooth: boolean
  /** 是否节能 */
  powerEfficient: boolean
  /** 关键系统访问配置 (用于 DRM) */
  keySystemAccess?: MediaKeySystemAccess
}

/**
 * 媒体编码能力信息
 */
export interface MediaCapabilitiesEncodingInfo {
  /** 是否支持编码 */
  supported: boolean
  /** 是否能流畅编码 */
  smooth: boolean
  /** 是否节能 */
  powerEfficient: boolean
}

/**
 * 带有 Media Capabilities API 的 Navigator
 */
export interface NavigatorWithMediaCapabilities extends Navigator {
  mediaCapabilities: MediaCapabilitiesAPI
}

// ==================== Clipboard API ====================

/**
 * Clipboard API 接口
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
 */
export interface ClipboardAPI {
  /**
   * 写入文本到剪贴板
   *
   * @param text - 要写入的文本
   */
  writeText: (text: string) => Promise<void>
  /**
   * 从剪贴板读取文本
   *
   * @returns 剪贴板中的文本
   */
  readText: () => Promise<string>
  /**
   * 写入多种格式数据到剪贴板
   *
   * @param data - ClipboardItem 数组
   */
  write?: (data: ClipboardItem[]) => Promise<void>
  /**
   * 从剪贴板读取多种格式数据
   *
   * @returns ClipboardItem 数组
   */
  read?: () => Promise<ClipboardItem[]>
}

/**
 * 带有 Clipboard API 的 Navigator
 */
export interface NavigatorWithClipboard extends Navigator {
  clipboard: ClipboardAPI
}

// ==================== Vibration API ====================

/**
 * 带有 Vibration API 的 Navigator
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 */
export interface NavigatorWithVibration extends Navigator {
  /**
   * 触发设备振动
   *
   * @param pattern - 振动模式
   *   - number: 单次振动毫秒数
   *   - number[]: 交替的振动和暂停毫秒数 [振动, 暂停, 振动, ...]
   * @returns 是否成功触发振动
   *
   * @example
   * ```typescript
   * // 振动 200ms
   * navigator.vibrate(200)
   *
   * // 振动模式: 振动100ms, 暂停50ms, 振动100ms
   * navigator.vibrate([100, 50, 100])
   *
   * // 停止振动
   * navigator.vibrate(0)
   * ```
   */
  vibrate: (pattern: number | number[]) => boolean
}

// ==================== 设备检测辅助类型 ====================

/**
 * 设备检测结果详情
 */
export interface DetectionDetails {
  /** 检测方法 */
  method: 'screen' | 'viewport' | 'userAgent'
  /** 置信度 (0-1) */
  confidence: number
  /** 检测时间戳 */
  timestamp: number
  /** 原始数据 */
  rawData?: {
    screenWidth?: number
    screenHeight?: number
    viewportWidth?: number
    viewportHeight?: number
    userAgent?: string
  }
}

/**
 * 设备性能等级
 */
export type DevicePerformanceLevel = 'low' | 'medium' | 'high' | 'unknown'

/**
 * 设备性能信息
 */
export interface DevicePerformanceInfo {
  /** 性能等级 */
  level: DevicePerformanceLevel
  /** CPU 核心数 */
  cpuCores?: number
  /** 设备内存 (GB) */
  deviceMemory?: number
  /** JS 堆内存使用率 (0-1) */
  memoryUsage?: number
  /** 估算的性能分数 (0-100) */
  score?: number
}

/**
 * 浏览器特性支持检测结果
 */
export interface BrowserFeatures {
  /** 触摸支持 */
  touch: boolean
  /** WebGL 支持 */
  webgl: boolean
  /** WebGL2 支持 */
  webgl2?: boolean
  /** WebGPU 支持 */
  webgpu?: boolean
  /** Service Worker 支持 */
  serviceWorker?: boolean
  /** Web Worker 支持 */
  webWorker?: boolean
  /** SharedArrayBuffer 支持 */
  sharedArrayBuffer?: boolean
  /** IndexedDB 支持 */
  indexedDB?: boolean
  /** WebSocket 支持 */
  webSocket?: boolean
  /** WebRTC 支持 */
  webRTC?: boolean
  /** Gamepad API 支持 */
  gamepad?: boolean
  /** Bluetooth API 支持 */
  bluetooth?: boolean
  /** USB API 支持 */
  usb?: boolean
  /** NFC API 支持 */
  nfc?: boolean
}
