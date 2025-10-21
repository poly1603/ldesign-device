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

var vue = require('vue');
var DeviceDetector = require('../core/DeviceDetector.cjs');
var vDevice = require('./directives/vDevice.cjs');

const DevicePlugin = {
  install(app, options = {}) {
    const {
      globalPropertyName = "$device",
      ...detectorOptions
    } = options;
    const detector = new DeviceDetector.DeviceDetector(detectorOptions);
    app.config.globalProperties[globalPropertyName] = detector;
    app.provide("device-detector", detector);
    app.directive("device", vDevice.vDevice);
    app.directive("device-mobile", vDevice.vDeviceMobile);
    app.directive("device-tablet", vDevice.vDeviceTablet);
    app.directive("device-desktop", vDevice.vDeviceDesktop);
    const originalUnmount = app.unmount;
    app.unmount = function() {
      detector.destroy();
      return originalUnmount.call(this);
    };
  }
};
function createDevicePlugin(options = {}) {
  return {
    install(app) {
      if (DevicePlugin.install) {
        DevicePlugin.install(app, options);
      }
    }
  };
}
function useDeviceDetector() {
  const detector = vue.inject("device-detector");
  if (!detector) {
    throw new Error("DeviceDetector not found. Make sure to install DevicePlugin first.");
  }
  return detector;
}

exports.DevicePlugin = DevicePlugin;
exports.createDevicePlugin = createDevicePlugin;
exports.default = DevicePlugin;
exports.useDeviceDetector = useDeviceDetector;
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=plugin.cjs.map
