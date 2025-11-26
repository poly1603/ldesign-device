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
var deviceCore = require('@ldesign/device-core');

function useNetwork() {
  const networkInfo = vue.ref(null);
  const isLoaded = vue.ref(false);
  let detector = null;
  async function loadModule() {
    if (isLoaded.value)
      return;
    try {
      detector = new deviceCore.DeviceDetector({});
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
  vue.onUnmounted(() => {
    unloadModule();
  });
  return {
    networkInfo: vue.readonly(networkInfo),
    isLoaded: vue.readonly(isLoaded),
    loadModule,
    unloadModule
  };
}

exports.useNetwork = useNetwork;
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useNetwork.js.map
