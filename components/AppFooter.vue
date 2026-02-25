<template>
  <footer
    class="safe-area-bottom border-t border-gray-200 bg-white/80 backdrop-blur-sm transition-colors duration-300 dark:border-gray-800/80 dark:bg-gray-900/90"
  >
    <div class="container mx-auto px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12">
      <div class="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
        <!-- Logo 和描述 -->
        <div class="col-span-1 text-center lg:col-span-2 lg:text-left">
          <div class="mb-4 flex items-center justify-center space-x-2 lg:justify-start">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 sm:h-10 sm:w-10"
            >
              <Icon name="i-heroicons-book-open" class="h-5 w-5 text-white" />
            </div>
            <span
              class="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-gray-300"
              >{{ appName }}</span
            >
          </div>
          <p
            class="mx-auto max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400 lg:mx-0 lg:text-base"
          >
            {{ appDescription }}
          </p>
          <div class="mt-6 flex justify-center space-x-4 lg:justify-start">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="touch-optimized flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="GitHub"
            >
              <Icon name="i-simple-icons-github" class="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              class="touch-optimized flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="Twitter"
            >
              <Icon name="i-simple-icons-twitter" class="h-5 w-5" />
            </a>
            <a
              href="mailto:contact@example.com"
              class="touch-optimized flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="Email"
            >
              <Icon name="i-heroicons-envelope" class="h-5 w-5" />
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div class="text-center lg:text-left">
          <h3
            class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
          >
            快速链接
          </h3>
          <ul class="space-y-2.5">
            <li>
              <NuxtLink
                to="/"
                class="inline-block text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 lg:text-base"
              >
                首页
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/blog"
                class="inline-block text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 lg:text-base"
              >
                博客
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/about"
                class="inline-block text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 lg:text-base"
              >
                关于
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="inline-block text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 lg:text-base"
              >
                联系
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 分类 -->
        <div class="text-center lg:text-left">
          <h3
            class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
          >
            分类
          </h3>
          <ul class="space-y-2.5">
            <li>
              <NuxtLink
                to="/category/frontend"
                class="inline-block text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 lg:text-base"
              >
                前端开发
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/category/backend"
                class="inline-block text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 lg:text-base"
              >
                后端开发
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/category/devops"
                class="inline-block text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 lg:text-base"
              >
                DevOps
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/category/ai"
                class="inline-block text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 lg:text-base"
              >
                人工智能
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="mt-10 border-t border-gray-200 pt-6 dark:border-gray-800 sm:mt-12 sm:pt-8">
        <div
          class="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            © {{ currentYear }} {{ appName }}. 保留所有权利。
          </p>
          <div class="flex flex-wrap justify-center gap-4 sm:justify-end">
            <NuxtLink
              to="/privacy"
              class="text-xs text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 sm:text-sm"
            >
              隐私政策
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-xs text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 sm:text-sm"
            >
              服务条款
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 获取应用名称和描述
const { appName, appDescription } = useRuntimeConfig().public

// 获取当前年份
const currentYear = new Date().getFullYear()
</script>
