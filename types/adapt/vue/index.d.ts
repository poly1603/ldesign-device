export { BatteryModule, DeviceDetector, EventEmitter, GeolocationModule, ModuleLoader, NetworkModule, } from '../../index';
export type { BatteryInfo, DeviceDetectorEvents, DeviceDetectorOptions, DeviceDirectiveValue, DeviceInfo, DeviceModule, DevicePluginOptions, DeviceType, EventListener, GeolocationInfo, ModuleLoader as IModuleLoader, NetworkInfo, NetworkStatus, NetworkType, Orientation, UseDeviceReturn, } from '../../types';
export { useBattery, useDevice, useGeolocation, useNetwork, } from './composables/useDevice';
export { cleanupGlobalDetector, vDevice, vDeviceDesktop, vDeviceMobile, vDeviceTablet, } from './directives/vDevice';
export { createDevicePlugin, DevicePlugin, useDeviceDetector } from './plugin';
export { DevicePlugin as default } from './plugin';
//# sourceMappingURL=index.d.ts.map