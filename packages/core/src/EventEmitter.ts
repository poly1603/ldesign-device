import type { EventListener } from './types'

/**
 * 监听器包装器
 */
interface ListenerWrapper<T = unknown> {
  listener: EventListener<T>
  priority: number
  once: boolean
  namespace?: string
}

/**
 * 高性能事件发射器
 * 
 * @example
 * ```ts
 * const emitter = new EventEmitter<{ click: { x: number } }>()
 * emitter.on('click', (data) => console.log(data.x))
 * emitter.emit('click', { x: 100 })
 * ```
 */
export class EventEmitter<T extends Record<string, unknown> = Record<string, unknown>> {
  private events = new Map<keyof T | string, ListenerWrapper[]>()
  private maxListeners = 100
  private errorHandler?: (error: Error, event: keyof T | string) => void
  private wildcardListeners: ListenerWrapper[] = []
  private isSorted = new Map<keyof T | string, boolean>()

  private performanceMetrics = {
    totalEmits: 0,
    totalListenerCalls: 0,
    errors: 0,
    averageListenersPerEvent: 0,
  }
  private enablePerformanceTracking = false

  setMaxListeners(max: number): this {
    this.maxListeners = max
    return this
  }

  setErrorHandler(handler: (error: Error, event: keyof T) => void): this {
    this.errorHandler = handler
    return this
  }

  enablePerformanceMonitoring(enable = true): this {
    this.enablePerformanceTracking = enable
    return this
  }

  getPerformanceMetrics() {
    return { ...this.performanceMetrics }
  }

  resetPerformanceMetrics(): this {
    this.performanceMetrics = {
      totalEmits: 0,
      totalListenerCalls: 0,
      errors: 0,
      averageListenersPerEvent: 0,
    }
    return this
  }

  on<K extends keyof T>(
    event: K | '*',
    listener: EventListener<T[K]>,
    options: { priority?: number, namespace?: string } = {},
  ): this {
    const { priority = 0, namespace } = options

    const wrapper: ListenerWrapper = {
      listener: listener as EventListener<unknown>,
      priority,
      once: false,
      namespace,
    }

    if (event === '*') {
      this.wildcardListeners.push(wrapper)
      return this
    }

    if (!this.events.has(event as string)) {
      this.events.set(event as string, [])
    }

    const listeners = this.events.get(event as string)!
    if (listeners.length >= this.maxListeners) {
      console.warn(`Max listeners (${this.maxListeners}) exceeded for event: ${String(event)}`)
    }

    listeners.push(wrapper as unknown as ListenerWrapper)
    this.isSorted.set(event as string, false)

    return this
  }

  once<K extends keyof T>(
    event: K | '*',
    listener: EventListener<T[K]>,
    options: { priority?: number, namespace?: string } = {},
  ): this {
    const { priority = 0, namespace } = options

    const wrapper: ListenerWrapper = {
      listener: listener as EventListener<unknown>,
      priority,
      once: true,
      namespace,
    }

    if (event === '*') {
      this.wildcardListeners.push(wrapper)
      return this
    }

    if (!this.events.has(event as string)) {
      this.events.set(event as string, [])
    }

    const listeners = this.events.get(event as string)!
    listeners.push(wrapper as unknown as ListenerWrapper)
    this.isSorted.set(event as string, false)

    return this
  }

  off<K extends keyof T>(event: K | '*', listener?: EventListener<T[K]>): this {
    if (event === '*') {
      if (listener) {
        this.wildcardListeners = this.wildcardListeners.filter(w => w.listener !== listener)
      }
      else {
        this.wildcardListeners = []
      }
      return this
    }

    const listeners = this.events.get(event as string)
    if (!listeners) return this

    if (listener) {
      const filtered = listeners.filter(w => w.listener !== listener)
      if (filtered.length === 0) {
        this.events.delete(event as string)
      }
      else {
        this.events.set(event as string, filtered)
      }
    }
    else {
      this.events.delete(event as string)
    }

    return this
  }

  offNamespace(namespace: string): this {
    for (const [event, listeners] of this.events.entries()) {
      const filtered = listeners.filter(w => w.namespace !== namespace)
      if (filtered.length === 0) {
        this.events.delete(event)
      }
      else {
        this.events.set(event, filtered)
      }
    }

    this.wildcardListeners = this.wildcardListeners.filter(w => w.namespace !== namespace)
    return this
  }

  emit<K extends keyof T>(event: K, data: T[K]): this {
    const listeners = this.events.get(event as string)
    const hasListeners = listeners && listeners.length > 0
    const hasWildcard = this.wildcardListeners.length > 0

    if (!hasListeners && !hasWildcard) return this

    // 快速路径：单监听器
    if (listeners && listeners.length === 1 && !hasWildcard) {
      const wrapper = listeners[0]
      try {
        wrapper.listener(data)
        if (wrapper.once) {
          this.events.delete(event as string)
          this.isSorted.delete(event as string)
        }
      }
      catch (error) {
        this.handleListenerError(error, event as string)
      }

      if (this.enablePerformanceTracking) {
        this.performanceMetrics.totalEmits++
        this.performanceMetrics.totalListenerCalls++
      }

      return this
    }

    // 排序
    if (hasListeners && !this.isSorted.get(event as string)) {
      listeners!.sort((a, b) => b.priority - a.priority)
      this.isSorted.set(event as string, true)
    }

    if (hasWildcard && this.wildcardListeners.length > 1) {
      this.wildcardListeners.sort((a, b) => b.priority - a.priority)
    }

    if (this.enablePerformanceTracking) {
      const total = (listeners?.length || 0) + this.wildcardListeners.length
      this.performanceMetrics.totalEmits++
      this.performanceMetrics.totalListenerCalls += total
      const alpha = 0.1
      this.performanceMetrics.averageListenersPerEvent
        = this.performanceMetrics.averageListenersPerEvent * (1 - alpha) + total * alpha
    }

    const toRemove: ListenerWrapper[] = []

    // 执行监听器
    if (listeners) {
      for (const wrapper of listeners) {
        try {
          wrapper.listener(data)
          if (wrapper.once) toRemove.push(wrapper)
        }
        catch (error) {
          this.handleListenerError(error, event as string)
        }
      }
    }

    if (hasWildcard) {
      for (const wrapper of this.wildcardListeners) {
        try {
          wrapper.listener(data)
          if (wrapper.once) toRemove.push(wrapper)
        }
        catch (error) {
          this.handleListenerError(error, event as string)
        }
      }
    }

    // 移除一次性监听器
    for (const wrapper of toRemove) {
      this.removeWrapper(event as string, wrapper)
    }

    return this
  }

  private removeWrapper(event: string, wrapper: ListenerWrapper): void {
    if (event === '*') {
      this.wildcardListeners = this.wildcardListeners.filter(w => w !== wrapper)
      return
    }

    const listeners = this.events.get(event)
    if (listeners) {
      const filtered = listeners.filter(w => w !== wrapper)
      if (filtered.length === 0) {
        this.events.delete(event)
      }
      else {
        this.events.set(event, filtered)
      }
    }
  }

  listenerCount<K extends keyof T>(event: K | '*'): number {
    if (event === '*') return this.wildcardListeners.length
    return this.events.get(event as string)?.length || 0
  }

  eventNames(): Array<keyof T | string> {
    const names = Array.from(this.events.keys())
    if (this.wildcardListeners.length > 0) names.push('*')
    return names
  }

  removeAllListeners<K extends keyof T>(event?: K | '*' | string): this {
    if (event === '*') {
      this.wildcardListeners = []
    }
    else if (event) {
      const eventStr = event as string
      if (eventStr.includes('*')) {
        const prefix = eventStr.replace('*', '')
        const keysToDelete: string[] = []
        for (const key of this.events.keys()) {
          if (String(key).startsWith(prefix)) keysToDelete.push(String(key))
        }
        for (const key of keysToDelete) {
          this.events.delete(key)
          this.isSorted.delete(key)
        }
      }
      else {
        this.events.delete(eventStr)
        this.isSorted.delete(eventStr)
      }
    }
    else {
      this.events.clear()
      this.wildcardListeners = []
      this.isSorted.clear()
    }
    return this
  }

  listeners<K extends keyof T>(event: K | '*'): EventListener<T[K]>[] {
    if (event === '*') {
      return this.wildcardListeners.map(w => w.listener as EventListener<T[K]>)
    }
    const listeners = this.events.get(event as string)
    return listeners ? listeners.map(w => w.listener as EventListener<T[K]>) : []
  }

  hasListeners<K extends keyof T>(event: K | '*'): boolean {
    return this.listenerCount(event) > 0
  }

  getTotalListenerCount(): number {
    let total = this.wildcardListeners.length
    for (const listeners of this.events.values()) {
      total += listeners.length
    }
    return total
  }

  private handleListenerError(error: unknown, event: string): void {
    if (this.enablePerformanceTracking) {
      this.performanceMetrics.errors++
    }

    const err = error instanceof Error ? error : new Error(String(error))

    if (this.errorHandler) {
      this.errorHandler(err, event)
    }
    else {
      console.error(`Error in event listener for "${event}":`, err)
    }
  }
}


