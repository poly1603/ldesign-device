/*!
 * ***********************************
 * @ldesign/device-vue v1.0.0      *
 * Built with rollup               *
 * Build time: 2024-11-26 14:52:34 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { DeviceDetector } from '@ldesign/device-core';

let globalDetector = null;
let elementCount = 0;
const registeredElements = /* @__PURE__ */ new Set();
const updateQueue = /* @__PURE__ */ new Set();
let isUpdateScheduled = false;
let isEventListenerSet = false;
function __resetGlobalState() {
  if (globalDetector && typeof globalDetector.destroy === "function") {
    try {
      globalDetector.destroy();
    } catch {
    }
  }
  globalDetector = null;
  elementCount = 0;
  registeredElements.clear();
  updateQueue.clear();
  isUpdateScheduled = false;
  isEventListenerSet = false;
}
function __setGlobalDetector(detector) {
  globalDetector = detector;
  if (globalDetector && typeof globalDetector.on === "function" && !isEventListenerSet) {
    globalDetector.on("deviceChange", () => {
      registeredElements.forEach((el) => updateQueue.add(el));
      scheduleUpdate();
    });
    isEventListenerSet = true;
  }
}
function getGlobalDetector() {
  if (!globalDetector) {
    globalDetector = new DeviceDetector();
  }
  if (!isEventListenerSet && globalDetector && typeof globalDetector.on === "function") {
    globalDetector.on("deviceChange", () => {
      registeredElements.forEach((el) => updateQueue.add(el));
      scheduleUpdate();
    });
    isEventListenerSet = true;
  }
  return globalDetector;
}
function scheduleUpdate() {
  if (isUpdateScheduled || updateQueue.size === 0) {
    return;
  }
  isUpdateScheduled = true;
  const process = () => {
    const elementsToUpdate = Array.from(updateQueue);
    updateQueue.clear();
    isUpdateScheduled = false;
    elementsToUpdate.forEach((element) => {
      if (element.__directiveBinding) {
        const detector = getGlobalDetector();
        const currentType = detector.getDeviceType();
        updateElementVisibility(element, element.__directiveBinding, currentType);
      }
    });
  };
  if (typeof queueMicrotask === "function") {
    queueMicrotask(process);
  } else {
    Promise.resolve().then(process);
  }
}
function parseDirectiveValue(value) {
  if (typeof value === "string") {
    return {
      types: [value],
      inverse: false
    };
  }
  if (Array.isArray(value)) {
    return {
      types: value,
      inverse: false
    };
  }
  if (typeof value === "object" && value !== null) {
    const types = Array.isArray(value.type) ? value.type : [value.type];
    return {
      types,
      inverse: value.inverse || false
    };
  }
  return {
    types: [],
    inverse: false
  };
}
function shouldShowElement(currentType, targetTypes, inverse) {
  const matches = targetTypes.includes(currentType);
  return inverse ? !matches : matches;
}
function updateElementVisibility(el, binding, currentType) {
  el.__lastDeviceType = currentType;
  const {
    types,
    inverse
  } = parseDirectiveValue(binding.value);
  const shouldShow = shouldShowElement(currentType, types, inverse);
  if (el.__isVisible !== shouldShow) {
    el.__isVisible = shouldShow;
    if (shouldShow) {
      if (el.style.display === "none") {
        el.style.display = el.dataset.originalDisplay || "";
      }
      el.removeAttribute("hidden");
    } else {
      if (!el.dataset.originalDisplay) {
        el.dataset.originalDisplay = el.style.display || "";
      }
      el.style.display = "none";
      el.setAttribute("hidden", "");
    }
  }
}
const vDevice = {
  mounted(el, binding) {
    const detector = getGlobalDetector();
    const elementWithData = el;
    const currentType = detector.getDeviceType();
    elementCount++;
    elementWithData.__lastDeviceType = void 0;
    elementWithData.__isVisible = void 0;
    elementWithData.__directiveBinding = binding;
    updateElementVisibility(elementWithData, binding, currentType);
    registeredElements.add(elementWithData);
    const handleDeviceChange = () => {
      updateQueue.add(elementWithData);
      scheduleUpdate();
    };
    detector.on("deviceChange", handleDeviceChange);
    elementWithData.__deviceChangeHandler = handleDeviceChange;
    elementWithData.__deviceDetector = detector;
  },
  updated(el, binding) {
    const elementWithData = el;
    const detector = elementWithData.__deviceDetector;
    elementWithData.__directiveBinding = binding;
    if (detector) {
      const currentType = detector.getDeviceType();
      updateElementVisibility(elementWithData, binding, currentType);
    }
  },
  unmounted(el) {
    const elementWithData = el;
    const detector = elementWithData.__deviceDetector;
    const handler = elementWithData.__deviceChangeHandler;
    elementCount--;
    updateQueue.delete(elementWithData);
    registeredElements.delete(elementWithData);
    if (detector && handler) {
      detector.off("deviceChange", handler);
    }
    delete elementWithData.__deviceChangeHandler;
    delete elementWithData.__deviceDetector;
    delete elementWithData.__lastDeviceType;
    delete elementWithData.__isVisible;
    delete elementWithData.__directiveBinding;
    if (el.dataset.originalDisplay) {
      el.style.display = el.dataset.originalDisplay;
      delete el.dataset.originalDisplay;
    }
    el.removeAttribute("hidden");
    if (elementCount === 0 && globalDetector) {
      globalDetector.destroy();
      globalDetector = null;
    }
  }
};
const vDeviceMobile = {
  mounted(el) {
    const binding = {
      value: "mobile"};
    const detector = getGlobalDetector();
    const currentType = detector.getDeviceType();
    updateElementVisibility(el, binding, currentType);
    const handleDeviceChange = (deviceInfo) => {
      updateElementVisibility(el, binding, deviceInfo.type);
    };
    detector.on("deviceChange", handleDeviceChange);
    const elementWithData = el;
    elementWithData.__deviceChangeHandler = handleDeviceChange;
    elementWithData.__deviceDetector = detector;
  },
  updated(el) {
    const binding = {
      value: "mobile"};
    const detector = el.__deviceDetector;
    if (detector) {
      const currentType = detector.getDeviceType();
      updateElementVisibility(el, binding, currentType);
    }
  },
  unmounted: vDevice.unmounted
};
const vDeviceTablet = {
  mounted(el) {
    const binding = {
      value: "tablet"};
    const detector = getGlobalDetector();
    const currentType = detector.getDeviceType();
    updateElementVisibility(el, binding, currentType);
    const handleDeviceChange = (deviceInfo) => {
      updateElementVisibility(el, binding, deviceInfo.type);
    };
    detector.on("deviceChange", handleDeviceChange);
    const elementWithData = el;
    elementWithData.__deviceChangeHandler = handleDeviceChange;
    elementWithData.__deviceDetector = detector;
  },
  updated(el) {
    const binding = {
      value: "tablet"};
    const detector = el.__deviceDetector;
    if (detector) {
      const currentType = detector.getDeviceType();
      updateElementVisibility(el, binding, currentType);
    }
  },
  unmounted: vDevice.unmounted
};
const vDeviceDesktop = {
  mounted(el) {
    const binding = {
      value: "desktop"};
    const detector = getGlobalDetector();
    const currentType = detector.getDeviceType();
    updateElementVisibility(el, binding, currentType);
    const handleDeviceChange = (deviceInfo) => {
      updateElementVisibility(el, binding, deviceInfo.type);
    };
    detector.on("deviceChange", handleDeviceChange);
    const elementWithData = el;
    elementWithData.__deviceChangeHandler = handleDeviceChange;
    elementWithData.__deviceDetector = detector;
  },
  updated(el) {
    const binding = {
      value: "desktop"};
    const detector = el.__deviceDetector;
    if (detector) {
      const currentType = detector.getDeviceType();
      updateElementVisibility(el, binding, currentType);
    }
  },
  unmounted: vDevice.unmounted
};
function cleanupGlobalDetector() {
  if (globalDetector) {
    globalDetector.destroy();
    globalDetector = null;
  }
}

export { __resetGlobalState, __setGlobalDetector, cleanupGlobalDetector, vDevice, vDeviceDesktop, vDeviceMobile, vDeviceTablet };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=vDevice.js.map
