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
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="close" />

        <!-- 搜索模态框 -->
        <div class="relative mx-auto mt-20 max-w-2xl transform transition-all" @click.stop>
          <div class="overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <!-- 搜索输入框 -->
            <div class="border-b border-gray-200 p-4 dark:border-gray-700">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Icon name="i-heroicons-magnifying-glass" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索文章..."
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-10 pr-10 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  @keydown.esc="close"
                  @keydown.enter.prevent="handleSearch"
                />
                <button
                  v-if="searchQuery"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="clearSearch"
                >
                  <Icon name="i-heroicons-x-mark" class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- 搜索结果 -->
            <div class="max-h-96 overflow-y-auto">
              <!-- 加载状态 -->
              <div v-if="loading" class="p-8 text-center">
                <Icon
                  name="i-heroicons-arrow-path"
                  class="mx-auto h-8 w-8 animate-spin text-gray-400"
                />
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">搜索中...</p>
              </div>

              <!-- 错误状态 -->
              <div v-else-if="error" class="p-8 text-center text-sm text-red-600 dark:text-red-400">
                {{ error }}
              </div>

              <!-- 空状态 -->
              <div
                v-else-if="!searchQuery"
                class="p-8 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                输入关键词开始搜索
              </div>

              <!-- 无结果 -->
              <div
                v-else-if="searchQuery && results.length === 0 && !loading"
                class="p-8 text-center"
              >
                <Icon name="i-heroicons-magnifying-glass" class="mx-auto h-12 w-12 text-gray-400" />
                <p class="mt-2 text-sm font-medium text-gray-900 dark:text-white">未找到相关文章</p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">请尝试其他关键词</p>
              </div>

              <!-- 搜索结果列表 -->
              <div
                v-else-if="results.length > 0"
                class="divide-y divide-gray-200 dark:divide-gray-700"
              >
                <NuxtLink
                  v-for="post in results"
                  :key="post.id"
                  :to="`/blog/${post.slug}`"
                  class="block px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                  @click="close"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ post.title }}
                      </h3>
                      <p
                        v-if="post.excerpt"
                        class="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        {{ post.excerpt }}
                      </p>
                      <div class="mt-2 flex items-center gap-4 text-xs text-gray-400">
                        <span v-if="post.category">{{ post.category }}</span>
                        <span v-if="post.published_at">
                          {{ new Date(post.published_at).toLocaleDateString('zh-CN') }}
                        </span>
                      </div>
                    </div>
                    <Icon
                      name="i-heroicons-chevron-right"
                      class="ml-4 h-5 w-5 flex-shrink-0 text-gray-400"
                    />
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- 底部提示 -->
            <div
              v-if="searchQuery && results.length > 0"
              class="border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400"
            >
              找到 {{ results.length }} 篇文章，按 Enter 查看更多结果
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
