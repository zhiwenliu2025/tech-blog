import { serverSupabaseServiceRole } from '#supabase/server'
import { cacheInvalidator } from '~/server/utils/cache'

/**
 * 增加文章阅读量（并清除统计缓存）
 * POST /api/posts/[id]/increment-view
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

    // 使用 RPC 函数增加阅读量（如果存在）
    const { data: functionExists } = await client.rpc('increment_view_count', {
      post_id: id
    })

    // 如果 RPC 函数不存在，使用直接更新
    if (functionExists === null) {
      const { data, error } = await client
        .from('blog_posts')
        .select('view_count')
        .eq('id', id)
        .single()

      if (error) throw error

      await client
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id)
    }

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
