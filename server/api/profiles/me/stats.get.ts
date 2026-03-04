import { serverSupabaseClient } from '#supabase/server'
import { requireAuth } from '~/server/utils/auth'

/**
 * 获取当前用户统计数据（文章数、评论数、点赞数）
 * GET /api/profiles/me/stats
 */
export default defineEventHandler(async event => {
  const user = await requireAuth(event)
  const userId = user.id || (user as any).sub

  try {
    const client = await serverSupabaseClient(event)

    const [postsRes, commentsRes, likesRes] = await Promise.all([
      client
        .from('blog_posts')
        .select('id', { count: 'exact', head: true })
        .eq('author_id', userId),
      client.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      client.from('likes').select('id', { count: 'exact', head: true }).eq('user_id', userId)
    ])

    return {
      success: true,
      data: {
        post_count: postsRes.count || 0,
        comment_count: commentsRes.count || 0,
        like_count: likesRes.count || 0
      }
    }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to fetch stats' })
  }
})
