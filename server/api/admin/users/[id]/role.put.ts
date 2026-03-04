import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '~/server/utils/auth'
import { serverCache, CACHE_KEYS } from '~/server/utils/cache'

/**
 * 管理员：切换用户管理员权限
 * PUT /api/admin/users/:id/role
 * Body: { is_admin: boolean }
 */
export default defineEventHandler(async event => {
  await requireAdmin(event)

  const userId = getRouterParam(event, 'id')
  if (!userId) throw createError({ statusCode: 400, message: 'Missing user ID' })

  const body = await readBody(event)
  const isAdmin = Boolean(body?.is_admin)

  try {
    const adminClient = serverSupabaseServiceRole(event)

    const { data, error } = await adminClient
      .from('profiles')
      .update({ is_admin: isAdmin })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    serverCache.delete(`${CACHE_KEYS.PROFILE}${userId}`)
    serverCache.delete(`${CACHE_KEYS.PROFILES_LIST}all`)

    return { success: true, data }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to update role' })
  }
})
