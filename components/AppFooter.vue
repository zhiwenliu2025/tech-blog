<template>
  <footer class="safe-area-bottom relative overflow-hidden bg-slate-900">
    <!-- 点阵底纹（与 Hero 一致） -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.18]"
      style="
        background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
        background-size: 28px 28px;
      "
    />
    <!-- 顶部渐变淡入 -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-900/80 to-transparent"
    />
    <!-- 右下角光晕 -->
    <div
      class="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary-600/10 blur-3xl"
    />
    <!-- 左上角光晕 -->
    <div
      class="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl"
    />

    <div class="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <!-- 主内容网格 -->
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <!-- 品牌区 (5 列) -->
        <div class="lg:col-span-5">
          <!-- Logo -->
          <div class="mb-5 flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25"
            >
              <Icon name="i-heroicons-book-open" class="h-5 w-5 text-white" />
            </div>
            <span class="text-xl font-bold text-white">{{ appName }}</span>
          </div>

          <!-- 描述 -->
          <p class="mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
            {{ appDescription }}
          </p>

          <!-- 终端风格 "built with" -->
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2 font-mono text-xs"
          >
            <span class="text-slate-500">$</span>
            <span class="text-slate-400">built with</span>
            <span class="text-primary-400">nuxt</span>
            <span class="text-slate-600">·</span>
            <span class="text-emerald-400">supabase</span>
            <span class="text-slate-600">·</span>
            <span class="text-sky-400">tailwind</span>
            <span class="inline-block h-3.5 w-0.5 animate-pulse bg-primary-400 opacity-80" />
          </div>

          <!-- 社交图标 -->
          <div class="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="touch-optimized flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition-all duration-200 hover:bg-primary-600 hover:text-white hover:shadow-lg hover:shadow-primary-600/20"
              aria-label="GitHub"
            >
              <Icon name="i-simple-icons-github" class="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              class="touch-optimized flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition-all duration-200 hover:bg-sky-500 hover:text-white hover:shadow-lg hover:shadow-sky-500/20"
              aria-label="Twitter"
            >
              <Icon name="i-simple-icons-twitter" class="h-4 w-4" />
            </a>
            <a
              href="mailto:contact@example.com"
              class="touch-optimized flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition-all duration-200 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/20"
              aria-label="Email"
            >
              <Icon name="i-heroicons-envelope" class="h-4 w-4" />
            </a>
          </div>
        </div>

        <!-- 导航链接 (3 列) -->
        <div class="lg:col-span-3">
          <h3 class="mb-5 font-mono text-xs text-slate-500">// 导航</h3>
          <ul class="space-y-3">
            <li v-for="link in navLinks" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="group flex items-center gap-2 text-sm text-slate-400 transition-colors duration-150 hover:text-white"
              >
                <span
                  class="h-px w-0 rounded-full bg-primary-400 transition-all duration-200 group-hover:w-4"
                />
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 技术分类 (4 列) -->
        <div class="lg:col-span-4">
          <h3 class="mb-5 font-mono text-xs text-slate-500">// 技术分类</h3>
          <ul class="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1">
            <li v-for="cat in categoryLinks" :key="cat.path">
              <NuxtLink
                :to="cat.path"
                class="group flex items-center gap-2 text-sm text-slate-400 transition-colors duration-150 hover:text-white"
              >
                <span
                  class="h-px w-0 rounded-full bg-primary-400 transition-all duration-200 group-hover:w-4"
                />
                {{ cat.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部版权栏 -->
      <div class="mt-14 border-t border-white/[0.07] pt-6">
        <div
          class="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <!-- 版权 -->
          <p class="font-mono text-xs text-slate-600">
            © {{ currentYear }} {{ appName }}.&nbsp;All rights reserved.
          </p>

          <!-- 法律链接 -->
          <div class="flex items-center gap-1 text-xs text-slate-600">
            <NuxtLink to="/privacy" class="px-2 py-1 transition-colors hover:text-slate-300">
              隐私政策
            </NuxtLink>
            <span class="text-slate-700">·</span>
            <NuxtLink to="/terms" class="px-2 py-1 transition-colors hover:text-slate-300">
              服务条款
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { appName, appDescription } = useRuntimeConfig().public
const currentYear = new Date().getFullYear()

const navLinks = [
  { label: '首页', path: '/' },
  { label: '博客', path: '/blog' },
  { label: '作者', path: '/authors' },
  { label: '关于', path: '/about' },
  { label: '联系', path: '/contact' }
]

const categoryLinks = [
  { label: '前端开发', path: '/blog?category=前端开发' },
  { label: '后端开发', path: '/blog?category=后端开发' },
  { label: 'DevOps', path: '/blog?category=DevOps' },
  { label: '人工智能', path: '/blog?category=人工智能' },
  { label: '架构设计', path: '/blog?category=架构设计' },
  { label: '云计算', path: '/blog?category=云计算' }
]
</script>
