<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">我的博客</h1>
              <p class="mt-2 text-gray-600 dark:text-gray-400">管理您创建的博客文章</p>
            </div>
            <NuxtLink
              to="/blog/create"
              class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Icon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
              新建文章
            </NuxtLink>
          </div>
        </div>

        <!-- 文章列表 -->
        <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div v-if="loading" class="px-6 py-12 text-center">
            <Icon
              name="i-heroicons-arrow-path"
              class="mx-auto h-8 w-8 animate-spin text-gray-400"
            />
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">加载中...</p>
          </div>

          <div v-else-if="posts.length === 0" class="px-6 py-12 text-center">
            <Icon name="i-heroicons-document-text" class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">还没有文章</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              开始创建您的第一篇博客文章吧！
            </p>
            <div class="mt-6">
              <NuxtLink
                to="/blog/create"
                class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Icon name="i-heroicons-plus" class="mr-2 h-4 w-4" />
                创建第一篇文章
              </NuxtLink>
            </div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    标题
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    分类
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    状态
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    创建时间
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody
                class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
              >
                <tr v-for="post in posts" :key="post.id">
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ post.title }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ post.excerpt?.substring(0, 50) || '无摘要' }}...
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ post.category || '未分类' }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span
                      :class="[
                        post.published
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                        'inline-flex rounded-full px-2 py-1 text-xs font-medium'
                      ]"
                    >
                      {{ post.published ? '已发布' : '草稿' }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(post.created_at) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <NuxtLink
                      v-if="post.published"
                      :to="`/blog/${post.slug}`"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      查看
                    </NuxtLink>
                    <NuxtLink
                      :to="`/blog/edit/${post.id}`"
                      class="ml-4 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      编辑
                    </NuxtLink>
                    <button
                      type="button"
                      class="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      @click="confirmDeletePost(post)"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认删除文章对话框 -->
    <div v-if="showDeleteDialog" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="showDeleteDialog = false"
        />
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
        >
          <div class="bg-white px-4 pb-4 pt-5 dark:bg-gray-800 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10"
              >
                <Icon
                  name="i-heroicons-exclamation-triangle"
                  class="h-6 w-6 text-red-600 dark:text-red-400"
                />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  删除文章
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    您确定要删除文章 "{{ postToDelete?.title }}" 吗？此操作无法撤销。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 dark:bg-gray-700 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              :disabled="deleting"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-75 sm:ml-3 sm:w-auto sm:text-sm"
              @click="deletePost"
            >
              <span v-if="deleting" class="mr-2">
                <Icon name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
              </span>
              {{ deleting ? '删除中...' : '删除' }}
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
              @click="showDeleteDialog = false"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 页面元数据
definePageMeta({
  title: '我的博客',
  description: '管理您创建的博客文章',
  middleware: 'auth'
})

// 状态
const { user } = useSupabaseAuth()
const supabase = useSupabaseClient()
const posts = ref([])
const loading = ref(true)
const showDeleteDialog = ref(false)
const postToDelete = ref(null)
const deleting = ref(false)

// 获取用户自己的文章列表
const fetchMyPosts = async () => {
  if (!user.value) {
    loading.value = false
    return
  }

  try {
    loading.value = true
    const userId = user.value.id || user.value.sub

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    posts.value = data || []
  } catch (error) {
    console.error('获取文章列表失败:', error)
    const toast = useToast()
    toast.error('错误', '获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = dateString => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 确认删除文章
const confirmDeletePost = post => {
  postToDelete.value = post
  showDeleteDialog.value = true
}

// 删除文章
const deletePost = async () => {
  if (!postToDelete.value || !user.value) return

  try {
    deleting.value = true
    const userId = user.value.id || user.value.sub

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postToDelete.value.id)
      .eq('author_id', userId) // 确保只能删除自己的文章

    if (error) throw error

    // 更新文章列表
    await fetchMyPosts()
    showDeleteDialog.value = false
    postToDelete.value = null

    // 显示成功消息
    const toast = useToast()
    toast.success('成功', '文章已删除')
  } catch (error) {
    console.error('删除文章失败:', error)
    const toast = useToast()
    toast.error('错误', '删除文章失败')
  } finally {
    deleting.value = false
  }
}

// 页面加载时获取文章列表
onMounted(() => {
  fetchMyPosts()
})
</script>
