import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdmin } from '~/server/utils/auth'

/**
 * 管理员：获取所有文章（含草稿）
 * GET /api/admin/posts?page=1&limit=50
 */
export default defineEventHandler(async event => {
  await requireAdmin(event)

  const query = getQuery(event)
  const page = parseInt((query.page as string) || '1')
  const limit = parseInt((query.limit as string) || '50')
  const from = (page - 1) * limit

  try {
    const adminClient = serverSupabaseServiceRole(event)

    const { data, error, count } = await adminClient
      .from('blog_posts')
      .select(
        'id, title, slug, published, category, tags, author_id, created_at, updated_at, published_at, view_count',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1)

    if (error) throw error

    return {
      success: true,
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to fetch admin posts' })
  }
})
