// 设备检测器
export * from './DeviceDetector'

// 特性检测器
export * from './FeatureDetector'

// 重新导出主要API
export { 
  createDeviceDetector, 
  getGlobalDeviceDetector, 
  getDeviceInfo, 
  onDeviceChange 
} from './DeviceDetector'

export { 
  getGlobalFeatureDetector, 
  getExtendedDeviceInfo 
} from './FeatureDetector'
