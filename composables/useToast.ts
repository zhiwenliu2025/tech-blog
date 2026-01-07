// Toast 类型定义
export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
  timeout?: number
  show: boolean
}

export interface ToastOptions {
  type: Toast['type']
  title: string
  description?: string
  timeout?: number
}

// Toast state
const toasts = ref<Toast[]>([])

// Toast types
export const ToastType = {
  SUCCESS: 'success' as const,
  ERROR: 'error' as const,
  INFO: 'info' as const,
  WARNING: 'warning' as const
}

// Toast composable
export const useToast = () => {
  // Add a new toast
  const add = (toast: ToastOptions): string => {
    const id = Date.now().toString()
    const newToast: Toast = {
      id,
      ...toast,
      show: true
    }

    toasts.value.push(newToast)

    // Auto remove after timeout
    if (toast.timeout) {
      setTimeout(() => {
        remove(id)
      }, toast.timeout)
    }

    return id
  }

  // Remove a toast by id
  const remove = (id: string): void => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  // Clear all toasts
  const clear = (): void => {
    toasts.value = []
  }

  // Convenience methods
  const success = (title: string, description?: string, timeout = 3000): string => {
    return add({
      type: ToastType.SUCCESS,
      title,
      description,
      timeout
    })
  }

  const error = (title: string, description?: string, timeout = 5000): string => {
    return add({
      type: ToastType.ERROR,
      title,
      description,
      timeout
    })
  }

  const info = (title: string, description?: string, timeout = 3000): string => {
    return add({
      type: ToastType.INFO,
      title,
      description,
      timeout
    })
  }

  const warning = (title: string, description?: string, timeout = 3000): string => {
    return add({
      type: ToastType.WARNING,
      title,
      description,
      timeout
    })
  }

  // 添加 showToast 方法（用于兼容）
  const showToast = (
    title: string,
    description?: string,
    type: Toast['type'] = 'info',
    timeout = 3000
  ): string => {
    return add({
      type,
      title,
      description,
      timeout
    })
  }

  return {
    toasts: readonly(toasts),
    add,
    remove,
    clear,
    success,
    error,
    info,
    warning,
    showToast
  }
}

// Make sure to export the toast state for the component
export { toasts }
