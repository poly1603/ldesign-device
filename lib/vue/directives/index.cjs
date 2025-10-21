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

var vBattery = require('./vBattery.cjs');
var vDevice = require('./vDevice.cjs');
var vNetwork = require('./vNetwork.cjs');
var vOrientation = require('./vOrientation.cjs');



exports.vBattery = vBattery.vBattery;
exports.vBatteryCharging = vBattery.vBatteryCharging;
exports.vBatteryLow = vBattery.vBatteryLow;
exports.cleanupGlobalDetector = vDevice.cleanupGlobalDetector;
exports.vDevice = vDevice.vDevice;
exports.vDeviceDesktop = vDevice.vDeviceDesktop;
exports.vDeviceMobile = vDevice.vDeviceMobile;
exports.vDeviceTablet = vDevice.vDeviceTablet;
exports.vNetwork = vNetwork.vNetwork;
exports.vNetworkOffline = vNetwork.vNetworkOffline;
exports.vNetworkOnline = vNetwork.vNetworkOnline;
exports.vNetworkSlow = vNetwork.vNetworkSlow;
exports.vOrientation = vOrientation.vOrientation;
exports.vOrientationLandscape = vOrientation.vOrientationLandscape;
exports.vOrientationPortrait = vOrientation.vOrientationPortrait;
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
