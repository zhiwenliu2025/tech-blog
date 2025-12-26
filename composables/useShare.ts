/**
 * 分享功能 composable
 */
export const useShare = () => {
  const { showToast } = useToast()
  const config = useRuntimeConfig()

  // 获取当前页面 URL
  const getCurrentUrl = () => {
    if (typeof window === 'undefined') return ''
    return window.location.href
  }

  // 获取应用 URL
  const getAppUrl = () => {
    return config.public.appUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  }

  // 检查是否支持 Web Share API
  const isWebShareSupported = () => {
    return typeof navigator !== 'undefined' && 'share' in navigator
  }

  // 使用 Web Share API 分享
  const shareViaWebAPI = async (title: string, text: string, url: string) => {
    if (!isWebShareSupported()) {
      return false
    }

    try {
      await navigator.share({
        title,
        text,
        url
      })
      return true
    } catch (error: any) {
      // 用户取消分享
      if (error.name === 'AbortError') {
        return false
      }
      console.error('Web Share API 失败:', error)
      return false
    }
  }

  // 分享到 Twitter
  const shareToTwitter = (title: string, url: string) => {
    const text = `${title}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  // 分享到 Facebook
  const shareToFacebook = (url: string) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'width=550,height=420')
  }

  // 分享到 LinkedIn
  const shareToLinkedIn = (title: string, url: string, summary?: string) => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}${summary ? `&summary=${encodeURIComponent(summary)}` : ''}`
    window.open(linkedInUrl, '_blank', 'width=550,height=420')
  }

  // 分享到 Reddit
  const shareToReddit = (title: string, url: string) => {
    const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(redditUrl, '_blank', 'width=550,height=420')
  }

  // 分享到微博
  const shareToWeibo = (title: string, url: string, pic?: string) => {
    const weiboUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}${pic ? `&pic=${encodeURIComponent(pic)}` : ''}`
    window.open(weiboUrl, '_blank', 'width=550,height=420')
  }

  // 分享到微信（生成二维码）
  const shareToWeChat = (url: string, title: string) => {
    // 使用二维码生成服务或库
    // 这里使用在线二维码生成 API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`

    // 显示二维码模态框
    // 这个功能需要配合 UI 组件实现
    return {
      qrCodeUrl,
      url,
      title
    }
  }

  // 复制链接到剪贴板
  const copyLink = async (url: string, showNotification = true) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
        if (showNotification) {
          showToast('链接已复制到剪贴板', 'success')
        }
        return true
      } else {
        // 降级方案：使用传统方法
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          document.execCommand('copy')
          if (showNotification) {
            showToast('链接已复制到剪贴板', 'success')
          }
          return true
        } catch (err) {
          console.error('复制失败:', err)
          if (showNotification) {
            showToast('复制失败，请手动复制', 'error')
          }
          return false
        } finally {
          document.body.removeChild(textArea)
        }
      }
    } catch (error) {
      console.error('复制链接失败:', error)
      if (showNotification) {
        showToast('复制失败，请手动复制', 'error')
      }
      return false
    }
  }

  // 分享文章
  const shareArticle = async (
    title: string,
    url: string,
    excerpt?: string,
    coverImage?: string
  ) => {
    const shareText = excerpt || title
    const shareUrl = url || getCurrentUrl()

    // 优先使用 Web Share API
    if (isWebShareSupported()) {
      const shared = await shareViaWebAPI(title, shareText, shareUrl)
      if (shared) {
        showToast('分享成功', 'success')
        return true
      }
      return false
    }

    // 如果不支持 Web Share API，返回 false，让调用者使用其他方式
    return false
  }

  return {
    getCurrentUrl,
    getAppUrl,
    isWebShareSupported,
    shareViaWebAPI,
    shareToTwitter,
    shareToFacebook,
    shareToLinkedIn,
    shareToReddit,
    shareToWeibo,
    shareToWeChat,
    copyLink,
    shareArticle
  }
}
