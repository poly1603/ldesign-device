import { NetworkModule } from '@ldesign/device-network'

const network = new NetworkModule()

// DOM 元素
const statusIcon = document.getElementById('status-icon')!
const statusText = document.getElementById('status-text')!
const connectionType = document.getElementById('connection-type')!
const downlink = document.getElementById('downlink')!
const rtt = document.getElementById('rtt')!
const saveData = document.getElementById('save-data')!
const effectiveType = document.getElementById('effective-type')!
const log = document.getElementById('log')!

function addLog(message: string) {
  const item = document.createElement('div')
  item.className = 'log-item'
  const time = new Date().toLocaleTimeString()
  item.textContent = `[${time}] ${message}`
  log.appendChild(item)
  log.scrollTop = log.scrollHeight
}

function updateUI() {
  const info = network.getData()
  const online = network.isOnline()

  // 更新状态
  statusIcon.textContent = online ? '🟢' : '🔴'
  statusText.textContent = online ? '在线' : '离线'
  statusText.className = `status-text ${online ? 'status-online' : 'status-offline'}`

  // 更新连接类型
  connectionType.textContent = network.getConnectionType()

  // 更新网络质量
  const dl = network.getDownlink()
  downlink.textContent = dl !== undefined ? `${dl.toFixed(1)} Mbps` : '--'

  const rttValue = network.getRTT()
  rtt.textContent = rttValue !== undefined ? `${rttValue} ms` : '--'

  const sd = network.isSaveData()
  saveData.textContent = sd !== undefined ? (sd ? '开启' : '关闭') : '--'

  effectiveType.textContent = info.effectiveType || '--'
}

async function init() {
  addLog('🔄 初始化网络模块...')

  try {
    await network.init()
    addLog('✅ 网络模块初始化成功')

    updateUI()

    network.on('networkChange', (info: any) => {
      addLog(`🌐 网络状态变化: ${info.online ? '在线' : '离线'} (${info.type || 'unknown'})`)
      updateUI()
    })

    addLog('🎧 开始监听网络变化')
  }
  catch (error) {
    addLog(`❌ 初始化失败: ${error}`)
  }
}

init()

// 定期更新
setInterval(() => {
  updateUI()
}, 5000)

console.log('✨ @ldesign/device-network 演示已启动')
console.log('Network Module:', network)

