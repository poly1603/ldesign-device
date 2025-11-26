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

function useWakeLock() {
  const isSupported = ref(false);
  const isActive = ref(false);
  const isLoaded = ref(false);
  let detector = null;
  let module = null;
  const loadModule = async () => {
    if (!detector) {
      detector = new CoreDeviceDetector();
    }
    try {
      module = await detector.loadModule("wakeLock");
      isSupported.value = module.isSupported();
      isActive.value = module.isActive();
      isLoaded.value = true;
      module.on("acquired", () => {
        isActive.value = true;
      });
      module.on("released", () => {
        isActive.value = false;
      });
    } catch (error) {
      console.warn("Failed to load wake lock module:", error);
      throw error;
    }
  };
  const request = async () => {
    if (!module) {
      await loadModule();
    }
    const success = await module.requestWakeLock();
    isActive.value = module.isActive();
    return success;
  };
  const release = async () => {
    if (!module) {
      return;
    }
    await module.releaseWakeLock();
    isActive.value = false;
  };
  const enableAutoReacquire = (enable) => {
    if (!module) {
      console.warn("Module not loaded");
      return;
    }
    module.enableAutoReacquire(enable);
  };
  onUnmounted(async () => {
    if (module) {
      await release();
    }
    if (detector) {
      await detector.destroy();
      detector = null;
      module = null;
    }
  });
  return {
    isSupported: readonly(isSupported),
    isActive: readonly(isActive),
    isLoaded: readonly(isLoaded),
    request,
    release,
    enableAutoReacquire
  };
}

export { useWakeLock };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useWakeLock.js.map
