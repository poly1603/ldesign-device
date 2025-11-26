/**
 * 设备指纹生成
 * 
 * 基于设备特征生成唯一标识符，用于设备识别、分析和追踪
 * 
 * 注意：设备指纹可能涉及隐私问题，请确保遵守相关法律法规
 * 
 * @example
 * ```typescript
 * const detector = new DeviceDetector()
 * const fingerprint = generateDeviceFingerprint(detector)
 * console.log('Device fingerprint:', fingerprint)
 * 
 * // 获取详细指纹信息
 * const detailedFingerprint = generateDetailedFingerprint(detector)
 * ```
 */

import type { DeviceDetector } from '../core/DeviceDetector'

/**
 * 设备指纹信息
 */
export interface DeviceFingerprintInfo {
  /** 指纹哈希值 */
  hash: string
  /** 置信度（0-1） */
  confidence: number
  /** 指纹组成部分 */
  components: {
    userAgent: string
    screen: string
    timezone: number
    language: string
    platform: string
    colorDepth: number
    pixelRatio: number
    hardwareConcurrency: number
    maxTouchPoints: number
    webgl: boolean
    canvas: string
  }
  /** 生成时间戳 */
  timestamp: number
}

/**
 * 简单的哈希函数
 * 
 * @param str - 要哈希的字符串
 * @returns 哈希值
 */
function simpleHash(str: string): string {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 转换为32位整数
  }

  // 转换为十六进制字符串
  return Math.abs(hash).toString(16).padStart(8, '0')
}

/**
 * 获取 Canvas 指纹
 * 
 * Canvas 指纹基于不同设备渲染图形的细微差异
 */
function getCanvasFingerprint(): string {
  if (typeof document === 'undefined') {
    return 'unknown'
  }

  try {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 50

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return 'unknown'
    }

    // 绘制文本
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('Device Fingerprint', 2, 15)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillText('Canvas Fingerprint', 4, 17)

    // 获取 canvas 数据
    const dataURL = canvas.toDataURL()

    // 返回哈希值
    return simpleHash(dataURL)
  }
  catch {
    return 'error'
  }
}

/**
 * 生成设备指纹
 * 
 * @param detector - DeviceDetector 实例
 * @returns 设备指纹哈希值
 * 
 * @example
 * ```typescript
 * const detector = new DeviceDetector()
 * const fingerprint = generateDeviceFingerprint(detector)
 * ```
 */
export function generateDeviceFingerprint(detector: DeviceDetector): string {
  const info = detector.getDeviceInfo()

  const components = [
    info.userAgent,
    `${info.screen.width}x${info.screen.height}`,
    info.pixelRatio.toString(),
    info.features.webgl ? 'webgl' : 'no-webgl',
    navigator.language,
    new Date().getTimezoneOffset().toString(),
  ]

  // 添加硬件信息（如果可用）
  if (typeof navigator !== 'undefined') {
    if ('hardwareConcurrency' in navigator) {
      components.push(`cpu:${navigator.hardwareConcurrency}`)
    }
    if ('maxTouchPoints' in navigator) {
      components.push(`touch:${navigator.maxTouchPoints}`)
    }
    if ('platform' in navigator) {
      components.push(`platform:${navigator.platform}`)
    }
  }

  // 添加屏幕信息
  if (typeof screen !== 'undefined') {
    if ('colorDepth' in screen) {
      components.push(`color:${screen.colorDepth}`)
    }
  }

  const fingerprintData = components.join('|')
  return simpleHash(fingerprintData)
}

/**
 * 生成详细的设备指纹信息
 * 
 * @param detector - DeviceDetector 实例
 * @returns 详细的设备指纹信息
 * 
 * @example
 * ```typescript
 * const detector = new DeviceDetector()
 * const fingerprint = generateDetailedFingerprint(detector)
 * console.log('Fingerprint hash:', fingerprint.hash)
 * console.log('Confidence:', fingerprint.confidence)
 * console.log('Components:', fingerprint.components)
 * ```
 */
export function generateDetailedFingerprint(
  detector: DeviceDetector,
): DeviceFingerprintInfo {
  const info = detector.getDeviceInfo()

  // 收集指纹组成部分
  const components = {
    userAgent: info.userAgent,
    screen: `${info.screen.width}x${info.screen.height}`,
    timezone: new Date().getTimezoneOffset(),
    language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
    platform: typeof navigator !== 'undefined' && 'platform' in navigator ? navigator.platform : 'unknown',
    colorDepth: typeof screen !== 'undefined' && 'colorDepth' in screen ? screen.colorDepth : 0,
    pixelRatio: info.pixelRatio,
    hardwareConcurrency: typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator
      ? (navigator.hardwareConcurrency || 0)
      : 0,
    maxTouchPoints: info.features.touch
      ? (typeof navigator !== 'undefined' && 'maxTouchPoints' in navigator ? navigator.maxTouchPoints : 0)
      : 0,
    webgl: info.features.webgl ?? false,
    canvas: getCanvasFingerprint(),
  }

  // 计算置信度（基于可用组件的数量）
  let availableComponents = 0
  let totalComponents = 0

  for (const key in components) {
    totalComponents++
    const value = components[key as keyof typeof components]
    if (value !== 'unknown' && value !== 0 && value !== false) {
      availableComponents++
    }
  }

  const confidence = availableComponents / totalComponents

  // 生成哈希
  const fingerprintData = Object.values(components).join('|')
  const hash = simpleHash(fingerprintData)

  return {
    hash,
    confidence,
    components,
    timestamp: Date.now(),
  }
}

/**
 * 比较两个设备指纹
 * 
 * @param fingerprint1 - 第一个指纹哈希
 * @param fingerprint2 - 第二个指纹哈希
 * @returns 是否匹配
 */
export function compareFingerprints(
  fingerprint1: string,
  fingerprint2: string,
): boolean {
  return fingerprint1 === fingerprint2
}

/**
 * 计算指纹相似度
 * 
 * @param info1 - 第一个详细指纹
 * @param info2 - 第二个详细指纹
 * @returns 相似度（0-1）
 */
export function calculateFingerprintSimilarity(
  info1: DeviceFingerprintInfo,
  info2: DeviceFingerprintInfo,
): number {
  let matchingComponents = 0
  let totalComponents = 0

  const keys = Object.keys(info1.components) as Array<keyof typeof info1.components>

  for (const key of keys) {
    totalComponents++
    if (info1.components[key] === info2.components[key]) {
      matchingComponents++
    }
  }

  return matchingComponents / totalComponents
}

/**
 * 验证设备指纹是否有效
 * 
 * @param fingerprint - 指纹哈希值
 * @returns 是否有效
 */
export function isValidFingerprint(fingerprint: string): boolean {
  // 检查是否为8位十六进制字符串
  return /^[0-9a-f]{8}$/i.test(fingerprint)
}

/**
 * 将详细指纹信息序列化为字符串
 * 
 * @param info - 详细指纹信息
 * @returns JSON 字符串
 */
export function serializeFingerprint(info: DeviceFingerprintInfo): string {
  return JSON.stringify(info)
}

/**
 * 从字符串反序列化详细指纹信息
 * 
 * @param data - JSON 字符串
 * @returns 详细指纹信息
 */
export function deserializeFingerprint(data: string): DeviceFingerprintInfo | null {
  try {
    const info = JSON.parse(data) as DeviceFingerprintInfo
    // 简单验证
    if (info.hash && info.components && info.timestamp) {
      return info
    }
    return null
  }
  catch {
    return null
  }
}

