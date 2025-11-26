import { ref, readonly, onUnmounted } from 'vue'
import type { NetworkInfo, DeviceDetector } from '@ldesign/device-core'
import { DeviceDetector as CoreDeviceDetector } from '@ldesign/device-core'

export function useNetwork() {
  const networkInfo = ref<NetworkInfo | null>(null)
  const isLoaded = ref(false)
  let detector: DeviceDetector | null = null

  async function loadModule() {
    if (isLoaded.value) return
    try {
      detector = new CoreDeviceDetector({})
      await detector.loadModule('network')
      const module = detector.getModule('network')
      if (module && typeof module.getData === 'function') {
        networkInfo.value = module.getData()
      }
      detector.on('network:changed', () => {
        const module = detector?.getModule('network')
        if (module && typeof module.getData === 'function') {
          networkInfo.value = module.getData()
        }
      })
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load network module:', error)
    }
  }

  function unloadModule() {
    if (detector) {
      detector.unloadModule('network')
      detector = null
    }
    isLoaded.value = false
    networkInfo.value = null
  }

  onUnmounted(() => {
    unloadModule()
  })

  return {
    networkInfo: readonly(networkInfo),
    isLoaded: readonly(isLoaded),
    loadModule,
    unloadModule,
  }
}