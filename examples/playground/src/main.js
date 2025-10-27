import { DeviceDetector, BatteryModule, NetworkModule } from '@ldesign/device'

// 代码模板
const templates = {
  basic: `// 基础设备检测
const detector = new DeviceDetector()
const info = detector.getDeviceInfo()

console.log('设备类型:', info.type)
console.log('屏幕方向:', info.orientation)
console.log('屏幕尺寸:', \`\${info.width}x\${info.height}\`)
console.log('是否触摸设备:', info.isTouchDevice)
console.log('像素比:', info.pixelRatio)

if (info.browser) {
  console.log('浏览器:', \`\${info.browser.name} \${info.browser.version}\`)
}

if (info.os) {
  console.log('操作系统:', \`\${info.os.name} \${info.os.version}\`)
}`,

  events: `// 事件监听示例
const detector = new DeviceDetector({
  enableResize: true,
  enableOrientation: true,
  debounceDelay: 200
})

console.log('开始监听设备变化...')

detector.on('deviceChange', (info) => {
  console.log('📱 设备类型变化:', info.type)
})

detector.on('orientationChange', (orientation) => {
  console.log('🔄 屏幕方向变化:', orientation)
})

detector.on('resize', ({ width, height }) => {
  console.log('📏 窗口大小变化:', \`\${width}x\${height}\`)
})

// 尝试调整浏览器窗口大小来触发事件
console.log('💡 调整窗口大小或旋转设备来查看事件')`,

  modules: `// 模块功能示例
async function testModules() {
  console.log('开始测试模块功能...')
  
  // 测试电池模块
  const battery = new BatteryModule()
  const batterySupported = await battery.isSupported()
  
  if (batterySupported) {
    await battery.initialize()
    const status = battery.getBatteryStatus()
    console.log('🔋 电池状态:')
    console.log('  电量:', Math.round(status.level * 100) + '%')
    console.log('  充电中:', status.charging ? '是' : '否')
  } else {
    console.log('❌ 浏览器不支持 Battery API')
  }
  
  // 测试网络模块
  const network = new NetworkModule()
  const networkSupported = await network.isSupported()
  
  if (networkSupported) {
    await network.initialize()
    const status = network.getNetworkStatus()
    console.log('📡 网络状态:')
    console.log('  在线:', status.online ? '是' : '否')
    console.log('  类型:', status.type || '未知')
    console.log('  有效类型:', status.effectiveType || '未知')
  } else {
    console.log('⚠️ 浏览器不支持 Network API')
  }
}

testModules()`,

  custom: `// 在这里编写你的自定义代码
const detector = new DeviceDetector()

// 示例：根据设备类型执行不同逻辑
if (detector.isMobile()) {
  console.log('✅ 移动设备 - 使用移动端优化')
} else if (detector.isTablet()) {
  console.log('✅ 平板设备 - 使用中等尺寸布局')
} else {
  console.log('✅ 桌面设备 - 使用完整功能')
}

// 获取详细信息
const info = detector.getDeviceInfo()
console.log('完整设备信息:', info)
`
}

// 全局变量
let currentDetector = null
const codeEditor = document.getElementById('code-editor')
const consoleContent = document.getElementById('console-content')

// 初始化编辑器
function initEditor() {
  codeEditor.value = templates.basic
}

// 切换标签
function switchTab(tabName) {
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active')
  })
  event.target.classList.add('active')
  codeEditor.value = templates[tabName]
}

// 更新设备可视化
function updateDeviceVisualization(info) {
  const icons = {
    mobile: '📱',
    tablet: '📱',
    desktop: '💻'
  }

  const typeTexts = {
    mobile: '移动设备',
    tablet: '平板设备',
    desktop: '桌面设备'
  }

  document.getElementById('device-icon').textContent = icons[info.type] || '📱'
  document.getElementById('device-type-text').textContent = typeTexts[info.type] || info.type
  document.getElementById('stat-type').textContent = info.type
  document.getElementById('stat-orientation').textContent = info.orientation
  document.getElementById('stat-size').textContent = `${info.width}×${info.height}`
  document.getElementById('stat-touch').textContent = info.isTouchDevice ? '是' : '否'
}

// 自定义控制台
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn
}

function addConsoleMessage(message, type = 'log') {
  const messageDiv = document.createElement('div')
  messageDiv.className = `console-message console-${type}`

  const time = new Date().toLocaleTimeString()
  const timeSpan = document.createElement('span')
  timeSpan.className = 'console-time'
  timeSpan.textContent = `[${time}]`

  const contentSpan = document.createElement('span')
  contentSpan.className = 'console-text'
  contentSpan.textContent = String(message)

  messageDiv.appendChild(timeSpan)
  messageDiv.appendChild(contentSpan)
  consoleContent.appendChild(messageDiv)
  consoleContent.scrollTop = consoleContent.scrollHeight
}

// 重写 console
console.log = (...args) => {
  originalConsole.log(...args)
  addConsoleMessage(args.join(' '), 'log')
}

console.error = (...args) => {
  originalConsole.error(...args)
  addConsoleMessage(args.join(' '), 'error')
}

console.warn = (...args) => {
  originalConsole.warn(...args)
  addConsoleMessage(args.join(' '), 'warn')
}

// 运行代码
function runCode() {
  // 清空之前的控制台（但保留欢迎信息）
  const welcomeMsg = consoleContent.querySelector('.console-welcome')
  if (welcomeMsg) {
    welcomeMsg.remove()
  }

  const code = codeEditor.value

  try {
    // 清理之前的检测器
    if (currentDetector) {
      currentDetector.destroy()
    }

    console.log('🚀 开始运行代码...')

    // 使用 Function 构造器执行代码
    const func = new Function(
      'DeviceDetector',
      'BatteryModule',
      'NetworkModule',
      'console',
      code
    )

    func(DeviceDetector, BatteryModule, NetworkModule, console)

    // 更新设备可视化
    const detector = new DeviceDetector()
    currentDetector = detector
    const info = detector.getDeviceInfo()
    updateDeviceVisualization(info)

    console.log('✅ 代码运行完成')
  } catch (error) {
    console.error('❌ 运行错误:', error.message)
  }
}

// 清空控制台
function clearConsole() {
  consoleContent.innerHTML = '<div class="console-welcome">控制台已清空</div>'
}

// 快速测试
const quickTests = {
  detect: () => {
    const detector = new DeviceDetector()
    const info = detector.getDeviceInfo()
    console.log('设备检测结果:', info)
    updateDeviceVisualization(info)
  },

  resize: () => {
    const detector = new DeviceDetector({ enableResize: true })
    console.log('监听窗口大小变化...')
    detector.on('resize', ({ width, height }) => {
      console.log(`窗口大小: ${width}×${height}`)
    })
    console.log('💡 调整浏览器窗口大小来触发事件')
  },

  orientation: () => {
    const detector = new DeviceDetector({ enableOrientation: true })
    const orientation = detector.getOrientation()
    console.log('当前屏幕方向:', orientation)
    detector.on('orientationChange', (newOrientation) => {
      console.log('方向变化为:', newOrientation)
    })
    console.log('💡 在移动设备上旋转屏幕来触发事件')
  },

  performance: () => {
    console.log('开始性能测试...')
    const detector = new DeviceDetector()
    const iterations = 1000

    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      detector.getDeviceInfo()
    }
    const end = performance.now()

    const total = end - start
    const avg = total / iterations

    console.log(`总耗时: ${total.toFixed(2)}ms`)
    console.log(`平均耗时: ${avg.toFixed(4)}ms`)
    console.log(`每秒操作: ${(1000 / avg).toFixed(0)} ops/sec`)
  },

  battery: async () => {
    const battery = new BatteryModule()
    const supported = await battery.isSupported()

    if (!supported) {
      console.log('❌ 浏览器不支持 Battery API')
      return
    }

    await battery.initialize()
    const status = battery.getBatteryStatus()

    console.log('🔋 电池状态:')
    console.log(`  电量: ${Math.round(status.level * 100)}%`)
    console.log(`  充电: ${status.charging ? '是' : '否'}`)
    if (status.chargingTime !== Infinity) {
      console.log(`  充满: ${Math.round(status.chargingTime / 60)}分钟`)
    }
  },

  network: async () => {
    const network = new NetworkModule()
    const supported = await network.isSupported()

    if (!supported) {
      console.log('⚠️ 浏览器不支持 Network API')
      return
    }

    await network.initialize()
    const status = network.getNetworkStatus()

    console.log('📡 网络状态:')
    console.log(`  在线: ${status.online ? '是' : '否'}`)
    console.log(`  类型: ${status.type || '未知'}`)
    console.log(`  有效类型: ${status.effectiveType || '未知'}`)
    if (status.downlink) {
      console.log(`  下载速度: ${status.downlink} Mbps`)
    }
  }
}

// 事件监听
document.addEventListener('DOMContentLoaded', () => {
  initEditor()

  // 标签切换
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab))
  })

  // 运行按钮
  document.getElementById('run-code').addEventListener('click', runCode)

  // 清空按钮
  document.getElementById('clear-output').addEventListener('click', clearConsole)

  // 快速测试按钮
  document.querySelectorAll('.test-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const test = e.target.dataset.test
      if (quickTests[test]) {
        quickTests[test]()
      }
    })
  })

  // 初始化设备显示
  const detector = new DeviceDetector()
  updateDeviceVisualization(detector.getDeviceInfo())

  // 键盘快捷键
  codeEditor.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter 运行代码
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      runCode()
    }

    // Tab 键插入缩进
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      e.target.value = e.target.value.substring(0, start) + '  ' + e.target.value.substring(end)
      e.target.selectionStart = e.target.selectionEnd = start + 2
    }
  })
})


