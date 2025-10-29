/**
 * 事件监听器类型
 */
export type EventListener<T = unknown> = (data: T) => void

/**
 * 设备类型枚举
 */
export type DeviceType = 'desktop' | 'tablet' | 'mobile'

/**
 * 屏幕方向枚举
 */
export type Orientation = 'portrait' | 'landscape'

/**
 * 设备模块接口
 */
export interface DeviceModule {
  /** 模块名称 */
  name: string
  /** 初始化模块 */
  init: () => Promise<void> | void
  /** 销毁模块 */
  destroy: () => Promise<void> | void
  /** 获取模块数据 */
  getData: () => unknown
}

/**
 * 设备信息接口
 */
export interface DeviceInfo {
  /** 设备类型 */
  type: DeviceType
  /** 屏幕方向 */
  orientation: Orientation
  /** 屏幕宽度 */
  width: number
  /** 屏幕高度 */
  height: number
  /** 设备像素比 */
  pixelRatio: number
  /** 是否为触摸设备 */
  isTouchDevice: boolean
  /** 用户代理字符串 */
  userAgent: string
  /** 操作系统信息 */
  os: {
    name: string
    version: string
  }
  /** 浏览器信息 */
  browser: {
    name: string
    version: string
  }
}

/**
 * 电池信息接口
 */
export interface BatteryInfo {
  /** 电池电量（0-1） */
  level: number
  /** 是否正在充电 */
  charging: boolean
  /** 充电时间（秒） */
  chargingTime: number
  /** 放电时间（秒） */
  dischargingTime: number
}

/**
 * 网络信息接口
 */
export interface NetworkInfo {
  /** 在线状态 */
  online: boolean
  /** 连接类型 */
  type?: string
  /** 有效类型 */
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g'
  /** 下载速度（Mbps） */
  downlink?: number
  /** 往返时间（毫秒） */
  rtt?: number
  /** 是否省流量模式 */
  saveData?: boolean
}

/**
 * 地理位置信息接口
 */
export interface GeolocationInfo {
  /** 纬度 */
  latitude: number
  /** 经度 */
  longitude: number
  /** 精度（米） */
  accuracy: number
  /** 海拔（米） */
  altitude: number | null
  /** 海拔精度（米） */
  altitudeAccuracy: number | null
  /** 方向（度） */
  heading: number | null
  /** 速度（米/秒） */
  speed: number | null
  /** 时间戳 */
  timestamp?: number
}


