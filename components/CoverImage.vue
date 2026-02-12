<template>
  <div class="relative overflow-hidden" :class="containerClass">
    <!-- 加载占位符 -->
    <div
      v-if="!imageLoaded && showPlaceholder"
      class="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
    >
      <div class="flex h-full items-center justify-center">
        <Icon name="heroicons:photo" class="h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>
    </div>

    <!-- NuxtImg - IPX v3 自动处理 WebP 转换 -->
    <NuxtImg
      :src="imageSrc"
      :alt="alt"
      :preset="preset"
      :sizes="computedSizes"
      :width="width"
      :height="height"
      :loading="loading"
      :placeholder="placeholder"
      :class="[
        'transition-opacity duration-300',
        imageLoaded ? 'opacity-100' : 'opacity-0',
        imageClass
      ]"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 错误状态 -->
    <div
      v-if="hasError && showError"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
    >
      <div class="flex flex-col items-center gap-2 text-gray-400">
        <Icon name="heroicons:exclamation-triangle" class="h-10 w-10" />
        <span class="text-sm">图片加载失败</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * CoverImage - 封面图片组件
 *
 * 使用 NuxtImg + IPX v3 provider 自动优化和转换为 WebP 格式
 *
 * 特性:
 * - 自动 WebP 格式转换
 * - 响应式图片（srcset）
 * - 懒加载支持
 * - 占位符和错误处理
 * - 多种预设配置
 */

interface Props {
  // 图片源 URL
  src: string
  // 替代文本
  alt: string
  // 预设配置名称 ('cover' | 'thumbnail' | 'hd' | 'mobile')
  preset?: string
  // 响应式尺寸配置
  sizes?: string
  // 图片宽度（可选，用于固定尺寸）
  width?: number
  // 图片高度（可选，用于固定尺寸）
  height?: number
  // 加载策略
  loading?: 'lazy' | 'eager'
  // 占位符配置 [width, height, quality, blur]
  placeholder?: number[]
  // 是否显示占位符
  showPlaceholder?: boolean
  // 是否显示错误状态
  showError?: boolean
  // 图片类名
  imageClass?: string
  // 容器类名
  containerClass?: string
  // 默认图片（加载失败时使用）
  fallbackSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  preset: 'cover',
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px',
  loading: 'lazy',
  placeholder: () => [20, 11, 75, 5],
  showPlaceholder: true,
  showError: true,
  imageClass: 'w-full h-full object-cover',
  containerClass: 'aspect-video',
  width: undefined,
  height: undefined,
  fallbackSrc: undefined
})

const imageLoaded = ref(false)
const hasError = ref(false)
const currentSrc = ref(props.src)

// 计算图片源
const imageSrc = computed(() => {
  if (hasError.value && props.fallbackSrc) {
    return props.fallbackSrc
  }
  return currentSrc.value
})

// 计算响应式尺寸
const computedSizes = computed(() => {
  return props.sizes
})

// 处理图片加载成功
const handleLoad = () => {
  imageLoaded.value = true
  hasError.value = false
}

// 处理图片加载错误
const handleError = () => {
  if (!hasError.value && props.fallbackSrc) {
    // 尝试使用备用图片
    hasError.value = true
    currentSrc.value = props.fallbackSrc
    imageLoaded.value = false
  } else {
    // 显示错误状态
    hasError.value = true
    imageLoaded.value = false
  }
}

// 监听 src 变化
watch(
  () => props.src,
  newSrc => {
    imageLoaded.value = false
    hasError.value = false
    currentSrc.value = newSrc
  }
)
</script>
