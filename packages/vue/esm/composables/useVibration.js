/*!
 * ***********************************
 * @ldesign/device-vue v1.0.0      *
 * Built with rollup               *
 * Build time: 2024-11-26 15:37:00 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, onUnmounted, readonly } from 'vue';

function useVibration() {
  const isSupported = ref(false);
  const isVibrating = ref(false);
  const isLoaded = ref(false);
  let detector = null;
  let module = null;
  const loadModule = async () => {
    if (!detector) {
      detector = new CoreDeviceDetector();
    }
    try {
      module = await detector.loadModule("vibration");
      isSupported.value = module.isSupported();
      isLoaded.value = true;
      module.on("vibrationStart", () => {
        isVibrating.value = true;
      });
      module.on("vibrationEnd", () => {
        isVibrating.value = false;
      });
    } catch (error) {
      console.warn("Failed to load vibration module:", error);
      throw error;
    }
  };
  const vibrate = (pattern) => {
    if (!module) {
      console.warn("Module not loaded");
      return false;
    }
    return module.vibrate(pattern);
  };
  const vibratePattern = (name) => {
    if (!module) {
      console.warn("Module not loaded");
      return false;
    }
    return module.vibratePattern(name);
  };
  const stop = () => {
    if (!module) {
      return false;
    }
    return module.stop();
  };
  const getPatterns = () => {
    if (!module) {
      return [];
    }
    return module.getAvailablePatterns();
  };
  loadModule().catch(() => {
  });
  onUnmounted(async () => {
    if (module) {
      stop();
    }
    if (detector) {
      await detector.destroy();
      detector = null;
      module = null;
    }
  });
  return {
    isSupported: readonly(isSupported),
    isVibrating: readonly(isVibrating),
    isLoaded: readonly(isLoaded),
    vibrate,
    vibratePattern,
    stop,
    getPatterns
  };
}

export { useVibration };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useVibration.js.map
