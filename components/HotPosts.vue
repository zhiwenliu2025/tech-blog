<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- 标题栏 -->
    <div
      class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800"
    >
      <h3 class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
        <span
          class="flex h-5 w-5 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-900/30"
        >
          <Icon name="heroicons:fire" class="h-3.5 w-3.5 text-orange-500" />
        </span>
        热门文章
      </h3>
      <NuxtLink
        to="/blog?sort=hot"
        class="group inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 transition-all duration-150 hover:bg-orange-50 hover:text-orange-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
      >
        查看更多
        <Icon
          name="heroicons:arrow-right"
          class="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </NuxtLink>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="px-4 py-1">
      <div v-for="i in limit" :key="i" class="flex animate-pulse items-start gap-3 py-3">
        <div class="w-5 flex-shrink-0 pt-0.5">
          <div class="h-4 w-4 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div class="flex-1 space-y-2">
          <div class="h-3 w-4/5 rounded-md bg-gray-100 dark:bg-gray-800" />
          <div class="h-2 w-1/3 rounded-md bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div v-else-if="hotPosts && hotPosts.length > 0" class="py-1">
      <NuxtLink
        v-for="(post, index) in hotPosts"
        :key="post.id"
        :to="`/blog/${post.slug}`"
        class="group relative flex items-start gap-3 px-4 py-3 transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/60"
      >
        <!-- 左侧 hover 彩条 -->
        <span
          class="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-r-full bg-orange-400 transition-all duration-200 group-hover:h-8"
        />

        <!-- 排名数字 -->
        <span
          class="min-w-[1.25rem] flex-shrink-0 pt-0.5 text-center font-mono text-sm font-bold leading-none"
          :class="getRankTextClass(index)"
        >
          {{ index + 1 }}
        </span>

        <!-- 文章信息 -->
        <div class="min-w-0 flex-1">
          <h4
            class="mb-1.5 line-clamp-2 text-xs font-medium leading-snug text-gray-800 transition-colors group-hover:text-primary-600 dark:text-gray-200 dark:group-hover:text-primary-400"
          >
            {{ post.title }}
          </h4>

          <!-- 热度条 -->
          <div
            class="mb-1.5 h-0.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="getHeatBarClass(index)"
              :style="{ width: `${getHeatWidth(post)}%` }"
            />
          </div>

          <!-- 统计 -->
          <div class="flex items-center gap-2.5 text-[10px] text-gray-400 dark:text-gray-500">
            <span class="flex items-center gap-0.5">
              <Icon name="heroicons:eye" class="h-2.5 w-2.5" />
              {{ formatNumber(post.view_count || 0) }}
            </span>
            <span class="flex items-center gap-0.5">
              <Icon name="heroicons:heart" class="h-2.5 w-2.5 text-red-400" />
              {{ formatNumber(post.likes_count || 0) }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center py-8">
      <Icon name="heroicons:fire" class="mb-2 h-7 w-7 text-gray-200 dark:text-gray-700" />
      <p class="text-xs text-gray-400">暂无热门文章</p>
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

// 排名数字颜色（金/银/铜 + 淡灰）
const getRankTextClass = (index: number): string => {
  if (index === 0) return 'text-yellow-500'
  if (index === 1) return 'text-slate-400'
  if (index === 2) return 'text-orange-400'
  return 'text-gray-300 dark:text-gray-600'
}

// 热度条颜色
const getHeatBarClass = (index: number): string => {
  if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-orange-500'
  if (index === 1) return 'bg-gradient-to-r from-slate-300 to-slate-400'
  if (index === 2) return 'bg-gradient-to-r from-orange-300 to-amber-400'
  return 'bg-gradient-to-r from-primary-300 to-primary-400'
}

// 相对热度宽度
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
