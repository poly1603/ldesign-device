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
import { DeviceDetector } from '@ldesign/device-core';

function useNetwork() {
  const networkInfo = ref(null);
  const isLoaded = ref(false);
  let detector = null;
  async function loadModule() {
    if (isLoaded.value)
      return;
    try {
      detector = new DeviceDetector({});
      await detector.loadModule("network");
      const module = detector.getModule("network");
      if (module && typeof module.getData === "function") {
        networkInfo.value = module.getData();
      }
      detector.on("network:changed", () => {
        const module2 = detector?.getModule("network");
        if (module2 && typeof module2.getData === "function") {
          networkInfo.value = module2.getData();
        }
      });
      isLoaded.value = true;
    } catch (error) {
      console.error("Failed to load network module:", error);
    }
  }
  function unloadModule() {
    if (detector) {
      detector.unloadModule("network");
      detector = null;
    }
    isLoaded.value = false;
    networkInfo.value = null;
  }
  onUnmounted(() => {
    unloadModule();
  });
  return {
    networkInfo: readonly(networkInfo),
    isLoaded: readonly(isLoaded),
    loadModule,
    unloadModule
  };
}

export { useNetwork };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useNetwork.js.map
