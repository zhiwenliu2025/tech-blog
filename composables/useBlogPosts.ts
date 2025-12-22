// Blog posts database operations
export const useBlogPosts = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref(null)
  const posts = ref([])
  const categories = ref([])
  const tags = ref([])

  // Get all published blog posts
  const getPosts = async (publishedOnly = true, limit = 10, offset = 0) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (publishedOnly) {
        query = query.eq('published', true)
      }

      const { data, error: dbError } = await query

      if (dbError) throw dbError

      // Get likes and comments counts for all posts
      if (data && data.length > 0) {
        const postIds = data.map(post => post.id)

        // Get likes counts
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('post_id')
          .in('post_id', postIds)

        // Get comments counts
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('post_id')
          .in('post_id', postIds)

        // Count likes and comments per post
        const likesCountMap = new Map<string, number>()
        const commentsCountMap = new Map<string, number>()

        if (likesData) {
          likesData.forEach(like => {
            likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
          })
        }

        if (commentsData) {
          commentsData.forEach(comment => {
            commentsCountMap.set(comment.post_id, (commentsCountMap.get(comment.post_id) || 0) + 1)
          })
        }

        // Add counts to posts
        data.forEach(post => {
          post.likes_count = likesCountMap.get(post.id) || 0
          post.comments_count = commentsCountMap.get(post.id) || 0
        })
      }

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Get all published blog posts (alias for getPosts)
  const getPublishedPosts = async (limit = 10, offset = 0) => {
    return getPosts(true, limit, offset)
  }

  // Fetch posts with pagination
  const fetchPosts = async ({ page = 1, pageSize = 10, category = null, tag = null }) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (category) {
        query = query.eq('category', category)
      }

      if (tag) {
        query = query.contains('tags', [tag])
      }

      const { data, error: dbError } = await query

      if (dbError) throw dbError

      // Get likes and comments counts for all posts
      if (data && data.length > 0) {
        const postIds = data.map(post => post.id)

        // Get likes counts
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('post_id')
          .in('post_id', postIds)

        // Get comments counts
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('post_id')
          .in('post_id', postIds)

        // Count likes and comments per post
        const likesCountMap = new Map<string, number>()
        const commentsCountMap = new Map<string, number>()

        if (likesData) {
          likesData.forEach(like => {
            likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
          })
        }

        if (commentsData) {
          commentsData.forEach(comment => {
            commentsCountMap.set(comment.post_id, (commentsCountMap.get(comment.post_id) || 0) + 1)
          })
        }

        // Add counts to posts
        data.forEach(post => {
          post.likes_count = likesCountMap.get(post.id) || 0
          post.comments_count = commentsCountMap.get(post.id) || 0
        })
      }

      posts.value = data || []
      return data || []
    } catch (err: any) {
      error.value = err.message
      posts.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // Get a single blog post by slug
  const getPostBySlug = async (slug: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (dbError) throw dbError

      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Get posts by category
  const getPostsByCategory = async (category: string, page = 1, pageSize = 10) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('category', category)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (dbError) throw dbError

      return data || []
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Get posts by tag
  const getPostsByTag = async (tag: string, page = 1, pageSize = 10) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('*')
        .contains('tags', [tag])
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (dbError) throw dbError

      return data || []
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('published', true)

      if (dbError) throw dbError

      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map(post => post.category).filter(Boolean))]
      categories.value = uniqueCategories

      return uniqueCategories
    } catch (err: any) {
      error.value = err.message
      categories.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch tags
  const fetchTags = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('tags')
        .eq('published', true)

      if (dbError) throw dbError

      // Extract and flatten all tags, then get unique ones
      const allTags = data?.flatMap(post => post.tags || [])
      const uniqueTags = [...new Set(allTags)]
      tags.value = uniqueTags

      return uniqueTags
    } catch (err: any) {
      error.value = err.message
      tags.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // Create or update a blog post
  const savePost = async (post: any) => {
    loading.value = true
    error.value = null

    try {
      let result
      let savedSlug = post.slug

      if (post.id) {
        // Update existing post - 需要获取旧的 slug 来清除缓存
        const { data: oldPost } = await supabase
          .from('blog_posts')
          .select('slug')
          .eq('id', post.id)
          .single()

        // Update existing post
        const { data, error: dbError } = await supabase
          .from('blog_posts')
          .update({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            cover_image: post.cover_image,
            category: post.category,
            tags: post.tags,
            published: post.published,
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id)
          .select()

        if (dbError) throw dbError
        result = data

        // 清除相关缓存
        if (oldPost?.slug) {
          await clearNuxtData(`post-${oldPost.slug}`)
          await clearNuxtData(`post-comments-${oldPost.slug}`)
          await clearNuxtData(`post-interaction-${oldPost.slug}`)
        }
        if (savedSlug && savedSlug !== oldPost?.slug) {
          await clearNuxtData(`post-${savedSlug}`)
          await clearNuxtData(`post-comments-${savedSlug}`)
          await clearNuxtData(`post-interaction-${savedSlug}`)
        }
      } else {
        // Create new post
        const { data, error: dbError } = await supabase
          .from('blog_posts')
          .insert({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            cover_image: post.cover_image,
            category: post.category,
            tags: post.tags,
            published: post.published,
            author_id: post.author_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()

        if (dbError) throw dbError
        result = data
        savedSlug = data?.[0]?.slug
      }

      // 清除列表相关缓存
      await clearNuxtData('home-posts')
      await clearNuxtData('blog-all-posts')
      await clearNuxtData('blog-categories')
      await clearNuxtData('blog-tags')
      // 清除所有分类页缓存（因为可能有新文章）
      if (post.category) {
        await clearNuxtData(`posts-${post.category}`)
      }

      return { data: result, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Delete a blog post
  const deletePost = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      // 先获取文章信息，用于清除缓存
      const { data: postToDelete } = await supabase
        .from('blog_posts')
        .select('slug, category')
        .eq('id', id)
        .single()

      const { error: dbError } = await supabase.from('blog_posts').delete().eq('id', id)

      if (dbError) throw dbError

      // 清除相关缓存
      if (postToDelete?.slug) {
        await clearNuxtData(`post-${postToDelete.slug}`)
        await clearNuxtData(`post-comments-${postToDelete.slug}`)
        await clearNuxtData(`post-interaction-${postToDelete.slug}`)
      }
      // 清除列表相关缓存
      await clearNuxtData('home-posts')
      await clearNuxtData('blog-all-posts')
      await clearNuxtData('blog-categories')
      await clearNuxtData('blog-tags')
      // 清除分类页缓存
      if (postToDelete?.category) {
        await clearNuxtData(`posts-${postToDelete.category}`)
      }

      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Get all categories
  const getCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('published', true)

      if (dbError) throw dbError

      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map(post => post.category).filter(Boolean))]

      return { data: uniqueCategories, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Get all tags
  const getTags = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('tags')
        .eq('published', true)

      if (dbError) throw dbError

      // Extract and flatten all tags, then get unique ones
      const allTags = data?.flatMap(post => post.tags || [])
      const tags = [...new Set(allTags)]

      return { data: tags, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Like a post
  const likePost = async (userId: string, postId: string) => {
    try {
      // 获取文章 slug，用于清除缓存
      const { data: post } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('id', postId)
        .single()

      const { data, error: dbError } = await supabase
        .from('likes')
        .insert({
          user_id: userId,
          post_id: postId
        })
        .select()
        .single()

      if (dbError) throw dbError

      // 清除互动数据缓存
      if (post?.slug) {
        await clearNuxtData(`post-interaction-${post.slug}`)
      }

      return { data, error: null }
    } catch (err: any) {
      // If error is about unique constraint, the user already liked this post
      if (err.code === '23505') {
        return { data: null, error: '您已经点赞过这篇文章了' }
      }
      return { data: null, error: err.message }
    }
  }

  // Unlike a post (only user can delete their own like)
  const unlikePost = async (userId: string, postId: string) => {
    try {
      // 获取文章 slug，用于清除缓存
      const { data: post } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('id', postId)
        .single()

      const { error: dbError } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId)

      if (dbError) throw dbError

      // 清除互动数据缓存
      if (post?.slug) {
        await clearNuxtData(`post-interaction-${post.slug}`)
      }

      return { data: null, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  // Check if user liked a post
  const checkIfUserLikedPost = async (userId: string, postId: string) => {
    try {
      const { data, error: dbError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .maybeSingle()

      if (dbError) throw dbError

      return { data: data !== null, error: null }
    } catch (err: any) {
      return { data: false, error: err.message }
    }
  }

  // Get likes count for a post
  const getPostLikesCount = async (postId: string) => {
    try {
      const { count, error: dbError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)

      if (dbError) throw dbError

      return { count: count || 0, error: null }
    } catch (err: any) {
      return { count: 0, error: err.message }
    }
  }

  // Get comments count for a post
  const getPostCommentsCount = async (postId: string) => {
    try {
      const { count, error: dbError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)

      if (dbError) throw dbError

      return { count: count || 0, error: null }
    } catch (err: any) {
      return { count: 0, error: err.message }
    }
  }

  // Get comments for a post
  const getPostComments = async (postId: string) => {
    try {
      // 先查询评论
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })

      if (commentsError) {
        console.error('获取评论错误:', commentsError)
        throw commentsError
      }

      if (!commentsData || commentsData.length === 0) {
        return { data: [], error: null }
      }

      // 获取所有评论的用户ID
      const userIds = [...new Set(commentsData.map(c => c.user_id).filter(Boolean))]

      // 如果没有用户ID，直接返回评论数据
      if (userIds.length === 0) {
        return { data: commentsData.map(c => ({ ...c, profiles: null })), error: null }
      }

      // 查询用户信息
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, full_name')
        .in('id', userIds)

      if (profilesError) {
        console.error('获取用户信息错误:', profilesError)
        // 即使获取用户信息失败，也返回评论数据
        return { data: commentsData.map(c => ({ ...c, profiles: null })), error: null }
      }

      // 创建用户信息映射
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || [])

      // 合并评论和用户信息
      const commentsWithProfiles = commentsData.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id) || null
      }))

      return { data: commentsWithProfiles, error: null }
    } catch (err: any) {
      console.error('获取评论异常:', err)
      return { data: [], error: err.message }
    }
  }

  // Add a comment
  const addComment = async (comment: { post_id: string; user_id: string; content: string }) => {
    try {
      // 获取文章 slug，用于清除缓存
      const { data: post } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('id', comment.post_id)
        .single()

      const { data, error: dbError } = await supabase
        .from('comments')
        .insert({
          post_id: comment.post_id,
          user_id: comment.user_id,
          content: comment.content
        })
        .select()
        .single()

      if (dbError) throw dbError

      // 清除评论和互动数据缓存
      if (post?.slug) {
        await clearNuxtData(`post-comments-${post.slug}`)
        await clearNuxtData(`post-interaction-${post.slug}`)
      }

      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  // Delete a comment
  const deleteComment = async (commentId: string) => {
    try {
      // 先获取评论信息，用于清除缓存
      const { data: comment } = await supabase
        .from('comments')
        .select('post_id')
        .eq('id', commentId)
        .single()

      const { error: dbError } = await supabase.from('comments').delete().eq('id', commentId)

      if (dbError) throw dbError

      // 获取文章 slug，用于清除缓存
      if (comment?.post_id) {
        const { data: post } = await supabase
          .from('blog_posts')
          .select('slug')
          .eq('id', comment.post_id)
          .single()

        if (post?.slug) {
          await clearNuxtData(`post-comments-${post.slug}`)
          await clearNuxtData(`post-interaction-${post.slug}`)
        }
      }

      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  // Check if user is admin
  const checkIsAdmin = async (userId: string) => {
    try {
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()

      if (dbError) throw dbError

      return { data: data?.is_admin || false, error: null }
    } catch (err: any) {
      return { data: false, error: err.message }
    }
  }

  // Search blog posts using full-text search
  const searchPosts = async (
    query: string,
    options: {
      limit?: number
      offset?: number
      category?: string | null
      tag?: string | null
    } = {}
  ) => {
    loading.value = true
    error.value = null

    try {
      const { limit = 20, offset = 0, category = null, tag = null } = options

      if (!query || query.trim().length === 0) {
        // If query is empty, return empty results
        return { data: [], error: null, count: 0 }
      }

      // Use the search function if available, otherwise fallback to manual search
      // First, try using the database function
      const { data: searchResults, error: searchError } = await supabase.rpc('search_blog_posts', {
        search_query: query.trim(),
        result_limit: limit,
        result_offset: offset
      })

      if (searchError) {
        // Fallback to manual search if function doesn't exist or fails
        console.warn('Search function not available, using fallback search:', searchError)

        // Manual full-text search using Supabase query
        let searchQuery = supabase
          .from('blog_posts')
          .select('*', { count: 'exact' })
          .eq('published', true)
          .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
          .order('published_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (category) {
          searchQuery = searchQuery.eq('category', category)
        }

        if (tag) {
          searchQuery = searchQuery.contains('tags', [tag])
        }

        const { data, error: dbError, count } = await searchQuery

        if (dbError) throw dbError

        // Get likes and comments counts
        if (data && data.length > 0) {
          const postIds = data.map(post => post.id)

          const { data: likesData } = await supabase
            .from('likes')
            .select('post_id')
            .in('post_id', postIds)

          const { data: commentsData } = await supabase
            .from('comments')
            .select('post_id')
            .in('post_id', postIds)

          const likesCountMap = new Map<string, number>()
          const commentsCountMap = new Map<string, number>()

          if (likesData) {
            likesData.forEach(like => {
              likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
            })
          }

          if (commentsData) {
            commentsData.forEach(comment => {
              commentsCountMap.set(
                comment.post_id,
                (commentsCountMap.get(comment.post_id) || 0) + 1
              )
            })
          }

          data.forEach(post => {
            post.likes_count = likesCountMap.get(post.id) || 0
            post.comments_count = commentsCountMap.get(post.id) || 0
          })
        }

        return { data: data || [], error: null, count: count || 0 }
      }

      // Process results from search function
      if (searchResults && searchResults.length > 0) {
        // Apply category and tag filters if specified
        let filteredResults = searchResults

        if (category) {
          filteredResults = filteredResults.filter(post => post.category === category)
        }

        if (tag) {
          filteredResults = filteredResults.filter(post => post.tags && post.tags.includes(tag))
        }

        const postIds = filteredResults.map(post => post.id)

        // Get likes and comments counts
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .in('post_id', postIds)

        const { data: commentsData } = await supabase
          .from('comments')
          .select('post_id')
          .in('post_id', postIds)

        const likesCountMap = new Map<string, number>()
        const commentsCountMap = new Map<string, number>()

        if (likesData) {
          likesData.forEach(like => {
            likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
          })
        }

        if (commentsData) {
          commentsData.forEach(comment => {
            commentsCountMap.set(comment.post_id, (commentsCountMap.get(comment.post_id) || 0) + 1)
          })
        }

        filteredResults.forEach(post => {
          post.likes_count = likesCountMap.get(post.id) || 0
          post.comments_count = commentsCountMap.get(post.id) || 0
        })

        return {
          data: filteredResults,
          error: null,
          count: filteredResults.length
        }
      }

      return { data: [], error: null, count: 0 }
    } catch (err: any) {
      error.value = err.message
      return { data: [], error: err.message, count: 0 }
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
    getPostsByCategory,
    getPostsByTag,
    fetchCategories,
    fetchTags,
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
    searchPosts
  }
}
