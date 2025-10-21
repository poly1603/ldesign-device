/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, readonly, computed, onMounted, onUnmounted } from 'vue';
import { DeviceDetector } from '../../core/DeviceDetector.js';

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
  const width = ref(0);
  const height = ref(0);
  const current = ref("mobile");
  let detector = null;
  let isInitialized = false;
  let cleanupFunctions = [];
  const getCurrentBreakpoint = (screenWidth) => {
    if (config.xxl && screenWidth >= config.xxl) return "xxl";
    if (config.xl && screenWidth >= config.xl) return "xl";
    if (screenWidth >= config.desktop) return "desktop";
    if (screenWidth >= config.tablet) return "tablet";
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
  const isMobile = readonly(computed(() => current.value === "mobile"));
  const isTablet = readonly(computed(() => current.value === "tablet"));
  const isDesktop = readonly(computed(() => current.value === "desktop"));
  const isXL = readonly(computed(() => current.value === "xl"));
  const isXXL = readonly(computed(() => current.value === "xxl"));
  const isSmallScreen = readonly(computed(() => width.value < config.tablet));
  const isMediumScreen = readonly(computed(() => width.value >= config.tablet && width.value < config.desktop));
  const isLargeScreen = readonly(computed(() => width.value >= config.desktop));
  const aspectRatio = readonly(computed(() => height.value > 0 ? width.value / height.value : 0));
  const isWideScreen = readonly(computed(() => aspectRatio.value > 1.5));
  const isSquareScreen = readonly(computed(() => Math.abs(aspectRatio.value - 1) < 0.2));
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
      detector = new DeviceDetector({
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
  onMounted(() => {
    initDetector();
  });
  onUnmounted(() => {
    destroyDetector();
  });
  return {
    // 基本状态
    current: readonly(current),
    width: readonly(width),
    height: readonly(height),
    // 断点检查
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
    greaterThan: readonly(computed(() => greaterThan)),
    lessThan: readonly(computed(() => lessThan)),
    between: readonly(computed(() => between)),
    matches: readonly(computed(() => matches)),
    // 工具方法
    getBreakpointValue,
    refresh,
    // 配置信息
    breakpoints: readonly(ref(config))
  };
}

export { useBreakpoints };
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=useBreakpoints.js.map
