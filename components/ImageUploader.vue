<template>
  <div class="image-uploader">
    <!-- 上传按钮 -->
    <div
      v-if="!uploading && !imageUrl"
      class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-colors hover:border-primary-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-primary-400 dark:hover:bg-gray-700"
      :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDragging }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="triggerFileInput"
    >
      <Icon name="i-heroicons-photo" class="mb-2 h-12 w-12 text-gray-400" />
      <p class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        点击或拖拽图片到此处上传
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        支持 JPG、PNG、GIF、WebP，最大 5MB{{ props.multiple ? '，可多选' : '' }}
      </p>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        :multiple="props.multiple"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- 上传进度 -->
    <div
      v-if="uploading"
      class="flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-8 dark:border-gray-600 dark:bg-gray-800"
    >
      <div
        class="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"
      />
      <p class="text-sm text-gray-700 dark:text-gray-300">上传中... {{ uploadProgress }}%</p>
      <div
        class="mt-2 h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
      >
        <div
          class="h-full bg-primary-500 transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
    </div>

    <!-- 图片预览和 Alt 文本编辑 -->
    <div
      v-if="imageUrl && !uploading"
      class="space-y-3 rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800"
    >
      <div class="relative">
        <img
          :src="imageUrl"
          :alt="altText || '预览'"
          class="max-h-64 w-full rounded-lg object-contain"
        />
        <button
          type="button"
          class="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
          @click="removeImage"
        >
          <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
        </button>
      </div>
      <!-- Alt 文本输入 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          图片描述（Alt 文本）
        </label>
        <input
          v-model="altText"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          placeholder="输入图片描述（用于 SEO 和可访问性）"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          描述图片内容，有助于 SEO 和视觉障碍用户
        </p>
      </div>
      <!-- 确认按钮 -->
      <button
        type="button"
        class="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        @click="confirmUpload"
      >
        确认插入图片
      </button>
    </div>

    <!-- 错误提示和重试 -->
    <div
      v-if="error"
      class="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
    >
      <div class="flex items-center justify-between">
        <span>{{ error }}</span>
        <button
          v-if="lastUploadFile"
          type="button"
          class="ml-2 rounded px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/40"
          @click="retryUpload"
        >
          重试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    postId?: string | null
    multiple?: boolean
  }>(),
  {
    postId: null,
    multiple: false
  }
)

const emit = defineEmits<{
  (e: 'uploaded', data: { url: string; alt?: string }): void
  (e: 'error', error: string): void
}>()

const supabase = useSupabaseClient()
const { user } = useSupabaseAuth()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const imageUrl = ref<string | null>(null)
const altText = ref<string>('')
const error = ref<string | null>(null)
const isDragging = ref(false)
const lastUploadFile = ref<File | null>(null)
const uploadedFileName = ref<string | null>(null)

// 检查是否支持 WebP
const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

// 验证图片尺寸
const validateImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const maxDimension = 5000
        if (img.width > maxDimension || img.height > maxDimension) {
          reject(new Error(`图片尺寸过大（${img.width}x${img.height}px），最大支持 5000x5000px`))
          return
        }
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

// 压缩图片（支持 WebP 转换）
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // 最大宽度 1920px
        const maxWidth = 1920
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('无法创建画布上下文'))
          return
        }

        // 使用高质量缩放算法
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // 优先使用 WebP 格式（如果支持）
        const useWebP = supportsWebP()
        const outputType = useWebP ? 'image/webp' : file.type
        const outputQuality = useWebP ? 0.85 : 0.8 // WebP 可以使用更高的质量

        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('图片压缩失败'))
              return
            }
            // 生成新的文件名
            const originalName = file.name.split('.')[0]
            const newExt = useWebP ? 'webp' : file.name.split('.').pop() || 'jpg'
            const compressedFile = new File([blob], `${originalName}.${newExt}`, {
              type: outputType,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          },
          outputType,
          outputQuality
        )
      }
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

// 验证文件
const validateFile = (file: File): string | null => {
  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return '不支持的图片格式，请使用 JPG、PNG、GIF 或 WebP'
  }

  // 检查文件大小（5MB）
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return '图片大小不能超过 5MB'
  }

  return null
}

// 上传图片
const uploadImage = async (file: File) => {
  if (!user.value) {
    error.value = '请先登录'
    emit('error', '请先登录')
    return
  }

  // 验证文件
  const validationError = validateFile(file)
  if (validationError) {
    error.value = validationError
    emit('error', validationError)
    return
  }

  uploading.value = true
  uploadProgress.value = 0
  error.value = null
  lastUploadFile.value = file

  try {
    // 验证图片尺寸
    await validateImageDimensions(file)

    // 压缩图片
    const compressedFile = await compressImage(file)

    // 生成文件名
    const fileExt = compressedFile.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const folder = props.postId || user.value.id
    const fileName = `${folder}/${timestamp}-${random}.${fileExt}`

    // 使用 XMLHttpRequest 实现真实上传进度
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const supabaseKey = config.public.supabaseKey

    const uploadPromise = new Promise<{ data: any; error: any }>((resolve, reject) => {
      // 获取上传 URL 和认证信息
      supabase.auth.getSession().then(({ data: sessionData, error: sessionError }) => {
        if (sessionError || !sessionData?.session) {
          reject(new Error('未登录'))
          return
        }

        const xhr = new XMLHttpRequest()
        const uploadUrl = `${supabaseUrl}/storage/v1/object/blog-images/${fileName}`

        xhr.upload.addEventListener('progress', e => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100)
            uploadProgress.value = Math.min(percentComplete, 95) // 保留 5% 给完成阶段
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            uploadProgress.value = 100
            try {
              const response = xhr.responseText ? JSON.parse(xhr.responseText) : {}
              resolve({ data: response, error: null })
            } catch {
              resolve({ data: {}, error: null })
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText)
              reject(error)
            } catch {
              reject(new Error(`上传失败: ${xhr.statusText || '未知错误'}`))
            }
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('网络错误，上传失败'))
        })

        xhr.addEventListener('abort', () => {
          reject(new Error('上传已取消'))
        })

        xhr.open('POST', uploadUrl)
        xhr.setRequestHeader('Authorization', `Bearer ${sessionData.session.access_token}`)
        xhr.setRequestHeader('apikey', supabaseKey)
        xhr.setRequestHeader('x-upsert', 'false')
        // 注意：cache-control 是响应头，不能通过请求头设置
        // Supabase Storage 会自动设置适当的缓存响应头

        // 创建 FormData
        const formData = new FormData()
        formData.append('file', compressedFile)

        xhr.send(formData)
      })
    })

    const { data, error: uploadError } = await uploadPromise

    if (uploadError) throw uploadError

    // 获取公共 URL
    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName)

    imageUrl.value = urlData.publicUrl
    uploadedFileName.value = fileName
    lastUploadFile.value = null // 清除，表示上传成功
    // 不立即触发 uploaded 事件，等待用户确认 Alt 文本
  } catch (err: any) {
    console.error('上传失败:', err)
    const errorMessage = err.message || '上传失败，请重试'
    error.value = errorMessage
    emit('error', errorMessage)
  } finally {
    uploading.value = false
    setTimeout(() => {
      uploadProgress.value = 0
    }, 500)
  }
}

// 处理文件选择
const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  const fileArray = Array.from(files)
  if (props.multiple && fileArray.length > 1) {
    // 批量上传
    handleMultipleFiles(fileArray)
  } else if (fileArray[0]) {
    // 单文件上传
    uploadImage(fileArray[0])
  }

  // 重置 input，允许重复选择同一文件
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 处理多文件上传
const handleMultipleFiles = async (files: File[]) => {
  // 对于多文件，逐个上传并插入
  for (const file of files) {
    if (!file) continue
    try {
      await uploadImage(file)
      // 如果上传成功，自动插入（不等待 Alt 文本）
      if (imageUrl.value) {
        emit('uploaded', {
          url: imageUrl.value,
          alt: undefined
        })
        // 重置状态，准备下一个文件
        imageUrl.value = null
        altText.value = ''
      }
    } catch (err) {
      console.error('批量上传中的文件失败:', err)
      // 继续上传下一个文件
    }
  }
}

// 处理拖拽
const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

  const fileArray = Array.from(files)
  if (props.multiple && fileArray.length > 1) {
    // 批量上传
    handleMultipleFiles(fileArray)
  } else if (fileArray[0]) {
    // 单文件上传
    uploadImage(fileArray[0])
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 移除图片
const removeImage = () => {
  imageUrl.value = null
  altText.value = ''
  error.value = null
}

// 处理 Alt 文本变化
const handleAltTextChange = () => {
  // Alt 文本变化时实时更新，但不触发上传事件
}

// 确认上传（插入图片）
const confirmUpload = () => {
  if (imageUrl.value) {
    emit('uploaded', {
      url: imageUrl.value,
      alt: altText.value.trim() || undefined
    })
  }
}

// 重试上传
const retryUpload = async () => {
  if (lastUploadFile.value) {
    // 如果之前上传成功但用户取消了，先删除已上传的文件
    if (uploadedFileName.value) {
      try {
        await supabase.storage.from('blog-images').remove([uploadedFileName.value])
      } catch (err) {
        console.warn('删除已上传文件失败:', err)
      }
      uploadedFileName.value = null
    }
    await uploadImage(lastUploadFile.value)
  }
}

// 删除 Storage 中的图片
const deleteImageFromStorage = async (imageUrl: string | undefined): Promise<boolean> => {
  if (!imageUrl) return false

  try {
    // 从 URL 中提取文件路径
    // URL 格式: https://xxx.supabase.co/storage/v1/object/public/blog-images/path/to/file.webp
    const urlParts = imageUrl.split('/blog-images/')
    if (urlParts.length !== 2) {
      console.warn('无法从 URL 提取文件路径:', imageUrl)
      return false
    }

    const filePath = urlParts[1]
    if (!filePath) {
      console.warn('文件路径为空')
      return false
    }

    const { error } = await supabase.storage.from('blog-images').remove([filePath])

    if (error) {
      console.error('删除图片失败:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('删除图片异常:', err)
    return false
  }
}

// 暴露方法供外部调用
defineExpose({
  uploadImage,
  removeImage,
  deleteImageFromStorage,
  imageUrl: readonly(imageUrl),
  altText: readonly(altText)
})
</script>
