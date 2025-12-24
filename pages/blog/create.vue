<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-4xl">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">创建新文章</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">分享您的知识和想法</p>
        </div>

        <form class="space-y-6" @submit.prevent="createPost">
          <!-- 标题 -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              标题
            </label>
            <div class="mt-1">
              <input
                id="title"
                v-model="post.title"
                type="text"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="输入文章标题"
              />
            </div>
          </div>

          <!-- 别名 -->
          <div>
            <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              别名 (URL)
            </label>
            <div class="mt-1">
              <input
                id="slug"
                v-model="post.slug"
                type="text"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="文章URL别名"
              />
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                将用于文章的URL，例如: my-awesome-post
              </p>
            </div>
          </div>

          <!-- 摘要 -->
          <div>
            <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              摘要
            </label>
            <div class="mt-1">
              <textarea
                id="excerpt"
                v-model="post.excerpt"
                rows="3"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="简短描述文章内容"
              />
            </div>
          </div>

          <!-- 封面图片 -->
          <div>
            <label
              for="cover_image"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              封面图片
            </label>
            <div class="mt-1">
              <input
                id="cover_image"
                v-model="post.cover_image"
                type="text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="封面图片URL"
              />
            </div>
          </div>

          <!-- 分类 -->
          <div>
            <label
              for="category"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              分类
            </label>
            <div class="mt-1">
              <input
                id="category"
                v-model="post.category"
                type="text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="文章分类"
              />
            </div>
          </div>

          <!-- 标签 -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              标签 (用逗号分隔)
            </label>
            <div class="mt-1">
              <input
                id="tags"
                v-model="tagsString"
                type="text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="标签1, 标签2, 标签3"
              />
            </div>
          </div>

          <!-- 内容 -->
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              内容
            </label>
            <div class="mt-1">
              <MarkdownEditor
                id="content"
                v-model="post.content"
                placeholder="开始输入 Markdown 内容..."
              />
            </div>
          </div>

          <!-- 发布状态 -->
          <div class="flex items-center">
            <input
              id="published"
              v-model="post.published"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label for="published" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              立即发布
            </label>
          </div>

          <!-- 按钮 -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              @click="cancel"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
            >
              <span v-if="saving" class="mr-2">
                <Icon name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
              </span>
              创建文章
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// 页面元数据
definePageMeta({
  title: '创建文章',
  description: '创建新的博客文章',
  middleware: 'auth'
})

// 获取路由
const router = useRouter()

// 状态
const { user } = useSupabaseAuth()
const saving = ref(false)
const tagsString = ref('')

// 文章数据
const post = reactive({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  cover_image: '',
  published: false,
  category: '',
  tags: []
})

// 生成别名
const generateSlug = () => {
  if (post.title && !post.slug) {
    post.slug = post.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符合并为一个
      .trim() // 移除首尾空格
  }
}

// 监听标题变化，自动生成别名
watch(() => post.title, generateSlug)

// 创建文章
const createPost = async () => {
  if (!user.value) {
    const toast = useToast()
    toast.error('错误', '请先登录')
    return
  }

  saving.value = true
  try {
    const supabase = useSupabaseClient()

    // 转换标签字符串为数组
    const tags = tagsString.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    // 获取用户ID（兼容 id 和 sub 属性）
    const userId = user.value.id || user.value.sub
    if (!userId) {
      throw new Error('无法获取用户ID')
    }

    // 创建文章
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        cover_image: post.cover_image,
        published: post.published,
        author_id: userId,
        category: post.category,
        tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) throw error

    // 显示成功消息
    const toast = useToast()
    toast.success('成功', '文章已创建')

    // 跳转到文章详情页或我的博客页面
    router.push(post.published ? `/blog/${post.slug}` : '/my-blogs')
  } catch (error) {
    console.error('创建文章失败:', error)
    const toast = useToast()
    toast.error('错误', '创建文章失败')
  } finally {
    saving.value = false
  }
}

// 取消创建
const cancel = () => {
  router.push('/my-blogs')
}
</script>
