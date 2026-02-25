<template>
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-900/60"
    :class="{ 'cursor-pointer active:scale-[0.99]': isMobile }"
    @click="handleCardClick"
  >
    <!-- 左侧悬停时显示的高亮条 -->
    <div
      class="absolute left-0 top-0 h-full w-0.5 scale-y-0 rounded-r-full bg-primary-500 transition-transform duration-200 group-hover:scale-y-100"
    />

    <!-- 文章封面图 -->
    <NuxtLink
      v-if="showCover"
      :to="`/blog/${post.slug}`"
      class="relative block h-44 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 sm:h-48 md:h-52"
    >
      <NuxtImg
        :src="coverImageSrc"
        :alt="post.title"
        preset="cover"
        :sizes="responsiveSizes"
        loading="lazy"
        :placeholder="[20, 11, 75, 5]"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        @error="handleImageError"
      />
      <!-- 分类标签覆盖层 -->
      <div
        v-if="post.category"
        class="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-primary-700 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-primary-300"
      >
        {{ post.category }}
      </div>
    </NuxtLink>

    <!-- 文章内容 -->
    <div class="flex flex-1 flex-col p-4 sm:p-5">
      <!-- 元信息行 -->
      <div class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span v-if="post.category && !showCover" class="badge-primary text-xs">
          {{ post.category }}
        </span>
        <span class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <Icon name="heroicons:calendar" class="h-3.5 w-3.5" />
          <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
        </span>
        <span class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <Icon name="heroicons:clock" class="h-3.5 w-3.5" />
          {{ calculateReadTime(post.excerpt || post.content || '') }} 分钟
        </span>
      </div>

      <!-- 文章标题 -->
      <h2 class="mb-2 line-clamp-2">
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400 sm:text-lg"
        >
          {{ post.title }}
        </NuxtLink>
      </h2>

      <!-- 文章摘要 -->
      <p
        class="mb-3.5 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400"
      >
        {{ post.excerpt || '暂无摘要' }}
      </p>

      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="mb-3.5 flex flex-wrap gap-1.5">
        <NuxtLink
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          :to="`/blog?tag=${encodeURIComponent(tag)}`"
          class="tag"
          @click.stop
        >
          #{{ tag }}
        </NuxtLink>
        <span v-if="post.tags.length > 3" class="badge-gray"> +{{ post.tags.length - 3 }} </span>
      </div>

      <!-- 底部：统计信息和阅读按钮 -->
      <div
        class="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800"
      >
        <!-- 统计信息 -->
        <div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span v-if="likesCount > 0" class="flex items-center gap-1">
            <Icon name="heroicons:heart" class="h-3.5 w-3.5 text-red-400" />
            {{ likesCount }}
          </span>
          <span v-if="commentsCount > 0" class="flex items-center gap-1">
            <Icon name="heroicons:chat-bubble-left-right" class="h-3.5 w-3.5" />
            {{ commentsCount }}
          </span>
          <span class="flex items-center gap-1">
            <Icon name="heroicons:eye" class="h-3.5 w-3.5" />
            {{ post.view_count || 0 }}
          </span>
        </div>

        <!-- 阅读更多 -->
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 transition-all hover:gap-1.5 dark:text-primary-400"
        >
          阅读
          <Icon name="heroicons:arrow-right" class="h-3.5 w-3.5" />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

// 定义组件属性
interface Props {
  post: BlogPost
  likesCount?: number
  commentsCount?: number
  showCover?: boolean
}

// 使用默认值
const props = withDefaults(defineProps<Props>(), {
  likesCount: 0,
  commentsCount: 0,
  showCover: true
})

// 默认图片URL（使用占位图片服务，基于文章标题生成唯一图片）
const getDefaultImage = (title: string) => {
  // 使用 picsum.photos 基于标题生成一个稳定的占位图片
  const seed = title
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString()
  return `https://picsum.photos/seed/${seed}/800/400`
}

// 图片加载错误处理
const imageError = ref(false)

// 封面图片源 - 直接使用原始 URL，让 NuxtImg + IPX 处理优化和 WebP 转换
const coverImageSrc = computed(() => {
  // 如果图片加载失败或没有提供图片，使用默认图片
  if (imageError.value || !props.post.cover_image) {
    return getDefaultImage(props.post.title)
  }
  // 直接返回原始 URL，NuxtImg 会通过 IPX provider 自动优化为 WebP
  return props.post.cover_image
})

// 响应式尺寸配置 - 直接定义，不需要 composable
const responsiveSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px'

// 处理图片加载错误
const handleImageError = () => {
  if (props.post.cover_image && !imageError.value) {
    console.warn(`[BlogPostCard] 图片加载失败: ${props.post.cover_image}`)
    imageError.value = true
  }
}

// 当文章变化时重置错误状态
watch(
  () => props.post.cover_image,
  () => {
    imageError.value = false
  }
)

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays} 天前`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} 周前`
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} 个月前`
  } else {
    return `${Math.floor(diffDays / 365)} 年前`
  }
}

// 计算阅读时间（基于字数）
const calculateReadTime = (text: string) => {
  if (!text) return 5
  // 移除HTML标签（如果有）
  const plainText = text.replace(/<[^>]*>/g, '')
  // 假设每分钟阅读200字
  const wordsPerMinute = 200
  const wordCount = plainText.length
  const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  return readTime
}

// 检测是否为移动端
const isMobile = ref(false)

// 检测移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768 // md breakpoint
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 处理卡片点击（仅在移动端）
const handleCardClick = (event: MouseEvent) => {
  // 如果点击的是标签链接或其他有 stopPropagation 的元素，不处理
  const target = event.target as HTMLElement
  // 检查是否点击的是链接、按钮或其他交互元素
  if (target.closest('a') || target.closest('button') || target.closest('[data-no-click]')) {
    return
  }

  // 仅在移动端执行跳转
  if (isMobile.value) {
    navigateTo(`/blog/${props.post.slug}`)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
