import { serverSupabaseClient } from '#supabase/server'
import { serverCache, CACHE_KEYS, CACHE_TTL } from '~/server/utils/cache'

/**
 * 通过 slug 获取文章详情（含作者信息、点赞数、评论数）
 * GET /api/posts/:slug
 */
export default defineEventHandler(async event => {
  const rawSlug = getRouterParam(event, 'slug')

  if (!rawSlug) {
    throw createError({ statusCode: 400, message: 'Missing slug' })
  }

  // h3 does not auto-decode URL params, so we must decode manually
  const slug = decodeURIComponent(rawSlug)

  const cacheKey = `${CACHE_KEYS.POST_DETAIL}${slug}`

  try {
    const post = await serverCache.getOrSet(
      cacheKey,
      async () => {
        const client = await serverSupabaseClient(event)

        const { data, error } = await client
          .from('blog_posts')
          .select(
            `
            *,
            likes(post_id),
            comments(post_id)
          `
          )
          .eq('slug', slug)
          .eq('published', true)
          .single()

        if (error) throw error

        const post = data as any
        post.likes_count = post.likes?.length || 0
        post.comments_count = post.comments?.length || 0

        // 获取作者信息
        if (post.author_id) {
          const { data: author } = await client
            .from('profiles')
            .select('id, username, full_name, avatar_url, bio, website')
            .eq('id', post.author_id)
            .single()
          post.profiles = author || null
        } else {
          post.profiles = null
        }

        return post
      },
      CACHE_TTL.POST_DETAIL
    )

    return { success: true, data: post }
  } catch (error: any) {
    throw createError({
      statusCode: error.code === 'PGRST116' ? 404 : 500,
      message: error.message || 'Post not found'
    })
  }
})
