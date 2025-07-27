/*!
 * @ldesign/device v1.0.0
 * (c) 2025 LDesign Team
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.LDesignStore = {}, global.Vue));
})(this, (function (exports, vue) { 'use strict';

    /**
     * 设备类型枚举
     */
    exports.DeviceType = void 0;
    (function (DeviceType) {
        /** 桌面设备 */
        DeviceType["DESKTOP"] = "desktop";
        /** 平板设备 */
        DeviceType["TABLET"] = "tablet";
        /** 移动设备 */
        DeviceType["MOBILE"] = "mobile";
    })(exports.DeviceType || (exports.DeviceType = {}));
    /**
     * 屏幕方向枚举
     */
    exports.Orientation = void 0;
    (function (Orientation) {
        /** 竖屏 */
        Orientation["PORTRAIT"] = "portrait";
        /** 横屏 */
        Orientation["LANDSCAPE"] = "landscape";
    })(exports.Orientation || (exports.Orientation = {}));
    /**
     * 默认设备检测配置
     */
    const DEFAULT_DEVICE_CONFIG = {
        tabletMinWidth: 768,
        desktopMinWidth: 1024,
        enableUserAgentDetection: true,
        enableTouchDetection: true,
    };

    /**
     * 获取当前屏幕尺寸
     */
    function getScreenSize() {
        if (typeof window === 'undefined') {
            return { width: 0, height: 0 };
        }
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        };
    }
    /**
     * 获取设备像素比
     */
    function getPixelRatio() {
        if (typeof window === 'undefined') {
            return 1;
        }
        return window.devicePixelRatio || 1;
    }
    /**
     * 检测是否为触摸设备
     */
    function isTouchDevice() {
        if (typeof window === 'undefined') {
            return false;
        }
        return ('ontouchstart' in window
            || navigator.maxTouchPoints > 0
            // @ts-ignore - 兼容旧版本
            || navigator.msMaxTouchPoints > 0);
    }
    /**
     * 获取用户代理字符串
     */
    function getUserAgent() {
        if (typeof navigator === 'undefined') {
            return '';
        }
        return navigator.userAgent || '';
    }
    /**
     * 基于用户代理检测设备类型
     */
    function detectDeviceTypeByUserAgent(userAgent) {
        const ua = userAgent.toLowerCase();
        // 移动设备检测
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        if (mobileRegex.test(ua)) {
            // iPad 特殊处理
            if (/ipad/i.test(ua)) {
                return exports.DeviceType.TABLET;
            }
            // Android 平板检测
            if (/android/i.test(ua) && !/mobile/i.test(ua)) {
                return exports.DeviceType.TABLET;
            }
            return exports.DeviceType.MOBILE;
        }
        // 平板设备检测
        const tabletRegex = /tablet|ipad|playbook|silk/i;
        if (tabletRegex.test(ua)) {
            return exports.DeviceType.TABLET;
        }
        return null;
    }
    /**
     * 基于屏幕尺寸检测设备类型
     */
    function detectDeviceTypeByScreenSize(width, height, config = {}) {
        const { tabletMinWidth, desktopMinWidth } = { ...DEFAULT_DEVICE_CONFIG, ...config };
        // 使用较小的尺寸作为判断依据（考虑横竖屏切换）
        const minDimension = Math.min(width, height);
        if (minDimension >= desktopMinWidth) {
            return exports.DeviceType.DESKTOP;
        }
        else if (minDimension >= tabletMinWidth) {
            return exports.DeviceType.TABLET;
        }
        else {
            return exports.DeviceType.MOBILE;
        }
    }
    /**
     * 综合检测设备类型
     */
    function detectDeviceType(width, height, userAgent, config = {}) {
        const { enableUserAgentDetection } = { ...DEFAULT_DEVICE_CONFIG, ...config };
        // 优先使用用户代理检测
        if (enableUserAgentDetection) {
            const uaResult = detectDeviceTypeByUserAgent(userAgent);
            if (uaResult) {
                return uaResult;
            }
        }
        // 回退到屏幕尺寸检测
        return detectDeviceTypeByScreenSize(width, height, config);
    }
    /**
     * 检测屏幕方向
     */
    function detectOrientation(width, height) {
        return width > height ? exports.Orientation.LANDSCAPE : exports.Orientation.PORTRAIT;
    }
    /**
     * 获取屏幕方向（使用原生API）
     */
    function getScreenOrientation() {
        if (typeof window === 'undefined') {
            return exports.Orientation.PORTRAIT;
        }
        // 优先使用 Screen Orientation API
        if (screen.orientation) {
            const angle = screen.orientation.angle;
            return (angle === 90 || angle === 270) ? exports.Orientation.LANDSCAPE : exports.Orientation.PORTRAIT;
        }
        // 回退到 window.orientation
        if (typeof window.orientation !== 'undefined') {
            const angle = Math.abs(window.orientation);
            return angle === 90 ? exports.Orientation.LANDSCAPE : exports.Orientation.PORTRAIT;
        }
        // 最后使用屏幕尺寸判断
        const { width, height } = getScreenSize();
        return detectOrientation(width, height);
    }
    /**
     * 防抖函数
     */
    function debounce(func, wait) {
        let timeout = null;
        return (...args) => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                func(...args);
            }, wait);
        };
    }
    /**
     * 节流函数
     */
    function throttle(func, wait) {
        let lastTime = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastTime >= wait) {
                lastTime = now;
                func(...args);
            }
        };
    }

    /**
     * 设备检测器实现
     */
    class DeviceDetectorImpl {
        constructor(config = {}) {
            Object.defineProperty(this, "config", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "currentDeviceInfo", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: null
            });
            Object.defineProperty(this, "listeners", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: []
            });
            Object.defineProperty(this, "resizeHandler", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: null
            });
            Object.defineProperty(this, "orientationHandler", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: null
            });
            Object.defineProperty(this, "isDestroyed", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: false
            });
            this.config = { ...DEFAULT_DEVICE_CONFIG, ...config };
            this.init();
        }
        /**
         * 初始化检测器
         */
        init() {
            if (typeof window === 'undefined') {
                return;
            }
            // 初始化设备信息
            this.currentDeviceInfo = this.createDeviceInfo();
            // 设置事件监听器
            this.setupEventListeners();
        }
        /**
         * 创建设备信息对象
         */
        createDeviceInfo() {
            const { width, height } = getScreenSize();
            const userAgent = getUserAgent();
            const pixelRatio = getPixelRatio();
            const isTouchDev = this.config.enableTouchDetection ? isTouchDevice() : false;
            const deviceType = detectDeviceType(width, height, userAgent, this.config);
            const orientation = getScreenOrientation();
            return {
                type: deviceType,
                orientation,
                width,
                height,
                pixelRatio,
                isTouchDevice: isTouchDev,
                userAgent,
            };
        }
        /**
         * 设置事件监听器
         */
        setupEventListeners() {
            if (typeof window === 'undefined') {
                return;
            }
            // 防抖处理，避免频繁触发
            const debouncedUpdate = debounce(() => {
                this.updateDeviceInfo();
            }, 100);
            // 监听窗口大小变化
            this.resizeHandler = debouncedUpdate;
            window.addEventListener('resize', this.resizeHandler);
            // 监听屏幕方向变化
            this.orientationHandler = debouncedUpdate;
            // 优先使用 Screen Orientation API
            if (screen.orientation) {
                screen.orientation.addEventListener('change', this.orientationHandler);
            }
            else {
                // 回退到 orientationchange 事件
                window.addEventListener('orientationchange', this.orientationHandler);
            }
        }
        /**
         * 更新设备信息
         */
        updateDeviceInfo() {
            if (this.isDestroyed) {
                return;
            }
            const previousInfo = this.currentDeviceInfo;
            const newInfo = this.createDeviceInfo();
            // 检查是否有变化
            const changes = this.getChanges(previousInfo, newInfo);
            if (changes.length > 0) {
                this.currentDeviceInfo = newInfo;
                // 触发变化事件
                const event = {
                    current: newInfo,
                    previous: previousInfo,
                    changes,
                };
                this.notifyListeners(event);
            }
        }
        /**
         * 获取变化的属性
         */
        getChanges(previous, current) {
            if (!previous) {
                return [];
            }
            const changes = [];
            const keys = Object.keys(current);
            for (const key of keys) {
                if (previous[key] !== current[key]) {
                    changes.push(key);
                }
            }
            return changes;
        }
        /**
         * 通知所有监听器
         */
        notifyListeners(event) {
            this.listeners.forEach((listener) => {
                try {
                    listener(event);
                }
                catch (error) {
                    console.error('Device change listener error:', error);
                }
            });
        }
        /**
         * 获取当前设备信息
         */
        getDeviceInfo() {
            if (!this.currentDeviceInfo) {
                this.currentDeviceInfo = this.createDeviceInfo();
            }
            return { ...this.currentDeviceInfo };
        }
        /**
         * 监听设备变化
         */
        onDeviceChange(callback) {
            this.listeners.push(callback);
            // 返回取消监听的函数
            return () => {
                const index = this.listeners.indexOf(callback);
                if (index > -1) {
                    this.listeners.splice(index, 1);
                }
            };
        }
        /**
         * 销毁检测器
         */
        destroy() {
            if (this.isDestroyed) {
                return;
            }
            this.isDestroyed = true;
            // 移除事件监听器
            if (typeof window !== 'undefined') {
                if (this.resizeHandler) {
                    window.removeEventListener('resize', this.resizeHandler);
                }
                if (this.orientationHandler) {
                    if (screen.orientation) {
                        screen.orientation.removeEventListener('change', this.orientationHandler);
                    }
                    else {
                        window.removeEventListener('orientationchange', this.orientationHandler);
                    }
                }
            }
            // 清空监听器
            this.listeners = [];
            this.currentDeviceInfo = null;
            this.resizeHandler = null;
            this.orientationHandler = null;
        }
    }
    /**
     * 创建设备检测器实例
     */
    function createDeviceDetector(config) {
        return new DeviceDetectorImpl(config);
    }
    /**
     * 全局设备检测器实例
     */
    let globalDetector = null;
    /**
     * 获取全局设备检测器实例
     */
    function getGlobalDeviceDetector(config) {
        if (!globalDetector) {
            globalDetector = createDeviceDetector(config);
        }
        return globalDetector;
    }
    /**
     * 快速获取当前设备信息
     */
    function getDeviceInfo(config) {
        return getGlobalDeviceDetector(config).getDeviceInfo();
    }
    /**
     * 快速监听设备变化
     */
    function onDeviceChange(callback, config) {
        return getGlobalDeviceDetector(config).onDeviceChange(callback);
    }

    /**
     * 响应式设备监听器
     */
    class ReactiveDeviceListener {
        constructor(options = {}) {
            Object.defineProperty(this, "state", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "listeners", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: new Set()
            });
            Object.defineProperty(this, "unsubscribe", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: null
            });
            Object.defineProperty(this, "options", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.options = { immediate: true, ...options };
            // 初始化状态
            this.state = {
                deviceInfo: {},
                isLoading: true,
                error: null,
            };
            if (this.options.immediate) {
                this.init();
            }
        }
        /**
         * 初始化监听器
         */
        init() {
            try {
                const detector = getGlobalDeviceDetector(this.options);
                // 获取初始设备信息
                this.updateState({
                    deviceInfo: detector.getDeviceInfo(),
                    isLoading: false,
                    error: null,
                });
                // 监听设备变化
                this.unsubscribe = detector.onDeviceChange((event) => {
                    this.updateState({
                        deviceInfo: event.current,
                        isLoading: false,
                        error: null,
                    });
                });
            }
            catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));
                this.updateState({
                    deviceInfo: {},
                    isLoading: false,
                    error: err,
                });
                if (this.options.onError) {
                    this.options.onError(err);
                }
            }
        }
        /**
         * 更新状态并通知监听器
         */
        updateState(newState) {
            this.state = { ...this.state, ...newState };
            this.notifyListeners();
        }
        /**
         * 通知所有监听器
         */
        notifyListeners() {
            this.listeners.forEach((listener) => {
                try {
                    listener(this.state);
                }
                catch (error) {
                    console.error('Reactive device listener error:', error);
                }
            });
        }
        /**
         * 获取当前状态
         */
        getState() {
            return { ...this.state };
        }
        /**
         * 订阅状态变化
         */
        subscribe(listener) {
            this.listeners.add(listener);
            // 立即触发一次
            listener(this.state);
            // 返回取消订阅函数
            return () => {
                this.listeners.delete(listener);
            };
        }
        /**
         * 手动刷新设备信息
         */
        refresh() {
            if (!this.unsubscribe) {
                this.init();
            }
            else {
                try {
                    const detector = getGlobalDeviceDetector(this.options);
                    this.updateState({
                        deviceInfo: detector.getDeviceInfo(),
                        isLoading: false,
                        error: null,
                    });
                }
                catch (error) {
                    const err = error instanceof Error ? error : new Error(String(error));
                    this.updateState({
                        error: err,
                        isLoading: false,
                    });
                    if (this.options.onError) {
                        this.options.onError(err);
                    }
                }
            }
        }
        /**
         * 销毁监听器
         */
        destroy() {
            if (this.unsubscribe) {
                this.unsubscribe();
                this.unsubscribe = null;
            }
            this.listeners.clear();
        }
    }
    /**
     * 创建响应式设备监听器
     */
    function createReactiveDeviceListener(options) {
        return new ReactiveDeviceListener(options);
    }
    /**
     * 简化的响应式设备信息钩子
     */
    function useDeviceInfo(options) {
        const listener = createReactiveDeviceListener(options);
        return {
            /** 获取当前状态 */
            getState: () => listener.getState(),
            /** 订阅状态变化 */
            subscribe: (callback) => listener.subscribe(callback),
            /** 刷新设备信息 */
            refresh: () => listener.refresh(),
            /** 销毁监听器 */
            destroy: () => listener.destroy(),
        };
    }
    /**
     * 媒体查询监听器
     */
    class MediaQueryListener {
        constructor(query) {
            Object.defineProperty(this, "query", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: query
            });
            Object.defineProperty(this, "mediaQuery", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: null
            });
            Object.defineProperty(this, "listeners", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: new Set()
            });
            Object.defineProperty(this, "currentMatches", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: false
            });
            this.init();
        }
        /**
         * 初始化媒体查询监听器
         */
        init() {
            if (typeof window === 'undefined' || !window.matchMedia) {
                return;
            }
            this.mediaQuery = window.matchMedia(this.query);
            this.currentMatches = this.mediaQuery.matches;
            // 监听变化
            const handler = (event) => {
                this.currentMatches = event.matches;
                this.notifyListeners();
            };
            if (this.mediaQuery.addEventListener) {
                this.mediaQuery.addEventListener('change', handler);
            }
            else {
                // 兼容旧版本
                this.mediaQuery.addListener(handler);
            }
        }
        /**
         * 通知所有监听器
         */
        notifyListeners() {
            this.listeners.forEach((listener) => {
                try {
                    listener(this.currentMatches);
                }
                catch (error) {
                    console.error('Media query listener error:', error);
                }
            });
        }
        /**
         * 获取当前匹配状态
         */
        matches() {
            return this.currentMatches;
        }
        /**
         * 订阅变化
         */
        subscribe(listener) {
            this.listeners.add(listener);
            // 立即触发一次
            listener(this.currentMatches);
            // 返回取消订阅函数
            return () => {
                this.listeners.delete(listener);
            };
        }
        /**
         * 销毁监听器
         */
        destroy() {
            this.listeners.clear();
            this.mediaQuery = null;
        }
    }
    /**
     * 创建媒体查询监听器
     */
    function createMediaQueryListener(query) {
        return new MediaQueryListener(query);
    }
    /**
     * 常用媒体查询预设
     */
    const MEDIA_QUERIES = {
        /** 移动设备 */
        mobile: '(max-width: 767px)',
        /** 平板设备 */
        tablet: '(min-width: 768px) and (max-width: 1023px)',
        /** 桌面设备 */
        desktop: '(min-width: 1024px)',
        /** 竖屏 */
        portrait: '(orientation: portrait)',
        /** 横屏 */
        landscape: '(orientation: landscape)',
        /** 高分辨率屏幕 */
        retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
        /** 深色模式 */
        darkMode: '(prefers-color-scheme: dark)',
        /** 浅色模式 */
        lightMode: '(prefers-color-scheme: light)',
        /** 减少动画 */
        reducedMotion: '(prefers-reduced-motion: reduce)',
    };

    /**
     * 抽象适配器基类
     */
    class BaseAdapter {
        constructor() {
            Object.defineProperty(this, "config", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: {}
            });
            Object.defineProperty(this, "isInitialized", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: false
            });
        }
        init(config) {
            this.config = { ...this.config, ...config };
            this.isInitialized = true;
        }
        destroy() {
            this.isInitialized = false;
            this.config = {};
        }
        checkInitialized() {
            if (!this.isInitialized) {
                throw new Error(`${this.name} adapter is not initialized`);
            }
        }
    }
    /**
     * 框架检测工具
     */
    class FrameworkDetector {
        /**
         * 检测当前运行的框架
         */
        static detect() {
            const results = [];
            if (typeof window === 'undefined') {
                return results;
            }
            const win = window;
            // 检测 Vue
            if (win.Vue) {
                const vue = win.Vue;
                if (vue.version) {
                    if (vue.version.startsWith('3.')) {
                        results.push({
                            name: 'vue3',
                            version: vue.version,
                            supported: true,
                            confidence: 0.9,
                        });
                    }
                    else if (vue.version.startsWith('2.')) {
                        results.push({
                            name: 'vue2',
                            version: vue.version,
                            supported: false, // 暂未实现
                            confidence: 0.9,
                        });
                    }
                }
            }
            // 检测 React
            if (win.React) {
                const react = win.React;
                results.push({
                    name: 'react',
                    version: react.version || 'unknown',
                    supported: false, // 暂未实现
                    confidence: 0.8,
                });
            }
            return results.sort((a, b) => b.confidence - a.confidence);
        }
        /**
         * 获取最佳匹配的框架
         */
        static getBestMatch() {
            const results = this.detect();
            return results.find(r => r.supported) || results[0] || null;
        }
    }

    /**
     * 适配器注册表实现
     */
    class AdapterRegistryImpl {
        constructor() {
            Object.defineProperty(this, "adapters", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: new Map()
            });
        }
        /**
         * 注册适配器
         */
        register(name, factory) {
            this.adapters.set(name, factory);
        }
        /**
         * 获取适配器
         */
        get(name) {
            return this.adapters.get(name);
        }
        /**
         * 获取所有适配器
         */
        getAll() {
            return new Map(this.adapters);
        }
        /**
         * 自动检测并获取适配器
         */
        detect() {
            const frameworks = FrameworkDetector.detect();
            for (const framework of frameworks) {
                const adapter = this.adapters.get(framework.name);
                if (adapter && adapter.isCompatible()) {
                    return adapter;
                }
            }
            return undefined;
        }
        /**
         * 清空注册表
         */
        clear() {
            this.adapters.clear();
        }
        /**
         * 获取支持的框架列表
         */
        getSupportedFrameworks() {
            return Array.from(this.adapters.keys());
        }
        /**
         * 检查框架是否支持
         */
        isSupported(framework) {
            const adapter = this.adapters.get(framework);
            return adapter ? adapter.isCompatible() : false;
        }
    }
    /**
     * 全局适配器注册表实例
     */
    const globalAdapterRegistry = new AdapterRegistryImpl();
    /**
     * 注册适配器的便捷函数
     */
    function registerAdapter(name, factory) {
        globalAdapterRegistry.register(name, factory);
    }
    /**
     * 获取适配器的便捷函数
     */
    function getAdapter(name) {
        return globalAdapterRegistry.get(name);
    }
    /**
     * 自动检测适配器的便捷函数
     */
    function detectAdapter() {
        return globalAdapterRegistry.detect();
    }
    /**
     * 获取所有支持的框架
     */
    function getSupportedFrameworks() {
        return globalAdapterRegistry.getSupportedFrameworks();
    }
    /**
     * 检查框架支持情况
     */
    function checkFrameworkSupport() {
        return FrameworkDetector.detect();
    }

    /**
     * Vue3 设备信息组合式API
     */
    function useDevice(options = {}) {
        // 响应式状态
        const deviceInfo = vue.ref({});
        const isLoading = vue.ref(true);
        const error = vue.ref(null);
        // 监听器实例
        let listener = null;
        let unsubscribe = null;
        // 初始化
        const init = () => {
            listener = createReactiveDeviceListener({
                ...options,
                onError: (err) => {
                    error.value = err;
                    options.onError?.(err);
                },
            });
            unsubscribe = listener.subscribe((state) => {
                deviceInfo.value = state.deviceInfo;
                isLoading.value = state.isLoading;
                error.value = state.error;
            });
        };
        // 刷新设备信息
        const refresh = () => {
            listener?.refresh();
        };
        // 计算属性
        const isMobile = vue.computed(() => deviceInfo.value.type === 'mobile');
        const isTablet = vue.computed(() => deviceInfo.value.type === 'tablet');
        const isDesktop = vue.computed(() => deviceInfo.value.type === 'desktop');
        const isPortrait = vue.computed(() => deviceInfo.value.orientation === 'portrait');
        const isLandscape = vue.computed(() => deviceInfo.value.orientation === 'landscape');
        const isTouchDevice = vue.computed(() => deviceInfo.value.isTouchDevice);
        // 生命周期
        vue.onMounted(() => {
            init();
        });
        vue.onUnmounted(() => {
            unsubscribe?.();
            listener?.destroy();
        });
        return {
            // 状态
            deviceInfo: deviceInfo,
            isLoading,
            error,
            // 计算属性
            isMobile,
            isTablet,
            isDesktop,
            isPortrait,
            isLandscape,
            isTouchDevice,
            // 方法
            refresh,
        };
    }
    /**
     * 设备类型检测组合式API
     */
    function useDeviceType(options) {
        const { deviceInfo } = useDevice(options);
        const deviceType = vue.computed(() => deviceInfo.value.type);
        const isMobile = vue.computed(() => deviceType.value === 'mobile');
        const isTablet = vue.computed(() => deviceType.value === 'tablet');
        const isDesktop = vue.computed(() => deviceType.value === 'desktop');
        return {
            deviceType,
            isMobile,
            isTablet,
            isDesktop,
        };
    }
    /**
     * 屏幕方向检测组合式API
     */
    function useOrientation(options) {
        const { deviceInfo } = useDevice(options);
        const orientation = vue.computed(() => deviceInfo.value.orientation);
        const isPortrait = vue.computed(() => orientation.value === 'portrait');
        const isLandscape = vue.computed(() => orientation.value === 'landscape');
        return {
            orientation,
            isPortrait,
            isLandscape,
        };
    }
    /**
     * 屏幕尺寸检测组合式API
     */
    function useScreenSize(options) {
        const { deviceInfo } = useDevice(options);
        const width = vue.computed(() => deviceInfo.value.width);
        const height = vue.computed(() => deviceInfo.value.height);
        const pixelRatio = vue.computed(() => deviceInfo.value.pixelRatio);
        return {
            width,
            height,
            pixelRatio,
        };
    }
    /**
     * 媒体查询组合式API
     */
    function useMediaQuery(query) {
        const matches = vue.ref(false);
        let listener = null;
        let unsubscribe = null;
        const init = () => {
            listener = createMediaQueryListener(query);
            unsubscribe = listener.subscribe((isMatched) => {
                matches.value = isMatched;
            });
        };
        vue.onMounted(() => {
            init();
        });
        vue.onUnmounted(() => {
            unsubscribe?.();
            listener?.destroy();
        });
        return matches;
    }
    /**
     * 响应式断点检测组合式API
     */
    function useBreakpoints() {
        const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
        const isTablet = useMediaQuery(MEDIA_QUERIES.tablet);
        const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);
        const isPortrait = useMediaQuery(MEDIA_QUERIES.portrait);
        const isLandscape = useMediaQuery(MEDIA_QUERIES.landscape);
        const isRetina = useMediaQuery(MEDIA_QUERIES.retina);
        const isDarkMode = useMediaQuery(MEDIA_QUERIES.darkMode);
        const isLightMode = useMediaQuery(MEDIA_QUERIES.lightMode);
        const prefersReducedMotion = useMediaQuery(MEDIA_QUERIES.reducedMotion);
        // 当前激活的断点
        const activeBreakpoint = vue.computed(() => {
            if (isMobile.value)
                return 'mobile';
            if (isTablet.value)
                return 'tablet';
            if (isDesktop.value)
                return 'desktop';
            return 'unknown';
        });
        return {
            // 设备类型
            isMobile,
            isTablet,
            isDesktop,
            // 方向
            isPortrait,
            isLandscape,
            // 其他特性
            isRetina,
            isDarkMode,
            isLightMode,
            prefersReducedMotion,
            // 当前断点
            activeBreakpoint,
        };
    }
    /**
     * 设备变化监听组合式API
     */
    function useDeviceChange(callback, options) {
        let unsubscribe = null;
        const startListening = () => {
            const detector = getGlobalDeviceDetector(options);
            unsubscribe = detector.onDeviceChange(callback);
        };
        const stopListening = () => {
            unsubscribe?.();
            unsubscribe = null;
        };
        vue.onMounted(() => {
            startListening();
        });
        vue.onUnmounted(() => {
            stopListening();
        });
        return {
            startListening,
            stopListening,
        };
    }
    /**
     * 自定义媒体查询组合式API
     */
    function useCustomMediaQuery(queries) {
        const results = vue.reactive({});
        const listeners = [];
        const init = () => {
            Object.entries(queries).forEach(([key, query]) => {
                const listener = createMediaQueryListener(query);
                const unsubscribe = listener.subscribe((matches) => {
                    results[key] = matches;
                });
                listeners.push({ key, listener, unsubscribe });
            });
        };
        const destroy = () => {
            listeners.forEach(({ listener, unsubscribe }) => {
                unsubscribe();
                listener.destroy();
            });
            listeners.length = 0;
        };
        vue.onMounted(() => {
            init();
        });
        vue.onUnmounted(() => {
            destroy();
        });
        return results;
    }
    /**
     * 设备特性检测组合式API
     */
    function useDeviceFeatures(options) {
        const { deviceInfo } = useDevice(options);
        const isTouchDevice = vue.computed(() => deviceInfo.value.isTouchDevice);
        const hasHighDPI = vue.computed(() => deviceInfo.value.pixelRatio > 1);
        const isSmallScreen = vue.computed(() => Math.min(deviceInfo.value.width, deviceInfo.value.height) < 768);
        const isLargeScreen = vue.computed(() => Math.min(deviceInfo.value.width, deviceInfo.value.height) >= 1024);
        return {
            isTouchDevice,
            hasHighDPI,
            isSmallScreen,
            isLargeScreen,
        };
    }
    /**
     * 设备上下文 Key
     */
    const DEVICE_CONTEXT_KEY$1 = Symbol('device-context');
    /**
     * DeviceProvider 组件
     */
    const DeviceProvider = vue.defineComponent({
        name: 'DeviceProvider',
        props: {
            config: {
                type: Object,
                default: () => ({}),
            },
        },
        setup(props, { slots }) {
            const deviceContext = useDevice(props.config);
            // 提供设备上下文
            vue.provide(DEVICE_CONTEXT_KEY$1, deviceContext);
            return () => slots.default?.();
        },
    });

    /**
     * Vue3 设备检测上下文 Key
     */
    const DEVICE_CONTEXT_KEY = Symbol('device-context');
    /**
     * Vue3 适配器实现
     */
    class Vue3Adapter extends BaseAdapter {
        constructor() {
            super(...arguments);
            Object.defineProperty(this, "name", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: 'vue3'
            });
            Object.defineProperty(this, "version", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: '1.0.0'
            });
            Object.defineProperty(this, "app", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: null
            });
        }
        /**
         * 安装适配器到 Vue 应用
         */
        install(app, options = {}) {
            this.app = app;
            this.init(options);
            // 注册全局属性
            app.config.globalProperties.$device = this.createReactiveDeviceInfo(options);
            // 注册组件
            app.component('DeviceProvider', this.createDeviceProviderComponent());
            app.component('DeviceInfo', this.createDeviceInfoComponent());
            // 注册指令
            this.registerDirectives();
        }
        /**
         * 创建响应式设备信息
         */
        createReactiveDeviceInfo(config) {
            return useDevice(config);
        }
        /**
         * 创建响应式设备类型
         */
        createReactiveDeviceType(config) {
            return useDeviceType(config);
        }
        /**
         * 创建响应式屏幕方向
         */
        createReactiveOrientation(config) {
            return useOrientation(config);
        }
        /**
         * 创建设备信息组件
         */
        createDeviceInfoComponent(props) {
            return {
                name: 'DeviceInfo',
                props: {
                    detailed: {
                        type: Boolean,
                        default: false,
                    },
                    showLoading: {
                        type: Boolean,
                        default: true,
                    },
                    config: {
                        type: Object,
                        default: () => ({}),
                    },
                },
                setup(props) {
                    const { deviceInfo, isLoading, error } = useDevice(props.config);
                    return {
                        deviceInfo,
                        isLoading,
                        error,
                    };
                },
                template: `
        <div class="ldesign-device-info">
          <div v-if="isLoading && showLoading" class="loading">
            检测设备信息中...
          </div>
          <div v-else-if="error" class="error">
            设备检测失败: {{ error.message }}
          </div>
          <div v-else class="device-info">
            <div class="info-item">
              <span class="label">设备类型:</span>
              <span class="value">{{ deviceInfo.type }}</span>
            </div>
            <div class="info-item">
              <span class="label">屏幕方向:</span>
              <span class="value">{{ deviceInfo.orientation }}</span>
            </div>
            <div class="info-item">
              <span class="label">屏幕尺寸:</span>
              <span class="value">{{ deviceInfo.width }} × {{ deviceInfo.height }}</span>
            </div>
            <div v-if="detailed" class="detailed-info">
              <div class="info-item">
                <span class="label">像素比:</span>
                <span class="value">{{ deviceInfo.pixelRatio }}</span>
              </div>
              <div class="info-item">
                <span class="label">触摸设备:</span>
                <span class="value">{{ deviceInfo.isTouchDevice ? '是' : '否' }}</span>
              </div>
            </div>
          </div>
        </div>
      `,
            };
        }
        /**
         * 创建设备提供者组件
         */
        createDeviceProviderComponent(props) {
            return {
                name: 'DeviceProvider',
                props: {
                    config: {
                        type: Object,
                        default: () => ({}),
                    },
                },
                setup(props, { slots }) {
                    const deviceContext = useDevice(props.config);
                    // 提供设备上下文
                    vue.provide(DEVICE_CONTEXT_KEY, deviceContext);
                    return () => slots.default?.();
                },
            };
        }
        /**
         * 注册设备相关指令
         */
        registerDirectives() {
            if (!this.app)
                return;
            // v-device 指令 - 根据设备类型显示/隐藏
            this.app.directive('device', this.createDeviceDirective());
            // v-mobile 指令 - 仅在移动设备显示
            this.app.directive('mobile', this.createConditionalDirective('mobile'));
            // v-tablet 指令 - 仅在平板设备显示
            this.app.directive('tablet', this.createConditionalDirective('tablet'));
            // v-desktop 指令 - 仅在桌面设备显示
            this.app.directive('desktop', this.createConditionalDirective('desktop'));
            // v-portrait 指令 - 仅在竖屏显示
            this.app.directive('portrait', this.createConditionalDirective('portrait'));
            // v-landscape 指令 - 仅在横屏显示
            this.app.directive('landscape', this.createConditionalDirective('landscape'));
            // v-touch 指令 - 仅在触摸设备显示
            this.app.directive('touch', this.createConditionalDirective('touch'));
        }
        /**
         * 创建设备指令
         */
        createDeviceDirective() {
            return {
                mounted(el, binding) {
                    const { deviceInfo } = useDevice();
                    const targetDevices = Array.isArray(binding.value) ? binding.value : [binding.value];
                    const updateVisibility = () => {
                        const shouldShow = targetDevices.includes(deviceInfo.value.type);
                        el.style.display = shouldShow ? '' : 'none';
                    };
                    updateVisibility();
                    // 存储更新函数以便清理
                    el._deviceDirectiveUpdate = updateVisibility;
                },
                unmounted(el) {
                    if (el._deviceDirectiveUpdate) {
                        delete el._deviceDirectiveUpdate;
                    }
                },
            };
        }
        /**
         * 创建条件渲染指令
         */
        createConditionalDirective(condition) {
            return {
                mounted(el, binding) {
                    const { deviceInfo } = useDevice();
                    const updateVisibility = () => {
                        let shouldShow = false;
                        switch (condition) {
                            case 'mobile':
                                shouldShow = deviceInfo.value.type === 'mobile';
                                break;
                            case 'tablet':
                                shouldShow = deviceInfo.value.type === 'tablet';
                                break;
                            case 'desktop':
                                shouldShow = deviceInfo.value.type === 'desktop';
                                break;
                            case 'portrait':
                                shouldShow = deviceInfo.value.orientation === 'portrait';
                                break;
                            case 'landscape':
                                shouldShow = deviceInfo.value.orientation === 'landscape';
                                break;
                            case 'touch':
                                shouldShow = deviceInfo.value.isTouchDevice;
                                break;
                        }
                        // 支持取反
                        if (binding.modifiers.not) {
                            shouldShow = !shouldShow;
                        }
                        el.style.display = shouldShow ? '' : 'none';
                    };
                    updateVisibility();
                    // 存储更新函数以便清理
                    el._conditionalDirectiveUpdate = updateVisibility;
                },
                unmounted(el) {
                    if (el._conditionalDirectiveUpdate) {
                        delete el._conditionalDirectiveUpdate;
                    }
                },
            };
        }
        /**
         * 销毁适配器
         */
        destroy() {
            super.destroy();
            this.app = null;
        }
    }
    /**
     * Vue3 适配器工厂
     */
    class Vue3AdapterFactory {
        create(config) {
            return new Vue3Adapter();
        }
        isCompatible() {
            try {
                // 检查是否在 Vue 3 环境中
                if (typeof window === 'undefined') {
                    return false;
                }
                const vue = window.Vue;
                return vue && vue.version && vue.version.startsWith('3.');
            }
            catch {
                return false;
            }
        }
        getSupportedVersions() {
            return ['3.0.0', '3.1.0', '3.2.0', '3.3.0', '3.4.0'];
        }
    }
    /**
     * 创建 Vue3 插件
     */
    function createVue3Plugin(options = {}) {
        return {
            install(app) {
                const adapter = new Vue3Adapter();
                adapter.install(app, options);
            },
        };
    }

    // 适配器类型定义
    // 自动注册适配器
    // 注册 Vue3 适配器
    registerAdapter('vue3', new Vue3AdapterFactory());

    exports.AdapterRegistryImpl = AdapterRegistryImpl;
    exports.BaseAdapter = BaseAdapter;
    exports.DEFAULT_DEVICE_CONFIG = DEFAULT_DEVICE_CONFIG;
    exports.DeviceDetectorImpl = DeviceDetectorImpl;
    exports.DeviceProvider = DeviceProvider;
    exports.FrameworkDetector = FrameworkDetector;
    exports.MEDIA_QUERIES = MEDIA_QUERIES;
    exports.MediaQueryListener = MediaQueryListener;
    exports.ReactiveDeviceListener = ReactiveDeviceListener;
    exports.Vue3Adapter = Vue3Adapter;
    exports.Vue3AdapterFactory = Vue3AdapterFactory;
    exports.checkFrameworkSupport = checkFrameworkSupport;
    exports.createDeviceDetector = createDeviceDetector;
    exports.createMediaQueryListener = createMediaQueryListener;
    exports.createReactiveDeviceListener = createReactiveDeviceListener;
    exports.createVue3Plugin = createVue3Plugin;
    exports.debounce = debounce;
    exports.detectAdapter = detectAdapter;
    exports.detectDeviceType = detectDeviceType;
    exports.detectDeviceTypeByScreenSize = detectDeviceTypeByScreenSize;
    exports.detectDeviceTypeByUserAgent = detectDeviceTypeByUserAgent;
    exports.detectOrientation = detectOrientation;
    exports.getAdapter = getAdapter;
    exports.getDeviceInfo = getDeviceInfo;
    exports.getGlobalDeviceDetector = getGlobalDeviceDetector;
    exports.getPixelRatio = getPixelRatio;
    exports.getScreenOrientation = getScreenOrientation;
    exports.getScreenSize = getScreenSize;
    exports.getSupportedFrameworks = getSupportedFrameworks;
    exports.getUserAgent = getUserAgent;
    exports.globalAdapterRegistry = globalAdapterRegistry;
    exports.isTouchDevice = isTouchDevice;
    exports.onDeviceChange = onDeviceChange;
    exports.registerAdapter = registerAdapter;
    exports.throttle = throttle;
    exports.useBreakpoints = useBreakpoints;
    exports.useCustomMediaQuery = useCustomMediaQuery;
    exports.useDevice = useDevice;
    exports.useDeviceChange = useDeviceChange;
    exports.useDeviceFeatures = useDeviceFeatures;
    exports.useDeviceInfo = useDeviceInfo;
    exports.useDeviceType = useDeviceType;
    exports.useMediaQuery = useMediaQuery;
    exports.useOrientation = useOrientation;
    exports.useScreenSize = useScreenSize;

}));
//# sourceMappingURL=index.js.map
