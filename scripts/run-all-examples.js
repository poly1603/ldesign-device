#!/usr/bin/env node

/**
 * 快速启动所有示例的脚本
 */

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const examplesDir = join(__dirname, '..', 'examples')

const examples = [
  { name: 'Vanilla JS', dir: 'vanilla-js', port: 5173 },
  { name: 'Vue 3', dir: 'vue-example', port: 5174 },
  { name: 'React', dir: 'react-example', port: 3001 },
  { name: 'TypeScript', dir: 'typescript-example', port: 3002 },
  { name: 'Complete App', dir: 'complete-app', port: 3003 },
  { name: 'Playground', dir: 'playground', port: 3004 },
]

console.log('\n🚀 启动所有示例项目...\n')

const processes = []

examples.forEach((example, index) => {
  setTimeout(() => {
    const examplePath = join(examplesDir, example.dir)

    console.log(`[${index + 1}/${examples.length}] 启动 ${example.name}...`)
    console.log(`   目录: ${example.dir}`)
    console.log(`   端口: ${example.port}`)
    console.log(`   URL: http://localhost:${example.port}\n`)

    const proc = spawn('npm', ['run', 'dev'], {
      cwd: examplePath,
      stdio: 'inherit',
      shell: true
    })

    proc.on('error', (err) => {
      console.error(`❌ ${example.name} 启动失败:`, err.message)
    })

    processes.push(proc)
  }, index * 2000) // 每个示例间隔 2 秒启动
})

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n\n🛑 正在关闭所有示例...')
  processes.forEach(proc => proc.kill())
  process.exit(0)
})

console.log('💡 提示：按 Ctrl+C 关闭所有示例\n')
console.log('📚 所有示例将在以下端口运行：')
examples.forEach(example => {
  console.log(`   ${example.name}: http://localhost:${example.port}`)
})
console.log('\n')

