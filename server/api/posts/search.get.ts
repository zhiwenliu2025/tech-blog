import { serverSupabaseClient } from '#supabase/server'

/**
 * 全文搜索文章（优先使用 RPC，降级到 ilike）
 * GET /api/posts/search?q=keyword&limit=20&offset=0&category=...&tag=...
 */
export default defineEventHandler(async event => {
  const query = getQuery(event)
  const q = ((query.q as string) || '').trim()
  const limit = parseInt((query.limit as string) || '20')
  const offset = parseInt((query.offset as string) || '0')
  const category = query.category as string | undefined
  const tag = query.tag as string | undefined

  if (!q) {
    return { success: true, data: [], count: 0 }
  }

  try {
    const client = await serverSupabaseClient(event)

    // 尝试使用 RPC 全文搜索
    const { data: rpcResults, error: rpcError } = await (client.rpc as any)('search_blog_posts', {
      search_query: q,
      result_limit: limit,
      result_offset: offset
    })

    if (!rpcError && rpcResults) {
      let results = rpcResults as any[]

      if (category) results = results.filter((p: any) => p.category === category)
      if (tag) results = results.filter((p: any) => p.tags && p.tags.includes(tag))

      if (results.length > 0) {
        const postIds = results.map((p: any) => p.id)
        const [likesRes, commentsRes] = await Promise.all([
          client.from('likes').select('post_id').in('post_id', postIds),
          client.from('comments').select('post_id').in('post_id', postIds)
        ])

        const likesMap: Record<string, number> = {}
        const commentsMap: Record<string, number> = {}
        likesRes.data?.forEach((r: any) => {
          likesMap[r.post_id] = (likesMap[r.post_id] || 0) + 1
        })
        commentsRes.data?.forEach((r: any) => {
          commentsMap[r.post_id] = (commentsMap[r.post_id] || 0) + 1
        })

        results.forEach((p: any) => {
          p.likes_count = likesMap[p.id] || 0
          p.comments_count = commentsMap[p.id] || 0
        })
      }

      return { success: true, data: results, count: results.length }
    }

    // 降级：ilike 搜索
    let dbQuery = client
      .from('blog_posts')
      .select('*, likes(post_id), comments(post_id)', { count: 'exact' })
      .eq('published', true)
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) dbQuery = dbQuery.eq('category', category)
    if (tag) dbQuery = dbQuery.contains('tags', [tag])

    const { data, error, count } = await dbQuery
    if (error) throw error

    const posts = (data || []).map((p: any) => ({
      ...p,
      likes_count: p.likes?.length || 0,
      comments_count: p.comments?.length || 0
    }))

    return { success: true, data: posts, count: count || 0 }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Search failed'
    })
  }
})
