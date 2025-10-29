#!/usr/bin/env node

/**
 * 设置所有子包
 * 
 * 此脚本用于：
 * 1. 安装所有子包的依赖
 * 2. 构建所有子包
 */

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const packages = [
  'core',
  'battery',
  'network',
  'vue',
  'react',
  'solid',
]

const examples = [
  'core/examples',
  'battery/examples',
  'network/examples',
  'vue/examples',
  'react/examples',
]

console.log('🚀 开始设置 @ldesign/device Monorepo...\n')

// 1. 安装所有包的依赖
console.log('📦 安装所有包的依赖...')
for (const pkg of packages) {
  const pkgPath = resolve(process.cwd(), 'packages', pkg)
  if (existsSync(pkgPath)) {
    console.log(`  ├─ 安装 ${pkg}...`)
    try {
      execSync('pnpm install', {
        cwd: pkgPath,
        stdio: 'inherit',
      })
    }
    catch (error) {
      console.error(`  ❌ 安装 ${pkg} 失败:`, error.message)
    }
  }
}

// 2. 构建所有包
console.log('\n🔨 构建所有包...')
for (const pkg of packages) {
  const pkgPath = resolve(process.cwd(), 'packages', pkg)
  if (existsSync(pkgPath)) {
    console.log(`  ├─ 构建 ${pkg}...`)
    try {
      execSync('pnpm build', {
        cwd: pkgPath,
        stdio: 'inherit',
      })
    }
    catch (error) {
      console.error(`  ❌ 构建 ${pkg} 失败:`, error.message)
    }
  }
}

// 3. 安装示例项目依赖
console.log('\n📱 安装示例项目依赖...')
for (const example of examples) {
  const examplePath = resolve(process.cwd(), 'packages', example)
  if (existsSync(examplePath)) {
    console.log(`  ├─ 安装 ${example}...`)
    try {
      execSync('pnpm install', {
        cwd: examplePath,
        stdio: 'inherit',
      })
    }
    catch (error) {
      console.error(`  ❌ 安装 ${example} 失败:`, error.message)
    }
  }
}

console.log('\n✅ 设置完成！\n')
console.log('🎯 运行演示:')
console.log('  pnpm demo:vue      - Vue 3 演示 (http://localhost:3200)')
console.log('  pnpm demo:react    - React 18 演示 (http://localhost:3201)')
console.log('  pnpm demo:battery  - 电池演示 (http://localhost:3101)')
console.log('  pnpm demo:core     - Core 演示 (http://localhost:3100)')
console.log('')

