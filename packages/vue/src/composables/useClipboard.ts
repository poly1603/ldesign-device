/**
 * Vue3 Clipboard Composable
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useClipboard } from '@ldesign/device/vue'
 * 
 * const { writeText, readText, copySuccess } = useClipboard()
 * 
 * async function handleCopy() {
 *   const success = await writeText('Hello World')
 *   if (success) {
 *     console.log('已复�?)
 *   }
 * }
 * </script>
 * ```
 */

import type { Ref } from 'vue'
import { onUnmounted, ref, readonly } from 'vue'
import { DeviceDetector } from '@ldesign/device-core'
import { ClipboardModule } from '@ldesign/device-core'

export interface UseClipboardReturn {
  /** 是否支持 Clipboard API */
  isSupported: Readonly<Ref<boolean>>
  /** 是否已加载模�?*/
  isLoaded: Readonly<Ref<boolean>>
  /** 最后一次复制是否成�?*/
  copySuccess: Readonly<Ref<boolean>>
  /** 写入文本到剪贴板 */
  writeText: (text: string) => Promise<boolean>
  /** 从剪贴板读取文本 */
  readText: () => Promise<string | null>
  /** 写入图片到剪贴板 */
  writeImage: (blob: Blob) => Promise<boolean>
  /** 从剪贴板读取图片 */
  readImage: () => Promise<Blob | null>
  /** 复制当前选中文本 */
  copySelection: () => boolean
}

/**
 * Vue3 Clipboard Composable
 */
export function useClipboard(): UseClipboardReturn {
  const isSupported = ref(false)
  const isLoaded = ref(false)
  const copySuccess = ref(false)

  let detector: DeviceDetector | null = null
  let module: ClipboardModule | null = null

  const loadModule = async () => {
    if (!detector) {
      detector = new CoreDeviceDetector()
    }

    try {
      module = await detector.loadModule<ClipboardModule>('clipboard')
      isSupported.value = module.isSupported()
      isLoaded.value = true

      // 监听事件
      module.on('writeSuccess', () => {
        copySuccess.value = true
      })

      module.on('error', () => {
        copySuccess.value = false
      })
    }
    catch (error) {
      console.warn('Failed to load clipboard module:', error)
      throw error
    }
  }

  const writeText = async (text: string) => {
    if (!module) {
      await loadModule()
    }
    const success = await module!.writeText(text)
    copySuccess.value = success
    return success
  }

  const readText = async () => {
    if (!module) {
      await loadModule()
    }
    return module!.readText()
  }

  const writeImage = async (blob: Blob) => {
    if (!module) {
      await loadModule()
    }
    const success = await module!.writeImage(blob)
    copySuccess.value = success
    return success
  }

  const readImage = async () => {
    if (!module) {
      await loadModule()
    }
    return module!.readImage()
  }

  const copySelection = () => {
    if (!module) {
      console.warn('Module not loaded')
      return false
    }
    const success = module.copySelection()
    copySuccess.value = success
    return success
  }

  onUnmounted(async () => {
    if (detector) {
      await detector.destroy()
      detector = null
      module = null
    }
  })

  return {
    isSupported: readonly(isSupported),
    isLoaded: readonly(isLoaded),
    copySuccess: readonly(copySuccess),
    writeText,
    readText,
    writeImage,
    readImage,
    copySelection,
  }
}

