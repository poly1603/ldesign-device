import { useState, useEffect } from 'react'
import { BatteryModule } from '@ldesign/device-battery'
import type { BatteryInfo } from '@ldesign/device-core'

/**
 * 电池检测 Hook
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { level, levelPercentage, isCharging, isSupported } = useBattery()
 *   
 *   if (!isSupported) {
 *     return <div>不支持电池API</div>
 *   }
 *   
 *   return (
 *     <div>
 *       <p>电量: {levelPercentage}%</p>
 *       <p>充电中: {isCharging ? '是' : '否'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useBattery() {
  const [level, setLevel] = useState(1)
  const [levelPercentage, setLevelPercentage] = useState(100)
  const [isCharging, setIsCharging] = useState(false)
  const [chargingTime, setChargingTime] = useState(Infinity)
  const [dischargingTime, setDischargingTime] = useState(Infinity)
  const [isSupported, setIsSupported] = useState(false)
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null)

  useEffect(() => {
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

    return () => {
      if (battery) {
        battery.destroy()
      }
    }
  }, [])

  return {
    level,
    levelPercentage,
    isCharging,
    chargingTime,
    dischargingTime,
    isSupported,
    batteryInfo,
  }
}

