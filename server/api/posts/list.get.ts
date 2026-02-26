import { serverSupabaseClient } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 获取文章列表（带缓存）
 * GET /api/posts/list?page=1&limit=10&category=tech&tag=vue&published=true
 *
 * 安全性改进：使用 serverSupabaseClient 而不是 serverSupabaseServiceRole
 */
export default defineEventHandler(async event => {
  const query = getQuery(event)
  const page = parseInt((query.page as string) || '1')
  const limit = parseInt((query.limit as string) || '10')
  const category = query.category as string
  const tag = query.tag as string
  const published = query.published !== 'false'
  const authorId = query.authorId as string
  const sortBy = (query.sortBy as string) || 'created_at'
  const search = (query.search as string) || ''

  // 构建缓存键（搜索结果不缓存，避免命中过多不同关键词）
  const cacheKey = search
    ? null
    : `${CACHE_KEYS.POSTS_LIST}${page}:${limit}:${category || 'all'}:${tag || 'all'}:${published}:${authorId || 'all'}:${sortBy}`

  const buildResult = async () => {
    const client = await serverSupabaseClient(event)

    let dbQuery = client.from('blog_posts').select(
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
        updated_at,
        category,
        tags,
        author_id
      `,
      { count: 'exact' }
    )

    // 过滤条件
    if (published) dbQuery = dbQuery.eq('published', true)
    if (category) dbQuery = dbQuery.eq('category', category)
    if (tag) dbQuery = dbQuery.contains('tags', [tag])
    if (authorId) dbQuery = dbQuery.eq('author_id', authorId)

    // 全文搜索（标题 + 摘要）
    if (search) {
      dbQuery = dbQuery.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    // 排序
    if (sortBy === 'updated_at') {
      dbQuery = dbQuery.order('updated_at', { ascending: false })
    } else if (sortBy === 'title') {
      dbQuery = dbQuery.order('title', { ascending: true })
    } else if (sortBy === 'view_count' || sortBy === 'hot') {
      // hot 作为别名保留向后兼容，二者均按阅读量降序
      dbQuery = dbQuery.order('view_count', { ascending: false })
    } else {
      // 默认：created_at / 最新发布
      dbQuery = dbQuery
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
    }

    const from = (page - 1) * limit
    const { data: posts, error, count } = await dbQuery.range(from, from + limit - 1)

    if (error) throw error

    const postIds = (posts || []).map((p: any) => p.id)
    const authorIds = [...new Set((posts || []).map((p: any) => p.author_id).filter(Boolean))]

    const [likesResult, commentsResult, authorsResult] = await Promise.all([
      client.from('likes').select('post_id').in('post_id', postIds),
      client.from('comments').select('post_id').in('post_id', postIds),
      authorIds.length > 0
        ? client
            .from('profiles')
            .select('id, username, full_name, avatar_url, bio')
            .in('id', authorIds)
        : Promise.resolve({ data: [], error: null })
    ])

    const likesCount: Record<string, number> = {}
    const commentsCount: Record<string, number> = {}
    const authorsMap: Record<string, any> = {}

    likesResult.data?.forEach((like: any) => {
      likesCount[like.post_id] = (likesCount[like.post_id] || 0) + 1
    })
    commentsResult.data?.forEach((comment: any) => {
      commentsCount[comment.post_id] = (commentsCount[comment.post_id] || 0) + 1
    })
    authorsResult.data?.forEach((author: any) => {
      authorsMap[author.id] = author
    })

    const postsWithStats = (posts || []).map((post: any) => ({
      ...post,
      likes_count: likesCount[post.id] || 0,
      comments_count: commentsCount[post.id] || 0,
      likeCount: likesCount[post.id] || 0,
      commentCount: commentsCount[post.id] || 0,
      profiles: post.author_id ? authorsMap[post.author_id] || null : null
    }))

    return {
      posts: postsWithStats,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }

  try {
    // 搜索请求不缓存（关键词变化太多）；其他请求使用服务端 LRU 缓存
    const result = cacheKey
      ? await serverCache.getOrSet(cacheKey, buildResult, CACHE_TTL.POSTS_LIST)
      : await buildResult()

    return {
      success: true,
      data: result,
      cached: cacheKey ? serverCache.has(cacheKey) : false
    }
  } catch (error: any) {
    console.error('Error fetching posts list:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch posts list'
    })
  }
})
