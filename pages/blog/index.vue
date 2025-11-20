<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">博客文章</h1>

        <!-- 筛选器 -->
        <div class="mb-6 flex flex-wrap gap-4">
          <!-- 分类筛选 -->
          <div class="relative">
            <select
              v-model="selectedCategory"
              class="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="">所有分类</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300"
            >
              <Icon name="heroicons:chevron-down" class="h-5 w-5" />
            </div>
          </div>

          <!-- 标签筛选 -->
          <div class="relative">
            <select
              v-model="selectedTag"
              class="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="">所有标签</option>
              <option v-for="tag in tags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300"
            >
              <Icon name="heroicons:chevron-down" class="h-5 w-5" />
            </div>
          </div>

          <!-- 排序 -->
          <div class="relative">
            <select
              v-model="sortBy"
              class="appearance-none rounded-md border border-gray-300 bg-white py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="created_at">最新发布</option>
              <option value="updated_at">最近更新</option>
              <option value="title">按标题</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300"
            >
              <Icon name="heroicons:chevron-down" class="h-5 w-5" />
            </div>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="relative mb-6">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章..."
            class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
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
        v-else-if="filteredPosts.length > 0"
        class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <BlogPostCard v-for="post in paginatedPosts" :key="post.id" :post="post" />
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
      <div v-if="filteredPosts.length > postsPerPage" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            :disabled="currentPage === 1"
            class="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="goToPage(currentPage - 1)"
          >
            <Icon name="heroicons:chevron-left" class="h-5 w-5" />
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            :class="[
              'rounded-md px-3 py-1',
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button
            :disabled="currentPage === totalPages"
            class="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="goToPage(currentPage + 1)"
          >
            <Icon name="heroicons:chevron-right" class="h-5 w-5" />
          </button>
        </nav>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  title: '博客文章',
  description: '浏览所有博客文章'
})

// 状态
const loading = ref(true)
const error = ref(null)
const posts = ref([])
const categories = ref([])
const tags = ref([])
const selectedCategory = ref('')
const selectedTag = ref('')
const sortBy = ref('created_at')
const searchQuery = ref('')
const currentPage = ref(1)
const postsPerPage = 9

// 获取博客文章
const { getPublishedPosts, getCategories, getTags } = useBlogPosts()

// 计算属性
const filteredPosts = computed(() => {
  let result = [...posts.value]

  // 分类筛选
  if (selectedCategory.value) {
    result = result.filter(post => post.category === selectedCategory.value)
  }

  // 标签筛选
  if (selectedTag.value) {
    result = result.filter(post => post.tags && post.tags.includes(selectedTag.value))
  }

  // 搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
    )
  }

  // 排序
  result.sort((a, b) => {
    if (sortBy.value === 'created_at') {
      return new Date(b.created_at) - new Date(a.created_at)
    } else if (sortBy.value === 'updated_at') {
      return new Date(b.updated_at) - new Date(a.updated_at)
    } else if (sortBy.value === 'title') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage)
})

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  return filteredPosts.value.slice(startIndex, endIndex)
})

// 方法
const loadPosts = async () => {
  loading.value = true
  error.value = null

  try {
    const result = await getPublishedPosts()

    if (result.error) {
      error.value = result.error
    } else {
      posts.value = result.data || []
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const result = await getCategories()
    if (!result.error) {
      categories.value = result.data || []
    }
  } catch (err) {
    console.error('加载分类失败:', err)
  }
}

const loadTags = async () => {
  try {
    const result = await getTags()
    if (!result.error) {
      tags.value = result.data || []
    }
  } catch (err) {
    console.error('加载标签失败:', err)
  }
}

const goToPage = page => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const resetFilters = () => {
  selectedCategory.value = ''
  selectedTag.value = ''
  sortBy.value = 'created_at'
  searchQuery.value = ''
  currentPage.value = 1
}

// 监听筛选条件变化，重置页码
watch([selectedCategory, selectedTag, sortBy, searchQuery], () => {
  currentPage.value = 1
})

// 初始化数据
onMounted(() => {
  Promise.all([loadPosts(), loadCategories(), loadTags()])
})
</script>
