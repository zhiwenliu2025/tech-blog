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

      if (post.id) {
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
      const { error: dbError } = await supabase.from('blog_posts').delete().eq('id', id)

      if (dbError) throw dbError

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
    getTags
  }
}
