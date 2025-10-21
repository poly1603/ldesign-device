/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { inject } from 'vue';
import { DeviceDetector } from '../core/DeviceDetector.js';
import { vDevice, vDeviceMobile, vDeviceTablet, vDeviceDesktop } from './directives/vDevice.js';

const DevicePlugin = {
  install(app, options = {}) {
    const {
      globalPropertyName = "$device",
      ...detectorOptions
    } = options;
    const detector = new DeviceDetector(detectorOptions);
    app.config.globalProperties[globalPropertyName] = detector;
    app.provide("device-detector", detector);
    app.directive("device", vDevice);
    app.directive("device-mobile", vDeviceMobile);
    app.directive("device-tablet", vDeviceTablet);
    app.directive("device-desktop", vDeviceDesktop);
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
  const detector = inject("device-detector");
  if (!detector) {
    throw new Error("DeviceDetector not found. Make sure to install DevicePlugin first.");
  }
  return detector;
}

export { DevicePlugin, createDevicePlugin, DevicePlugin as default, useDeviceDetector };
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=plugin.js.map
