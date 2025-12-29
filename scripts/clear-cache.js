#!/usr/bin/env node

/**
 * 清理 Nuxt 缓存脚本
 * 使用方法: node scripts/clear-cache.js
 * 或: pnpm clear-cache
 */

import { rmSync, existsSync } from 'fs'
import { join } from 'path'

const cacheDirs = ['.nuxt', '.output', '.nitro', '.cache', '.data', 'dist', 'node_modules/.cache']

console.log('🧹 开始清理 Nuxt 缓存...\n')

let deletedCount = 0
let notFoundCount = 0

cacheDirs.forEach(dir => {
  const fullPath = join(process.cwd(), dir)

  if (existsSync(fullPath)) {
    try {
      rmSync(fullPath, { recursive: true, force: true })
      console.log(`✅ 已删除: ${dir}`)
      deletedCount++
    } catch (error) {
      console.error(`❌ 删除失败: ${dir}`, error.message)
    }
  } else {
    console.log(`⏭️  不存在: ${dir}`)
    notFoundCount++
  }
})

console.log(`\n✨ 清理完成!`)
console.log(`   - 已删除: ${deletedCount} 个目录`)
console.log(`   - 不存在: ${notFoundCount} 个目录`)
