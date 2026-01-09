// Blog posts database operations
import type { Database } from '~/types/database.types'

type BlogPostRow = Database['public']['Tables']['blog_posts']['Row']
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert']
type LikeRow = Database['public']['Tables']['likes']['Row']
type CommentRow = Database['public']['Tables']['comments']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export const useBlogPosts = () => {
  const supabase = useSupabaseClient<Database>()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const posts = ref<BlogPostRow[]>([])
  const categories = ref<string[]>([])
  const tags = ref<string[]>([])

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

      const postsData = (data || []) as BlogPostRow[]

      // Get likes and comments counts for all posts
      if (postsData && postsData.length > 0) {
        const postIds = postsData.map(post => post.id)

        // Get likes counts
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .in('post_id', postIds)

        // Get comments counts
        const { data: commentsData } = await supabase
          .from('comments')
          .select('post_id')
          .in('post_id', postIds)

        // Count likes and comments per post
        const likesCountMap = new Map<string, number>()
        const commentsCountMap = new Map<string, number>()

        const likesRows = (likesData || []) as LikeRow[]
        const commentsRows = (commentsData || []) as CommentRow[]

        likesRows.forEach(like => {
          likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
        })

        commentsRows.forEach(comment => {
          commentsCountMap.set(comment.post_id, (commentsCountMap.get(comment.post_id) || 0) + 1)
        })

        // Add counts to posts
        postsData.forEach((post: any) => {
          post.likes_count = likesCountMap.get(post.id) || 0
          post.comments_count = commentsCountMap.get(post.id) || 0
        })
      }

      return { data: postsData, error: null }
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

      const postsData = (data || []) as BlogPostRow[]

      // Get likes and comments counts for all posts
      if (postsData && postsData.length > 0) {
        const postIds = postsData.map(post => post.id)

        // Get likes counts
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .in('post_id', postIds)

        // Get comments counts
        const { data: commentsData } = await supabase
          .from('comments')
          .select('post_id')
          .in('post_id', postIds)

        // Count likes and comments per post
        const likesCountMap = new Map<string, number>()
        const commentsCountMap = new Map<string, number>()

        const likesRows = (likesData || []) as Pick<LikeRow, 'post_id'>[]
        const commentsRows = (commentsData || []) as Pick<CommentRow, 'post_id'>[]

        likesRows.forEach(like => {
          likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
        })

        commentsRows.forEach(comment => {
          commentsCountMap.set(comment.post_id, (commentsCountMap.get(comment.post_id) || 0) + 1)
        })

        // Add counts to posts
        postsData.forEach((post: any) => {
          post.likes_count = likesCountMap.get(post.id) || 0
          post.comments_count = commentsCountMap.get(post.id) || 0
        })
      }

      posts.value = postsData
      return postsData
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

      // 如果文章有作者ID，获取作者信息
      // 注意：如果从缓存API获取，profiles 字段已经包含在响应中
      if (data && data.author_id && data.author_id !== 'undefined' && !(data as any).profiles) {
        try {
          const { data: authorData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, bio')
            .eq('id', data.author_id)
            .single()

          // 将作者信息附加到文章数据
          if (authorData) {
            ;(data as any).profiles = authorData
          }
        } catch (authorError) {
          // 如果获取作者信息失败，不影响文章数据返回
          console.warn('Failed to fetch author info:', authorError)
          ;(data as any).profiles = null
        }
      } else if (!data || !data.author_id) {
        // 没有作者ID，设置为 null
        if (data) {
          ;(data as any).profiles = null
        }
      }

      return { data: data as BlogPostRow | null, error: null }
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

      return (data || []) as BlogPostRow[]
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

      return (data || []) as BlogPostRow[]
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
      const postsData = (data || []) as Pick<BlogPostRow, 'category'>[]
      const uniqueCategories = [
        ...new Set(postsData.map(post => post.category).filter(Boolean) as string[])
      ]
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
      const postsData = (data || []) as Pick<BlogPostRow, 'tags'>[]
      const allTags = postsData.flatMap(post => post.tags || [])
      const uniqueTags = [...new Set(allTags)] as string[]
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

  // Get posts by author
  const getPostsByAuthor = async (authorId: string, page = 1, pageSize = 10) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('author_id', authorId)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (dbError) throw dbError

      const postsData = (data || []) as BlogPostRow[]

      // Get likes and comments counts for all posts
      if (postsData && postsData.length > 0) {
        const postIds = postsData.map(post => post.id)

        // Get likes counts
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .in('post_id', postIds)

        // Get comments counts
        const { data: commentsData } = await supabase
          .from('comments')
          .select('post_id')
          .in('post_id', postIds)

        // Count likes and comments per post
        const likesCountMap = new Map<string, number>()
        const commentsCountMap = new Map<string, number>()

        const likesRows = (likesData || []) as Pick<LikeRow, 'post_id'>[]
        const commentsRows = (commentsData || []) as Pick<CommentRow, 'post_id'>[]

        likesRows.forEach(like => {
          likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
        })

        commentsRows.forEach(comment => {
          commentsCountMap.set(comment.post_id, (commentsCountMap.get(comment.post_id) || 0) + 1)
        })

        // Add counts to posts
        postsData.forEach((post: any) => {
          post.likes_count = likesCountMap.get(post.id) || 0
          post.comments_count = commentsCountMap.get(post.id) || 0
        })
      }

      return postsData
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Get author profile
  const getAuthorProfile = async (authorId: string) => {
    loading.value = true
    error.value = null

    // ✅ 提前验证 ID
    if (!authorId || authorId === 'undefined' || authorId === 'null') {
      loading.value = false
      return { data: null, error: 'Invalid author ID' }
    }

    try {
      // ✅ 使用缓存 API
      const response: any = await $fetch(`/api/profiles/${authorId}`)
      return { data: response.data as ProfileRow | null, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Get all authors with post counts
  const getAllAuthors = async () => {
    loading.value = true
    error.value = null

    try {
      // Get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      const profiles = (profilesData || []) as ProfileRow[]

      // Get post counts for each author
      const authorIds = profiles.map(profile => profile.id)

      const { data: postsData } = await supabase
        .from('blog_posts')
        .select('author_id')
        .eq('published', true)

      if (!postsData) return profiles.map(profile => ({ ...profile, post_count: 0 }))

      const postCountMap = new Map<string, number>()
      postsData.forEach(post => {
        postCountMap.set(post.author_id, (postCountMap.get(post.author_id) || 0) + 1)
      })

      // Add post counts to profiles
      const authorsWithCounts = profiles.map(profile => ({
        ...profile,
        post_count: postCountMap.get(profile.id) || 0
      }))

      return authorsWithCounts
    } catch (err: any) {
      error.value = err.message
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

        const oldPostData = oldPost as Pick<BlogPostRow, 'slug'> | null

        // Update existing post
        const updateData: Database['public']['Tables']['blog_posts']['Update'] = {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          cover_image: post.cover_image,
          category: post.category,
          tags: post.tags,
          published: post.published,
          updated_at: new Date().toISOString()
        }

        const { data, error: dbError } = await (supabase.from('blog_posts') as any)
          .update(updateData)
          .eq('id', post.id)
          .select()

        if (dbError) throw dbError
        result = data as BlogPostRow[] | null

        // 清除相关缓存
        if (oldPostData?.slug) {
          await clearNuxtData(`post-${oldPostData.slug}`)
          await clearNuxtData(`post-comments-${oldPostData.slug}`)
          await clearNuxtData(`post-interaction-${oldPostData.slug}`)
        }
        if (savedSlug && savedSlug !== oldPostData?.slug) {
          await clearNuxtData(`post-${savedSlug}`)
          await clearNuxtData(`post-comments-${savedSlug}`)
          await clearNuxtData(`post-interaction-${savedSlug}`)
        }
      } else {
        // Create new post
        const insertData: BlogPostInsert = {
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
        }

        const { data, error: dbError } = await (supabase.from('blog_posts') as any)
          .insert(insertData)
          .select()

        if (dbError) throw dbError
        result = data as BlogPostRow[] | null
        savedSlug = (data as BlogPostRow[])?.[0]?.slug
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

      const postData = postToDelete as Pick<BlogPostRow, 'slug' | 'category'> | null

      const { error: dbError } = await supabase.from('blog_posts').delete().eq('id', id)

      if (dbError) throw dbError

      // 清除相关缓存
      if (postData?.slug) {
        await clearNuxtData(`post-${postData.slug}`)
        await clearNuxtData(`post-comments-${postData.slug}`)
        await clearNuxtData(`post-interaction-${postData.slug}`)
      }
      // 清除列表相关缓存
      await clearNuxtData('home-posts')
      await clearNuxtData('blog-all-posts')
      await clearNuxtData('blog-categories')
      await clearNuxtData('blog-tags')
      // 清除分类页缓存
      if (postData?.category) {
        await clearNuxtData(`posts-${postData.category}`)
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
      const postsData = (data || []) as Pick<BlogPostRow, 'category'>[]
      const uniqueCategories = [
        ...new Set(postsData.map(post => post.category).filter(Boolean) as string[])
      ]

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
      const postsData = (data || []) as Pick<BlogPostRow, 'tags'>[]
      const allTags = postsData.flatMap(post => post.tags || [])
      const uniqueTags = [...new Set(allTags)] as string[]

      return { data: uniqueTags, error: null }
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

      const postData = post as Pick<BlogPostRow, 'slug'> | null

      const insertData: Database['public']['Tables']['likes']['Insert'] = {
        user_id: userId,
        post_id: postId
      }

      const { data, error: dbError } = await (supabase.from('likes') as any)
        .insert(insertData)
        .select()
        .single()

      if (dbError) throw dbError

      // 清除互动数据缓存
      if (postData?.slug) {
        await clearNuxtData(`post-interaction-${postData.slug}`)
      }

      return { data: data as LikeRow | null, error: null }
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

      const postData = post as Pick<BlogPostRow, 'slug'> | null

      const { error: dbError } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId)

      if (dbError) throw dbError

      // 清除互动数据缓存
      if (postData?.slug) {
        await clearNuxtData(`post-interaction-${postData.slug}`)
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

      const commentsRows = (commentsData || []) as CommentRow[]

      if (commentsRows.length === 0) {
        return { data: [], error: null }
      }

      // 获取所有评论的用户ID
      const userIds = [...new Set(commentsRows.map(c => c.user_id).filter(Boolean))]

      // 如果没有用户ID，直接返回评论数据
      if (userIds.length === 0) {
        return {
          data: commentsRows.map(c => ({ ...c, profiles: null })) as any[],
          error: null
        }
      }

      // ✅ 使用批量缓存 API 查询用户信息
      let profilesMap = new Map<string, any>()

      try {
        const response: any = await $fetch('/api/profiles/batch', {
          params: { ids: userIds.join(',') }
        })

        const profiles = response.data || []
        profiles.forEach((profile: any) => {
          profilesMap.set(profile.id, profile)
        })
      } catch (profilesError) {
        console.error('获取用户信息错误:', profilesError)
        // 即使获取用户信息失败，也返回评论数据
        return {
          data: commentsRows.map(c => ({ ...c, profiles: null })) as any[],
          error: null
        }
      }

      // 合并评论和用户信息
      const commentsWithProfiles = commentsRows.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id) || null
      })) as any[]

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

      const postData = post as Pick<BlogPostRow, 'slug'> | null

      const insertData: Database['public']['Tables']['comments']['Insert'] = {
        post_id: comment.post_id,
        user_id: comment.user_id,
        content: comment.content
      }

      const { data, error: dbError } = await (supabase.from('comments') as any)
        .insert(insertData)
        .select()
        .single()

      if (dbError) throw dbError

      // 清除评论和互动数据缓存
      if (postData?.slug) {
        await clearNuxtData(`post-comments-${postData.slug}`)
        await clearNuxtData(`post-interaction-${postData.slug}`)
      }

      return { data: data as CommentRow | null, error: null }
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

      const commentData = comment as Pick<CommentRow, 'post_id'> | null

      const { error: dbError } = await supabase.from('comments').delete().eq('id', commentId)

      if (dbError) throw dbError

      // 获取文章 slug，用于清除缓存
      if (commentData?.post_id) {
        const { data: post } = await supabase
          .from('blog_posts')
          .select('slug')
          .eq('id', commentData.post_id)
          .single()

        const postData = post as Pick<BlogPostRow, 'slug'> | null

        if (postData?.slug) {
          await clearNuxtData(`post-comments-${postData.slug}`)
          await clearNuxtData(`post-interaction-${postData.slug}`)
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

      const profileData = data as Pick<ProfileRow, 'is_admin'> | null

      return { data: profileData?.is_admin || false, error: null }
    } catch (err: any) {
      return { data: false, error: err.message }
    }
  }

  // Get posts with server-side pagination, filtering, sorting, and search
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
      const {
        page = 1,
        pageSize = 10,
        category = null,
        tag = null,
        searchQuery = null,
        sortBy = 'created_at'
      } = options

      const offset = (page - 1) * pageSize

      // Build base query
      let query = supabase.from('blog_posts').select('*', { count: 'exact' }).eq('published', true)

      // Apply category filter
      if (category) {
        query = query.eq('category', category)
      }

      // Apply tag filter
      if (tag) {
        query = query.contains('tags', [tag])
      }

      // Apply search query
      if (searchQuery && searchQuery.trim()) {
        const searchTerm = searchQuery.trim()
        query = query.or(
          `title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
        )
      }

      // Apply sorting
      if (sortBy === 'created_at') {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === 'updated_at') {
        query = query.order('updated_at', { ascending: false })
      } else if (sortBy === 'title') {
        query = query.order('title', { ascending: true })
      } else if (sortBy === 'view_count') {
        query = query.order('view_count', { ascending: false })
      }

      // Apply pagination
      query = query.range(offset, offset + pageSize - 1)

      const { data, error: dbError, count } = await query

      if (dbError) throw dbError

      const postsData = (data || []) as BlogPostRow[]

      // Get likes and comments counts for all posts
      if (postsData && postsData.length > 0) {
        const postIds = postsData.map(post => post.id)

        // Get likes counts
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .in('post_id', postIds)

        // Get comments counts
        const { data: commentsData } = await supabase
          .from('comments')
          .select('post_id')
          .in('post_id', postIds)

        // Count likes and comments per post
        const likesCountMap = new Map<string, number>()
        const commentsCountMap = new Map<string, number>()

        const likesRows = (likesData || []) as Pick<LikeRow, 'post_id'>[]
        const commentsRows = (commentsData || []) as Pick<CommentRow, 'post_id'>[]

        likesRows.forEach(like => {
          likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
        })

        commentsRows.forEach(comment => {
          commentsCountMap.set(comment.post_id, (commentsCountMap.get(comment.post_id) || 0) + 1)
        })

        // Add counts to posts
        postsData.forEach((post: any) => {
          post.likes_count = likesCountMap.get(post.id) || 0
          post.comments_count = commentsCountMap.get(post.id) || 0
        })
      }

      return {
        data: postsData,
        count: count || 0,
        error: null
      }
    } catch (err: any) {
      error.value = err.message
      return {
        data: [],
        count: 0,
        error: err.message
      }
    } finally {
      loading.value = false
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
      const { data: searchResults, error: searchError } = await (supabase.rpc as any)(
        'search_blog_posts',
        {
          search_query: query.trim(),
          result_limit: limit,
          result_offset: offset
        }
      )

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

        const postsData = (data || []) as BlogPostRow[]

        // Get likes and comments counts
        if (postsData && postsData.length > 0) {
          const postIds = postsData.map(post => post.id)

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

          const likesRows = (likesData || []) as Pick<LikeRow, 'post_id'>[]
          const commentsRows = (commentsData || []) as Pick<CommentRow, 'post_id'>[]

          likesRows.forEach(like => {
            likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
          })

          commentsRows.forEach(comment => {
            commentsCountMap.set(comment.post_id, (commentsCountMap.get(comment.post_id) || 0) + 1)
          })

          postsData.forEach((post: any) => {
            post.likes_count = likesCountMap.get(post.id) || 0
            post.comments_count = commentsCountMap.get(post.id) || 0
          })
        }

        return { data: postsData, error: null, count: count || 0 }
      }

      // Process results from search function
      const searchResultsData = (searchResults || []) as BlogPostRow[]

      if (searchResultsData && searchResultsData.length > 0) {
        // Apply category and tag filters if specified
        let filteredResults = searchResultsData

        if (category) {
          filteredResults = filteredResults.filter(
            (post: BlogPostRow) => post.category === category
          )
        }

        if (tag) {
          filteredResults = filteredResults.filter(
            (post: BlogPostRow) => post.tags && post.tags.includes(tag)
          )
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

        const likesRows = (likesData || []) as Pick<LikeRow, 'post_id'>[]
        const commentsRows = (commentsData || []) as Pick<CommentRow, 'post_id'>[]

        likesRows.forEach(like => {
          likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
        })

        commentsRows.forEach(comment => {
          commentsCountMap.set(comment.post_id, (commentsCountMap.get(comment.post_id) || 0) + 1)
        })

        filteredResults.forEach((post: any) => {
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

  // Increment view count for a post
  const incrementViewCount = async (postId: string) => {
    try {
      const { error: dbError } = await supabase.rpc('increment_view_count', {
        post_id: postId
      })

      if (dbError) throw dbError

      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  // Get popular posts (sorted by view count)
  const getPopularPosts = async (limit = 10, offset = 0) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('view_count', { ascending: false })
        .range(offset, offset + limit - 1)

      if (dbError) throw dbError

      const postsData = (data || []) as BlogPostRow[]

      // Get likes and comments counts for all posts
      if (postsData && postsData.length > 0) {
        const postIds = postsData.map(post => post.id)

        // Get likes counts
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .in('post_id', postIds)

        // Get comments counts
        const { data: commentsData } = await supabase
          .from('comments')
          .select('post_id')
          .in('post_id', postIds)

        // Count likes and comments per post
        const likesCountMap = new Map<string, number>()
        const commentsCountMap = new Map<string, number>()

        const likesRows = (likesData || []) as Pick<LikeRow, 'post_id'>[]
        const commentsRows = (commentsData || []) as Pick<CommentRow, 'post_id'>[]

        likesRows.forEach(like => {
          likesCountMap.set(like.post_id, (likesCountMap.get(like.post_id) || 0) + 1)
        })

        commentsRows.forEach(comment => {
          commentsCountMap.set(comment.post_id, (commentsCountMap.get(comment.post_id) || 0) + 1)
        })

        // Add counts to posts
        postsData.forEach((post: any) => {
          post.likes_count = likesCountMap.get(post.id) || 0
          post.comments_count = commentsCountMap.get(post.id) || 0
        })
      }

      return { data: postsData, error: null }
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
