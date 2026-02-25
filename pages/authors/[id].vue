<template>
  <div>
    <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="mb-6 flex items-center gap-4">
          <div class="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div class="flex-1">
            <div class="mb-2 h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="rounded-xl border border-gray-200 p-5 dark:border-gray-700"
          >
            <div class="mb-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="mb-3 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
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
          @click="navigateTo('/')"
        >
          <Icon name="heroicons:arrow-left" class="h-4 w-4" />
          返回首页
        </button>
      </div>

      <!-- Author Profile and Posts -->
      <div v-else>
        <!-- Author Profile -->
        <div
          v-if="author"
          class="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/50 sm:p-6"
        >
          <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div class="flex-shrink-0 self-center sm:self-start">
              <img
                v-if="author.avatar_url"
                :src="author.avatar_url"
                :alt="author.username || '作者'"
                class="h-20 w-20 rounded-2xl object-cover ring-2 ring-gray-100 dark:ring-gray-700"
              />
              <div
                v-else
                class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800"
              >
                <Icon
                  name="heroicons:user"
                  class="h-10 w-10 text-primary-600 dark:text-primary-400"
                />
              </div>
            </div>
            <div class="flex-1">
              <h1 class="mb-2 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                {{ author.username || author.full_name || '匿名作者' }}
              </h1>
              <p
                v-if="author.bio"
                class="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
              >
                {{ author.bio }}
              </p>
              <div
                class="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 sm:gap-4 sm:text-sm"
              >
                <div class="flex items-center gap-1.5">
                  <Icon name="heroicons:document-text" class="h-4 w-4" />
                  <span class="font-medium text-primary-600 dark:text-primary-400">{{
                    totalPosts
                  }}</span>
                  篇文章
                </div>
                <div v-if="author.website" class="flex items-center gap-1.5">
                  <Icon name="heroicons:globe-alt" class="h-4 w-4" />
                  <a
                    :href="author.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    个人网站
                  </a>
                </div>
                <div class="flex items-center gap-1.5">
                  <Icon name="heroicons:calendar" class="h-4 w-4" />
                  <span>{{ formatDate(author.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Posts List -->
        <div>
          <div class="mb-6 flex items-center gap-3 sm:mb-8">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30"
            >
              <Icon
                name="heroicons:document-text"
                class="h-5 w-5 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">文章列表</h2>
          </div>

          <div
            v-if="posts.length === 0"
            class="rounded-xl border border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50 sm:py-16"
          >
            <div
              class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
            >
              <Icon name="heroicons:document-text" class="h-7 w-7 text-gray-400" />
            </div>
            <p class="text-gray-500 dark:text-gray-400">该作者还没有发布任何文章</p>
          </div>

          <div v-else class="space-y-4 sm:space-y-5">
            <article
              v-for="post in posts"
              :key="post.id"
              class="touch-optimized group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50 sm:p-5"
            >
              <NuxtLink :to="`/blog/${post.slug}`" class="block">
                <div
                  class="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 sm:gap-3"
                >
                  <span
                    v-if="post.category"
                    class="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    <Icon name="heroicons:folder" class="h-3 w-3" />
                    {{ post.category }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:calendar" class="h-3.5 w-3.5" />
                    {{ formatDate(post.published_at || post.created_at) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:clock" class="h-3.5 w-3.5" />
                    {{ post.read_time || calculateReadTime(post.content) }} 分钟
                  </span>
                </div>

                <h3
                  class="mb-2 text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400 sm:text-lg"
                >
                  {{ post.title }}
                </h3>

                <p
                  v-if="post.excerpt"
                  class="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
                >
                  {{ post.excerpt }}
                </p>

                <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:heart" class="h-4 w-4" />
                    {{ post.likes_count || 0 }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:chat-bubble-left-right" class="h-4 w-4" />
                    {{ post.comments_count || 0 }}
                  </span>
                </div>
              </NuxtLink>
            </article>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-8 flex justify-center">
            <nav class="flex items-center gap-2">
              <button
                :disabled="currentPage === 1"
                class="touch-optimized rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                @click="goToPage(currentPage - 1)"
              >
                <Icon name="heroicons:chevron-left" class="h-4 w-4" />
              </button>
              <span class="px-3 text-sm text-gray-600 dark:text-gray-400">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                :disabled="currentPage === totalPages"
                class="touch-optimized rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                @click="goToPage(currentPage + 1)"
              >
                <Icon name="heroicons:chevron-right" class="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const authorId = route.params.id as string

// ✅ 使用缓存 API
const { getProfile } = useProfileCache()
const { getPostsByAuthor } = useBlogPosts()

const loading = ref(true)
const error = ref<string | null>(null)
const author = ref<any>(null)
const posts = ref<any[]>([])
const currentPage = ref(1)
const pageSize = 10
const totalPosts = ref(0)

const totalPages = computed(() => Math.ceil(totalPosts.value / pageSize))

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const calculateReadTime = (content: string) => {
  if (!content) return 0
  const wordsPerMinute = 200
  const text = content.replace(/<[^>]*>/g, '')
  const wordCount = text.length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// ✅ 使用缓存版本
const loadAuthorProfile = async () => {
  const profile = await getProfile(authorId)
  if (!profile) {
    error.value = '作者不存在或无法加载'
    return
  }
  author.value = profile
}

const loadPosts = async (page: number) => {
  loading.value = true
  error.value = null

  try {
    const postsData = await getPostsByAuthor(authorId, page, pageSize)
    posts.value = postsData
    currentPage.value = page

    if (page === 1) {
      totalPosts.value = postsData.length
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  loadPosts(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  await loadAuthorProfile()
  await loadPosts(1)
})

watch(
  () => route.params.id,
  async newId => {
    if (newId) {
      currentPage.value = 1
      await loadAuthorProfile()
      await loadPosts(1)
    }
  }
)

useHead({
  title: author.value ? `${author.value.username || '作者'}的文章` : '作者文章',
  meta: [
    {
      name: 'description',
      content: author.value?.bio || '查看作者的所有博客文章'
    }
  ]
})
</script>
