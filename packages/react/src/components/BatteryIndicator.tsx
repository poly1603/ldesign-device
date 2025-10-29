import React from 'react'
import { useBattery } from '../hooks/useBattery'

/**
 * 电池指示器组件
 * 
 * @example
 * ```tsx
 * <BatteryIndicator />
 * ```
 */
export function BatteryIndicator() {
  const { levelPercentage, isCharging, isSupported } = useBattery()

  if (!isSupported) {
    return (
      <div className="battery-indicator">
        <p>⚠️ 不支持电池API</p>
      </div>
    )
  }

  const getBatteryIcon = () => {
    if (isCharging) return '⚡'
    if (levelPercentage >= 80) return '🔋'
    if (levelPercentage >= 20) return '🔋'
    return '🪫'
  }

  const getBatteryColor = () => {
    if (isCharging) return '#52c41a'
    if (levelPercentage >= 20) return '#1890ff'
    return '#ff4d4f'
  }

  return (
    <div className="battery-indicator">
      <span style={{ fontSize: '2rem' }}>{getBatteryIcon()}</span>
      <div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: getBatteryColor()
        }}>
          {levelPercentage}%
        </div>
        <div style={{ fontSize: '0.875rem', color: '#999' }}>
          {isCharging ? '充电中' : '未充电'}
        </div>
      </div>
    </div>
  )
}

