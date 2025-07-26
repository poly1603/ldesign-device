// 暂时注释掉TSX组件，等待构建配置完善
// export { DeviceInfo, type DeviceInfoProps } from './DeviceInfo'
// export { default as DeviceInfoComponent } from './DeviceInfo'

// 导出组件接口
export interface DeviceInfoProps {
  /** 设备检测配置 */
  config?: any
  /** 是否显示详细信息 */
  detailed?: boolean
  /** 是否显示加载状态 */
  showLoading?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 自定义样式 */
  style?: Record<string, any>
}
