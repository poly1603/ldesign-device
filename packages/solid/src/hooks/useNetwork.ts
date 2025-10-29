import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { Accessor } from 'solid-js'
import { NetworkModule } from '@ldesign/device-network'
import type { NetworkInfo } from '@ldesign/device-core'

/**
 * 网络检测 Hook (Solid.js)
 * 
 * @example
 * ```tsx
 * import { useNetwork } from '@ldesign/device-solid'
 * 
 * function App() {
 *   const { isOnline, connectionType } = useNetwork()
 *   
 *   return (
 *     <div>
 *       <p>在线: {isOnline() ? '是' : '否'}</p>
 *       <p>连接: {connectionType()}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useNetwork() {
  const [isOnline, setIsOnline] = createSignal(true)
  const [connectionType, setConnectionType] = createSignal('unknown')
  const [downlink, setDownlink] = createSignal<number | undefined>(undefined)
  const [rtt, setRTT] = createSignal<number | undefined>(undefined)
  const [saveData, setSaveData] = createSignal<boolean | undefined>(undefined)
  const [networkInfo, setNetworkInfo] = createSignal<NetworkInfo | null>(null)

  createEffect(() => {
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

    onCleanup(() => {
      if (network) {
        network.destroy()
      }
    })
  })

  return {
    isOnline: isOnline as Accessor<boolean>,
    connectionType: connectionType as Accessor<string>,
    downlink: downlink as Accessor<number | undefined>,
    rtt: rtt as Accessor<number | undefined>,
    saveData: saveData as Accessor<boolean | undefined>,
    networkInfo: networkInfo as Accessor<NetworkInfo | null>,
  }
}

