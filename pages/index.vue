<template>
  <div>
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div class="container mx-auto px-4 py-16">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="mb-4 text-4xl font-bold md:text-5xl">欢迎来到我的技术博客</h1>
          <p class="mb-8 text-xl opacity-90">分享前端开发、后端技术、云计算等相关内容</p>
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

    <main class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <div class="mb-8 flex items-center justify-between">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">最新文章</h2>
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
              :description="error"
              action-text="重试"
              @action="loadPosts"
            />
          </div>

          <div v-else-if="posts && posts.length > 0" class="space-y-6">
            <BlogPostCard
              v-for="post in posts.slice(0, 6)"
              :key="post.id"
              :post="post"
              :likes-count="post.likes_count || 0"
              :comments-count="post.comments_count || 0"
            />
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
          <div class="mb-6 overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
            <div class="p-6">
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
const { fetchPosts, fetchCategories, fetchTags } = useBlogPosts()

// 使用 useAsyncData 缓存文章列表（缓存键包含分页参数）
const {
  data: postsData,
  pending: postsPending,
  error: postsError
} = await useAsyncData('home-posts', () => fetchPosts({ page: 1, pageSize: 6 }), {
  default: () => [],
  // 服务端和客户端都缓存
  server: true
})

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
const posts = computed(() => postsData.value || [])
const categories = computed(() => categoriesData.value || [])
const tags = computed(() => tagsData.value || [])
const loading = computed(() => postsPending.value)
const error = computed(() => postsError.value)
const categoriesLoading = computed(() => categoriesPending.value)
const tagsLoading = computed(() => tagsPending.value)

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
