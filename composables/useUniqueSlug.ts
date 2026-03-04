export function useUniqueSlug() {
  const checkSlugAvailability = async (slug: string, postId?: string): Promise<boolean> => {
    if (!slug?.trim()) return false
    try {
      const res: any = await $fetch('/api/slugs/check', {
        params: { slug, excludeId: postId }
      })
      return res.data?.available === true
    } catch {
      return false
    }
  }

  const ensureUniqueSlug = async (
    baseSlug: string,
    postId?: string,
    maxAttempts = 10
  ): Promise<string> => {
    if (!baseSlug?.trim()) return `post-${Date.now()}`

    let slug = baseSlug
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const available = await checkSlugAvailability(slug, postId)
      if (available) return slug
      slug = `${baseSlug}-${attempt + 1}`
    }
    return `${baseSlug}-${Date.now()}`
  }

  const generateUniqueSlug = async (title: string, postId?: string): Promise<string> => {
    const { generateSlugFromTitle } = useSlug()
    const baseSlug = generateSlugFromTitle(title)
    return ensureUniqueSlug(baseSlug, postId)
  }

  return { ensureUniqueSlug, checkSlugAvailability, generateUniqueSlug }
}
