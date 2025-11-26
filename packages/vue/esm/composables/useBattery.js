/*!
 * ***********************************
 * @ldesign/device-vue v1.0.0      *
 * Built with rollup               *
 * Build time: 2024-11-26 15:37:00 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import process from 'node:process';
import { ref, readonly, computed, onUnmounted } from 'vue';
import { DeviceDetector } from '@ldesign/device-core';

function useBattery() {
  const batteryInfo = ref(null);
  const batteryLevel = ref(1);
  const isCharging = ref(false);
  const batteryStatus = ref("unknown");
  const isLoaded = ref(false);
  const error = ref(null);
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
      detector = new DeviceDetector();
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
  const batteryPercentage = readonly(computed(() => Math.round(batteryLevel.value * 100)));
  const isLowBattery = readonly(computed(() => batteryLevel.value < 0.2));
  const isCriticalBattery = readonly(computed(() => batteryLevel.value < 0.1));
  onUnmounted(() => {
    destroyBattery();
  });
  return {
    batteryInfo: readonly(batteryInfo),
    batteryLevel: readonly(batteryLevel),
    isCharging: readonly(isCharging),
    batteryStatus: readonly(batteryStatus),
    isLoaded: readonly(isLoaded),
    error: readonly(error),
    batteryPercentage,
    isLowBattery,
    isCriticalBattery,
    loadModule,
    unloadModule,
    refresh
  };
}

export { useBattery };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useBattery.js.map
