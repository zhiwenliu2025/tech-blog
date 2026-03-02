import type { Database } from '~/types/database.types'
import { serverSupabaseClient } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 获取文章统计信息（带缓存）
 * GET /api/posts/stats?postIds=id1,id2,id3
 *
 * 安全性改进：使用 serverSupabaseClient 而不是 serverSupabaseServiceRole
 */
export default defineEventHandler(async event => {
  const query = getQuery(event)
  const postIds = query.postIds as string

  if (!postIds) {
    throw createError({
      statusCode: 400,
      message: 'Missing postIds parameter'
    })
  }

  const ids = postIds.split(',').filter(Boolean)

  try {
    const client = await serverSupabaseClient<Database>(event)

    // 先从缓存中取出已有的数据，剩余的通过 RPC 一次性获取
    const results: {
      postId: string
      likeCount: number
      commentCount: number
      viewCount: number
      fromCache: boolean
    }[] = []

    const idsToFetch: string[] = []

    for (const postId of ids) {
      const cacheKey = `${CACHE_KEYS.POST_STATS}${postId}`
      const cached = serverCache.get(cacheKey)
      if (cached) {
        results.push({
          postId,
          likeCount: cached.likeCount ?? 0,
          commentCount: cached.commentCount ?? 0,
          viewCount: cached.viewCount ?? 0,
          fromCache: true
        })
      } else {
        idsToFetch.push(postId)
      }
    }

    if (idsToFetch.length > 0) {
      // 使用 RPC 一次性获取剩余帖子统计信息（此处使用 any 以避免对未在类型定义中声明的函数报错）
      const { data, error } = await (client as any).rpc('get_post_stats', {
        post_ids: idsToFetch
      })

      if (error) {
        throw error
      }

      // 将 RPC 结果映射为与之前相同的结构，并写入缓存
      const statsById = new Map<
        string,
        { likeCount: number; commentCount: number; viewCount: number }
      >()

      for (const row of (data || []) as any[]) {
        const postId = row.post_id as string
        const likeCount = Number(row.like_count ?? 0)
        const commentCount = Number(row.comment_count ?? 0)
        const viewCount = Number(row.view_count ?? 0)

        const value = { likeCount, commentCount, viewCount }
        statsById.set(postId, value)

        const cacheKey = `${CACHE_KEYS.POST_STATS}${postId}`
        serverCache.set(cacheKey, value, CACHE_TTL.POST_STATS)
      }

      // 对于本次需要查询的 id，按照原始顺序补充结果（即使某些 id 在数据库中不存在，也要返回 0）
      for (const postId of idsToFetch) {
        const stat = statsById.get(postId) ?? {
          likeCount: 0,
          commentCount: 0,
          viewCount: 0
        }
        results.push({
          postId,
          ...stat,
          fromCache: false
        })
      }
    }

    return {
      success: true,
      data: results
    }
  } catch (error: any) {
    console.error('Error fetching post stats:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch post stats'
    })
  }
})
