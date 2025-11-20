<template>
  <article
    class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800"
  >
    <!-- 文章封面图 -->
    <div v-if="post.cover_image" class="h-48 overflow-hidden">
      <img
        :src="post.cover_image"
        :alt="post.title"
        class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>

    <!-- 文章内容 -->
    <div class="p-6">
      <!-- 分类标签 -->
      <div class="mb-2 flex items-center">
        <span
          v-if="post.category"
          class="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200"
        >
          {{ post.category }}
        </span>
        <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
          {{ formatDate(post.created_at) }}
        </span>
      </div>

      <!-- 文章标题 -->
      <h2 class="mb-2 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
        >
          {{ post.title }}
        </NuxtLink>
      </h2>

      <!-- 文章摘要 -->
      <p class="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300">
        {{ post.excerpt }}
      </p>

      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="mb-4 flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
        >
          #{{ tag }}
        </span>
        <span
          v-if="post.tags.length > 3"
          class="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
        >
          +{{ post.tags.length - 3 }}
        </span>
      </div>

      <!-- 文章元信息 -->
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div class="flex items-center space-x-4">
          <!-- 阅读时间 -->
          <span class="flex items-center">
            <Icon name="i-heroicons-clock" class="mr-1 h-4 w-4" />
            {{ post.read_time || 5 }} 分钟阅读
          </span>
          <!-- 点赞数 -->
          <span class="flex items-center">
            <Icon name="i-heroicons-heart" class="mr-1 h-4 w-4" />
            {{ likesCount }}
          </span>
          <!-- 评论数 -->
          <span class="flex items-center">
            <Icon name="i-heroicons-chat-bubble-left-right" class="mr-1 h-4 w-4" />
            {{ commentsCount }}
          </span>
        </div>
        <!-- 阅读更多 -->
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="flex items-center font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          阅读更多
          <Icon name="i-heroicons-arrow-right" class="ml-1 h-4 w-4" />
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
}

// 使用默认值
withDefaults(defineProps<Props>(), {
  likesCount: 0,
  commentsCount: 0
})

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
