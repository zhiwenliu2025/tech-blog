import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

/**
 * 手动上传图片 API
 * 支持 WebP 转换，与导入功能使用相同的转换逻辑
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/avif'
]

export default defineEventHandler(async event => {
  try {
    // 验证用户身份
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        message: '未授权：请先登录'
      })
    }

    // 获取用户ID（兼容 id 和 sub 属性）
    const userId = user.id || (user as any).sub
    if (!userId) {
      throw createError({
        statusCode: 400,
        message: '无法获取用户ID'
      })
    }

    // 解析表单数据
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: '未找到上传的文件'
      })
    }

    // 获取文件
    const fileEntry = formData.find(entry => entry.name === 'file')
    if (!fileEntry || !fileEntry.data) {
      throw createError({
        statusCode: 400,
        message: '未找到文件数据'
      })
    }

    const fileBuffer = fileEntry.data
    const filename = fileEntry.filename || 'image.jpg'
    const mimeType = fileEntry.type || 'image/jpeg'

    // 验证文件类型
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw createError({
        statusCode: 400,
        message: `不支持的文件类型: ${mimeType}`
      })
    }

    // 验证文件大小
    if (fileBuffer.length > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        message: `文件过大: ${(fileBuffer.length / 1024 / 1024).toFixed(1)}MB (最大 10MB)`
      })
    }

    // ===== WebP 转换逻辑（与 import-utils.ts 保持一致） =====

    let processedBuffer = fileBuffer
    let finalContentType = mimeType
    let shouldConvertToWebP = true

    // 跳过这些格式的转换
    const preserveFormats = ['image/svg+xml', 'image/gif', 'image/webp']
    if (preserveFormats.some(format => mimeType.includes(format))) {
      shouldConvertToWebP = false
    }

    if (shouldConvertToWebP) {
      try {
        // 导入 Sharp 进行转换
        const sharp = (await import('sharp')).default

        // 转换为 WebP 格式
        processedBuffer = await sharp(fileBuffer)
          .webp({
            quality: 85,
            effort: 4 // 平衡压缩和速度 (0-6)
          })
          .toBuffer()

        finalContentType = 'image/webp'

        console.log(
          `[手动上传] ${filename} - 原始: ${(fileBuffer.length / 1024).toFixed(1)}KB, WebP: ${(processedBuffer.length / 1024).toFixed(1)}KB, 节省: ${((1 - processedBuffer.length / fileBuffer.length) * 100).toFixed(1)}%`
        )
      } catch (conversionError: any) {
        // 如果转换失败，使用原始格式
        console.warn(`[WebP转换失败] ${filename}: ${conversionError.message}, 使用原始格式`)
        processedBuffer = fileBuffer
        finalContentType = mimeType
      }
    }

    // 计算 MD5 哈希用于去重
    const crypto = await import('crypto')
    const hash = crypto.createHash('md5').update(processedBuffer).digest('hex')

    // 确定文件扩展名
    const ext =
      shouldConvertToWebP && finalContentType.includes('webp')
        ? 'webp'
        : getImageExtension(filename, mimeType)

    // 使用哈希作为文件名（与导入逻辑一致）
    const filePath = `${userId}/manual/hash-${hash}.${ext}`

    // 初始化 Supabase 客户端
    const supabase = await serverSupabaseClient(event)

    // 检查文件是否已存在（去重）
    const { data: existingFiles } = await supabase.storage
      .from('blog-images')
      .list(`${userId}/manual`, {
        search: `hash-${hash}`
      })

    if (existingFiles && existingFiles.length > 0) {
      // 图片已存在，返回已有的 URL
      const existingFile = existingFiles[0]
      if (!existingFile) {
        throw createError({
          statusCode: 500,
          message: '获取已存在文件失败'
        })
      }

      const {
        data: { publicUrl }
      } = supabase.storage.from('blog-images').getPublicUrl(`${userId}/manual/${existingFile.name}`)

      console.log(`[图片去重] 检测到重复图片，使用已存在的: ${existingFile.name}`)

      return {
        success: true,
        url: publicUrl,
        isDuplicate: true,
        originalSize: fileBuffer.length,
        processedSize: processedBuffer.length,
        savedBytes: fileBuffer.length - processedBuffer.length,
        format: ext
      }
    }

    // 上传新图片
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, processedBuffer, {
        contentType: finalContentType.split(';')[0]?.trim() ?? 'image/webp',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      // 如果文件已存在（竞态条件）
      if (
        uploadError.message.includes('already exists') ||
        uploadError.message.includes('duplicate')
      ) {
        const {
          data: { publicUrl }
        } = supabase.storage.from('blog-images').getPublicUrl(filePath)

        console.log(`[图片去重] 上传时检测到重复，使用已存在的`)

        return {
          success: true,
          url: publicUrl,
          isDuplicate: true,
          originalSize: fileBuffer.length,
          processedSize: processedBuffer.length,
          savedBytes: fileBuffer.length - processedBuffer.length,
          format: ext
        }
      }

      throw createError({
        statusCode: 500,
        message: `上传失败: ${uploadError.message}`
      })
    }

    // 获取公共 URL
    const {
      data: { publicUrl }
    } = supabase.storage.from('blog-images').getPublicUrl(filePath)

    console.log(`[图片上传] 新图片上传成功: ${filePath}`)

    return {
      success: true,
      url: publicUrl,
      isDuplicate: false,
      originalSize: fileBuffer.length,
      processedSize: processedBuffer.length,
      savedBytes: fileBuffer.length - processedBuffer.length,
      format: ext,
      converted: shouldConvertToWebP
    }
  } catch (error: any) {
    console.error('[图片上传错误]', error)

    // 如果是 createError 抛出的错误，直接返回
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || '上传失败'
    })
  }
})

/**
 * 获取图片扩展名
 */
function getImageExtension(filename: string, contentType: string): string {
  // 尝试从内容类型获取
  const typeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/avif': 'avif',
    'image/tiff': 'tiff'
  }

  const ext = typeMap[contentType.split(';')[0]?.trim() ?? '']
  if (ext) return ext

  // 从文件名获取
  const match = filename.match(/\.(\w+)$/)
  if (match && match[1]) {
    const fileExt = match[1].toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif', 'tiff'].includes(fileExt)) {
      return fileExt === 'jpeg' ? 'jpg' : fileExt
    }
  }

  return 'jpg' // 默认
}
