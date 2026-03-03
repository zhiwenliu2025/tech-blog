export function useUniqueSlug() {
  const supabase = useSupabaseClient()

  const ensureUniqueSlug = async (
    baseSlug: string,
    postId?: string,
    maxAttempts = 10
  ): Promise<string> => {
    if (!baseSlug || baseSlug.trim().length === 0) {
      return `post-${Date.now()}`
    }

    let slug = baseSlug
    let attempt = 0

    while (attempt < maxAttempts) {
      try {
        let query = supabase.from('blog_posts').select('id').eq('slug', slug)

        if (postId) {
          query = query.neq('id', postId)
        }

        const { data, error } = await query.single()

        if (error || !data) {
          return slug
        }

        attempt++
        slug = `${baseSlug}-${attempt}`
      } catch (err) {
        console.error('Error checking slug uniqueness:', err)
        return slug
      }
    }

    return `${baseSlug}-${Date.now()}`
  }

  const checkSlugAvailability = async (slug: string, postId?: string): Promise<boolean> => {
    if (!slug || slug.trim().length === 0) {
      return false
    }

    try {
      let query = supabase.from('blog_posts').select('id').eq('slug', slug)

      if (postId) {
        query = query.neq('id', postId)
      }

      const { data, error } = await query.single()

      return !error && !data
    } catch (err) {
      console.error('Error checking slug availability:', err)
      return false
    }
  }

  const generateUniqueSlug = async (title: string, postId?: string): Promise<string> => {
    const { generateSlugFromTitle } = useSlug()
    const baseSlug = generateSlugFromTitle(title)
    return await ensureUniqueSlug(baseSlug, postId)
  }

  return {
    ensureUniqueSlug,
    checkSlugAvailability,
    generateUniqueSlug
  }
}
