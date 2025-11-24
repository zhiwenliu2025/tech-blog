// Toast state
const toasts = ref([])

// Toast types
export const ToastType = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
}

// Toast composable
export const useToast = () => {
  // Add a new toast
  const add = toast => {
    const id = Date.now().toString()
    const newToast = {
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
  const remove = id => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  // Clear all toasts
  const clear = () => {
    toasts.value = []
  }

  // Convenience methods
  const success = (title, description, timeout = 3000) => {
    return add({
      type: ToastType.SUCCESS,
      title,
      description,
      timeout
    })
  }

  const error = (title, description, timeout = 5000) => {
    return add({
      type: ToastType.ERROR,
      title,
      description,
      timeout
    })
  }

  const info = (title, description, timeout = 3000) => {
    return add({
      type: ToastType.INFO,
      title,
      description,
      timeout
    })
  }

  const warning = (title, description, timeout = 3000) => {
    return add({
      type: ToastType.WARNING,
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
    warning
  }
}
