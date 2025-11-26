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

function useClipboard() {
  const isSupported = ref(false);
  const isLoaded = ref(false);
  const copySuccess = ref(false);
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
  onUnmounted(async () => {
    if (detector) {
      await detector.destroy();
      detector = null;
      module = null;
    }
  });
  return {
    isSupported: readonly(isSupported),
    isLoaded: readonly(isLoaded),
    copySuccess: readonly(copySuccess),
    writeText,
    readText,
    writeImage,
    readImage,
    copySelection
  };
}

export { useClipboard };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useClipboard.js.map
