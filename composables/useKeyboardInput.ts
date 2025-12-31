/**
 * 键盘输入优化 composable
 * 用于移动端优化，当输入框获得焦点时自动滚动到可见位置
 */

interface UseKeyboardInputOptions {
  /**
   * 滚动延迟时间（毫秒），等待键盘动画完成
   * @default 300
   */
  scrollDelay?: number
  /**
   * 滚动行为
   * @default 'smooth'
   */
  behavior?: ScrollBehavior
  /**
   * 滚动位置
   * @default 'center'
   */
  block?: ScrollLogicalPosition
  /**
   * 是否仅在移动端启用
   * @default true
   */
  mobileOnly?: boolean
  /**
   * 额外的偏移量（像素），用于调整滚动位置
   * @default 0
   */
  offset?: number
}

/**
 * 检测是否为移动设备
 */
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  )
}

/**
 * 检测是否为 iOS 设备
 */
const isIOSDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/**
 * 使用键盘输入优化
 * @param inputRef 输入框的 ref
 * @param options 配置选项
 */
export const useKeyboardInput = (
  inputRef: Ref<HTMLElement | null>,
  options: UseKeyboardInputOptions = {}
) => {
  const {
    scrollDelay = 300,
    behavior = 'smooth',
    block = 'center',
    mobileOnly = true,
    offset = 0
  } = options

  const isKeyboardOpen = ref(false)
  const originalHeight = ref<number | null>(null)

  /**
   * 滚动到输入框位置
   */
  const scrollToInput = () => {
    if (typeof window === 'undefined' || !inputRef.value) return

    // 如果仅在移动端启用，检查设备类型
    if (mobileOnly && !isMobileDevice()) return

    // 延迟滚动，等待键盘动画完成
    setTimeout(() => {
      if (!inputRef.value) return

      const element = inputRef.value
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      // 计算目标位置（考虑偏移量）
      const targetY = scrollTop + rect.top - window.innerHeight / 2 + rect.height / 2 + offset

      // 使用 scrollIntoView 或手动滚动
      if (element.scrollIntoView) {
        element.scrollIntoView({
          behavior,
          block,
          inline: 'nearest'
        })
      } else {
        // 降级方案：手动滚动
        window.scrollTo({
          top: targetY,
          left: scrollLeft,
          behavior
        })
      }

      // iOS 特殊处理：需要额外的延迟
      if (isIOSDevice()) {
        setTimeout(() => {
          if (inputRef.value) {
            inputRef.value.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            })
          }
        }, 100)
      }
    }, scrollDelay)
  }

  /**
   * 处理输入框获得焦点
   */
  const handleFocus = () => {
    if (mobileOnly && !isMobileDevice()) return

    isKeyboardOpen.value = true
    scrollToInput()

    // iOS 设备需要特殊处理
    if (isIOSDevice()) {
      // 保存原始高度
      if (!originalHeight.value) {
        originalHeight.value = window.innerHeight
      }

      // 监听视口高度变化（键盘弹出/收起）
      const handleResize = () => {
        const currentHeight = window.innerHeight
        const heightDiff = originalHeight.value! - currentHeight

        // 如果高度变化超过 150px，认为键盘已弹出
        if (heightDiff > 150) {
          isKeyboardOpen.value = true
          // 再次滚动以确保输入框可见
          scrollToInput()
        } else {
          isKeyboardOpen.value = false
        }
      }

      window.addEventListener('resize', handleResize)
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
      })
    }
  }

  /**
   * 处理输入框失去焦点
   */
  const handleBlur = () => {
    // 延迟设置，避免在 iOS 上键盘收起动画时触发
    setTimeout(() => {
      isKeyboardOpen.value = false
    }, 200)
  }

  /**
   * 手动触发滚动（用于外部调用）
   */
  const scroll = () => {
    scrollToInput()
  }

  return {
    /**
     * 键盘是否打开
     */
    isKeyboardOpen: readonly(isKeyboardOpen),
    /**
     * 处理焦点事件
     */
    handleFocus,
    /**
     * 处理失焦事件
     */
    handleBlur,
    /**
     * 手动滚动到输入框
     */
    scroll
  }
}

/**
 * 为多个输入框创建键盘输入优化
 * @param inputRefs 输入框 refs 数组
 * @param options 配置选项
 */
export const useKeyboardInputMultiple = (
  inputRefs: Ref<HTMLElement | null>[],
  options: UseKeyboardInputOptions = {}
) => {
  const handlers = inputRefs.map(ref => useKeyboardInput(ref, options))

  return {
    handlers,
    isAnyKeyboardOpen: computed(() => handlers.some(handler => handler.isKeyboardOpen.value))
  }
}
