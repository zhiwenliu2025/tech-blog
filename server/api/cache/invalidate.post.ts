import { cacheInvalidator } from '~/server/utils/cache'

/**
 * 清除缓存的 API 端点（管理员使用）
 * POST /api/cache/invalidate
 */
export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { type, postId } = body

  try {
    // 可以在这里添加管理员权限验证
    // const user = await serverSupabaseUser(event)
    // if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

    switch (type) {
      case 'post':
        if (!postId) {
          throw createError({
            statusCode: 400,
            message: 'Missing postId'
          })
        }
        cacheInvalidator.invalidatePost(postId)
        break

      case 'like':
        if (!postId) {
          throw createError({
            statusCode: 400,
            message: 'Missing postId'
          })
        }
        cacheInvalidator.invalidateLike(postId)
        break

      case 'comment':
        if (!postId) {
          throw createError({
            statusCode: 400,
            message: 'Missing postId'
          })
        }
        cacheInvalidator.invalidateComment(postId)
        break

      case 'all':
        cacheInvalidator.invalidateAll()
        break

      default:
        throw createError({
          statusCode: 400,
          message: 'Invalid cache invalidation type'
        })
    }

    return {
      success: true,
      message: `Cache invalidated for type: ${type}`
    }
  } catch (error: any) {
    console.error('Error invalidating cache:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to invalidate cache'
    })
  }
})
