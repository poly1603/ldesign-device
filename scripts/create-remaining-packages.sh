#!/bin/bash

# 创建剩余的功能模块包（geolocation, media, utils）
# 这是一个可选脚本，用于快速创建剩余的包

echo "🚀 创建剩余的功能模块包..."
echo ""

PACKAGES_DIR="packages/device/packages"

# Geolocation 包
echo "📍 创建 geolocation 包..."
cp -r "$PACKAGES_DIR/network" "$PACKAGES_DIR/geolocation"

cd "$PACKAGES_DIR/geolocation"

# 替换名称
sed -i 's/network/geolocation/g' package.json
sed -i 's/Network/Geolocation/g' package.json builder.config.ts
sed -i 's/3102/3103/g' examples/launcher.config.ts

# 替换源代码提示
cat > src/index.ts << 'EOF'
/**
 * @ldesign/device-geolocation
 * 
 * 地理定位模块
 * 
 * TODO: 从 ../../src/modules/GeolocationModule.ts 复制并调整代码
 */

// export { GeolocationModule } from './GeolocationModule'
export type { GeolocationInfo, DeviceModule } from '@ldesign/device-core'
EOF

echo "✅ geolocation 包已创建"
echo "   请复制 ../../src/modules/GeolocationModule.ts 到 src/"
echo ""

# Media 包
echo "📹 创建 media 包..."
cd "$PACKAGES_DIR"
cp -r "network" "media"

cd "$PACKAGES_DIR/media"

# 替换名称
sed -i 's/network/media/g' package.json
sed -i 's/Network/Media/g' package.json builder.config.ts
sed -i 's/3102/3104/g' examples/launcher.config.ts

cat > src/index.ts << 'EOF'
/**
 * @ldesign/device-media
 * 
 * 媒体设备检测模块
 * 
 * TODO: 从 ../../src/modules/MediaModule.ts 复制并调整代码
 */

// export { MediaModule } from './MediaModule'
export type { DeviceModule } from '@ldesign/device-core'
EOF

echo "✅ media 包已创建"
echo "   请复制 ../../src/modules/MediaModule.ts 到 src/"
echo ""

# Utils 包
echo "🛠️  创建 utils 包..."
cd "$PACKAGES_DIR"
cp -r "network" "utils"

cd "$PACKAGES_DIR/utils"

# 替换名称
sed -i 's/network/utils/g' package.json
sed -i 's/Network/Utils/g' package.json builder.config.ts
sed -i 's/3102/3105/g' examples/launcher.config.ts

cat > src/index.ts << 'EOF'
/**
 * @ldesign/device-utils
 * 
 * 设备检测工具函数集合
 * 
 * TODO: 从 ../../src/utils/ 复制所有工具文件
 */

// export * from './DeviceFingerprint'
// export * from './PerformanceMonitor'
// export * from './SmartCache'
// export * from './MemoryManager'

export type { DeviceModule } from '@ldesign/device-core'
EOF

echo "✅ utils 包已创建"
echo "   请复制 ../../src/utils/* 到 src/"
echo ""

echo "🎉 所有包结构已创建！"
echo ""
echo "📝 下一步:"
echo "  1. 复制源代码文件到各包的 src/ 目录"
echo "  2. 调整导入路径（'../types' -> '@ldesign/device-core'）"
echo "  3. 运行 pnpm install 和 pnpm build"
echo ""

