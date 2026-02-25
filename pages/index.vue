<template>
  <div>
    <!-- Hero 区域 -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white"
    >
      <!-- 点状网格背景 -->
      <div
        class="absolute inset-0 opacity-40"
        style="
          background-image: radial-gradient(circle, rgb(148 163 184 / 0.2) 1px, transparent 1px);
          background-size: 28px 28px;
        "
      />
      <!-- 渐变光晕 -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl" />
        <div class="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div
          class="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/10 blur-3xl"
        />
      </div>

      <div class="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div class="mx-auto max-w-3xl text-center">
          <!-- 标语徽章 -->
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300 backdrop-blur-sm"
          >
            <span class="relative flex h-2 w-2">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"
              />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
            </span>
            持续更新中
          </div>

          <h1
            class="mb-5 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
          >
            <span
              class="bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent"
            >
              探索技术世界
            </span>
          </h1>
          <p class="mb-8 text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl">
            分享前端开发、后端技术、云计算、架构设计等深度技术文章，让知识触手可及
          </p>
          <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <NuxtLink
              to="/blog"
              class="touch-optimized inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-400 hover:shadow-xl hover:shadow-primary-500/40"
            >
              <Icon name="i-heroicons-book-open" class="h-5 w-5" />
              浏览文章
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="touch-optimized inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white/90 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/20"
            >
              <Icon name="i-heroicons-information-circle" class="h-5 w-5" />
              了解更多
            </NuxtLink>
          </div>

          <!-- 技术标签行 -->
          <div class="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span
              v-for="tech in techTags"
              :key="tech"
              class="rounded-md border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 font-mono text-slate-400 backdrop-blur-sm"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <!-- 主内容区 -->
        <div class="lg:col-span-3">
          <div class="mb-5 flex items-center justify-between sm:mb-6">
            <div class="flex items-center gap-3">
              <div class="h-6 w-1 rounded-full bg-primary-500" />
              <h2 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">最新文章</h2>
            </div>
            <NuxtLink
              to="/blog"
              class="group inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              查看全部
              <Icon
                name="i-heroicons-arrow-right"
                class="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </NuxtLink>
          </div>

          <div v-if="loading" class="space-y-4">
            <BlogPostCardSkeleton v-for="i in 3" :key="i" />
          </div>

          <div
            v-else-if="error"
            class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <EmptyState
              icon="i-heroicons-exclamation-triangle"
              title="加载失败"
              :description="error?.message || '加载文章失败'"
              action-text="重试"
              @action="refreshPosts"
            />
          </div>

          <div v-else-if="posts && posts.length > 0" class="space-y-4">
            <BlogPostCard
              v-for="post in paginatedPosts"
              :key="post.id"
              :post="post"
              :likes-count="post.likes_count || 0"
              :comments-count="post.comments_count || 0"
              :show-cover="false"
            />

            <!-- 分页组件 -->
            <div
              v-if="totalPages > 1"
              class="mt-6 flex flex-col items-center justify-between gap-4 sm:mt-8 sm:flex-row"
            >
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold text-gray-900 dark:text-white">{{
                  (currentPage - 1) * postsPerPage + 1
                }}</span>
                -
                <span class="font-semibold text-gray-900 dark:text-white">{{
                  Math.min(currentPage * postsPerPage, posts.length)
                }}</span>
                条，共
                <span class="font-semibold text-gray-900 dark:text-white">{{ posts.length }}</span>
                条
              </div>
              <nav
                class="flex w-full items-center justify-center gap-1 overflow-x-auto pb-2 sm:w-auto sm:justify-start sm:pb-0"
              >
                <button
                  :disabled="currentPage === 1"
                  class="touch-optimized flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-3"
                  @click="goToPage(currentPage - 1)"
                >
                  <Icon name="i-heroicons-chevron-left" class="h-4 w-4" />
                  <span class="hidden sm:inline">上一页</span>
                </button>

                <template v-if="totalPages <= 7">
                  <button
                    v-for="page in totalPages"
                    :key="page"
                    :class="[
                      'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:min-w-[40px] sm:px-3',
                      currentPage === page
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    ]"
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>
                </template>
                <template v-else>
                  <button
                    :class="[
                      'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:min-w-[40px] sm:px-3',
                      currentPage === 1
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    ]"
                    @click="goToPage(1)"
                  >
                    1
                  </button>

                  <span v-if="currentPage > 3" class="px-2 text-gray-500">...</span>

                  <template v-for="page in visiblePages" :key="page">
                    <button
                      v-if="page !== 1 && page !== totalPages"
                      :class="[
                        'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:min-w-[40px] sm:px-3',
                        currentPage === page
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      ]"
                      @click="goToPage(page)"
                    >
                      {{ page }}
                    </button>
                  </template>

                  <span v-if="currentPage < totalPages - 2" class="px-2 text-gray-500">...</span>

                  <button
                    :class="[
                      'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:min-w-[40px] sm:px-3',
                      currentPage === totalPages
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    ]"
                    @click="goToPage(totalPages)"
                  >
                    {{ totalPages }}
                  </button>
                </template>

                <button
                  :disabled="currentPage === totalPages"
                  class="touch-optimized flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-3"
                  @click="goToPage(currentPage + 1)"
                >
                  <span class="hidden sm:inline">下一页</span>
                  <Icon name="i-heroicons-chevron-right" class="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>

          <div
            v-else
            class="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <EmptyState
              icon="i-heroicons-document-text"
              title="暂无文章"
              description="还没有发布任何文章"
            />
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="lg:col-span-1">
          <div class="sticky top-20 space-y-4">
            <!-- 热门文章组件 -->
            <HotPosts :limit="5" :days="30" :use-decay="true" :show-score="false" />

            <!-- 关于博客 -->
            <div class="card p-4">
              <h3
                class="mb-2.5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white"
              >
                <Icon name="i-heroicons-information-circle" class="h-4 w-4 text-primary-500" />
                关于博客
              </h3>
              <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                基于 Nuxt 3 + Supabase 构建的技术博客，专注分享前端、后端、架构设计等深度内容。
              </p>
            </div>

            <!-- 文章分类 -->
            <div class="card overflow-hidden">
              <div class="sidebar-widget-header">
                <h3 class="sidebar-widget-title">
                  <Icon name="i-heroicons-folder" class="h-4 w-4 text-primary-500" />
                  文章分类
                </h3>
              </div>
              <div class="p-2">
                <div v-if="categoriesLoading" class="space-y-1.5 p-2">
                  <div
                    v-for="i in 5"
                    :key="i"
                    class="h-8 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div v-else-if="categories && categories.length > 0">
                  <NuxtLink
                    v-for="category in categories.slice(0, 6)"
                    :key="category"
                    :to="`/blog?category=${encodeURIComponent(category)}`"
                    class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800/80 dark:hover:text-primary-400"
                  >
                    <span>{{ category }}</span>
                    <Icon name="i-heroicons-chevron-right" class="h-3.5 w-3.5 text-gray-400" />
                  </NuxtLink>
                </div>
                <div v-else class="py-4 text-center text-sm text-gray-400">暂无分类</div>
              </div>
            </div>

            <!-- 热门标签 -->
            <div class="card overflow-hidden">
              <div class="sidebar-widget-header">
                <h3 class="sidebar-widget-title">
                  <Icon name="i-heroicons-tag" class="h-4 w-4 text-primary-500" />
                  热门标签
                </h3>
              </div>
              <div class="p-4">
                <div v-if="tagsLoading" class="flex flex-wrap gap-2">
                  <div
                    v-for="i in 8"
                    :key="i"
                    class="h-6 w-14 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div v-else-if="tags && tags.length > 0" class="flex flex-wrap gap-1.5">
                  <NuxtLink
                    v-for="tag in tags.slice(0, 12)"
                    :key="tag"
                    :to="`/blog?tag=${encodeURIComponent(tag)}`"
                    class="tag text-xs"
                  >
                    #{{ tag }}
                  </NuxtLink>
                </div>
                <div v-else class="py-4 text-center text-sm text-gray-400">暂无标签</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const techTags = [
  'Vue.js',
  'Nuxt 3',
  'TypeScript',
  'Node.js',
  'Docker',
  'PostgreSQL',
  'Go',
  'React'
]

// 分页状态
const currentPage = ref(parseInt((route.query.page as string) || '1'))
const postsPerPage = 5

const { fetchCategories, fetchTags } = useBlogPosts()

// 使用缓存版本的文章列表
const {
  posts: cachedPosts,
  loading: postsLoading,
  error: postsError,
  fetchPosts
} = useCachedPostsList()

// 使用 useAsyncData 缓存分类列表（分类变化不频繁，可以长时间缓存）
const { data: categoriesData, pending: categoriesPending } = await useAsyncData(
  'blog-categories',
  () => fetchCategories(),
  {
    default: () => [],
    server: true
  }
)

// 使用 useAsyncData 缓存标签列表（标签变化不频繁，可以长时间缓存）
const { data: tagsData, pending: tagsPending } = await useAsyncData(
  'blog-tags',
  () => fetchTags(),
  {
    default: () => [],
    server: true
  }
)

// 计算属性，提供响应式数据
const posts = computed(() => {
  return Array.isArray(cachedPosts.value) ? cachedPosts.value : []
}) as ComputedRef<Array<any>>
const categories = computed(() => categoriesData.value || [])
const tags = computed(() => tagsData.value || [])
const loading = computed(() => postsLoading.value)
const error = computed(() => postsError.value)
const categoriesLoading = computed(() => categoriesPending.value)
const tagsLoading = computed(() => tagsPending.value)

// 刷新文章（使用缓存API）
const refreshPosts = async () => {
  await fetchPosts({ page: 1, limit: 100 })
}

// 初始加载文章
onMounted(async () => {
  await refreshPosts()
})

// 分页计算属性
const totalPages = computed(() => {
  return Math.ceil(posts.value.length / postsPerPage)
})

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  return posts.value.slice(startIndex, endIndex)
})

// 计算可见的页码（用于分页显示）
const visiblePages = computed(() => {
  const pages: number[] = []
  const current = currentPage.value
  const total = totalPages.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  // 显示当前页前后各1页
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 分页方法
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 更新URL参数
    updateQueryParams()
    // 滚动到顶部
    if (process.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

// 更新URL查询参数
const updateQueryParams = () => {
  const query: any = {}

  if (currentPage.value > 1) {
    query.page = currentPage.value.toString()
  }

  router.replace({ query })
}

// 监听路由变化，同步页码
watch(
  () => route.query.page,
  newPage => {
    if (newPage) {
      const page = parseInt(newPage as string)
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    } else {
      currentPage.value = 1
    }
  },
  { immediate: true }
)

useHead({
  title: '技术博客 - 首页',
  meta: [
    {
      name: 'description',
      content: '基于 Nuxt 3 和 Supabase 构建的技术博客，分享前端开发、后端技术、云计算等相关内容。'
    }
  ]
})
</script>
