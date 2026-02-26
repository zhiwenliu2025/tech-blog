<template>
  <div class="avatar-uploader">
    <!-- 头像预览 -->
    <div class="relative inline-block">
      <div
        class="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg dark:border-gray-800 dark:bg-gray-700"
        :class="{ 'ring-2 ring-primary-500': isDragging }"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="triggerFileInput"
      >
        <img
          v-if="previewUrl || avatarUrl"
          :src="previewUrl || avatarUrl"
          alt="头像"
          class="h-full w-full object-cover"
        />
        <div v-else class="flex h-full w-full items-center justify-center">
          <Icon name="i-heroicons-user" class="h-12 w-12 text-gray-400" />
        </div>

        <!-- 上传遮罩层 -->
        <div
          v-if="uploading"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div class="text-center text-white">
            <div
              class="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            <p class="text-xs">{{ uploadProgress }}%</p>
          </div>
        </div>

        <!-- 编辑图标 -->
        <div
          v-if="!uploading"
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all hover:bg-opacity-50"
        >
          <Icon
            name="i-heroicons-camera"
            class="h-6 w-6 text-white opacity-0 transition-opacity hover:opacity-100"
          />
        </div>
      </div>

      <!-- 上传按钮 -->
      <button
        type="button"
        class="absolute -bottom-1 -right-1 rounded-full bg-primary-600 p-2 text-white shadow-lg transition-colors hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        :disabled="uploading"
        @click.stop="triggerFileInput"
      >
        <Icon v-if="!uploading" name="i-heroicons-camera" class="h-4 w-4" />
        <div
          v-else
          class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
        />
      </button>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ error }}
      <button
        v-if="lastUploadFile"
        type="button"
        class="ml-2 font-medium underline"
        @click="retryUpload"
      >
        重试
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  avatarUrl?: string | null
  size?: number
}>()

const emit = defineEmits<{
  (e: 'uploaded', url: string): void
  (e: 'error', error: string): void
}>()

const supabase = useSupabaseClient()
const { user } = useSupabaseAuth()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const previewUrl = ref<string | null>(null)
const error = ref<string | null>(null)
const isDragging = ref(false)
const lastUploadFile = ref<File | null>(null)

// 检查是否支持 WebP
const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

// 压缩并裁剪头像（圆形，固定尺寸）
const processAvatar = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const size = props.size || 200 // 默认 200x200
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('无法创建画布上下文'))
          return
        }

        // 创建圆形裁剪
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
        ctx.clip()

        // 计算缩放和居中
        const scale = Math.max(size / img.width, size / img.height)
        const x = (size - img.width * scale) / 2
        const y = (size - img.height * scale) / 2

        // 使用高质量缩放
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

        // 优先使用 WebP 格式
        const useWebP = supportsWebP()
        const outputType = useWebP ? 'image/webp' : file.type
        const outputQuality = useWebP ? 0.9 : 0.85 // 头像使用更高质量

        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('图片处理失败'))
              return
            }
            const newExt = useWebP ? 'webp' : file.name.split('.').pop() || 'jpg'
            const processedFile = new File([blob], `avatar.${newExt}`, {
              type: outputType,
              lastModified: Date.now()
            })
            resolve(processedFile)
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
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return '不支持的图片格式，请使用 JPG、PNG、GIF 或 WebP'
  }

  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    return '图片大小不能超过 2MB'
  }

  return null
}

// 上传头像
const uploadAvatar = async (file: File) => {
  // 获取 session 以确保用户 ID 可用
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !sessionData?.session?.user) {
    error.value = '请先登录'
    emit('error', '请先登录')
    return
  }

  // 获取用户ID（兼容 id 和 sub 属性）
  const userId = sessionData.session.user.id || (sessionData.session.user as any).sub
  if (!userId) {
    error.value = '无法获取用户ID'
    emit('error', '无法获取用户ID，请重新登录')
    return
  }

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
    // 处理头像（压缩、裁剪、转换为 WebP）
    const processedFile = await processAvatar(file)

    // 生成预览
    const previewBlob = URL.createObjectURL(processedFile)
    previewUrl.value = previewBlob

    // 生成文件名
    const fileExt = processedFile.name.split('.').pop() || 'jpg'
    const fileName = `${userId}/avatar.${fileExt}`

    // 使用 XMLHttpRequest 实现真实上传进度
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const supabaseKey = config.public.supabaseKey

    const uploadPromise = new Promise<{ data: any; error: any }>((resolve, reject) => {
      // 使用之前获取的 session
      if (!sessionData?.session) {
        reject(new Error('未登录'))
        return
      }

      const xhr = new XMLHttpRequest()
      const uploadUrl = `${supabaseUrl}/storage/v1/object/avatars/${fileName}`

      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100)
          uploadProgress.value = Math.min(percentComplete, 95)
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
      xhr.setRequestHeader('x-upsert', 'true') // 允许覆盖
      // 注意：cache-control 是响应头，不能通过请求头设置
      // Supabase Storage 会自动设置适当的缓存响应头

      const formData = new FormData()
      formData.append('file', processedFile)

      xhr.send(formData)
    })

    const { data, error: uploadError } = await uploadPromise

    if (uploadError) throw uploadError

    // 获取公共 URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName)

    // 更新用户资料
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: urlData.publicUrl
      })
      .eq('id', userId)

    if (updateError) throw updateError

    // 清理预览 URL
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }

    emit('uploaded', urlData.publicUrl)
    lastUploadFile.value = null
  } catch (err: any) {
    console.error('上传头像失败:', err)
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
  const file = target.files?.[0]
  if (file) {
    uploadAvatar(file)
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 处理拖拽
const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) {
    uploadAvatar(file)
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 重试上传
const retryUpload = async () => {
  if (lastUploadFile.value) {
    await uploadAvatar(lastUploadFile.value)
  }
}
</script>
