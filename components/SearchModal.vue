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
      <div v-if="isOpen" class="fixed inset-0 z-50 px-4 pt-14 sm:pt-20" @click.self="close">
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="close" />

        <!-- 搜索弹窗 -->
        <div class="relative mx-auto max-w-2xl" @click.stop>
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95 -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div
              v-if="isOpen"
              class="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-black/60"
            >
              <!-- macOS 标题栏 -->
              <div
                class="flex items-center gap-2 border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
              >
                <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span class="ml-2 font-mono text-[10px] text-slate-500">search.posts</span>
                <div class="ml-auto">
                  <kbd
                    class="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-500"
                    >ESC</kbd
                  >
                </div>
              </div>

              <!-- 搜索输入框 -->
              <div class="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
                <span class="flex-shrink-0 font-mono text-sm text-primary-500">$</span>
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索文章标题、摘要..."
                  class="flex-1 bg-transparent font-mono text-sm text-white placeholder-slate-600 focus:outline-none"
                  @keydown.esc="close"
                  @keydown.enter.prevent="handleSearch"
                />
                <button
                  v-if="searchQuery"
                  class="flex items-center justify-center rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
                  @click="clearSearch"
                >
                  <Icon name="heroicons:x-mark" class="h-4 w-4" />
                </button>
              </div>

              <!-- 结果区 -->
              <div class="max-h-[26rem] overflow-y-auto">
                <!-- 加载中 -->
                <div v-if="loading || isPending" class="flex flex-col items-center gap-3 py-12">
                  <Icon name="heroicons:arrow-path" class="h-6 w-6 animate-spin text-primary-500" />
                  <p class="font-mono text-xs text-slate-500">searching...</p>
                </div>

                <!-- 错误 -->
                <div v-else-if="error" class="px-4 py-5">
                  <div
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
                </div>

                <!-- 初始提示 -->
                <div
                  v-else-if="!searchQuery"
                  class="flex flex-col items-center gap-3 py-12 text-center"
                >
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/50"
                  >
                    <Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p class="font-mono text-sm text-slate-400">// start typing to search</p>
                    <p class="mt-0.5 font-mono text-xs text-slate-600">
                      输入关键词搜索文章标题或摘要
                    </p>
                  </div>
                </div>

                <!-- 无结果 -->
                <div
                  v-else-if="!isPending && results.length === 0"
                  class="flex flex-col items-center gap-3 py-12 text-center"
                >
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/50"
                  >
                    <Icon name="heroicons:face-frown" class="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p class="font-mono text-sm text-slate-400">// no results found</p>
                    <p class="mt-0.5 font-mono text-xs text-slate-600">试试其他关键词？</p>
                  </div>
                </div>

                <!-- 搜索结果列表 -->
                <div v-else class="divide-y divide-slate-800">
                  <NuxtLink
                    v-for="post in results"
                    :key="post.id"
                    :to="`/blog/${post.slug}`"
                    class="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-slate-800/60"
                    @click="close"
                  >
                    <div
                      class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 transition-colors group-hover:bg-primary-900/40"
                    >
                      <Icon
                        name="heroicons:document-text"
                        class="h-4 w-4 text-slate-500 group-hover:text-primary-400"
                      />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-medium text-slate-200 group-hover:text-white">
                        {{ post.title }}
                      </p>
                      <p
                        v-if="post.excerpt"
                        class="mt-0.5 line-clamp-1 font-mono text-[11px] text-slate-500"
                      >
                        {{ post.excerpt }}
                      </p>
                      <div class="mt-1.5 flex items-center gap-2">
                        <span
                          v-if="post.category"
                          class="rounded-md bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400"
                        >
                          {{ post.category }}
                        </span>
                        <span v-if="post.published_at" class="font-mono text-[10px] text-slate-600">
                          {{ new Date(post.published_at).toLocaleDateString('zh-CN') }}
                        </span>
                      </div>
                    </div>
                    <Icon
                      name="heroicons:chevron-right"
                      class="mt-1 h-4 w-4 flex-shrink-0 text-slate-700 transition-colors group-hover:text-slate-500"
                    />
                  </NuxtLink>
                </div>
              </div>

              <!-- 底部状态栏 -->
              <div
                v-if="results.length > 0"
                class="flex items-center justify-between border-t border-slate-800 px-4 py-2.5"
              >
                <p class="font-mono text-[10px] text-slate-500">
                  找到 <span class="text-primary-400">{{ results.length }}</span> 篇文章
                </p>
                <button
                  class="font-mono text-[10px] text-slate-500 transition-colors hover:text-primary-400"
                  @click="handleSearch"
                >
                  查看全部结果 →
                </button>
              </div>
              <div
                v-else-if="!loading && !isPending && searchQuery"
                class="border-t border-slate-800 px-4 py-2"
              >
                <p class="font-mono text-[10px] text-slate-700">按 Enter 跳转到搜索页</p>
              </div>
            </div>
          </Transition>
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
const isPending = ref(false)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    results.value = []
    error.value = null
    isPending.value = false
    return
  }
  try {
    error.value = null
    const { data, error: searchError } = await searchPosts(searchQuery.value, { limit: 10 })
    if (searchError) {
      error.value = searchError
      results.value = []
    } else {
      results.value = data || []
    }
  } catch (err: any) {
    error.value = err.message || '搜索失败'
    results.value = []
  } finally {
    isPending.value = false
  }
}

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (searchQuery.value.trim()) {
    isPending.value = true
  } else {
    isPending.value = false
    results.value = []
    error.value = null
  }
  searchTimeout = setTimeout(() => performSearch(), 300)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/blog?q=${encodeURIComponent(searchQuery.value)}`)
    close()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
  error.value = null
}

const close = () => emit('close')

watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen) {
      nextTick(() => searchInput.value?.focus())
    } else {
      clearSearch()
    }
  }
)

onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) close()
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => document.removeEventListener('keydown', handleEscape))
})
</script>
