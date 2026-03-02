import type { Database } from '~/types/database.types'
import { serverSupabaseClient } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 获取热门文章列表（带缓存）
 * GET /api/posts/hot?limit=10&days=30
 *
 * 安全性改进：使用 serverSupabaseClient 而不是 serverSupabaseServiceRole
 */
export default defineEventHandler(async event => {
  const query = getQuery(event)
  const limit = parseInt((query.limit as string) || '10')
  const days = parseInt((query.days as string) || '30')

  const cacheKey = `${CACHE_KEYS.HOT_POSTS}:${limit}:${days}`

  try {
    const hotPosts = await serverCache.getOrSet(
      cacheKey,
      async () => {
        const client = await serverSupabaseClient<Database>(event)

        // 使用 RPC 在数据库中一次性计算热门文章（包含点赞数、评论数和热度分数）
        const { data, error } = await (client as any).rpc('get_hot_posts', {
          p_days: days,
          p_limit: limit,
          p_offset: 0,
          p_use_decay: true
        })

        if (error) {
          throw error
        }

        const posts = (data || []) as Array<{
          id: string
          title: string
          slug: string
          excerpt: string | null
          cover_image: string | null
          view_count: number
          published_at: string | null
          category: string | null
          tags: string[] | null
          author_id: string | null
          likes_count: number | null
          comments_count: number | null
          hot_score: number | null
        }>

        // 获取所有唯一的作者ID
        const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))] as string[]

        // 批量获取作者信息
        const authorsResult =
          authorIds.length > 0
            ? await client
                .from('profiles')
                .select('id, username, full_name, avatar_url, bio')
                .in('id', authorIds)
            : { data: [], error: null }

        // 构建作者信息映射
        const authorsMap: Record<string, any> = {}
        authorsResult.data?.forEach((author: any) => {
          authorsMap[author.id] = author
        })

        // 组装最终结果，保持与原先结构兼容
        return posts.map(post => {
          const likeCount = Number(post.likes_count ?? 0)
          const commentCount = Number(post.comments_count ?? 0)
          const hotScore = Number(post.hot_score ?? 0)

          return {
            ...post,
            likes_count: likeCount,
            comments_count: commentCount,
            likeCount,
            commentCount,
            hotScore,
            profiles: post.author_id ? authorsMap[post.author_id] || null : null
          }
        })
      },
      CACHE_TTL.HOT_POSTS
    )

    return {
      success: true,
      data: hotPosts,
      cached: serverCache.has(cacheKey)
    }
  } catch (error: any) {
    console.error('Error fetching hot posts:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch hot posts'
    })
  }
})
