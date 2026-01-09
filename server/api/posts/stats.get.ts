import { serverSupabaseClient } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 获取文章统计信息（带缓存）
 * GET /api/posts/stats?postIds=id1,id2,id3
 *
 * 安全性改进：使用 serverSupabaseClient 而不是 serverSupabaseServiceRole
 */
export default defineEventHandler(async event => {
  const query = getQuery(event)
  const postIds = query.postIds as string

  if (!postIds) {
    throw createError({
      statusCode: 400,
      message: 'Missing postIds parameter'
    })
  }

  const ids = postIds.split(',').filter(Boolean)

  try {
    const client = await serverSupabaseClient(event)
    const stats = await Promise.all(
      ids.map(async postId => {
        const cacheKey = `${CACHE_KEYS.POST_STATS}${postId}`

        // 尝试从缓存获取
        const cached = serverCache.get(cacheKey)
        if (cached) {
          return { postId, ...cached, fromCache: true }
        }

        // 查询点赞数
        const { count: likeCount } = await client
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postId)

        // 查询评论数
        const { count: commentCount } = await client
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postId)

        // 查询阅读数
        const { data: post } = await client
          .from('blog_posts')
          .select('view_count')
          .eq('id', postId)
          .single()

        const result = {
          likeCount: likeCount || 0,
          commentCount: commentCount || 0,
          viewCount: post?.view_count || 0
        }

        // 缓存 1 分钟
        serverCache.set(cacheKey, result, CACHE_TTL.POST_STATS)

        return { postId, ...result, fromCache: false }
      })
    )

    return {
      success: true,
      data: stats
    }
  } catch (error: any) {
    console.error('Error fetching post stats:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch post stats'
    })
  }
})
