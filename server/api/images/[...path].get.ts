/**
 * Supabase Storage 图片代理 API
 * 用于 IPX 从 Supabase Storage 获取图片
 *
 * 路由: GET /api/images/bucket-name/path/to/image.jpg
 */

import { LRUCache } from 'lru-cache'

// 内存缓存配置（缓存图片元数据，不缓存图片本身）
const metadataCache = new LRUCache<string, { url: string; headers: Headers }>({
  max: 500, // 最多缓存 500 个图片元数据
  ttl: 1000 * 60 * 60 // 1 小时
})

export default defineEventHandler(async event => {
  try {
    // 获取完整路径（例如：blog-images/user123/photo.jpg）
    const path = event.context.params?.path || ''

    if (!path) {
      throw createError({
        statusCode: 400,
        message: '缺少图片路径'
      })
    }

    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl

    if (!supabaseUrl) {
      throw createError({
        statusCode: 500,
        message: 'Supabase URL 未配置'
      })
    }

    // 构建 Supabase Storage 公共 URL
    const imageUrl = `${supabaseUrl}/storage/v1/object/public/${path}`

    // 检查缓存
    const cached = metadataCache.get(imageUrl)
    if (cached) {
      console.log(`[Image Proxy] 缓存命中: ${path}`)
      // 使用缓存的 URL 重新获取（利用浏览器/CDN 缓存）
      const response = await fetch(cached.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (!response.ok) {
        throw createError({
          statusCode: response.status,
          message: `图片获取失败: ${response.statusText}`
        })
      }

      // 设置响应头
      setResponseHeaders(event, {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 年缓存
        'X-Cache': 'HIT'
      })

      // 返回图片数据
      return response.arrayBuffer()
    }

    // 首次请求，从 Supabase 获取
    console.log(`[Image Proxy] 获取图片: ${imageUrl}`)

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      // 如果是 404，返回更友好的错误
      if (response.status === 404) {
        throw createError({
          statusCode: 404,
          message: `图片不存在: ${path}`
        })
      }

      throw createError({
        statusCode: response.status,
        message: `图片获取失败: ${response.statusText}`
      })
    }

    // 缓存元数据
    metadataCache.set(imageUrl, {
      url: imageUrl,
      headers: response.headers
    })

    // 设置响应头
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    setResponseHeaders(event, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 年缓存
      'X-Cache': 'MISS'
    })

    // 返回图片数据
    return response.arrayBuffer()
  } catch (error: any) {
    console.error('[Image Proxy] 错误:', error)

    // 如果已经是 H3Error，直接抛出
    if (error.statusCode) {
      throw error
    }

    // 其他错误
    throw createError({
      statusCode: 500,
      message: error.message || '图片代理失败'
    })
  }
})
