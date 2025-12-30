<template>
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600 md:cursor-default"
    :class="{ 'cursor-pointer': isMobile }"
    @click="handleCardClick"
  >
    <!-- 文章封面图 -->
    <NuxtLink
      v-if="showCover"
      :to="`/blog/${post.slug}`"
      class="relative block h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 sm:h-52"
    >
      <OptimizedImage
        :src="coverImage"
        :alt="post.title"
        :default-src="getDefaultImage(post.title)"
        image-class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        container-class="h-full w-full"
        :loading="'lazy'"
        :show-placeholder="true"
        :use-default-on-no-size="true"
      />
      <!-- 分类标签覆盖层 -->
      <div
        v-if="post.category"
        class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-blue-400"
      >
        {{ post.category }}
      </div>
    </NuxtLink>

    <!-- 文章内容 -->
    <div class="flex flex-1 flex-col p-4 sm:p-6">
      <!-- 分类和日期 -->
      <div class="mb-3 flex items-center gap-2">
        <span
          v-if="post.category"
          class="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        >
          {{ post.category }}
        </span>
        <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Icon name="heroicons:calendar" class="mr-1.5 h-3.5 w-3.5" />
          <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
        </div>
      </div>

      <!-- 文章标题 -->
      <h2 class="mb-2 line-clamp-2 min-h-[3rem] sm:mb-3 sm:min-h-[3.5rem]">
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 sm:text-xl"
        >
          {{ post.title }}
        </NuxtLink>
      </h2>

      <!-- 文章摘要 -->
      <p class="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {{ post.excerpt || '暂无摘要' }}
      </p>

      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="mb-4 flex flex-wrap gap-1.5">
        <NuxtLink
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          :to="`/blog?tag=${encodeURIComponent(tag)}`"
          class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
          @click.stop
        >
          #{{ tag }}
        </NuxtLink>
        <span
          v-if="post.tags.length > 3"
          class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400"
        >
          +{{ post.tags.length - 3 }}
        </span>
      </div>

      <!-- 分隔线 -->
      <div class="mb-4 border-t border-gray-200 dark:border-gray-700" />

      <!-- 文章元信息和操作 -->
      <div class="flex items-center justify-between">
        <!-- 统计信息 -->
        <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <!-- 阅读时间 -->
          <span class="flex items-center gap-1">
            <Icon name="heroicons:clock" class="h-3.5 w-3.5" />
            <span>{{ calculateReadTime(post.excerpt || post.content || '') }} 分钟</span>
          </span>
          <!-- 点赞数 -->
          <span v-if="likesCount > 0" class="flex items-center gap-1">
            <Icon name="heroicons:heart" class="h-3.5 w-3.5 text-red-500" />
            <span>{{ likesCount }}</span>
          </span>
          <!-- 评论数 -->
          <span v-if="commentsCount > 0" class="flex items-center gap-1">
            <Icon name="heroicons:chat-bubble-left-right" class="h-3.5 w-3.5" />
            <span>{{ commentsCount }}</span>
          </span>
        </div>

        <!-- 阅读更多按钮 -->
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-all hover:gap-2 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
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

// 计算封面图片URL
const coverImage = computed(() => {
  // 如果图片加载失败或没有提供图片，使用默认图片
  if (imageError.value || !props.post.cover_image) {
    return getDefaultImage(props.post.title)
  }
  // 使用用户提供的图片
  return props.post.cover_image
})

// 处理图片加载错误
const handleImageError = () => {
  // 如果用户提供的图片加载失败，切换到默认图片
  if (props.post.cover_image && !imageError.value) {
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
