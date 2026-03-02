export const useHotPosts = () => {
  const supabase = useSupabaseClient()
  const hotPosts = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 计算文章热度分数
   * 公式：阅读量 × 0.3 + 点赞数 × 0.4 + 评论数 × 0.3
   */
  const calculateHotScore = (
    viewCount: number,
    likesCount: number,
    commentsCount: number
  ): number => {
    const viewWeight = 0.3
    const likeWeight = 0.4
    const commentWeight = 0.3

    return viewCount * viewWeight + likesCount * likeWeight + commentsCount * commentWeight
  }

  /**
   * 计算时间衰减因子
   * - 7天内: 100% 权重
   * - 30天内: 80% 权重
   * - 90天内: 50% 权重
   * - 90天后: 30% 权重
   */
  const calculateDecayFactor = (publishedAt: string): number => {
    const now = new Date()
    const published = new Date(publishedAt)
    const daysSincePublished = (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSincePublished <= 7) {
      return 1.0 // 一周内，满权重
    } else if (daysSincePublished <= 30) {
      return 0.8 // 一月内，80% 权重
    } else if (daysSincePublished <= 90) {
      return 0.5 // 三月内，50% 权重
    } else {
      return 0.3 // 三月后，30% 权重
    }
  }

  /**
   * 计算带时间衰减的热度分数（目前主要用于参考，核心排序已下推到 SQL）
   */
  const calculateHotScoreWithDecay = (
    viewCount: number,
    likesCount: number,
    commentsCount: number,
    publishedAt: string
  ) => {
    const baseScore = calculateHotScore(viewCount, likesCount, commentsCount)
    const decayFactor = calculateDecayFactor(publishedAt)
    return baseScore * decayFactor
  }

  /**
   * 获取热门文章（实时计算）
   * @param limit - 返回的文章数量，默认 5
   * @param days - 查询最近多少天的文章，默认 30 天
   * @param useDecay - 是否使用时间衰减，默认 true
   */
  const fetchHotPosts = async (limit = 5, days = 30, useDecay = true) => {
    loading.value = true
    error.value = null

    try {
      // 调用服务端 API（内部通过 Supabase RPC 计算热门文章并带缓存）
      const response = await $fetch<{
        success: boolean
        data: any[]
      }>('/api/posts/hot', {
        params: {
          limit,
          days
        }
      })

      if (!response.success || !response.data || response.data.length === 0) {
        hotPosts.value = []
        return []
      }

      // API 已经按热度排序并限制数量，这里直接使用
      hotPosts.value = response.data
      return hotPosts.value
    } catch (err: any) {
      console.error('Error fetching hot posts:', err)
      error.value = err.message
      hotPosts.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取所有文章并按热度排序（用于文章列表页）
   * @param page - 页码
   * @param pageSize - 每页数量
   * @param useDecay - 是否使用时间衰减
   */
  const fetchPostsSortedByHot = async (page = 1, pageSize = 10, useDecay = true) => {
    loading.value = true
    error.value = null

    try {
      const start = (page - 1) * pageSize
      const offset = start

      // 使用 RPC 在数据库中按热度排序并分页
      const { data, error: dbError } = await (supabase as any).rpc('get_hot_posts', {
        p_days: 365, // 列表页默认看过去一年的文章
        p_limit: pageSize,
        p_offset: offset,
        p_use_decay: useDecay
      })

      if (dbError) throw dbError

      const posts = (data || []) as any[]

      // 单独获取总数（已发布文章总数）
      const { count, error: countError } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true)

      if (countError) throw countError

      return {
        data: posts,
        count: count || 0
      }
    } catch (err: any) {
      console.error('Error fetching posts sorted by hot:', err)
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
