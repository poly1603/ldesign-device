import { useState, useEffect } from 'react'
import { NetworkModule } from '@ldesign/device-network'
import type { NetworkInfo } from '@ldesign/device-core'

/**
 * 网络检测 Hook
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { isOnline, connectionType } = useNetwork()
 *   
 *   return (
 *     <div>
 *       <p>在线状态: {isOnline ? '在线' : '离线'}</p>
 *       <p>连接类型: {connectionType}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useNetwork() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState('unknown')
  const [downlink, setDownlink] = useState<number | undefined>(undefined)
  const [rtt, setRTT] = useState<number | undefined>(undefined)
  const [saveData, setSaveData] = useState<boolean | undefined>(undefined)
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null)

  useEffect(() => {
    let network: NetworkModule | null = null

    async function init() {
      network = new NetworkModule()
      await network.init()

      updateNetworkInfo()

      network.on('networkChange', () => {
        updateNetworkInfo()
      })
    }

    function updateNetworkInfo() {
      if (!network) return

      const info = network.getData()
      setNetworkInfo(info)
      setIsOnline(network.isOnline())
      setConnectionType(network.getConnectionType())
      setDownlink(network.getDownlink())
      setRTT(network.getRTT())
      setSaveData(network.isSaveData())
    }

    init()

    return () => {
      if (network) {
        network.destroy()
      }
    }
  }, [])

  return {
    isOnline,
    connectionType,
    downlink,
    rtt,
    saveData,
    networkInfo,
  }
}

