/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { DeviceDetector } from './core/DeviceDetector.js';
export { EventEmitter } from './core/EventEmitter.js';
export { ModuleLoader } from './core/ModuleLoader.js';
export { createDeviceEnginePlugin } from './engine/plugin.js';
export { BatteryModule } from './modules/BatteryModule.js';
export { FeatureDetectionModule } from './modules/FeatureDetectionModule.js';
export { GeolocationModule } from './modules/GeolocationModule.js';
export { MediaModule } from './modules/MediaModule.js';
export { NetworkModule } from './modules/NetworkModule.js';
export { PerformanceModule } from './modules/PerformanceModule.js';
export { debounce, formatBytes, generateId, getDeviceTypeByWidth, getPixelRatio, getScreenOrientation, isAPISupported, isMobileDevice, isTouchDevice, parseBrowser, parseOS, safeNavigatorAccess, throttle } from './utils/index.js';
import './vue/components/DeviceInfo.vue.js';
import './vue/components/NetworkStatus.vue.js';
export { useBattery } from './vue/composables/useBattery.js';
export { useBreakpoints } from './vue/composables/useBreakpoints.js';
export { useDevice, useNetwork } from './vue/composables/useDevice.js';
export { useGeolocation } from './vue/composables/useGeolocation.js';
export { useOrientation } from './vue/composables/useOrientation.js';
import './vue/directives/vBattery.js';
export { cleanupGlobalDetector, vDevice, vDeviceDesktop, vDeviceMobile, vDeviceTablet } from './vue/directives/vDevice.js';
import './vue/directives/vNetwork.js';
import './vue/directives/vOrientation.js';
export { DevicePlugin, createDevicePlugin, useDeviceDetector } from './vue/plugin.js';
export { default as DeviceInfo } from './vue/components/DeviceInfo.vue2.js';
export { default as NetworkStatus } from './vue/components/NetworkStatus.vue2.js';

function createDeviceDetector(options) {
  return new DeviceDetector(options);
}

export { DeviceDetector, createDeviceDetector, DeviceDetector as default };
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
