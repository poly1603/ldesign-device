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

const DEFAULT_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
  xl: 1400,
  xxl: 1600
};
function useBreakpoints(breakpoints = {}, options = {}) {
  const config = {
    ...DEFAULT_BREAKPOINTS,
    ...breakpoints
  };
  const width = vue.ref(0);
  const height = vue.ref(0);
  const current = vue.ref("mobile");
  let detector = null;
  let isInitialized = false;
  let cleanupFunctions = [];
  const getCurrentBreakpoint = (screenWidth) => {
    if (config.xxl && screenWidth >= config.xxl)
      return "xxl";
    if (config.xl && screenWidth >= config.xl)
      return "xl";
    if (screenWidth >= config.desktop)
      return "desktop";
    if (screenWidth >= config.tablet)
      return "tablet";
    return "mobile";
  };
  const updateDimensions = (deviceInfo) => {
    const newWidth = deviceInfo.screen.width;
    const newHeight = deviceInfo.screen.height;
    const newBreakpoint = getCurrentBreakpoint(newWidth);
    if (width.value !== newWidth) {
      width.value = newWidth;
    }
    if (height.value !== newHeight) {
      height.value = newHeight;
    }
    if (current.value !== newBreakpoint) {
      current.value = newBreakpoint;
    }
  };
  const isMobile = vue.readonly(vue.computed(() => current.value === "mobile"));
  const isTablet = vue.readonly(vue.computed(() => current.value === "tablet"));
  const isDesktop = vue.readonly(vue.computed(() => current.value === "desktop"));
  const isXL = vue.readonly(vue.computed(() => current.value === "xl"));
  const isXXL = vue.readonly(vue.computed(() => current.value === "xxl"));
  const isSmallScreen = vue.readonly(vue.computed(() => width.value < config.tablet));
  const isMediumScreen = vue.readonly(vue.computed(() => width.value >= config.tablet && width.value < config.desktop));
  const isLargeScreen = vue.readonly(vue.computed(() => width.value >= config.desktop));
  const aspectRatio = vue.readonly(vue.computed(() => height.value > 0 ? width.value / height.value : 0));
  const isWideScreen = vue.readonly(vue.computed(() => aspectRatio.value > 1.5));
  const isSquareScreen = vue.readonly(vue.computed(() => Math.abs(aspectRatio.value - 1) < 0.2));
  const greaterThan = (breakpoint) => {
    const breakpointOrder = ["mobile", "tablet", "desktop", "xl", "xxl"];
    const currentIndex = breakpointOrder.indexOf(current.value);
    const targetIndex = breakpointOrder.indexOf(breakpoint);
    return currentIndex > targetIndex;
  };
  const lessThan = (breakpoint) => {
    const breakpointOrder = ["mobile", "tablet", "desktop", "xl", "xxl"];
    const currentIndex = breakpointOrder.indexOf(current.value);
    const targetIndex = breakpointOrder.indexOf(breakpoint);
    return currentIndex < targetIndex;
  };
  const between = (minBreakpoint, maxBreakpoint) => {
    const breakpointOrder = ["mobile", "tablet", "desktop", "xl", "xxl"];
    const currentIndex = breakpointOrder.indexOf(current.value);
    const minIndex = breakpointOrder.indexOf(minBreakpoint);
    const maxIndex = breakpointOrder.indexOf(maxBreakpoint);
    return currentIndex >= minIndex && currentIndex <= maxIndex;
  };
  const matches = (breakpoint) => {
    return current.value === breakpoint;
  };
  const getBreakpointValue = (breakpoint) => {
    return config[breakpoint] || 0;
  };
  const refresh = () => {
    if (detector && isInitialized) {
      const currentInfo = detector.getDeviceInfo();
      updateDimensions(currentInfo);
    }
  };
  const initDetector = () => {
    if (detector || isInitialized) {
      return;
    }
    try {
      detector = new CoreDeviceDetector({
        enableResize: true,
        breakpoints: config,
        ...options
      });
      isInitialized = true;
      updateDimensions(detector.getDeviceInfo());
      const deviceChangeHandler = (deviceInfo) => {
        updateDimensions(deviceInfo);
      };
      detector.on("deviceChange", deviceChangeHandler);
      cleanupFunctions.push(() => detector?.off("deviceChange", deviceChangeHandler));
    } catch (error) {
      console.error("Failed to initialize breakpoint detector:", error);
      isInitialized = false;
    }
  };
  const destroyDetector = async () => {
    try {
      cleanupFunctions.forEach((cleanup) => cleanup());
      cleanupFunctions = [];
      if (detector) {
        await detector.destroy();
        detector = null;
      }
      isInitialized = false;
    } catch (error) {
      console.error("Failed to destroy breakpoint detector:", error);
    }
  };
  vue.onMounted(() => {
    initDetector();
  });
  vue.onUnmounted(() => {
    destroyDetector();
  });
  return {
    // 基本状�?
    current: vue.readonly(current),
    width: vue.readonly(width),
    height: vue.readonly(height),
    // 断点检�?
    isMobile,
    isTablet,
    isDesktop,
    isXL,
    isXXL,
    // 屏幕尺寸类别
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    // 屏幕比例
    aspectRatio,
    isWideScreen,
    isSquareScreen,
    // 断点比较方法
    greaterThan: vue.readonly(vue.computed(() => greaterThan)),
    lessThan: vue.readonly(vue.computed(() => lessThan)),
    between: vue.readonly(vue.computed(() => between)),
    matches: vue.readonly(vue.computed(() => matches)),
    // 工具方法
    getBreakpointValue,
    refresh,
    // 配置信息
    breakpoints: vue.readonly(vue.ref(config))
  };
}

exports.useBreakpoints = useBreakpoints;
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=useBreakpoints.js.map
