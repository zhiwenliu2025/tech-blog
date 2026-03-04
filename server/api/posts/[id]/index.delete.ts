import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth, isAdminUser } from '~/server/utils/auth'
import { cacheInvalidator } from '~/server/utils/cache'

/**
 * 删除文章（同步清理 Storage 图片）
 * DELETE /api/posts/:id
 */
export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing post ID' })

  const user = await requireAuth(event)

  try {
    const client = await serverSupabaseClient(event)

    // 先获取文章信息
    const { data: post, error: fetchError } = await client
      .from('blog_posts')
      .select('slug, category, cover_image, content, author_id')
      .eq('id', id)
      .single()

    if (fetchError || !post) {
      throw createError({ statusCode: 404, message: 'Post not found' })
    }

    const admin = await isAdminUser(event)
    if ((post as any).author_id !== user.id && !admin) {
      throw createError({ statusCode: 403, message: 'Forbidden' })
    }

    // 删除文章
    const { error: deleteError } = await client.from('blog_posts').delete().eq('id', id)
    if (deleteError) throw deleteError

    // 收集并删除 Storage 图片（用 service_role 保证权限）
    const imagesToDelete: string[] = []
    const postData = post as any

    if (postData.cover_image) imagesToDelete.push(postData.cover_image)

    if (postData.content) {
      const mdRe = /!\[.*?\]\((.*?)\)/g
      const htmlRe = /<img[^>]+src=["']([^"']+)["']/g
      let m
      while ((m = mdRe.exec(postData.content)) !== null) if (m[1]) imagesToDelete.push(m[1])
      while ((m = htmlRe.exec(postData.content)) !== null) if (m[1]) imagesToDelete.push(m[1])
    }

    if (imagesToDelete.length > 0) {
      const filePaths: string[] = []
      for (const url of imagesToDelete) {
        if (!url.includes('supabase') || !url.includes('blog-images')) continue
        const parts = url.split('/blog-images/')
        if (parts.length === 2 && parts[1]) {
          filePaths.push(decodeURIComponent(parts[1]))
        }
      }
      if (filePaths.length > 0) {
        const adminClient = serverSupabaseServiceRole(event)
        await adminClient.storage.from('blog-images').remove(filePaths)
      }
    }

    // 清除缓存
    cacheInvalidator.invalidatePost(id)
    if (postData.slug) cacheInvalidator.invalidatePost(postData.slug)
    cacheInvalidator.invalidateAll()

    return { success: true, message: 'Post deleted' }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to delete post'
    })
  }
})
