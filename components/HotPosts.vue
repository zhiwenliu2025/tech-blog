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
        class="group inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 transition-all duration-150 hover:bg-primary-50 hover:text-primary-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
      >
        查看更多
        <Icon
          name="heroicons:arrow-right"
          class="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </NuxtLink>
    </div>

    <!-- 内容 -->
    <div class="divide-y divide-gray-100 dark:divide-gray-800">
      <!-- 加载状态 -->
      <div v-if="loading">
        <div v-for="i in limit" :key="i" class="flex animate-pulse items-start gap-3 p-3">
          <div class="h-7 w-7 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800" />
          <div class="flex-1 space-y-2 pt-0.5">
            <div class="h-3 w-4/5 rounded-md bg-gray-100 dark:bg-gray-800" />
            <div class="h-2.5 w-2/3 rounded-md bg-gray-100 dark:bg-gray-800" />
            <div class="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      </div>

      <!-- 热门文章列表 -->
      <template v-else-if="hotPosts && hotPosts.length > 0">
        <NuxtLink
          v-for="(post, index) in hotPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group flex items-start gap-3 p-3 transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/60"
        >
          <!-- 排名徽章 -->
          <div
            class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
            :class="getRankClass(index)"
          >
            {{ index + 1 }}
          </div>

          <!-- 文章信息 -->
          <div class="min-w-0 flex-1">
            <h4
              class="mb-1.5 line-clamp-2 text-xs font-medium leading-snug text-gray-800 transition-colors group-hover:text-primary-600 dark:text-gray-200 dark:group-hover:text-primary-400"
            >
              {{ post.title }}
            </h4>

            <!-- 热度条 -->
            <div
              class="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <div
                class="h-full rounded-full transition-all duration-700"
                :class="getHeatBarClass(index)"
                :style="{ width: `${getHeatWidth(post)}%` }"
              />
            </div>

            <!-- 统计数字 -->
            <div class="flex items-center gap-2.5 text-xs text-gray-400 dark:text-gray-500">
              <span class="flex items-center gap-0.5">
                <Icon name="heroicons:eye" class="h-3 w-3" />
                {{ formatNumber(post.view_count || 0) }}
              </span>
              <span class="flex items-center gap-0.5">
                <Icon name="heroicons:heart" class="h-3 w-3 text-red-400" />
                {{ formatNumber(post.likes_count || 0) }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </template>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center py-8 text-center">
        <Icon name="heroicons:fire" class="mb-2 h-8 w-8 text-gray-200 dark:text-gray-700" />
        <p class="text-xs text-gray-400">暂无热门文章</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="mx-3 mb-3 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ error }}
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

const { posts: hotPosts, loading, error, fetchHotPosts } = useCachedHotPosts()

onMounted(async () => {
  await fetchHotPosts(props.limit, props.days)
})

// 获取排名徽章样式
const getRankClass = (index: number): string => {
  const classes: Record<number, string> = {
    0: 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-sm shadow-yellow-400/30',
    1: 'bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-sm shadow-slate-400/20',
    2: 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-sm shadow-orange-400/20'
  }
  return classes[index] ?? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
}

// 热度条颜色：前三名用暖色，其余用蓝色
const getHeatBarClass = (index: number): string => {
  if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-orange-500'
  if (index === 1) return 'bg-gradient-to-r from-slate-400 to-slate-500'
  if (index === 2) return 'bg-gradient-to-r from-orange-400 to-amber-400'
  return 'bg-gradient-to-r from-primary-400 to-primary-500'
}

// 相对热度宽度（以列表中最高浏览量为基准）
const getHeatWidth = (post: any): number => {
  if (!hotPosts.value?.length) return 20
  const maxViews = Math.max(...hotPosts.value.map((p: any) => p.view_count || 0))
  if (maxViews === 0) return 20
  return Math.max(12, Math.round(((post.view_count || 0) / maxViews) * 100))
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return num.toString()
}
</script>
