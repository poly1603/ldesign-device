/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var DeviceDetector = require('./core/DeviceDetector.cjs');
var EventEmitter = require('./core/EventEmitter.cjs');
var ModuleLoader = require('./core/ModuleLoader.cjs');
var plugin = require('./engine/plugin.cjs');
var BatteryModule = require('./modules/BatteryModule.cjs');
var FeatureDetectionModule = require('./modules/FeatureDetectionModule.cjs');
var GeolocationModule = require('./modules/GeolocationModule.cjs');
var MediaModule = require('./modules/MediaModule.cjs');
var NetworkModule = require('./modules/NetworkModule.cjs');
var PerformanceModule = require('./modules/PerformanceModule.cjs');
var index = require('./utils/index.cjs');
require('./vue/components/DeviceInfo.vue.cjs');
require('./vue/components/NetworkStatus.vue.cjs');
var useBattery = require('./vue/composables/useBattery.cjs');
var useBreakpoints = require('./vue/composables/useBreakpoints.cjs');
var useDevice = require('./vue/composables/useDevice.cjs');
var useGeolocation = require('./vue/composables/useGeolocation.cjs');
var useOrientation = require('./vue/composables/useOrientation.cjs');
require('./vue/directives/vBattery.cjs');
var vDevice = require('./vue/directives/vDevice.cjs');
require('./vue/directives/vNetwork.cjs');
require('./vue/directives/vOrientation.cjs');
var plugin$1 = require('./vue/plugin.cjs');
var DeviceInfo_vue_vue_type_script_setup_true_lang = require('./vue/components/DeviceInfo.vue2.cjs');
var NetworkStatus_vue_vue_type_script_setup_true_lang = require('./vue/components/NetworkStatus.vue2.cjs');

function createDeviceDetector(options) {
  return new DeviceDetector.DeviceDetector(options);
}

exports.DeviceDetector = DeviceDetector.DeviceDetector;
exports.default = DeviceDetector.DeviceDetector;
exports.EventEmitter = EventEmitter.EventEmitter;
exports.ModuleLoader = ModuleLoader.ModuleLoader;
exports.createDeviceEnginePlugin = plugin.createDeviceEnginePlugin;
exports.BatteryModule = BatteryModule.BatteryModule;
exports.FeatureDetectionModule = FeatureDetectionModule.FeatureDetectionModule;
exports.GeolocationModule = GeolocationModule.GeolocationModule;
exports.MediaModule = MediaModule.MediaModule;
exports.NetworkModule = NetworkModule.NetworkModule;
exports.PerformanceModule = PerformanceModule.PerformanceModule;
exports.debounce = index.debounce;
exports.formatBytes = index.formatBytes;
exports.generateId = index.generateId;
exports.getDeviceTypeByWidth = index.getDeviceTypeByWidth;
exports.getPixelRatio = index.getPixelRatio;
exports.getScreenOrientation = index.getScreenOrientation;
exports.isAPISupported = index.isAPISupported;
exports.isMobileDevice = index.isMobileDevice;
exports.isTouchDevice = index.isTouchDevice;
exports.parseBrowser = index.parseBrowser;
exports.parseOS = index.parseOS;
exports.safeNavigatorAccess = index.safeNavigatorAccess;
exports.throttle = index.throttle;
exports.useBattery = useBattery.useBattery;
exports.useBreakpoints = useBreakpoints.useBreakpoints;
exports.useDevice = useDevice.useDevice;
exports.useNetwork = useDevice.useNetwork;
exports.useGeolocation = useGeolocation.useGeolocation;
exports.useOrientation = useOrientation.useOrientation;
exports.cleanupGlobalDetector = vDevice.cleanupGlobalDetector;
exports.vDevice = vDevice.vDevice;
exports.vDeviceDesktop = vDevice.vDeviceDesktop;
exports.vDeviceMobile = vDevice.vDeviceMobile;
exports.vDeviceTablet = vDevice.vDeviceTablet;
exports.DevicePlugin = plugin$1.DevicePlugin;
exports.createDevicePlugin = plugin$1.createDevicePlugin;
exports.useDeviceDetector = plugin$1.useDeviceDetector;
exports.DeviceInfo = DeviceInfo_vue_vue_type_script_setup_true_lang.default;
exports.NetworkStatus = NetworkStatus_vue_vue_type_script_setup_true_lang.default;
exports.createDeviceDetector = createDeviceDetector;
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
