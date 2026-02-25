<template>
  <div>
    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <!-- Page Header -->
      <div class="mb-10 text-center sm:mb-12">
        <div
          class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30 sm:h-20 sm:w-20"
        >
          <Icon
            name="heroicons:user-group"
            class="h-8 w-8 text-primary-600 dark:text-primary-400 sm:h-10 sm:w-10"
          />
        </div>
        <h1 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
          博客作者
        </h1>
        <p class="mx-auto max-w-lg text-base text-gray-600 dark:text-gray-300">
          发现优秀的创作者，探索他们的精彩文章
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
            <div class="mb-4 flex items-center gap-4">
              <div class="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div class="flex-1">
                <div class="mb-2 h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div class="mb-3 h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div class="mb-4 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="flex items-center gap-3">
              <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-12 text-center sm:py-16">
        <div
          class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
        >
          <Icon name="heroicons:exclamation-triangle" class="h-8 w-8 text-red-500" />
        </div>
        <h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">加载失败</h2>
        <p class="mx-auto mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">
          {{ error }}
        </p>
        <button
          class="touch-optimized inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="loadAuthors"
        >
          <Icon name="heroicons:arrow-path" class="h-4 w-4" />
          重试
        </button>
      </div>

      <!-- Authors List -->
      <div v-else>
        <div
          v-if="authors.length === 0"
          class="rounded-xl border border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50 sm:py-16"
        >
          <div
            class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
          >
            <Icon name="heroicons:user-group" class="h-7 w-7 text-gray-400" />
          </div>
          <p class="text-gray-500 dark:text-gray-400">暂无作者</p>
        </div>

        <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="author in authors"
            :key="author.id"
            class="touch-optimized group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50 sm:p-6"
          >
            <div class="mb-4 flex items-start gap-4">
              <div class="flex-shrink-0">
                <img
                  v-if="author.avatar_url"
                  :src="author.avatar_url"
                  :alt="author.username || '作者'"
                  class="h-14 w-14 rounded-xl object-cover ring-2 ring-gray-100 transition-all group-hover:ring-primary-200 dark:ring-gray-700"
                />
                <div
                  v-else
                  class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800"
                >
                  <Icon
                    name="heroicons:user"
                    class="h-7 w-7 text-primary-600 dark:text-primary-400"
                  />
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <h3
                  class="mb-1 truncate text-base font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400 sm:text-lg"
                >
                  {{ author.username || author.full_name || '匿名作者' }}
                </h3>
                <p v-if="author.bio" class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {{ author.bio }}
                </p>
              </div>
            </div>

            <div
              class="mb-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-700"
            >
              <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Icon name="heroicons:document-text" class="h-4 w-4" />
                <span>{{ author.post_count || 0 }} 篇文章</span>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Icon name="heroicons:calendar" class="h-4 w-4" />
                <span>{{ formatDate(author.created_at) }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3">
              <a
                v-if="author.website"
                :href="author.website"
                target="_blank"
                rel="noopener noreferrer"
                class="touch-optimized inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-primary-400"
              >
                <Icon name="heroicons:globe-alt" class="h-4 w-4" />
              </a>
              <NuxtLink
                :to="`/authors/${author.id}`"
                class="touch-optimized ml-auto inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                <span>查看文章</span>
                <Icon name="heroicons:arrow-right" class="h-4 w-4" />
              </NuxtLink>
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
