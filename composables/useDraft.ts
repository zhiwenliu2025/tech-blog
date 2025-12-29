/**
 * 博客草稿自动保存功能
 * 使用 localStorage 保存文章草稿，防止内容丢失
 */

export interface DraftData {
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string
  category: string
  tags: string[]
  published: boolean
  savedAt: number // 保存时间戳
}

export const useDraft = (draftKey: string) => {
  const STORAGE_KEY = `blog_draft_${draftKey}`
  const SAVE_INTERVAL = 30000 // 30秒自动保存一次
  const MAX_DRAFT_AGE = 7 * 24 * 60 * 60 * 1000 // 草稿保留7天

  let saveTimer: NodeJS.Timeout | null = null
  const isSaving = ref(false)
  const lastSavedAt = ref<number | null>(null)

  /**
   * 保存草稿到 localStorage
   */
  const saveDraft = (data: Partial<DraftData>) => {
    if (typeof window === 'undefined') return

    try {
      const draftData: DraftData = {
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        cover_image: data.cover_image || '',
        category: data.category || '',
        tags: data.tags || [],
        published: data.published || false,
        savedAt: Date.now()
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData))
      lastSavedAt.value = draftData.savedAt
      isSaving.value = false
    } catch (error) {
      console.error('保存草稿失败:', error)
      // localStorage 可能已满，尝试清理旧草稿
      clearOldDrafts()
    }
  }

  /**
   * 从 localStorage 恢复草稿
   */
  const loadDraft = (): DraftData | null => {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const draftData: DraftData = JSON.parse(stored)

      // 检查草稿是否过期
      const age = Date.now() - draftData.savedAt
      if (age > MAX_DRAFT_AGE) {
        clearDraft()
        return null
      }

      return draftData
    } catch (error) {
      console.error('加载草稿失败:', error)
      return null
    }
  }

  /**
   * 清除当前草稿
   */
  const clearDraft = () => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(STORAGE_KEY)
      lastSavedAt.value = null
    } catch (error) {
      console.error('清除草稿失败:', error)
    }
  }

  /**
   * 清理所有过期的草稿
   */
  const clearOldDrafts = () => {
    if (typeof window === 'undefined') return

    try {
      const keys = Object.keys(localStorage)
      const draftKeys = keys.filter(key => key.startsWith('blog_draft_'))

      draftKeys.forEach(key => {
        try {
          const stored = localStorage.getItem(key)
          if (stored) {
            const draftData: DraftData = JSON.parse(stored)
            const age = Date.now() - draftData.savedAt
            if (age > MAX_DRAFT_AGE) {
              localStorage.removeItem(key)
            }
          }
        } catch (error) {
          // 如果解析失败，直接删除
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('清理旧草稿失败:', error)
    }
  }

  /**
   * 开始自动保存
   */
  const startAutoSave = (getData: () => Partial<DraftData>) => {
    if (saveTimer) {
      clearInterval(saveTimer)
    }

    saveTimer = setInterval(() => {
      const data = getData()
      // 只有当有内容时才保存
      if (data.title || data.content) {
        isSaving.value = true
        saveDraft(data)
      }
    }, SAVE_INTERVAL)
  }

  /**
   * 停止自动保存
   */
  const stopAutoSave = () => {
    if (saveTimer) {
      clearInterval(saveTimer)
      saveTimer = null
    }
  }

  /**
   * 手动保存草稿
   */
  const manualSave = (data: Partial<DraftData>) => {
    isSaving.value = true
    saveDraft(data)
  }

  /**
   * 格式化保存时间
   */
  const formatSavedTime = (timestamp: number | null): string => {
    if (!timestamp) return ''

    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) {
      // 1分钟内
      return '刚刚保存'
    } else if (diff < 3600000) {
      // 1小时内
      const minutes = Math.floor(diff / 60000)
      return `${minutes} 分钟前保存`
    } else if (diff < 86400000) {
      // 24小时内
      const hours = Math.floor(diff / 3600000)
      return `${hours} 小时前保存`
    } else {
      // 超过24小时
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // 组件卸载时清理
  onBeforeUnmount(() => {
    stopAutoSave()
  })

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    startAutoSave,
    stopAutoSave,
    manualSave,
    isSaving: readonly(isSaving),
    lastSavedAt: readonly(lastSavedAt),
    formatSavedTime
  }
}
