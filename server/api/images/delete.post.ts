import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAuth } from '~/server/utils/auth'

/**
 * 从 Storage 删除图片（需要登录）
 * POST /api/images/delete
 * Body: { paths: string[] }  — storage 文件路径（不含 bucket 前缀）
 *    或 { urls: string[] }   — 完整 public URL，自动提取路径
 */
export default defineEventHandler(async event => {
  await requireAuth(event)
  const body = await readBody(event)

  let filePaths: string[] = []

  if (Array.isArray(body?.paths)) {
    filePaths = body.paths.filter(Boolean)
  } else if (Array.isArray(body?.urls)) {
    for (const url of body.urls) {
      if (!url || !url.includes('supabase') || !url.includes('blog-images')) continue
      const parts = url.split('/blog-images/')
      if (parts.length === 2 && parts[1]) {
        filePaths.push(decodeURIComponent(parts[1]))
      }
    }
  }

  if (filePaths.length === 0) {
    return { success: true, message: 'No files to delete' }
  }

  try {
    const adminClient = serverSupabaseServiceRole(event)
    const { error } = await adminClient.storage.from('blog-images').remove(filePaths)

    if (error) throw error

    return { success: true, message: `Deleted ${filePaths.length} file(s)` }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to delete images' })
  }
})
