/**
 * PWA 相关功能 composable
 * 注意：@vite-pwa/nuxt 模块已经提供了 usePWA composable
 * 这个文件提供额外的辅助功能
 */
export const usePWAHelpers = () => {
  const deferredPrompt = ref<any>(null)
  const isInstallable = ref(false)

  // 检查是否已安装
  const checkInstalled = () => {
    // 检查是否在独立模式下运行（已安装）
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      return true
    }
    // 检查是否在 iOS 上添加到主屏幕
    if (typeof window !== 'undefined' && (window.navigator as any).standalone) {
      return true
    }
    return false
  }

  // 初始化
  onMounted(() => {
    if (typeof window === 'undefined') return

    // 监听 beforeinstallprompt 事件
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
    })

    // 监听应用安装事件
    window.addEventListener('appinstalled', () => {
      isInstallable.value = false
      deferredPrompt.value = null
    })
  })

  // 手动触发安装提示（用于自定义安装按钮）
  const triggerInstall = async () => {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice
      if (outcome === 'accepted') {
        isInstallable.value = false
      }
      deferredPrompt.value = null
      return outcome === 'accepted'
    }
    return false
  }

  return {
    isInstallable: readonly(isInstallable),
    checkInstalled,
    triggerInstall
  }
}
