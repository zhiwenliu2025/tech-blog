<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-4xl">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">编辑文章</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">编辑您的博客文章</p>
        </div>

        <form class="space-y-6" @submit.prevent="updatePost">
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
                :post-id="post.id"
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
              保存更改
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
  title: '编辑文章',
  description: '编辑博客文章',
  middleware: 'auth'
})

// 获取路由参数
const route = useRoute()
const router = useRouter()

// 状态
const { user } = useSupabaseAuth()
const supabase = useSupabaseClient()
const saving = ref(false)
const tagsString = ref('')

// 文章数据
const post = reactive({
  id: '',
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  cover_image: '',
  published: false,
  author_id: '',
  category: '',
  tags: []
})

// 获取文章数据
const fetchPost = async () => {
  try {
    if (!user.value) {
      const toast = useToast()
      toast.error('错误', '请先登录')
      router.push('/auth/login')
      return
    }

    const supabase = useSupabaseClient()
    const userId = user.value.id || user.value.sub

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error

    // 检查用户是否是文章作者
    if (data.author_id !== userId) {
      const toast = useToast()
      toast.error('错误', '您没有权限编辑此文章')
      router.push('/my-blogs')
      return
    }

    // 填充表单数据
    Object.assign(post, data)

    // 转换标签数组为字符串
    if (data.tags && Array.isArray(data.tags)) {
      tagsString.value = data.tags.join(', ')
    }
  } catch (error) {
    console.error('获取文章数据失败:', error)
    const toast = useToast()
    toast.error('错误', '获取文章数据失败')
    router.push('/my-blogs')
  }
}

// 更新文章
const updatePost = async () => {
  if (!user.value) {
    const toast = useToast()
    toast.error('错误', '请先登录')
    return
  }

  saving.value = true
  try {
    const supabase = useSupabaseClient()
    const userId = user.value.id || user.value.sub

    // 再次检查权限（防止在编辑过程中权限被修改）
    if (post.author_id !== userId) {
      const toast = useToast()
      toast.error('错误', '您没有权限编辑此文章')
      router.push('/my-blogs')
      return
    }

    // 转换标签字符串为数组
    const tags = tagsString.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    // 更新文章
    const { error } = await supabase
      .from('blog_posts')
      .update({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        cover_image: post.cover_image,
        published: post.published,
        category: post.category,
        tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', post.id)
      .eq('author_id', userId) // 确保只能更新自己的文章

    if (error) throw error

    // 显示成功消息
    const toast = useToast()
    toast.success('成功', '文章已更新')

    // 跳转到文章详情页或我的博客页面
    router.push(post.published ? `/blog/${post.slug}` : '/my-blogs')
  } catch (error) {
    console.error('更新文章失败:', error)
    const toast = useToast()
    toast.error('错误', '更新文章失败')
  } finally {
    saving.value = false
  }
}

// 取消编辑
const cancel = () => {
  router.push('/my-blogs')
}

// 页面加载时获取文章数据
onMounted(() => {
  fetchPost()
})
</script>
