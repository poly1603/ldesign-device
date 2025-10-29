import { BatteryModule } from '@ldesign/device-battery'

const battery = new BatteryModule()

// DOM 元素
const unsupportedAlert = document.getElementById('unsupported-alert')!
const batteryIcon = document.getElementById('battery-icon')!
const batteryLevel = document.getElementById('battery-level')!
const batteryStatus = document.getElementById('battery-status')!
const chargingBadge = document.getElementById('charging-badge')!
const chargingTime = document.getElementById('charging-time')!
const dischargingTime = document.getElementById('discharging-time')!
const log = document.getElementById('log')!

function addLog(message: string) {
  const item = document.createElement('div')
  item.className = 'log-item'
  const time = new Date().toLocaleTimeString()
  item.textContent = `[${time}] ${message}`
  log.appendChild(item)
  log.scrollTop = log.scrollHeight
}

function formatTime(seconds: number): string {
  if (seconds === Infinity) return '∞'
  if (seconds < 0) return '--'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function getBatteryIcon(level: number, charging: boolean): string {
  if (charging) return '⚡'
  if (level >= 0.9) return '🔋'
  if (level >= 0.5) return '🔋'
  if (level >= 0.2) return '🪫'
  return '🪫'
}

function updateUI() {
  const info = battery.getData()
  const percentage = battery.getLevelPercentage()
  const status = battery.getBatteryStatus()
  const charging = battery.isCharging()

  // 更新电量
  batteryLevel.textContent = `${percentage}%`
  batteryLevel.className = 'battery-level'
  if (status === 'critical' || status === 'low') {
    batteryLevel.classList.add('low')
  }
  else if (status === 'medium') {
    batteryLevel.classList.add('medium')
  }

  // 更新状态
  const statusTexts: Record<string, string> = {
    full: '电量充足',
    high: '电量良好',
    medium: '电量正常',
    low: '电量偏低',
    critical: '电量严重不足',
  }
  batteryStatus.textContent = statusTexts[status] || status

  // 更新充电状态
  chargingBadge.textContent = charging ? '⚡ 充电中' : '🔌 未充电'
  chargingBadge.className = `charging-badge ${charging ? 'charging' : 'discharging'}`

  // 更新图标
  batteryIcon.textContent = getBatteryIcon(info.level, charging)

  // 更新时间
  chargingTime.textContent = formatTime(info.chargingTime)
  dischargingTime.textContent = formatTime(info.dischargingTime)
}

async function init() {
  addLog('🔄 初始化电池模块...')

  try {
    await battery.init()

    if (!battery.isSupported()) {
      unsupportedAlert.style.display = 'flex'
      addLog('❌ 浏览器不支持 Battery API')
      batteryLevel.textContent = 'N/A'
      batteryStatus.textContent = '不支持'
      chargingBadge.textContent = '不可用'
      return
    }

    addLog('✅ 电池模块初始化成功')
    updateUI()

    battery.on('batteryChange', (info: any) => {
      addLog(`🔋 电池更新: ${Math.round(info.level * 100)}% ${info.charging ? '(充电中)' : ''}`)
      updateUI()
    })

    addLog('🎧 开始监听电池变化')
  }
  catch (error) {
    addLog(`❌ 初始化失败: ${error}`)
  }
}

init()

// 定期刷新UI
setInterval(() => {
  if (battery.isSupported()) {
    updateUI()
  }
}, 30000)

console.log('✨ @ldesign/device-battery 演示启动')

