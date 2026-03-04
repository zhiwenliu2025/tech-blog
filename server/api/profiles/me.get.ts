import { serverSupabaseClient } from '#supabase/server'
import { requireAuth } from '~/server/utils/auth'

/**
 * 获取当前用户的完整资料
 * GET /api/profiles/me
 */
export default defineEventHandler(async event => {
  const user = await requireAuth(event)
  const userId = user.id || (user as any).sub

  try {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to fetch profile' })
  }
})
