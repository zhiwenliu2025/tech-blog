import { serverSupabaseClient } from '#supabase/server'
import { requireAuth } from '~/server/utils/auth'
import { cacheInvalidator } from '~/server/utils/cache'

/**
 * 点赞文章
 * POST /api/posts/:id/like
 */
export default defineEventHandler(async event => {
  const postId = getRouterParam(event, 'id')
  if (!postId) throw createError({ statusCode: 400, message: 'Missing post ID' })

  const user = await requireAuth(event)
  const userId = user.id || (user as any).sub

  try {
    const client = await serverSupabaseClient(event)

    const { data, error } = await (client.from('likes') as any)
      .insert({ post_id: postId, user_id: userId })
      .select()
      .single()

    if (error) throw error

    cacheInvalidator.invalidatePost(postId)

    return { success: true, data }
  } catch (error: any) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, message: '您已经点赞过这篇文章了' })
    }
    throw createError({ statusCode: 500, message: error.message || 'Failed to like post' })
  }
})
