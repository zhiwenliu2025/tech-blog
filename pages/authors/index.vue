<template>
  <div>
    <main class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-12 text-center">
        <h1 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">博客作者</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">发现优秀的创作者，探索他们的精彩文章</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
            <div class="mb-4 flex items-center space-x-4">
              <div class="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div class="flex-1">
                <div class="mb-2 h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div class="mb-4 h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div class="mb-4 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="flex items-center space-x-2">
              <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-12 text-center">
        <Icon name="heroicons:exclamation-triangle" class="mx-auto h-12 w-12 text-red-500" />
        <h2 class="mt-4 text-xl font-semibold text-gray-900 dark:text-white">加载失败</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ error }}
        </p>
        <button
          class="mt-4 rounded-md border border-blue-600 bg-white px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
          @click="loadAuthors"
        >
          重试
        </button>
      </div>

      <!-- Authors List -->
      <div v-else>
        <div
          v-if="authors.length === 0"
          class="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800"
        >
          <Icon
            name="heroicons:user-group"
            class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500"
          />
          <p class="text-gray-500 dark:text-gray-400">暂无作者</p>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="author in authors"
            :key="author.id"
            class="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="mb-4 flex items-start space-x-4">
              <div class="flex-shrink-0">
                <img
                  v-if="author.avatar_url"
                  :src="author.avatar_url"
                  :alt="author.username || '作者'"
                  class="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                />
                <div
                  v-else
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600"
                >
                  <Icon name="heroicons:user" class="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="mb-1 truncate text-lg font-semibold text-gray-900 dark:text-white">
                  {{ author.username || author.full_name || '匿名作者' }}
                </h3>
                <p
                  v-if="author.bio"
                  class="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  {{ author.bio }}
                </p>
                <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center space-x-1">
                    <Icon name="heroicons:document-text" class="h-4 w-4" />
                    <span>{{ author.post_count || 0 }} 篇文章</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Icon name="heroicons:calendar" class="h-4 w-4" />
                <span>加入于 {{ formatDate(author.created_at) }}</span>
              </div>
              <NuxtLink
                :to="`/authors/${author.id}`"
                class="inline-flex items-center space-x-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <span>查看文章</span>
                <Icon name="heroicons:arrow-right" class="h-4 w-4" />
              </NuxtLink>
            </div>

            <div v-if="author.website" class="mt-3">
              <a
                :href="author.website"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Icon name="heroicons:globe-alt" class="h-4 w-4" />
                <span>个人网站</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { getAllAuthors } = useBlogPosts()

const loading = ref(true)
const error = ref<string | null>(null)
const authors = ref<any[]>([])

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadAuthors = async () => {
  loading.value = true
  error.value = null

  try {
    const authorsData = await getAllAuthors()
    authors.value = authorsData
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAuthors()
})

useHead({
  title: '博客作者',
  meta: [
    {
      name: 'description',
      content: '发现优秀的创作者，探索他们的精彩文章'
    }
  ]
})
</script>
