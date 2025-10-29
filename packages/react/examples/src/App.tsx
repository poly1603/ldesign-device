import React from 'react'
import {
  useDevice,
  useBattery,
  useNetwork,
  DeviceInfo,
  BatteryIndicator,
  NetworkStatus,
} from '@ldesign/device-react'
import './App.css'

export function App() {
  const { deviceType, isMobile, isTablet, isDesktop } = useDevice()
  const { levelPercentage, isCharging, isSupported } = useBattery()
  const { isOnline } = useNetwork()

  return (
    <div className="app">
      <header className="header">
        <h1>⚛️ @ldesign/device-react</h1>
        <p>React 18 设备检测演示</p>
      </header>

      <div className="grid">
        <div className="card">
          <h2>📊 设备状态</h2>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-icon">📱</div>
              <div className="status-label">设备类型</div>
              <div className="status-value">{deviceType}</div>
            </div>
            {isSupported && (
              <div className="status-item">
                <div className="status-icon">🔋</div>
                <div className="status-label">电池电量</div>
                <div className="status-value">{levelPercentage}%</div>
              </div>
            )}
            <div className="status-item">
              <div className="status-icon">🌐</div>
              <div className="status-label">网络状态</div>
              <div className="status-value">{isOnline ? '在线' : '离线'}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <DeviceInfo />
        </div>

        {isSupported && (
          <div className="card">
            <h2>🔋 电池指示器</h2>
            <BatteryIndicator />
          </div>
        )}

        <div className="card">
          <NetworkStatus />
        </div>
      </div>

      {levelPercentage < 20 && !isCharging && (
        <div className="alert alert-danger">
          ⚠️ 电量不足，请及时充电
        </div>
      )}

      {!isOnline && (
        <div className="alert alert-warning">
          📡 网络已断开，请检查网络连接
        </div>
      )}
    </div>
  )
}

