/*!
 * ***********************************
 * @ldesign/device-vue v1.0.0      *
 * Built with rollup               *
 * Build time: 2024-11-26 15:37:00 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { inject } from 'vue';
import { DeviceDetector } from '@ldesign/device-core';
import { vDevice } from './directives/vDevice.js';
import { DEVICE_INJECTION_KEY } from './constants.js';

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
      const deviceDetector = detector || new DeviceDetector({
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
      app.provide(DEVICE_INJECTION_KEY, deviceDetector);
      if (registerDirectives) {
        app.directive("device", vDevice);
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
  return inject(DEVICE_INJECTION_KEY, null);
}

export { createDevicePlugin, useDeviceDetector };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=plugin.js.map
