import {
  DeviceDetector,
  BatteryModule,
  NetworkModule,
  type DeviceInfo,
  type DeviceType,
  type Orientation,
  type DetectorConfig,
} from '@ldesign/device'

// 辅助函数：更新输出
function updateOutput(elementId: string, content: string) {
  const element = document.getElementById(elementId)
  if (element) {
    element.textContent = content
  }
}

// 示例 1: 基础设备检测
function basicDetection() {
  const detector = new DeviceDetector()
  const info: DeviceInfo = detector.getDeviceInfo()

  const output = `
设备类型: ${info.type}
屏幕方向: ${info.orientation}
屏幕尺寸: ${info.width}x${info.height}
视口尺寸: ${info.viewport.width}x${info.viewport.height}
像素比: ${info.pixelRatio}
是否触摸设备: ${info.isTouchDevice ? '是' : '否'}
${info.browser ? `浏览器: ${info.browser.name} ${info.browser.version}` : ''}
${info.os ? `操作系统: ${info.os.name} ${info.os.version}` : ''}
  `.trim()

  updateOutput('basic-output', output)
}

// 示例 2: 类型守卫和类型安全
function typeGuardExample() {
  const detector = new DeviceDetector()

  // 类型守卫函数
  function isMobileDevice(type: DeviceType): type is 'mobile' {
    return type === 'mobile'
  }

  function isLandscape(orientation: Orientation): orientation is 'landscape' {
    return orientation === 'landscape'
  }

  const deviceType = detector.getDeviceType()
  const orientation = detector.getOrientation()

  let message = ''

  if (isMobileDevice(deviceType)) {
    message += '✅ 这是移动设备\n'
    message += '提示: 考虑使用移动端优化的布局\n\n'
  } else {
    message += '❌ 这不是移动设备\n\n'
  }

  if (isLandscape(orientation)) {
    message += '📐 当前是横屏模式\n'
    message += '建议: 使用宽屏布局优化显示效果'
  } else {
    message += '📱 当前是竖屏模式\n'
    message += '建议: 使用纵向滚动布局'
  }

  updateOutput('type-guard-output', message)
}

// 示例 3: 事件监听
function eventListeningExample() {
  const detector = new DeviceDetector({
    enableResize: true,
    enableOrientation: true,
    debounceDelay: 200
  })

  let eventLog: string[] = []

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString()
    eventLog.push(`[${time}] ${message}`)
    if (eventLog.length > 10) {
      eventLog = eventLog.slice(-10)
    }
    updateOutput('event-output', eventLog.join('\n'))
  }

  addLog('事件监听已启动')

  detector.on('deviceChange', (info: DeviceInfo) => {
    addLog(`设备类型变化: ${info.type}`)
  })

  detector.on('orientationChange', (orientation: Orientation) => {
    addLog(`屏幕方向变化: ${orientation}`)
  })

  detector.on('resize', ({ width, height }) => {
    addLog(`窗口大小变化: ${width}x${height}`)
  })

  // 模拟触发
  const button = document.getElementById('trigger-resize')
  if (button) {
    button.addEventListener('click', () => {
      addLog('手动触发了检测刷新')
      detector.refresh()
    })
  }
}

// 示例 4: 动态模块加载
async function moduleLoadingExample() {
  updateOutput('module-output', '准备加载模块...')

  const button = document.getElementById('load-battery')
  if (button) {
    button.addEventListener('click', async () => {
      try {
        const battery = new BatteryModule()

        const isSupported = await battery.isSupported()
        if (!isSupported) {
          updateOutput('module-output', '❌ 浏览器不支持 Battery API')
          return
        }

        await battery.initialize()
        const status = battery.getBatteryStatus()

        if (status) {
          const output = `
✅ 电池模块加载成功

电池电量: ${Math.round(status.level * 100)}%
充电状态: ${status.charging ? '充电中' : '未充电'}
${status.chargingTime !== Infinity ? `充满还需: ${Math.round(status.chargingTime / 60)} 分钟` : ''}
${status.dischargingTime !== Infinity ? `剩余时间: ${Math.round(status.dischargingTime / 60)} 分钟` : ''}
          `.trim()

          updateOutput('module-output', output)
        }
      } catch (error) {
        updateOutput('module-output', `❌ 加载失败: ${error}`)
      }
    })
  }

  updateOutput('module-output', '点击按钮加载电池模块')
}

// 示例 5: 性能监控
function performanceMonitoring() {
  const detector = new DeviceDetector()

  // 测量检测性能
  const iterations = 1000
  const startTime = performance.now()

  for (let i = 0; i < iterations; i++) {
    detector.getDeviceInfo()
  }

  const endTime = performance.now()
  const totalTime = endTime - startTime
  const avgTime = totalTime / iterations

  const output = `
性能测试结果 (${iterations} 次迭代)

总耗时: ${totalTime.toFixed(2)} ms
平均耗时: ${avgTime.toFixed(4)} ms
每秒操作: ${(1000 / avgTime).toFixed(0)} ops/sec

✅ 性能优异! 得益于智能缓存机制，
   重复调用几乎没有性能损耗。
  `.trim()

  updateOutput('performance-output', output)
}

// 示例 6: 自定义配置
function customConfiguration() {
  // 类型安全的配置对象
  const config: DetectorConfig = {
    breakpoints: {
      mobile: 640,   // 自定义移动端断点
      tablet: 1024   // 自定义平板断点
    },
    enableResize: true,
    enableOrientation: true,
    debounceDelay: 300
  }

  const detector = new DeviceDetector(config)
  const info = detector.getDeviceInfo()

  const output = `
自定义配置应用成功

断点配置:
- 移动端: < ${config.breakpoints!.mobile}px
- 平板: ${config.breakpoints!.mobile}px - ${config.breakpoints!.tablet}px
- 桌面: > ${config.breakpoints!.tablet}px

当前设备类型: ${info.type}
当前屏幕宽度: ${info.width}px

监听配置:
- 窗口大小变化: ${config.enableResize ? '✅ 已启用' : '❌ 未启用'}
- 屏幕方向变化: ${config.enableOrientation ? '✅ 已启用' : '❌ 未启用'}
- 防抖延迟: ${config.debounceDelay}ms
  `.trim()

  updateOutput('config-output', output)
}

// 运行所有示例
function runAllExamples() {
  try {
    basicDetection()
    typeGuardExample()
    eventListeningExample()
    moduleLoadingExample()
    performanceMonitoring()
    customConfiguration()
  } catch (error) {
    console.error('运行示例时出错:', error)
  }
}

// 页面加载完成后运行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAllExamples)
} else {
  runAllExamples()
}

// 导出类型供其他模块使用
export type {
  DeviceInfo,
  DeviceType,
  Orientation,
  DetectorConfig,
}


