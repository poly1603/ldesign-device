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

var vue = require('vue');
var DeviceDetector = require('../../core/DeviceDetector.cjs');

function useOrientation(options = {}) {
  const orientation = vue.ref("landscape");
  const angle = vue.ref(0);
  const isLocked = vue.ref(false);
  const error = vue.ref(null);
  let detector = null;
  let isInitialized = false;
  let cleanupFunctions = [];
  const isPortrait = vue.readonly(vue.computed(() => orientation.value === "portrait"));
  const isLandscape = vue.readonly(vue.computed(() => orientation.value === "landscape"));
  const isPrimaryPortrait = vue.readonly(vue.computed(() => angle.value === 0));
  const isSecondaryPortrait = vue.readonly(vue.computed(() => angle.value === 180));
  const isPrimaryLandscape = vue.readonly(vue.computed(() => angle.value === 90));
  const isSecondaryLandscape = vue.readonly(vue.computed(() => angle.value === 270));
  const updateOrientation = (deviceInfo) => {
    if (orientation.value !== deviceInfo.orientation) {
      orientation.value = deviceInfo.orientation;
    }
    if (typeof screen !== "undefined" && screen.orientation) {
      angle.value = screen.orientation.angle || 0;
    }
  };
  const refresh = () => {
    if (detector && isInitialized) {
      const currentInfo = detector.getDeviceInfo();
      updateOrientation(currentInfo);
    }
  };
  const lockOrientation = async (targetOrientation) => {
    try {
      if (typeof screen !== "undefined" && screen.orientation && typeof screen.orientation.lock === "function") {
        await screen.orientation.lock(targetOrientation);
        isLocked.value = true;
        error.value = null;
      } else {
        throw new Error("Screen orientation lock is not supported");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to lock orientation";
      error.value = message;
      console.warn("Failed to lock orientation:", err);
      throw err;
    }
  };
  const unlockOrientation = () => {
    try {
      if (typeof screen !== "undefined" && screen.orientation && typeof screen.orientation.unlock === "function") {
        screen.orientation.unlock();
        isLocked.value = false;
        error.value = null;
      } else {
        throw new Error("Screen orientation unlock is not supported");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to unlock orientation";
      error.value = message;
      console.warn("Failed to unlock orientation:", err);
      throw err;
    }
  };
  const isOrientationLockSupported = vue.computed(() => {
    return typeof screen !== "undefined" && screen.orientation && typeof screen.orientation.lock === "function";
  });
  const getSupportedOrientations = () => {
    return ["portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary", "portrait", "landscape", "natural"];
  };
  const initDetector = () => {
    if (detector || isInitialized) {
      return;
    }
    try {
      detector = new DeviceDetector.DeviceDetector({
        enableOrientation: true,
        ...options
      });
      isInitialized = true;
      updateOrientation(detector.getDeviceInfo());
      const orientationChangeHandler = (newOrientation) => {
        if (orientation.value !== newOrientation) {
          orientation.value = newOrientation;
        }
      };
      const deviceChangeHandler = (deviceInfo) => {
        updateOrientation(deviceInfo);
      };
      detector.on("orientationChange", orientationChangeHandler);
      detector.on("deviceChange", deviceChangeHandler);
      const handleOrientationChange = () => {
        if (typeof screen !== "undefined" && screen.orientation) {
          angle.value = screen.orientation.angle || 0;
        }
        refresh();
      };
      if (typeof screen !== "undefined" && screen.orientation) {
        screen.orientation.addEventListener("change", handleOrientationChange);
        cleanupFunctions.push(() => {
          screen.orientation.removeEventListener("change", handleOrientationChange);
        });
      }
      cleanupFunctions.push(() => detector?.off("orientationChange", orientationChangeHandler), () => detector?.off("deviceChange", deviceChangeHandler));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to initialize orientation detector";
      error.value = message;
      console.error("Failed to initialize orientation detector:", err);
      isInitialized = false;
    }
  };
  const destroyDetector = async () => {
    try {
      if (isLocked.value) {
        try {
          unlockOrientation();
        } catch {
        }
      }
      cleanupFunctions.forEach((cleanup) => cleanup());
      cleanupFunctions = [];
      if (detector) {
        await detector.destroy();
        detector = null;
      }
      isInitialized = false;
    } catch (err) {
      console.error("Failed to destroy orientation detector:", err);
    }
  };
  vue.onMounted(() => {
    initDetector();
  });
  vue.onUnmounted(() => {
    destroyDetector();
  });
  return {
    orientation: vue.readonly(orientation),
    angle: vue.readonly(angle),
    isLocked: vue.readonly(isLocked),
    error: vue.readonly(error),
    isPortrait,
    isLandscape,
    isPrimaryPortrait,
    isSecondaryPortrait,
    isPrimaryLandscape,
    isSecondaryLandscape,
    isOrientationLockSupported,
    lockOrientation,
    unlockOrientation,
    getSupportedOrientations,
    refresh
  };
}

exports.useOrientation = useOrientation;
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=useOrientation.cjs.map
