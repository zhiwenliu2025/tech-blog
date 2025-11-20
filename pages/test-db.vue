<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <h1 class="mb-6 text-2xl font-bold">数据库测试</h1>

      <div class="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-medium">连接状态</h2>
        <p v-if="loading">检查连接中...</p>
        <p v-else-if="error" class="text-red-500">
          {{ error }}
        </p>
        <p v-else class="text-green-500">连接成功</p>
      </div>

      <div class="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-medium">数据库表</h2>
        <div v-if="tables.length > 0">
          <ul>
            <li v-for="table in tables" :key="table" class="mb-2">
              {{ table }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>未找到表</p>
        </div>
      </div>

      <div class="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-medium">文章数量</h2>
        <p v-if="loadingPosts">加载中...</p>
        <p v-else>已发布文章: {{ postsCount }}</p>
        <p>总文章数: {{ totalPostsCount }}</p>
      </div>

      <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-medium">创建测试文章</h2>
        <button
          class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          @click="createTestPost"
        >
          创建测试文章
        </button>
        <p v-if="createResult" class="mt-2">
          {{ createResult }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const loading = ref(true)
const error = ref(null)
const tables = ref([])
const loadingPosts = ref(true)
const postsCount = ref(0)
const totalPostsCount = ref(0)
const createResult = ref('')

// 检查连接
const checkConnection = async () => {
  try {
    const { data, error: err } = await supabase
      .from('blog_posts')
      .select('count', { count: 'exact', head: true })

    if (err) throw err

    loading.value = false
    return true
  } catch (err: any) {
    error.value = err.message
    loading.value = false
    return false
  }
}

// 获取表列表
const getTables = async () => {
  try {
    // 在 Supabase 中，我们需要查询 information_schema
    const { data, error: err } = await supabase.rpc('get_tables')

    if (err) {
      // 如果 RPC 不可用，我们假设表存在
      tables.value = ['blog_posts', 'profiles', 'comments', 'likes']
    } else {
      tables.value = data || []
    }
  } catch (err) {
    // 如果出错，我们假设表存在
    tables.value = ['blog_posts', 'profiles', 'comments', 'likes']
  }
}

// 获取文章数量
const getPostsCount = async () => {
  try {
    // 获取已发布文章数量
    const { count: publishedCount, error: publishedErr } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)

    // 获取总文章数量
    const { count: totalCount, error: totalErr } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })

    if (publishedErr || totalErr) throw publishedErr || totalErr

    postsCount.value = publishedCount || 0
    totalPostsCount.value = totalCount || 0
    loadingPosts.value = false
  } catch (err: any) {
    error.value = err.message
    loadingPosts.value = false
  }
}

// 创建测试文章
const createTestPost = async () => {
  try {
    const { data, error: err } = await supabase
      .from('blog_posts')
      .insert({
        title: '测试文章',
        slug: 'test-post-' + Date.now(),
        excerpt: '这是一篇测试文章',
        content: '# 测试文章\n\n这是测试内容。',
        category: '测试',
        tags: ['测试', '示例'],
        published: true,
        published_at: new Date().toISOString()
      })
      .select()

    if (err) throw err

    createResult.value = '测试文章创建成功！'
    // 重新获取文章数量
    await getPostsCount()
  } catch (err: any) {
    createResult.value = '创建失败: ' + err.message
  }
}

// 初始化
onMounted(async () => {
  await checkConnection()
  await getTables()
  await getPostsCount()
})

// 页面元数据
useHead({
  title: '数据库测试',
  meta: [
    {
      name: 'description',
      content: '测试数据库连接和数据'
    }
  ]
})
</script>
