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

var vue = require('vue');
var deviceCore = require('@ldesign/device-core');
var vDevice = require('./directives/vDevice.js');
var constants = require('./constants.js');

function createDevicePlugin(detector, options = {}) {
  const {
    globalPropertyName = "$device",
    registerComponents = true,
    registerDirectives = true,
    enableResize = true,
    enableOrientation = true,
    modules = []
  } = options;
  return {
    install(app) {
      const deviceDetector = detector || new deviceCore.DeviceDetector({
        enableResize,
        enableOrientation
      });
      if (!detector && modules.length > 0) {
        for (const moduleName of modules) {
          deviceDetector.loadModule(moduleName).catch((error) => {
            console.warn(`[Device Plugin] Failed to load module: ${moduleName}`, error);
          });
        }
      }
      if (globalPropertyName) {
        app.config.globalProperties[globalPropertyName] = deviceDetector;
      }
      app.provide(constants.DEVICE_INJECTION_KEY, deviceDetector);
      if (registerDirectives) {
        app.directive("device", vDevice.vDevice);
      }
      const originalUnmount = app.unmount;
      app.unmount = function() {
        if (typeof deviceDetector.destroy === "function") {
          deviceDetector.destroy();
        }
        return originalUnmount.call(this);
      };
    }
  };
}
function useDeviceDetector() {
  return vue.inject(constants.DEVICE_INJECTION_KEY, null);
}

exports.createDevicePlugin = createDevicePlugin;
exports.useDeviceDetector = useDeviceDetector;
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=plugin.js.map
