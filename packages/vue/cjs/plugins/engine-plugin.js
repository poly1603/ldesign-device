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

var deviceCore = require('@ldesign/device-core');
var plugin = require('../plugin.js');

function createDeviceEnginePlugin(options = {}) {
  const {
    name = "device",
    version = "1.0.0",
    debug = false,
    enableResize = true,
    enableOrientation = true,
    modules = ["network", "battery"],
    globalPropertyName = "$device",
    registerComponents = true,
    registerDirectives = true
  } = options;
  return {
    name,
    version,
    async install(context) {
      const {
        engine
      } = context;
      if (debug) {
        console.log("[Device Plugin] Installing...");
      }
      const detector = new deviceCore.DeviceDetector({
        enableResize,
        enableOrientation
      });
      for (const moduleName of modules) {
        try {
          await detector.loadModule(moduleName);
          if (debug) {
            console.log(`[Device Plugin] Module loaded: ${moduleName}`);
          }
        } catch (error) {
          console.warn(`[Device Plugin] Failed to load module: ${moduleName}`, error);
        }
      }
      engine.state.set("device:instance", detector);
      engine.state.set("device:info", detector.getDeviceInfo());
      engine.api.register({
        name,
        version,
        /** 获取设备检测器实例 */
        getInstance: () => detector,
        /** 获取设备信息 */
        getDeviceInfo: () => detector.getDeviceInfo(),
        /** 获取设备类型 */
        getDeviceType: () => detector.getDeviceInfo().type,
        /** 是否移动设备 */
        isMobile: () => detector.getDeviceInfo().type === "mobile",
        /** 是否平板设备 */
        isTablet: () => detector.getDeviceInfo().type === "tablet",
        /** 是否桌面设备 */
        isDesktop: () => detector.getDeviceInfo().type === "desktop",
        /** 刷新设备信息 */
        refresh: () => {
          const info = detector.getDeviceInfo();
          engine.state.set("device:info", info);
          return info;
        }
      });
      detector.on("deviceChange", (info) => {
        engine.state.set("device:info", info);
        engine.events.emit("device:change", info);
      });
      detector.on("orientationChange", (orientation) => {
        engine.events.emit("device:orientation-change", orientation);
      });
      const app = engine.getApp();
      if (app && typeof app === "object" && "use" in app) {
        app.use(plugin.createDevicePlugin(detector, {
          globalPropertyName,
          registerComponents,
          registerDirectives
        }));
      }
      if (debug) {
        console.log("[Device Plugin] Installed successfully");
        console.log("[Device Plugin] Device Info:", detector.getDeviceInfo());
      }
    },
    async uninstall(context) {
      const {
        engine
      } = context;
      const detector = engine.state.get("device:instance");
      if (detector && typeof detector.destroy === "function") {
        detector.destroy();
      }
      engine.state.delete("device:instance");
      engine.state.delete("device:info");
      engine.api.unregister("device");
    }
  };
}
const devicePlugin = createDeviceEnginePlugin();

exports.createDeviceEnginePlugin = createDeviceEnginePlugin;
exports.devicePlugin = devicePlugin;
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=engine-plugin.js.map
