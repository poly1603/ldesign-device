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
const updateQueue = /* @__PURE__ */ new Set();
let isUpdateScheduled = false;
function getGlobalDetector() {
  if (!globalDetector) {
    globalDetector = new DeviceDetector({
      enableOrientation: true,
      enableResize: true
    });
    globalDetector.on("deviceChange", () => {
      scheduleUpdate();
    });
    globalDetector.on("orientationChange", () => {
      scheduleUpdate();
    });
  }
  return globalDetector;
}
function scheduleUpdate() {
  if (isUpdateScheduled || updateQueue.size === 0) {
    return;
  }
  isUpdateScheduled = true;
  requestAnimationFrame(() => {
    const elementsToUpdate = Array.from(updateQueue);
    updateQueue.clear();
    isUpdateScheduled = false;
    elementsToUpdate.forEach((element) => {
      if (element.isConnected && element.__directiveBinding) {
        const detector = getGlobalDetector();
        const currentOrientation = detector.getDeviceInfo().orientation;
        updateElementVisibility(element, element.__directiveBinding, currentOrientation);
      }
    });
  });
}
function parseDirectiveValue(value) {
  if (typeof value === "string") {
    return {
      orientations: [value],
      inverse: false
    };
  }
  if (Array.isArray(value)) {
    return {
      orientations: value,
      inverse: false
    };
  }
  if (typeof value === "object" && value !== null) {
    const orientations = Array.isArray(value.orientation) ? value.orientation : [value.orientation];
    return {
      orientations,
      inverse: value.inverse || false,
      callback: value.callback
    };
  }
  return {
    orientations: [],
    inverse: false
  };
}
function shouldShowElement(currentOrientation, targetOrientations, inverse) {
  const matches = targetOrientations.includes(currentOrientation);
  return inverse ? !matches : matches;
}
function updateElementVisibility(el, binding, currentOrientation) {
  if (el.__lastOrientation === currentOrientation) {
    return;
  }
  el.__lastOrientation = currentOrientation;
  const {
    orientations,
    inverse,
    callback
  } = parseDirectiveValue(binding.value);
  const shouldShow = shouldShowElement(currentOrientation, orientations, inverse);
  if (callback && typeof callback === "function") {
    callback(currentOrientation);
  }
  if (el.__isVisible !== shouldShow) {
    el.__isVisible = shouldShow;
    if (shouldShow) {
      if (el.style.display === "none") {
        el.style.display = el.dataset.originalDisplay || "";
      }
      el.removeAttribute("hidden");
      el.classList.add("orientation-visible");
      el.classList.remove("orientation-hidden");
    } else {
      if (!el.dataset.originalDisplay) {
        el.dataset.originalDisplay = el.style.display || "";
      }
      el.style.display = "none";
      el.setAttribute("hidden", "");
      el.classList.add("orientation-hidden");
      el.classList.remove("orientation-visible");
    }
    el.classList.remove("orientation-portrait", "orientation-landscape");
    el.classList.add(`orientation-${currentOrientation}`);
  }
}
const vOrientation = {
  mounted(el, binding) {
    const detector = getGlobalDetector();
    const elementWithData = el;
    const currentOrientation = detector.getDeviceInfo().orientation;
    elementCount++;
    elementWithData.__lastOrientation = void 0;
    elementWithData.__isVisible = void 0;
    elementWithData.__directiveBinding = binding;
    updateElementVisibility(elementWithData, binding, currentOrientation);
    const handleDeviceChange = () => {
      updateQueue.add(elementWithData);
      scheduleUpdate();
    };
    const handleOrientation = (_o) => {
      updateQueue.add(elementWithData);
      scheduleUpdate();
    };
    detector.on("deviceChange", handleDeviceChange);
    detector.on("orientationChange", handleOrientation);
    elementWithData.__orientationChangeHandler = handleDeviceChange;
    elementWithData.__deviceDetector = detector;
  },
  updated(el, binding) {
    const elementWithData = el;
    const detector = elementWithData.__deviceDetector;
    elementWithData.__directiveBinding = binding;
    if (detector) {
      const currentOrientation = detector.getDeviceInfo().orientation;
      updateElementVisibility(elementWithData, binding, currentOrientation);
    }
  },
  unmounted(el) {
    const elementWithData = el;
    const detector = elementWithData.__deviceDetector;
    const handler = elementWithData.__orientationChangeHandler;
    elementCount--;
    updateQueue.delete(elementWithData);
    if (detector && handler) {
      detector.off("deviceChange", handler);
    }
    delete elementWithData.__orientationChangeHandler;
    delete elementWithData.__deviceDetector;
    delete elementWithData.__lastOrientation;
    delete elementWithData.__isVisible;
    delete elementWithData.__directiveBinding;
    if (el.dataset.originalDisplay) {
      el.style.display = el.dataset.originalDisplay;
      delete el.dataset.originalDisplay;
    }
    el.removeAttribute("hidden");
    el.classList.remove("orientation-visible", "orientation-hidden", "orientation-portrait", "orientation-landscape");
    if (elementCount === 0 && globalDetector) {
      globalDetector.destroy();
      globalDetector = null;
    }
  }
};
const vOrientationPortrait = {
  mounted(el) {
    const binding = {
      value: "portrait",
      modifiers: {},
      arg: void 0,
      dir: vOrientation,
      instance: null,
      oldValue: null
    };
    vOrientation.mounted(el, binding, null, null);
  },
  updated(el) {
    const binding = {
      value: "portrait",
      modifiers: {},
      arg: void 0,
      dir: vOrientation,
      instance: null,
      oldValue: null
    };
    vOrientation.updated(el, binding, null, null);
  },
  unmounted: vOrientation.unmounted
};
const vOrientationLandscape = {
  mounted(el) {
    const binding = {
      value: "landscape",
      modifiers: {},
      arg: void 0,
      dir: vOrientation,
      instance: null,
      oldValue: null
    };
    vOrientation.mounted(el, binding, null, null);
  },
  updated(el) {
    const binding = {
      value: "landscape",
      modifiers: {},
      arg: void 0,
      dir: vOrientation,
      instance: null,
      oldValue: null
    };
    vOrientation.updated(el, binding, null, null);
  },
  unmounted: vOrientation.unmounted
};

export { vOrientation, vOrientationLandscape, vOrientationPortrait };
/*! End of @ldesign/device-vue | Powered by @ldesign/builder */
//# sourceMappingURL=vOrientation.js.map
