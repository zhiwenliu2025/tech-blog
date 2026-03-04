import { serverSupabaseClient } from '#supabase/server'
import { requireAuth } from '~/server/utils/auth'
import { serverCache, CACHE_KEYS } from '~/server/utils/cache'

/**
 * 更新当前用户资料（upsert 支持首次创建）
 * PUT /api/profiles/me
 * Body: { username, full_name, bio, website, avatar_url }
 */
export default defineEventHandler(async event => {
  const user = await requireAuth(event)
  const userId = user.id || (user as any).sub
  const body = await readBody(event)

  const { username, full_name, bio, website, avatar_url } = body

  try {
    const client = await serverSupabaseClient(event)

    const upsertData: any = {
      id: userId,
      updated_at: new Date().toISOString()
    }
    if (username !== undefined) upsertData.username = username
    if (full_name !== undefined) upsertData.full_name = full_name
    if (bio !== undefined) upsertData.bio = bio
    if (website !== undefined) upsertData.website = website
    if (avatar_url !== undefined) upsertData.avatar_url = avatar_url

    const { data, error } = await (client.from('profiles') as any)
      .upsert(upsertData)
      .select()
      .single()

    if (error) throw error

    // 清除 profile 缓存
    serverCache.delete(`${CACHE_KEYS.PROFILE}${userId}`)
    serverCache.delete(`${CACHE_KEYS.PROFILES_LIST}all`)

    return { success: true, data }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to update profile' })
  }
})
