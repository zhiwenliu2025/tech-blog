<template>
  <header
    class="sticky top-0 z-50 bg-white shadow-sm transition-colors duration-300 dark:bg-gray-800"
  >
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo 和标题 -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <Icon name="i-heroicons-book-open" class="h-5 w-5 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">{{ appName }}</span>
        </NuxtLink>

        <!-- 桌面端导航 -->
        <nav class="hidden space-x-8 md:flex">
          <NuxtLink
            to="/"
            class="font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
          >
            首页
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
          >
            博客
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
          >
            关于
          </NuxtLink>
        </nav>

        <!-- 右侧按钮组 -->
        <div class="flex items-center space-x-4">
          <!-- 搜索按钮 -->
          <button
            class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="搜索"
          >
            <Icon name="i-heroicons-magnifying-glass" class="h-5 w-5" />
          </button>

          <!-- 暗色模式切换 -->
          <button
            class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="切换暗色模式"
            @click="toggleDarkMode"
          >
            <Icon v-if="isDark" name="i-heroicons-sun" class="h-5 w-5" />
            <Icon v-else name="i-heroicons-moon" class="h-5 w-5" />
          </button>

          <!-- 用户菜单 -->
          <div v-if="user" class="relative">
            <button
              class="flex items-center space-x-2 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="用户菜单"
              @click="toggleUserMenu"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600">
                <span class="text-sm font-medium text-white">{{
                  user.email?.charAt(0).toUpperCase()
                }}</span>
              </div>
            </button>
            <div
              v-if="showUserMenu"
              class="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg dark:bg-gray-800"
            >
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                @click="showUserMenu = false"
              >
                个人资料
              </NuxtLink>
              <NuxtLink
                to="/my-blogs"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                @click="showUserMenu = false"
              >
                我的博客
              </NuxtLink>
              <NuxtLink
                v-if="isAdmin"
                to="/admin"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                @click="showUserMenu = false"
              >
                管理后台
              </NuxtLink>
              <button
                class="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                @click="handleSignOut"
              >
                退出登录
              </button>
            </div>
          </div>

          <!-- 登录按钮 -->
          <NuxtLink
            v-else
            to="/auth/login"
            class="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
          >
            登录
          </NuxtLink>

          <!-- 移动端菜单按钮 -->
          <button
            class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 md:hidden"
            aria-label="打开菜单"
            @click="toggleMobileMenu"
          >
            <Icon name="i-heroicons-bars-3" class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div
        v-if="showMobileMenu"
        class="border-t border-gray-200 py-4 dark:border-gray-700 md:hidden"
      >
        <nav class="flex flex-col space-y-3">
          <NuxtLink
            to="/"
            class="font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
            @click="showMobileMenu = false"
          >
            首页
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
            @click="showMobileMenu = false"
          >
            博客
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
            @click="showMobileMenu = false"
          >
            关于
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// 获取应用名称
const appName = useRuntimeConfig().public.appName

// 暗色模式
const isDark = ref(false)
const showMobileMenu = ref(false)
const showUserMenu = ref(false)

// 用户状态
const { user } = useSupabaseAuth()
const { isAdmin } = useAdmin()

// 初始化暗色模式
onMounted(() => {
  // 检查本地存储或系统偏好
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

// 切换暗色模式
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 退出登录
const { signOut: signOutAuth } = useSupabaseAuth()
const handleSignOut = async () => {
  await signOutAuth()
  showUserMenu.value = false
  await navigateTo('/auth/login')
}

// 点击外部关闭菜单
onMounted(() => {
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>
