<template>
  <div>
    <!-- 文章内容 -->
    <main class="mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8 lg:py-8">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="mb-4 h-64 w-full rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-80" />
        <div class="mb-3 mt-6 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700 sm:mb-4" />
        <div class="mb-4 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 sm:mb-6" />
        <div class="space-y-3">
          <div class="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-12 text-center sm:py-16">
        <div
          class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
        >
          <Icon name="heroicons:exclamation-triangle" class="h-10 w-10 text-red-500" />
        </div>
        <h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">加载失败</h2>
        <p class="mx-auto mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400 sm:text-base">
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

      <!-- Blog Post -->
      <article v-else-if="post" class="prose prose-base max-w-none dark:prose-invert sm:prose-lg">
        <!-- 封面图片 -->
        <div
          v-if="post.cover_image"
          class="relative -mx-3 mb-6 overflow-hidden rounded-2xl sm:-mx-4 sm:mb-8 md:-mx-6 lg:-mx-8"
        >
          <div class="aspect-[21/9] sm:aspect-[2/1]">
            <NuxtImg
              :src="post.cover_image"
              :alt="post.title"
              preset="cover"
              :sizes="'(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px'"
              class="h-full w-full object-cover"
            />
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          />
        </div>

        <header class="mb-6 sm:mb-8">
          <!-- 分类和标签 -->
          <div class="mb-4 flex flex-wrap items-center gap-2 sm:mb-6">
            <NuxtLink
              :to="`/category/${post.category?.toLowerCase()}`"
              class="touch-optimized inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-all hover:bg-primary-200 hover:shadow-sm dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
            >
              <Icon name="heroicons:folder" class="h-3.5 w-3.5" />
              {{ post.category }}
            </NuxtLink>
            <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Icon name="heroicons:calendar" class="h-3.5 w-3.5" />
              <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Icon name="heroicons:clock" class="h-3.5 w-3.5" />
              {{ readTime }} 分钟阅读
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Icon name="heroicons:eye" class="h-3.5 w-3.5" />
              {{ viewCount || 0 }} 阅读
            </div>
          </div>

          <!-- 标题 -->
          <h1
            class="mb-4 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:mb-5 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {{ post.title }}
          </h1>

          <!-- 摘要 -->
          <p
            v-if="post.excerpt"
            class="mb-6 border-l-4 border-primary-500 pl-4 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:mb-8 sm:text-lg md:text-xl"
          >
            {{ post.excerpt }}
          </p>

          <!-- 作者信息卡片 -->
          <div
            class="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800/50 sm:mb-8 sm:p-5"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="flex-shrink-0">
                  <img
                    v-if="author?.avatar_url"
                    :src="author.avatar_url"
                    :alt="author?.username || '作者'"
                    class="h-12 w-12 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900"
                  />
                  <div
                    v-else
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800"
                  >
                    <Icon
                      name="heroicons:user"
                      class="h-6 w-6 text-primary-600 dark:text-primary-400"
                    />
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ author?.username || '匿名作者' }}
                  </p>
                  <p v-if="author?.bio" class="truncate text-sm text-gray-500 dark:text-gray-400">
                    {{ author.bio }}
                  </p>
                </div>
              </div>
              <button
                v-if="post?.author_id"
                type="button"
                class="touch-optimized inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl dark:bg-primary-600 dark:hover:bg-primary-700"
                @click="navigateTo(`/authors/${post.author_id}`)"
              >
                <span>查看主页</span>
                <Icon name="heroicons:arrow-right" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag"
              :to="`/blog?tag=${encodeURIComponent(tag)}`"
              class="touch-optimized inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-primary-100 hover:text-primary-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-primary-900 dark:hover:text-primary-300"
            >
              <Icon name="heroicons:tag" class="mr-1.5 h-3 w-3" />
              {{ tag }}
            </NuxtLink>
          </div>
        </header>

        <!-- 文章内容 -->
        <ClientOnly>
          <BlogContentRenderer :content="post.content" content-type="auto" />
          <template #fallback>
            <div class="prose prose-lg max-w-none dark:prose-invert">
              <div class="animate-pulse space-y-4">
                <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </template>
        </ClientOnly>

        <!-- 文章底部 -->
        <footer class="mt-10 border-t border-gray-200 pt-8 dark:border-gray-700 sm:mt-12">
          <!-- 互动统计 -->
          <div
            class="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:mb-8 sm:p-5"
          >
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-4 sm:gap-6">
                <button
                  :disabled="likeLoading || !user"
                  class="touch-optimized group flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700"
                  :class="
                    isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500 dark:text-gray-300'
                  "
                  @click="toggleLike"
                >
                  <Icon
                    :name="isLiked ? 'heroicons:heart-solid' : 'heroicons:heart'"
                    :class="isLiked ? 'text-red-500' : 'group-hover:text-red-500'"
                    class="h-5 w-5 transition-colors"
                  />
                  <span>{{ likesCount }}</span>
                </button>

                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Icon name="heroicons:chat-bubble-left-right" class="h-5 w-5" />
                  <span>{{ commentsCount }} 条评论</span>
                </div>
              </div>

              <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-1.5">
                  <Icon name="heroicons:eye" class="h-4 w-4" />
                  <span>{{ viewCount || 0 }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Icon name="heroicons:clock" class="h-4 w-4" />
                  <span>{{ readTime }} 分钟</span>
                </div>
              </div>
            </div>

            <!-- 分享按钮 -->
            <div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
              <ShareButton
                :title="post.title"
                :url="shareUrl"
                :excerpt="post.excerpt"
                :cover-image="post.cover_image"
              />
            </div>
          </div>

          <!-- 上一篇/下一篇导航 -->
          <div class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            <div
              v-if="prevPost"
              class="touch-optimized group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-primary-700"
            >
              <NuxtLink :to="`/blog/${prevPost.slug}`" class="block">
                <p
                  class="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400"
                >
                  <Icon name="heroicons:arrow-left" class="h-3.5 w-3.5" />
                  上一篇
                </p>
                <p
                  class="line-clamp-2 font-medium text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
                >
                  {{ prevPost.title }}
                </p>
              </NuxtLink>
            </div>

            <div
              v-if="nextPost"
              class="touch-optimized group rounded-xl border border-gray-200 bg-white p-4 text-right transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-primary-700 md:text-left"
            >
              <NuxtLink :to="`/blog/${nextPost.slug}`" class="block">
                <p
                  class="mb-1.5 flex items-center justify-end gap-1 text-xs font-medium text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400"
                >
                  下一篇
                  <Icon name="heroicons:arrow-right" class="h-3.5 w-3.5" />
                </p>
                <p
                  class="line-clamp-2 font-medium text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
                >
                  {{ nextPost.title }}
                </p>
              </NuxtLink>
            </div>
          </div>
        </footer>
      </article>

      <!-- 评论区 -->
      <section v-if="post" class="mt-12 sm:mt-16">
        <div class="mb-6 flex items-center gap-3 sm:mb-8">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30"
          >
            <Icon
              name="heroicons:chat-bubble-left-right"
              class="h-5 w-5 text-primary-600 dark:text-primary-400"
            />
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            评论
            <span
              v-if="commentsCount > 0"
              class="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400"
            >
              ({{ commentsCount }})
            </span>
          </h2>
        </div>

        <!-- 评论输入框 -->
        <div
          v-if="user"
          class="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/50 sm:p-6"
        >
          <div class="mb-4 flex items-center gap-3">
            <img
              v-if="user.email"
              :src="`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`"
              alt="我的头像"
              class="h-10 w-10 rounded-full"
            />
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white">发表评论</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">分享你的看法</p>
            </div>
          </div>
          <form @submit.prevent="submitComment">
            <textarea
              ref="commentInput"
              v-model="newComment"
              placeholder="写下你的评论..."
              rows="4"
              class="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              @focus="keyboardInput.handleFocus"
              @blur="keyboardInput.handleBlur"
            />
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ newComment.length }} 字符</p>
              <button
                type="submit"
                :disabled="commentLoading || !newComment.trim()"
                class="touch-optimized inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                <Icon
                  v-if="commentLoading"
                  name="heroicons:arrow-path"
                  class="h-4 w-4 animate-spin"
                />
                <Icon v-else name="heroicons:paper-airplane" class="h-4 w-4" />
                <span>发表评论</span>
              </button>
            </div>
          </form>
        </div>

        <div
          v-else
          class="mb-8 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div
            class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
          >
            <Icon name="heroicons:user-circle" class="h-8 w-8 text-gray-400" />
          </div>
          <p class="mb-4 text-gray-600 dark:text-gray-400">登录后才能发表评论</p>
          <button
            class="touch-optimized inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl dark:bg-primary-600 dark:hover:bg-primary-700"
            @click="navigateTo('/auth/login')"
          >
            <Icon name="heroicons:arrow-right-on-rectangle" class="h-4 w-4" />
            登录
          </button>
        </div>

        <!-- 评论列表 -->
        <div v-if="commentsLoading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="flex space-x-3">
              <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div class="flex-1">
                <div class="mb-2 h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-600" />
                <div class="mb-1 h-3 w-full rounded bg-gray-300 dark:bg-gray-600" />
                <div class="h-3 w-3/4 rounded bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <template v-else>
          <div
            v-if="!comments || comments.length === 0"
            class="rounded-xl border border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50"
          >
            <div
              class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
            >
              <Icon name="heroicons:chat-bubble-left-right" class="h-7 w-7 text-gray-400" />
            </div>
            <p class="text-gray-500 dark:text-gray-400">暂无评论，来发表第一条评论吧！</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50 sm:p-5"
            >
              <div class="flex gap-3 sm:gap-4">
                <div class="flex-shrink-0">
                  <img
                    v-if="comment.profiles?.avatar_url"
                    :src="comment.profiles.avatar_url"
                    :alt="comment.profiles?.username || '用户'"
                    class="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                  />
                  <div
                    v-else
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600"
                  >
                    <Icon name="heroicons:user" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{
                          comment.profiles?.username || comment.profiles?.full_name || '匿名用户'
                        }}
                      </p>
                      <time
                        :datetime="comment.created_at"
                        class="text-xs text-gray-500 dark:text-gray-400"
                      >
                        {{ formatDate(comment.created_at) }}
                      </time>
                    </div>
                    <button
                      v-if="canDeleteComment(comment)"
                      :disabled="deleteLoading === comment.id"
                      class="touch-optimized flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      @click="handleDeleteComment(comment.id)"
                    >
                      <Icon
                        v-if="deleteLoading === comment.id"
                        name="heroicons:arrow-path"
                        class="h-3 w-3 animate-spin"
                      />
                      <Icon v-else name="heroicons:trash" class="h-3 w-3" />
                      <span>删除</span>
                    </button>
                  </div>
                  <p
                    class="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                  >
                    {{ comment.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// 获取路由参数
const route = useRoute()
const slug = route.params.slug as string

// 获取认证状态
const { user } = useSupabaseAuth()

// 获取博客文章
const {
  getPostBySlug,
  getPostComments,
  addComment,
  deleteComment,
  checkIsAdmin,
  likePost,
  unlikePost,
  checkIfUserLikedPost
} = useBlogPosts()

// 使用缓存获取统计信息
const { getStats, incrementView } = usePostStats()
const { invalidateLike, invalidateComment } = useCacheManager()

// 状态（部分状态保留，因为需要响应式更新）
// 状态（保留需要响应式更新的状态）
const commentLoading = ref(false)
const newComment = ref('')
const likeLoading = ref(false)
const isLiked = ref(false)
const deleteLoading = ref(null)
const isAdmin = ref(false)

// 评论输入框 ref
const commentInput = ref<HTMLTextAreaElement | null>(null)

// 键盘输入优化
const keyboardInput = useKeyboardInput(commentInput, {
  scrollDelay: 300,
  behavior: 'smooth',
  block: 'center',
  mobileOnly: true,
  offset: -20 // 向上偏移 20px，确保输入框上方有足够空间
})

// 计算阅读时间
const readTime = computed(() => {
  if (!post.value?.content) return 0

  // 假设每分钟阅读200字
  const wordsPerMinute = 200
  const text = post.value.content.replace(/<[^>]*>/g, '') // 移除HTML标签
  const wordCount = text.length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
})

// 获取上一篇/下一篇文章
const { data: adjacentPosts } = await useAsyncData(`adjacent-posts-${slug}`, async () => {
  if (!post.value) return { prev: null, next: null }

  // 这里需要实现获取相邻文章的逻辑
  // 暂时返回null，稍后实现
  return { prev: null, next: null }
})

const prevPost = computed(() => adjacentPosts.value?.prev)
const nextPost = computed(() => adjacentPosts.value?.next)

// 使用 useAsyncData 缓存文章详情（基于 slug）
const {
  data: postData,
  pending: postPending,
  error: postError,
  refresh: refreshPost
} = await useAsyncData(
  `post-${slug}`,
  async () => {
    const result = await getPostBySlug(slug)
    if (result.error) {
      throw new Error(result.error)
    }
    if (!result.data) {
      throw new Error('文章不存在')
    }
    return result.data
  },
  {
    default: () => null,
    server: true
  }
)

// 从缓存数据中提取文章信息
const post = computed(() => postData.value)
const author = computed(() => postData.value?.profiles || null)
const loading = computed(() => postPending.value)
const error = computed(() => {
  if (postError.value) {
    return postError.value.message || '加载失败'
  }
  return null
})

// 使用 useAsyncData 缓存评论（评论需要实时性，但可以短时间缓存）
const {
  data: commentsData,
  pending: commentsPending,
  refresh: refreshComments
} = await useAsyncData(
  `post-comments-${slug}`,
  async () => {
    // 等待文章数据加载完成
    if (!postData.value?.id) {
      return []
    }
    const result = await getPostComments(postData.value.id)
    if (result.error) {
      console.error('获取评论失败:', result.error)
      return []
    }
    return result.data || []
  },
  {
    default: () => [],
    server: true,
    // 评论需要实时性，但可以短时间缓存
    watch: [() => postData.value?.id] // 当文章ID变化时自动刷新
  }
)

const comments = computed(() => commentsData.value || [])
const commentsLoading = computed(() => commentsPending.value)

// 获取评论（保留用于手动刷新）
const fetchComments = async () => {
  await refreshComments()
}

// 使用缓存 API 获取互动数据（点赞数和评论数）
const likesCount = ref(0)
const commentsCount = ref(0)
const viewCount = ref(0)

// 获取统计数据（从缓存）
const fetchInteractionCounts = async () => {
  if (!postData.value?.id) return

  try {
    const stats = await getStats(postData.value.id)
    likesCount.value = stats.likeCount || 0
    commentsCount.value = stats.commentCount || 0
    viewCount.value = stats.viewCount || 0
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 检查点赞状态
const checkLikeStatus = async () => {
  if (!user.value || !postData.value?.id) return

  try {
    const result = await checkIfUserLikedPost(user.value.sub, postData.value.id)
    isLiked.value = result.data ? true : false
  } catch (err) {
    console.error('检查点赞状态失败:', err)
  }
}

// 提交评论
const submitComment = async () => {
  if (!user.value || !postData.value?.id || !newComment.value.trim()) return

  commentLoading.value = true

  try {
    const result = await addComment({
      post_id: postData.value.id,
      user_id: user.value.sub,
      content: newComment.value.trim()
    })

    if (!result.error) {
      newComment.value = ''
      // 清除缓存并刷新数据
      await invalidateComment(postData.value.id)
      await Promise.all([refreshComments(), fetchInteractionCounts()])
    }
  } catch (err) {
    console.error('发表评论失败:', err)
  } finally {
    commentLoading.value = false
  }
}

// 检查管理员状态
const checkAdminStatus = async () => {
  if (!user.value) {
    isAdmin.value = false
    return
  }

  try {
    const result = await checkIsAdmin(user.value.sub)
    if (!result.error) {
      isAdmin.value = result.data || false
    }
  } catch (err) {
    console.error('检查管理员状态失败:', err)
    isAdmin.value = false
  }
}

// 检查是否可以删除评论
const canDeleteComment = (comment: any) => {
  if (!user.value) return false
  // 如果是评论作者或管理员，可以删除
  return comment.user_id === user.value.sub || isAdmin.value
}

// 删除评论
const handleDeleteComment = async (commentId: string) => {
  if (!confirm('确定要删除这条评论吗？')) return

  deleteLoading.value = commentId

  try {
    const result = await deleteComment(commentId)
    if (!result.error) {
      // 清除缓存并刷新数据
      if (postData.value?.id) {
        await invalidateComment(postData.value.id)
      }
      await Promise.all([refreshComments(), fetchInteractionCounts()])
    } else {
      alert('删除评论失败：' + result.error)
    }
  } catch (err) {
    console.error('删除评论失败:', err)
    alert('删除评论失败')
  } finally {
    deleteLoading.value = null
  }
}

// 切换点赞状态
const toggleLike = async () => {
  if (!user.value || !postData.value?.id || likeLoading.value) return

  likeLoading.value = true

  try {
    let result

    if (isLiked.value) {
      result = await unlikePost(user.value.sub, postData.value.id)
      if (!result.error) {
        isLiked.value = false
        // 清除缓存并刷新数据
        await invalidateLike(postData.value.id)
        await fetchInteractionCounts()
      }
    } else {
      result = await likePost(user.value.sub, postData.value.id)
      if (!result.error) {
        isLiked.value = true
        // 清除缓存并刷新数据
        await invalidateLike(postData.value.id)
        await fetchInteractionCounts()
      }
    }
  } catch (err) {
    console.error('点赞操作失败:', err)
  } finally {
    likeLoading.value = false
  }
}

// 计算分享 URL
const config = useRuntimeConfig()
const shareUrl = computed(() => {
  if (!post.value) return ''
  const baseUrl =
    config.public.appUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${baseUrl}/blog/${post.value.slug}`
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays} 天前`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} 周前`
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} 个月前`
  } else {
    return `${Math.floor(diffDays / 365)} 年前`
  }
}

// 页面元数据
useHead(() => ({
  title: () => (post.value ? `${post.value.title} - 技术博客` : '文章详情'),
  meta: [
    {
      name: 'description',
      content: () => (post.value ? post.value.excerpt || post.value.title : '文章详情')
    },
    {
      property: 'og:title',
      content: () => (post.value ? post.value.title : '文章详情')
    },
    {
      property: 'og:description',
      content: () => (post.value ? post.value.excerpt || post.value.title : '文章详情')
    },
    {
      property: 'og:image',
      content: () => post.value?.cover_image || '/og-image.jpg'
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    }
  ]
}))

// 监听文章数据变化，初始化相关数据
watch(
  () => postData.value?.id,
  async postId => {
    if (postId) {
      // 增加阅读量（使用缓存API）
      await incrementView(postId)

      // 获取统计数据（从缓存）
      await fetchInteractionCounts()

      if (user.value) {
        await checkLikeStatus()
        await checkAdminStatus()
      }
    }
  },
  { immediate: true }
)

// 监听用户登录状态变化
watch(user, async newUser => {
  if (newUser && postData.value) {
    await checkLikeStatus()
    await checkAdminStatus()
  } else if (!newUser) {
    isLiked.value = false
    isAdmin.value = false
  }
})
</script>
