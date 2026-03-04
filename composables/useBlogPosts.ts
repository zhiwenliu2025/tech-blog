/**
 * Blog posts composable — 所有数据操作均通过服务端 API，不直接访问 Supabase
 */
export const useBlogPosts = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const posts = ref<any[]>([])
  const categories = ref<string[]>([])
  const tags = ref<string[]>([])

  // ─── 获取文章列表 ───────────────────────────────────────────────────────────

  const getPosts = async (publishedOnly = true, limit = 10, offset = 0) => {
    loading.value = true
    error.value = null
    try {
      const page = Math.floor(offset / limit) + 1
      const res: any = await $fetch('/api/posts/list', {
        params: { page, limit, published: publishedOnly }
      })
      return { data: res.data?.posts || [], error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getPublishedPosts = (limit = 10, offset = 0) => getPosts(true, limit, offset)

  const fetchPosts = async ({
    page = 1,
    pageSize = 10,
    category = null as string | null,
    tag = null as string | null
  }) => {
    loading.value = true
    error.value = null
    try {
      const res: any = await $fetch('/api/posts/list', {
        params: { page, limit: pageSize, category, tag, published: true }
      })
      posts.value = res.data?.posts || []
      return posts.value
    } catch (err: any) {
      error.value = err.message
      posts.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // ─── 通过 slug 获取单篇文章 ──────────────────────────────────────────────────

  const getPostBySlug = async (slug: string) => {
    loading.value = true
    error.value = null
    try {
      const res: any = await $fetch(`/api/posts/${slug}`)
      return { data: res.data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // ─── 通过 ID 获取文章（用于编辑）────────────────────────────────────────────

  const getPostById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const res: any = await $fetch(`/api/posts/${id}/edit`)
      return { data: res.data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // ─── 按分类 / 标签 / 作者获取 ────────────────────────────────────────────────

  const getPostsByCategory = async (category: string, page = 1, pageSize = 10) => {
    const res: any = await $fetch('/api/posts/list', {
      params: { category, page, limit: pageSize, published: true }
    }).catch(() => null)
    return (res?.data?.posts || []) as any[]
  }

  const getPostsByTag = async (tag: string, page = 1, pageSize = 10) => {
    const res: any = await $fetch('/api/posts/list', {
      params: { tag, page, limit: pageSize, published: true }
    }).catch(() => null)
    return (res?.data?.posts || []) as any[]
  }

  const getPostsByAuthor = async (authorId: string, page = 1, pageSize = 10) => {
    const res: any = await $fetch('/api/posts/list', {
      params: { authorId, page, limit: pageSize, published: true }
    }).catch(() => null)
    return (res?.data?.posts || []) as any[]
  }

  // ─── 分类 / 标签 ─────────────────────────────────────────────────────────────

  const fetchCategories = async () => {
    try {
      const res: any = await $fetch('/api/posts/filters')
      categories.value = res.data?.categories || []
      return categories.value
    } catch {
      return []
    }
  }

  const fetchTags = async () => {
    try {
      const res: any = await $fetch('/api/posts/filters')
      tags.value = res.data?.tags || []
      return tags.value
    } catch {
      return []
    }
  }

  const getCategories = async () => {
    const data = await fetchCategories()
    return { data, error: null }
  }

  const getTags = async () => {
    const data = await fetchTags()
    return { data, error: null }
  }

  // ─── 作者信息 ────────────────────────────────────────────────────────────────

  const getAuthorProfile = async (authorId: string) => {
    if (!authorId || authorId === 'undefined' || authorId === 'null') {
      return { data: null, error: 'Invalid author ID' }
    }
    try {
      const res: any = await $fetch(`/api/profiles/${authorId}`)
      return { data: res.data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const getAllAuthors = async () => {
    try {
      const res: any = await $fetch('/api/profiles')
      return res.data || []
    } catch {
      return []
    }
  }

  // ─── 创建 / 更新文章 ─────────────────────────────────────────────────────────

  const savePost = async (post: any) => {
    loading.value = true
    error.value = null
    try {
      let res: any
      if (post.id) {
        res = await $fetch(`/api/posts/${post.id}`, { method: 'PUT' as any, body: post })
      } else {
        res = await $fetch('/api/posts', { method: 'POST' as any, body: post })
      }

      // 清除客户端缓存
      await clearNuxtData('home-posts')
      await clearNuxtData('blog-all-posts')
      await clearNuxtData('blog-categories')
      await clearNuxtData('blog-tags')
      if (post.slug) {
        await clearNuxtData(`post-${post.slug}`)
        await clearNuxtData(`post-comments-${post.slug}`)
        await clearNuxtData(`post-interaction-${post.slug}`)
      }
      if (post.category) await clearNuxtData(`posts-${post.category}`)

      return { data: res.data ? [res.data] : null, error: null }
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return { data: null, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ─── 删除文章 ────────────────────────────────────────────────────────────────

  const deletePost = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/posts/${id}`, { method: 'DELETE' as any })

      await clearNuxtData('home-posts')
      await clearNuxtData('blog-all-posts')
      await clearNuxtData('blog-categories')
      await clearNuxtData('blog-tags')

      return { error: null }
    } catch (err: any) {
      error.value = err.data?.message || err.message
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ─── 点赞 ────────────────────────────────────────────────────────────────────

  const likePost = async (_userId: string, postId: string) => {
    try {
      const res: any = await $fetch(`/api/posts/${postId}/like`, { method: 'POST' as any })
      await clearNuxtData(`post-interaction-${postId}`)
      return { data: res.data, error: null }
    } catch (err: any) {
      return { data: null, error: err.data?.message || err.message }
    }
  }

  const unlikePost = async (_userId: string, postId: string) => {
    try {
      await $fetch(`/api/posts/${postId}/like`, { method: 'DELETE' as any })
      await clearNuxtData(`post-interaction-${postId}`)
      return { data: null, error: null }
    } catch (err: any) {
      return { data: null, error: err.data?.message || err.message }
    }
  }

  const checkIfUserLikedPost = async (_userId: string, postId: string) => {
    try {
      const res: any = await $fetch(`/api/posts/${postId}/like`)
      return { data: res.data?.liked === true, error: null }
    } catch {
      return { data: false, error: null }
    }
  }

  const getPostLikesCount = async (postId: string) => {
    try {
      const res: any = await $fetch(`/api/posts/${postId}/stats`)
      return { count: res.data?.likes_count || 0, error: null }
    } catch {
      return { count: 0, error: null }
    }
  }

  const getPostCommentsCount = async (postId: string) => {
    try {
      const res: any = await $fetch(`/api/posts/${postId}/stats`)
      return { count: res.data?.comments_count || 0, error: null }
    } catch {
      return { count: 0, error: null }
    }
  }

  // ─── 评论 ────────────────────────────────────────────────────────────────────

  const getPostComments = async (postId: string) => {
    try {
      const res: any = await $fetch(`/api/posts/${postId}/comments`)
      return { data: res.data || [], error: null }
    } catch (err: any) {
      return { data: [], error: err.message }
    }
  }

  const addComment = async (comment: { post_id: string; user_id: string; content: string }) => {
    try {
      const res: any = await $fetch(`/api/posts/${comment.post_id}/comments`, {
        method: 'POST' as any,
        body: { content: comment.content }
      })
      await clearNuxtData(`post-comments-${comment.post_id}`)
      await clearNuxtData(`post-interaction-${comment.post_id}`)
      return { data: res.data, error: null }
    } catch (err: any) {
      return { data: null, error: err.data?.message || err.message }
    }
  }

  const deleteComment = async (commentId: string, postId?: string) => {
    try {
      await $fetch(`/api/comments/${commentId}`, { method: 'DELETE' as any })
      if (postId) {
        await clearNuxtData(`post-comments-${postId}`)
        await clearNuxtData(`post-interaction-${postId}`)
      }
      return { error: null }
    } catch (err: any) {
      return { error: err.data?.message || err.message }
    }
  }

  // ─── 管理员检查 ──────────────────────────────────────────────────────────────

  const checkIsAdmin = async (_userId: string) => {
    try {
      const res: any = await $fetch('/api/profiles/me')
      return { data: res.data?.is_admin === true, error: null }
    } catch {
      return { data: false, error: null }
    }
  }

  // ─── 分页搜索 ────────────────────────────────────────────────────────────────

  const getPostsWithPagination = async (
    options: {
      page?: number
      pageSize?: number
      category?: string | null
      tag?: string | null
      searchQuery?: string | null
      sortBy?: 'created_at' | 'updated_at' | 'title' | 'view_count'
    } = {}
  ) => {
    loading.value = true
    error.value = null
    try {
      const { page = 1, pageSize = 10, category, tag, searchQuery, sortBy = 'created_at' } = options
      const res: any = await $fetch('/api/posts/list', {
        params: {
          page,
          limit: pageSize,
          category: category || undefined,
          tag: tag || undefined,
          search: searchQuery || undefined,
          sortBy,
          published: true
        }
      })
      return { data: res.data?.posts || [], count: res.data?.total || 0, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: [], count: 0, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const searchPosts = async (
    query: string,
    options: { limit?: number; offset?: number; category?: string | null; tag?: string | null } = {}
  ) => {
    loading.value = true
    error.value = null
    try {
      const { limit = 20, offset = 0, category, tag } = options
      if (!query?.trim()) return { data: [], error: null, count: 0 }

      const res: any = await $fetch('/api/posts/search', {
        params: { q: query, limit, offset, category, tag }
      })
      return { data: res.data || [], error: null, count: res.count || 0 }
    } catch (err: any) {
      error.value = err.message
      return { data: [], error: err.message, count: 0 }
    } finally {
      loading.value = false
    }
  }

  const incrementViewCount = async (postId: string) => {
    try {
      await $fetch(`/api/posts/${postId}/increment-view`, { method: 'POST' })
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  const getPopularPosts = async (limit = 10, offset = 0) => {
    loading.value = true
    error.value = null
    try {
      const page = Math.floor(offset / limit) + 1
      const res: any = await $fetch('/api/posts/list', {
        params: { page, limit, sortBy: 'view_count', published: true }
      })
      return { data: res.data?.posts || [], error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    posts: readonly(posts),
    categories: readonly(categories),
    tags: readonly(tags),
    getPosts,
    getPublishedPosts,
    fetchPosts,
    getPostBySlug,
    getPostById,
    getPostsByCategory,
    getPostsByTag,
    fetchCategories,
    fetchTags,
    getPostsByAuthor,
    getAuthorProfile,
    getAllAuthors,
    savePost,
    deletePost,
    getCategories,
    getTags,
    likePost,
    unlikePost,
    checkIfUserLikedPost,
    getPostLikesCount,
    getPostCommentsCount,
    getPostComments,
    addComment,
    deleteComment,
    checkIsAdmin,
    searchPosts,
    getPostsWithPagination,
    incrementViewCount,
    getPopularPosts
  }
}
