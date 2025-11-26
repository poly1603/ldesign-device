/*!
 * ***********************************
 * @ldesign/device-vue v1.0.0      *
 * Built with rollup               *
 * Build time: 2024-11-26 14:52:34 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var plugin = require('./plugin.js');
var enginePlugin = require('./plugins/engine-plugin.js');
var useDevice = require('./composables/useDevice.js');
var useBattery = require('./composables/useBattery.js');
var useNetwork = require('./composables/useNetwork.js');
var useGeolocation = require('./composables/useGeolocation.js');
var useOrientation = require('./composables/useOrientation.js');
var useBreakpoints = require('./composables/useBreakpoints.js');
var useClipboard = require('./composables/useClipboard.js');
var useMediaCapabilities = require('./composables/useMediaCapabilities.js');
var useOrientationLock = require('./composables/useOrientationLock.js');
var useVibration = require('./composables/useVibration.js');
var useWakeLock = require('./composables/useWakeLock.js');
require('./components/DeviceInfo.vue.js');
require('./components/NetworkStatus.vue.js');
var vDevice = require('./directives/vDevice.js');
var vBattery = require('./directives/vBattery.js');
var vNetwork = require('./directives/vNetwork.js');
var vOrientation = require('./directives/vOrientation.js');
var constants = require('./constants.js');
var DeviceInfo_vue_vue_type_script_setup_true_lang = require('./components/DeviceInfo.vue2.js');
var NetworkStatus_vue_vue_type_script_setup_true_lang = require('./components/NetworkStatus.vue2.js');

const VERSION = "1.0.0";

exports.createDevicePlugin = plugin.createDevicePlugin;
exports.createDeviceEnginePlugin = enginePlugin.createDeviceEnginePlugin;
exports.devicePlugin = enginePlugin.devicePlugin;
exports.useDevice = useDevice.useDevice;
exports.useBattery = useBattery.useBattery;
exports.useNetwork = useNetwork.useNetwork;
exports.useGeolocation = useGeolocation.useGeolocation;
exports.useOrientation = useOrientation.useOrientation;
exports.useBreakpoints = useBreakpoints.useBreakpoints;
exports.useClipboard = useClipboard.useClipboard;
exports.useMediaCapabilities = useMediaCapabilities.useMediaCapabilities;
exports.useOrientationLock = useOrientationLock.useOrientationLock;
exports.useVibration = useVibration.useVibration;
exports.useWakeLock = useWakeLock.useWakeLock;
exports.vDevice = vDevice.vDevice;
exports.vBattery = vBattery.vBattery;
exports.vNetwork = vNetwork.vNetwork;
exports.vOrientation = vOrientation.vOrientation;
exports.DEVICE_INJECTION_KEY = constants.DEVICE_INJECTION_KEY;
exports.DeviceInfo = DeviceInfo_vue_vue_type_script_setup_true_lang.default;
exports.NetworkStatus = NetworkStatus_vue_vue_type_script_setup_true_lang.default;
exports.VERSION = VERSION;
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
