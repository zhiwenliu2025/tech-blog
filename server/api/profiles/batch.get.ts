import { serverSupabaseClient } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 批量获取用户资料（带智能缓存）
 * GET /api/profiles/batch?ids=id1,id2,id3
 *
 * 安全性改进：使用 serverSupabaseClient 而不是 serverSupabaseServiceRole
 */
export default defineEventHandler(async event => {
  const query = getQuery(event)
  const idsParam = query.ids as string

  if (!idsParam) {
    return {
      success: true,
      data: [],
      cached: 0,
      fresh: 0
    }
  }

  const ids = idsParam.split(',').filter(id => id && id !== 'undefined' && id !== 'null')

  if (ids.length === 0) {
    return {
      success: true,
      data: [],
      cached: 0,
      fresh: 0
    }
  }

  try {
    const client = await serverSupabaseClient(event)

    // 1. 检查缓存中已有的用户
    const cachedProfiles: any[] = []
    const uncachedIds: string[] = []

    ids.forEach(id => {
      const cacheKey = `${CACHE_KEYS.PROFILE}${id}`
      const cached = serverCache.get(cacheKey)
      if (cached) {
        cachedProfiles.push(cached)
      } else {
        uncachedIds.push(id)
      }
    })

    // 2. 批量查询缓存中没有的用户
    let freshProfiles: any[] = []
    if (uncachedIds.length > 0) {
      const { data, error } = await client
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio, website')
        .in('id', uncachedIds)

      if (error) throw error

      freshProfiles = data || []

      // 3. 将新查询的用户写入缓存
      freshProfiles.forEach(profile => {
        const cacheKey = `${CACHE_KEYS.PROFILE}${profile.id}`
        serverCache.set(cacheKey, profile, CACHE_TTL.PROFILE)
      })
    }

    // 4. 合并结果
    const allProfiles = [...cachedProfiles, ...freshProfiles]

    return {
      success: true,
      data: allProfiles,
      cached: cachedProfiles.length,
      fresh: freshProfiles.length,
      total: allProfiles.length
    }
  } catch (error: any) {
    console.error('Error fetching batch profiles:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch profiles'
    })
  }
})
