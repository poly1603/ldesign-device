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

var vue = require('vue');

function useMediaCapabilities() {
  const isSupported = vue.ref(false);
  const isLoaded = vue.ref(false);
  let detector = null;
  let module = null;
  const loadModule = async () => {
    if (!detector) {
      detector = new CoreDeviceDetector();
    }
    try {
      module = await detector.loadModule("mediaCapabilities");
      isSupported.value = module.isSupported();
      isLoaded.value = true;
    } catch (error) {
      console.warn("Failed to load media capabilities module:", error);
      throw error;
    }
  };
  const unloadModule = async () => {
    if (detector) {
      await detector.unloadModule("mediaCapabilities");
      module = null;
      isLoaded.value = false;
    }
  };
  const checkVideo = async (config) => {
    if (!module) {
      await loadModule();
    }
    return module.checkVideoDecoding(config);
  };
  const checkAudio = async (config) => {
    if (!module) {
      await loadModule();
    }
    return module.checkAudioDecoding(config);
  };
  const getRecommendedQuality = async () => {
    if (!module) {
      await loadModule();
    }
    return module.getRecommendedVideoQuality();
  };
  const checkHDR = async () => {
    if (!module) {
      await loadModule();
    }
    return module.checkHDRSupport();
  };
  vue.onUnmounted(async () => {
    if (detector) {
      await detector.destroy();
      detector = null;
      module = null;
    }
  });
  return {
    isSupported: vue.readonly(isSupported),
    isLoaded: vue.readonly(isLoaded),
    checkVideo,
    checkAudio,
    getRecommendedQuality,
    checkHDR,
    loadModule,
    unloadModule
  };
}

exports.useMediaCapabilities = useMediaCapabilities;
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useMediaCapabilities.js.map
