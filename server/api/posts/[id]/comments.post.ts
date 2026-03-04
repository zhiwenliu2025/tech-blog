import { serverSupabaseClient } from '#supabase/server'
import { requireAuth } from '~/server/utils/auth'
import { cacheInvalidator } from '~/server/utils/cache'

/**
 * 发布评论
 * POST /api/posts/:id/comments
 * Body: { content }
 */
export default defineEventHandler(async event => {
  const postId = getRouterParam(event, 'id')
  if (!postId) throw createError({ statusCode: 400, message: 'Missing post ID' })

  const user = await requireAuth(event)
  const body = await readBody(event)
  const content = (body?.content || '').trim()

  if (!content) {
    throw createError({ statusCode: 400, message: 'Comment content is required' })
  }

  try {
    const client = await serverSupabaseClient(event)

    const userId = user.id || (user as any).sub

    const { data, error } = await (client.from('comments') as any)
      .insert({ post_id: postId, user_id: userId, content })
      .select()
      .single()

    if (error) throw error

    cacheInvalidator.invalidatePost(postId)

    return { success: true, data }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to add comment' })
  }
})
