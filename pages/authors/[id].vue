<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="animate-pulse">
        <!-- 头部骨架 -->
        <div class="mb-8 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <div class="flex items-center gap-5">
            <div class="h-20 w-20 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div class="flex-1 space-y-3">
              <div class="h-6 w-40 rounded-md bg-slate-200 dark:bg-slate-700" />
              <div class="h-4 w-64 rounded-md bg-slate-200 dark:bg-slate-700" />
              <div class="h-3 w-32 rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
        <!-- 文章列表骨架 -->
        <div class="space-y-3">
          <div
            v-for="i in 4"
            :key="i"
            class="rounded-xl border border-slate-200 p-5 dark:border-slate-800"
          >
            <div class="mb-3 h-3 w-1/4 rounded-md bg-slate-200 dark:bg-slate-700" />
            <div class="mb-2 h-5 w-3/4 rounded-md bg-slate-200 dark:bg-slate-700" />
            <div class="h-3 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div
        class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20"
      >
        <Icon name="heroicons:exclamation-triangle" class="h-7 w-7 text-red-500" />
      </div>
      <h2 class="mb-2 text-lg font-semibold text-slate-900 dark:text-white">加载失败</h2>
      <p class="mb-6 text-sm text-slate-500 dark:text-slate-400">
        {{ error }}
      </p>
      <button
        class="touch-optimized inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-primary-300 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        @click="navigateTo('/')"
      >
        <Icon name="heroicons:arrow-left" class="h-4 w-4" />
        返回首页
      </button>
    </div>

    <!-- 主内容 -->
    <div v-else>
      <!-- 作者 Profile 英雄区（深色终端风格） -->
      <div v-if="author" class="relative overflow-hidden bg-slate-900">
        <!-- 点阵底纹 -->
        <div
          class="pointer-events-none absolute inset-0 opacity-[0.18]"
          style="
            background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
            background-size: 28px 28px;
          "
        />
        <!-- 光晕 -->
        <div
          class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-600/10 blur-3xl"
        />
        <div
          class="bg-indigo-600/8 pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full blur-3xl"
        />
        <!-- 底部过渡线 -->
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
        />

        <div class="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <!-- 面包屑 -->
          <div class="mb-6 flex items-center gap-2 font-mono text-xs text-slate-500">
            <NuxtLink to="/authors" class="transition-colors hover:text-slate-300">
              authors
            </NuxtLink>
            <span>/</span>
            <span class="text-slate-400">{{ author.username || 'profile' }}</span>
          </div>

          <!-- 作者信息 -->
          <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
            <!-- 头像 -->
            <div class="flex-shrink-0 self-start">
              <div class="relative">
                <img
                  v-if="author.avatar_url"
                  :src="author.avatar_url"
                  :alt="author.username || '作者'"
                  class="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary-500/30 sm:h-24 sm:w-24"
                />
                <div
                  v-else
                  class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 sm:h-24 sm:w-24"
                >
                  <Icon name="heroicons:user" class="h-10 w-10 text-white sm:h-12 sm:w-12" />
                </div>
                <!-- 在线指示器 -->
                <span
                  class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900 bg-emerald-400"
                />
              </div>
            </div>

            <!-- 文字信息 -->
            <div class="min-w-0 flex-1">
              <h1 class="mb-1.5 text-2xl font-bold text-white sm:text-3xl">
                {{ author.username || author.full_name || '匿名作者' }}
              </h1>
              <p v-if="author.bio" class="mb-4 max-w-lg text-sm leading-relaxed text-slate-400">
                {{ author.bio }}
              </p>

              <!-- 统计 + 链接行 -->
              <div class="flex flex-wrap items-center gap-4">
                <!-- 文章数 -->
                <div class="flex items-center gap-1.5 font-mono text-sm">
                  <span class="text-2xl font-bold text-white">{{ totalPosts }}</span>
                  <span class="text-slate-500">posts</span>
                </div>
                <span class="text-slate-700">·</span>
                <!-- 加入时间 -->
                <div class="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                  <Icon name="heroicons:calendar" class="h-3.5 w-3.5" />
                  joined {{ formatDateShort(author.created_at) }}
                </div>
                <!-- 网站链接 -->
                <a
                  v-if="author.website"
                  :href="author.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs text-slate-400 transition-all hover:border-primary-700/60 hover:text-primary-400"
                >
                  <Icon name="heroicons:globe-alt" class="h-3.5 w-3.5" />
                  个人网站
                  <Icon name="heroicons:arrow-top-right-on-square" class="h-3 w-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章列表区 -->
      <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <!-- 区块标题 -->
        <div class="mb-6 flex items-center gap-3">
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500">// posts</span>
          <div class="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
          <span
            v-if="totalPosts > 0"
            class="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          >
            {{ totalPosts }}
          </span>
        </div>

        <!-- 空状态 -->
        <div
          v-if="posts.length === 0"
          class="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700/60 dark:bg-slate-800/20"
        >
          <Icon
            name="heroicons:document-text"
            class="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-600"
          />
          <p class="text-sm text-slate-400 dark:text-slate-500">该作者还没有发布任何文章</p>
        </div>

        <!-- 文章列表 -->
        <div v-else class="space-y-3">
          <article
            v-for="post in posts"
            :key="post.id"
            class="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-px hover:border-primary-200 hover:shadow-md hover:shadow-primary-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800/60"
          >
            <!-- 左侧悬停高亮条 -->
            <div
              class="absolute left-0 top-0 h-full w-0.5 scale-y-0 rounded-r-full bg-gradient-to-b from-primary-400 to-primary-600 transition-transform duration-300 group-hover:scale-y-100"
            />

            <NuxtLink :to="`/blog/${post.slug}`" class="block p-5">
              <!-- 元信息行 -->
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <span
                  v-if="post.category"
                  class="inline-flex items-center rounded-md bg-primary-50 px-2 py-0.5 font-mono text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                >
                  {{ post.category }}
                </span>
                <span class="text-slate-300 dark:text-slate-700">/</span>
                <time
                  :datetime="post.published_at || post.created_at"
                  class="flex items-center gap-1 font-mono text-xs text-slate-400 dark:text-slate-500"
                >
                  <Icon name="heroicons:calendar" class="h-3 w-3" />
                  {{ formatDateShort(post.published_at || post.created_at) }}
                </time>
                <span class="text-slate-300 dark:text-slate-700">/</span>
                <span
                  class="flex items-center gap-1 font-mono text-xs text-slate-400 dark:text-slate-500"
                >
                  <Icon name="heroicons:clock" class="h-3 w-3" />
                  {{ post.read_time || calculateReadTime(post.content) }} min
                </span>
              </div>

              <!-- 标题 -->
              <h3
                class="mb-2 text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400 sm:text-[17px]"
              >
                {{ post.title }}
              </h3>

              <!-- 摘要 -->
              <p
                v-if="post.excerpt"
                class="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
              >
                {{ post.excerpt }}
              </p>

              <!-- 底部：统计 + 阅读 -->
              <div
                class="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800"
              >
                <div
                  class="flex items-center gap-3 font-mono text-xs text-slate-400 dark:text-slate-500"
                >
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:heart" class="h-3.5 w-3.5 text-rose-400" />
                    {{ post.likes_count || 0 }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:chat-bubble-left-right" class="h-3.5 w-3.5" />
                    {{ post.comments_count || 0 }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:eye" class="h-3.5 w-3.5" />
                    {{ post.view_count || 0 }}
                  </span>
                </div>
                <span
                  class="group/read inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary-600 transition-all group-hover:gap-1.5 dark:text-primary-400"
                >
                  阅读全文
                  <Icon name="heroicons:arrow-right" class="h-3.5 w-3.5" />
                </span>
              </div>
            </NuxtLink>
          </article>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
          <button
            :disabled="currentPage === 1"
            class="touch-optimized flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-primary-700/60 dark:hover:text-primary-400"
            @click="goToPage(currentPage - 1)"
          >
            <Icon name="heroicons:chevron-left" class="h-4 w-4" />
            上一页
          </button>
          <span class="px-3 font-mono text-sm text-slate-400 dark:text-slate-500">
            {{ currentPage }}<span class="mx-1 text-slate-300 dark:text-slate-700">/</span
            >{{ totalPages }}
          </span>
          <button
            :disabled="currentPage === totalPages"
            class="touch-optimized flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-primary-700/60 dark:hover:text-primary-400"
            @click="goToPage(currentPage + 1)"
          >
            下一页
            <Icon name="heroicons:chevron-right" class="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const authorId = route.params.id as string

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

const formatDateShort = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' })
}

const calculateReadTime = (content: string) => {
  if (!content) return 1
  const text = content.replace(/<[^>]*>/g, '')
  return Math.max(1, Math.ceil(text.length / 200))
}

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
  if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
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
  meta: [{ name: 'description', content: author.value?.bio || '查看作者的所有博客文章' }]
})
</script>
