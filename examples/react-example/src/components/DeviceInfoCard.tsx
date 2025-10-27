import type { DeviceInfo } from '@ldesign/device'
import './Card.css'

interface Props {
  deviceInfo: DeviceInfo
}

export default function DeviceInfoCard({ deviceInfo }: Props) {
  return (
    <div className="card">
      <h2>🖥️ 设备信息</h2>
      <div className="info-grid">
        <div className="info-item">
          <span className="label">设备类型</span>
          <span className="value badge badge-primary">{deviceInfo.type}</span>
        </div>
        <div className="info-item">
          <span className="label">屏幕方向</span>
          <span className="value badge badge-secondary">{deviceInfo.orientation}</span>
        </div>
        <div className="info-item">
          <span className="label">屏幕尺寸</span>
          <span className="value">{deviceInfo.width} × {deviceInfo.height}</span>
        </div>
        <div className="info-item">
          <span className="label">像素比</span>
          <span className="value">{deviceInfo.pixelRatio}</span>
        </div>
        <div className="info-item">
          <span className="label">触摸支持</span>
          <span className={`value badge ${deviceInfo.isTouchDevice ? 'badge-success' : 'badge-gray'}`}>
            {deviceInfo.isTouchDevice ? '是' : '否'}
          </span>
        </div>
        <div className="info-item">
          <span className="label">视口尺寸</span>
          <span className="value">{deviceInfo.viewport.width} × {deviceInfo.viewport.height}</span>
        </div>
        {deviceInfo.browser && (
          <div className="info-item full-width">
            <span className="label">浏览器</span>
            <span className="value">
              {deviceInfo.browser.name} {deviceInfo.browser.version}
            </span>
          </div>
        )}
        {deviceInfo.os && (
          <div className="info-item full-width">
            <span className="label">操作系统</span>
            <span className="value">
              {deviceInfo.os.name} {deviceInfo.os.version}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}


