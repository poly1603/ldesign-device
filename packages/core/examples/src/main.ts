import { EventEmitter } from '@ldesign/device-core'

// 定义事件类型
interface DemoEvents {
  click: { timestamp: number, count: number }
  priority: { level: string }
  once: { message: string }
}

// 创建事件发射器
const emitter = new EventEmitter<DemoEvents>()
emitter.enablePerformanceMonitoring(true)

// 获取 DOM 元素
const logBasic = document.getElementById('log-basic')!
const logPriority = document.getElementById('log-priority')!
const logOnce = document.getElementById('log-once')!
const statEmits = document.getElementById('stat-emits')!
const statListeners = document.getElementById('stat-listeners')!

function addLog(container: HTMLElement, message: string, type: 'info' | 'success' | 'warning' = 'info') {
  const item = document.createElement('div')
  item.className = 'log-item'
  const badge = document.createElement('span')
  badge.className = `badge badge-${type}`
  badge.textContent = type.toUpperCase()
  const time = new Date().toLocaleTimeString()
  item.appendChild(badge)
  item.appendChild(document.createTextNode(`[${time}] ${message}`))
  container.appendChild(item)
  container.scrollTop = container.scrollHeight
}

function clearLog(container: HTMLElement) {
  container.innerHTML = ''
}

function updateStats() {
  const metrics = emitter.getPerformanceMetrics()
  statEmits.textContent = metrics.totalEmits.toString()
  statListeners.textContent = metrics.totalListenerCalls.toString()
}

// 基础事件监听
let clickCount = 0
emitter.on('click', (data) => {
  addLog(logBasic, `点击事件 #${data.count} @ ${data.timestamp}`, 'success')
  updateStats()
})

// 优先级监听器
emitter.on('priority', () => {
  addLog(logPriority, '低优先级 (1)', 'info')
}, { priority: 1 })

emitter.on('priority', () => {
  addLog(logPriority, '中优先级 (5)', 'warning')
}, { priority: 5 })

emitter.on('priority', () => {
  addLog(logPriority, '高优先级 (10)', 'success')
}, { priority: 10 })

// 按钮事件
document.getElementById('btn-emit')?.addEventListener('click', () => {
  clickCount++
  emitter.emit('click', {
    timestamp: Date.now(),
    count: clickCount,
  })
})

document.getElementById('btn-clear')?.addEventListener('click', () => {
  clearLog(logBasic)
})

document.getElementById('btn-priority')?.addEventListener('click', () => {
  emitter.emit('priority', { level: 'test' })
  updateStats()
})

document.getElementById('btn-once')?.addEventListener('click', () => {
  emitter.once('once', (data) => {
    addLog(logOnce, `一次性监听器: ${data.message}`, 'success')
    addLog(logOnce, '✅ 这个监听器只执行一次', 'warning')
    updateStats()
  })

  setTimeout(() => {
    emitter.emit('once', { message: 'Hello Once!' })
  }, 100)
})

document.getElementById('btn-refresh')?.addEventListener('click', () => {
  updateStats()
})

// 初始化
addLog(logBasic, '✅ EventEmitter 已初始化', 'success')
addLog(logPriority, '📊 优先级演示准备就绪', 'info')
updateStats()

console.log('✨ @ldesign/device-core 演示已启动')
console.log('EventEmitter:', emitter)

