import type { SupabaseClient } from '@supabase/supabase-js'

// ===== Types =====

export interface ImageReport {
  total: number
  success: number
  failed: string[]
  duplicates: number // 重复图片数量
}

export interface ImportResult {
  title: string
  content: string
  excerpt: string
  coverImage: string | null
  sourceUrl: string
  sourceSiteName: string
  author: string | null
  publishedAt: string | null
  tags: string[]
  images: ImageReport
}

// ===== URL Validation =====

const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1']

const BLOCKED_RANGES = [
  /^10\./, // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12
  /^192\.168\./, // 192.168.0.0/16
  /^169\.254\./ // link-local
]

/**
 * Validate URL for safety (prevent SSRF etc.)
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url)

    // Must be http or https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: '仅支持 http 和 https 协议' }
    }

    const hostname = parsed.hostname

    // Block known internal hosts
    if (BLOCKED_HOSTS.includes(hostname)) {
      return { valid: false, error: '不允许访问内网地址' }
    }

    // Block private IP ranges
    for (const range of BLOCKED_RANGES) {
      if (range.test(hostname)) {
        return { valid: false, error: '不允许访问内网地址' }
      }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: '无效的 URL 格式' }
  }
}

// ===== Rate Limiting =====

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10 // 10 requests per hour
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour in ms

/**
 * Check rate limit for a user
 */
export function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(userId)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT - 1 }
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT - record.count }
}

// ===== Image Processing =====

const IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g
const MAX_SINGLE_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_TOTAL_IMAGE_SIZE = 50 * 1024 * 1024 // 50 MB
const IMAGE_DOWNLOAD_TIMEOUT = 15000 // 15 seconds
const MAX_CONCURRENT_DOWNLOADS = 3

/**
 * Get file extension from URL or content type
 */
function getImageExtension(url: string, contentType?: string): string {
  // Try from content-type first
  if (contentType) {
    const typeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/bmp': 'bmp',
      'image/avif': 'avif'
    }
    const ext = typeMap[contentType.split(';')[0]?.trim() ?? '']
    if (ext) return ext
  }

  // Try from URL
  try {
    const pathname = new URL(url).pathname
    const match = pathname.match(/\.(\w+)$/)
    if (match && match[1]) {
      const ext = match[1].toLowerCase()
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(ext)) {
        return ext === 'jpeg' ? 'jpg' : ext
      }
    }
  } catch {
    // ignore
  }

  return 'jpg' // default fallback
}

/**
 * Resolve relative image URL to absolute
 */
function resolveImageUrl(imageUrl: string, sourceUrl: string): string {
  try {
    // Already absolute
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    // Protocol-relative
    if (imageUrl.startsWith('//')) {
      const protocol = new URL(sourceUrl).protocol
      return `${protocol}${imageUrl}`
    }
    // Relative
    return new URL(imageUrl, sourceUrl).href
  } catch {
    return imageUrl
  }
}

/**
 * Handle lazy-loaded image src attributes
 */
export function resolveLazyImageSrc(element: Element): string | null {
  // Check common lazy-load attributes
  const lazyAttrs = ['data-src', 'data-original', 'data-lazy-src', 'data-actualsrc']
  for (const attr of lazyAttrs) {
    const value = element.getAttribute(attr)
    if (value) return value
  }
  return element.getAttribute('src')
}

/**
 * Download a single image and upload to Supabase Storage
 * Checks for duplicate images based on content hash
 * Converts images to WebP format for optimization
 */
async function processImage(
  imageUrl: string,
  sourceHost: string,
  userId: string,
  supabase: SupabaseClient
): Promise<{ success: boolean; newUrl?: string; error?: string; isDuplicate?: boolean }> {
  try {
    // Download image with appropriate headers
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), IMAGE_DOWNLOAD_TIMEOUT)

    let response: Response
    try {
      response = await fetch(imageUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: `https://${sourceHost}/`,
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      })
    } catch {
      // Retry without Referer (some sites block specific referers)
      response = await fetch(imageUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }

    // Validate content type
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.startsWith('image/')) {
      return { success: false, error: `非图片类型: ${contentType}` }
    }

    // Get image data
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Check size
    if (buffer.length > MAX_SINGLE_IMAGE_SIZE) {
      return { success: false, error: `图片过大: ${(buffer.length / 1024 / 1024).toFixed(1)}MB` }
    }

    // Convert to WebP format (unless it's already WebP or SVG/GIF which should be preserved)
    let processedBuffer = buffer
    let finalContentType = contentType
    let shouldConvertToWebP = true

    // Skip conversion for these formats
    const preserveFormats = ['image/svg+xml', 'image/gif', 'image/webp']
    if (preserveFormats.some(format => contentType.includes(format))) {
      shouldConvertToWebP = false
    }

    if (shouldConvertToWebP) {
      try {
        // Import sharp dynamically
        const sharp = (await import('sharp')).default

        // Convert to WebP with optimization
        processedBuffer = await sharp(buffer)
          .webp({
            quality: 85,
            effort: 4 // Balance between compression and speed (0-6)
          })
          .toBuffer()

        finalContentType = 'image/webp'

        console.log(
          `[图片转换] ${imageUrl} - 原始: ${(buffer.length / 1024).toFixed(1)}KB, WebP: ${(processedBuffer.length / 1024).toFixed(1)}KB, 节省: ${((1 - processedBuffer.length / buffer.length) * 100).toFixed(1)}%`
        )
      } catch (conversionError: any) {
        // If conversion fails, use original
        console.warn(`[图片转换失败] ${imageUrl}: ${conversionError.message}, 使用原始格式`)
        processedBuffer = buffer
        finalContentType = contentType
      }
    }

    // Calculate MD5 hash for duplicate detection (using processed buffer)
    const crypto = await import('crypto')
    const hash = crypto.createHash('md5').update(processedBuffer).digest('hex')

    // Always use .webp extension for converted images, or preserve original
    const ext =
      shouldConvertToWebP && finalContentType.includes('webp')
        ? 'webp'
        : getImageExtension(imageUrl, contentType)

    // Check if this image already exists (by hash)
    const hashFilePath = `${userId}/imported/hash-${hash}.${ext}`

    // Try to get existing image URL
    const { data: existingFiles } = await supabase.storage
      .from('blog-images')
      .list(`${userId}/imported`, {
        search: `hash-${hash}`
      })

    if (existingFiles && existingFiles.length > 0) {
      // Image already exists, return existing URL
      const existingFile = existingFiles[0]
      const {
        data: { publicUrl }
      } = supabase.storage
        .from('blog-images')
        .getPublicUrl(`${userId}/imported/${existingFile.name}`)

      console.log(`[图片去重] 检测到重复图片，使用已存在的: ${existingFile.name}`)
      return { success: true, newUrl: publicUrl, isDuplicate: true }
    }

    // No duplicate found, upload new image with hash-based filename
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(hashFilePath, processedBuffer, {
        contentType: finalContentType.split(';')[0]?.trim() ?? 'image/webp',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      // If file already exists (race condition), try to get it
      if (
        uploadError.message.includes('already exists') ||
        uploadError.message.includes('duplicate')
      ) {
        const {
          data: { publicUrl }
        } = supabase.storage.from('blog-images').getPublicUrl(hashFilePath)
        console.log(`[图片去重] 上传时检测到重复，使用已存在的`)
        return { success: true, newUrl: publicUrl, isDuplicate: true }
      }
      return { success: false, error: `上传失败: ${uploadError.message}` }
    }

    // Get public URL
    const {
      data: { publicUrl }
    } = supabase.storage.from('blog-images').getPublicUrl(hashFilePath)

    console.log(`[图片上传] 新图片上传成功: ${hashFilePath}`)
    return { success: true, newUrl: publicUrl, isDuplicate: false }
  } catch (err: any) {
    return { success: false, error: err.message || '未知错误' }
  }
}

/**
 * Process all images in markdown content:
 * - Download external images
 * - Upload to Supabase Storage
 * - Replace URLs in markdown
 */
export async function processAllImages(
  markdown: string,
  sourceUrl: string,
  userId: string,
  supabase: SupabaseClient
): Promise<{ content: string; report: ImageReport }> {
  const sourceHost = new URL(sourceUrl).hostname

  // Extract all image URLs
  const images: Array<{ fullMatch: string; alt: string; url: string }> = []
  let match: RegExpExecArray | null

  // Reset lastIndex
  const regex = new RegExp(IMAGE_REGEX.source, IMAGE_REGEX.flags)
  while ((match = regex.exec(markdown)) !== null) {
    const rawUrl = match[2]
    if (!rawUrl) continue
    const url = resolveImageUrl(rawUrl, sourceUrl)

    // Skip already uploaded Supabase images
    if (url.includes('supabase') && url.includes('blog-images')) {
      continue
    }

    // Skip data URIs
    if (url.startsWith('data:')) {
      continue
    }

    images.push({ fullMatch: match[0], alt: match[1] || '', url })
  }

  const report: ImageReport = {
    total: images.length,
    success: 0,
    failed: [],
    duplicates: 0
  }

  if (images.length === 0) {
    return { content: markdown, report }
  }

  // Process images with concurrency limit
  let totalSize = 0
  let content = markdown

  // Process in batches of MAX_CONCURRENT_DOWNLOADS
  for (let i = 0; i < images.length; i += MAX_CONCURRENT_DOWNLOADS) {
    const batch = images.slice(i, i + MAX_CONCURRENT_DOWNLOADS)
    const results = await Promise.all(
      batch.map(img => processImage(img.url, sourceHost, userId, supabase))
    )

    for (let j = 0; j < batch.length; j++) {
      const img = batch[j]!
      const result = results[j]!

      if (result.success && result.newUrl) {
        // Replace URL in markdown
        content = content.replace(img.fullMatch, `![${img.alt}](${result.newUrl})`)
        report.success++
        // Count duplicates
        if (result.isDuplicate) {
          report.duplicates++
        }
      } else {
        report.failed.push(img.url)
        console.warn(`图片下载失败 [${img.url}]: ${result.error}`)
      }
    }

    // Check total size (approximate)
    if (totalSize > MAX_TOTAL_IMAGE_SIZE) {
      console.warn('图片总大小超限，跳过剩余图片')
      // Mark remaining images as failed
      for (let k = i + MAX_CONCURRENT_DOWNLOADS; k < images.length; k++) {
        report.failed.push(images[k]!.url)
      }
      break
    }
  }

  return { content, report }
}

// ===== Source Attribution =====

/**
 * Append source attribution to markdown content
 */
export function appendSourceAttribution(
  markdown: string,
  title: string,
  sourceUrl: string,
  author: string | null
): string {
  const date = new Date().toISOString().split('T')[0]
  let attribution = `\n\n---\n\n> 本文转载自 [${title}](${sourceUrl})`
  if (author) {
    attribution += `\n> 原作者：${author} | 导入时间：${date}`
  } else {
    attribution += `\n> 导入时间：${date}`
  }

  return markdown + attribution
}

// ===== Content Size Check =====

const MAX_CONTENT_SIZE = 1 * 1024 * 1024 // 1 MB

export function checkContentSize(content: string): boolean {
  return new TextEncoder().encode(content).length <= MAX_CONTENT_SIZE
}
