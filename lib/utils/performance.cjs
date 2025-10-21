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

var index = require('./index.cjs');

class LazyLoader {
  constructor() {
    this.loaders = /* @__PURE__ */ new Map();
    this.cache = /* @__PURE__ */ new Map();
    this.loading = /* @__PURE__ */ new Map();
  }
  /**
   * 注册懒加载器
   */
  register(name, loader) {
    this.loaders.set(name, loader);
  }
  /**
   * 加载资源
   */
  async load(name) {
    if (this.cache.has(name)) {
      const cached = this.cache.get(name);
      if (cached !== void 0) return cached;
    }
    if (this.loading.has(name)) {
      const loading = this.loading.get(name);
      if (loading) return loading;
    }
    const loader = this.loaders.get(name);
    if (!loader) {
      throw new Error(`Loader for "${name}" not found`);
    }
    const loadingPromise = loader().then((resource) => {
      this.cache.set(name, resource);
      this.loading.delete(name);
      return resource;
    }, (error) => {
      this.loading.delete(name);
      throw error;
    });
    this.loading.set(name, loadingPromise);
    return loadingPromise;
  }
  /**
   * 预加载资源
   */
  async preload(names) {
    await Promise.all(names.map((name) => this.load(name)));
  }
  /**
   * 检查是否已加载
   */
  isLoaded(name) {
    return this.cache.has(name);
  }
  /**
   * 检查是否正在加载
   */
  isLoading(name) {
    return this.loading.has(name);
  }
  /**
   * 清除缓存
   */
  clear(name) {
    if (name) {
      this.cache.delete(name);
    } else {
      this.cache.clear();
    }
  }
}
function rafThrottle(callback) {
  let requestId = null;
  const throttled = (...args) => {
    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        callback(...args);
        requestId = null;
      });
    }
  };
  throttled.cancel = () => {
    if (requestId !== null) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
  };
  return throttled;
}
class BatchExecutor {
  constructor(executor, options = {}) {
    this.executor = executor;
    this.options = options;
    this.batch = [];
    this.timer = null;
    this.promises = [];
    this.options.maxBatchSize = options.maxBatchSize || 10;
    this.options.maxWaitTime = options.maxWaitTime || 10;
  }
  /**
   * 添加到批处理队列
   */
  async add(item) {
    return new Promise((resolve, reject) => {
      this.batch.push(item);
      this.promises.push({
        resolve,
        reject
      });
      if (this.options.maxBatchSize && this.batch.length >= this.options.maxBatchSize) {
        this.flush();
      } else {
        this.scheduleFlush();
      }
    });
  }
  /**
   * 调度批处理执行
   */
  scheduleFlush() {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.flush();
    }, this.options.maxWaitTime);
  }
  /**
   * 执行批处理
   */
  async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.batch.length === 0) return;
    const batch = this.batch;
    const promises = this.promises;
    this.batch = [];
    this.promises = [];
    try {
      const results = await this.executor(batch);
      results.forEach((result, index) => {
        promises[index].resolve(result);
      });
    } catch (error) {
      promises.forEach((promise) => {
        promise.reject(error);
      });
    }
  }
  /**
   * 强制执行批处理
   */
  forceFlush() {
    return this.flush();
  }
}

exports.debounce = index.debounce;
exports.memoize = index.memoize;
exports.throttle = index.throttle;
exports.BatchExecutor = BatchExecutor;
exports.LazyLoader = LazyLoader;
exports.rafThrottle = rafThrottle;
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=performance.cjs.map
