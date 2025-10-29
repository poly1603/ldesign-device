import { ref, readonly, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { NetworkModule } from '@ldesign/device-network'
import type { NetworkInfo } from '@ldesign/device-core'

/**
 * 网络检测 Composable
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useNetwork } from '@ldesign/device-vue'
 * 
 * const { isOnline, connectionType } = useNetwork()
 * </script>
 * ```
 */
export function useNetwork() {
  const isOnline = ref(true)
  const connectionType = ref('unknown')
  const downlink = ref<number | undefined>(undefined)
  const rtt = ref<number | undefined>(undefined)
  const saveData = ref<boolean | undefined>(undefined)
  const networkInfo = ref<NetworkInfo | null>(null)

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
    networkInfo.value = info
    isOnline.value = network.isOnline()
    connectionType.value = network.getConnectionType()
    downlink.value = network.getDownlink()
    rtt.value = network.getRTT()
    saveData.value = network.isSaveData()
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    if (network) {
      network.destroy()
    }
  })

  return {
    isOnline: readonly(isOnline),
    connectionType: readonly(connectionType),
    downlink: readonly(downlink),
    rtt: readonly(rtt),
    saveData: readonly(saveData),
    networkInfo: readonly(networkInfo),
  }
}

