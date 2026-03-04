import { serverSupabaseClient } from '#supabase/server'

/**
 * 获取文章评论列表（含用户信息）
 * GET /api/posts/:id/comments
 */
export default defineEventHandler(async event => {
  const postId = getRouterParam(event, 'id')
  if (!postId) throw createError({ statusCode: 400, message: 'Missing post ID' })

  try {
    const client = await serverSupabaseClient(event)

    const { data: comments, error } = await client
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })

    if (error) throw error

    const rows = (comments || []) as any[]

    if (rows.length === 0) {
      return { success: true, data: [] }
    }

    // 批量获取用户信息
    const userIds = [...new Set(rows.map(c => c.user_id).filter(Boolean))]
    let profilesMap = new Map<string, any>()

    if (userIds.length > 0) {
      const { data: profiles } = await client
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds)

      profiles?.forEach((p: any) => profilesMap.set(p.id, p))
    }

    const data = rows.map(c => ({
      ...c,
      profiles: profilesMap.get(c.user_id) || null
    }))

    return { success: true, data }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to fetch comments' })
  }
})
