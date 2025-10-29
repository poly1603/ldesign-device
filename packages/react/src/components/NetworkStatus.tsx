import React from 'react'
import { useNetwork } from '../hooks/useNetwork'

/**
 * 网络状态显示组件
 * 
 * @example
 * ```tsx
 * <NetworkStatus />
 * ```
 */
export function NetworkStatus() {
  const { isOnline, connectionType, downlink, rtt, saveData } = useNetwork()

  return (
    <div className="network-status">
      <h3>网络状态</h3>
      <div>
        <p>
          <strong>在线状态:</strong>{' '}
          <span className={isOnline ? 'status-online' : 'status-offline'}>
            {isOnline ? '🟢 在线' : '🔴 离线'}
          </span>
        </p>
        <p><strong>连接类型:</strong> {connectionType}</p>
        {downlink !== undefined && (
          <p><strong>下载速度:</strong> {downlink} Mbps</p>
        )}
        {rtt !== undefined && (
          <p><strong>延迟:</strong> {rtt} ms</p>
        )}
        {saveData !== undefined && (
          <p><strong>省流量模式:</strong> {saveData ? '开启' : '关闭'}</p>
        )}
      </div>
    </div>
  )
}

