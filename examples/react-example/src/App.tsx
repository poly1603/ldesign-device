import { useState, useEffect } from 'react'
import { DeviceDetector } from '@ldesign/device'
import type { DeviceInfo } from '@ldesign/device'
import DeviceInfoCard from './components/DeviceInfoCard'
import BatteryStatus from './components/BatteryStatus'
import NetworkStatus from './components/NetworkStatus'
import GeolocationInfo from './components/GeolocationInfo'
import ResponsiveLayout from './components/ResponsiveLayout'
import './App.css'

function App() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [detector] = useState(() => new DeviceDetector({
    enableResize: true,
    enableOrientation: true,
    debounceDelay: 200
  }))

  useEffect(() => {
    // 初始化设备信息
    setDeviceInfo(detector.getDeviceInfo())

    // 监听设备变化
    const handleDeviceChange = (info: DeviceInfo) => {
      setDeviceInfo(info)
    }

    detector.on('deviceChange', handleDeviceChange)

    return () => {
      detector.off('deviceChange', handleDeviceChange)
      detector.destroy()
    }
  }, [detector])

  if (!deviceInfo) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className={`app layout-${deviceInfo.type}`}>
      <header className="app-header">
        <h1>📱 @ldesign/device React 示例</h1>
        <p>展示设备检测和各种设备相关功能</p>
      </header>

      <main className="app-main">
        <ResponsiveLayout deviceType={deviceInfo.type}>
          {/* 设备信息卡片 */}
          <DeviceInfoCard deviceInfo={deviceInfo} />

          {/* 电池状态 */}
          <BatteryStatus />

          {/* 网络状态 */}
          <NetworkStatus />

          {/* 地理位置 */}
          <GeolocationInfo />
        </ResponsiveLayout>
      </main>

      <footer className="app-footer">
        <p>
          当前设备: <strong>{deviceInfo.type}</strong> |
          方向: <strong>{deviceInfo.orientation}</strong> |
          尺寸: <strong>{deviceInfo.width} × {deviceInfo.height}</strong>
        </p>
      </footer>
    </div>
  )
}

export default App


