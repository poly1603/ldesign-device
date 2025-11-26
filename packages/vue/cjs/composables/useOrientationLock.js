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

var vue = require('vue');

function useOrientationLock() {
  const isSupported = vue.ref(false);
  const isLocked = vue.ref(false);
  const currentOrientation = vue.ref(null);
  const currentAngle = vue.ref(null);
  const isLandscape = vue.ref(false);
  const isPortrait = vue.ref(false);
  const isLoaded = vue.ref(false);
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
  vue.onUnmounted(async () => {
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
    isSupported: vue.readonly(isSupported),
    isLocked: vue.readonly(isLocked),
    currentOrientation: vue.readonly(currentOrientation),
    currentAngle: vue.readonly(currentAngle),
    isLandscape: vue.readonly(isLandscape),
    isPortrait: vue.readonly(isPortrait),
    isLoaded: vue.readonly(isLoaded),
    lock,
    unlock,
    lockLandscape,
    lockPortrait
  };
}

exports.useOrientationLock = useOrientationLock;
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useOrientationLock.js.map
