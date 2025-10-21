/*!
 * ***********************************
 * @ldesign/device v0.1.0          *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:55 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  LogLevel2[LogLevel2["INFO"] = 1] = "INFO";
  LogLevel2[LogLevel2["WARN"] = 2] = "WARN";
  LogLevel2[LogLevel2["ERROR"] = 3] = "ERROR";
  LogLevel2[LogLevel2["NONE"] = 4] = "NONE";
  return LogLevel2;
})(LogLevel || {});
class Logger {
  constructor(options = {}) {
    this.history = [];
    this.stats = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0
    };
    // 日志级别颜色映射（用于浏览器控制台）
    this.levelColors = {
      [0 /* DEBUG */]: "#8B5CF6",
      // 紫色
      [1 /* INFO */]: "#3B82F6",
      // 蓝色
      [2 /* WARN */]: "#F59E0B",
      // 橙色
      [3 /* ERROR */]: "#EF4444",
      // 红色
      [4 /* NONE */]: "#999999"
      // 灰色
    };
    // 日志级别名称映射
    this.levelNames = {
      [0 /* DEBUG */]: "DEBUG",
      [1 /* INFO */]: "INFO",
      [2 /* WARN */]: "WARN",
      [3 /* ERROR */]: "ERROR",
      [4 /* NONE */]: "NONE"
    };
    this.options = {
      level: options.level ?? 2 /* WARN */,
      enabled: options.enabled ?? true,
      prefix: options.prefix ?? "",
      showTimestamp: options.showTimestamp ?? true,
      showStack: options.showStack ?? false,
      handler: options.handler,
      maxHistorySize: options.maxHistorySize ?? 100
    };
  }
  /**
   * 设置日志级别
   */
  setLevel(level) {
    this.options.level = level;
    return this;
  }
  /**
   * 启用/禁用日志
   */
  setEnabled(enabled) {
    this.options.enabled = enabled;
    return this;
  }
  /**
   * 设置模块前缀
   */
  setPrefix(prefix) {
    this.options.prefix = prefix;
    return this;
  }
  /**
   * Debug 级别日志
   */
  debug(message, data) {
    this.log(0 /* DEBUG */, message, data);
  }
  /**
   * Info 级别日志
   */
  info(message, data) {
    this.log(1 /* INFO */, message, data);
  }
  /**
   * Warn 级别日志
   */
  warn(message, data) {
    this.log(2 /* WARN */, message, data);
  }
  /**
   * Error 级别日志
   */
  error(message, error2) {
    const stack = error2 instanceof Error ? error2.stack : void 0;
    this.log(3 /* ERROR */, message, error2, stack);
  }
  /**
   * 分组日志开始
   */
  group(label) {
    if (!this.options.enabled || typeof console.group !== "function") return;
    console.group(this.formatPrefix() + label);
  }
  /**
   * 分组日志结束
   */
  groupEnd() {
    if (!this.options.enabled || typeof console.groupEnd !== "function") return;
    console.groupEnd();
  }
  /**
   * 表格日志
   */
  table(data) {
    if (!this.options.enabled || typeof console.table !== "function") return;
    console.table(data);
  }
  /**
   * 性能计时开始
   */
  time(label) {
    if (!this.options.enabled || typeof console.time !== "function") return;
    console.time(this.formatPrefix() + label);
  }
  /**
   * 性能计时结束
   */
  timeEnd(label) {
    if (!this.options.enabled || typeof console.timeEnd !== "function") return;
    console.timeEnd(this.formatPrefix() + label);
  }
  /**
   * 获取日志历史
   */
  getHistory(level) {
    if (level !== void 0) {
      return this.history.filter((entry) => entry.level === level);
    }
    return [...this.history];
  }
  /**
   * 清除日志历史
   */
  clearHistory() {
    this.history = [];
  }
  /**
   * 获取日志统计
   */
  getStats() {
    return {
      ...this.stats
    };
  }
  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0
    };
  }
  /**
   * 导出日志（JSON 格式）
   */
  export() {
    return JSON.stringify({
      history: this.history,
      stats: this.stats,
      exportTime: Date.now()
    }, null, 2);
  }
  /**
   * 核心日志方法
   */
  log(level, message, data, stack) {
    if (!this.options.enabled || level < this.options.level) return;
    const entry = {
      level,
      message,
      timestamp: Date.now(),
      module: this.options.prefix || void 0,
      data,
      stack: this.options.showStack ? stack : void 0
    };
    this.history.push(entry);
    if (this.history.length > this.options.maxHistorySize) {
      this.history.shift();
    }
    this.updateStats(level);
    if (this.options.handler) {
      try {
        this.options.handler(entry);
      } catch (error2) {
        console.error("Logger handler error:", error2);
      }
    }
    this.outputToConsole(entry);
  }
  /**
   * 输出到控制台
   */
  outputToConsole(entry) {
    const {
      level,
      message,
      data,
      stack
    } = entry;
    const prefix = this.formatPrefix();
    const timestamp = this.options.showTimestamp ? this.formatTimestamp(entry.timestamp) : "";
    const levelName = this.levelNames[level];
    if (typeof window !== "undefined") {
      const color = this.levelColors[level];
      const args = [`%c${timestamp}%c${prefix}%c[${levelName}]%c ${message}`, "color: #999", "color: #333; font-weight: bold", `color: ${color}; font-weight: bold`, "color: inherit"];
      if (data !== void 0) {
        args.push("\n", data);
      }
      if (stack) {
        args.push("\n", stack);
      }
      this.getConsoleMethod(level)(...args);
    } else {
      const output = `${timestamp}${prefix}[${levelName}] ${message}`;
      const args = [output];
      if (data !== void 0) {
        args.push("\n", data);
      }
      if (stack) {
        args.push("\n", stack);
      }
      this.getConsoleMethod(level)(...args);
    }
  }
  /**
   * 获取对应的 console 方法
   */
  getConsoleMethod(level) {
    switch (level) {
      case 0 /* DEBUG */:
        return console.debug || console.info;
      case 1 /* INFO */:
        return console.info;
      case 2 /* WARN */:
        return console.warn;
      case 3 /* ERROR */:
        return console.error;
      default:
        return console.info;
    }
  }
  /**
   * 格式化时间戳
   */
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ms = String(date.getMilliseconds()).padStart(3, "0");
    return `[${hours}:${minutes}:${seconds}.${ms}] `;
  }
  /**
   * 格式化前缀
   */
  formatPrefix() {
    return this.options.prefix ? `[${this.options.prefix}] ` : "";
  }
  /**
   * 更新统计信息
   */
  updateStats(level) {
    switch (level) {
      case 0 /* DEBUG */:
        this.stats.debug++;
        break;
      case 1 /* INFO */:
        this.stats.info++;
        break;
      case 2 /* WARN */:
        this.stats.warn++;
        break;
      case 3 /* ERROR */:
        this.stats.error++;
        break;
    }
  }
}
const defaultLogger = new Logger({
  // eslint-disable-next-line node/prefer-global/process
  level: typeof process !== "undefined" && process.env && process.env.NODE_ENV === "development" ? 0 /* DEBUG */ : 2 /* WARN */,
  prefix: "@ldesign/device",
  showTimestamp: true
});
const debug = (message, data) => defaultLogger.debug(message, data);
const info = (message, data) => defaultLogger.info(message, data);
const warn = (message, data) => defaultLogger.warn(message, data);
const error = (message, err) => defaultLogger.error(message, err);

export { LogLevel, Logger, debug, defaultLogger, error, info, warn };
/*! End of @ldesign/device | Powered by @ldesign/builder */
//# sourceMappingURL=Logger.js.map
