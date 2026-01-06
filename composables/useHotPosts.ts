import type { Database } from '~/types/database.types'

type BlogPostRow = Database['public']['Tables']['blog_posts']['Row']

interface BlogPostWithHotScore extends BlogPostRow {
  hot_score: number
  hot_score_with_decay?: number
}

export const useHotPosts = () => {
  const supabase = useSupabaseClient<Database>()
  const hotPosts = ref<BlogPostWithHotScore[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 计算文章热度分数
   * 公式：阅读量 × 0.3 + 点赞数 × 0.4 + 评论数 × 0.3
   */
  const calculateHotScore = (post: BlogPostRow): number => {
    const viewWeight = 0.3
    const likeWeight = 0.4
    const commentWeight = 0.3

    const viewCount = post.view_count || 0
    const likesCount = post.likes_count || 0
    const commentsCount = post.comments_count || 0

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
   * 计算带时间衰减的热度分数
   */
  const calculateHotScoreWithDecay = (post: BlogPostRow): number => {
    const baseScore = calculateHotScore(post)
    const decayFactor = calculateDecayFactor(post.published_at || post.created_at)
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
      // 计算时间范围
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // 查询已发布的文章（最近 N 天）
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .gte('published_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      if (dbError) throw dbError

      if (!data || data.length === 0) {
        hotPosts.value = []
        return []
      }

      // 客户端计算热度分数
      const postsWithScore: BlogPostWithHotScore[] = data.map(post => {
        const hot_score = calculateHotScore(post)
        const hot_score_with_decay = useDecay ? calculateHotScoreWithDecay(post) : hot_score

        return {
          ...post,
          hot_score,
          hot_score_with_decay
        }
      })

      // 按热度分数排序（使用衰减分数或基础分数）
      const sortedPosts = postsWithScore.sort((a, b) => {
        const scoreA = useDecay ? a.hot_score_with_decay || 0 : a.hot_score
        const scoreB = useDecay ? b.hot_score_with_decay || 0 : b.hot_score
        return scoreB - scoreA
      })

      // 限制返回数量
      hotPosts.value = sortedPosts.slice(0, limit)
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
      // 查询所有已发布的文章
      const {
        data,
        error: dbError,
        count
      } = await supabase.from('blog_posts').select('*', { count: 'exact' }).eq('published', true)

      if (dbError) throw dbError

      if (!data || data.length === 0) {
        return { data: [], count: 0 }
      }

      // 客户端计算热度分数并排序
      const postsWithScore: BlogPostWithHotScore[] = data.map(post => {
        const hot_score = calculateHotScore(post)
        const hot_score_with_decay = useDecay ? calculateHotScoreWithDecay(post) : hot_score

        return {
          ...post,
          hot_score,
          hot_score_with_decay
        }
      })

      const sortedPosts = postsWithScore.sort((a, b) => {
        const scoreA = useDecay ? a.hot_score_with_decay || 0 : a.hot_score
        const scoreB = useDecay ? b.hot_score_with_decay || 0 : b.hot_score
        return scoreB - scoreA
      })

      // 分页
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedPosts = sortedPosts.slice(start, end)

      return {
        data: paginatedPosts,
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
