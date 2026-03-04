import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '~/server/utils/auth'

/**
 * 管理员：标记消息为已读
 * PUT /api/admin/messages/:id
 * Body: { read: boolean }
 */
export default defineEventHandler(async event => {
  await requireAdmin(event)

  const msgId = getRouterParam(event, 'id')
  if (!msgId) throw createError({ statusCode: 400, message: 'Missing message ID' })

  const body = await readBody(event)

  try {
    const adminClient = serverSupabaseServiceRole(event)

    const { data, error } = await adminClient
      .from('contact_messages')
      .update({ read: body?.read !== false })
      .eq('id', msgId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to update message' })
  }
})
