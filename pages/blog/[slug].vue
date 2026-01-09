<template>
  <div>
    <!-- 文章内容 -->
    <main class="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8 md:px-6 lg:px-8 lg:py-12">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="mb-3 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700 sm:mb-4" />
        <div class="mb-4 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 sm:mb-6" />
        <div class="space-y-3">
          <div class="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-8 text-center sm:py-12">
        <Icon
          name="heroicons:exclamation-triangle"
          class="mx-auto h-10 w-10 text-red-500 sm:h-12 sm:w-12"
        />
        <h2 class="mt-3 text-lg font-semibold text-gray-900 dark:text-white sm:mt-4 sm:text-xl">
          加载失败
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          {{ error }}
        </p>
        <button
          class="mt-4 rounded-md border border-blue-600 bg-white px-4 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
          @click="navigateTo('/')"
        >
          返回首页
        </button>
      </div>

      <!-- Blog Post -->
      <article v-else-if="post" class="prose prose-base max-w-none dark:prose-invert sm:prose-lg">
        <header class="mb-6 sm:mb-8">
          <div
            class="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 sm:mb-4 sm:text-sm"
          >
            <span
              class="inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200 sm:px-3"
            >
              {{ post.category }}
            </span>
            <span class="hidden sm:inline">•</span>
            <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
          </div>

          <h1
            class="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:mb-4 sm:text-3xl md:text-4xl"
          >
            {{ post.title }}
          </h1>

          <p
            v-if="post.excerpt"
            class="mb-4 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:mb-6 sm:text-lg md:text-xl"
          >
            {{ post.excerpt }}
          </p>

          <!-- 作者信息 -->
          <div
            class="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-center space-x-3 sm:space-x-4">
              <div class="flex-shrink-0">
                <img
                  v-if="author?.avatar_url"
                  :src="author.avatar_url"
                  :alt="author?.username || '作者'"
                  class="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
                />
                <div
                  v-else
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 sm:h-12 sm:w-12"
                >
                  <Icon
                    name="heroicons:user"
                    class="h-5 w-5 text-gray-500 dark:text-gray-400 sm:h-6 sm:w-6"
                  />
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                  {{ author?.username || '匿名作者' }}
                </p>
                <p
                  v-if="author?.bio"
                  class="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm"
                >
                  {{ author.bio }}
                </p>
              </div>
            </div>
            <button
              v-if="post?.author_id"
              type="button"
              class="touch-optimized inline-flex items-center justify-center space-x-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
              @click="navigateTo(`/authors/${post.author_id}`)"
            >
              <span>查看作者</span>
              <Icon name="heroicons:arrow-right" class="h-4 w-4" />
            </button>
          </div>

          <!-- 标签 -->
          <div
            v-if="post.tags && post.tags.length > 0"
            class="mb-4 flex flex-wrap gap-1.5 sm:mb-6 sm:gap-2"
          >
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="touch-optimized cursor-pointer rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:px-3"
              @click="navigateTo(`/tags/${tag}`)"
            >
              #{{ tag }}
            </span>
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
        <footer class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <!-- 互动统计 -->
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center space-x-6">
              <button
                :disabled="likeLoading || !user"
                class="flex items-center space-x-2 text-gray-500 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-red-400"
                @click="toggleLike"
              >
                <Icon
                  :name="isLiked ? 'heroicons:heart-solid' : 'heroicons:heart'"
                  :class="isLiked ? 'text-red-500' : ''"
                  class="h-5 w-5"
                />
                <span>{{ likesCount }}</span>
              </button>

              <div class="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <Icon name="heroicons:chat-bubble-left-right" class="h-5 w-5" />
                <span>{{ commentsCount }} 条评论</span>
              </div>
            </div>

            <div class="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Icon name="heroicons:eye" class="h-5 w-5" />
              <span>{{ viewCount || 0 }} 次阅读</span>
            </div>

            <div class="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Icon name="heroicons:clock" class="h-5 w-5" />
              <span>{{ readTime }} 分钟阅读</span>
            </div>
          </div>

          <!-- 分享按钮 -->
          <div class="mb-6">
            <ShareButton
              :title="post.title"
              :url="shareUrl"
              :excerpt="post.excerpt"
              :cover-image="post.cover_image"
            />
          </div>

          <!-- 上一篇/下一篇导航 -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              v-if="prevPost"
              class="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <NuxtLink :to="`/blog/${prevPost.slug}`" class="block">
                <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">上一篇</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ prevPost.title }}
                </p>
              </NuxtLink>
            </div>

            <div
              v-if="nextPost"
              class="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 md:text-right"
            >
              <NuxtLink :to="`/blog/${nextPost.slug}`" class="block">
                <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">下一篇</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ nextPost.title }}
                </p>
              </NuxtLink>
            </div>
          </div>
        </footer>
      </article>

      <!-- 评论区 -->
      <section v-if="post" class="mt-12">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
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
          class="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800"
        >
          <form @submit.prevent="submitComment">
            <textarea
              ref="commentInput"
              v-model="newComment"
              placeholder="写下你的评论..."
              rows="4"
              class="mb-4 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              @focus="keyboardInput.handleFocus"
              @blur="keyboardInput.handleBlur"
            />
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="commentLoading || !newComment.trim()"
                class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <span v-if="commentLoading">发表中...</span>
                <span v-else>发表评论</span>
              </button>
            </div>
          </form>
        </div>

        <div
          v-else
          class="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800"
        >
          <p class="mb-4 text-gray-600 dark:text-gray-400">登录后才能发表评论</p>
          <button
            class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
            @click="navigateTo('/auth/login')"
          >
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
            class="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800"
          >
            <Icon
              name="heroicons:chat-bubble-left-right"
              class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500"
            />
            <p class="text-gray-500 dark:text-gray-400">暂无评论，来发表第一条评论吧！</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex space-x-3">
                <div class="flex-shrink-0">
                  <img
                    v-if="comment.profiles?.avatar_url"
                    :src="comment.profiles.avatar_url"
                    :alt="comment.profiles?.username || '用户'"
                    class="h-10 w-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                  <div
                    v-else
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600"
                  >
                    <Icon name="heroicons:user" class="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center space-x-2">
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
                      class="flex-shrink-0 text-xs text-red-500 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                      @click="handleDeleteComment(comment.id)"
                    >
                      <span v-if="deleteLoading === comment.id">删除中...</span>
                      <span v-else class="flex items-center space-x-1">
                        <Icon name="heroicons:trash" class="h-3 w-3" />
                        <span>删除</span>
                      </span>
                    </button>
                  </div>
                  <p class="whitespace-pre-wrap break-words text-gray-700 dark:text-gray-300">
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
