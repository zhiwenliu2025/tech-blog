<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4"
  >
    <!-- 背景点阵 -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.15]"
      style="
        background-image: radial-gradient(circle, rgb(148 163 184 / 0.4) 1px, transparent 1px);
        background-size: 28px 28px;
      "
    />
    <div
      class="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary-600/15 blur-3xl"
    />
    <div
      class="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl"
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

      <!-- 状态卡片（终端风格） -->
      <div
        class="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-black/40"
      >
        <!-- macOS 标题栏 -->
        <div
          class="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
        >
          <div class="flex items-center gap-2">
            <span
              class="h-2.5 w-2.5 rounded-full"
              :class="error ? 'bg-red-400/70' : 'bg-red-400/70'"
            />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span
              class="h-2.5 w-2.5 rounded-full"
              :class="!error && !loading ? 'bg-emerald-500' : 'bg-emerald-400/70'"
            />
          </div>
          <span class="font-mono text-[10px] text-slate-500">oauth.callback</span>
          <div class="w-14" />
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="flex flex-col items-center gap-5 px-6 py-10 text-center">
          <div class="relative">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800"
            >
              <Icon name="heroicons:arrow-path" class="h-8 w-8 animate-spin text-primary-500" />
            </div>
            <span
              class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500"
            >
              <span class="h-2 w-2 animate-pulse rounded-full bg-white" />
            </span>
          </div>
          <div>
            <p class="font-mono text-xs text-primary-400">// processing.auth</p>
            <h2 class="mt-1 text-lg font-bold text-white">正在登录...</h2>
            <p class="mt-1 font-mono text-xs text-slate-500">请稍候，正在处理您的登录请求</p>
          </div>
          <!-- 进度条 -->
          <div class="w-full overflow-hidden rounded-full bg-slate-800">
            <div
              class="h-1 animate-pulse rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
              style="width: 70%"
            />
          </div>
          <!-- 终端输出风格 -->
          <div class="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-left">
            <p class="font-mono text-[10px] text-slate-500">
              <span class="text-emerald-500">✓</span> connecting to auth server...
            </p>
            <p class="font-mono text-[10px] text-slate-500">
              <span class="text-primary-400">›</span> verifying session token...
            </p>
            <p class="animate-pulse font-mono text-[10px] text-slate-600">
              <span class="text-amber-400">›</span> loading user profile<span class="animate-pulse"
                >_</span
              >
            </p>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="flex flex-col items-center gap-5 px-6 py-10 text-center">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-800/50 bg-rose-900/20"
          >
            <Icon name="heroicons:exclamation-triangle" class="h-8 w-8 text-rose-400" />
          </div>
          <div>
            <p class="font-mono text-xs text-rose-400">// auth.error</p>
            <h2 class="mt-1 text-lg font-bold text-white">登录失败</h2>
            <p class="mt-1 font-mono text-xs text-slate-500">登录过程中出现了问题</p>
          </div>
          <!-- 错误信息 -->
          <div class="w-full rounded-lg border border-rose-800/50 bg-slate-950 p-3 text-left">
            <p class="mb-1 font-mono text-[10px] text-slate-500">stderr:</p>
            <p class="font-mono text-[10px] text-rose-400">
              {{ error }}
            </p>
          </div>
          <button
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
            @click="navigateTo('/auth/login')"
          >
            <Icon name="heroicons:arrow-left" class="h-4 w-4" />
            返回登录页面
          </button>
        </div>
      </div>

      <!-- 底部提示 -->
      <p class="mt-6 text-center font-mono text-[10px] text-slate-600">
        如遇登录问题，请
        <NuxtLink
          to="/contact"
          class="text-slate-400 underline underline-offset-2 transition-colors hover:text-primary-400"
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
    if (oauthError) throw new Error(error_description || oauthError)

    const { data, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError

    if (data.session) {
      await new Promise(resolve => setTimeout(resolve, 800))
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
