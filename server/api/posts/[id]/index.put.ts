import { serverSupabaseClient } from '#supabase/server'
import { requireAuth, isAdminUser } from '~/server/utils/auth'
import { cacheInvalidator } from '~/server/utils/cache'

/**
 * 更新文章
 * PUT /api/posts/:id
 * Body: { title, slug, excerpt, content, cover_image, category, tags, published }
 */
export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing post ID' })

  const user = await requireAuth(event)
  const body = await readBody(event)

  try {
    const client = await serverSupabaseClient(event)

    // 获取旧文章信息（验证所有权 + 获取旧 slug / 发布状态）
    const { data: oldPost, error: fetchError } = await client
      .from('blog_posts')
      .select('slug, published, published_at, author_id')
      .eq('id', id)
      .single()

    if (fetchError || !oldPost) {
      throw createError({ statusCode: 404, message: 'Post not found' })
    }

    const admin = await isAdminUser(event)
    if ((oldPost as any).author_id !== user.id && !admin) {
      throw createError({ statusCode: 403, message: 'Forbidden' })
    }

    const { title, slug, excerpt, content, cover_image, category, tags, published } = body

    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (content !== undefined) updateData.content = content
    if (cover_image !== undefined) updateData.cover_image = cover_image
    if (category !== undefined) updateData.category = category
    if (tags !== undefined) updateData.tags = tags
    if (published !== undefined) {
      updateData.published = published
      // 首次发布时记录时间
      if (published && !(oldPost as any).published) {
        updateData.published_at = new Date().toISOString()
      }
    }

    const { data, error } = await (client.from('blog_posts') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // 清除相关缓存
    cacheInvalidator.invalidatePost(id)
    const oldSlug = (oldPost as any).slug
    if (oldSlug) cacheInvalidator.invalidatePost(oldSlug)

    return { success: true, data }
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.code === '23505') {
      throw createError({ statusCode: 409, message: 'Slug already exists' })
    }
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update post'
    })
  }
})
