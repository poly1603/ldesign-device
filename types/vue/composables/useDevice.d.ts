/**
 * 重新导出优化后的 useDevice composable
 *
 * 这个文件保持向后兼容性，同时使用优化后的实现
 */
export { useDevice, useNetwork, useBattery, useGeolocation, } from '../../adapt/vue/composables/useDevice';
import type { DeviceInfo } from '../../types';
/**
 * 设备检测组合式函数（简化版）
 * 保持向后兼容性
 */
export declare function useDeviceDetection(): {
    deviceInfo: import("vue").ComputedRef<DeviceInfo>;
    isMobile: Readonly<import("vue").Ref<boolean, boolean>>;
    isTablet: Readonly<import("vue").Ref<boolean, boolean>>;
    isDesktop: Readonly<import("vue").Ref<boolean, boolean>>;
    isTouchDevice: Readonly<import("vue").Ref<boolean, boolean>>;
};
//# sourceMappingURL=useDevice.d.ts.map