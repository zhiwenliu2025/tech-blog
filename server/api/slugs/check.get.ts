import { serverSupabaseClient } from '#supabase/server'

/**
 * 检查 slug 是否可用
 * GET /api/slugs/check?slug=my-slug&excludeId=postId
 * excludeId: 编辑时排除自身
 */
export default defineEventHandler(async event => {
  const query = getQuery(event)
  const slug = ((query.slug as string) || '').trim()
  const excludeId = query.excludeId as string | undefined

  if (!slug) {
    throw createError({ statusCode: 400, message: 'slug is required' })
  }

  try {
    const client = await serverSupabaseClient(event)

    let dbQuery = client.from('blog_posts').select('id').eq('slug', slug)

    if (excludeId) {
      dbQuery = (dbQuery as any).neq('id', excludeId)
    }

    const { data, error } = await dbQuery.maybeSingle()

    if (error) throw error

    return {
      success: true,
      data: { available: data === null }
    }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to check slug' })
  }
})
