<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 px-4 pt-16 sm:pt-24" @click.self="close">
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="close" />

        <!-- 搜索模态框 -->
        <div class="relative mx-auto max-w-2xl" @click.stop>
          <div
            class="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-2xl shadow-gray-900/20 dark:border-gray-700/60 dark:bg-gray-900"
          >
            <!-- 搜索输入框 -->
            <div
              class="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5 dark:border-gray-800"
            >
              <Icon
                name="heroicons:magnifying-glass"
                class="h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500"
              />
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="搜索文章标题、摘要..."
                class="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500"
                @keydown.esc="close"
                @keydown.enter.prevent="handleSearch"
              />
              <button
                v-if="searchQuery"
                class="flex cursor-pointer items-center justify-center rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                @click="clearSearch"
              >
                <Icon name="heroicons:x-mark" class="h-4 w-4" />
              </button>
              <kbd
                v-else
                class="hidden rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[11px] text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 sm:inline-flex"
                >ESC</kbd
              >
            </div>

            <!-- 搜索结果 -->
            <div class="max-h-[26rem] overflow-y-auto">
              <!-- 加载状态 -->
              <div v-if="loading" class="flex flex-col items-center gap-3 py-12">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30"
                >
                  <Icon name="heroicons:arrow-path" class="h-6 w-6 animate-spin text-primary-500" />
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">搜索中...</p>
              </div>

              <!-- 错误状态 -->
              <div v-else-if="error" class="px-4 py-6">
                <div
                  class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20"
                >
                  <Icon
                    name="heroicons:exclamation-triangle"
                    class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
                  />
                  <p class="text-sm text-red-600 dark:text-red-400">
                    {{ error }}
                  </p>
                </div>
              </div>

              <!-- 初始提示 -->
              <div
                v-else-if="!searchQuery"
                class="flex flex-col items-center gap-3 py-12 text-center"
              >
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800"
                >
                  <Icon
                    name="heroicons:magnifying-glass"
                    class="h-6 w-6 text-gray-400 dark:text-gray-500"
                  />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">开始搜索</p>
                  <p class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    输入关键词搜索文章标题或摘要
                  </p>
                </div>
              </div>

              <!-- 无结果 -->
              <div
                v-else-if="results.length === 0"
                class="flex flex-col items-center gap-3 py-12 text-center"
              >
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800"
                >
                  <Icon
                    name="heroicons:face-frown"
                    class="h-6 w-6 text-gray-400 dark:text-gray-500"
                  />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">未找到相关文章</p>
                  <p class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">试试其他关键词？</p>
                </div>
              </div>

              <!-- 搜索结果列表 -->
              <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
                <NuxtLink
                  v-for="post in results"
                  :key="post.id"
                  :to="`/blog/${post.slug}`"
                  class="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  @click="close"
                >
                  <div
                    class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30"
                  >
                    <Icon
                      name="heroicons:document-text"
                      class="h-4 w-4 text-primary-500 dark:text-primary-400"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {{ post.title }}
                    </p>
                    <p
                      v-if="post.excerpt"
                      class="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      {{ post.excerpt }}
                    </p>
                    <div class="mt-1.5 flex items-center gap-3">
                      <span
                        v-if="post.category"
                        class="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                      >
                        {{ post.category }}
                      </span>
                      <span
                        v-if="post.published_at"
                        class="text-[10px] text-gray-400 dark:text-gray-500"
                      >
                        {{ new Date(post.published_at).toLocaleDateString('zh-CN') }}
                      </span>
                    </div>
                  </div>
                  <Icon
                    name="heroicons:chevron-right"
                    class="mt-1 h-4 w-4 flex-shrink-0 text-gray-300 dark:text-gray-600"
                  />
                </NuxtLink>
              </div>
            </div>

            <!-- 底部提示 -->
            <div
              v-if="results.length > 0"
              class="flex items-center justify-between border-t border-gray-100 px-4 py-2.5 dark:border-gray-800"
            >
              <p class="text-xs text-gray-400 dark:text-gray-500">
                找到
                <span class="font-medium text-primary-600 dark:text-primary-400">{{
                  results.length
                }}</span>
                篇文章
              </p>
              <button
                class="cursor-pointer text-xs text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                @click="handleSearch"
              >
                查看全部结果 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const { searchPosts, loading } = useBlogPosts()
const results = ref<any[]>([])
const error = ref<string | null>(null)

// 防抖搜索
let searchTimeout: NodeJS.Timeout | null = null

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    results.value = []
    error.value = null
    return
  }

  try {
    error.value = null
    const { data, error: searchError } = await searchPosts(searchQuery.value, {
      limit: 10
    })

    if (searchError) {
      error.value = searchError
      results.value = []
    } else {
      results.value = data || []
    }
  } catch (err: any) {
    error.value = err.message || '搜索失败'
    results.value = []
  }
}

// 监听搜索关键词变化，使用防抖
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    performSearch()
  }, 300) // 300ms 防抖
})

// 处理搜索（按 Enter）
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 跳转到博客页面并传递搜索参数
    navigateTo(`/blog?q=${encodeURIComponent(searchQuery.value)}`)
    close()
  }
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
  error.value = null
}

// 关闭模态框
const close = () => {
  emit('close')
}

// 当模态框打开时，聚焦输入框
watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen) {
      nextTick(() => {
        searchInput.value?.focus()
      })
    } else {
      // 关闭时清空搜索
      clearSearch()
    }
  }
)

// 监听 ESC 键关闭
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      close()
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
