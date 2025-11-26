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

function useGeolocation() {
  const position = vue.ref(null);
  const latitude = vue.ref(null);
  const longitude = vue.ref(null);
  const accuracy = vue.ref(null);
  const altitude = vue.ref(null);
  const heading = vue.ref(null);
  const speed = vue.ref(null);
  const error = vue.ref(null);
  const isSupported = vue.ref(false);
  const isLoaded = vue.ref(false);
  const isWatching = vue.ref(false);
  const isLoading = vue.ref(false);
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
      detector = new CoreDeviceDetector();
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
    if (!geolocationModule || !isWatching.value)
      return;
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
      if (isWatching.value)
        return;
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
  const hasPosition = vue.computed(() => position.value !== null);
  const isHighAccuracy = vue.computed(() => (accuracy.value ?? 0) < 100);
  const coordinates = vue.computed(() => {
    if (!latitude.value || !longitude.value)
      return null;
    return {
      lat: latitude.value,
      lng: longitude.value
    };
  });
  vue.onUnmounted(() => {
    destroyGeolocation();
  });
  return {
    position: vue.readonly(position),
    latitude: vue.readonly(latitude),
    longitude: vue.readonly(longitude),
    accuracy: vue.readonly(accuracy),
    altitude: vue.readonly(altitude),
    heading: vue.readonly(heading),
    speed: vue.readonly(speed),
    error: vue.readonly(error),
    isSupported: vue.readonly(isSupported),
    isWatching: vue.readonly(isWatching),
    isLoaded: vue.readonly(isLoaded),
    isLoading: vue.readonly(isLoading),
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

exports.useGeolocation = useGeolocation;
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useGeolocation.js.map
