/**
 * 下拉刷新 composable
 * 用于移动端优化，实现下拉刷新功能
 */
export const usePullToRefresh = (
  callback: () => void | Promise<void>,
  options: {
    threshold?: number // 下拉阈值（像素）
    resistance?: number // 阻力系数（0-1）
    enabled?: Ref<boolean> // 是否启用
  } = {}
) => {
  const { threshold = 80, resistance = 0.5, enabled = ref(true) } = options
  const isRefreshing = ref(false)
  const pullDistance = ref(0)
  const startY = ref(0)
  const currentY = ref(0)
  const isPulling = ref(false)

  const handleTouchStart = (e: TouchEvent) => {
    if (!enabled.value || isRefreshing.value) return

    // 只在页面顶部时启用下拉刷新
    if (window.scrollY > 0) return

    const touch = e.touches[0]
    if (!touch) return

    startY.value = touch.clientY
    isPulling.value = true
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.value || isRefreshing.value) return

    const touch = e.touches[0]
    if (!touch) return

    currentY.value = touch.clientY
    const distance = currentY.value - startY.value

    if (distance > 0) {
      // 应用阻力
      pullDistance.value = distance * resistance
      e.preventDefault()
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling.value) return

    if (pullDistance.value >= threshold && !isRefreshing.value) {
      isRefreshing.value = true
      try {
        await callback()
      } catch (error) {
        console.error('Pull to refresh error:', error)
      } finally {
        isRefreshing.value = false
        pullDistance.value = 0
      }
    } else {
      // 回弹动画
      pullDistance.value = 0
    }

    isPulling.value = false
  }

  onMounted(() => {
    if (!enabled.value || typeof window === 'undefined') return

    const element = document.documentElement
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return

    const element = document.documentElement
    if (!element) return

    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchmove', handleTouchMove)
    element.removeEventListener('touchend', handleTouchEnd)
  })

  watch(enabled, value => {
    if (!value) {
      pullDistance.value = 0
      isPulling.value = false
    }
  })

  return {
    isRefreshing: readonly(isRefreshing),
    pullDistance: readonly(pullDistance),
    threshold
  }
}
