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

var DeviceDetector = require('../core/DeviceDetector.cjs');
var EventEmitter = require('../core/EventEmitter.cjs');
var ModuleLoader = require('../core/ModuleLoader.cjs');
var BatteryModule = require('../modules/BatteryModule.cjs');
var GeolocationModule = require('../modules/GeolocationModule.cjs');
var NetworkModule = require('../modules/NetworkModule.cjs');
require('./components/DeviceInfo.vue.cjs');
require('./components/NetworkStatus.vue.cjs');
var useBattery = require('./composables/useBattery.cjs');
var useBreakpoints = require('./composables/useBreakpoints.cjs');
var useDevice = require('./composables/useDevice.cjs');
var useGeolocation = require('./composables/useGeolocation.cjs');
var useOrientation = require('./composables/useOrientation.cjs');
require('./directives/vBattery.cjs');
var vDevice = require('./directives/vDevice.cjs');
require('./directives/vNetwork.cjs');
require('./directives/vOrientation.cjs');
var plugin = require('./plugin.cjs');
var DeviceInfo_vue_vue_type_script_setup_true_lang = require('./components/DeviceInfo.vue2.cjs');
var NetworkStatus_vue_vue_type_script_setup_true_lang = require('./components/NetworkStatus.vue2.cjs');



exports.DeviceDetector = DeviceDetector.DeviceDetector;
exports.EventEmitter = EventEmitter.EventEmitter;
exports.ModuleLoader = ModuleLoader.ModuleLoader;
exports.BatteryModule = BatteryModule.BatteryModule;
exports.GeolocationModule = GeolocationModule.GeolocationModule;
exports.NetworkModule = NetworkModule.NetworkModule;
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
exports.DevicePlugin = plugin.DevicePlugin;
exports.createDevicePlugin = plugin.createDevicePlugin;
exports.default = plugin.DevicePlugin;
exports.useDeviceDetector = plugin.useDeviceDetector;
exports.DeviceInfo = DeviceInfo_vue_vue_type_script_setup_true_lang.default;
exports.NetworkStatus = NetworkStatus_vue_vue_type_script_setup_true_lang.default;
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
