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
      <p class="text-xs text-gray-500 dark:text-gray-400">支持 JPG、PNG、GIF、WebP，最大 5MB</p>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
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

    <!-- 图片预览 -->
    <div
      v-if="imageUrl && !uploading"
      class="relative rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800"
    >
      <img :src="imageUrl" alt="预览" class="max-h-64 w-full rounded-lg object-contain" />
      <button
        type="button"
        class="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
        @click="removeImage"
      >
        <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
      </button>
    </div>

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ error }}
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
  (e: 'uploaded', url: string): void
  (e: 'error', error: string): void
}>()

const supabase = useSupabaseClient()
const { user } = useSupabaseAuth()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const imageUrl = ref<string | null>(null)
const error = ref<string | null>(null)
const isDragging = ref(false)

// 压缩图片
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

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('图片压缩失败'))
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          },
          file.type,
          0.8 // 质量 80%
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

  try {
    // 压缩图片
    const compressedFile = await compressImage(file)

    // 生成文件名
    const fileExt = compressedFile.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const folder = props.postId || user.value.id
    const fileName = `${folder}/${timestamp}-${random}.${fileExt}`

    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    // 上传到 Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: false
      })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (uploadError) throw uploadError

    // 获取公共 URL
    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fileName)

    imageUrl.value = urlData.publicUrl
    emit('uploaded', urlData.publicUrl)
  } catch (err: any) {
    console.error('上传失败:', err)
    error.value = err.message || '上传失败，请重试'
    emit('error', error.value)
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
  const file = target.files?.[0]
  if (file) {
    uploadImage(file)
  }
  // 重置 input，允许重复选择同一文件
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 处理拖拽
const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) {
    uploadImage(file)
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 移除图片
const removeImage = () => {
  imageUrl.value = null
  error.value = null
}

// 暴露方法供外部调用
defineExpose({
  uploadImage,
  removeImage,
  imageUrl: readonly(imageUrl)
})
</script>
