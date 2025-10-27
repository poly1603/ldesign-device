/**
 * 性能预算监控
 * 
 * 监控关键操作的性能，确保不超过预设的性能预算
 * 当性能超出预算时发出警告，帮助开发者及时发现性能问题
 * 
 * @example
 * ```typescript
 * const budget = new PerformanceBudget()
 * 
 * // 监控操作性能
 * const start = performance.now()
 * doSomething()
 * budget.checkBudget('operationName', performance.now() - start)
 * ```
 */

/**
 * 性能预算配置
 */
export interface PerformanceBudgetConfig {
  /** 设备检测最大耗时（毫秒） */
  detectionTime?: number
  /** 模块加载最大耗时（毫秒） */
  moduleLoadTime?: number
  /** 事件触发最大耗时（毫秒） */
  eventEmitTime?: number
  /** WebGL 检测最大耗时（毫秒） */
  webglDetectionTime?: number
  /** 缓存操作最大耗时（毫秒） */
  cacheOperationTime?: number
  /** 是否启用警告（默认 true） */
  enableWarnings?: boolean
  /** 是否收集统计数据（默认 true） */
  collectStats?: boolean
}

/**
 * 性能统计信息
 */
export interface PerformanceStats {
  /** 总检查次数 */
  totalChecks: number
  /** 超出预算的次数 */
  budgetExceeded: number
  /** 平均耗时 */
  averageDuration: number
  /** 最大耗时 */
  maxDuration: number
  /** 最小耗时 */
  minDuration: number
}

/**
 * 性能预算监控类
 */
export class PerformanceBudget {
  private budgets: Required<Omit<PerformanceBudgetConfig, 'enableWarnings' | 'collectStats'>>
  private enableWarnings: boolean
  private collectStats: boolean
  private stats: Map<string, PerformanceStats> = new Map()

  constructor(config: PerformanceBudgetConfig = {}) {
    this.budgets = {
      detectionTime: config.detectionTime ?? 50,
      moduleLoadTime: config.moduleLoadTime ?? 100,
      eventEmitTime: config.eventEmitTime ?? 5,
      webglDetectionTime: config.webglDetectionTime ?? 30,
      cacheOperationTime: config.cacheOperationTime ?? 10,
    }
    this.enableWarnings = config.enableWarnings ?? true
    this.collectStats = config.collectStats ?? true
  }

  /**
   * 检查性能预算
   * 
   * @param name - 操作名称
   * @param duration - 操作耗时（毫秒）
   * @returns 是否超出预算
   */
  checkBudget(name: string, duration: number): boolean {
    const budget = this.budgets[name as keyof typeof this.budgets]

    // 收集统计数据
    if (this.collectStats) {
      this.updateStats(name, duration)
    }

    // 检查是否超出预算
    if (budget && duration > budget) {
      if (this.enableWarnings) {
        console.warn(
          `⚠️ Performance budget exceeded: ${name} took ${duration.toFixed(2)}ms (budget: ${budget}ms, exceeded by ${(duration - budget).toFixed(2)}ms)`,
        )
      }
      return true
    }

    return false
  }

  /**
   * 更新统计信息
   */
  private updateStats(name: string, duration: number): void {
    if (!this.stats.has(name)) {
      this.stats.set(name, {
        totalChecks: 0,
        budgetExceeded: 0,
        averageDuration: 0,
        maxDuration: 0,
        minDuration: Number.POSITIVE_INFINITY,
      })
    }

    const stats = this.stats.get(name)!
    stats.totalChecks++
    stats.maxDuration = Math.max(stats.maxDuration, duration)
    stats.minDuration = Math.min(stats.minDuration, duration)

    // 更新平均值（使用增量公式避免溢出）
    stats.averageDuration = stats.averageDuration + (duration - stats.averageDuration) / stats.totalChecks

    const budget = this.budgets[name as keyof typeof this.budgets]
    if (budget && duration > budget) {
      stats.budgetExceeded++
    }
  }

  /**
   * 获取统计信息
   * 
   * @param name - 操作名称，不提供则返回所有统计
   */
  getStats(name?: string): PerformanceStats | Record<string, PerformanceStats> | null {
    if (name) {
      return this.stats.get(name) ?? null
    }
    return Object.fromEntries(this.stats.entries())
  }

  /**
   * 获取性能预算配置
   */
  getBudgets(): Readonly<typeof this.budgets> {
    return { ...this.budgets }
  }

  /**
   * 更新性能预算
   * 
   * @param name - 操作名称
   * @param budget - 新的预算值（毫秒）
   */
  updateBudget(name: keyof typeof this.budgets, budget: number): void {
    this.budgets[name] = budget
  }

  /**
   * 重置统计数据
   * 
   * @param name - 操作名称，不提供则重置所有统计
   */
  resetStats(name?: string): void {
    if (name) {
      this.stats.delete(name)
    }
    else {
      this.stats.clear()
    }
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const lines: string[] = [
      '📊 Performance Budget Report',
      '='.repeat(50),
      '',
    ]

    for (const [name, stats] of this.stats.entries()) {
      const budget = this.budgets[name as keyof typeof this.budgets]
      const exceedRate = (stats.budgetExceeded / stats.totalChecks) * 100

      lines.push(`Operation: ${name}`)
      lines.push(`  Budget: ${budget}ms`)
      lines.push(`  Checks: ${stats.totalChecks}`)
      lines.push(`  Exceeded: ${stats.budgetExceeded} (${exceedRate.toFixed(1)}%)`)
      lines.push(`  Avg: ${stats.averageDuration.toFixed(2)}ms`)
      lines.push(`  Min: ${stats.minDuration.toFixed(2)}ms`)
      lines.push(`  Max: ${stats.maxDuration.toFixed(2)}ms`)
      lines.push('')
    }

    return lines.join('\n')
  }

  /**
   * 启用/禁用警告
   */
  setWarningsEnabled(enabled: boolean): void {
    this.enableWarnings = enabled
  }

  /**
   * 启用/禁用统计收集
   */
  setStatsCollectionEnabled(enabled: boolean): void {
    this.collectStats = enabled
  }
}

/**
 * 创建性能预算监控器实例
 * 
 * @param config - 配置选项
 * @returns PerformanceBudget 实例
 */
export function createPerformanceBudget(config?: PerformanceBudgetConfig): PerformanceBudget {
  return new PerformanceBudget(config)
}

/**
 * 全局性能预算实例（可选使用）
 */
export const globalPerformanceBudget = new PerformanceBudget()


