/**
 * 智能缓存管理器
 * 
 * 特性：
 * - 自适应过期时间
 * - LRU淘汰策略
 * - 内存压力响应
 * - 访问频率跟踪
 */

interface CacheEntry<T> {
  value: T
  timestamp: number
  accessCount: number
  lastAccess: number
  size?: number
}

interface SmartCacheOptions {
  maxSize?: number
  baseExpireTime?: number
  maxExpireTime?: number
  enableSizeTracking?: boolean
}

export class SmartCache<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>()
  private accessHistory = new Map<string, number[]>()
  private totalSize = 0
  private readonly options: Required<SmartCacheOptions>

  constructor(options: SmartCacheOptions = {}) {
    this.options = {
      maxSize: 100,
      baseExpireTime: 60000, // 1分钟
      maxExpireTime: 3600000, // 1小时
      enableSizeTracking: false,
      ...options
    }
  }

  /**
   * 设置缓存项
   */
  set(key: string, value: T, size?: number): void {
    const now = Date.now()

    // 如果超过最大数量，执行LRU淘汰
    if (this.cache.size >= this.options.maxSize) {
      this.evictLRU()
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      accessCount: 0,
      lastAccess: now,
      size
    }

    // 更新总大小
    if (this.options.enableSizeTracking && size !== undefined) {
      const oldEntry = this.cache.get(key)
      if (oldEntry?.size) {
        this.totalSize -= oldEntry.size
      }
      this.totalSize += size
    }

    this.cache.set(key, entry)
  }

  /**
   * 获取缓存项
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined

    const now = Date.now()
    const expireTime = this.calculateExpireTime(key)

    // 检查是否过期
    if (now - entry.timestamp > expireTime) {
      this.delete(key)
      return undefined
    }

    // 更新访问信息
    entry.accessCount++
    entry.lastAccess = now

    // 记录访问历史
    this.recordAccess(key, now)

    return entry.value
  }

  /**
   * 检查是否存在且未过期
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const now = Date.now()
    const expireTime = this.calculateExpireTime(key)

    if (now - entry.timestamp > expireTime) {
      this.delete(key)
      return false
    }

    return true
  }

  /**
   * 删除缓存项
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      if (this.options.enableSizeTracking && entry.size) {
        this.totalSize -= entry.size
      }
      this.accessHistory.delete(key)
      return this.cache.delete(key)
    }
    return false
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear()
    this.accessHistory.clear()
    this.totalSize = 0
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const now = Date.now()
    let activeCount = 0
    let totalAccessCount = 0

    this.cache.forEach((entry, key) => {
      const expireTime = this.calculateExpireTime(key)
      if (now - entry.timestamp <= expireTime) {
        activeCount++
        totalAccessCount += entry.accessCount
      }
    })

    return {
      totalCount: this.cache.size,
      activeCount,
      totalSize: this.totalSize,
      averageAccessCount: totalAccessCount / (activeCount || 1),
      hitRate: this.calculateHitRate()
    }
  }

  /**
   * 计算动态过期时间
   * 根据访问频率动态调整
   */
  private calculateExpireTime(key: string): number {
    const history = this.accessHistory.get(key)
    if (!history || history.length < 2) {
      return this.options.baseExpireTime
    }

    // 计算访问频率（每分钟访问次数）
    const now = Date.now()
    const recentAccesses = history.filter(time => now - time < 60000).length

    // 根据访问频率调整过期时间
    // 访问越频繁，缓存时间越长
    const multiplier = Math.min(Math.max(1, recentAccesses / 10), 10)
    const expireTime = this.options.baseExpireTime * multiplier

    return Math.min(expireTime, this.options.maxExpireTime)
  }

  /**
   * 记录访问历史
   */
  private recordAccess(key: string, timestamp: number): void {
    let history = this.accessHistory.get(key)
    if (!history) {
      history = []
      this.accessHistory.set(key, history)
    }

    history.push(timestamp)

    // 只保留最近100次访问记录
    if (history.length > 100) {
      history.shift()
    }
  }

  /**
   * LRU淘汰策略
   */
  private evictLRU(): void {
    let lruKey: string | undefined
    let lruTime = Infinity

    this.cache.forEach((entry, key) => {
      if (entry.lastAccess < lruTime) {
        lruTime = entry.lastAccess
        lruKey = key
      }
    })

    if (lruKey) {
      this.delete(lruKey)
    }
  }

  /**
   * 计算缓存命中率
   */
  private calculateHitRate(): number {
    let hits = 0
    let total = 0

    this.accessHistory.forEach(history => {
      total += history.length
      hits += history.length
    })

    return total > 0 ? (hits / total) * 100 : 0
  }

  /**
   * 响应内存压力
   */
  onMemoryPressure(): void {
    // 清理过期项
    const now = Date.now()
    const keysToDelete: string[] = []

    this.cache.forEach((entry, key) => {
      const expireTime = this.calculateExpireTime(key)
      if (now - entry.timestamp > expireTime) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.delete(key))

    // 如果仍有压力，删除访问最少的项
    if (this.cache.size > this.options.maxSize / 2) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].accessCount - b[1].accessCount)

      // 删除访问最少的25%
      const deleteCount = Math.floor(entries.length * 0.25)
      for (let i = 0; i < deleteCount; i++) {
        this.delete(entries[i][0])
      }
    }
  }
}

/**
 * 创建带内存压力响应的缓存
 */
export function createSmartCache<T>(options?: SmartCacheOptions): SmartCache<T> {
  const cache = new SmartCache<T>(options)

  // 监听内存压力
  if (typeof window !== 'undefined') {
    // 使用 MemoryManager 的内存压力检测
    import('./MemoryManager').then(({ memoryManager }) => {
      memoryManager.addGCCallback(() => {
        if (memoryManager.checkMemoryPressure()) {
          cache.onMemoryPressure()
        }
      })
    })
  }

  return cache
}

