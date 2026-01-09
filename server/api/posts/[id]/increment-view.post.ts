import { serverSupabaseServiceRole } from '#supabase/server'
import { cacheInvalidator } from '~/server/utils/cache'

/**
 * 增加文章阅读量（并清除统计缓存）
 * POST /api/posts/[id]/increment-view
 *
 * 使用 RPC 函数实现，需要在数据库中创建 increment_view_count 函数
 * 保留 service_role 权限：允许匿名用户增加阅读数
 */
export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing post ID'
    })
  }

  try {
    const client = serverSupabaseServiceRole(event)

    // 调用数据库 RPC 函数增加阅读量
    const { error } = await client.rpc('increment_view_count', {
      post_id: id
    } as any)

    if (error) throw error

    // 清除相关缓存
    cacheInvalidator.invalidatePost(id)

    return {
      success: true,
      message: 'View count incremented'
    }
  } catch (error: any) {
    console.error('Error incrementing view count:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to increment view count'
    })
  }
})
