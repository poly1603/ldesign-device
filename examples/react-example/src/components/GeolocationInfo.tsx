import { useState } from 'react'
import { GeolocationModule } from '@ldesign/device/modules/GeolocationModule'
import type { GeolocationPosition } from '@ldesign/device'
import './Card.css'

export default function GeolocationInfo() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [geolocation] = useState(() => new GeolocationModule())

  const getLocation = async () => {
    try {
      setLoading(true)
      setError(null)

      const isSupported = await geolocation.isSupported()
      if (!isSupported) {
        setError('浏览器不支持 Geolocation API')
        return
      }

      await geolocation.initialize()
      const pos = await geolocation.getCurrentPosition()
      setPosition(pos)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取位置信息失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>📍 地理位置</h2>

      {!position && !error && (
        <div className="center">
          <button
            className="btn btn-primary"
            onClick={getLocation}
            disabled={loading}
          >
            {loading ? '获取中...' : '获取位置'}
          </button>
        </div>
      )}

      {error && (
        <div className="error-box">
          <p className="error">{error}</p>
          <button className="btn btn-secondary" onClick={getLocation}>
            重试
          </button>
        </div>
      )}

      {position && (
        <div className="info-grid">
          <div className="info-item">
            <span className="label">纬度</span>
            <span className="value">{position.coords.latitude.toFixed(6)}</span>
          </div>
          <div className="info-item">
            <span className="label">经度</span>
            <span className="value">{position.coords.longitude.toFixed(6)}</span>
          </div>
          {position.coords.accuracy && (
            <div className="info-item">
              <span className="label">精度</span>
              <span className="value">{Math.round(position.coords.accuracy)} 米</span>
            </div>
          )}
          {position.coords.altitude !== null && (
            <div className="info-item">
              <span className="label">海拔</span>
              <span className="value">{Math.round(position.coords.altitude!)} 米</span>
            </div>
          )}
          {position.coords.speed !== null && (
            <div className="info-item">
              <span className="label">速度</span>
              <span className="value">{position.coords.speed} m/s</span>
            </div>
          )}
          {position.coords.heading !== null && (
            <div className="info-item">
              <span className="label">方向</span>
              <span className="value">{position.coords.heading}°</span>
            </div>
          )}
          <div className="info-item full-width">
            <button className="btn btn-secondary btn-small" onClick={getLocation}>
              刷新位置
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


