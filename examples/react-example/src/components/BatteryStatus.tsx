import { useState, useEffect } from 'react'
import { BatteryModule } from '@ldesign/device/modules/BatteryModule'
import type { BatteryStatus as IBatteryStatus } from '@ldesign/device'
import './Card.css'

export default function BatteryStatus() {
  const [batteryStatus, setBatteryStatus] = useState<IBatteryStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [battery] = useState(() => new BatteryModule())

  useEffect(() => {
    const init = async () => {
      try {
        const isSupported = await battery.isSupported()
        if (!isSupported) {
          setError('浏览器不支持 Battery API')
          return
        }

        await battery.initialize()
        const status = battery.getBatteryStatus()
        setBatteryStatus(status)

        battery.on('batteryChange', (status) => {
          setBatteryStatus(status)
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取电池信息失败')
      }
    }

    init()

    return () => {
      battery.destroy()
    }
  }, [battery])

  if (error) {
    return (
      <div className="card">
        <h2>🔋 电池状态</h2>
        <p className="error">{error}</p>
      </div>
    )
  }

  if (!batteryStatus) {
    return (
      <div className="card">
        <h2>🔋 电池状态</h2>
        <p className="loading-text">加载中...</p>
      </div>
    )
  }

  const batteryPercentage = Math.round(batteryStatus.level * 100)
  const getBatteryColor = () => {
    if (batteryPercentage > 60) return '#4caf50'
    if (batteryPercentage > 20) return '#ff9800'
    return '#f44336'
  }

  return (
    <div className="card">
      <h2>🔋 电池状态</h2>
      <div className="battery-display">
        <div className="battery-icon">
          <div
            className="battery-level"
            style={{
              width: `${batteryPercentage}%`,
              backgroundColor: getBatteryColor()
            }}
          />
        </div>
        <div className="battery-percentage">{batteryPercentage}%</div>
      </div>
      <div className="info-grid">
        <div className="info-item">
          <span className="label">充电状态</span>
          <span className={`value badge ${batteryStatus.charging ? 'badge-success' : 'badge-gray'}`}>
            {batteryStatus.charging ? '充电中' : '未充电'}
          </span>
        </div>
        {batteryStatus.chargingTime !== Infinity && (
          <div className="info-item">
            <span className="label">充满还需</span>
            <span className="value">{Math.round(batteryStatus.chargingTime / 60)} 分钟</span>
          </div>
        )}
        {batteryStatus.dischargingTime !== Infinity && (
          <div className="info-item">
            <span className="label">剩余时间</span>
            <span className="value">{Math.round(batteryStatus.dischargingTime / 60)} 分钟</span>
          </div>
        )}
      </div>
    </div>
  )
}


