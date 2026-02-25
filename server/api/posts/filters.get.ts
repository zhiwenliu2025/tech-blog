import { serverSupabaseClient } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 获取文章筛选数据（分类和标签列表，带缓存）
 * GET /api/posts/filters
 */
export default defineEventHandler(async event => {
  const cacheKey = CACHE_KEYS.POST_FILTERS

  try {
    const result = await serverCache.getOrSet(
      cacheKey,
      async () => {
        const client = await serverSupabaseClient(event)

        const [categoriesResult, tagsResult] = await Promise.all([
          client.from('blog_posts').select('category').eq('published', true),
          client.from('blog_posts').select('tags').eq('published', true)
        ])

        if (categoriesResult.error) throw categoriesResult.error
        if (tagsResult.error) throw tagsResult.error

        const categories = [
          ...new Set(
            (categoriesResult.data || []).map((p: any) => p.category).filter(Boolean) as string[]
          )
        ].sort()

        const tags = [
          ...new Set((tagsResult.data || []).flatMap((p: any) => p.tags || []) as string[])
        ].sort()

        return { categories, tags }
      },
      CACHE_TTL.POST_FILTERS
    )

    return {
      success: true,
      data: result
    }
  } catch (error: any) {
    console.error('Error fetching post filters:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch post filters'
    })
  }
})
