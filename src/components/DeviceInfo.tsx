import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { DeviceDetectionConfig } from '../types'
import { useDevice } from '../vue'
import './DeviceInfo.less'

export interface DeviceInfoProps {
  /** 设备检测配置 */
  config?: DeviceDetectionConfig
  /** 是否显示详细信息 */
  detailed?: boolean
  /** 是否显示加载状态 */
  showLoading?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 自定义样式 */
  style?: Record<string, any>
}

export const DeviceInfo = defineComponent({
  name: 'DeviceInfo',
  props: {
    config: {
      type: Object as PropType<DeviceDetectionConfig>,
      default: () => ({}),
    },
    detailed: {
      type: Boolean,
      default: false,
    },
    showLoading: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: '',
    },
    style: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const {
      deviceInfo,
      isLoading,
      error,
      isMobile,
      isTablet,
      isDesktop,
      isPortrait,
      isLandscape,
      isTouchDevice,
    } = useDevice(props.config)

    // 设备类型图标
    const deviceIcon = computed(() => {
      if (isMobile.value)
return '📱'
      if (isTablet.value)
return '📱'
      if (isDesktop.value)
return '💻'
      return '❓'
    })

    // 方向图标
    const orientationIcon = computed(() => {
      return isPortrait.value ? '📱' : '📱'
    })

    // 设备类型标签
    const deviceTypeLabel = computed(() => {
      const labels = {
        mobile: '移动设备',
        tablet: '平板设备',
        desktop: '桌面设备',
      }
      return labels[deviceInfo.value.type] || '未知设备'
    })

    // 方向标签
    const orientationLabel = computed(() => {
      const labels = {
        portrait: '竖屏',
        landscape: '横屏',
      }
      return labels[deviceInfo.value.orientation] || '未知方向'
    })

    return {
      deviceInfo,
      isLoading,
      error,
      isMobile,
      isTablet,
      isDesktop,
      isPortrait,
      isLandscape,
      isTouchDevice,
      deviceIcon,
      orientationIcon,
      deviceTypeLabel,
      orientationLabel,
    }
  },
  render() {
    const {
      deviceInfo,
      isLoading,
      error,
      detailed,
      showLoading,
      className,
      style,
      deviceIcon,
      orientationIcon,
      deviceTypeLabel,
      orientationLabel,
      isTouchDevice,
    } = this

    const classes = [
      'ldesign-device-info',
      className,
      {
        'ldesign-device-info--loading': isLoading,
        'ldesign-device-info--error': error,
        'ldesign-device-info--detailed': detailed,
      },
    ]

    // 加载状态
    if (isLoading && showLoading) {
      return (
        <div class={classes} style={style}>
          <div class="ldesign-device-info__loading">
            <div class="ldesign-device-info__spinner"></div>
            <span>检测设备信息中...</span>
          </div>
        </div>
      )
    }

    // 错误状态
    if (error) {
      return (
        <div class={classes} style={style}>
          <div class="ldesign-device-info__error">
            <span class="ldesign-device-info__error-icon">⚠️</span>
            <span class="ldesign-device-info__error-message">
              设备检测失败:
{' '}
{error.message}
            </span>
          </div>
        </div>
      )
    }

    // 基础信息
    const basicInfo = (
      <div class="ldesign-device-info__basic">
        <div class="ldesign-device-info__item">
          <span class="ldesign-device-info__icon">{deviceIcon}</span>
          <span class="ldesign-device-info__label">设备类型:</span>
          <span class="ldesign-device-info__value">{deviceTypeLabel}</span>
        </div>
        <div class="ldesign-device-info__item">
          <span class="ldesign-device-info__icon">{orientationIcon}</span>
          <span class="ldesign-device-info__label">屏幕方向:</span>
          <span class="ldesign-device-info__value">{orientationLabel}</span>
        </div>
      </div>
    )

    // 详细信息
    const detailedInfo = detailed
? (
      <div class="ldesign-device-info__detailed">
        <div class="ldesign-device-info__section">
          <h4 class="ldesign-device-info__section-title">屏幕信息</h4>
          <div class="ldesign-device-info__grid">
            <div class="ldesign-device-info__item">
              <span class="ldesign-device-info__label">宽度:</span>
              <span class="ldesign-device-info__value">
{deviceInfo.width}
px
              </span>
            </div>
            <div class="ldesign-device-info__item">
              <span class="ldesign-device-info__label">高度:</span>
              <span class="ldesign-device-info__value">
{deviceInfo.height}
px
              </span>
            </div>
            <div class="ldesign-device-info__item">
              <span class="ldesign-device-info__label">像素比:</span>
              <span class="ldesign-device-info__value">{deviceInfo.pixelRatio}</span>
            </div>
            <div class="ldesign-device-info__item">
              <span class="ldesign-device-info__label">触摸设备:</span>
              <span class="ldesign-device-info__value">
                {isTouchDevice ? '是' : '否'}
              </span>
            </div>
          </div>
        </div>

        <div class="ldesign-device-info__section">
          <h4 class="ldesign-device-info__section-title">用户代理</h4>
          <div class="ldesign-device-info__user-agent">
            {deviceInfo.userAgent}
          </div>
        </div>
      </div>
    )
: null

    return (
      <div class={classes} style={style}>
        {basicInfo}
        {detailedInfo}
      </div>
    )
  },
})

export default DeviceInfo
