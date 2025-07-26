/**
 * 设备类型枚举
 */
export enum DeviceType {
  /** 桌面设备 */
  DESKTOP = 'desktop',
  /** 平板设备 */
  TABLET = 'tablet',
  /** 移动设备 */
  MOBILE = 'mobile'
}

/**
 * 屏幕方向枚举
 */
export enum Orientation {
  /** 竖屏 */
  PORTRAIT = 'portrait',
  /** 横屏 */
  LANDSCAPE = 'landscape'
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
}

/**
 * 扩展设备信息接口
 */
export interface ExtendedDeviceInfo extends DeviceInfo {
  /** 操作系统信息 */
  os?: {
    name: string
    version: string
  }
  /** 浏览器信息 */
  browser?: {
    name: string
    version: string
  }
  /** 硬件信息 */
  hardware?: {
    cores?: number
    memory?: number
    gpu?: string
  }
  /** 网络信息 */
  network?: {
    type: string
    online: boolean
    downlink?: number
  }
  /** 电池信息 */
  battery?: {
    charging: boolean
    level?: number
    chargingTime?: number
    dischargingTime?: number
  }
}

/**
 * 设备检测配置
 */
export interface DeviceDetectionConfig {
  /** 平板设备的最小宽度阈值 (px) */
  tabletMinWidth?: number
  /** 桌面设备的最小宽度阈值 (px) */
  desktopMinWidth?: number
  /** 是否启用用户代理检测 */
  enableUserAgentDetection?: boolean
  /** 是否启用触摸检测 */
  enableTouchDetection?: boolean
}

/**
 * 设备变化事件数据
 */
export interface DeviceChangeEvent {
  /** 当前设备信息 */
  current: DeviceInfo
  /** 之前的设备信息 */
  previous: DeviceInfo | null
  /** 变化的属性列表 */
  changes: Array<keyof DeviceInfo>
}

/**
 * 设备检测器接口
 */
export interface DeviceDetector {
  /** 获取当前设备信息 */
  getDeviceInfo(): DeviceInfo
  /** 监听设备变化 */
  onDeviceChange(callback: (event: DeviceChangeEvent) => void): () => void
  /** 销毁检测器 */
  destroy(): void
}

/**
 * 扩展设备信息接口（按需加载）
 */
export interface ExtendedDeviceInfo extends DeviceInfo {
  /** 操作系统信息 */
  os?: {
    name: string
    version: string
  }
  /** 浏览器信息 */
  browser?: {
    name: string
    version: string
  }
  /** 硬件信息 */
  hardware?: {
    /** CPU核心数 */
    cores?: number
    /** 内存大小 (GB) */
    memory?: number
    /** GPU信息 */
    gpu?: string
  }
  /** 网络信息 */
  network?: {
    /** 连接类型 */
    type: string
    /** 是否在线 */
    online: boolean
    /** 下行速度 (Mbps) */
    downlink?: number
  }
}

/**
 * 默认设备检测配置
 */
export const DEFAULT_DEVICE_CONFIG: Required<DeviceDetectionConfig> = {
  tabletMinWidth: 768,
  desktopMinWidth: 1024,
  enableUserAgentDetection: true,
  enableTouchDetection: true
}

/**
 * 设备类型字符串联合类型
 */
export type DeviceTypeString = `${DeviceType}`

/**
 * 屏幕方向字符串联合类型
 */
export type OrientationString = `${Orientation}`
