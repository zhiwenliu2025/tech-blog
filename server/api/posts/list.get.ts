import { serverSupabaseServiceRole } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 获取文章列表（带缓存）
 * GET /api/posts/list?page=1&limit=10&category=tech&tag=vue&published=true
 */
export default defineEventHandler(async event => {
  const query = getQuery(event)
  const page = parseInt((query.page as string) || '1')
  const limit = parseInt((query.limit as string) || '10')
  const category = query.category as string
  const tag = query.tag as string
  const published = query.published !== 'false'
  const authorId = query.authorId as string

  // 构建缓存键
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}${page}:${limit}:${category || 'all'}:${tag || 'all'}:${published}:${authorId || 'all'}`

  try {
    const result = await serverCache.getOrSet(
      cacheKey,
      async () => {
        const client = serverSupabaseServiceRole(event)

        // 构建查询
        let query = client.from('blog_posts').select(
          `
            id,
            title,
            slug,
            excerpt,
            cover_image,
            view_count,
            published,
            published_at,
            created_at,
            category,
            tags,
            author_id
          `,
          { count: 'exact' }
        )

        // 添加过滤条件
        if (published) {
          query = query.eq('published', true)
        }

        if (category) {
          query = query.eq('category', category)
        }

        if (tag) {
          query = query.contains('tags', [tag])
        }

        if (authorId) {
          query = query.eq('author_id', authorId)
        }

        // 分页和排序
        const from = (page - 1) * limit
        const to = from + limit - 1

        const {
          data: posts,
          error,
          count
        } = await query
          .order('published_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .range(from, to)

        if (error) throw error

        // 获取每篇文章的点赞数和评论数（批量查询）
        const postIds = (posts || []).map((p: any) => p.id)

        const [likesResult, commentsResult] = await Promise.all([
          client.from('likes').select('post_id').in('post_id', postIds),
          client.from('comments').select('post_id').in('post_id', postIds)
        ])

        // 统计每篇文章的点赞数和评论数
        const likesCount: Record<string, number> = {}
        const commentsCount: Record<string, number> = {}

        likesResult.data?.forEach((like: any) => {
          likesCount[like.post_id] = (likesCount[like.post_id] || 0) + 1
        })

        commentsResult.data?.forEach((comment: any) => {
          commentsCount[comment.post_id] = (commentsCount[comment.post_id] || 0) + 1
        })

        // 添加统计信息到文章
        const postsWithStats = (posts || []).map((post: any) => ({
          ...post,
          likes_count: likesCount[post.id] || 0,
          comments_count: commentsCount[post.id] || 0,
          likeCount: likesCount[post.id] || 0,
          commentCount: commentsCount[post.id] || 0
        }))

        return {
          posts: postsWithStats,
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      },
      CACHE_TTL.POSTS_LIST
    )

    return {
      success: true,
      data: result,
      cached: serverCache.has(cacheKey)
    }
  } catch (error: any) {
    console.error('Error fetching posts list:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch posts list'
    })
  }
})
