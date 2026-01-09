import { serverSupabaseClient } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 获取单个用户资料（带缓存）
 * GET /api/profiles/[id]
 *
 * 安全性改进：使用 serverSupabaseClient 而不是 serverSupabaseServiceRole
 */
export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id || id === 'undefined' || id === 'null') {
    throw createError({
      statusCode: 400,
      message: 'Invalid profile ID'
    })
  }

  const cacheKey = `${CACHE_KEYS.PROFILE}${id}`

  try {
    const profile = await serverCache.getOrSet(
      cacheKey,
      async () => {
        const client = await serverSupabaseClient(event)

        const { data, error } = await client
          .from('profiles')
          .select('id, username, full_name, avatar_url, bio, website, created_at')
          .eq('id', id)
          .single()

        if (error) throw error

        return data
      },
      CACHE_TTL.PROFILE
    )

    return {
      success: true,
      data: profile,
      cached: serverCache.has(cacheKey)
    }
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }
})
