/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
export { DeviceDetector } from '../core/DeviceDetector.js';
export { EventEmitter } from '../core/EventEmitter.js';
export { ModuleLoader } from '../core/ModuleLoader.js';
export { BatteryModule } from '../modules/BatteryModule.js';
export { GeolocationModule } from '../modules/GeolocationModule.js';
export { NetworkModule } from '../modules/NetworkModule.js';
import './components/DeviceInfo.vue.js';
import './components/NetworkStatus.vue.js';
export { useBattery } from './composables/useBattery.js';
export { useBreakpoints } from './composables/useBreakpoints.js';
export { useDevice, useNetwork } from './composables/useDevice.js';
export { useGeolocation } from './composables/useGeolocation.js';
export { useOrientation } from './composables/useOrientation.js';
import './directives/vBattery.js';
export { cleanupGlobalDetector, vDevice, vDeviceDesktop, vDeviceMobile, vDeviceTablet } from './directives/vDevice.js';
import './directives/vNetwork.js';
import './directives/vOrientation.js';
export { DevicePlugin, createDevicePlugin, DevicePlugin as default, useDeviceDetector } from './plugin.js';
export { default as DeviceInfo } from './components/DeviceInfo.vue2.js';
export { default as NetworkStatus } from './components/NetworkStatus.vue2.js';
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
