/**
 * 优化的事件发射器
 * 
 * 性能优化：
 * - 使用数组存储监听器，避免Map的开销
 * - 批量事件处理
 * - 监听器池复用
 * - 避免数组复制
 */

interface Listener<T = unknown> {
  handler: (data: T) => void
  once: boolean
  priority: number
  context?: unknown
}

interface ListenerPool {
  pool: Listener[]
  inUse: Set<Listener>
}

export class OptimizedEventEmitter<Events extends Record<string, unknown> = Record<string, unknown>> {
  private listeners: Map<keyof Events, Listener<Events[keyof Events]>[]> = new Map()
  private listenerArrayCache: Map<keyof Events, Listener<Events[keyof Events]>[]> = new Map()
  private isBatching = false
  private batchedEvents: Array<{ event: keyof Events; data: Events[keyof Events] }> = []

  // 监听器对象池
  private static listenerPool: ListenerPool = {
    pool: [],
    inUse: new Set()
  }

  /**
   * 添加事件监听器
   */
  on<K extends keyof Events>(
    event: K,
    handler: (data: Events[K]) => void,
    options?: { once?: boolean; priority?: number; context?: unknown }
  ): this {
    const listener = this.acquireListener()
    listener.handler = handler as (data: unknown) => void
    listener.once = options?.once ?? false
    listener.priority = options?.priority ?? 0
    listener.context = options?.context

    let eventListeners = this.listeners.get(event)
    if (!eventListeners) {
      eventListeners = []
      this.listeners.set(event, eventListeners)
    }

    // 按优先级插入（二分查找优化）
    const index = this.findInsertIndex(eventListeners, listener.priority)
    eventListeners.splice(index, 0, listener)

    // 清除缓存
    this.listenerArrayCache.delete(event)

    return this
  }

  /**
   * 添加一次性监听器
   */
  once<K extends keyof Events>(
    event: K,
    handler: (data: Events[K]) => void,
    options?: { priority?: number; context?: unknown }
  ): this {
    return this.on(event, handler, { ...options, once: true })
  }

  /**
   * 移除事件监听器
   */
  off<K extends keyof Events>(
    event: K,
    handler?: (data: Events[K]) => void,
    context?: unknown
  ): this {
    const eventListeners = this.listeners.get(event)
    if (!eventListeners) return this

    if (!handler) {
      // 移除所有监听器
      eventListeners.forEach(listener => this.releaseListener(listener))
      this.listeners.delete(event)
    } else {
      // 移除特定监听器（从后往前遍历，避免索引问题）
      for (let i = eventListeners.length - 1; i >= 0; i--) {
        const listener = eventListeners[i]
        if (
          listener.handler === handler &&
          (!context || listener.context === context)
        ) {
          eventListeners.splice(i, 1)
          this.releaseListener(listener)
        }
      }

      if (eventListeners.length === 0) {
        this.listeners.delete(event)
      }
    }

    // 清除缓存
    this.listenerArrayCache.delete(event)

    return this
  }

  /**
   * 触发事件
   */
  emit<K extends keyof Events>(event: K, data: Events[K]): this {
    if (this.isBatching) {
      this.batchedEvents.push({ event, data })
      return this
    }

    this.emitImmediate(event, data)
    return this
  }

  /**
   * 立即触发事件
   */
  private emitImmediate<K extends keyof Events>(event: K, data: Events[K]): void {
    const eventListeners = this.getListenersArray(event)
    if (!eventListeners || eventListeners.length === 0) return

    // 复制数组以防止在执行过程中被修改（优化：只在需要时复制）
    let listenersCopy: Listener<Events[K]>[] | undefined

    for (let i = 0; i < eventListeners.length; i++) {
      const listener = eventListeners[i]

      try {
        if (listener.context) {
          listener.handler.call(listener.context, data)
        } else {
          listener.handler(data)
        }
      } catch (error) {
        console.error(`Error in event listener for "${String(event)}":`, error)
      }

      if (listener.once) {
        // 延迟复制，只在需要时进行
        if (!listenersCopy) {
          listenersCopy = eventListeners.slice()
        }
        // 标记为需要移除
        listenersCopy[i] = null as any
      }
    }

    // 移除一次性监听器
    if (listenersCopy) {
      const originalListeners = this.listeners.get(event)!
      for (let i = listenersCopy.length - 1; i >= 0; i--) {
        if (listenersCopy[i] === null) {
          const removedListener = originalListeners.splice(i, 1)[0]
          this.releaseListener(removedListener)
        }
      }

      if (originalListeners.length === 0) {
        this.listeners.delete(event)
      }

      // 清除缓存
      this.listenerArrayCache.delete(event)
    }
  }

  /**
   * 开始批量处理
   */
  startBatch(): void {
    this.isBatching = true
  }

  /**
   * 结束批量处理并触发所有事件
   */
  endBatch(): void {
    this.isBatching = false
    const events = this.batchedEvents.slice()
    this.batchedEvents.length = 0

    // 按事件类型分组以优化性能
    const groupedEvents = new Map<keyof Events, Events[keyof Events][]>()

    for (const { event, data } of events) {
      let group = groupedEvents.get(event)
      if (!group) {
        group = []
        groupedEvents.set(event, group)
      }
      group.push(data)
    }

    // 触发分组的事件
    groupedEvents.forEach((dataArray, event) => {
      const listeners = this.getListenersArray(event)
      if (!listeners || listeners.length === 0) return

      for (const data of dataArray) {
        this.emitImmediate(event, data)
      }
    })
  }

  /**
   * 获取监听器数量
   */
  listenerCount<K extends keyof Events>(event?: K): number {
    if (event === undefined) {
      let count = 0
      this.listeners.forEach(listeners => {
        count += listeners.length
      })
      return count
    }

    const eventListeners = this.listeners.get(event)
    return eventListeners ? eventListeners.length : 0
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): Array<keyof Events> {
    return Array.from(this.listeners.keys())
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners<K extends keyof Events>(event?: K): this {
    if (event === undefined) {
      // 移除所有事件的监听器
      this.listeners.forEach(listeners => {
        listeners.forEach(listener => this.releaseListener(listener))
      })
      this.listeners.clear()
      this.listenerArrayCache.clear()
    } else {
      this.off(event)
    }

    return this
  }

  /**
   * 获取监听器数组（带缓存）
   */
  private getListenersArray<K extends keyof Events>(event: K): Listener<Events[K]>[] | undefined {
    // 检查缓存
    let cached = this.listenerArrayCache.get(event)
    if (cached) return cached

    const listeners = this.listeners.get(event)
    if (listeners) {
      this.listenerArrayCache.set(event, listeners)
    }

    return listeners
  }

  /**
   * 二分查找插入位置
   */
  private findInsertIndex(listeners: Listener[], priority: number): number {
    let left = 0
    let right = listeners.length

    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      if (listeners[mid].priority > priority) {
        left = mid + 1
      } else {
        right = mid
      }
    }

    return left
  }

  /**
   * 从对象池获取监听器
   */
  private acquireListener(): Listener {
    const pool = OptimizedEventEmitter.listenerPool
    let listener = pool.pool.pop()

    if (!listener) {
      listener = {
        handler: () => { },
        once: false,
        priority: 0
      }
    }

    pool.inUse.add(listener)
    return listener
  }

  /**
   * 释放监听器到对象池
   */
  private releaseListener(listener: Listener): void {
    const pool = OptimizedEventEmitter.listenerPool

    if (!pool.inUse.has(listener)) return

    pool.inUse.delete(listener)

    // 重置监听器
    listener.handler = () => { }
    listener.once = false
    listener.priority = 0
    listener.context = undefined

    // 限制池大小
    if (pool.pool.length < 1000) {
      pool.pool.push(listener)
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const pool = OptimizedEventEmitter.listenerPool
    let totalListeners = 0
    let maxListeners = 0
    let eventCount = 0

    this.listeners.forEach(listeners => {
      eventCount++
      totalListeners += listeners.length
      maxListeners = Math.max(maxListeners, listeners.length)
    })

    return {
      eventCount,
      totalListeners,
      maxListeners,
      averageListeners: totalListeners / (eventCount || 1),
      poolSize: pool.pool.length,
      poolInUse: pool.inUse.size
    }
  }
}

