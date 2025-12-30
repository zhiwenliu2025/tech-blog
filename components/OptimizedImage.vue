<template>
  <div class="relative overflow-hidden" :class="containerClass">
    <!-- 占位符/骨架屏 -->
    <div
      v-if="!loaded && showPlaceholder"
      class="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700"
      :class="placeholderClass"
    >
      <div class="flex h-full items-center justify-center">
        <Icon name="heroicons:photo" class="h-8 w-8 text-gray-400" />
      </div>
    </div>

    <!-- 实际图片 -->
    <img
      :key="imageKey"
      :src="imageSrc"
      :srcset="isUsingDefault ? undefined : srcset"
      :sizes="sizes"
      :alt="alt"
      :loading="loading"
      :class="['transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0', imageClass]"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 加载错误占位符 -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
      :class="errorClass"
    >
      <div class="flex flex-col items-center gap-2 text-gray-400">
        <Icon name="heroicons:exclamation-triangle" class="h-8 w-8" />
        <span class="text-xs">图片加载失败</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  sizes?: string
  imageClass?: string
  containerClass?: string
  placeholderClass?: string
  errorClass?: string
  showPlaceholder?: boolean
  // 响应式图片断点
  breakpoints?: number[]
  // 默认图片 URL（当图片加载失败或找不到时使用）
  defaultSrc?: string
  // 是否在找不到尺寸时使用默认图片
  useDefaultOnNoSize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  showPlaceholder: true,
  breakpoints: () => [640, 768, 1024, 1280, 1536],
  useDefaultOnNoSize: true,
  width: undefined,
  height: undefined,
  imageClass: undefined,
  containerClass: undefined,
  placeholderClass: undefined,
  errorClass: undefined,
  defaultSrc: undefined
})

const loaded = ref(false)
const hasError = ref(false)
const currentSrc = ref(props.src)
const isUsingDefault = ref(false)
const imageKey = ref(0)

// 生成响应式 srcset
const srcset = computed(() => {
  if (!props.src || props.src.startsWith('data:') || props.src.startsWith('blob:')) {
    return undefined
  }

  // 如果图片来自外部服务，尝试生成不同尺寸的 URL
  // 这里可以根据实际的图片服务 API 调整
  try {
    // 检查是否是完整 URL
    const isAbsoluteUrl = props.src.startsWith('http://') || props.src.startsWith('https://')

    if (!isAbsoluteUrl) {
      // 相对路径，不生成 srcset
      return undefined
    }

    const url = new URL(props.src)

    // 如果 URL 已经有尺寸参数，不生成 srcset
    if (url.searchParams.has('w') || url.searchParams.has('width')) {
      return undefined
    }

    // 生成不同尺寸的 URL
    return props.breakpoints
      .map(breakpoint => {
        const sizedUrl = new URL(url.toString())
        sizedUrl.searchParams.set('w', breakpoint.toString())
        return `${sizedUrl.toString()} ${breakpoint}w`
      })
      .join(', ')
  } catch (error) {
    // URL 解析失败，返回 undefined
    return undefined
  }
})

// 获取默认图片
const getDefaultImage = (seed?: string) => {
  if (props.defaultSrc) {
    return props.defaultSrc
  }
  // 如果没有提供默认图片，使用基于 alt 的占位图
  const imageSeed = seed || props.alt || 'default'
  const seedValue = imageSeed
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString()
  return `https://picsum.photos/seed/${seedValue}/800/400`
}

// 图片源
const imageSrc = computed(() => {
  // 如果正在使用默认图片，返回默认图片
  if (isUsingDefault.value) {
    return getDefaultImage(props.alt)
  }
  // 如果原始图片为空，直接使用默认图片
  if (!props.src) {
    return getDefaultImage(props.alt)
  }
  // 返回当前源（可能是原始图片或默认图片）
  return currentSrc.value || props.src
})

const handleLoad = (event: Event) => {
  const img = event.target as HTMLImageElement

  // 检查图片是否有有效尺寸
  if (props.useDefaultOnNoSize && !isUsingDefault.value) {
    const hasValidSize = img.naturalWidth > 0 && img.naturalHeight > 0

    // 如果图片没有有效尺寸，切换到默认图片
    if (!hasValidSize) {
      switchToDefault()
      return
    }
  }

  // 图片加载成功且有有效尺寸
  loaded.value = true
  hasError.value = false
}

const handleError = () => {
  // 如果当前不是默认图片，尝试使用默认图片
  if (!isUsingDefault.value && (props.defaultSrc || props.useDefaultOnNoSize)) {
    switchToDefault()
  } else {
    // 如果已经是默认图片或没有默认图片，显示错误状态
    hasError.value = true
    loaded.value = false
  }
}

// 切换到默认图片
const switchToDefault = () => {
  isUsingDefault.value = true
  currentSrc.value = getDefaultImage(props.alt)
  hasError.value = false
  loaded.value = false
  // 增加 key 值强制重新渲染图片元素
  imageKey.value++
}

// 重置状态当 src 改变时
watch(
  () => props.src,
  () => {
    loaded.value = false
    hasError.value = false
    isUsingDefault.value = false
    currentSrc.value = props.src
    imageKey.value++
  }
)
</script>
