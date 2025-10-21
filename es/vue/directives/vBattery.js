/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { DeviceDetector } from '../../core/DeviceDetector.js';

let globalDetector = null;
let elementCount = 0;
const updateQueue = /* @__PURE__ */ new Set();
let isUpdateScheduled = false;
function getGlobalDetector() {
  if (!globalDetector) {
    globalDetector = new DeviceDetector({
      modules: ["battery"]
    });
    globalDetector.loadModule("battery").catch((error) => {
      console.warn("Failed to load battery module:", error);
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
    elementsToUpdate.forEach(async (element) => {
      if (element.isConnected && element.__directiveBinding) {
        const detector = getGlobalDetector();
        try {
          const batteryModule = await detector.loadModule("battery");
          if (batteryModule && typeof batteryModule.getData === "function") {
            const batteryInfo = batteryModule.getData();
            updateElementVisibility(element, element.__directiveBinding, batteryInfo);
          }
        } catch (error) {
          console.warn("Failed to get battery info:", error);
        }
      }
    });
  });
}
function parseDirectiveValue(value) {
  if (typeof value === "string") {
    return {
      conditions: [value],
      threshold: 0.2,
      // 默认低电量阈值 20%
      inverse: false
    };
  }
  if (typeof value === "object" && value !== null) {
    const conditions = Array.isArray(value.condition) ? value.condition : [value.condition];
    return {
      conditions,
      threshold: value.threshold || 0.2,
      inverse: value.inverse || false,
      callback: value.callback
    };
  }
  return {
    conditions: [],
    threshold: 0.2,
    inverse: false
  };
}
function checkBatteryCondition(batteryInfo, condition, threshold) {
  switch (condition) {
    case "charging":
      return batteryInfo.charging;
    case "low":
      return batteryInfo.level <= threshold && batteryInfo.level > 0.1;
    case "critical":
      return batteryInfo.level <= 0.1;
    case "full":
      return batteryInfo.level >= 0.95;
    default:
      return false;
  }
}
function shouldShowElement(batteryInfo, conditions, threshold, inverse) {
  const matches = conditions.some((condition) => checkBatteryCondition(batteryInfo, condition, threshold));
  return inverse ? !matches : matches;
}
function getBatteryState(batteryInfo, threshold) {
  const states = [];
  if (batteryInfo.charging) states.push("charging");
  if (batteryInfo.level <= 0.1) states.push("critical");
  else if (batteryInfo.level <= threshold) states.push("low");
  if (batteryInfo.level >= 0.95) states.push("full");
  return states.join("-") || "normal";
}
function updateElementVisibility(el, binding, batteryInfo) {
  const {
    conditions,
    threshold,
    inverse,
    callback
  } = parseDirectiveValue(binding.value);
  const currentState = getBatteryState(batteryInfo, threshold);
  if (el.__lastBatteryState === currentState) {
    return;
  }
  el.__lastBatteryState = currentState;
  const shouldShow = shouldShowElement(batteryInfo, conditions, threshold, inverse);
  if (callback && typeof callback === "function") {
    callback(batteryInfo);
  }
  if (el.__isVisible !== shouldShow) {
    el.__isVisible = shouldShow;
    if (shouldShow) {
      if (el.style.display === "none") {
        el.style.display = el.dataset.originalDisplay || "";
      }
      el.removeAttribute("hidden");
      el.classList.add("battery-visible");
      el.classList.remove("battery-hidden");
    } else {
      if (!el.dataset.originalDisplay) {
        el.dataset.originalDisplay = el.style.display || "";
      }
      el.style.display = "none";
      el.setAttribute("hidden", "");
      el.classList.add("battery-hidden");
      el.classList.remove("battery-visible");
    }
    el.classList.remove("battery-charging", "battery-low", "battery-critical", "battery-full", "battery-normal");
    currentState.split("-").forEach((state) => {
      el.classList.add(`battery-${state}`);
    });
    const levelClass = `battery-level-${Math.floor(batteryInfo.level * 10) * 10}`;
    el.classList.remove(...Array.from(el.classList).filter((cls) => cls.startsWith("battery-level-")));
    el.classList.add(levelClass);
  }
}
const vBattery = {
  async mounted(el, binding) {
    const detector = getGlobalDetector();
    const elementWithData = el;
    elementCount++;
    elementWithData.__lastBatteryState = void 0;
    elementWithData.__isVisible = void 0;
    elementWithData.__directiveBinding = binding;
    try {
      const batteryModule = await detector.loadModule("battery");
      if (batteryModule && typeof batteryModule.getData === "function") {
        const batteryInfo = batteryModule.getData();
        updateElementVisibility(elementWithData, binding, batteryInfo);
        const handleBatteryChange = () => {
          updateQueue.add(elementWithData);
          scheduleUpdate();
        };
        const maybeOn = batteryModule.on;
        if (typeof maybeOn === "function") {
          maybeOn.call(batteryModule, "batteryChange", handleBatteryChange);
          elementWithData.__batteryChangeHandler = handleBatteryChange;
        }
        elementWithData.__deviceDetector = detector;
      }
    } catch (error) {
      console.warn("Failed to initialize battery directive:", error);
    }
  },
  updated(el, binding) {
    const elementWithData = el;
    const detector = elementWithData.__deviceDetector;
    elementWithData.__directiveBinding = binding;
    if (detector) {
      detector.loadModule("battery").then((batteryModule) => {
        if (batteryModule && typeof batteryModule.getData === "function") {
          const batteryInfo = batteryModule.getData();
          if (batteryInfo) {
            updateElementVisibility(elementWithData, binding, batteryInfo);
          }
        }
      }).catch((error) => {
        console.warn("Failed to update battery directive:", error);
      });
    }
  },
  unmounted(el) {
    const elementWithData = el;
    const detector = elementWithData.__deviceDetector;
    const handler = elementWithData.__batteryChangeHandler;
    elementCount--;
    updateQueue.delete(elementWithData);
    if (detector && handler) {
      detector.loadModule("battery").then((batteryModule) => {
        const maybeOff = batteryModule.off;
        if (batteryModule && typeof maybeOff === "function" && handler) {
          maybeOff.call(batteryModule, "batteryChange", handler);
        }
      }).catch(() => {
      });
    }
    delete elementWithData.__batteryChangeHandler;
    delete elementWithData.__deviceDetector;
    delete elementWithData.__lastBatteryState;
    delete elementWithData.__isVisible;
    delete elementWithData.__directiveBinding;
    if (el.dataset.originalDisplay) {
      el.style.display = el.dataset.originalDisplay;
      delete el.dataset.originalDisplay;
    }
    el.removeAttribute("hidden");
    el.classList.remove("battery-visible", "battery-hidden", "battery-charging", "battery-low", "battery-critical", "battery-full", "battery-normal", ...Array.from(el.classList).filter((cls) => cls.startsWith("battery-level-")));
    if (elementCount === 0 && globalDetector) {
      globalDetector.destroy();
      globalDetector = null;
    }
  }
};
const vBatteryCharging = {
  mounted(el) {
    const binding = {
      value: "charging",
      modifiers: {},
      arg: void 0,
      dir: vBattery,
      instance: null,
      oldValue: null
    };
    vBattery.mounted(el, binding, null, null);
  },
  updated(el) {
    const binding = {
      value: "charging",
      modifiers: {},
      arg: void 0,
      dir: vBattery,
      instance: null,
      oldValue: null
    };
    vBattery.updated(el, binding, null, null);
  },
  unmounted: vBattery.unmounted
};
const vBatteryLow = {
  mounted(el) {
    const binding = {
      value: "low",
      modifiers: {},
      arg: void 0,
      dir: vBattery,
      instance: null,
      oldValue: null
    };
    vBattery.mounted(el, binding, null, null);
  },
  updated(el) {
    const binding = {
      value: "low",
      modifiers: {},
      arg: void 0,
      dir: vBattery,
      instance: null,
      oldValue: null
    };
    vBattery.updated(el, binding, null, null);
  },
  unmounted: vBattery.unmounted
};

export { vBattery, vBatteryCharging, vBatteryLow };
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=vBattery.js.map
