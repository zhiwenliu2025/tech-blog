<template>
  <div>
    <!-- 文章内容 -->
    <main class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="mb-4 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="mb-6 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="mb-6 h-64 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div class="space-y-3">
          <div class="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-12 text-center">
        <Icon name="heroicons:exclamation-triangle" class="mx-auto h-12 w-12 text-red-500" />
        <h2 class="mt-4 text-xl font-semibold text-gray-900 dark:text-white">加载失败</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ error }}
        </p>
        <UButton color="primary" variant="outline" class="mt-4" @click="navigateTo('/')">
          返回首页
        </UButton>
      </div>

      <!-- Blog Post -->
      <article v-else-if="post" class="prose prose-lg max-w-none dark:prose-invert">
        <header class="mb-8">
          <div class="mb-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <UBadge color="primary" variant="subtle">
              {{ post.category }}
            </UBadge>
            <span>•</span>
            <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
          </div>

          <h1 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {{ post.title }}
          </h1>

          <p v-if="post.excerpt" class="mb-6 text-xl text-gray-600 dark:text-gray-300">
            {{ post.excerpt }}
          </p>

          <!-- 作者信息 -->
          <div class="mb-6 flex items-center space-x-4">
            <div class="flex-shrink-0">
              <img
                v-if="author?.avatar_url"
                :src="author.avatar_url"
                :alt="author?.username || '作者'"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div
                v-else
                class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600"
              >
                <Icon name="heroicons:user" class="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ author?.username || '匿名作者' }}
              </p>
              <p v-if="author?.bio" class="text-sm text-gray-500 dark:text-gray-400">
                {{ author.bio }}
              </p>
            </div>
          </div>

          <!-- 封面图 -->
          <div v-if="post.cover_image" class="mb-8">
            <img
              :src="post.cover_image"
              :alt="post.title"
              class="h-64 w-full rounded-lg object-cover sm:h-96"
            />
          </div>

          <!-- 标签 -->
          <div v-if="post.tags && post.tags.length > 0" class="mb-6 flex flex-wrap gap-2">
            <UBadge
              v-for="tag in post.tags"
              :key="tag"
              color="gray"
              variant="outline"
              class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="navigateTo(`/tags/${tag}`)"
            >
              #{{ tag }}
            </UBadge>
          </div>
        </header>

        <!-- 文章内容 -->
        <div class="prose max-w-none dark:prose-invert" v-html="post.content" />

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
              <Icon name="heroicons:clock" class="h-5 w-5" />
              <span>{{ readTime }} 分钟阅读</span>
            </div>
          </div>

          <!-- 分享按钮 -->
          <div class="mb-6 flex items-center space-x-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">分享到：</span>
            <button
              class="text-gray-500 transition-colors hover:text-blue-400 dark:text-gray-400"
              @click="shareToTwitter"
            >
              <Icon name="simple-icons:twitter" class="h-5 w-5" />
            </button>
            <button
              class="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400"
              @click="shareToFacebook"
            >
              <Icon name="simple-icons:facebook" class="h-5 w-5" />
            </button>
            <button
              class="text-gray-500 transition-colors hover:text-green-500 dark:text-gray-400"
              @click="copyLink"
            >
              <Icon name="heroicons:link" class="h-5 w-5" />
            </button>
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
        <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">评论</h2>

        <!-- 评论输入框 -->
        <div v-if="user" class="mb-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
          <form @submit.prevent="submitComment">
            <UTextarea v-model="newComment" placeholder="写下你的评论..." rows="4" class="mb-4" />
            <div class="flex justify-end">
              <UButton
                type="submit"
                color="primary"
                :loading="commentLoading"
                :disabled="!newComment.trim()"
              >
                发表评论
              </UButton>
            </div>
          </form>
        </div>

        <div v-else class="mb-8 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800">
          <p class="mb-4 text-gray-600 dark:text-gray-400">登录后才能发表评论</p>
          <UButton color="primary" @click="navigateTo('/login')"> 登录 </UButton>
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

        <div
          v-else-if="comments.length === 0"
          class="py-8 text-center text-gray-500 dark:text-gray-400"
        >
          <Icon name="heroicons:chat-bubble-left-right" class="mx-auto mb-4 h-12 w-12" />
          <p>暂无评论，来发表第一条评论吧！</p>
        </div>

        <div v-else class="space-y-6">
          <div v-for="comment in comments" :key="comment.id" class="flex space-x-3">
            <div class="flex-shrink-0">
              <img
                v-if="comment.profiles?.avatar_url"
                :src="comment.profiles.avatar_url"
                :alt="comment.profiles?.username || '用户'"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div
                v-else
                class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600"
              >
                <Icon name="heroicons:user" class="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div class="flex-1">
              <div class="mb-1 flex items-center space-x-2">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ comment.profiles?.username || '匿名用户' }}
                </p>
                <time
                  :datetime="comment.created_at"
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  {{ formatDate(comment.created_at) }}
                </time>
              </div>
              <p class="text-gray-700 dark:text-gray-300">
                {{ comment.content }}
              </p>
            </div>
          </div>
        </div>
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
  likePost,
  unlikePost,
  checkIfUserLikedPost,
  getPostLikesCount,
  getPostCommentsCount
} = useBlogPosts()

// 状态
const post = ref(null)
const author = ref(null)
const loading = ref(true)
const error = ref(null)
const comments = ref([])
const commentsLoading = ref(false)
const commentLoading = ref(false)
const newComment = ref('')
const likeLoading = ref(false)
const isLiked = ref(false)
const likesCount = ref(0)
const commentsCount = ref(0)

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

// 获取文章详情
const fetchPost = async () => {
  loading.value = true
  error.value = null

  try {
    const result = await getPostBySlug(slug)

    if (result.error) {
      error.value = result.error
    } else if (result.data) {
      post.value = result.data
      author.value = result.data.profiles

      // 获取评论
      await fetchComments()

      // 获取点赞数和评论数
      await fetchInteractionCounts()

      // 检查用户是否已点赞
      if (user.value) {
        await checkLikeStatus()
      }
    } else {
      error.value = '文章不存在'
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 获取评论
const fetchComments = async () => {
  if (!post.value?.id) return

  commentsLoading.value = true

  try {
    const result = await getPostComments(post.value.id)
    if (!result.error) {
      comments.value = result.data || []
    }
  } catch (err) {
    console.error('获取评论失败:', err)
  } finally {
    commentsLoading.value = false
  }
}

// 获取互动数据
const fetchInteractionCounts = async () => {
  if (!post.value?.id) return

  try {
    const [likesResult, commentsResult] = await Promise.all([
      getPostLikesCount(post.value.id),
      getPostCommentsCount(post.value.id)
    ])

    if (!likesResult.error) {
      likesCount.value = likesResult.count || 0
    }

    if (!commentsResult.error) {
      commentsCount.value = commentsResult.count || 0
    }
  } catch (err) {
    console.error('获取互动数据失败:', err)
  }
}

// 检查点赞状态
const checkLikeStatus = async () => {
  if (!user.value || !post.value?.id) return

  try {
    const result = await checkIfUserLikedPost(user.value.id, post.value.id)
    isLiked.value = result.data ? true : false
  } catch (err) {
    console.error('检查点赞状态失败:', err)
  }
}

// 提交评论
const submitComment = async () => {
  if (!user.value || !post.value?.id || !newComment.value.trim()) return

  commentLoading.value = true

  try {
    const result = await addComment({
      post_id: post.value.id,
      user_id: user.value.id,
      content: newComment.value.trim()
    })

    if (!result.error) {
      newComment.value = ''
      await fetchComments()
      await fetchInteractionCounts()
    }
  } catch (err) {
    console.error('发表评论失败:', err)
  } finally {
    commentLoading.value = false
  }
}

// 切换点赞状态
const toggleLike = async () => {
  if (!user.value || !post.value?.id || likeLoading.value) return

  likeLoading.value = true

  try {
    let result

    if (isLiked.value) {
      result = await unlikePost(user.value.id, post.value.id)
      if (!result.error) {
        isLiked.value = false
        likesCount.value = Math.max(0, likesCount.value - 1)
      }
    } else {
      result = await likePost(user.value.id, post.value.id)
      if (!result.error) {
        isLiked.value = true
        likesCount.value += 1
      }
    }
  } catch (err) {
    console.error('点赞操作失败:', err)
  } finally {
    likeLoading.value = false
  }
}

// 分享到Twitter
const shareToTwitter = () => {
  if (!post.value) return

  const text = `${post.value.title} - ${post.value.excerpt || ''}`
  const url = `${window.location.origin}/blog/${post.value.slug}`
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    '_blank'
  )
}

// 分享到Facebook
const shareToFacebook = () => {
  if (!post.value) return

  const url = `${window.location.origin}/blog/${post.value.slug}`
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
}

// 复制链接
const copyLink = async () => {
  if (!post.value) return

  try {
    await navigator.clipboard.writeText(`${window.location.origin}/blog/${post.value.slug}`)
    // 这里可以添加一个提示，告诉用户链接已复制
  } catch (err) {
    console.error('复制链接失败:', err)
  }
}

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

// 初始化数据
onMounted(() => {
  fetchPost()
})

// 监听用户登录状态变化
watch(user, newUser => {
  if (newUser && post.value) {
    checkLikeStatus()
  } else if (!newUser) {
    isLiked.value = false
  }
})
</script>
