<template>
  <div>
    <!-- 深色标题区 -->
    <div class="relative overflow-hidden bg-slate-900">
      <!-- 点阵底纹 -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.18]"
        style="
          background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
          background-size: 28px 28px;
        "
      />
      <div
        class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-600/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
      />

      <div class="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div class="flex items-center gap-4">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700"
          >
            <Icon name="heroicons:user-group" class="h-6 w-6 text-primary-400" />
          </div>
          <div>
            <div class="mb-0.5 font-mono text-xs text-primary-400">// authors</div>
            <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">博客作者</h1>
          </div>
        </div>
        <p class="mt-4 max-w-lg font-mono text-sm text-slate-400">
          发现优秀的创作者，探索他们的精彩文章
        </p>
      </div>
    </div>

    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <!-- 加载骨架 -->
      <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="i in 6"
          :key="i"
          class="animate-pulse rounded-xl border border-slate-200 p-5 dark:border-slate-800"
        >
          <div class="mb-4 flex items-center gap-3">
            <div class="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-28 rounded-md bg-slate-200 dark:bg-slate-700" />
              <div class="h-3 w-20 rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
          <div class="mb-2 h-3 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
          <div class="h-3 w-3/4 rounded-md bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="py-16 text-center">
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
          class="touch-optimized inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          @click="loadAuthors"
        >
          <Icon name="heroicons:arrow-path" class="h-4 w-4" />
          重试
        </button>
      </div>

      <!-- 作者列表 -->
      <div v-else>
        <!-- 空状态 -->
        <div
          v-if="authors.length === 0"
          class="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700/60 dark:bg-slate-800/20"
        >
          <Icon
            name="heroicons:user-group"
            class="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-600"
          />
          <p class="text-sm text-slate-400 dark:text-slate-500">暂无作者</p>
        </div>

        <!-- 作者卡片网格 -->
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="author in authors"
            :key="author.id"
            class="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800/60"
          >
            <!-- 左侧悬停高亮条 -->
            <div
              class="absolute left-0 top-0 h-full w-0.5 scale-y-0 rounded-r-full bg-gradient-to-b from-primary-400 to-primary-600 transition-transform duration-300 group-hover:scale-y-100"
            />

            <div class="flex flex-1 flex-col p-5">
              <!-- 头部：头像 + 姓名 -->
              <div class="mb-4 flex items-start gap-3">
                <div class="flex-shrink-0">
                  <img
                    v-if="author.avatar_url"
                    :src="author.avatar_url"
                    :alt="author.username || '作者'"
                    class="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-100 transition-all group-hover:ring-primary-200 dark:ring-slate-700 dark:group-hover:ring-primary-800"
                  />
                  <div
                    v-else
                    class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700"
                  >
                    <Icon name="heroicons:user" class="h-6 w-6 text-white" />
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <h3
                    class="mb-0.5 truncate font-semibold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
                  >
                    {{ author.username || author.full_name || '匿名作者' }}
                  </h3>
                  <p
                    v-if="author.bio"
                    class="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
                  >
                    {{ author.bio }}
                  </p>
                </div>
              </div>

              <!-- 统计信息（mono 风格） -->
              <div class="mt-auto border-t border-slate-100 pt-3 dark:border-slate-800">
                <div
                  class="mb-3 flex items-center gap-3 font-mono text-xs text-slate-400 dark:text-slate-500"
                >
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:document-text" class="h-3.5 w-3.5" />
                    {{ author.post_count || 0 }} posts
                  </span>
                  <span class="text-slate-300 dark:text-slate-700">·</span>
                  <span class="flex items-center gap-1">
                    <Icon name="heroicons:calendar" class="h-3.5 w-3.5" />
                    {{ formatDateShort(author.created_at) }}
                  </span>
                  <a
                    v-if="author.website"
                    :href="author.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ml-auto text-slate-400 transition-colors hover:text-primary-500 dark:text-slate-500 dark:hover:text-primary-400"
                    @click.stop
                  >
                    <Icon name="heroicons:globe-alt" class="h-3.5 w-3.5" />
                  </a>
                </div>

                <NuxtLink
                  :to="`/authors/${author.id}`"
                  class="group/link flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-primary-600 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-primary-600 dark:hover:text-white"
                >
                  查看文章
                  <Icon
                    name="heroicons:arrow-right"
                    class="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5"
                  />
                </NuxtLink>
              </div>
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

const formatDateShort = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' })
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
  meta: [{ name: 'description', content: '发现优秀的创作者，探索他们的精彩文章' }]
})
</script>
