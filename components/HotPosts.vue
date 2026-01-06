<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
    <!-- 标题 -->
    <div class="border-b border-gray-200 p-4 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h3 class="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <Icon name="heroicons:fire" class="mr-2 h-5 w-5 text-orange-500" />
          热门文章
        </h3>
        <NuxtLink
          to="/blog?sort=hot"
          class="text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          查看更多 →
        </NuxtLink>
      </div>
    </div>

    <!-- 内容 -->
    <div class="p-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="space-y-3">
        <div
          v-for="i in limit"
          :key="i"
          class="flex animate-pulse items-start space-x-3 rounded-lg p-3"
        >
          <div class="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      <!-- 热门文章列表 -->
      <div v-else-if="hotPosts && hotPosts.length > 0" class="space-y-2">
        <NuxtLink
          v-for="(post, index) in hotPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group flex items-start space-x-3 rounded-lg p-3 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <!-- 排名徽章 -->
          <div
            class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform group-hover:scale-110"
            :class="getRankClass(index)"
          >
            {{ index + 1 }}
          </div>

          <!-- 文章信息 -->
          <div class="min-w-0 flex-1">
            <h4
              class="mb-2 line-clamp-2 text-sm font-medium leading-snug text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
            >
              {{ post.title }}
            </h4>

            <!-- 统计信息 -->
            <div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
              <span class="flex items-center space-x-1" title="阅读量">
                <Icon name="heroicons:eye" class="h-3 w-3" />
                <span>{{ formatNumber(post.view_count || 0) }}</span>
              </span>
              <span class="flex items-center space-x-1" title="点赞数">
                <Icon name="heroicons:heart" class="h-3 w-3" />
                <span>{{ formatNumber(post.likes_count || 0) }}</span>
              </span>
              <span class="flex items-center space-x-1" title="评论数">
                <Icon name="heroicons:chat-bubble-left-right" class="h-3 w-3" />
                <span>{{ formatNumber(post.comments_count || 0) }}</span>
              </span>
            </div>
          </div>

          <!-- 热度分数（可选显示） -->
          <div
            v-if="showScore && post.hot_score"
            class="flex-shrink-0 text-xs font-medium text-orange-600 dark:text-orange-400"
            :title="`热度分数: ${Math.round(post.hot_score)}`"
          >
            🔥{{ Math.round(post.hot_score) }}
          </div>
        </NuxtLink>
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400"
      >
        <Icon name="heroicons:fire" class="mb-2 h-12 w-12 text-gray-300 dark:text-gray-600" />
        <p class="text-sm">暂无热门文章</p>
        <p class="mt-1 text-xs">快去发布文章吧</p>
      </div>

      <!-- 错误提示 -->
      <div
        v-if="error"
        class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
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

const { fetchHotPosts, hotPosts, loading, error } = useHotPosts()

// 组件挂载时获取热门文章
onMounted(async () => {
  await fetchHotPosts(props.limit, props.days, props.useDecay)
})

// 获取排名样式
const getRankClass = (index: number): string => {
  const classes: Record<number, string> = {
    0: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-md',
    1: 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md',
    2: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md'
  }

  return classes[index] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
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

<style scoped>
/* 平滑动画 */
.group {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover {
  transform: translateX(2px);
}

/* 金银铜牌渐变效果 */
@keyframes shine {
  0% {
    background-position: -100%;
  }
  100% {
    background-position: 200%;
  }
}

.bg-gradient-to-br {
  background-size: 200% auto;
}

.group:hover .bg-gradient-to-br {
  animation: shine 2s linear infinite;
}
</style>
