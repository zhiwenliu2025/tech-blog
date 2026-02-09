import type { ImportResult } from '~/server/utils/import-utils'

export type ImportStep = 'input' | 'preview' | 'saving'

export function useImport() {
  const loading = ref(false)
  const result = ref<ImportResult | null>(null)
  const error = ref<string | null>(null)
  const step = ref<ImportStep>('input')

  /**
   * Parse a remote article by URL
   */
  async function fetchArticle(url: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<ImportResult>('/api/import/fetch', {
        method: 'POST',
        body: { url }
      })
      result.value = data
      step.value = 'preview'
    } catch (e: any) {
      // Extract error message from Nuxt error format
      const message =
        e?.data?.message || e?.statusMessage || e?.message || '解析失败，请检查 URL 是否正确'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  /**
   * Save imported data as a blog post using existing savePost logic
   */
  async function saveAsPost(options: {
    title: string
    content: string
    excerpt: string
    category: string
    tags: string[]
    coverImage: string | null
    published: boolean
  }): Promise<{ slug: string | null; error: string | null }> {
    step.value = 'saving'
    loading.value = true

    try {
      const user = useSupabaseUser()
      if (!user.value) {
        throw new Error('请先登录')
      }

      const { savePost } = useBlogPosts()

      // Generate slug from title
      const slug =
        options.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim() || `imported-${Date.now()}`

      const { data, error: saveError } = await savePost({
        title: options.title,
        slug,
        content: options.content,
        excerpt: options.excerpt,
        cover_image: options.coverImage,
        category: options.category || null,
        tags: options.tags.length > 0 ? options.tags : null,
        published: options.published,
        author_id: user.value.id
      })

      if (saveError) {
        throw new Error(saveError)
      }

      const savedSlug = (data as any)?.[0]?.slug || slug
      return { slug: savedSlug, error: null }
    } catch (err: any) {
      error.value = err.message
      return { slug: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset to initial state
   */
  function reset() {
    result.value = null
    error.value = null
    step.value = 'input'
    loading.value = false
  }

  return {
    loading,
    result,
    error,
    step,
    fetchArticle,
    saveAsPost,
    reset
  }
}
