/*!
 * ***********************************
 * @ldesign/device-vue v1.0.0      *
 * Built with rollup               *
 * Build time: 2024-11-26 14:52:34 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, onUnmounted, readonly } from 'vue';

function useOrientationLock() {
  const isSupported = ref(false);
  const isLocked = ref(false);
  const currentOrientation = ref(null);
  const currentAngle = ref(null);
  const isLandscape = ref(false);
  const isPortrait = ref(false);
  const isLoaded = ref(false);
  let detector = null;
  let module = null;
  const updateOrientationInfo = () => {
    if (!module)
      return;
    const info = module.getOrientationInfo();
    currentOrientation.value = info.type;
    currentAngle.value = info.angle;
    isLandscape.value = info.isLandscape;
    isPortrait.value = info.isPortrait;
    isLocked.value = info.isLocked;
  };
  const loadModule = async () => {
    if (!detector) {
      detector = new CoreDeviceDetector();
    }
    try {
      module = await detector.loadModule("orientationLock");
      isSupported.value = module.isSupported();
      isLoaded.value = true;
      updateOrientationInfo();
      module.on("locked", () => {
        isLocked.value = true;
      });
      module.on("unlocked", () => {
        isLocked.value = false;
      });
      module.on("orientationChange", () => {
        updateOrientationInfo();
      });
    } catch (error) {
      console.warn("Failed to load orientation lock module:", error);
      throw error;
    }
  };
  const lock = async (orientation) => {
    if (!module) {
      await loadModule();
    }
    const success = await module.lock(orientation);
    updateOrientationInfo();
    return success;
  };
  const unlock = () => {
    if (!module) {
      console.warn("Module not loaded");
      return;
    }
    module.unlock();
    updateOrientationInfo();
  };
  const lockLandscape = async () => {
    return lock("landscape");
  };
  const lockPortrait = async () => {
    return lock("portrait");
  };
  onUnmounted(async () => {
    if (module) {
      unlock();
    }
    if (detector) {
      await detector.destroy();
      detector = null;
      module = null;
    }
  });
  return {
    isSupported: readonly(isSupported),
    isLocked: readonly(isLocked),
    currentOrientation: readonly(currentOrientation),
    currentAngle: readonly(currentAngle),
    isLandscape: readonly(isLandscape),
    isPortrait: readonly(isPortrait),
    isLoaded: readonly(isLoaded),
    lock,
    unlock,
    lockLandscape,
    lockPortrait
  };
}

export { useOrientationLock };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useOrientationLock.js.map
