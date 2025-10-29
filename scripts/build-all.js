#!/usr/bin/env node

/**
 * 构建所有子包
 * 
 * 按照正确的依赖顺序构建
 */

import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

const buildOrder = [
  // 1. 核心包（无依赖）
  'core',

  // 2. 功能模块（依赖 core）
  'battery',
  'network',

  // 3. 框架适配（依赖 core + 功能模块）
  'vue',
  'react',
  'solid',
]

console.log('🔨 按顺序构建所有包...\n')

for (const pkg of buildOrder) {
  const pkgPath = resolve(process.cwd(), 'packages', pkg)

  console.log(`📦 构建 @ldesign/device-${pkg}...`)

  try {
    execSync('pnpm build', {
      cwd: pkgPath,
      stdio: 'inherit',
    })
    console.log(`✅ ${pkg} 构建完成\n`)
  }
  catch (error) {
    console.error(`❌ ${pkg} 构建失败:`, error.message)
    process.exit(1)
  }
}

console.log('🎉 所有包构建完成！\n')

