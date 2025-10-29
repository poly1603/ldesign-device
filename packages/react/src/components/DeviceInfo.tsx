import React from 'react'
import { useDevice } from '../hooks/useDevice'

/**
 * 设备信息显示组件
 * 
 * @example
 * ```tsx
 * <DeviceInfo />
 * ```
 */
export function DeviceInfo() {
  const { deviceType, orientation, isMobile, isTablet, isDesktop, deviceInfo } = useDevice()

  return (
    <div className="device-info">
      <h3>设备信息</h3>
      <div>
        <p><strong>设备类型:</strong> {deviceType}</p>
        <p><strong>屏幕方向:</strong> {orientation}</p>
        <p><strong>屏幕尺寸:</strong> {deviceInfo.width} x {deviceInfo.height}</p>
        <p><strong>像素比:</strong> {deviceInfo.pixelRatio}</p>
        <p><strong>触摸支持:</strong> {deviceInfo.isTouchDevice ? '是' : '否'}</p>
        <p>
          <strong>设备标记:</strong>{' '}
          {isMobile && <span className="badge">📱 Mobile</span>}
          {isTablet && <span className="badge">📱 Tablet</span>}
          {isDesktop && <span className="badge">💻 Desktop</span>}
        </p>
      </div>
    </div>
  )
}

