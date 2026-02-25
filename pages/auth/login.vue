<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 sm:px-6 lg:px-8"
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
      <!-- Logo 和标题 -->
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
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl dark:bg-gray-800"
        >
          <Icon
            name="heroicons:lock-closed"
            class="h-8 w-8 text-primary-600 dark:text-primary-400"
          />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {{ isLogin ? '欢迎回来' : '创建账户' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ isLogin ? '登录您的账户以继续' : '注册一个新账户开始使用' }}
        </p>
      </div>

      <!-- 登录表单卡片 -->
      <div
        class="rounded-2xl border border-gray-200/60 bg-white/80 px-6 py-8 shadow-xl backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/80 sm:px-8"
      >
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label
                for="email-address"
                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >邮箱地址</label
              >
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Icon name="heroicons:envelope" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  v-model="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label
                for="password"
                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >密码</label
              >
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Icon name="heroicons:key" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  class="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-12 text-gray-900 placeholder-gray-500 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4"
                  @click="showPassword = !showPassword"
                >
                  <Icon
                    :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                    class="h-5 w-5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                  />
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="error"
            class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20"
          >
            <div class="flex items-start gap-3">
              <Icon
                name="heroicons:exclamation-triangle"
                class="h-5 w-5 flex-shrink-0 text-red-500"
              />
              <p class="text-sm text-red-600 dark:text-red-400">
                {{ error }}
              </p>
            </div>
          </div>

          <div
            v-if="successMessage"
            class="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800/50 dark:bg-green-900/20"
          >
            <div class="flex items-start gap-3">
              <Icon name="heroicons:check-circle" class="h-5 w-5 flex-shrink-0 text-green-500" />
              <p class="text-sm text-green-600 dark:text-green-400">
                {{ successMessage }}
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <button
              type="submit"
              :disabled="loading"
              class="touch-optimized flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              <Icon v-if="loading" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" />
              <Icon v-else name="heroicons:arrow-right-on-rectangle" class="h-5 w-5" />
              {{ loading ? '处理中...' : isLogin ? '登录' : '注册' }}
            </button>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200 dark:border-gray-600" />
              </div>
              <div class="relative flex justify-center">
                <span
                  class="bg-white px-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  >或</span
                >
              </div>
            </div>

            <button
              type="button"
              :disabled="loading || githubLoading"
              class="touch-optimized group flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="handleGitHubLogin"
            >
              <Icon v-if="githubLoading" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" />
              <Icon v-else name="simple-icons:github" class="h-5 w-5" />
              {{ githubLoading ? '跳转中...' : '使用 GitHub 登录' }}
            </button>
          </div>

          <div class="flex items-center justify-between text-sm">
            <p class="text-gray-600 dark:text-gray-400">
              {{ isLogin ? '还没有账户？' : '已有账户？' }}
              <button
                type="button"
                class="cursor-pointer font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                @click="toggleMode"
              >
                {{ isLogin ? '立即注册' : '立即登录' }}
              </button>
            </p>
            <button
              v-if="isLogin"
              type="button"
              :disabled="resetLoading"
              class="cursor-pointer font-medium text-primary-600 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-primary-400 dark:hover:text-primary-300"
              @click="resetPassword"
            >
              {{ resetLoading ? '发送中...' : '忘记密码？' }}
            </button>
          </div>
        </form>
      </div>

      <p class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        登录即表示同意我们的
        <NuxtLink to="/terms" class="text-primary-600 hover:text-primary-500 dark:text-primary-400">
          服务条款
        </NuxtLink>
        和
        <NuxtLink
          to="/privacy"
          class="text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          隐私政策
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  title: '登录',
  description: '用户登录页面',
  layout: false
})

// No explicit import needed for useSupabaseAuth - it should be auto-imported from the plugin

// State
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const githubLoading = ref(false)
const error = ref('')
const successMessage = ref('')
const resetLoading = ref(false)

// Composables
const { signIn, signUp, resetPassword: resetPasswordFn, signInWithGitHub } = useSupabaseAuth()

// Methods
const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  successMessage.value = ''
}

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = '请填写邮箱和密码'
    return
  }

  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    let result
    if (isLogin.value) {
      result = await signIn(email.value, password.value)
    } else {
      result = await signUp(email.value, password.value)
    }

    if (result.error) {
      error.value = result.error
    } else {
      if (isLogin.value) {
        // Login successful, redirect to home
        await navigateTo('/')
      } else {
        // Registration successful
        successMessage.value = '注册成功！请检查邮箱并确认账户。'
        email.value = ''
        password.value = ''
      }
    }
  } catch (err) {
    error.value = err.message || '操作失败，请重试'
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  if (!email.value) {
    error.value = '请先填写邮箱地址'
    return
  }

  resetLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const result = await resetPasswordFn(email.value)

    if (result.error) {
      error.value = result.error
    } else {
      successMessage.value = '密码重置邮件已发送，请检查邮箱。'
    }
  } catch (err) {
    error.value = err.message || '发送失败，请重试'
  } finally {
    resetLoading.value = false
  }
}

const handleGitHubLogin = async () => {
  githubLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const result = await signInWithGitHub()

    if (result.error) {
      error.value = result.error
      githubLoading.value = false
    }
    // 如果成功，会跳转到 GitHub，所以不需要在这里处理成功情况
  } catch (err) {
    error.value = err.message || 'GitHub 登录失败，请重试'
    githubLoading.value = false
  }
}
</script>
