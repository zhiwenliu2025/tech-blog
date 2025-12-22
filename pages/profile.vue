<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-4xl">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">个人资料</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">管理您的个人信息和账户设置</p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <!-- 左侧个人信息卡片 -->
          <div class="md:col-span-1">
            <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
              <div class="h-24 bg-gradient-to-r from-blue-500 to-purple-600" />
              <div class="relative px-6 pb-6">
                <div class="absolute -top-12">
                  <div
                    class="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg dark:border-gray-800 dark:bg-gray-700"
                  >
                    <img
                      v-if="profile?.avatar_url"
                      :src="profile.avatar_url"
                      alt="头像"
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="flex h-full w-full items-center justify-center">
                      <Icon name="i-heroicons-user" class="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div class="pt-14 text-center">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ profile?.full_name || nuxtUser?.email }}
                  </h2>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ profile?.username || '@' + (nuxtUser?.email?.split('@')[0] || 'user') }}
                  </p>
                  <div class="mt-4 flex justify-center space-x-2">
                    <span
                      v-if="profile?.website"
                      class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      <Icon name="i-heroicons-globe-alt" class="mr-1 h-3 w-3" />
                      网站
                    </span>
                    <span
                      class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      <Icon name="i-heroicons-check-circle" class="mr-1 h-3 w-3" />
                      已验证
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 快速统计 -->
            <div class="mt-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">活动统计</h3>
                <div class="mt-4 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">发布文章</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                      stats.postsCount
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">评论</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                      stats.commentsCount
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400">获赞</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                      stats.likesCount
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 管理后台入口 -->
            <div
              v-if="profile?.is_admin"
              class="mt-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
            >
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">管理功能</h3>
                <div class="mt-4">
                  <NuxtLink
                    to="/admin"
                    class="flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800"
                  >
                    <Icon name="i-heroicons-cog-6-tooth" class="mr-2 h-4 w-4" />
                    进入管理后台
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧表单 -->
          <div class="md:col-span-2">
            <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
              <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">编辑个人资料</h3>
              </div>
              <form class="p-6" @submit.prevent="updateProfile">
                <div class="grid gap-6">
                  <!-- 头像上传 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >头像</label
                    >
                    <div class="mt-2">
                      <AvatarUploader
                        :avatar-url="profile?.avatar_url"
                        @uploaded="handleAvatarUploaded"
                        @error="handleAvatarError"
                      />
                      <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        支持 JPG、PNG、GIF、WebP，最大 2MB。支持拖拽上传。
                      </p>
                    </div>
                  </div>

                  <!-- 用户名 -->
                  <div>
                    <label
                      for="username"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >用户名</label
                    >
                    <div class="mt-1">
                      <input
                        id="username"
                        v-model="form.username"
                        type="text"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        placeholder="用户名"
                      />
                    </div>
                  </div>

                  <!-- 全名 -->
                  <div>
                    <label
                      for="full_name"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >全名</label
                    >
                    <div class="mt-1">
                      <input
                        id="full_name"
                        v-model="form.full_name"
                        type="text"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        placeholder="您的全名"
                      />
                    </div>
                  </div>

                  <!-- 网站 -->
                  <div>
                    <label
                      for="website"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >网站</label
                    >
                    <div class="mt-1">
                      <input
                        id="website"
                        v-model="form.website"
                        type="url"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <!-- 个人简介 -->
                  <div>
                    <label
                      for="bio"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >个人简介</label
                    >
                    <div class="mt-1">
                      <textarea
                        id="bio"
                        v-model="form.bio"
                        rows="4"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        placeholder="介绍一下您自己..."
                      />
                    </div>
                  </div>

                  <!-- 邮箱 -->
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >邮箱</label
                    >
                    <div class="mt-1">
                      <input
                        id="email"
                        :value="nuxtUser?.email"
                        type="email"
                        disabled
                        class="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300 sm:text-sm"
                      />
                    </div>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      您的邮箱地址无法更改
                    </p>
                  </div>

                  <!-- 提交按钮 -->
                  <div class="flex justify-end space-x-3">
                    <button
                      type="button"
                      class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      @click="resetForm"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      :disabled="loading"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      <span v-if="loading" class="mr-2">
                        <Icon name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
                      </span>
                      保存更改
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <!-- 账户设置 -->
            <div class="mt-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
              <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">账户设置</h3>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">修改密码</h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        定期更改密码以保护账户安全
                      </p>
                    </div>
                    <button
                      type="button"
                      class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      @click="resetPassword"
                    >
                      修改密码
                    </button>
                  </div>
                  <div class="border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-sm font-medium text-red-600 dark:text-red-400">删除账户</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          永久删除您的账户和所有相关数据
                        </p>
                      </div>
                      <button
                        type="button"
                        class="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-600 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        @click="confirmDeleteAccount"
                      >
                        删除账户
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认删除账户对话框 -->
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
                  删除账户
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    您确定要删除您的账户吗？此操作无法撤销，所有您的数据将被永久删除。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 dark:bg-gray-700 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              @click="deleteAccount"
            >
              删除
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

<script setup lang="ts">
// 页面元数据
definePageMeta({
  title: '个人资料',
  description: '管理您的个人信息和账户设置',
  middleware: 'auth'
})

// 用户状态
const { user: nuxtUser, signOut } = useSupabaseAuth()
const supabase = useSupabaseClient()

// 状态
const loading = ref(false)
const profile = ref(null)
const showDeleteDialog = ref(false)

// 调试用户对象
console.log('useSupabaseAuth nuxtUser:', nuxtUser.value)
console.log('用户ID (sub):', nuxtUser.value?.sub)

// 表单数据
const form = reactive({
  username: '',
  full_name: '',
  website: '',
  bio: ''
})

// 统计数据
const stats = reactive({
  postsCount: 0,
  commentsCount: 0,
  likesCount: 0
})

// 获取用户资料
const fetchProfile = async () => {
  if (!nuxtUser.value) {
    console.error('用户未登录')
    return
  }

  console.log('用户对象完整结构:', nuxtUser.value)
  console.log('用户ID类型:', typeof nuxtUser.value.sub)
  console.log('用户ID值:', nuxtUser.value.sub)

  if (!nuxtUser.value.sub) {
    console.error('用户ID不存在')
    const toast = useToast()
    toast.error('错误', '用户ID不存在，请重新登录')
    return
  }

  try {
    console.log('获取用户资料，用户ID:', nuxtUser.value.sub)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', nuxtUser.value.sub)
      .single()

    if (error) {
      console.error('获取用户资料错误:', error)
      throw error
    }

    console.log('获取到的用户资料:', data)
    profile.value = data
    // 填充表单
    Object.keys(form).forEach(key => {
      form[key] = data[key] || ''
    })
  } catch (error) {
    console.error('获取用户资料失败:', error)
    // 如果用户资料不存在，创建一个默认的
    if (error.code === 'PGRST116') {
      // PGRST116 是 "No rows found" 的错误代码
      console.log('用户资料不存在，创建默认资料')
      try {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: nuxtUser.value.sub,
            username: nuxtUser.value.email?.split('@')[0] || 'user',
            full_name: '',
            website: '',
            bio: ''
          })
          .select()
          .single()

        if (createError) throw createError

        console.log('创建的用户资料:', newProfile)
        profile.value = newProfile
        // 填充表单
        Object.keys(form).forEach(key => {
          form[key] = newProfile[key] || ''
        })
      } catch (createErr) {
        console.error('创建用户资料失败:', createErr)
      }
    }
  }
}

// 获取用户统计数据
const fetchStats = async () => {
  if (!nuxtUser.value) {
    console.error('用户未登录')
    return
  }

  if (!nuxtUser.value.sub) {
    console.error('用户ID不存在')
    return
  }

  try {
    // 获取文章数量
    const { count: postsCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', nuxtUser.value.sub)

    // 获取评论数量
    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', nuxtUser.value.sub)

    // 获取点赞数量
    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', nuxtUser.value.sub)

    stats.postsCount = postsCount || 0
    stats.commentsCount = commentsCount || 0
    stats.likesCount = likesCount || 0
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 更新用户资料
const updateProfile = async () => {
  if (!nuxtUser.value) {
    console.error('用户未登录')
    const toast = useToast()
    toast.error('错误', '用户未登录')
    return
  }

  if (!nuxtUser.value.sub) {
    console.error('用户ID不存在')
    const toast = useToast()
    toast.error('错误', '用户ID不存在，请重新登录')
    return
  }

  loading.value = true
  try {
    // 准备更新数据，只包含有值的字段
    const updateData = {}

    // 只添加有值的字段
    if (form.username !== undefined && form.username !== '') updateData.username = form.username
    if (form.full_name !== undefined && form.full_name !== '') updateData.full_name = form.full_name
    if (form.website !== undefined && form.website !== '') updateData.website = form.website
    if (form.bio !== undefined && form.bio !== '') updateData.bio = form.bio

    console.log('更新数据:', updateData)
    console.log('用户ID:', nuxtUser.value.sub)

    // 使用update而不是upsert，因为我们已经确定用户存在
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', nuxtUser.value.sub)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('更新成功，返回数据:', data)

    // 刷新数据
    await fetchProfile()

    // 显示成功消息
    const toast = useToast()
    toast.success('成功', '您的个人资料已更新')
  } catch (error) {
    console.error('更新个人资料失败:', error)
    const toast = useToast()
    toast.error('错误', `更新个人资料失败: ${error.message || '未知错误'}`)
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (profile.value) {
    Object.keys(form).forEach(key => {
      form[key] = profile.value[key] || ''
    })
  }
}

// 处理头像上传成功
const handleAvatarUploaded = async (url: string) => {
  const toast = useToast()
  try {
    // 刷新数据
    await fetchProfile()
    toast.success('成功', '头像已更新')
  } catch (error) {
    console.error('刷新资料失败:', error)
    toast.error('错误', '头像已上传，但刷新资料失败')
  }
}

// 处理头像上传错误
const handleAvatarError = (error: string) => {
  const toast = useToast()
  toast.error('错误', error)
}

// 重置密码
const resetPassword = async () => {
  if (!nuxtUser.value) {
    console.error('用户未登录')
    const toast = useToast()
    toast.error('错误', '用户未登录')
    return
  }

  if (!nuxtUser.value.email) {
    console.error('用户邮箱不存在')
    const toast = useToast()
    toast.error('错误', '用户邮箱不存在，请重新登录')
    return
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(nuxtUser.value.email)

    if (error) throw error

    const toast = useToast()
    toast.success('成功', '密码重置链接已发送到您的邮箱')
  } catch (error) {
    console.error('重置密码失败:', error)
    const toast = useToast()
    toast.error('错误', '重置密码失败，请重试')
  }
}

// 确认删除账户
const confirmDeleteAccount = () => {
  showDeleteDialog.value = true
}

// 删除账户
const deleteAccount = async () => {
  if (!nuxtUser.value) {
    console.error('用户未登录')
    const toast = useToast()
    toast.error('错误', '用户未登录')
    return
  }

  if (!nuxtUser.value.sub) {
    console.error('用户ID不存在')
    const toast = useToast()
    toast.error('错误', '用户ID不存在，请重新登录')
    return
  }

  loading.value = true
  try {
    // 删除用户资料
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', nuxtUser.value.sub)

    if (profileError) throw profileError

    // 删除用户认证记录
    const { error: authError } = await supabase.rpc('delete_user')

    if (authError) throw authError

    // 退出登录
    await signOut()

    // 重定向到首页
    await navigateTo('/')

    const toast = useToast()
    toast.success('成功', '您的账户已删除')
  } catch (error) {
    console.error('删除账户失败:', error)
    const toast = useToast()
    toast.error('错误', '删除账户失败，请重试')
  } finally {
    loading.value = false
    showDeleteDialog.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchProfile()
  fetchStats()
})

// 监听用户变化
watch(nuxtUser, newUser => {
  if (newUser) {
    fetchProfile()
    fetchStats()
  }
})
</script>
