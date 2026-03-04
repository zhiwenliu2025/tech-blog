import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '~/server/utils/auth'

/**
 * 管理员：获取所有联系消息
 * GET /api/admin/messages
 */
export default defineEventHandler(async event => {
  await requireAdmin(event)

  try {
    const adminClient = serverSupabaseServiceRole(event)

    const { data, error } = await adminClient
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to fetch messages' })
  }
})
