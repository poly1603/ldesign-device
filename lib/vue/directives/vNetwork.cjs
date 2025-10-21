/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var DeviceDetector = require('../../core/DeviceDetector.cjs');

let globalDetector = null;
let elementCount = 0;
const updateQueue = /* @__PURE__ */ new Set();
let isUpdateScheduled = false;
function getGlobalDetector() {
  if (!globalDetector) {
    globalDetector = new DeviceDetector.DeviceDetector({
      modules: ["network"]
    });
    globalDetector.loadModule("network").catch((error) => {
      console.warn("Failed to load network module:", error);
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
          const networkModule = await detector.loadModule("network");
          if (networkModule && typeof networkModule.getData === "function") {
            const networkInfo = networkModule.getData();
            updateElementVisibility(element, element.__directiveBinding, networkInfo);
          }
        } catch (error) {
          console.warn("Failed to get network info:", error);
        }
      }
    });
  });
}
function parseDirectiveValue(value) {
  if (typeof value === "string") {
    return {
      statuses: [value],
      inverse: false
    };
  }
  if (Array.isArray(value)) {
    return {
      statuses: value,
      inverse: false
    };
  }
  if (typeof value === "object" && value !== null) {
    const statuses = Array.isArray(value.status) ? value.status : [value.status];
    return {
      statuses,
      inverse: value.inverse || false,
      callback: value.callback
    };
  }
  return {
    statuses: [],
    inverse: false
  };
}
function shouldShowElement(currentStatus, targetStatuses, inverse) {
  const matches = targetStatuses.includes(currentStatus);
  return inverse ? !matches : matches;
}
function updateElementVisibility(el, binding, networkInfo) {
  const currentStatus = networkInfo.status;
  if (el.__lastNetworkStatus === currentStatus) {
    return;
  }
  el.__lastNetworkStatus = currentStatus;
  const {
    statuses,
    inverse,
    callback
  } = parseDirectiveValue(binding.value);
  const shouldShow = shouldShowElement(currentStatus, statuses, inverse);
  if (callback && typeof callback === "function") {
    callback(networkInfo);
  }
  if (el.__isVisible !== shouldShow) {
    el.__isVisible = shouldShow;
    if (shouldShow) {
      if (el.style.display === "none") {
        el.style.display = el.dataset.originalDisplay || "";
      }
      el.removeAttribute("hidden");
      el.classList.add("network-visible");
      el.classList.remove("network-hidden");
    } else {
      if (!el.dataset.originalDisplay) {
        el.dataset.originalDisplay = el.style.display || "";
      }
      el.style.display = "none";
      el.setAttribute("hidden", "");
      el.classList.add("network-hidden");
      el.classList.remove("network-visible");
    }
    el.classList.remove("network-online", "network-offline");
    el.classList.add(`network-${currentStatus}`);
    if (networkInfo.type) {
      el.classList.remove("network-wifi", "network-cellular", "network-ethernet", "network-unknown");
      el.classList.add(`network-${networkInfo.type}`);
    }
  }
}
const vNetwork = {
  async mounted(el, binding) {
    const detector = getGlobalDetector();
    const elementWithData = el;
    elementCount++;
    elementWithData.__lastNetworkStatus = void 0;
    elementWithData.__isVisible = void 0;
    elementWithData.__directiveBinding = binding;
    try {
      const networkModule = await detector.loadModule("network");
      if (networkModule && typeof networkModule.getData === "function") {
        const networkInfo = networkModule.getData();
        updateElementVisibility(elementWithData, binding, networkInfo);
        const handleNetworkChange = () => {
          updateQueue.add(elementWithData);
          scheduleUpdate();
        };
        const maybeOn2 = networkModule.on;
        if (typeof maybeOn2 === "function") {
          maybeOn2.call(networkModule, "networkChange", handleNetworkChange);
        }
        const handleDeviceChange = () => {
          updateQueue.add(elementWithData);
          scheduleUpdate();
        };
        detector.on("deviceChange", handleDeviceChange);
        elementWithData.__networkChangeHandler = handleNetworkChange;
        elementWithData.__deviceChangeHandler = handleDeviceChange;
        elementWithData.__deviceDetector = detector;
      }
    } catch (error) {
      console.warn("Failed to initialize network directive:", error);
    }
  },
  updated(el, binding) {
    const elementWithData = el;
    const detector = elementWithData.__deviceDetector;
    elementWithData.__directiveBinding = binding;
    if (detector) {
      detector.loadModule("network").then((networkModule) => {
        if (networkModule && typeof networkModule.getData === "function") {
          const networkInfo = networkModule.getData();
          if (networkInfo) {
            updateElementVisibility(elementWithData, binding, networkInfo);
          }
        }
      }).catch((error) => {
        console.warn("Failed to update network directive:", error);
      });
    }
  },
  unmounted(el) {
    const elementWithData = el;
    const detector = elementWithData.__deviceDetector;
    const networkHandler = elementWithData.__networkChangeHandler;
    const deviceHandler = elementWithData.__deviceChangeHandler;
    elementCount--;
    updateQueue.delete(elementWithData);
    if (detector) {
      if (deviceHandler) {
        detector.off("deviceChange", deviceHandler);
      }
      if (networkHandler) {
        detector.loadModule("network").then((networkModule) => {
          if (networkModule && typeof networkModule.off === "function") {
            networkModule.off("networkChange", networkHandler);
          }
        }).catch(() => {
        });
      }
    }
    delete elementWithData.__networkChangeHandler;
    delete elementWithData.__deviceChangeHandler;
    delete elementWithData.__deviceDetector;
    delete elementWithData.__lastNetworkStatus;
    delete elementWithData.__isVisible;
    delete elementWithData.__directiveBinding;
    if (el.dataset.originalDisplay) {
      el.style.display = el.dataset.originalDisplay;
      delete el.dataset.originalDisplay;
    }
    el.removeAttribute("hidden");
    el.classList.remove("network-visible", "network-hidden", "network-online", "network-offline", "network-wifi", "network-cellular", "network-ethernet", "network-unknown");
    if (elementCount === 0 && globalDetector) {
      globalDetector.destroy();
      globalDetector = null;
    }
  }
};
const vNetworkOnline = {
  mounted(el) {
    const binding = {
      value: "online",
      modifiers: {},
      arg: void 0,
      dir: vNetwork,
      instance: null,
      oldValue: null
    };
    vNetwork.mounted(el, binding, null, null);
  },
  updated(el) {
    const binding = {
      value: "online",
      modifiers: {},
      arg: void 0,
      dir: vNetwork,
      instance: null,
      oldValue: null
    };
    vNetwork.updated(el, binding, null, null);
  },
  unmounted: vNetwork.unmounted
};
const vNetworkOffline = {
  mounted(el) {
    const binding = {
      value: "offline",
      modifiers: {},
      arg: void 0,
      dir: vNetwork,
      instance: null,
      oldValue: null
    };
    vNetwork.mounted(el, binding, null, null);
  },
  updated(el) {
    const binding = {
      value: "offline",
      modifiers: {},
      arg: void 0,
      dir: vNetwork,
      instance: null,
      oldValue: null
    };
    vNetwork.updated(el, binding, null, null);
  },
  unmounted: vNetwork.unmounted
};
const vNetworkSlow = {
  mounted(el) {
    const binding = {
      value: "offline",
      modifiers: {},
      arg: void 0,
      dir: vNetwork,
      instance: null,
      oldValue: null
    };
    vNetwork.mounted(el, binding, null, null);
  },
  updated(el) {
    const binding = {
      value: "offline",
      modifiers: {},
      arg: void 0,
      dir: vNetwork,
      instance: null,
      oldValue: null
    };
    vNetwork.updated(el, binding, null, null);
  },
  unmounted: vNetwork.unmounted
};

exports.vNetwork = vNetwork;
exports.vNetworkOffline = vNetworkOffline;
exports.vNetworkOnline = vNetworkOnline;
exports.vNetworkSlow = vNetworkSlow;
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=vNetwork.cjs.map
