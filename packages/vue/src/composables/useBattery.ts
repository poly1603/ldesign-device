import { ref, readonly, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { BatteryModule } from '@ldesign/device-battery'
import type { BatteryInfo } from '@ldesign/device-core'

/**
 * 电池检测 Composable
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useBattery } from '@ldesign/device-vue'
 * 
 * const { level, isCharging, isSupported } = useBattery()
 * </script>
 * ```
 */
export function useBattery() {
  const level = ref(1)
  const levelPercentage = ref(100)
  const isCharging = ref(false)
  const chargingTime = ref(Infinity)
  const dischargingTime = ref(Infinity)
  const isSupported = ref(false)
  const batteryInfo = ref<BatteryInfo | null>(null)

  let battery: BatteryModule | null = null

  async function init() {
    battery = new BatteryModule()
    await battery.init()

    isSupported.value = battery.isSupported()

    if (isSupported.value) {
      updateBatteryInfo()

      battery.on('batteryChange', () => {
        updateBatteryInfo()
      })
    }
  }

  function updateBatteryInfo() {
    if (!battery) return

    const info = battery.getData()
    batteryInfo.value = info
    level.value = battery.getLevel()
    levelPercentage.value = battery.getLevelPercentage()
    isCharging.value = battery.isCharging()
    chargingTime.value = battery.getChargingTime()
    dischargingTime.value = battery.getDischargingTime()
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    if (battery) {
      battery.destroy()
    }
  })

  return {
    level: readonly(level),
    levelPercentage: readonly(levelPercentage),
    isCharging: readonly(isCharging),
    chargingTime: readonly(chargingTime),
    dischargingTime: readonly(dischargingTime),
    isSupported: readonly(isSupported),
    batteryInfo: readonly(batteryInfo),
  }
}

