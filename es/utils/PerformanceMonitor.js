/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
class PerformanceMonitor {
  constructor(options = {}) {
    this.isRunning = false;
    this.memoryTimer = null;
    // 性能指标
    this.metrics = {
      fps: 60,
      memory: {
        used: 0,
        total: 0,
        percentage: 0
      },
      executionTime: {},
      callCount: {},
      averageTime: {}
    };
    // 性能警告
    this.warnings = [];
    // 计时器存储
    this.timers = /* @__PURE__ */ new Map();
    this.options = {
      enabled: true,
      fpsInterval: 1e3,
      memoryInterval: 5e3,
      thresholds: {
        fps: 30,
        memory: 80,
        executionTime: 100,
        ...options.thresholds
      },
      ...options
    };
  }
  /**
   * 启动性能监控
   */
  start() {
    if (!this.options.enabled || this.isRunning) return;
    this.isRunning = true;
    this.startFPSMonitoring();
    this.startMemoryMonitoring();
  }
  /**
   * 停止性能监控
   */
  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.stopFPSMonitoring();
    this.stopMemoryMonitoring();
  }
  /**
   * 测量函数执行时间
   *
   * @param name - 函数名称
   * @param fn - 要执行的函数
   * @returns 执行时间（毫秒）
   */
  measure(name, fn) {
    if (!this.options.enabled) {
      fn();
      return 0;
    }
    const startTime = performance.now();
    fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    this.recordExecutionTime(name, duration);
    return duration;
  }
  /**
   * 测量异步函数执行时间
   *
   * @param name - 函数名称
   * @param fn - 要执行的异步函数
   * @returns Promise<执行时间（毫秒）>
   */
  async measureAsync(name, fn) {
    if (!this.options.enabled) {
      await fn();
      return 0;
    }
    const startTime = performance.now();
    await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    this.recordExecutionTime(name, duration);
    return duration;
  }
  /**
   * 开始计时
   *
   * @param name - 计时器名称
   */
  startTimer(name) {
    if (!this.options.enabled) return;
    this.timers.set(name, performance.now());
  }
  /**
   * 结束计时
   *
   * @param name - 计时器名称
   * @returns 执行时间（毫秒）
   */
  endTimer(name) {
    if (!this.options.enabled) return 0;
    const startTime = this.timers.get(name);
    if (startTime === void 0) {
      console.warn(`Timer "${name}" was not started`);
      return 0;
    }
    const endTime = performance.now();
    const duration = endTime - startTime;
    this.timers.delete(name);
    this.recordExecutionTime(name, duration);
    return duration;
  }
  /**
   * 获取当前性能指标
   */
  getMetrics() {
    return {
      fps: this.metrics.fps,
      memory: {
        ...this.metrics.memory
      },
      executionTime: {
        ...this.metrics.executionTime
      },
      callCount: {
        ...this.metrics.callCount
      },
      averageTime: {
        ...this.metrics.averageTime
      }
    };
  }
  /**
   * 获取性能报告
   */
  getReport() {
    return {
      timestamp: Date.now(),
      metrics: this.getMetrics(),
      warnings: [...this.warnings],
      suggestions: this.generateSuggestions()
    };
  }
  /**
   * 清除所有统计数据
   */
  clear() {
    this.metrics = {
      fps: 60,
      memory: {
        used: 0,
        total: 0,
        percentage: 0
      },
      executionTime: {},
      callCount: {},
      averageTime: {}
    };
    this.warnings = [];
    this.timers.clear();
  }
  /**
   * 导出性能数据（JSON 格式）
   */
  export() {
    return JSON.stringify(this.getReport(), null, 2);
  }
  /**
   * 启动 FPS 监控
   */
  startFPSMonitoring() {
    if (typeof window === "undefined") return;
    let lastTime = performance.now();
    let frames = 0;
    const measureFPS = () => {
      if (!this.isRunning) return;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      frames++;
      if (deltaTime >= this.options.fpsInterval) {
        this.metrics.fps = Math.round(frames * 1e3 / deltaTime);
        frames = 0;
        lastTime = currentTime;
        if (this.options.thresholds.fps && this.metrics.fps < this.options.thresholds.fps) {
          this.addWarning(`Low FPS detected: ${this.metrics.fps}`);
        }
      }
      requestAnimationFrame(measureFPS);
    };
    requestAnimationFrame(measureFPS);
  }
  /**
   * 停止 FPS 监控
   */
  stopFPSMonitoring() {
  }
  /**
   * 启动内存监控
   */
  startMemoryMonitoring() {
    if (typeof window === "undefined" || !performance.memory) return;
    this.memoryTimer = setInterval(() => {
      if (!this.isRunning) return;
      const memory = performance.memory;
      if (memory) {
        this.metrics.memory = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          percentage: Math.round(memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100)
        };
        if (this.options.thresholds.memory && this.metrics.memory.percentage > this.options.thresholds.memory) {
          this.addWarning(`High memory usage: ${this.metrics.memory.percentage}%`);
        }
      }
    }, this.options.memoryInterval);
  }
  /**
   * 停止内存监控
   */
  stopMemoryMonitoring() {
    if (this.memoryTimer) {
      clearInterval(this.memoryTimer);
      this.memoryTimer = null;
    }
  }
  /**
   * 记录执行时间
   */
  recordExecutionTime(name, duration) {
    this.metrics.callCount[name] = (this.metrics.callCount[name] || 0) + 1;
    this.metrics.executionTime[name] = duration;
    const count = this.metrics.callCount[name];
    const oldAverage = this.metrics.averageTime[name] || 0;
    this.metrics.averageTime[name] = (oldAverage * (count - 1) + duration) / count;
    if (this.options.thresholds.executionTime && duration > this.options.thresholds.executionTime) {
      this.addWarning(`Slow execution detected for "${name}": ${duration.toFixed(2)}ms`);
    }
  }
  /**
   * 添加警告
   */
  addWarning(warning) {
    if (!this.warnings.includes(warning)) {
      this.warnings.push(warning);
      if (this.warnings.length > 10) {
        this.warnings.shift();
      }
    }
  }
  /**
   * 生成优化建议
   */
  generateSuggestions() {
    const suggestions = [];
    if (this.metrics.fps < 30) {
      suggestions.push("Consider optimizing animations and reducing DOM manipulations");
    }
    if (this.metrics.memory.percentage > 80) {
      suggestions.push("High memory usage detected. Check for memory leaks and unnecessary object retention");
    }
    const slowFunctions = Object.entries(this.metrics.averageTime).filter(([_, time]) => this.options.thresholds.executionTime ? time > this.options.thresholds.executionTime : false).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (slowFunctions.length > 0) {
      suggestions.push(`Optimize slow functions: ${slowFunctions.map(([name, time]) => `${name} (${time.toFixed(2)}ms)`).join(", ")}`);
    }
    return suggestions;
  }
}
const defaultPerformanceMonitor = new PerformanceMonitor({
  // eslint-disable-next-line node/prefer-global/process
  enabled: typeof process !== "undefined" && process.env && process.env.NODE_ENV === "development",
  thresholds: {
    fps: 30,
    memory: 80,
    executionTime: 100
  }
});
const startMonitoring = () => defaultPerformanceMonitor.start();
const stopMonitoring = () => defaultPerformanceMonitor.stop();
function measure(name, fn) {
  return defaultPerformanceMonitor.measure(name, fn);
}
function measureAsync(name, fn) {
  return defaultPerformanceMonitor.measureAsync(name, fn);
}
const getPerformanceReport = () => defaultPerformanceMonitor.getReport();

export { PerformanceMonitor, defaultPerformanceMonitor, getPerformanceReport, measure, measureAsync, startMonitoring, stopMonitoring };
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=PerformanceMonitor.js.map
