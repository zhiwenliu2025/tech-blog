import { serverSupabaseClient } from '#supabase/server'
import { requireAuth } from '~/server/utils/auth'
import { cacheInvalidator } from '~/server/utils/cache'

/**
 * 创建新文章
 * POST /api/posts
 * Body: { title, slug, excerpt, content, cover_image, category, tags, published }
 */
export default defineEventHandler(async event => {
  const user = await requireAuth(event)
  const userId = user.id || (user as any).sub
  const body = await readBody(event)

  const { title, slug, excerpt, content, cover_image, category, tags, published } = body

  if (!title || !slug) {
    throw createError({ statusCode: 400, message: 'title and slug are required' })
  }

  try {
    const client = await serverSupabaseClient(event)

    const now = new Date().toISOString()
    const insertData: any = {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || '',
      cover_image: cover_image || null,
      category: category || null,
      tags: tags || [],
      published: published === true,
      author_id: userId,
      created_at: now,
      updated_at: now
    }

    if (published) {
      insertData.published_at = now
    }

    const { data, error } = await (client.from('blog_posts') as any)
      .insert(insertData)
      .select()
      .single()

    if (error) throw error

    cacheInvalidator.invalidateAll()

    return { success: true, data }
  } catch (error: any) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, message: 'Slug already exists' })
    }
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create post'
    })
  }
})
