/*!
 * ***********************************
 * @ldesign/device-vue v1.0.0      *
 * Built with rollup               *
 * Build time: 2024-11-26 15:37:00 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var process = require('node:process');
var vue = require('vue');
var deviceCore = require('@ldesign/device-core');

function useBattery() {
  const batteryInfo = vue.ref(null);
  const batteryLevel = vue.ref(1);
  const isCharging = vue.ref(false);
  const batteryStatus = vue.ref("unknown");
  const isLoaded = vue.ref(false);
  const error = vue.ref(null);
  let detector = null;
  let batteryModule = null;
  let cleanupFunctions = [];
  const updateBatteryInfo = (info) => {
    batteryInfo.value = info;
    batteryLevel.value = info.level;
    isCharging.value = info.charging;
    batteryStatus.value = info.chargingTime > 0 ? "charging" : info.dischargingTime > 0 ? "discharging" : "unknown";
  };
  const loadModule = async () => {
    if (!detector) {
      detector = new deviceCore.DeviceDetector();
    }
    try {
      batteryModule = await detector.loadModule("battery");
      if (batteryModule && typeof batteryModule.getData === "function") {
        const info = batteryModule.getData();
        updateBatteryInfo(info);
        isLoaded.value = true;
        error.value = null;
        const maybeOn = batteryModule.on;
        const maybeOff = batteryModule.off;
        if (typeof maybeOn === "function" && typeof maybeOff === "function") {
          const batteryChangeHandler = (newInfo) => {
            updateBatteryInfo(newInfo);
          };
          maybeOn.call(batteryModule, "batteryChange", batteryChangeHandler);
          cleanupFunctions.push(() => maybeOff.call(batteryModule, "batteryChange", batteryChangeHandler));
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load battery module";
      if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
        console.warn("Failed to load battery module:", err);
      }
      throw err;
    }
  };
  const unloadModule = async () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    cleanupFunctions = [];
    if (detector) {
      await detector.unloadModule("battery");
      batteryModule = null;
      batteryInfo.value = null;
      batteryLevel.value = 1;
      isCharging.value = false;
      batteryStatus.value = "unknown";
      isLoaded.value = false;
      error.value = null;
    }
  };
  const destroyBattery = async () => {
    await unloadModule();
    if (detector) {
      await detector.destroy();
      detector = null;
    }
  };
  const refresh = async () => {
    if (batteryModule && isLoaded.value) {
      try {
        const info = batteryModule.getData();
        updateBatteryInfo(info);
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to refresh battery info";
      }
    }
  };
  const batteryPercentage = vue.readonly(vue.computed(() => Math.round(batteryLevel.value * 100)));
  const isLowBattery = vue.readonly(vue.computed(() => batteryLevel.value < 0.2));
  const isCriticalBattery = vue.readonly(vue.computed(() => batteryLevel.value < 0.1));
  vue.onUnmounted(() => {
    destroyBattery();
  });
  return {
    batteryInfo: vue.readonly(batteryInfo),
    batteryLevel: vue.readonly(batteryLevel),
    isCharging: vue.readonly(isCharging),
    batteryStatus: vue.readonly(batteryStatus),
    isLoaded: vue.readonly(isLoaded),
    error: vue.readonly(error),
    batteryPercentage,
    isLowBattery,
    isCriticalBattery,
    loadModule,
    unloadModule,
    refresh
  };
}

exports.useBattery = useBattery;
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useBattery.js.map
