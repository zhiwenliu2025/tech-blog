<template>
  <div class="card overflow-hidden">
    <!-- 标题 -->
    <div class="sidebar-widget-header">
      <h3 class="sidebar-widget-title">
        <Icon name="heroicons:fire" class="h-4 w-4 text-orange-500" />
        热门文章
      </h3>
      <NuxtLink
        to="/blog?sort=hot"
        class="text-xs font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        更多
      </NuxtLink>
    </div>

    <!-- 内容 -->
    <div class="p-2">
      <!-- 加载状态 -->
      <div v-if="loading" class="space-y-1">
        <div
          v-for="i in limit"
          :key="i"
          class="flex animate-pulse items-start gap-3 rounded-lg p-3"
        >
          <div class="h-7 w-7 flex-shrink-0 rounded-full bg-gray-100 dark:bg-gray-800" />
          <div class="flex-1 space-y-2">
            <div class="h-3.5 w-3/4 rounded-md bg-gray-100 dark:bg-gray-800" />
            <div class="h-3 w-1/2 rounded-md bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      </div>

      <!-- 热门文章列表 -->
      <div v-else-if="hotPosts && hotPosts.length > 0">
        <NuxtLink
          v-for="(post, index) in hotPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group flex items-start gap-3 rounded-lg p-3 transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/80"
        >
          <!-- 排名徽章 -->
          <div
            class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold"
            :class="getRankClass(index)"
          >
            {{ index + 1 }}
          </div>

          <!-- 文章信息 -->
          <div class="min-w-0 flex-1">
            <h4
              class="mb-1 line-clamp-2 text-xs font-medium leading-snug text-gray-800 transition-colors group-hover:text-primary-600 dark:text-gray-200 dark:group-hover:text-primary-400"
            >
              {{ post.title }}
            </h4>
            <div class="flex items-center gap-2.5 text-xs text-gray-400 dark:text-gray-500">
              <span class="flex items-center gap-0.5">
                <Icon name="heroicons:eye" class="h-3 w-3" />
                {{ formatNumber(post.view_count || 0) }}
              </span>
              <span class="flex items-center gap-0.5">
                <Icon name="heroicons:heart" class="h-3 w-3" />
                {{ formatNumber(post.likes_count || 0) }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center py-8 text-center">
        <Icon name="heroicons:fire" class="mb-2 h-8 w-8 text-gray-200 dark:text-gray-700" />
        <p class="text-xs text-gray-400">暂无热门文章</p>
      </div>

      <!-- 错误提示 -->
      <div
        v-if="error"
        class="rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  limit?: number
  days?: number
  showScore?: boolean
  useDecay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  limit: 5,
  days: 30,
  showScore: false,
  useDecay: true
})

// 使用缓存版本的热门文章 composable
const { posts: hotPosts, loading, error, fetchHotPosts } = useCachedHotPosts()

// 组件挂载时获取热门文章（通过缓存API）
onMounted(async () => {
  await fetchHotPosts(props.limit, props.days)
})

// 获取排名样式
const getRankClass = (index: number): string => {
  const classes: Record<number, string> = {
    0: 'bg-yellow-400 text-white',
    1: 'bg-gray-400 text-white',
    2: 'bg-orange-400 text-white'
  }

  return classes[index] || 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
}

// 格式化数字（1000 -> 1k, 1000000 -> 1M）
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return num.toString()
}
</script>
