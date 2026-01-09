import { serverSupabaseClient } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 获取单个文章的统计信息（带缓存）
 * GET /api/posts/[id]/stats
 *
 * 安全性改进：使用 serverSupabaseClient 而不是 serverSupabaseServiceRole
 * 依赖数据库 RLS 策略保护数据，只读取公开信息
 */
export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing post ID'
    })
  }

  const cacheKey = `${CACHE_KEYS.POST_STATS}${id}`

  try {
    // 使用 getOrSet 辅助函数
    const stats = await serverCache.getOrSet(
      cacheKey,
      async () => {
        // 使用普通客户端，受 RLS 保护
        const client = await serverSupabaseClient(event)

        // 并行查询点赞数、评论数、阅读数
        const [likesResult, commentsResult, postResult] = await Promise.all([
          client.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', id),
          client.from('comments').select('*', { count: 'exact', head: true }).eq('post_id', id),
          client.from('blog_posts').select('view_count').eq('id', id).single()
        ])

        return {
          likeCount: likesResult.count || 0,
          commentCount: commentsResult.count || 0,
          viewCount: (postResult.data as any)?.view_count || 0
        }
      },
      CACHE_TTL.POST_STATS
    )

    return {
      success: true,
      data: stats,
      cached: serverCache.has(cacheKey)
    }
  } catch (error: any) {
    console.error('Error fetching post stats:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch post stats'
    })
  }
})
