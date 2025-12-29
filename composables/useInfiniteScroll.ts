/**
 * 无限滚动 composable
 * 用于移动端优化，实现懒加载更多内容
 */
export const useInfiniteScroll = (
  callback: () => void | Promise<void>,
  options: {
    distance?: number // 距离底部多少像素时触发
    enabled?: Ref<boolean> // 是否启用
  } = {}
) => {
  const { distance = 200, enabled = ref(true) } = options
  const isLoading = ref(false)
  const hasMore = ref(true)

  const handleScroll = async () => {
    if (!enabled.value || isLoading.value || !hasMore.value) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // 检查是否接近底部
    if (scrollTop + windowHeight >= documentHeight - distance) {
      isLoading.value = true
      try {
        await callback()
      } catch (error) {
        console.error('Infinite scroll error:', error)
      } finally {
        isLoading.value = false
      }
    }
  }

  const start = () => {
    if (typeof window === 'undefined') return
    window.addEventListener('scroll', handleScroll, { passive: true })
  }

  const stop = () => {
    if (typeof window === 'undefined') return
    window.removeEventListener('scroll', handleScroll)
  }

  onMounted(() => {
    if (enabled.value) {
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  watch(enabled, value => {
    if (value) {
      start()
    } else {
      stop()
    }
  })

  return {
    isLoading: readonly(isLoading),
    hasMore,
    setHasMore: (value: boolean) => {
      hasMore.value = value
    },
    refresh: () => {
      hasMore.value = true
      isLoading.value = false
    }
  }
}
