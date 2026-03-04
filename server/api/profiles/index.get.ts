import { serverSupabaseClient } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 获取所有用户资料列表（含发帖数）
 * GET /api/profiles
 */
export default defineEventHandler(async event => {
  const cacheKey = `${CACHE_KEYS.PROFILES_LIST}all`

  try {
    const data = await serverCache.getOrSet(
      cacheKey,
      async () => {
        const client = await serverSupabaseClient(event)

        const [profilesRes, postsRes] = await Promise.all([
          client
            .from('profiles')
            .select('id, username, full_name, avatar_url, bio, website, created_at')
            .order('created_at', { ascending: false }),
          client.from('blog_posts').select('author_id').eq('published', true)
        ])

        if (profilesRes.error) throw profilesRes.error

        const postCountMap: Record<string, number> = {}
        postsRes.data?.forEach((p: any) => {
          postCountMap[p.author_id] = (postCountMap[p.author_id] || 0) + 1
        })

        return (profilesRes.data || []).map((profile: any) => ({
          ...profile,
          post_count: postCountMap[profile.id] || 0
        }))
      },
      CACHE_TTL.PROFILES_LIST
    )

    return { success: true, data }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to fetch profiles' })
  }
})
