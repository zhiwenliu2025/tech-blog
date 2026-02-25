<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
  >
    <!-- 装饰背景 -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-900/20"
      />
      <div
        class="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/20"
      />
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <NuxtLink
          to="/"
          class="mx-auto mb-6 inline-flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30"
          >
            <Icon name="heroicons:code-bracket" class="h-6 w-6 text-white" />
          </div>
          <span>TechBlog</span>
        </NuxtLink>
      </div>

      <!-- 内容卡片 -->
      <div
        class="rounded-2xl border border-gray-200/60 bg-white/80 px-6 py-10 shadow-xl backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/80 sm:px-8"
      >
        <!-- 加载中状态 -->
        <div v-if="loading" class="flex flex-col items-center gap-6 text-center">
          <div class="relative">
            <div
              class="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 shadow-lg dark:bg-primary-900/30"
            >
              <Icon
                name="heroicons:arrow-path"
                class="h-10 w-10 animate-spin text-primary-600 dark:text-primary-400"
              />
            </div>
            <div
              class="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-400 shadow-sm"
            >
              <div class="h-2 w-2 animate-pulse rounded-full bg-white" />
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">正在登录...</h2>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              请稍候，我们正在处理您的登录请求
            </p>
          </div>
          <!-- 进度条 -->
          <div class="w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              class="h-1.5 animate-pulse rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
              style="width: 70%"
            />
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="flex flex-col items-center gap-6 text-center">
          <div
            class="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 shadow-lg dark:bg-red-900/30"
          >
            <Icon
              name="heroicons:exclamation-triangle"
              class="h-10 w-10 text-red-500 dark:text-red-400"
            />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">登录失败</h2>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              登录过程中出现了问题，请重试
            </p>
          </div>
          <div
            class="w-full rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20"
          >
            <div class="flex items-start gap-3 text-left">
              <Icon
                name="heroicons:exclamation-circle"
                class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
              />
              <p class="text-sm text-red-600 dark:text-red-400">
                {{ error }}
              </p>
            </div>
          </div>
          <button
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            @click="navigateTo('/auth/login')"
          >
            <Icon name="heroicons:arrow-left" class="h-4 w-4" />
            返回登录页面
          </button>
        </div>
      </div>

      <p class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        如遇登录问题，请
        <NuxtLink
          to="/contact"
          class="text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          联系支持
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: '登录回调',
  description: 'OAuth 登录回调处理',
  layout: false
})

const supabase = useSupabaseClient()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const route = useRoute()

    const { error: oauthError, error_description } = route.query

    if (oauthError) {
      throw new Error(error_description || oauthError)
    }

    const { data, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      throw sessionError
    }

    if (data.session) {
      await new Promise(resolve => setTimeout(resolve, 500))
      await navigateTo('/')
    } else {
      error.value = '登录失败，请重试'
      loading.value = false
    }
  } catch (err) {
    error.value = err.message || '登录过程中发生错误'
    loading.value = false
  }
})
</script>
