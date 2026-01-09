<template>
  <div>
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div class="container mx-auto px-3 py-12 sm:px-4 sm:py-16">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">欢迎来到我的技术博客</h1>
          <p class="mb-8 text-lg opacity-90 sm:text-xl">分享前端开发、后端技术、云计算等相关内容</p>
          <div class="flex flex-col justify-center gap-4 sm:flex-row">
            <NuxtLink
              to="/blog"
              class="rounded-lg bg-white px-6 py-3 font-medium text-primary-600 transition-colors hover:bg-gray-100"
            >
              浏览文章
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="rounded-lg border-2 border-white bg-transparent px-6 py-3 font-medium text-white transition-colors hover:bg-white hover:text-primary-600"
            >
              了解更多
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <main class="container mx-auto px-3 py-8 sm:px-4 sm:py-12">
      <div class="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <div class="mb-6 flex items-center justify-between sm:mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">最新文章</h2>
            <NuxtLink to="/blog" class="font-medium text-primary-600 hover:text-primary-700">
              查看全部
            </NuxtLink>
          </div>

          <div v-if="loading" class="space-y-6">
            <BlogPostCardSkeleton v-for="i in 3" :key="i" />
          </div>

          <div
            v-else-if="error"
            class="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800"
          >
            <EmptyState
              icon="i-heroicons-exclamation-triangle"
              title="加载失败"
              :description="error?.message || '加载文章失败'"
              action-text="重试"
              @action="refreshPosts"
            />
          </div>

          <div v-else-if="posts && posts.length > 0" class="space-y-4 sm:space-y-6">
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
                显示第
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

                <!-- 页码按钮 -->
                <template v-if="totalPages <= 7">
                  <button
                    v-for="page in totalPages"
                    :key="page"
                    :class="[
                      'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:min-w-[40px] sm:px-3',
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    ]"
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>
                </template>
                <template v-else>
                  <!-- 第一页 -->
                  <button
                    :class="[
                      'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:min-w-[40px] sm:px-3',
                      currentPage === 1
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    ]"
                    @click="goToPage(1)"
                  >
                    1
                  </button>

                  <!-- 省略号 -->
                  <span v-if="currentPage > 3" class="px-2 text-gray-500">...</span>

                  <!-- 当前页附近的页码 -->
                  <template v-for="page in visiblePages" :key="page">
                    <button
                      v-if="page !== 1 && page !== totalPages"
                      :class="[
                        'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:min-w-[40px] sm:px-3',
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      ]"
                      @click="goToPage(page)"
                    >
                      {{ page }}
                    </button>
                  </template>

                  <!-- 省略号 -->
                  <span v-if="currentPage < totalPages - 2" class="px-2 text-gray-500">...</span>

                  <!-- 最后一页 -->
                  <button
                    :class="[
                      'touch-optimized min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-colors sm:min-w-[40px] sm:px-3',
                      currentPage === totalPages
                        ? 'bg-blue-600 text-white shadow-md'
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

          <div v-else class="rounded-lg bg-white p-12 text-center shadow-md dark:bg-gray-800">
            <EmptyState
              icon="i-heroicons-document-text"
              title="暂无文章"
              description="还没有发布任何文章"
            />
          </div>
        </div>

        <div class="lg:col-span-1">
          <!-- 热门文章组件 -->
          <div class="mb-4 sm:mb-6">
            <HotPosts :limit="5" :days="30" :use-decay="true" :show-score="false" />
          </div>

          <div class="mb-4 overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800 sm:mb-6">
            <div class="p-4 sm:p-6">
              <h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-white">关于博客</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                这是一个基于 Nuxt 3 和 Supabase
                构建的技术博客，分享前端开发、后端技术、云计算等相关内容。
              </p>
            </div>
          </div>

          <div class="mb-6 overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
            <div class="p-6">
              <h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-white">文章分类</h3>
              <div v-if="categoriesLoading" class="space-y-2">
                <div
                  v-for="i in 5"
                  :key="i"
                  class="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
                />
              </div>
              <div v-else-if="categories && categories.length > 0" class="space-y-2">
                <NuxtLink
                  v-for="category in categories.slice(0, 5)"
                  :key="category"
                  :to="`/blog?category=${encodeURIComponent(category)}`"
                  class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {{ category }}
                </NuxtLink>
              </div>
              <div v-else class="text-sm text-gray-500 dark:text-gray-400">暂无分类</div>
            </div>
          </div>

          <div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
            <div class="p-6">
              <h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-white">热门标签</h3>
              <div v-if="tagsLoading" class="flex flex-wrap gap-2">
                <div
                  v-for="i in 8"
                  :key="i"
                  class="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
                />
              </div>
              <div v-else-if="tags && tags.length > 0" class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="tag in tags.slice(0, 10)"
                  :key="tag"
                  :to="`/blog?tag=${encodeURIComponent(tag)}`"
                  class="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-primary-100 hover:text-primary-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-primary-900 dark:hover:text-primary-300"
                >
                  {{ tag }}
                </NuxtLink>
              </div>
              <div v-else class="text-sm text-gray-500 dark:text-gray-400">暂无标签</div>
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
