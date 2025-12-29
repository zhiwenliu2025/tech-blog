/**
 * 移动端触摸优化 composable
 * 提供触摸手势、反馈等功能
 */

export const useTouch = () => {
  /**
   * 触摸反馈 - 在触摸时添加视觉反馈
   */
  const addTouchFeedback = (element: HTMLElement) => {
    if (!element) return

    const handleTouchStart = () => {
      element.style.transform = 'scale(0.97)'
      element.style.opacity = '0.8'
    }

    const handleTouchEnd = () => {
      element.style.transform = ''
      element.style.opacity = ''
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchEnd)
    }
  }

  /**
   * 滑动检测
   */
  const useSwipe = (
    element: HTMLElement | null,
    options: {
      onSwipeLeft?: () => void
      onSwipeRight?: () => void
      onSwipeUp?: () => void
      onSwipeDown?: () => void
      threshold?: number // 滑动阈值（像素）
      velocityThreshold?: number // 速度阈值（像素/毫秒）
    } = {}
  ) => {
    if (!element) return

    const {
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      threshold = 50,
      velocityThreshold = 0.3
    } = options

    let startX = 0
    let startY = 0
    let startTime = 0
    let isSwiping = false

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      startX = touch.clientX
      startY = touch.clientY
      startTime = Date.now()
      isSwiping = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return
      // 允许滚动，但检测滑动方向
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwiping) return

      const touch = e.changedTouches[0]
      const endX = touch.clientX
      const endY = touch.clientY
      const endTime = Date.now()

      const deltaX = endX - startX
      const deltaY = endY - startY
      const deltaTime = endTime - startTime
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const velocity = distance / deltaTime

      // 检查是否达到阈值
      if (distance < threshold || velocity < velocityThreshold) {
        isSwiping = false
        return
      }

      // 判断滑动方向
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      if (absX > absY) {
        // 水平滑动
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // 垂直滑动
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }

      isSwiping = false
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchEnd)
    }
  }

  /**
   * 长按检测
   */
  const useLongPress = (
    element: HTMLElement | null,
    options: {
      onLongPress: () => void
      duration?: number // 长按持续时间（毫秒）
    }
  ) => {
    if (!element) return

    const { onLongPress, duration = 500 } = options

    let pressTimer: NodeJS.Timeout | null = null
    let isLongPress = false

    const handleTouchStart = () => {
      isLongPress = false
      pressTimer = setTimeout(() => {
        isLongPress = true
        onLongPress()
      }, duration)
    }

    const handleTouchEnd = () => {
      if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    const handleTouchMove = () => {
      if (pressTimer) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      if (pressTimer) clearTimeout(pressTimer)
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchcancel', handleTouchEnd)
    }
  }

  /**
   * 双击检测
   */
  const useDoubleTap = (
    element: HTMLElement | null,
    options: {
      onDoubleTap: () => void
      delay?: number // 双击间隔时间（毫秒）
    }
  ) => {
    if (!element) return

    const { onDoubleTap, delay = 300 } = options

    let lastTap = 0

    const handleTouchEnd = (e: TouchEvent) => {
      const currentTime = Date.now()
      const tapLength = currentTime - lastTap

      if (tapLength < delay && tapLength > 0) {
        onDoubleTap()
        e.preventDefault()
      }

      lastTap = currentTime
    }

    element.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }

  /**
   * 触摸区域扩展 - 确保小元素有足够的触摸区域
   */
  const expandTouchTarget = (element: HTMLElement, minSize = 44) => {
    if (!element) return

    const rect = element.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    if (width < minSize || height < minSize) {
      const padding = Math.max(minSize - width, minSize - height) / 2
      element.style.padding = `${padding}px`
      element.style.margin = `-${padding}px`
    }
  }

  /**
   * 防止意外滚动 - 在特定元素上禁用滚动
   */
  const preventScroll = (element: HTMLElement, prevent = true) => {
    if (!element) return

    if (prevent) {
      element.style.overflow = 'hidden'
      element.style.touchAction = 'none'
    } else {
      element.style.overflow = ''
      element.style.touchAction = ''
    }
  }

  return {
    addTouchFeedback,
    useSwipe,
    useLongPress,
    useDoubleTap,
    expandTouchTarget,
    preventScroll
  }
}
