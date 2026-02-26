<template>
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800/60 dark:hover:shadow-primary-500/5"
    :class="{ 'cursor-pointer active:scale-[0.99]': isMobile }"
    @click="handleCardClick"
  >
    <!-- 左侧悬停高亮条 -->
    <div
      class="absolute left-0 top-0 h-full w-0.5 scale-y-0 rounded-r-full bg-gradient-to-b from-primary-400 to-primary-600 transition-transform duration-300 group-hover:scale-y-100"
    />

    <!-- 封面图 -->
    <NuxtLink
      v-if="showCover"
      :to="`/blog/${post.slug}`"
      class="relative block h-44 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 sm:h-48 md:h-52"
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
      <!-- 封面渐变遮罩 -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <!-- 分类徽章 -->
      <div
        v-if="post.category"
        class="absolute left-3 top-3 rounded-md bg-slate-900/85 px-2.5 py-1 font-mono text-xs font-medium text-primary-300 backdrop-blur-sm"
      >
        {{ post.category }}
      </div>
    </NuxtLink>

    <!-- 卡片内容 -->
    <div class="flex flex-1 flex-col p-4 sm:p-5">
      <!-- 元信息行 -->
      <div class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <!-- 无封面时显示分类 -->
        <span
          v-if="post.category && !showCover"
          class="inline-flex items-center rounded-md bg-primary-50 px-2 py-0.5 font-mono text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
        >
          {{ post.category }}
        </span>
        <!-- 日期 -->
        <time
          :datetime="post.created_at"
          class="flex items-center gap-1 font-mono text-xs text-slate-400 dark:text-slate-500"
        >
          <Icon name="heroicons:calendar" class="h-3 w-3" />
          {{ formatDate(post.created_at) }}
        </time>
        <!-- 阅读时间 -->
        <span class="flex items-center gap-1 font-mono text-xs text-slate-400 dark:text-slate-500">
          <Icon name="heroicons:clock" class="h-3 w-3" />
          {{ calculateReadTime(post.excerpt || post.content || '') }} min
        </span>
      </div>

      <!-- 标题 -->
      <h2 class="mb-2 line-clamp-2">
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400 sm:text-[17px]"
        >
          {{ post.title }}
        </NuxtLink>
      </h2>

      <!-- 摘要 -->
      <p
        class="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
      >
        {{ post.excerpt || '暂无摘要' }}
      </p>

      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="mb-4 flex flex-wrap gap-1.5">
        <NuxtLink
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          :to="`/blog?tag=${encodeURIComponent(tag)}`"
          class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-300"
          @click.stop
        >
          #{{ tag }}
        </NuxtLink>
        <span
          v-if="post.tags.length > 3"
          class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-400 dark:bg-slate-800 dark:text-slate-500"
        >
          +{{ post.tags.length - 3 }}
        </span>
      </div>

      <!-- 底部：统计 + 阅读按钮 -->
      <div
        class="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800"
      >
        <!-- 统计信息 -->
        <div class="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span v-if="likesCount > 0" class="flex items-center gap-1">
            <Icon name="heroicons:heart" class="h-3.5 w-3.5 text-rose-400" />
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

        <!-- 阅读按钮 -->
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="group/read inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary-600 transition-all hover:gap-1.5 dark:text-primary-400"
        >
          阅读全文
          <Icon
            name="heroicons:arrow-right"
            class="h-3.5 w-3.5 transition-transform group-hover/read:translate-x-0.5"
          />
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
