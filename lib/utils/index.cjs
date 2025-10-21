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

var MemoryManager = require('./MemoryManager.cjs');

class LRUCache {
  constructor(maxSize = 50, ttl = 3e5) {
    this.cache = /* @__PURE__ */ new Map();
    // 缓存过期时间(毫秒)
    // 性能统计
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
    this.maxSize = maxSize;
    this.ttl = ttl;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (entry === void 0) {
      this.stats.misses++;
      return void 0;
    }
    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      return void 0;
    }
    this.stats.hits++;
    if (now - entry.timestamp > this.ttl * 0.1) {
      this.cache.delete(key);
      this.cache.set(key, {
        value: entry.value,
        timestamp: now
      });
    }
    return entry.value;
  }
  set(key, value) {
    const now = Date.now();
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== void 0) {
        this.cache.delete(firstKey);
        this.stats.evictions++;
      }
    }
    this.cache.set(key, {
      value,
      timestamp: now
    });
  }
  clear() {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }
  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }
  /**
   * 清理过期项（优化：惰性清理，直接在迭代中删除）
   */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        this.stats.evictions++;
      }
    }
  }
}
const userAgentCache = new LRUCache(20);
function parseUserAgent(userAgent) {
  const cached = userAgentCache.get(userAgent);
  if (cached) {
    return cached;
  }
  const os = {
    name: "unknown",
    version: "unknown"
  };
  const windowsMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
  if (windowsMatch) {
    os.name = "Windows";
    const version = windowsMatch[1];
    const versionMap = {
      "10.0": "10",
      "6.3": "8.1",
      "6.2": "8",
      "6.1": "7",
      "6.0": "Vista",
      "5.1": "XP"
    };
    os.version = versionMap[version] || version;
  } else if (/Mac OS X/.test(userAgent)) {
    os.name = "macOS";
    const macMatch = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
    if (macMatch) {
      os.version = macMatch[1].replace(/_/g, ".");
    }
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    os.name = "iOS";
    const iosMatch = userAgent.match(/OS (\d+[._]\d+[._]?\d*)/);
    if (iosMatch) {
      os.version = iosMatch[1].replace(/_/g, ".");
    }
  } else if (/Android/.test(userAgent)) {
    os.name = "Android";
    const androidMatch = userAgent.match(/Android (\d+\.\d+)/);
    if (androidMatch) {
      os.version = androidMatch[1];
    }
  } else if (/Linux/.test(userAgent)) {
    os.name = "Linux";
  }
  const browser = {
    name: "unknown",
    version: "unknown"
  };
  const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
  if (chromeMatch && !/Edg/.test(userAgent)) {
    browser.name = "Chrome";
    browser.version = chromeMatch[1];
  } else if (/Edg/.test(userAgent)) {
    browser.name = "Edge";
    const edgeMatch = userAgent.match(/Edg\/(\d+)/);
    if (edgeMatch) {
      browser.version = edgeMatch[1];
    }
  } else if (/Firefox/.test(userAgent)) {
    browser.name = "Firefox";
    const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
    if (firefoxMatch) {
      browser.version = firefoxMatch[1];
    }
  } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    browser.name = "Safari";
    const safariMatch = userAgent.match(/Version\/(\d+)/);
    if (safariMatch) {
      browser.version = safariMatch[1];
    }
  }
  const result = {
    os,
    browser
  };
  userAgentCache.set(userAgent, result);
  return result;
}
function debounce(func, wait, immediate = false) {
  let timeout = null;
  let result;
  const debounced = (...args) => {
    const callNow = immediate && !timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) {
        result = func(...args);
      }
    }, wait);
    if (callNow) {
      result = func(...args);
    }
    return result;
  };
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  return debounced;
}
function throttle(func, wait, options = {}) {
  let timeout = null;
  let previous = 0;
  const {
    leading = true,
    trailing = true
  } = options;
  const throttled = (...args) => {
    const now = Date.now();
    if (!previous && !leading) {
      previous = now;
    }
    const remaining = wait - (now - previous);
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func(...args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    previous = 0;
  };
  return throttled;
}
function isMobileDevice(userAgent) {
  if (typeof window === "undefined" && !userAgent) return false;
  const ua = userAgent || (typeof window !== "undefined" ? window.navigator.userAgent : "");
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(ua);
}
function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || (navigator.msMaxTouchPoints || 0) > 0;
}
function getDeviceTypeByWidth(width, breakpoints = {
  mobile: 768,
  tablet: 1024
}) {
  if (width < breakpoints.mobile) return "mobile";
  if (width < breakpoints.tablet) return "tablet";
  return "desktop";
}
function getScreenOrientation(width, height) {
  if (typeof window === "undefined" && (width === void 0 || height === void 0)) {
    return "landscape";
  }
  if (width !== void 0 && height !== void 0) {
    return width >= height ? "landscape" : "portrait";
  }
  if (typeof window !== "undefined" && screen.orientation) {
    return screen.orientation.angle === 0 || screen.orientation.angle === 180 ? "portrait" : "landscape";
  }
  if (typeof window !== "undefined") return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  return "landscape";
}
function parseOS(userAgent) {
  return parseUserAgent(userAgent).os;
}
function parseBrowser(userAgent) {
  return parseUserAgent(userAgent).browser;
}
function getPixelRatio() {
  if (typeof window === "undefined") return 1;
  return window.devicePixelRatio || 1;
}
function isAPISupported(api) {
  if (typeof window === "undefined") return false;
  const parts = api.split(".");
  let obj = window;
  for (const part of parts) {
    if (!(part in obj)) return false;
    obj = obj[part];
  }
  return true;
}
function safeNavigatorAccess(accessorOrProperty, fallback) {
  if (typeof navigator === "undefined") return fallback;
  try {
    if (typeof accessorOrProperty === "function") {
      return accessorOrProperty(navigator);
    } else {
      return navigator[accessorOrProperty] ?? fallback;
    }
  } catch {
    return fallback;
  }
}
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
function generateId(prefix) {
  const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return prefix ? `${prefix}-${id}` : id;
}
function memoize(fn, options = {}) {
  const {
    maxSize = 100,
    ttl,
    keyGenerator
  } = options;
  const cache = /* @__PURE__ */ new Map();
  const memoized = ((...args) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    const cached = cache.get(key);
    if (cached) {
      if (ttl && Date.now() - cached.timestamp > ttl) {
        cache.delete(key);
      } else {
        return cached.value;
      }
    }
    const value = fn(...args);
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== void 0) {
        cache.delete(firstKey);
      }
    }
    cache.set(key, {
      value,
      timestamp: Date.now()
    });
    return value;
  });
  memoized.clear = () => cache.clear();
  memoized.delete = (key) => cache.delete(key);
  memoized.size = () => cache.size;
  return memoized;
}
function defer(fn) {
  if (typeof queueMicrotask !== "undefined") {
    queueMicrotask(fn);
  } else if (typeof Promise !== "undefined") {
    Promise.resolve().then(fn);
  } else {
    setTimeout(fn, 0);
  }
}
function safeJSONParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }
  if (obj instanceof Map) {
    const cloned2 = /* @__PURE__ */ new Map();
    obj.forEach((value, key) => {
      cloned2.set(key, deepClone(value));
    });
    return cloned2;
  }
  if (obj instanceof Set) {
    const cloned2 = /* @__PURE__ */ new Set();
    obj.forEach((value) => {
      cloned2.add(deepClone(value));
    });
    return cloned2;
  }
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (source === void 0) return target;
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }
  return deepMerge(target, ...sources);
}
function isObject(item) {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}
async function retry(fn, options = {}) {
  const {
    retries = 3,
    delay = 1e3,
    backoff = 1.5,
    maxDelay = 1e4,
    onRetry
  } = options;
  let lastError = new Error("No attempts made");
  let currentDelay = delay;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        onRetry?.(lastError, attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay = Math.min(currentDelay * backoff, maxDelay);
      }
    }
  }
  if (!lastError) {
    throw new Error("Unknown error in retry function");
  }
  throw new Error(lastError.message);
}
async function asyncPool(poolLimit, array, iteratorFn) {
  const len = array.length;
  const results = Array.from({
    length: len
  });
  const executing = [];
  for (let i = 0; i < len; i++) {
    const item = array[i];
    const p = (async () => {
      results[i] = await iteratorFn(item, i);
    })();
    if (poolLimit <= len) {
      const e = p.then(() => {
        const idx = executing.indexOf(e);
        if (idx !== -1) {
          executing.splice(idx, 1);
        }
      });
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  await Promise.all(executing);
  return results;
}
function promiseTimeout(promise, ms, timeoutError) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(timeoutError || new Error(`Promise timeout after ${ms}ms`));
    }, ms);
    promise.then((value) => {
      clearTimeout(timer);
      resolve(value);
    }).catch((error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}
function asyncDebounce(fn, wait) {
  let timeout = null;
  let pendingPromise = null;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (!pendingPromise) {
      pendingPromise = new Promise((resolve, reject) => {
        timeout = setTimeout(async () => {
          timeout = null;
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            pendingPromise = null;
          }
        }, wait);
      });
    }
    return pendingPromise;
  };
}
function asyncThrottle(fn, wait) {
  let timeout = null;
  let previous = 0;
  let pendingPromise = null;
  return async (...args) => {
    const now = Date.now();
    const remaining = wait - (now - previous);
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      pendingPromise = fn(...args);
      return pendingPromise;
    } else if (!timeout && !pendingPromise) {
      return new Promise((resolve) => {
        timeout = setTimeout(async () => {
          previous = Date.now();
          timeout = null;
          pendingPromise = fn(...args);
          const result = await pendingPromise;
          pendingPromise = null;
          resolve(result);
        }, remaining);
      });
    }
    return pendingPromise || void 0;
  };
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function isEmpty(value) {
  if (value === null || value === void 0) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  return false;
}

exports.MemoryManager = MemoryManager.MemoryManager;
exports.ObjectPool = MemoryManager.ObjectPool;
exports.SafeTimerManager = MemoryManager.SafeTimerManager;
exports.createReusablePool = MemoryManager.createReusablePool;
exports.memoryManager = MemoryManager.memoryManager;
exports.timerManager = MemoryManager.timerManager;
exports.asyncDebounce = asyncDebounce;
exports.asyncPool = asyncPool;
exports.asyncThrottle = asyncThrottle;
exports.debounce = debounce;
exports.deepClone = deepClone;
exports.deepMerge = deepMerge;
exports.defer = defer;
exports.formatBytes = formatBytes;
exports.generateId = generateId;
exports.getDeviceTypeByWidth = getDeviceTypeByWidth;
exports.getPixelRatio = getPixelRatio;
exports.getScreenOrientation = getScreenOrientation;
exports.isAPISupported = isAPISupported;
exports.isEmpty = isEmpty;
exports.isMobileDevice = isMobileDevice;
exports.isTouchDevice = isTouchDevice;
exports.memoize = memoize;
exports.parseBrowser = parseBrowser;
exports.parseOS = parseOS;
exports.promiseTimeout = promiseTimeout;
exports.retry = retry;
exports.safeJSONParse = safeJSONParse;
exports.safeNavigatorAccess = safeNavigatorAccess;
exports.sleep = sleep;
exports.throttle = throttle;
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
