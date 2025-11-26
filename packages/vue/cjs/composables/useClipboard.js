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

function useClipboard() {
  const isSupported = vue.ref(false);
  const isLoaded = vue.ref(false);
  const copySuccess = vue.ref(false);
  let detector = null;
  let module = null;
  const loadModule = async () => {
    if (!detector) {
      detector = new CoreDeviceDetector();
    }
    try {
      module = await detector.loadModule("clipboard");
      isSupported.value = module.isSupported();
      isLoaded.value = true;
      module.on("writeSuccess", () => {
        copySuccess.value = true;
      });
      module.on("error", () => {
        copySuccess.value = false;
      });
    } catch (error) {
      console.warn("Failed to load clipboard module:", error);
      throw error;
    }
  };
  const writeText = async (text) => {
    if (!module) {
      await loadModule();
    }
    const success = await module.writeText(text);
    copySuccess.value = success;
    return success;
  };
  const readText = async () => {
    if (!module) {
      await loadModule();
    }
    return module.readText();
  };
  const writeImage = async (blob) => {
    if (!module) {
      await loadModule();
    }
    const success = await module.writeImage(blob);
    copySuccess.value = success;
    return success;
  };
  const readImage = async () => {
    if (!module) {
      await loadModule();
    }
    return module.readImage();
  };
  const copySelection = () => {
    if (!module) {
      console.warn("Module not loaded");
      return false;
    }
    const success = module.copySelection();
    copySuccess.value = success;
    return success;
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
    copySuccess: vue.readonly(copySuccess),
    writeText,
    readText,
    writeImage,
    readImage,
    copySelection
  };
}

exports.useClipboard = useClipboard;
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useClipboard.js.map
