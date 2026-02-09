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
  }): Promise<{ slug: string | null; id: string | null; error: string | null }> {
    step.value = 'saving'
    loading.value = true

    try {
      const user = useSupabaseUser()
      if (!user.value) {
        console.error('[useImport] saveAsPost failed: user not logged in')
        throw new Error('请先登录')
      }

      // 获取用户ID（兼容 id 和 sub 属性）
      const userId = user.value.id || user.value.sub
      if (!userId) {
        console.error('[useImport] saveAsPost failed: unable to get user id')
        throw new Error('无法获取用户ID')
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

      console.log('[useImport] saveAsPost: saving post', {
        title: options.title,
        slug,
        category: options.category,
        tags: options.tags,
        published: options.published,
        userId
      })

      const { data, error: saveError } = await savePost({
        title: options.title,
        slug,
        content: options.content,
        excerpt: options.excerpt,
        cover_image: options.coverImage,
        category: options.category || null,
        tags: options.tags.length > 0 ? options.tags : null,
        published: options.published,
        author_id: userId
      })

      if (saveError) {
        console.error('[useImport] saveAsPost failed: savePost returned error', saveError)
        throw new Error(saveError)
      }

      const savedSlug = (data as any)?.[0]?.slug || slug
      const savedId = (data as any)?.[0]?.id || null
      console.log('[useImport] saveAsPost success, full data:', data)
      console.log('[useImport] saveAsPost success, slug:', savedSlug, 'id:', savedId)

      if (!savedId) {
        console.warn('[useImport] Warning: savedId is null, data:', data)
      }

      return { slug: savedSlug, id: savedId, error: null }
    } catch (err: any) {
      console.error('[useImport] saveAsPost error:', err.message, err)
      error.value = err.message
      return { slug: null, id: null, error: err.message }
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
