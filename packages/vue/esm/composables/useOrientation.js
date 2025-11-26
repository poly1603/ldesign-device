/*!
 * ***********************************
 * @ldesign/device-vue v1.0.0      *
 * Built with rollup               *
 * Build time: 2024-11-26 15:37:00 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, readonly, computed, onMounted, onUnmounted } from 'vue';

function useOrientation(options = {}) {
  const orientation = ref("landscape");
  const angle = ref(0);
  const isLocked = ref(false);
  const error = ref(null);
  let detector = null;
  let isInitialized = false;
  let cleanupFunctions = [];
  const isPortrait = readonly(computed(() => orientation.value === "portrait"));
  const isLandscape = readonly(computed(() => orientation.value === "landscape"));
  const isPrimaryPortrait = readonly(computed(() => angle.value === 0));
  const isSecondaryPortrait = readonly(computed(() => angle.value === 180));
  const isPrimaryLandscape = readonly(computed(() => angle.value === 90));
  const isSecondaryLandscape = readonly(computed(() => angle.value === 270));
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
  const isOrientationLockSupported = computed(() => {
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
      detector = new CoreDeviceDetector({
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
  onMounted(() => {
    initDetector();
  });
  onUnmounted(() => {
    destroyDetector();
  });
  return {
    orientation: readonly(orientation),
    angle: readonly(angle),
    isLocked: readonly(isLocked),
    error: readonly(error),
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

export { useOrientation };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useOrientation.js.map
