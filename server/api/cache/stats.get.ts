import { getCacheStats } from '~/server/utils/cache'

/**
 * 获取缓存统计信息（管理员使用）
 * GET /api/cache/stats
 */
export default defineEventHandler(async event => {
  try {
    // 可以在这里添加管理员权限验证
    // const user = await serverSupabaseUser(event)
    // if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const stats = getCacheStats()

    return {
      success: true,
      data: {
        ...stats,
        usagePercentage: ((stats.size / stats.maxSize) * 100).toFixed(2) + '%'
      }
    }
  } catch (error: any) {
    console.error('Error getting cache stats:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get cache stats'
    })
  }
})
