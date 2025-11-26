/*!
 * ***********************************
 * @ldesign/device-vue v1.0.0      *
 * Built with rollup               *
 * Build time: 2024-11-26 15:37:00 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
export { createDevicePlugin } from './plugin.js';
export { createDeviceEnginePlugin, devicePlugin } from './plugins/engine-plugin.js';
export { useDevice } from './composables/useDevice.js';
export { useBattery } from './composables/useBattery.js';
export { useNetwork } from './composables/useNetwork.js';
export { useGeolocation } from './composables/useGeolocation.js';
export { useOrientation } from './composables/useOrientation.js';
export { useBreakpoints } from './composables/useBreakpoints.js';
export { useClipboard } from './composables/useClipboard.js';
export { useMediaCapabilities } from './composables/useMediaCapabilities.js';
export { useOrientationLock } from './composables/useOrientationLock.js';
export { useVibration } from './composables/useVibration.js';
export { useWakeLock } from './composables/useWakeLock.js';
import './components/DeviceInfo.vue.js';
import './components/NetworkStatus.vue.js';
export { vDevice } from './directives/vDevice.js';
export { vBattery } from './directives/vBattery.js';
export { vNetwork } from './directives/vNetwork.js';
export { vOrientation } from './directives/vOrientation.js';
export { DEVICE_INJECTION_KEY } from './constants.js';
export { default as DeviceInfo } from './components/DeviceInfo.vue2.js';
export { default as NetworkStatus } from './components/NetworkStatus.vue2.js';

const VERSION = "1.0.0";

export { VERSION };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
