<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-dark-900 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900"
        >
          <Icon
            name="heroicons:lock-closed"
            class="h-6 w-6 text-primary-600 dark:text-primary-400"
          />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ isLogin ? '登录账户' : '注册账户' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ isLogin ? '或' : '已有账户？' }}
          <button
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            @click="toggleMode"
          >
            {{ isLogin ? '注册新账户' : '立即登录' }}
          </button>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="email-address" class="sr-only">邮箱地址</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
              placeholder="邮箱地址"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
              placeholder="密码"
            />
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon
                name="heroicons:exclamation-triangle"
                class="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-400">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <div v-if="successMessage" class="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon
                name="heroicons:check-circle"
                class="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-400">
                {{ successMessage }}
              </h3>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            type="submit"
            :disabled="loading"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon
                v-if="loading"
                name="heroicons:arrow-path"
                class="h-5 w-5 animate-spin text-primary-500 group-hover:text-primary-400"
                aria-hidden="true"
              />
              <Icon
                v-else
                name="heroicons:lock-closed"
                class="h-5 w-5 text-primary-500 group-hover:text-primary-400"
                aria-hidden="true"
              />
            </span>
            {{ loading ? '处理中...' : isLogin ? '登录' : '注册' }}
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-dark-600" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-gray-50 px-2 text-gray-500 dark:bg-dark-900 dark:text-gray-400">
                或
              </span>
            </div>
          </div>

          <button
            type="button"
            :disabled="loading || githubLoading"
            class="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-600 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700"
            @click="handleGitHubLogin"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon
                v-if="githubLoading"
                name="heroicons:arrow-path"
                class="h-5 w-5 animate-spin text-gray-500 group-hover:text-gray-400 dark:text-gray-400"
                aria-hidden="true"
              />
              <Icon
                v-else
                name="simple-icons:github"
                class="h-5 w-5 text-gray-500 group-hover:text-gray-400 dark:text-gray-400"
                aria-hidden="true"
              />
            </span>
            {{ githubLoading ? '跳转中...' : '使用 GitHub 登录' }}
          </button>
        </div>

        <div v-if="isLogin" class="text-center">
          <button
            type="button"
            :disabled="resetLoading"
            class="text-sm text-primary-600 hover:text-primary-500 disabled:opacity-50 dark:text-primary-400 dark:hover:text-primary-300"
            @click="resetPassword"
          >
            {{ resetLoading ? '发送中...' : '忘记密码？' }}
          </button>
        </div>
      </form>
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
