<template>
  <div>
    <main class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="mb-6 flex items-center space-x-4">
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
            class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            <div class="mb-2 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="mb-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
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
          @click="navigateTo('/')"
        >
          返回首页
        </button>
      </div>

      <!-- Author Profile and Posts -->
      <div v-else>
        <!-- Author Profile -->
        <div
          v-if="author"
          class="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <img
                v-if="author.avatar_url"
                :src="author.avatar_url"
                :alt="author.username || '作者'"
                class="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
              />
              <div
                v-else
                class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600"
              >
                <Icon name="heroicons:user" class="h-10 w-10 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div class="flex-1">
              <h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ author.username || author.full_name || '匿名作者' }}
              </h1>
              <p v-if="author.bio" class="mb-4 text-gray-600 dark:text-gray-300">
                {{ author.bio }}
              </p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center space-x-1">
                  <Icon name="heroicons:document-text" class="h-5 w-5" />
                  <span>{{ totalPosts }} 篇文章</span>
                </div>
                <div v-if="author.website" class="flex items-center space-x-1">
                  <Icon name="heroicons:globe-alt" class="h-5 w-5" />
                  <a
                    :href="author.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    个人网站
                  </a>
                </div>
                <div class="flex items-center space-x-1">
                  <Icon name="heroicons:calendar" class="h-5 w-5" />
                  <span>加入于 {{ formatDate(author.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Posts List -->
        <div>
          <h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">文章列表</h2>

          <div
            v-if="posts.length === 0"
            class="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <Icon
              name="heroicons:document-text"
              class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500"
            />
            <p class="text-gray-500 dark:text-gray-400">该作者还没有发布任何文章</p>
          </div>

          <div v-else class="space-y-6">
            <article
              v-for="post in posts"
              :key="post.id"
              class="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <NuxtLink :to="`/blog/${post.slug}`" class="block">
                <div
                  class="mb-3 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  <span
                    v-if="post.category"
                    class="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {{ post.category }}
                  </span>
                  <time :datetime="post.published_at || post.created_at">
                    {{ formatDate(post.published_at || post.created_at) }}
                  </time>
                  <span>•</span>
                  <span>{{ post.read_time || calculateReadTime(post.content) }} 分钟阅读</span>
                </div>

                <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {{ post.title }}
                </h3>

                <p v-if="post.excerpt" class="mb-4 text-gray-600 dark:text-gray-300">
                  {{ post.excerpt }}
                </p>

                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center space-x-1">
                      <Icon name="heroicons:heart" class="h-4 w-4" />
                      <span>{{ post.likes_count || 0 }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <Icon name="heroicons:chat-bubble-left-right" class="h-4 w-4" />
                      <span>{{ post.comments_count || 0 }}</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-8 flex justify-center">
            <nav class="flex items-center space-x-2">
              <button
                :disabled="currentPage === 1"
                class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                @click="goToPage(currentPage - 1)"
              >
                上一页
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                第 {{ currentPage }} 页，共 {{ totalPages }} 页
              </span>
              <button
                :disabled="currentPage === totalPages"
                class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                @click="goToPage(currentPage + 1)"
              >
                下一页
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

const { getPostsByAuthor, getAuthorProfile } = useBlogPosts()

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

const loadAuthorProfile = async () => {
  const result = await getAuthorProfile(authorId)
  if (result.error) {
    error.value = result.error
    return
  }
  author.value = result.data
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
