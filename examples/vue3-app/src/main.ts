import { createApp } from 'vue'
import { DevicePlugin } from '@ldesign/device'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// 安装设备检测插件
app.use(DevicePlugin, {
  // 自定义配置
  tabletMinWidth: 768,
  desktopMinWidth: 1024,
  enableUserAgentDetection: true,
  enableTouchDetection: true,

  // 插件选项
  registerComponents: true,
  registerDirectives: true,
  registerGlobalProperties: true,
  componentPrefix: 'L',
})

app.mount('#app')
