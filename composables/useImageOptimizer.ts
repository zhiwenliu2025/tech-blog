/**
 * 图片优化工具 Composable
 * 处理 Supabase Storage URL，转换为可被 Nuxt Image 处理的路径
 */

export interface ImageOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png' | 'gif'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  preset?: 'cover' | 'thumbnail' | 'hd'
}

export function useImageOptimizer() {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl

  /**
   * 检查是否是 Supabase Storage URL
   */
  function isSupabaseUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false

    try {
      const urlObj = new URL(url)
      return (
        urlObj.hostname.includes('supabase.co') &&
        urlObj.pathname.includes('/storage/v1/object/public/')
      )
    } catch {
      return false
    }
  }

  /**
   * 从 Supabase URL 提取路径
   * 输入: https://xxx.supabase.co/storage/v1/object/public/blog-images/user123/photo.jpg
   * 输出: blog-images/user123/photo.jpg
   */
  function extractSupabasePath(url: string): string | null {
    if (!isSupabaseUrl(url)) return null

    try {
      const urlObj = new URL(url)
      const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/(.+)/)
      return match ? match[1] : null
    } catch {
      return null
    }
  }

  /**
   * 将 Supabase URL 转换为本地代理路径
   * 输入: https://xxx.supabase.co/storage/v1/object/public/blog-images/user123/photo.jpg
   * 输出: /api/images/blog-images/user123/photo.jpg
   */
  function convertToProxyUrl(url: string): string {
    const path = extractSupabasePath(url)
    if (!path) {
      // 如果不是 Supabase URL，返回原 URL
      return url
    }

    return `/api/images/${path}`
  }

  /**
   * 获取优化后的图片 URL（用于 NuxtImg 组件）
   * 这个函数返回代理路径，让 IPX 处理优化
   */
  function getOptimizedUrl(url: string, options?: ImageOptions): string {
    // 如果是空或无效 URL，返回原值
    if (!url || typeof url !== 'string') return url

    // 如果是 Supabase URL，转换为代理路径
    if (isSupabaseUrl(url)) {
      return convertToProxyUrl(url)
    }

    // 其他 URL 直接返回（可能是外部图片或已经是代理路径）
    return url
  }

  /**
   * 检测浏览器支持的图片格式
   */
  function detectImageFormat(): 'avif' | 'webp' | 'jpeg' {
    // 服务端渲染时默认返回 webp
    if (process.server) return 'webp'

    // 客户端检测
    const canvas = document.createElement('canvas')
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      return 'avif'
    }
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp'
    }
    return 'jpeg'
  }

  /**
   * 获取响应式图片的 sizes 属性
   */
  function getResponsiveSizes(breakpoints?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }): string {
    const defaultBreakpoints = {
      mobile: '100vw',
      tablet: '50vw',
      desktop: '33vw'
    }

    const bp = { ...defaultBreakpoints, ...breakpoints }

    return `(max-width: 640px) ${bp.mobile}, (max-width: 1024px) ${bp.tablet}, ${bp.desktop}`
  }

  /**
   * 预加载关键图片
   */
  function preloadImage(url: string, options?: ImageOptions) {
    if (process.server) return

    const optimizedUrl = getOptimizedUrl(url, options)
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = optimizedUrl

    // 如果指定了宽度，添加 imagesrcset
    if (options?.width) {
      const srcset = [640, 768, 1024, 1280]
        .filter(w => w <= (options.width || Infinity))
        .map(w => `${optimizedUrl}?w=${w} ${w}w`)
        .join(', ')

      if (srcset) {
        link.setAttribute('imagesrcset', srcset)
      }
    }

    document.head.appendChild(link)
  }

  /**
   * 批量预加载图片
   */
  function preloadImages(urls: string[], options?: ImageOptions) {
    urls.forEach(url => preloadImage(url, options))
  }

  return {
    isSupabaseUrl,
    extractSupabasePath,
    convertToProxyUrl,
    getOptimizedUrl,
    detectImageFormat,
    getResponsiveSizes,
    preloadImage,
    preloadImages
  }
}
