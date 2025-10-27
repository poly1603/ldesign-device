import { useState, useEffect } from 'react'
import { NetworkModule } from '@ldesign/device/modules/NetworkModule'
import type { NetworkStatus as INetworkStatus } from '@ldesign/device'
import './Card.css'

export default function NetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<INetworkStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [network] = useState(() => new NetworkModule())

  useEffect(() => {
    const init = async () => {
      try {
        const isSupported = await network.isSupported()
        if (!isSupported) {
          setError('浏览器不支持 Network API')
          return
        }

        await network.initialize()
        const status = network.getNetworkStatus()
        setNetworkStatus(status)

        network.on('networkChange', (status) => {
          setNetworkStatus(status)
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取网络信息失败')
      }
    }

    init()

    return () => {
      network.destroy()
    }
  }, [network])

  if (error) {
    return (
      <div className="card">
        <h2>📡 网络状态</h2>
        <p className="error">{error}</p>
      </div>
    )
  }

  if (!networkStatus) {
    return (
      <div className="card">
        <h2>📡 网络状态</h2>
        <p className="loading-text">加载中...</p>
      </div>
    )
  }

  const getConnectionTypeIcon = () => {
    switch (networkStatus.type) {
      case 'wifi': return '📶'
      case '4g': return '📱'
      case '3g': return '📱'
      case '2g': return '📱'
      case 'ethernet': return '🔌'
      default: return '❓'
    }
  }

  return (
    <div className="card">
      <h2>📡 网络状态</h2>
      <div className="network-status">
        <div className="network-icon">{getConnectionTypeIcon()}</div>
        <div className={`connection-badge badge ${networkStatus.online ? 'badge-success' : 'badge-error'}`}>
          {networkStatus.online ? '在线' : '离线'}
        </div>
      </div>
      <div className="info-grid">
        <div className="info-item">
          <span className="label">连接类型</span>
          <span className="value badge badge-primary">
            {networkStatus.type?.toUpperCase() || '未知'}
          </span>
        </div>
        <div className="info-item">
          <span className="label">有效类型</span>
          <span className="value">{networkStatus.effectiveType || '未知'}</span>
        </div>
        {networkStatus.downlink !== undefined && (
          <div className="info-item">
            <span className="label">下载速度</span>
            <span className="value">{networkStatus.downlink} Mbps</span>
          </div>
        )}
        {networkStatus.rtt !== undefined && (
          <div className="info-item">
            <span className="label">延迟</span>
            <span className="value">{networkStatus.rtt} ms</span>
          </div>
        )}
        <div className="info-item">
          <span className="label">省流量模式</span>
          <span className={`value badge ${networkStatus.saveData ? 'badge-warning' : 'badge-gray'}`}>
            {networkStatus.saveData ? '开启' : '关闭'}
          </span>
        </div>
      </div>
    </div>
  )
}


