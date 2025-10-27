import { createApp } from 'vue'
import { DevicePlugin } from '@ldesign/device/vue'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// 安装设备检测插件
app.use(DevicePlugin, {
  enableResize: true,
  enableOrientation: true,
  breakpoints: {
    mobile: 768,
    tablet: 1024
  }
})

app.mount('#app')


