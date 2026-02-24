<template>
  <header
    class="safe-area-top sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/95"
  >
    <div class="container mx-auto px-3 sm:px-4">
      <div class="lg:h-17 flex h-14 items-center justify-between sm:h-16">
        <!-- Logo 和标题 -->
        <NuxtLink to="/" class="flex items-center space-x-2" @click="showMobileMenu = false">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 sm:h-10 sm:w-10"
          >
            <Icon name="i-heroicons-book-open" class="h-5 w-5 text-white" />
          </div>
          <span
            class="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-gray-300 sm:text-xl"
            >{{ appName }}</span
          >
        </NuxtLink>

        <!-- 桌面端导航 -->
        <nav class="hidden space-x-1 lg:flex">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="relative px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            active-class="!text-primary-600 dark:!text-primary-400"
          >
            {{ item.name }}
            <span
              class="absolute inset-x-3 -bottom-px h-0.5 scale-x-0 bg-primary-600 transition-transform duration-300 group-hover:scale-x-100 dark:bg-primary-400"
            />
          </NuxtLink>
        </nav>

        <!-- 右侧按钮组 -->
        <div class="flex items-center gap-1 sm:gap-2">
          <!-- 搜索按钮 -->
          <button
            class="touch-optimized rounded-xl p-2.5 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="搜索"
            @click="showSearchModal = true"
          >
            <Icon name="i-heroicons-magnifying-glass" class="h-5 w-5" />
          </button>

          <!-- 暗色模式切换 -->
          <button
            class="touch-optimized rounded-xl p-2.5 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="切换暗色模式"
            @click="toggleDarkMode"
          >
            <Icon v-if="isDark" name="i-heroicons-sun" class="h-5 w-5" />
            <Icon v-else name="i-heroicons-moon" class="h-5 w-5" />
          </button>

          <!-- 用户菜单 -->
          <div v-if="user" class="relative">
            <button
              class="touch-optimized flex items-center rounded-xl p-1.5 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="用户菜单"
              @click="toggleUserMenu"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-sm font-semibold text-white shadow-md"
              >
                {{ user.email?.charAt(0).toUpperCase() }}
              </div>
            </button>
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl dark:border-gray-800 dark:bg-gray-900"
              >
                <div class="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                  <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.email }}
                  </p>
                </div>
                <NuxtLink
                  to="/profile"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  @click="showUserMenu = false"
                >
                  <Icon name="i-heroicons-user" class="h-4 w-4" />
                  个人资料
                </NuxtLink>
                <NuxtLink
                  to="/my-blogs"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  @click="showUserMenu = false"
                >
                  <Icon name="i-heroicons-document-text" class="h-4 w-4" />
                  我的博客
                </NuxtLink>
                <NuxtLink
                  v-if="isAdmin"
                  to="/admin"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  @click="showUserMenu = false"
                >
                  <Icon name="i-heroicons-cog-6-tooth" class="h-4 w-4" />
                  管理后台
                </NuxtLink>
                <div class="border-t border-gray-100 pt-1 dark:border-gray-800">
                  <button
                    class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    @click="handleSignOut"
                  >
                    <Icon name="i-heroicons-arrow-right-on-rectangle" class="h-4 w-4" />
                    退出登录
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- 登录按钮 -->
          <NuxtLink
            v-else
            to="/auth/login"
            class="touch-optimized hidden rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-xl sm:block"
          >
            登录
          </NuxtLink>

          <!-- 移动端菜单按钮 -->
          <button
            class="touch-optimized rounded-xl p-2.5 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white lg:hidden"
            aria-label="打开菜单"
            :aria-expanded="showMobileMenu"
            @click="toggleMobileMenu"
          >
            <Icon v-if="!showMobileMenu" name="i-heroicons-bars-3" class="h-6 w-6" />
            <Icon v-else name="i-heroicons-x-mark" class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="showMobileMenu"
          class="border-t border-gray-100 py-4 dark:border-gray-800 lg:hidden"
        >
          <nav class="flex flex-col space-y-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="touch-optimized flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              active-class="!bg-primary-50 !text-primary-600 dark:!bg-primary-900/20 dark:!text-primary-400"
              @click="showMobileMenu = false"
            >
              <Icon :name="item.icon" class="h-5 w-5" />
              {{ item.name }}
            </NuxtLink>
          </nav>
          <div class="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
            <NuxtLink
              to="/auth/login"
              class="touch-optimized flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-base font-semibold text-white shadow-lg"
              @click="showMobileMenu = false"
            >
              <Icon name="i-heroicons-arrow-right-on-rectangle" class="h-5 w-5" />
              登录
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 搜索模态框 -->
    <SearchModal :is-open="showSearchModal" @close="showSearchModal = false" />
  </header>
</template>

<script setup lang="ts">
// 获取应用名称
const appName = useRuntimeConfig().public.appName

const navItems = [
  { name: '首页', path: '/', icon: 'i-heroicons-home' },
  { name: '博客', path: '/blog', icon: 'i-heroicons-book-open' },
  { name: '作者', path: '/authors', icon: 'i-heroicons-users' },
  { name: '关于', path: '/about', icon: 'i-heroicons-information-circle' }
]

// 使用 nuxt color mode 管理暗黑模式
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const showMobileMenu = ref(false)
const showUserMenu = ref(false)
const showSearchModal = ref(false)

// 用户状态
const { user } = useSupabaseAuth()
const { isAdmin } = useAdmin()

// 切换暗色模式（使用 nuxt color mode）
const toggleDarkMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
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

  // 键盘快捷键：Cmd/Ctrl + K 打开搜索
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      showSearchModal.value = true
    }
  }
  document.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
})
</script>
