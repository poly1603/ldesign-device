/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, computed, onUnmounted, readonly } from 'vue';
import { DeviceDetector } from '../../core/DeviceDetector.js';

function useGeolocation() {
  const position = ref(null);
  const latitude = ref(null);
  const longitude = ref(null);
  const accuracy = ref(null);
  const altitude = ref(null);
  const heading = ref(null);
  const speed = ref(null);
  const error = ref(null);
  const isSupported = ref(false);
  const isLoaded = ref(false);
  const isWatching = ref(false);
  const isLoading = ref(false);
  let detector = null;
  let geolocationModule = null;
  let cleanupFunctions = [];
  const updatePosition = (pos) => {
    position.value = pos;
    latitude.value = pos.latitude;
    longitude.value = pos.longitude;
    accuracy.value = pos.accuracy;
    altitude.value = pos.altitude ?? null;
    heading.value = pos.heading ?? null;
    speed.value = pos.speed ?? null;
    error.value = null;
  };
  const loadModule = async () => {
    if (!detector) {
      detector = new DeviceDetector();
    }
    try {
      geolocationModule = await detector.loadModule("geolocation");
      if (geolocationModule && typeof geolocationModule.isSupported === "function") {
        isSupported.value = geolocationModule.isSupported();
        isLoaded.value = true;
        error.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load geolocation module";
      console.warn("Failed to load geolocation module:", err);
      throw err;
    }
  };
  const stopWatching = async () => {
    if (!geolocationModule || !isWatching.value) return;
    try {
      if (geolocationModule && typeof geolocationModule.stopWatching === "function") {
        geolocationModule.stopWatching();
        isWatching.value = false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to stop watching position";
      throw err;
    }
  };
  const unloadModule = async () => {
    if (isWatching.value) {
      await stopWatching();
    }
    cleanupFunctions.forEach((cleanup) => cleanup());
    cleanupFunctions = [];
    if (detector) {
      await detector.unloadModule("geolocation");
      geolocationModule = null;
      position.value = null;
      latitude.value = null;
      longitude.value = null;
      accuracy.value = null;
      altitude.value = null;
      heading.value = null;
      speed.value = null;
      isLoaded.value = false;
      error.value = null;
    }
  };
  const getCurrentPosition = async (options) => {
    if (!geolocationModule) {
      await loadModule();
    }
    isLoading.value = true;
    try {
      if (!isSupported.value) {
        const err = new Error("Geolocation is not supported");
        error.value = err.message;
        throw err;
      }
      if (geolocationModule && typeof geolocationModule.getCurrentPosition === "function") {
        const pos = await geolocationModule.getCurrentPosition(options);
        updatePosition(pos);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to get current position";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const startWatching = async () => {
    if (!geolocationModule || isWatching.value) {
      if (!geolocationModule) {
        await loadModule();
      }
      if (isWatching.value) return;
    }
    if (!isSupported.value) {
      throw new Error("Geolocation is not supported");
    }
    try {
      if (geolocationModule && typeof geolocationModule.startWatching === "function") {
        const positionHandler = (pos) => {
          updatePosition(pos);
        };
        geolocationModule.startWatching(positionHandler);
        isWatching.value = true;
        error.value = null;
        cleanupFunctions.push(() => {
          if (geolocationModule && typeof geolocationModule.stopWatching === "function") {
            geolocationModule.stopWatching();
          }
        });
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to start watching position";
      throw err;
    }
  };
  const destroyGeolocation = async () => {
    await unloadModule();
    if (detector) {
      await detector.destroy();
      detector = null;
    }
  };
  const hasPosition = computed(() => position.value !== null);
  const isHighAccuracy = computed(() => (accuracy.value ?? 0) < 100);
  const coordinates = computed(() => {
    if (!latitude.value || !longitude.value) return null;
    return {
      lat: latitude.value,
      lng: longitude.value
    };
  });
  onUnmounted(() => {
    destroyGeolocation();
  });
  return {
    position: readonly(position),
    latitude: readonly(latitude),
    longitude: readonly(longitude),
    accuracy: readonly(accuracy),
    altitude: readonly(altitude),
    heading: readonly(heading),
    speed: readonly(speed),
    error: readonly(error),
    isSupported: readonly(isSupported),
    isWatching: readonly(isWatching),
    isLoaded: readonly(isLoaded),
    isLoading: readonly(isLoading),
    hasPosition,
    isHighAccuracy,
    coordinates,
    loadModule,
    unloadModule,
    getCurrentPosition,
    startWatching,
    stopWatching
  };
}

export { useGeolocation };
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=useGeolocation.js.map
