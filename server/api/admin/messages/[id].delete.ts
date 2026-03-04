import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '~/server/utils/auth'

/**
 * 管理员：删除联系消息
 * DELETE /api/admin/messages/:id
 */
export default defineEventHandler(async event => {
  await requireAdmin(event)

  const msgId = getRouterParam(event, 'id')
  if (!msgId) throw createError({ statusCode: 400, message: 'Missing message ID' })

  try {
    const adminClient = serverSupabaseServiceRole(event)

    const { error } = await adminClient.from('contact_messages').delete().eq('id', msgId)
    if (error) throw error

    return { success: true, message: 'Message deleted' }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to delete message' })
  }
})
