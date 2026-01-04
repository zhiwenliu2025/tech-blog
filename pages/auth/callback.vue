<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-dark-900 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8 text-center">
      <div v-if="loading" class="space-y-4">
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900"
        >
          <Icon
            name="heroicons:arrow-path"
            class="h-6 w-6 animate-spin text-primary-600 dark:text-primary-400"
          />
        </div>
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white">正在登录...</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">请稍候，我们正在处理您的登录请求</p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900"
        >
          <Icon
            name="heroicons:exclamation-triangle"
            class="h-6 w-6 text-red-600 dark:text-red-400"
          />
        </div>
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white">登录失败</h2>
        <p class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </p>
        <button
          class="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          @click="navigateTo('/auth/login')"
        >
          返回登录页面
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
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

    const { error: oauthError, error_description, error_code } = route.query

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
