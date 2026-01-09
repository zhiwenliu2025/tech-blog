import { serverSupabaseServiceRole } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 获取热门文章列表（带缓存）
 * GET /api/posts/hot?limit=10&days=30
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
        const client = serverSupabaseServiceRole(event)

        // 获取指定天数内的已发布文章
        const daysAgo = new Date()
        daysAgo.setDate(daysAgo.getDate() - days)

        const { data: posts, error } = await client
          .from('blog_posts')
          .select(
            `
            id,
            title,
            slug,
            excerpt,
            cover_image,
            view_count,
            published_at,
            category,
            tags,
            author_id
          `
          )
          .eq('published', true)
          .gte('published_at', daysAgo.toISOString())
          .order('published_at', { ascending: false })

        if (error) throw error

        // 获取每篇文章的点赞数和评论数
        const postsWithStats = await Promise.all(
          (posts || []).map(async (post: any) => {
            // 查询点赞数
            const { count: likeCount } = await client
              .from('likes')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id)

            // 查询评论数
            const { count: commentCount } = await client
              .from('comments')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id)

            // 计算热度分数
            // 阅读量 × 0.3 + 点赞数 × 0.4 + 评论数 × 0.3
            const hotScore =
              (post.view_count || 0) * 0.3 + (likeCount || 0) * 0.4 + (commentCount || 0) * 0.3

            // 时间衰减因子（越新的文章权重越高）
            const publishedAt = new Date(post.published_at || '')
            const daysSincePublished = Math.floor(
              (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24)
            )
            const timeFactor = Math.max(0.1, 1 - daysSincePublished / days)

            return {
              ...post,
              likes_count: likeCount || 0,
              comments_count: commentCount || 0,
              likeCount: likeCount || 0,
              commentCount: commentCount || 0,
              hotScore: hotScore * timeFactor
            }
          })
        )

        // 按热度分数排序并返回前 N 篇
        return postsWithStats.sort((a: any, b: any) => b.hotScore - a.hotScore).slice(0, limit)
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
