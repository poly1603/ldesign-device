import type { Ref } from 'vue';
import type { DeviceDetectorOptions, UseDeviceReturn } from '../../../types';
/**
 * Vue3 设备检测 Composition API - 优化版本
 */
export declare function useDevice(options?: DeviceDetectorOptions): UseDeviceReturn;
/**
 * 使用网络信息
 */
export declare function useNetwork(): {
    networkInfo: Readonly<Ref<{
        readonly status: import("..").NetworkStatus;
        readonly type: import("..").NetworkType;
        readonly downlink?: number | undefined;
        readonly rtt?: number | undefined;
        readonly saveData?: boolean | undefined;
    } | null, {
        readonly status: import("..").NetworkStatus;
        readonly type: import("..").NetworkType;
        readonly downlink?: number | undefined;
        readonly rtt?: number | undefined;
        readonly saveData?: boolean | undefined;
    } | null>>;
    isOnline: Readonly<Ref<boolean, boolean>>;
    connectionType: Readonly<Ref<string, string>>;
    isLoaded: Readonly<Ref<boolean, boolean>>;
    loadModule: () => Promise<void>;
    unloadModule: () => Promise<void>;
};
/**
 * 使用电池信息
 */
export declare function useBattery(): {
    batteryInfo: Readonly<Ref<{
        readonly level: number;
        readonly charging: boolean;
        readonly chargingTime: number;
        readonly dischargingTime: number;
    } | null, {
        readonly level: number;
        readonly charging: boolean;
        readonly chargingTime: number;
        readonly dischargingTime: number;
    } | null>>;
    batteryLevel: Readonly<Ref<number, number>>;
    isCharging: Readonly<Ref<boolean, boolean>>;
    batteryStatus: Readonly<Ref<string, string>>;
    isLoaded: Readonly<Ref<boolean, boolean>>;
    loadModule: () => Promise<void>;
    unloadModule: () => Promise<void>;
};
/**
 * 使用地理位置信息
 */
export declare function useGeolocation(): {
    position: Readonly<Ref<{
        readonly latitude: number;
        readonly longitude: number;
        readonly accuracy: number;
        readonly altitude?: number | undefined;
        readonly altitudeAccuracy?: number | undefined;
        readonly heading?: number | undefined;
        readonly speed?: number | undefined;
    } | null, {
        readonly latitude: number;
        readonly longitude: number;
        readonly accuracy: number;
        readonly altitude?: number | undefined;
        readonly altitudeAccuracy?: number | undefined;
        readonly heading?: number | undefined;
        readonly speed?: number | undefined;
    } | null>>;
    latitude: Readonly<Ref<number | null, number | null>>;
    longitude: Readonly<Ref<number | null, number | null>>;
    accuracy: Readonly<Ref<number | null, number | null>>;
    error: Readonly<Ref<string | null, string | null>>;
    isSupported: Readonly<Ref<boolean, boolean>>;
    isWatching: Readonly<Ref<boolean, boolean>>;
    isLoaded: Readonly<Ref<boolean, boolean>>;
    loadModule: () => Promise<void>;
    unloadModule: () => Promise<void>;
    getCurrentPosition: () => Promise<void>;
    startWatching: () => Promise<void>;
    stopWatching: () => Promise<void>;
};
//# sourceMappingURL=useDevice.d.ts.map