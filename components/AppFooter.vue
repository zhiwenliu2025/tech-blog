<template>
  <footer
    class="safe-area-bottom border-t border-gray-200 bg-white transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
      <div class="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4">
        <!-- Logo 和描述 -->
        <div class="col-span-1 md:col-span-2">
          <div class="mb-4 flex items-center space-x-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <Icon name="i-heroicons-book-open" class="h-5 w-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ appName }}</span>
          </div>
          <p class="max-w-md text-gray-600 dark:text-gray-300">
            {{ appDescription }}
          </p>
          <div class="mt-4 flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="GitHub"
            >
              <Icon name="i-simple-icons-github" class="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Twitter"
            >
              <Icon name="i-simple-icons-twitter" class="h-6 w-6" />
            </a>
            <a
              href="mailto:contact@example.com"
              class="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Email"
            >
              <Icon name="i-heroicons-envelope" class="h-6 w-6" />
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div>
          <h3
            class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
          >
            快速链接
          </h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/"
                class="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                首页
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/blog"
                class="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                博客
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/about"
                class="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                关于
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                联系
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 分类 -->
        <div>
          <h3
            class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
          >
            分类
          </h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/category/frontend"
                class="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                前端开发
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/category/backend"
                class="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                后端开发
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/category/devops"
                class="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                DevOps
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/category/ai"
                class="text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              >
                人工智能
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700 sm:mt-8 sm:pt-8">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p class="text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm md:text-left">
            © {{ currentYear }} {{ appName }}. 保留所有权利。
          </p>
          <div class="flex flex-wrap justify-center gap-4 sm:gap-6 md:justify-end">
            <NuxtLink
              to="/privacy"
              class="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              隐私政策
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
