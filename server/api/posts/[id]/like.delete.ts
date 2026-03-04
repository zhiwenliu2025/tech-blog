import { serverSupabaseClient } from '#supabase/server'
import { requireAuth } from '~/server/utils/auth'
import { cacheInvalidator } from '~/server/utils/cache'

/**
 * 取消点赞
 * DELETE /api/posts/:id/like
 */
export default defineEventHandler(async event => {
  const postId = getRouterParam(event, 'id')
  if (!postId) throw createError({ statusCode: 400, message: 'Missing post ID' })

  const user = await requireAuth(event)

  try {
    const client = await serverSupabaseClient(event)

    const { error } = await client
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)

    if (error) throw error

    cacheInvalidator.invalidatePost(postId)

    return { success: true, message: 'Unliked' }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to unlike post' })
  }
})
