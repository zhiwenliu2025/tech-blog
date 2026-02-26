<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12"
  >
    <!-- 背景点阵 -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.15]"
      style="
        background-image: radial-gradient(circle, rgb(148 163 184 / 0.4) 1px, transparent 1px);
        background-size: 28px 28px;
      "
    />
    <!-- 光晕 -->
    <div
      class="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary-600/15 blur-3xl"
    />
    <div
      class="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl"
    />

    <div class="relative w-full max-w-sm">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-2.5">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-600/30"
          >
            <Icon name="heroicons:code-bracket" class="h-5 w-5 text-white" />
          </div>
          <span class="text-lg font-bold text-white">TechBlog</span>
        </NuxtLink>
      </div>

      <!-- 表单卡片（终端风格） -->
      <div
        class="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-black/40"
      >
        <!-- macOS 标题栏 -->
        <div
          class="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
        >
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <span class="font-mono text-[10px] text-slate-500">
            {{ isLogin ? 'auth.login' : 'auth.register' }}
          </span>
          <div class="w-14" />
        </div>

        <!-- 表单内容 -->
        <div class="px-6 py-7">
          <!-- 标题 -->
          <div class="mb-6">
            <div class="mb-1 font-mono text-[10px] text-primary-400">
              {{ isLogin ? '// user.signIn()' : '// user.signUp()' }}
            </div>
            <h1 class="text-xl font-bold text-white">
              {{ isLogin ? '欢迎回来' : '创建账户' }}
            </h1>
            <p class="mt-1 font-mono text-xs text-slate-500">
              {{ isLogin ? '登录您的账户以继续' : '注册一个新账户开始使用' }}
            </p>
          </div>

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <!-- 邮箱 -->
            <div>
              <label
                for="email-address"
                class="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] text-slate-400"
              >
                <span class="text-primary-400">email</span>
                <span class="text-rose-400">*</span>
              </label>
              <div class="relative">
                <Icon
                  name="heroicons:envelope"
                  class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="email-address"
                  v-model="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  placeholder="your@email.com"
                  class="block w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-primary-500 focus:bg-slate-800 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <!-- 密码 -->
            <div>
              <label
                for="password"
                class="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] text-slate-400"
              >
                <span class="text-primary-400">password</span>
                <span class="text-rose-400">*</span>
              </label>
              <div class="relative">
                <Icon
                  name="heroicons:key"
                  class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="password"
                  v-model="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  placeholder="••••••••"
                  class="block w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2.5 pl-10 pr-11 font-mono text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-primary-500 focus:bg-slate-800 focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 transition-colors hover:text-slate-300"
                  @click="showPassword = !showPassword"
                >
                  <Icon
                    :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                    class="h-4 w-4"
                  />
                </button>
              </div>
            </div>

            <!-- 错误提示 -->
            <div
              v-if="error"
              class="flex items-start gap-2.5 rounded-lg border border-rose-800/50 bg-rose-900/20 px-3.5 py-3"
            >
              <Icon
                name="heroicons:exclamation-triangle"
                class="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400"
              />
              <p class="font-mono text-xs text-rose-400">
                {{ error }}
              </p>
            </div>

            <!-- 成功提示 -->
            <div
              v-if="successMessage"
              class="flex items-start gap-2.5 rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-3.5 py-3"
            >
              <Icon
                name="heroicons:check-circle"
                class="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400"
              />
              <p class="font-mono text-xs text-emerald-400">
                {{ successMessage }}
              </p>
            </div>

            <!-- 提交按钮 -->
            <button
              type="submit"
              :disabled="loading"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon v-if="loading" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
              <Icon v-else name="heroicons:arrow-right-on-rectangle" class="h-4 w-4" />
              {{ loading ? '处理中...' : isLogin ? '登录' : '注册' }}
            </button>

            <!-- 分隔线 -->
            <div class="relative flex items-center gap-3">
              <div class="h-px flex-1 bg-slate-800" />
              <span class="font-mono text-[10px] text-slate-600">or</span>
              <div class="h-px flex-1 bg-slate-800" />
            </div>

            <!-- GitHub 登录 -->
            <button
              type="button"
              :disabled="loading || githubLoading"
              class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              @click="handleGitHubLogin"
            >
              <Icon v-if="githubLoading" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
              <Icon v-else name="simple-icons:github" class="h-4 w-4" />
              {{ githubLoading ? '跳转中...' : '使用 GitHub 登录' }}
            </button>
          </form>

          <!-- 底部切换 + 忘记密码 -->
          <div class="mt-5 flex items-center justify-between">
            <p class="font-mono text-[11px] text-slate-500">
              {{ isLogin ? '没有账户？' : '已有账户？' }}
              <button
                type="button"
                class="font-semibold text-primary-400 transition-colors hover:text-primary-300"
                @click="toggleMode"
              >
                {{ isLogin ? '注册' : '登录' }}
              </button>
            </p>
            <button
              v-if="isLogin"
              type="button"
              :disabled="resetLoading"
              class="font-mono text-[11px] text-slate-500 transition-colors hover:text-primary-400 disabled:opacity-50"
              @click="resetPassword"
            >
              {{ resetLoading ? '发送中...' : '忘记密码？' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 底部法律链接 -->
      <p class="mt-6 text-center font-mono text-[10px] text-slate-600">
        登录即表示同意
        <NuxtLink
          to="/terms"
          class="text-slate-400 underline underline-offset-2 transition-colors hover:text-primary-400"
        >
          服务条款
        </NuxtLink>
        和
        <NuxtLink
          to="/privacy"
          class="text-slate-400 underline underline-offset-2 transition-colors hover:text-primary-400"
        >
          隐私政策
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: '登录',
  description: '用户登录页面',
  layout: false
})

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const githubLoading = ref(false)
const error = ref('')
const successMessage = ref('')
const resetLoading = ref(false)

const { signIn, signUp, resetPassword: resetPasswordFn, signInWithGitHub } = useSupabaseAuth()

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
        await navigateTo('/')
      } else {
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
  } catch (err) {
    error.value = err.message || 'GitHub 登录失败，请重试'
    githubLoading.value = false
  }
}
</script>
