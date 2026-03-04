import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

/**
 * 检查当前用户是否已点赞
 * GET /api/posts/:id/like
 */
export default defineEventHandler(async event => {
  const postId = getRouterParam(event, 'id')
  if (!postId) throw createError({ statusCode: 400, message: 'Missing post ID' })

  const user = await serverSupabaseUser(event)
  if (!user) {
    return { success: true, data: { liked: false } }
  }

  try {
    const client = await serverSupabaseClient(event)
    const { data, error } = await client
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) throw error

    return { success: true, data: { liked: data !== null } }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to check like' })
  }
})
