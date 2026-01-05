<template>
  <div>
    <main class="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
      <!-- 页面标题和统计 -->
      <div class="mb-4 sm:mb-6 md:mb-8">
        <div
          class="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">博客文章</h1>
            <p
              v-if="!loading && totalCount > 0"
              class="mt-1.5 text-xs text-gray-600 dark:text-gray-400 sm:mt-2 sm:text-sm"
            >
              共找到
              <span class="font-semibold text-blue-600 dark:text-blue-400">{{ totalCount }}</span>
              篇文章
            </p>
          </div>
          <button
            v-if="hasActiveFilters"
            class="hidden items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:flex"
            @click="resetFilters"
          >
            <Icon name="heroicons:x-mark" class="h-4 w-4" />
            清除筛选
          </button>
        </div>

        <!-- 搜索框 -->
        <div class="mb-4 sm:mb-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
              <Icon name="heroicons:magnifying-glass" class="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章..."
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pl-9 pr-10 text-sm text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:px-4 sm:py-3 sm:pl-11 sm:pr-12 sm:text-base"
            />
            <button
              v-if="searchQuery"
              class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 sm:pr-3"
              @click="searchQuery = ''"
            >
              <Icon name="heroicons:x-mark" class="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        <!-- 筛选器卡片 -->
        <div
          class="mb-4 rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:mb-6 sm:p-3 md:p-4"
        >
          <div class="mb-2.5 flex items-center justify-between sm:mb-3">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <Icon
                name="heroicons:funnel"
                class="h-4 w-4 text-gray-500 dark:text-gray-400 sm:h-5 sm:w-5"
              />
              <span class="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                >筛选条件</span
              >
            </div>
            <button
              v-if="hasActiveFilters"
              class="touch-optimized rounded-lg px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30 md:hidden"
              @click="resetFilters"
            >
              清除
            </button>
          </div>
          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            <!-- 分类筛选 -->
            <div class="relative">
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                分类
              </label>
              <div class="relative">
                <select
                  v-model="selectedCategory"
                  class="w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-2.5 pr-7 text-xs text-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-blue-400 sm:py-2 sm:pl-3 sm:pr-8 sm:text-sm"
                >
                  <option value="">所有分类</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 标签筛选 -->
            <div class="relative">
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                标签
              </label>
              <div class="relative">
                <select
                  v-model="selectedTag"
                  class="w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-2.5 pr-7 text-xs text-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-blue-400 sm:py-2 sm:pl-3 sm:pr-8 sm:text-sm"
                >
                  <option value="">所有标签</option>
                  <option v-for="tag in tags" :key="tag" :value="tag">
                    {{ tag }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 排序 -->
            <div class="relative">
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                排序
              </label>
              <div class="relative">
                <select
                  v-model="sortBy"
                  class="w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-2.5 pr-7 text-xs text-gray-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-blue-400 sm:py-2 sm:pl-3 sm:pr-8 sm:text-sm"
                >
                  <option value="created_at">最新发布</option>
                  <option value="updated_at">最近更新</option>
                  <option value="title">按标题</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BlogPostCardSkeleton v-for="i in 6" :key="i" />
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
        <Icon name="heroicons:exclamation-triangle" class="mb-4 h-12 w-12 text-red-500" />
        <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">加载失败</h2>
        <p class="mb-4 text-gray-600 dark:text-gray-400">
          {{ error }}
        </p>
        <button
          class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="loadPosts"
        >
          重试
        </button>
      </div>

      <!-- 文章列表 -->
      <div
        v-else-if="paginatedPosts.length > 0"
        class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
      >
        <BlogPostCard
          v-for="post in paginatedPosts"
          :key="post.id"
          :post="post"
          :likes-count="post.likes_count || 0"
          :comments-count="post.comments_count || 0"
        />
      </div>

      <!-- 空状态 -->
      <EmptyState
        v-else
        title="没有找到文章"
        description="尝试调整筛选条件或搜索关键词"
        action-text="查看所有文章"
        @action="resetFilters"
      />

      <!-- 分页 -->
      <div
        v-if="totalCount > postsPerPage"
        class="mt-8 flex flex-col items-center justify-between gap-4 sm:mt-12 sm:flex-row"
      >
        <div class="text-sm text-gray-600 dark:text-gray-400">
          显示第
          <span class="font-semibold text-gray-900 dark:text-white">{{
            (currentPage - 1) * postsPerPage + 1
          }}</span>
          -
          <span class="font-semibold text-gray-900 dark:text-white">{{
            Math.min(currentPage * postsPerPage, totalCount)
          }}</span>
          条， 共
          <span class="font-semibold text-gray-900 dark:text-white">{{ totalCount }}</span>
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
    </main>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  title: '博客文章',
  description: '浏览所有博客文章'
})

// 获取路由参数和路由器
const route = useRoute()
const router = useRouter()

// 筛选和分页状态
const selectedCategory = ref<string>(String(route.query.category || ''))
const selectedTag = ref<string>(String(route.query.tag || ''))
const sortBy = ref('created_at')
const searchQuery = ref<string>(String(route.query.q || ''))
const currentPage = ref(parseInt(route.query.page as string) || 1)
const postsPerPage = 9

// 获取博客文章及分类、标签
const { getPostsWithPagination, fetchCategories, fetchTags } = useBlogPosts()

// 使用 useAsyncData 进行服务端分页
// 使用 computed 生成动态的查询键
const queryKey = computed(() => {
  return `blog-posts-${currentPage.value}-${selectedCategory.value}-${selectedTag.value}-${searchQuery.value}-${sortBy.value}`
})

const {
  data: postsData,
  pending: postsPending,
  error: postsError,
  refresh: refreshPosts
} = await useAsyncData(
  () => queryKey.value,
  () =>
    getPostsWithPagination({
      page: currentPage.value,
      pageSize: postsPerPage,
      category: selectedCategory.value || null,
      tag: selectedTag.value || null,
      searchQuery: searchQuery.value || null,
      sortBy: sortBy.value as 'created_at' | 'updated_at' | 'title'
    }),
  {
    default: () => ({ data: [], count: 0, error: null }),
    server: true,
    watch: [currentPage, selectedCategory, selectedTag, searchQuery, sortBy]
  }
)

// 使用 useAsyncData 缓存分类列表（与首页保持一致，实现稳定）
const { data: categoriesData } = await useAsyncData('blog-categories', () => fetchCategories(), {
  default: () => [],
  server: true
})

// 使用 useAsyncData 缓存标签列表（与首页保持一致，实现稳定）
const { data: tagsData } = await useAsyncData('blog-tags', () => fetchTags(), {
  default: () => [],
  server: true
})

// 从缓存数据中提取实际数据
import type { BlogPost } from '~/types/blog'

// 扩展 BlogPost 类型以包含统计信息
interface BlogPostWithCounts extends BlogPost {
  likes_count?: number
  comments_count?: number
}

// 服务端分页：直接使用返回的数据
const paginatedPosts = computed<BlogPostWithCounts[]>(() => {
  if (postsData.value?.error) {
    return []
  }
  return (postsData.value?.data as BlogPostWithCounts[]) || []
})

// 总记录数（来自服务端）
const totalCount = computed(() => {
  return postsData.value?.count || 0
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(totalCount.value / postsPerPage)
})

const categories = computed<string[]>(() => (categoriesData.value as string[]) || [])

const tags = computed<string[]>(() => (tagsData.value as string[]) || [])

const loading = computed(() => postsPending.value)
const error = computed(() => {
  if (postsData.value?.error) {
    return postsData.value.error
  }
  return postsError.value
})

// 检查是否有活动的筛选条件
const hasActiveFilters = computed(() => {
  return !!(
    selectedCategory.value ||
    selectedTag.value ||
    searchQuery.value ||
    sortBy.value !== 'created_at'
  )
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

// 方法 - 刷新文章数据
const loadPosts = async () => {
  await refreshPosts()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到顶部
    if (process.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const resetFilters = () => {
  selectedCategory.value = ''
  selectedTag.value = ''
  sortBy.value = 'created_at'
  searchQuery.value = ''
  currentPage.value = 1
  updateQueryParams()
}

// 更新URL查询参数
const updateQueryParams = () => {
  const query: any = {}

  if (selectedCategory.value) {
    query.category = selectedCategory.value
  }

  if (selectedTag.value) {
    query.tag = selectedTag.value
  }

  if (searchQuery.value) {
    query.q = searchQuery.value
  }

  if (currentPage.value > 1) {
    query.page = currentPage.value.toString()
  }

  router.replace({ query })
}

// 监听筛选条件变化，重置页码并更新URL参数
watch([selectedCategory, selectedTag, sortBy, searchQuery], () => {
  currentPage.value = 1
  updateQueryParams()
})

// 监听页码变化，更新URL参数
watch(currentPage, () => {
  updateQueryParams()
})

// 监听查询参数变化，自动刷新数据（useAsyncData 的 watch 会自动处理）
</script>
