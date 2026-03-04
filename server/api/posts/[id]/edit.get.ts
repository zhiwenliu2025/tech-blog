import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { isAdminUser } from '~/server/utils/auth'

/**
 * 获取文章详情用于编辑（含草稿，限作者或管理员）
 * GET /api/posts/:id/edit
 */
export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing post ID' })
  }

  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const userId = user.id || (user as any).sub

  try {
    const client = await serverSupabaseClient(event)

    const { data, error } = await client.from('blog_posts').select('*').eq('id', id).single()

    if (error) throw error
    if (!data) throw createError({ statusCode: 404, message: 'Post not found' })

    const post = data as any

    // 只有作者或管理员可以访问草稿
    const admin = await isAdminUser(event)
    if (post.author_id !== userId && !admin) {
      throw createError({ statusCode: 403, message: 'Forbidden' })
    }

    return { success: true, data: post }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: error.code === 'PGRST116' ? 404 : 500,
      message: error.message || 'Failed to fetch post'
    })
  }
})
