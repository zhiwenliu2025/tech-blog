<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- ═══════════ 深色标题区 ═══════════ -->
    <div class="relative overflow-hidden bg-slate-900">
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.18]"
        style="
          background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
          background-size: 28px 28px;
        "
      />
      <div
        class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-600/10 blur-3xl"
      />
      <div
        class="bg-violet-600/8 pointer-events-none absolute -left-12 bottom-0 h-48 w-48 rounded-full blur-3xl"
      />
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
      />

      <div class="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="mb-1 font-mono text-xs text-primary-400">// my.posts</div>
            <h1 class="text-2xl font-bold text-white">我的博客</h1>
            <p class="mt-1 font-mono text-sm text-slate-400">管理您创建的博客文章</p>
          </div>

          <!-- 右侧：统计 + 操作按钮 -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- 统计数字 -->
            <div
              class="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5"
            >
              <div class="text-center">
                <div class="text-lg font-bold text-white">
                  {{ posts.length }}
                </div>
                <div class="font-mono text-[10px] text-slate-500">total</div>
              </div>
              <div class="h-7 w-px bg-slate-700" />
              <div class="text-center">
                <div class="text-lg font-bold text-emerald-400">
                  {{ publishedCount }}
                </div>
                <div class="font-mono text-[10px] text-slate-500">published</div>
              </div>
              <div class="h-7 w-px bg-slate-700" />
              <div class="text-center">
                <div class="text-lg font-bold text-amber-400">
                  {{ draftCount }}
                </div>
                <div class="font-mono text-[10px] text-slate-500">draft</div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center gap-2">
              <NuxtLink
                to="/blog-import"
                class="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:border-slate-500 hover:text-white"
              >
                <Icon name="i-heroicons-arrow-down-tray" class="h-4 w-4" />
                导入
              </NuxtLink>
              <NuxtLink
                to="/blog/create"
                class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500"
              >
                <Icon name="i-heroicons-plus" class="h-4 w-4" />
                新建文章
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════ 主内容 ═══════════ -->
    <div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- 过滤 Tab -->
      <div
        class="mb-5 flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900"
      >
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          class="flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150"
          :class="
            activeFilter === tab.id
              ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-700'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300'
          "
          @click="activeFilter = tab.id"
        >
          <span>{{ tab.label }}</span>
          <span
            class="rounded-full px-1.5 py-0.5 font-mono text-[10px]"
            :class="
              activeFilter === tab.id
                ? 'bg-white/20 text-white dark:bg-black/20'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            "
            >{{ tab.count }}</span
          >
        </button>
      </div>

      <!-- 文章列表容器 -->
      <div
        class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      >
        <!-- 加载中 -->
        <div v-if="loading" class="py-16 text-center">
          <Icon
            name="i-heroicons-arrow-path"
            class="mx-auto mb-3 h-8 w-8 animate-spin text-slate-300 dark:text-slate-700"
          />
          <p class="font-mono text-xs text-slate-400">loading posts...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="filteredPosts.length === 0" class="py-16 text-center">
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800"
          >
            <Icon
              name="i-heroicons-document-text"
              class="h-7 w-7 text-slate-300 dark:text-slate-700"
            />
          </div>
          <p class="font-mono text-sm text-slate-400 dark:text-slate-500">
            {{
              activeFilter === 'all'
                ? '// no posts yet'
                : activeFilter === 'published'
                  ? '// no published posts'
                  : '// no drafts'
            }}
          </p>
          <p class="mt-1 text-sm text-slate-400 dark:text-slate-500">
            {{
              activeFilter === 'all' ? '开始创建您的第一篇博客文章吧！' : '切换过滤条件查看其他文章'
            }}
          </p>
          <NuxtLink
            v-if="activeFilter === 'all'"
            to="/blog/create"
            class="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500"
          >
            <Icon name="i-heroicons-plus" class="h-4 w-4" />
            创建第一篇文章
          </NuxtLink>
        </div>

        <!-- 有数据时：移动端卡片 + 桌面端表格 -->
        <div v-else>
          <!-- 移动端卡片 -->
          <div class="divide-y divide-slate-100 dark:divide-slate-800 sm:hidden">
            <div v-for="post in filteredPosts" :key="post.id" class="p-4">
              <!-- 标题行 -->
              <div class="mb-2 flex items-start justify-between gap-2">
                <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                  {{ post.title }}
                </h3>
                <span
                  class="flex-shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px]"
                  :class="
                    post.published
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400'
                  "
                >
                  {{ post.published ? 'published' : 'draft' }}
                </span>
              </div>
              <!-- 摘要 -->
              <p class="mb-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                {{ post.excerpt || '暂无摘要' }}
              </p>
              <!-- 元信息 -->
              <div
                class="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] text-slate-400 dark:text-slate-500"
              >
                <span
                  v-if="post.category"
                  class="rounded-md bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800"
                  >{{ post.category }}</span
                >
                <span>{{ formatDate(post.created_at) }}</span>
              </div>
              <!-- 操作 -->
              <div class="flex gap-2">
                <NuxtLink
                  v-if="post.published"
                  :to="`/blog/${post.slug}`"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                >
                  <Icon name="heroicons:eye" class="h-3.5 w-3.5" />查看
                </NuxtLink>
                <NuxtLink
                  :to="`/blog/edit/${post.id}`"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                >
                  <Icon name="i-heroicons-pencil" class="h-3.5 w-3.5" />编辑
                </NuxtLink>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition-all hover:bg-rose-50 dark:border-rose-800/50 dark:bg-slate-800 dark:text-rose-400"
                  @click="confirmDeletePost(post)"
                >
                  <Icon name="i-heroicons-trash" class="h-3.5 w-3.5" />删除
                </button>
              </div>
            </div>
          </div>

          <!-- 桌面端表格 -->
          <div class="hidden overflow-x-auto sm:block">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-800">
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    标题
                  </th>
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    分类
                  </th>
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    状态
                  </th>
                  <th
                    class="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    创建时间
                  </th>
                  <th
                    class="px-5 py-3 text-right font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  v-for="post in filteredPosts"
                  :key="post.id"
                  class="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td class="px-5 py-3.5">
                    <div class="text-sm font-medium text-slate-900 dark:text-white">
                      {{ post.title }}
                    </div>
                    <div class="mt-0.5 max-w-sm truncate font-mono text-[11px] text-slate-400">
                      {{ post.excerpt || '暂无摘要' }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-5 py-3.5">
                    <span
                      v-if="post.category"
                      class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      >{{ post.category }}</span
                    >
                    <span v-else class="font-mono text-[11px] text-slate-300 dark:text-slate-700"
                      >—</span
                    >
                  </td>
                  <td class="whitespace-nowrap px-5 py-3.5">
                    <span
                      class="rounded-md px-2 py-0.5 font-mono text-[10px]"
                      :class="
                        post.published
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400'
                      "
                    >
                      {{ post.published ? 'published' : 'draft' }}
                    </span>
                  </td>
                  <td
                    class="whitespace-nowrap px-5 py-3.5 font-mono text-[11px] text-slate-400 dark:text-slate-500"
                  >
                    {{ formatDate(post.created_at) }}
                  </td>
                  <td class="whitespace-nowrap px-5 py-3.5 text-right">
                    <div class="flex items-center justify-end gap-3">
                      <NuxtLink
                        v-if="post.published"
                        :to="`/blog/${post.slug}`"
                        class="font-mono text-xs text-slate-400 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        查看
                      </NuxtLink>
                      <NuxtLink
                        :to="`/blog/edit/${post.id}`"
                        class="font-mono text-xs text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        编辑
                      </NuxtLink>
                      <button
                        type="button"
                        class="font-mono text-xs text-rose-500 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                        @click="confirmDeletePost(post)"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- end v-else -->
      </div>
    </div>

    <!-- ═══════════ 删除确认弹窗 ═══════════ -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDeleteDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        @click.self="showDeleteDialog = false"
      >
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div
            v-if="showDeleteDialog"
            class="w-full max-w-sm overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
            @click.stop
          >
            <!-- 终端标题栏 -->
            <div
              class="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-2.5"
            >
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span class="ml-2 font-mono text-xs text-slate-500">post.delete</span>
              </div>
              <button
                type="button"
                class="rounded p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-slate-300"
                @click="showDeleteDialog = false"
              >
                <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
              </button>
            </div>

            <div class="p-5">
              <div class="mb-4 flex items-start gap-3">
                <div
                  class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-900/40"
                >
                  <Icon name="i-heroicons-exclamation-triangle" class="h-4 w-4 text-rose-400" />
                </div>
                <div>
                  <p class="font-semibold text-white">确认删除文章</p>
                  <p class="mt-1 text-sm text-slate-400">
                    删除「<span class="text-white">{{ postToDelete?.title }}</span
                    >」？此操作无法撤销。
                  </p>
                </div>
              </div>
              <!-- 终端命令预览 -->
              <div class="mb-4 rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5">
                <span class="font-mono text-xs text-rose-400">$ </span>
                <span class="font-mono text-xs text-slate-400">rm -rf </span>
                <span class="font-mono text-xs text-slate-300">posts/{{ postToDelete?.slug }}</span>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700"
                  @click="showDeleteDialog = false"
                >
                  取消
                </button>
                <button
                  type="button"
                  :disabled="deleting"
                  class="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-rose-500 disabled:opacity-50"
                  @click="deletePost"
                >
                  <span v-if="deleting" class="inline-flex items-center gap-2">
                    <Icon name="i-heroicons-arrow-path" class="h-3.5 w-3.5 animate-spin" />删除中...
                  </span>
                  <span v-else>确认删除</span>
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
  title: '我的博客',
  description: '管理您创建的博客文章',
  middleware: 'auth'
})

const { user } = useSupabaseAuth()
const supabase = useSupabaseClient()
const { deletePost: deletePostFromBlog } = useBlogPosts()

const posts = ref([])
const loading = ref(true)
const showDeleteDialog = ref(false)
const postToDelete = ref(null)
const deleting = ref(false)
const activeFilter = ref('all')

const publishedCount = computed(() => posts.value.filter(p => p.published).length)
const draftCount = computed(() => posts.value.filter(p => !p.published).length)

const filterTabs = computed(() => [
  { id: 'all', label: '全部', count: posts.value.length },
  { id: 'published', label: '已发布', count: publishedCount.value },
  { id: 'draft', label: '草稿', count: draftCount.value }
])

const filteredPosts = computed(() => {
  if (activeFilter.value === 'published') return posts.value.filter(p => p.published)
  if (activeFilter.value === 'draft') return posts.value.filter(p => !p.published)
  return posts.value
})

const fetchMyPosts = async () => {
  if (!user.value) {
    loading.value = false
    return
  }
  try {
    loading.value = true
    const userId = user.value.id || user.value.sub
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    posts.value = data || []
  } catch (error) {
    console.error('获取文章列表失败:', error)
    useToast().error('错误', '获取文章列表失败')
  } finally {
    loading.value = false
  }
}

const formatDate = dateString => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const confirmDeletePost = post => {
  postToDelete.value = post
  showDeleteDialog.value = true
}

const deletePost = async () => {
  if (!postToDelete.value || !user.value) return
  try {
    deleting.value = true
    const userId = user.value.id || user.value.sub
    if (postToDelete.value.author_id !== userId) {
      useToast().error('错误', '您只能删除自己的文章')
      return
    }
    const { error } = await deletePostFromBlog(postToDelete.value.id)
    if (error) throw new Error(error)
    await fetchMyPosts()
    showDeleteDialog.value = false
    postToDelete.value = null
    useToast().success('成功', '文章已删除')
  } catch (error) {
    console.error('删除文章失败:', error)
    useToast().error('错误', '删除文章失败')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchMyPosts()
})
</script>
