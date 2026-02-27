<template>
  <header
    class="safe-area-top sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/95"
  >
    <div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
      <div class="flex h-14 items-center justify-between sm:h-16">
        <!-- ═══ Logo ═══ -->
        <NuxtLink to="/" class="group flex items-center gap-2.5" @click="showMobileMenu = false">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-md shadow-primary-500/20 transition-all group-hover:shadow-lg group-hover:shadow-primary-500/30 sm:h-9 sm:w-9"
          >
            <Icon name="heroicons:code-bracket" class="h-4 w-4 text-white sm:h-5 sm:w-5" />
          </div>
          <span
            class="font-mono text-base font-bold text-slate-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400 sm:text-lg"
          >
            {{ appName }}
          </span>
        </NuxtLink>

        <!-- ═══ 桌面端导航 ═══ -->
        <nav class="hidden items-center gap-1 lg:flex">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="group relative rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            active-class="!text-primary-600 !bg-primary-50 dark:!text-primary-400 dark:!bg-primary-900/20"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- ═══ 右侧工具栏 ═══ -->
        <div class="flex items-center gap-1">
          <!-- 搜索按钮 -->
          <button
            class="group flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="搜索"
            @click="showSearchModal = true"
          >
            <Icon name="i-heroicons-magnifying-glass" class="h-4 w-4 sm:h-5 sm:w-5" />
            <kbd
              class="hidden rounded border border-slate-200 bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-400 transition-colors group-hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 sm:inline-flex"
            >
              ⌘K
            </kbd>
          </button>

          <!-- 暗色模式切换 -->
          <div ref="colorMenuRef" class="relative">
            <button
              class="flex cursor-pointer items-center justify-center rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              :aria-label="`当前：${currentColorOption.label}，点击切换颜色模式`"
              :aria-expanded="showColorMenu"
              aria-haspopup="listbox"
              @click.stop="showColorMenu = !showColorMenu"
            >
              <Icon :name="currentColorOption.icon" class="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <Transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="showColorMenu"
                role="listbox"
                :aria-label="'颜色模式'"
                class="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-black/10 dark:border-slate-700/60 dark:bg-slate-900 dark:shadow-black/30"
                @click.stop
              >
                <!-- 标题 -->
                <div class="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                  <p class="font-mono text-[10px] text-slate-400 dark:text-slate-600">
                    // color_mode
                  </p>
                </div>
                <div class="p-1">
                  <button
                    v-for="option in colorOptions"
                    :key="option.value"
                    role="option"
                    :aria-selected="colorMode.preference === option.value"
                    class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150"
                    :class="[
                      colorMode.preference === option.value
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    ]"
                    @click="setColorMode(option.value)"
                  >
                    <Icon :name="option.icon" class="h-4 w-4 flex-shrink-0" />
                    <span>{{ option.label }}</span>
                    <Icon
                      v-if="colorMode.preference === option.value"
                      name="i-heroicons-check"
                      class="ml-auto h-3.5 w-3.5 flex-shrink-0 text-primary-600 dark:text-primary-400"
                    />
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- ═══ 用户头像 + 下拉菜单 ═══ -->
          <div v-if="user" ref="userMenuRef" class="relative">
            <button
              class="flex items-center gap-2 rounded-lg p-1.5 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="用户菜单"
              @click="toggleUserMenu"
            >
              <!-- 头像 -->
              <div
                class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-bold text-white shadow-sm sm:h-8 sm:w-8"
              >
                {{ user.email?.charAt(0).toUpperCase() }}
              </div>
              <Icon
                name="heroicons:chevron-down"
                class="hidden h-3 w-3 text-slate-400 transition-transform duration-150 sm:block"
                :class="showUserMenu ? 'rotate-180' : ''"
              />
            </button>

            <!-- 用户下拉菜单 -->
            <Transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-black/30"
                @click.stop
              >
                <!-- 标题栏 -->
                <div
                  class="flex items-center gap-2 border-b border-slate-800 bg-slate-800/60 px-3 py-2"
                >
                  <span class="h-2 w-2 rounded-full bg-red-400/60" />
                  <span class="h-2 w-2 rounded-full bg-amber-400/60" />
                  <span class="h-2 w-2 rounded-full bg-emerald-400/60" />
                  <span class="ml-1 font-mono text-[10px] text-slate-500">user.menu</span>
                </div>
                <!-- 用户信息 -->
                <div class="border-b border-slate-800 px-4 py-3">
                  <p class="font-mono text-[10px] text-slate-500">signed_in_as</p>
                  <p class="mt-0.5 truncate text-sm font-medium text-white">
                    {{ user.email }}
                  </p>
                </div>
                <!-- 菜单项 -->
                <div class="py-1">
                  <NuxtLink
                    to="/profile"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                    @click="showUserMenu = false"
                  >
                    <Icon name="i-heroicons-user" class="h-4 w-4 text-slate-500" />
                    个人资料
                  </NuxtLink>
                  <NuxtLink
                    to="/my-blogs"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                    @click="showUserMenu = false"
                  >
                    <Icon name="i-heroicons-document-text" class="h-4 w-4 text-slate-500" />
                    我的博客
                  </NuxtLink>
                  <NuxtLink
                    to="/blog/create"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                    @click="showUserMenu = false"
                  >
                    <Icon name="i-heroicons-plus" class="h-4 w-4 text-slate-500" />
                    写文章
                  </NuxtLink>
                  <NuxtLink
                    v-if="isAdmin"
                    to="/admin"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                    @click="showUserMenu = false"
                  >
                    <Icon name="i-heroicons-cog-6-tooth" class="h-4 w-4 text-slate-500" />
                    管理后台
                  </NuxtLink>
                </div>
                <!-- 退出 -->
                <div class="border-t border-slate-800 py-1">
                  <button
                    class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-400 transition-colors hover:bg-rose-900/20 hover:text-rose-300"
                    @click="handleSignOut"
                  >
                    <Icon name="i-heroicons-arrow-right-on-rectangle" class="h-4 w-4" />
                    退出登录
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- 登录按钮（未登录） -->
          <NuxtLink
            v-else
            to="/auth/login"
            class="hidden rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg sm:block"
          >
            登录
          </NuxtLink>

          <!-- 移动端菜单按钮 -->
          <button
            class="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
            aria-label="打开菜单"
            :aria-expanded="showMobileMenu"
            @click="toggleMobileMenu"
          >
            <Icon v-if="!showMobileMenu" name="i-heroicons-bars-3" class="h-5 w-5" />
            <Icon v-else name="i-heroicons-x-mark" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- ═══ 移动端菜单 ═══ -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="showMobileMenu"
          class="border-t border-slate-100 pb-4 pt-3 dark:border-slate-800 lg:hidden"
        >
          <!-- macOS 风格标题 -->
          <div class="mb-2 px-4">
            <span class="font-mono text-[10px] text-slate-400 dark:text-slate-600"
              >// navigation</span
            >
          </div>
          <nav class="flex flex-col gap-0.5 px-2">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              active-class="!bg-primary-50 !text-primary-700 dark:!bg-primary-900/20 dark:!text-primary-400"
              @click="showMobileMenu = false"
            >
              <Icon :name="item.icon" class="h-4 w-4 flex-shrink-0" />
              {{ item.name }}
            </NuxtLink>
          </nav>

          <!-- 移动端用户区 -->
          <div class="mt-3 border-t border-slate-100 px-2 pt-3 dark:border-slate-800">
            <div v-if="user" class="space-y-0.5">
              <!-- 已登录用户信息 -->
              <div
                class="mb-2 flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50"
              >
                <div
                  class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-sm font-bold text-white"
                >
                  {{ user.email?.charAt(0).toUpperCase() }}
                </div>
                <p class="truncate font-mono text-xs text-slate-500 dark:text-slate-400">
                  {{ user.email }}
                </p>
              </div>
              <NuxtLink
                to="/profile"
                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                @click="showMobileMenu = false"
              >
                <Icon name="i-heroicons-user" class="h-4 w-4 text-slate-400" />个人资料
              </NuxtLink>
              <NuxtLink
                to="/my-blogs"
                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                @click="showMobileMenu = false"
              >
                <Icon name="i-heroicons-document-text" class="h-4 w-4 text-slate-400" />我的博客
              </NuxtLink>
              <NuxtLink
                v-if="isAdmin"
                to="/admin"
                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                @click="showMobileMenu = false"
              >
                <Icon name="i-heroicons-cog-6-tooth" class="h-4 w-4 text-slate-400" />管理后台
              </NuxtLink>
              <button
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                @click="handleSignOut"
              >
                <Icon name="i-heroicons-arrow-right-on-rectangle" class="h-4 w-4" />退出登录
              </button>
            </div>
            <!-- 未登录 -->
            <NuxtLink
              v-else
              to="/auth/login"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-500"
              @click="showMobileMenu = false"
            >
              <Icon name="i-heroicons-arrow-right-on-rectangle" class="h-4 w-4" />
              登录
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 搜索弹窗 -->
    <SearchModal :is-open="showSearchModal" @close="showSearchModal = false" />
  </header>
</template>

<script setup lang="ts">
const appName = useRuntimeConfig().public.appName

const navItems = [
  { name: '首页', path: '/', icon: 'i-heroicons-home' },
  { name: '博客', path: '/blog', icon: 'i-heroicons-book-open' },
  { name: '作者', path: '/authors', icon: 'i-heroicons-users' },
  { name: '关于', path: '/about', icon: 'i-heroicons-information-circle' }
]

const colorMode = useColorMode()
const showMobileMenu = ref(false)
const showUserMenu = ref(false)
const showSearchModal = ref(false)
const showColorMenu = ref(false)

const colorMenuRef = ref<HTMLElement | null>(null)
const userMenuRef = ref<HTMLElement | null>(null)

const colorOptions = [
  { value: 'light', label: '浅色', icon: 'i-heroicons-sun' },
  { value: 'system', label: '跟随系统', icon: 'i-heroicons-computer-desktop' },
  { value: 'dark', label: '深色', icon: 'i-heroicons-moon' }
] as const

const currentColorOption = computed(() => {
  return colorOptions.find(o => o.value === colorMode.preference) ?? colorOptions[1]
})

const setColorMode = (mode: string) => {
  colorMode.preference = mode
  showColorMenu.value = false
}

const { user } = useSupabaseAuth()
const { isAdmin } = useAdmin()

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const { signOut: signOutAuth } = useSupabaseAuth()
const handleSignOut = async () => {
  await signOutAuth()
  showUserMenu.value = false
  showMobileMenu.value = false
  await navigateTo('/auth/login')
}

onMounted(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (colorMenuRef.value && !colorMenuRef.value.contains(target)) {
      showColorMenu.value = false
    }
    if (userMenuRef.value && !userMenuRef.value.contains(target)) {
      showUserMenu.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      showSearchModal.value = true
    }
    if (e.key === 'Escape') {
      showColorMenu.value = false
      showUserMenu.value = false
    }
  }
  document.addEventListener('keydown', handleKeyDown)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
  })
})
</script>
