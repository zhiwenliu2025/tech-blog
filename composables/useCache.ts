/**
 * 使用缓存的文章统计 composable
 */
export const usePostStats = () => {
  /**
   * 获取单个文章的统计信息（带缓存）
   * @param postId 文章 ID
   */
  const getStats = async (postId: string) => {
    try {
      const response = await $fetch(`/api/posts/${postId}/stats`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching post stats:', error)
      return {
        likeCount: 0,
        commentCount: 0,
        viewCount: 0
      }
    }
  }

  /**
   * 批量获取文章统计信息（带缓存）
   * @param postIds 文章 ID 数组
   */
  const getBatchStats = async (postIds: string[]) => {
    if (!postIds.length) return []

    try {
      const response = await $fetch('/api/posts/stats', {
        params: { postIds: postIds.join(',') }
      })
      return response.data
    } catch (error: any) {
      console.error('Error fetching batch post stats:', error)
      return []
    }
  }

  /**
   * 增加文章阅读量
   * @param postId 文章 ID
   */
  const incrementView = async (postId: string) => {
    try {
      await $fetch(`/api/posts/${postId}/increment-view`, {
        method: 'POST'
      })
    } catch (error: any) {
      console.error('Error incrementing view count:', error)
    }
  }

  return {
    getStats,
    getBatchStats,
    incrementView
  }
}

/**
 * 使用缓存的热门文章 composable
 */
export const useCachedHotPosts = () => {
  const posts = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取热门文章（带缓存）
   * @param limit 文章数量
   * @param days 统计天数
   */
  const fetchHotPosts = async (limit = 10, days = 30) => {
    loading.value = true
    error.value = null

    try {
      const response: any = await $fetch('/api/posts/hot', {
        params: { limit, days }
      })
      posts.value = response.data || []
      return response.data || []
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching hot posts:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    posts: readonly(posts),
    loading: readonly(loading),
    error: readonly(error),
    fetchHotPosts
  }
}

/**
 * 使用缓存的文章列表 composable
 */
export const useCachedPostsList = () => {
  const posts = ref<any[]>([])
  const total = ref(0)
  const totalPages = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取文章列表（带缓存）
   */
  const fetchPosts = async (
    options: {
      page?: number
      limit?: number
      category?: string
      tag?: string
      published?: boolean
      authorId?: string
    } = {}
  ) => {
    loading.value = true
    error.value = null

    try {
      const response: any = await $fetch('/api/posts/list', {
        params: {
          page: options.page || 1,
          limit: options.limit || 10,
          category: options.category,
          tag: options.tag,
          published: options.published !== false,
          authorId: options.authorId
        }
      })

      posts.value = response.data?.posts || []
      total.value = response.data?.total || 0
      totalPages.value = response.data?.totalPages || 0

      return response.data
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching posts list:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    posts: readonly(posts),
    total: readonly(total),
    totalPages: readonly(totalPages),
    loading: readonly(loading),
    error: readonly(error),
    fetchPosts
  }
}

/**
 * 缓存管理 composable
 */
export const useCacheManager = () => {
  /**
   * 清除指定文章的缓存
   */
  const invalidatePost = async (postId: string) => {
    try {
      await $fetch('/api/cache/invalidate', {
        method: 'POST',
        body: { type: 'post', postId }
      })
    } catch (error: any) {
      console.error('Error invalidating post cache:', error)
    }
  }

  /**
   * 清除点赞相关缓存
   */
  const invalidateLike = async (postId: string) => {
    try {
      await $fetch('/api/cache/invalidate', {
        method: 'POST',
        body: { type: 'like', postId }
      })
    } catch (error: any) {
      console.error('Error invalidating like cache:', error)
    }
  }

  /**
   * 清除评论相关缓存
   */
  const invalidateComment = async (postId: string) => {
    try {
      await $fetch('/api/cache/invalidate', {
        method: 'POST',
        body: { type: 'comment', postId }
      })
    } catch (error: any) {
      console.error('Error invalidating comment cache:', error)
    }
  }

  /**
   * 清除所有缓存
   */
  const invalidateAll = async () => {
    try {
      await $fetch('/api/cache/invalidate', {
        method: 'POST',
        body: { type: 'all' }
      })
    } catch (error: any) {
      console.error('Error invalidating all cache:', error)
    }
  }

  /**
   * 获取缓存统计信息
   */
  const getCacheStats = async () => {
    try {
      const response = await $fetch('/api/cache/stats')
      return response.data
    } catch (error: any) {
      console.error('Error getting cache stats:', error)
      return null
    }
  }

  return {
    invalidatePost,
    invalidateLike,
    invalidateComment,
    invalidateAll,
    getCacheStats
  }
}
