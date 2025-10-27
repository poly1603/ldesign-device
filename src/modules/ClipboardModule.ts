/**
 * 剪贴板 API 模块
 * 
 * 提供现代的剪贴板操作功能，支持文本、图片等内容的读写
 * 适用于复制粘贴、分享等场景
 * 
 * @example
 * ```typescript
 * const detector = new DeviceDetector()
 * const clipboardModule = await detector.loadModule<ClipboardModule>('clipboard')
 * 
 * // 写入文本到剪贴板
 * const success = await clipboardModule.writeText('Hello World')
 * 
 * // 从剪贴板读取文本
 * const text = await clipboardModule.readText()
 * console.log(text)
 * ```
 */

import type { DeviceModule } from '../types'
import { EventEmitter } from '../core/EventEmitter'

/**
 * 剪贴板事件
 */
export interface ClipboardEvents extends Record<string, unknown> {
  /** 写入成功 */
  writeSuccess: { type: 'text' | 'image', content: string | Blob }
  /** 读取成功 */
  readSuccess: { type: 'text' | 'image', content: string | Blob }
  /** 操作失败 */
  error: { message: string, operation: string }
}

/**
 * 剪贴板 API 模块
 */
export class ClipboardModule
  extends EventEmitter<ClipboardEvents>
  implements DeviceModule {
  name = 'clipboard'
  private isInitialized = false

  /**
   * 初始化模块
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    // 检查是否支持 Clipboard API
    if (!this.isSupported()) {
      console.warn('Clipboard API is not supported in this browser')
    }

    this.isInitialized = true
  }

  /**
   * 销毁模块
   */
  async destroy(): Promise<void> {
    this.removeAllListeners()
    this.isInitialized = false
  }

  /**
   * 获取模块数据
   */
  getData(): {
    supported: boolean
    writeSupported: boolean
    readSupported: boolean
  } {
    return {
      supported: this.isSupported(),
      writeSupported: this.isWriteSupported(),
      readSupported: this.isReadSupported(),
    }
  }

  /**
   * 检查是否支持 Clipboard API
   */
  isSupported(): boolean {
    return (
      typeof navigator !== 'undefined'
      && 'clipboard' in navigator
      && typeof navigator.clipboard === 'object'
    )
  }

  /**
   * 检查是否支持写入剪贴板
   */
  isWriteSupported(): boolean {
    return (
      this.isSupported()
      && typeof navigator.clipboard.writeText === 'function'
    )
  }

  /**
   * 检查是否支持读取剪贴板
   */
  isReadSupported(): boolean {
    return (
      this.isSupported()
      && typeof navigator.clipboard.readText === 'function'
    )
  }

  /**
   * 写入文本到剪贴板
   * 
   * @param text - 要写入的文本
   * @returns Promise<boolean> 是否成功
   * 
   * @example
   * ```typescript
   * const success = await clipboardModule.writeText('Hello World')
   * if (success) {
   *   console.log('Text copied to clipboard')
   * }
   * ```
   */
  async writeText(text: string): Promise<boolean> {
    if (!this.isWriteSupported()) {
      // 降级到旧的 execCommand 方式
      return this.fallbackWriteText(text)
    }

    try {
      await navigator.clipboard.writeText(text)
      this.emit('writeSuccess', { type: 'text', content: text })
      return true
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.warn('Failed to write text to clipboard:', message)
      this.emit('error', { message, operation: 'writeText' })

      // 尝试降级方案
      return this.fallbackWriteText(text)
    }
  }

  /**
   * 从剪贴板读取文本
   * 
   * @returns Promise<string | null> 剪贴板中的文本，失败返回 null
   * 
   * @example
   * ```typescript
   * const text = await clipboardModule.readText()
   * if (text) {
   *   console.log('Clipboard text:', text)
   * }
   * ```
   */
  async readText(): Promise<string | null> {
    if (!this.isReadSupported()) {
      console.warn('Reading from clipboard is not supported or requires permission')
      this.emit('error', {
        message: 'Clipboard read not supported',
        operation: 'readText',
      })
      return null
    }

    try {
      const text = await navigator.clipboard.readText()
      this.emit('readSuccess', { type: 'text', content: text })
      return text
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.warn('Failed to read text from clipboard:', message)
      this.emit('error', { message, operation: 'readText' })
      return null
    }
  }

  /**
   * 写入图片到剪贴板
   * 
   * @param blob - 图片 Blob 对象
   * @returns Promise<boolean> 是否成功
   * 
   * @example
   * ```typescript
   * const response = await fetch('/image.png')
   * const blob = await response.blob()
   * const success = await clipboardModule.writeImage(blob)
   * ```
   */
  async writeImage(blob: Blob): Promise<boolean> {
    if (!this.isSupported() || typeof navigator.clipboard.write !== 'function') {
      console.warn('Writing images to clipboard is not supported')
      this.emit('error', {
        message: 'Image write not supported',
        operation: 'writeImage',
      })
      return false
    }

    try {
      const item = new ClipboardItem({ [blob.type]: blob })
      await navigator.clipboard.write([item])
      this.emit('writeSuccess', { type: 'image', content: blob })
      return true
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.warn('Failed to write image to clipboard:', message)
      this.emit('error', { message, operation: 'writeImage' })
      return false
    }
  }

  /**
   * 从剪贴板读取图片
   * 
   * @returns Promise<Blob | null> 图片 Blob 对象，失败返回 null
   */
  async readImage(): Promise<Blob | null> {
    if (!this.isSupported() || typeof navigator.clipboard.read !== 'function') {
      console.warn('Reading images from clipboard is not supported')
      this.emit('error', {
        message: 'Image read not supported',
        operation: 'readImage',
      })
      return null
    }

    try {
      const items = await navigator.clipboard.read()

      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type)
            this.emit('readSuccess', { type: 'image', content: blob })
            return blob
          }
        }
      }

      return null
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.warn('Failed to read image from clipboard:', message)
      this.emit('error', { message, operation: 'readImage' })
      return null
    }
  }

  /**
   * 降级方案：使用 execCommand 写入文本
   */
  private fallbackWriteText(text: string): boolean {
    if (typeof document === 'undefined') {
      return false
    }

    try {
      // 创建临时 textarea
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      textarea.style.pointerEvents = 'none'

      document.body.appendChild(textarea)
      textarea.select()

      // 尝试执行复制命令
      const success = document.execCommand('copy')

      // 清理
      document.body.removeChild(textarea)

      if (success) {
        this.emit('writeSuccess', { type: 'text', content: text })
      }

      return success
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.emit('error', { message, operation: 'fallbackWriteText' })
      return false
    }
  }

  /**
   * 请求剪贴板权限
   * 
   * @param permission - 权限类型：'read' 或 'write'
   * @returns Promise<boolean> 是否获得权限
   */
  async requestPermission(permission: 'clipboard-read' | 'clipboard-write'): Promise<boolean> {
    if (typeof navigator === 'undefined' || !('permissions' in navigator)) {
      return false
    }

    try {
      const result = await navigator.permissions.query({ name: permission as PermissionName })
      return result.state === 'granted' || result.state === 'prompt'
    }
    catch {
      // 权限 API 可能不支持剪贴板权限查询
      return false
    }
  }

  /**
   * 复制当前选中的文本
   * 
   * @returns boolean 是否成功
   */
  copySelection(): boolean {
    if (typeof document === 'undefined') {
      return false
    }

    try {
      const success = document.execCommand('copy')

      if (success) {
        const selection = document.getSelection()
        const text = selection?.toString() || ''
        this.emit('writeSuccess', { type: 'text', content: text })
      }

      return success
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.emit('error', { message, operation: 'copySelection' })
      return false
    }
  }

  /**
   * 检查剪贴板权限状态
   * 
   * @param permission - 权限类型
   * @returns Promise<'granted' | 'denied' | 'prompt' | 'unknown'>
   */
  async checkPermission(
    permission: 'clipboard-read' | 'clipboard-write',
  ): Promise<'granted' | 'denied' | 'prompt' | 'unknown'> {
    if (typeof navigator === 'undefined' || !('permissions' in navigator)) {
      return 'unknown'
    }

    try {
      const result = await navigator.permissions.query({ name: permission as PermissionName })
      return result.state as 'granted' | 'denied' | 'prompt'
    }
    catch {
      return 'unknown'
    }
  }
}

