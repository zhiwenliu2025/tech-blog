export const useHotPosts = () => {
  const hotPosts = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const calculateHotScore = (
    viewCount: number,
    likesCount: number,
    commentsCount: number
  ): number => viewCount * 0.3 + likesCount * 0.4 + commentsCount * 0.3

  const calculateDecayFactor = (publishedAt: string): number => {
    const days = (Date.now() - new Date(publishedAt).getTime()) / 86400000
    if (days <= 7) return 1.0
    if (days <= 30) return 0.8
    if (days <= 90) return 0.5
    return 0.3
  }

  const calculateHotScoreWithDecay = (
    viewCount: number,
    likesCount: number,
    commentsCount: number,
    publishedAt: string
  ) => calculateHotScore(viewCount, likesCount, commentsCount) * calculateDecayFactor(publishedAt)

  /**
   * 获取热门文章（服务端 API，含缓存）
   */
  const fetchHotPosts = async (limit = 5, days = 30, _useDecay = true) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ success: boolean; data: any[] }>('/api/posts/hot', {
        params: { limit, days }
      })
      hotPosts.value = response.data || []
      return hotPosts.value
    } catch (err: any) {
      error.value = err.message
      hotPosts.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取按热度排序的分页文章列表（服务端 API）
   */
  const fetchPostsSortedByHot = async (page = 1, pageSize = 10, _useDecay = true) => {
    loading.value = true
    error.value = null
    try {
      const res: any = await $fetch('/api/posts/hot', {
        params: { limit: pageSize, offset: (page - 1) * pageSize, days: 365 }
      })
      const data = res.data || []

      // 获取总发布文章数
      const listRes: any = await $fetch('/api/posts/list', {
        params: { page: 1, limit: 1, published: true }
      })
      const count = listRes.data?.total || 0

      return { data, count }
    } catch (err: any) {
      error.value = err.message
      return { data: [], count: 0 }
    } finally {
      loading.value = false
    }
  }

  return {
    hotPosts,
    loading,
    error,
    fetchHotPosts,
    fetchPostsSortedByHot,
    calculateHotScore,
    calculateHotScoreWithDecay
  }
}
