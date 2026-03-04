import { serverSupabaseClient } from '#supabase/server'
import { requireAuth, isAdminUser } from '~/server/utils/auth'
import { cacheInvalidator } from '~/server/utils/cache'

/**
 * 删除评论（作者或管理员）
 * DELETE /api/comments/:id
 */
export default defineEventHandler(async event => {
  const commentId = getRouterParam(event, 'id')
  if (!commentId) throw createError({ statusCode: 400, message: 'Missing comment ID' })

  const user = await requireAuth(event)

  try {
    const client = await serverSupabaseClient(event)

    // 获取评论信息验证所有权
    const { data: comment, error: fetchError } = await client
      .from('comments')
      .select('user_id, post_id')
      .eq('id', commentId)
      .single()

    if (fetchError || !comment) {
      throw createError({ statusCode: 404, message: 'Comment not found' })
    }

    const admin = await isAdminUser(event)
    if ((comment as any).user_id !== user.id && !admin) {
      throw createError({ statusCode: 403, message: 'Forbidden' })
    }

    const { error } = await client.from('comments').delete().eq('id', commentId)
    if (error) throw error

    cacheInvalidator.invalidatePost((comment as any).post_id)

    return { success: true, message: 'Comment deleted' }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, message: error.message || 'Failed to delete comment' })
  }
})
