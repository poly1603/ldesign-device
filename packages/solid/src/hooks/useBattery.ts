import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { Accessor } from 'solid-js'
import { BatteryModule } from '@ldesign/device-battery'
import type { BatteryInfo } from '@ldesign/device-core'

/**
 * 电池检测 Hook (Solid.js)
 * 
 * @example
 * ```tsx
 * import { useBattery } from '@ldesign/device-solid'
 * 
 * function App() {
 *   const { levelPercentage, isCharging } = useBattery()
 *   
 *   return (
 *     <div>
 *       <p>电量: {levelPercentage()}%</p>
 *       <p>充电: {isCharging() ? '是' : '否'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useBattery() {
  const [level, setLevel] = createSignal(1)
  const [levelPercentage, setLevelPercentage] = createSignal(100)
  const [isCharging, setIsCharging] = createSignal(false)
  const [chargingTime, setChargingTime] = createSignal(Infinity)
  const [dischargingTime, setDischargingTime] = createSignal(Infinity)
  const [isSupported, setIsSupported] = createSignal(false)
  const [batteryInfo, setBatteryInfo] = createSignal<BatteryInfo | null>(null)

  createEffect(() => {
    let battery: BatteryModule | null = null

    async function init() {
      battery = new BatteryModule()
      await battery.init()

      setIsSupported(battery.isSupported())

      if (battery.isSupported()) {
        updateBatteryInfo()

        battery.on('batteryChange', () => {
          updateBatteryInfo()
        })
      }
    }

    function updateBatteryInfo() {
      if (!battery) return

      const info = battery.getData()
      setBatteryInfo(info)
      setLevel(battery.getLevel())
      setLevelPercentage(battery.getLevelPercentage())
      setIsCharging(battery.isCharging())
      setChargingTime(battery.getChargingTime())
      setDischargingTime(battery.getDischargingTime())
    }

    init()

    onCleanup(() => {
      if (battery) {
        battery.destroy()
      }
    })
  })

  return {
    level: level as Accessor<number>,
    levelPercentage: levelPercentage as Accessor<number>,
    isCharging: isCharging as Accessor<boolean>,
    chargingTime: chargingTime as Accessor<number>,
    dischargingTime: dischargingTime as Accessor<number>,
    isSupported: isSupported as Accessor<boolean>,
    batteryInfo: batteryInfo as Accessor<BatteryInfo | null>,
  }
}

