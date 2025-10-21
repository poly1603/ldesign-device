/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { DeviceDetector } from '../core/DeviceDetector.js';
import { DevicePlugin } from '../vue/plugin.js';

const defaultConfig = {
  name: "device",
  version: "1.0.0",
  description: "LDesign Device Engine Plugin",
  dependencies: [],
  autoInstall: true,
  enablePerformanceMonitoring: false,
  debug: false,
  globalPropertyName: "$device",
  enableResize: true,
  enableOrientation: true,
  modules: ["network", "battery", "geolocation"]
};
function createGlobalDeviceInstance(config) {
  const {
    enableResize = true,
    enableOrientation = true,
    modules = ["network", "battery", "geolocation"],
    debug = false
  } = config;
  if (debug) {
    console.warn("[Device Plugin] Creating global device instance with config:", {
      enableResize,
      enableOrientation,
      modules
    });
  }
  const detector = new DeviceDetector({
    enableResize,
    enableOrientation
  });
  if (modules.includes("network")) {
    detector.loadModule("network");
  }
  if (modules.includes("battery")) {
    detector.loadModule("battery");
  }
  if (modules.includes("geolocation")) {
    detector.loadModule("geolocation");
  }
  if (debug) {
    console.warn("[Device Plugin] Global device instance created successfully");
  }
  return detector;
}
function createDeviceEnginePlugin(options = {}) {
  const config = {
    ...defaultConfig,
    ...options
  };
  const {
    name = "device",
    version = "1.0.0",
    description = "LDesign Device Engine Plugin",
    dependencies = [],
    autoInstall = true,
    enablePerformanceMonitoring = false,
    debug = false
  } = config;
  if (debug) {
    console.warn("[Device Plugin] createDeviceEnginePlugin called with options:", options);
  }
  return {
    name,
    version,
    dependencies,
    async install(context) {
      try {
        if (debug) {
          console.warn("[Device Plugin] install method called with context:", context);
        }
        const engineRaw = context.engine ?? context;
        const engine = engineRaw;
        if (debug) {
          console.warn("[Device Plugin] engine instance:", !!engine);
        }
        const performInstall = async () => {
          engine.logger?.info(`[Device Plugin] performInstall called`);
          const vueApp = engine.getApp();
          if (!vueApp) {
            throw new Error("Vue app not found. Make sure the engine has created a Vue app before installing device plugin.");
          }
          engine.logger?.info(`[Device Plugin] Vue app found, proceeding with installation`);
          engine.logger?.info(`Installing ${name} plugin...`, {
            version,
            enablePerformanceMonitoring,
            description
          });
          const globalDevice = createGlobalDeviceInstance(config);
          if (engine.state) {
            engine.state.set("device", globalDevice);
            engine.logger?.info(`[Device Plugin] Device instance registered to engine state`);
          }
          if (autoInstall) {
            vueApp.use(DevicePlugin, config);
            engine.logger?.info(`[Device Plugin] Vue plugin installed`);
          }
          const globalPropertyName = config.globalPropertyName || "$device";
          if (!vueApp.config?.globalProperties[globalPropertyName]) {
            vueApp.config.globalProperties[globalPropertyName] = globalDevice;
            engine.logger?.info(`[Device Plugin] Global property ${globalPropertyName} added`);
          }
          if (enablePerformanceMonitoring) {
            const startTime = performance.now();
            globalDevice.on("deviceChange", (deviceInfo) => {
              const endTime = performance.now();
              engine.logger?.info(`[Device Plugin] Device change detected in ${endTime - startTime}ms`, deviceInfo);
            });
            engine.logger?.info(`[Device Plugin] Performance monitoring enabled`);
          }
          engine.events?.on("app:beforeUnmount", () => {
            globalDevice.destroy();
            engine.logger?.info(`[Device Plugin] Device detector destroyed on app unmount`);
          });
          engine.logger?.info(`[Device Plugin] ${name} plugin installed successfully`);
        };
        if (engine.getApp()) {
          await performInstall();
        } else {
          await new Promise((resolve, reject) => {
            engine.events?.once("app:created", async () => {
              try {
                await performInstall();
                resolve();
              } catch (error) {
                engine.logger?.error(`[Device Plugin] Failed to install after app creation:`, error);
                reject(error);
              }
            });
          });
        }
      } catch (error) {
        const errorMessage = `Failed to install ${name} plugin: ${error instanceof Error ? error.message : String(error)}`;
        const ctx = context;
        if (ctx.engine?.logger) {
          ctx.engine.logger.error(errorMessage, {
            error
          });
        } else {
          console.error(errorMessage);
        }
        throw new Error(errorMessage);
      }
    },
    async uninstall(context) {
      try {
        if (debug) {
          console.warn("[Device Plugin] uninstall method called");
        }
        const engineRaw = context.engine ?? context;
        const engine = engineRaw;
        if (engine.state) {
          const deviceInstance = engine.state.get("device");
          if (deviceInstance && typeof deviceInstance.destroy === "function") {
            deviceInstance.destroy();
          }
          engine.state.delete("device");
        }
        const vueApp = engine.getApp();
        if (vueApp) {
          const globalPropertyName = config.globalPropertyName || "$device";
          if (vueApp.config?.globalProperties) {
            delete vueApp.config.globalProperties[globalPropertyName];
          }
        }
        engine.logger?.info(`[Device Plugin] ${name} plugin uninstalled successfully`);
      } catch (error) {
        const errorMessage = `Failed to uninstall ${name} plugin: ${error instanceof Error ? error.message : String(error)}`;
        const ctx = context;
        if (ctx.engine?.logger) {
          ctx.engine.logger.error(errorMessage, {
            error
          });
        } else {
          console.error(errorMessage);
        }
        throw new Error(errorMessage);
      }
    }
  };
}

export { createDeviceEnginePlugin, createDeviceEnginePlugin as default };
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=plugin.js.map
