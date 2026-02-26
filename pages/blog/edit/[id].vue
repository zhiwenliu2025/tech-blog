<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- ═══════════ 顶部操作栏 ═══════════ -->
    <div
      class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95"
    >
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <!-- 左侧：面包屑 + 自动保存状态 -->
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/my-blogs"
            class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-500 transition-all hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <Icon name="heroicons:arrow-left" class="h-3.5 w-3.5" />
            返回
          </NuxtLink>
          <span class="text-slate-300 dark:text-slate-700">/</span>
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500">edit.post</span>

          <!-- 自动保存状态 -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-x-2"
            enter-to-class="opacity-100 translate-x-0"
          >
            <div
              v-if="lastSavedAt"
              class="hidden items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800 sm:flex"
            >
              <Icon
                v-if="isSaving"
                name="i-heroicons-arrow-path"
                class="h-3 w-3 animate-spin text-primary-500"
              />
              <Icon v-else name="i-heroicons-check-circle" class="h-3 w-3 text-emerald-500" />
              <span class="font-mono text-[10px] text-slate-400">{{
                formatSavedTime(lastSavedAt)
              }}</span>
            </div>
          </Transition>
        </div>

        <!-- 右侧：操作按钮 -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            @click="cancel"
          >
            取消
          </button>
          <button
            type="button"
            :disabled="saving"
            class="group flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            @click="updatePost"
          >
            <Icon v-if="saving" name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
            <Icon v-else name="heroicons:check" class="h-4 w-4" />
            {{ saving ? '保存中...' : '保存更改' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════ 主内容区 ═══════════ -->
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <form class="space-y-6" @submit.prevent="updatePost">
        <!-- 大标题输入 -->
        <div
          class="rounded-xl border border-slate-200 bg-white px-5 pb-4 pt-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="mb-1 font-mono text-xs text-slate-400 dark:text-slate-600">// title</div>
          <input
            id="title"
            v-model="post.title"
            type="text"
            required
            placeholder="输入文章标题..."
            class="w-full border-0 bg-transparent text-2xl font-bold text-slate-900 placeholder-slate-300 outline-none dark:text-white dark:placeholder-slate-700 sm:text-3xl"
          />
          <!-- URL slug 预览 -->
          <div
            v-if="post.slug"
            class="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800"
          >
            <Icon name="heroicons:link" class="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span class="font-mono text-xs text-slate-400">/blog/</span>
            <input
              id="slug"
              v-model="post.slug"
              type="text"
              required
              class="min-w-0 flex-1 border-0 bg-transparent font-mono text-xs text-primary-600 placeholder-slate-400 outline-none dark:text-primary-400"
              placeholder="url-slug"
            />
          </div>
          <div v-else class="mt-2 flex items-center gap-1.5">
            <Icon name="heroicons:link" class="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
            <span class="font-mono text-xs text-slate-300 dark:text-slate-700"
              >输入标题后将自动生成 URL 别名</span
            >
          </div>
        </div>

        <!-- 文章元数据面板（可折叠） -->
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
            @click="metaExpanded = !metaExpanded"
          >
            <div class="flex items-center gap-2">
              <Icon name="heroicons:adjustments-horizontal" class="h-4 w-4 text-slate-400" />
              <span class="font-mono text-xs text-slate-500 dark:text-slate-400"
                >// post.metadata</span
              >
              <span
                v-if="filledMetaCount > 0"
                class="rounded-full bg-primary-50 px-2 py-0.5 font-mono text-[10px] text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
              >
                {{ filledMetaCount }} 已填写
              </span>
            </div>
            <Icon
              name="heroicons:chevron-down"
              class="h-4 w-4 text-slate-400 transition-transform duration-200"
              :class="metaExpanded ? 'rotate-180' : ''"
            />
          </button>

          <div
            class="overflow-hidden transition-all duration-300"
            :class="metaExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="space-y-4 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
              <!-- 摘要 -->
              <div>
                <label
                  for="excerpt"
                  class="mb-1.5 flex items-center gap-1.5 font-mono text-xs text-slate-400 dark:text-slate-500"
                >
                  <span class="text-primary-500">excerpt</span>
                  <span class="text-slate-300 dark:text-slate-700">// 文章摘要</span>
                </label>
                <textarea
                  id="excerpt"
                  v-model="post.excerpt"
                  rows="2"
                  placeholder="简短描述文章内容..."
                  class="block w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
                />
              </div>

              <!-- 两列：分类 + 封面图 -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    for="category"
                    class="mb-1.5 block font-mono text-xs text-slate-400 dark:text-slate-500"
                  >
                    <span class="text-primary-500">category</span>
                  </label>
                  <div class="relative">
                    <Icon
                      name="heroicons:folder"
                      class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="category"
                      v-model="post.category"
                      type="text"
                      placeholder="前端开发"
                      class="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="cover_image"
                    class="mb-1.5 block font-mono text-xs text-slate-400 dark:text-slate-500"
                  >
                    <span class="text-primary-500">cover_image</span>
                  </label>
                  <div class="relative">
                    <Icon
                      name="heroicons:photo"
                      class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="cover_image"
                      v-model="post.cover_image"
                      type="text"
                      placeholder="https://..."
                      class="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3.5 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              <!-- 标签 -->
              <div>
                <label
                  for="tags"
                  class="mb-1.5 flex items-center gap-1.5 font-mono text-xs text-slate-400 dark:text-slate-500"
                >
                  <span class="text-primary-500">tags</span>
                  <span class="text-slate-300 dark:text-slate-700">// 逗号分隔</span>
                </label>
                <div class="relative">
                  <Icon
                    name="heroicons:tag"
                    class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="tags"
                    v-model="tagsString"
                    type="text"
                    placeholder="vue, nuxt, typescript"
                    class="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3.5 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
                  />
                </div>
                <!-- 标签预览 -->
                <div v-if="parsedTags.length > 0" class="mt-2 flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in parsedTags"
                    :key="tag"
                    class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>

              <!-- 发布状态开关 -->
              <div
                class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40"
              >
                <div>
                  <p class="font-mono text-xs text-primary-500">published</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ post.published ? '文章将立即对外公开' : '保存为草稿，不公开展示' }}
                  </p>
                </div>
                <button
                  type="button"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                  :class="post.published ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'"
                  @click="post.published = !post.published"
                >
                  <span
                    class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                    :class="post.published ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 内容编辑器 -->
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <!-- macOS 风格标题栏 -->
          <div
            class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span class="ml-2 font-mono text-xs text-slate-500">post.content.md</span>
            <div class="ml-auto font-mono text-[10px] text-slate-400">Markdown</div>
          </div>
          <div class="p-0">
            <MarkdownEditor
              id="content"
              v-model="post.content"
              :post-id="post.id"
              placeholder="开始输入 Markdown 内容..."
            />
          </div>
        </div>

        <!-- 底部操作区 -->
        <div
          class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="flex items-center gap-3">
            <!-- 发布状态指示 -->
            <div
              class="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px]"
              :class="
                post.published
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400'
              "
            >
              <span class="relative flex h-1.5 w-1.5">
                <span
                  class="absolute inline-flex h-full w-full rounded-full opacity-75"
                  :class="post.published ? 'animate-ping bg-emerald-400' : 'bg-amber-400'"
                />
                <span
                  class="relative inline-flex h-1.5 w-1.5 rounded-full"
                  :class="post.published ? 'bg-emerald-500' : 'bg-amber-500'"
                />
              </span>
              {{ post.published ? 'published' : 'draft' }}
            </div>
            <!-- 字数 -->
            <span v-if="post.content" class="font-mono text-xs text-slate-400 dark:text-slate-500">
              {{ post.content.length }} chars
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              @click="cancel"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="group flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon v-if="saving" name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
              <Icon v-else name="heroicons:check" class="h-4 w-4" />
              {{ saving ? '保存中...' : '保存更改' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- ═══════════ 草稿恢复弹窗 ═══════════ -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showRestoreDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        @click.self="ignoreDraft"
      >
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div
            v-if="showRestoreDialog"
            class="w-full max-w-sm overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
            @click.stop
          >
            <div
              class="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
            >
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span class="ml-2 font-mono text-xs text-slate-500">draft.restore</span>
              </div>
              <button
                type="button"
                class="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-slate-300"
                @click="ignoreDraft"
              >
                <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
              </button>
            </div>
            <div class="p-5">
              <div class="mb-4 flex items-start gap-3">
                <div
                  class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-900/40"
                >
                  <Icon name="heroicons:document-text" class="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p class="font-semibold text-white">发现未保存的草稿</p>
                  <p class="mt-1 text-sm text-slate-400">
                    检测到上次编辑内容比当前文章更新，是否恢复？
                  </p>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700"
                  @click="ignoreDraft"
                >
                  忽略
                </button>
                <button
                  type="button"
                  class="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-500"
                  @click="restoreDraft"
                >
                  恢复草稿
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  title: '编辑文章',
  description: '编辑博客文章',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { user } = useSupabaseAuth()
const supabase = useSupabaseClient()

const saving = ref(false)
const tagsString = ref('')
const showRestoreDialog = ref(false)
const isInitialLoad = ref(true)
const metaExpanded = ref(true)

const post = reactive({
  id: '',
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  cover_image: '',
  published: false,
  author_id: '',
  category: '',
  tags: []
})

const parsedTags = computed(() =>
  tagsString.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
)

const filledMetaCount = computed(() => {
  let count = 0
  if (post.excerpt) count++
  if (post.category) count++
  if (post.cover_image) count++
  if (tagsString.value) count++
  return count
})

const draftKey = `edit_${route.params.id}`
const {
  loadDraft,
  clearDraft,
  startAutoSave,
  stopAutoSave,
  manualSave,
  isSaving,
  lastSavedAt,
  formatSavedTime
} = useDraft(draftKey)

const fetchPost = async () => {
  try {
    if (!user.value) {
      useToast().error('错误', '请先登录')
      router.push('/auth/login')
      return
    }

    const userId = user.value.id || user.value.sub
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error

    if (data.author_id !== userId) {
      useToast().error('错误', '您没有权限编辑此文章')
      router.push('/my-blogs')
      return
    }

    Object.assign(post, data)
    if (data.tags && Array.isArray(data.tags)) {
      tagsString.value = data.tags.join(', ')
    }

    isInitialLoad.value = false

    const draft = loadDraft()
    if (draft && (draft.title || draft.content)) {
      const draftTime = draft.savedAt
      const postTime = new Date(data.updated_at).getTime()
      if (draftTime > postTime) {
        showRestoreDialog.value = true
      }
    }
  } catch (error) {
    console.error('获取文章数据失败:', error)
    useToast().error('错误', '获取文章数据失败')
    router.push('/my-blogs')
  }
}

const updatePost = async () => {
  if (!user.value) {
    useToast().error('错误', '请先登录')
    return
  }

  saving.value = true
  try {
    const userId = user.value.id || user.value.sub

    if (post.author_id !== userId) {
      useToast().error('错误', '您没有权限编辑此文章')
      router.push('/my-blogs')
      return
    }

    const tags = tagsString.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const { error } = await supabase
      .from('blog_posts')
      .update({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        cover_image: post.cover_image,
        published: post.published,
        category: post.category,
        tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', post.id)
      .eq('author_id', userId)

    if (error) throw error

    clearDraft()
    useToast().success('成功', '文章已更新')
    router.push(post.published ? `/blog/${post.slug}` : '/my-blogs')
  } catch (error) {
    console.error('更新文章失败:', error)
    useToast().error('错误', '更新文章失败')
  } finally {
    saving.value = false
  }
}

const restoreDraft = () => {
  const draft = loadDraft()
  if (draft) {
    post.title = draft.title || post.title
    post.slug = draft.slug || post.slug
    post.content = draft.content || post.content
    post.excerpt = draft.excerpt || post.excerpt
    post.cover_image = draft.cover_image || post.cover_image
    post.category = draft.category || post.category
    post.published = draft.published !== undefined ? draft.published : post.published
    if (draft.tags && draft.tags.length > 0) {
      tagsString.value = draft.tags.join(', ')
    }
    showRestoreDialog.value = false
    useToast().success('成功', '草稿已恢复')
  }
}

const ignoreDraft = () => {
  clearDraft()
  showRestoreDialog.value = false
}

const cancel = () => {
  if (post.title || post.content) {
    manualSave({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      cover_image: post.cover_image,
      category: post.category,
      tags: tagsString.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      published: post.published
    })
  }
  router.push('/my-blogs')
}

onMounted(() => {
  fetchPost()

  watch(
    () => isInitialLoad.value,
    isLoading => {
      if (!isLoading) {
        startAutoSave(() => ({
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          cover_image: post.cover_image,
          category: post.category,
          tags: tagsString.value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0),
          published: post.published
        }))
      }
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  stopAutoSave()
})
</script>
