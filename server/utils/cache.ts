import { LRUCache } from 'lru-cache'

/**
 * 服务端 LRU 缓存配置
 * 用于缓存频繁访问的数据，减少数据库查询压力
 */

// 缓存键前缀
export const CACHE_KEYS = {
  POST_STATS: 'post:stats:',
  POST_LIKES: 'post:likes:',
  POST_COMMENTS: 'post:comments:',
  HOT_POSTS: 'hot:posts',
  POSTS_LIST: 'posts:list:',
  POST_DETAIL: 'post:detail:',
  CATEGORY_POSTS: 'category:posts:',
  TAG_POSTS: 'tag:posts:',
  AUTHOR_POSTS: 'author:posts:'
} as const

// 缓存过期时间（毫秒）
export const CACHE_TTL = {
  POST_STATS: 1000 * 60, // 1 分钟
  HOT_POSTS: 1000 * 60 * 5, // 5 分钟
  POSTS_LIST: 1000 * 60 * 2, // 2 分钟
  POST_DETAIL: 1000 * 60 * 5, // 5 分钟
  SHORT: 1000 * 60, // 1 分钟
  MEDIUM: 1000 * 60 * 5, // 5 分钟
  LONG: 1000 * 60 * 15 // 15 分钟
} as const

/**
 * LRU 缓存实例
 * - max: 最多缓存 1000 个条目
 * - ttl: 默认 5 分钟过期
 * - allowStale: 不允许返回过期数据
 * - updateAgeOnGet: 访问时更新过期时间
 */
const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: CACHE_TTL.MEDIUM,
  allowStale: false,
  updateAgeOnGet: true,
  updateAgeOnHas: false
})

/**
 * 服务端缓存工具
 */
export const serverCache = {
  /**
   * 获取缓存值
   */
  get: <T = any>(key: string): T | undefined => {
    return cache.get(key)
  },

  /**
   * 设置缓存值
   * @param key 缓存键
   * @param value 缓存值
   * @param ttl 过期时间（毫秒），可选
   */
  set: (key: string, value: any, ttl?: number) => {
    cache.set(key, value, { ttl })
  },

  /**
   * 删除缓存
   */
  delete: (key: string) => {
    cache.delete(key)
  },

  /**
   * 清空所有缓存
   */
  clear: () => {
    cache.clear()
  },

  /**
   * 检查缓存是否存在
   */
  has: (key: string): boolean => {
    return cache.has(key)
  },

  /**
   * 获取缓存大小
   */
  size: (): number => {
    return cache.size
  },

  /**
   * 批量删除缓存（支持前缀匹配）
   * @param prefix 缓存键前缀
   */
  deleteByPrefix: (prefix: string) => {
    const keys = Array.from(cache.keys())
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        cache.delete(key)
      }
    })
  },

  /**
   * 获取或设置缓存（如果不存在则执行 factory 函数）
   * @param key 缓存键
   * @param factory 数据获取函数
   * @param ttl 过期时间（毫秒），可选
   */
  getOrSet: async <T = any>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> => {
    const cached = cache.get(key)
    if (cached !== undefined) {
      return cached
    }

    const value = await factory()
    cache.set(key, value, { ttl })
    return value
  }
}

/**
 * 缓存失效助手
 * 用于在数据更新时清除相关缓存
 */
export const cacheInvalidator = {
  /**
   * 文章创建/更新时失效相关缓存
   */
  invalidatePost: (postId: string) => {
    // 清除文章详情缓存
    serverCache.delete(`${CACHE_KEYS.POST_DETAIL}${postId}`)
    // 清除文章统计缓存
    serverCache.delete(`${CACHE_KEYS.POST_STATS}${postId}`)
    // 清除热门文章缓存
    serverCache.delete(CACHE_KEYS.HOT_POSTS)
    // 清除文章列表缓存
    serverCache.deleteByPrefix(CACHE_KEYS.POSTS_LIST)
  },

  /**
   * 点赞/取消点赞时失效缓存
   */
  invalidateLike: (postId: string) => {
    serverCache.delete(`${CACHE_KEYS.POST_STATS}${postId}`)
    serverCache.delete(CACHE_KEYS.HOT_POSTS)
  },

  /**
   * 评论创建/删除时失效缓存
   */
  invalidateComment: (postId: string) => {
    serverCache.delete(`${CACHE_KEYS.POST_STATS}${postId}`)
    serverCache.delete(CACHE_KEYS.HOT_POSTS)
  },

  /**
   * 文章删除时失效所有相关缓存
   */
  invalidateAll: () => {
    serverCache.clear()
  }
}

/**
 * 缓存统计信息
 */
export const getCacheStats = () => {
  return {
    size: cache.size,
    maxSize: cache.max,
    calculatedSize: cache.calculatedSize
  }
}
