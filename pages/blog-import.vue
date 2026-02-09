<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-4xl">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">导入文章</h1>
              <p class="mt-2 text-gray-600 dark:text-gray-400">从其他博客网站导入文章到本系统</p>
            </div>
            <NuxtLink
              to="/my-blogs"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Icon name="i-heroicons-arrow-left" class="mr-2 h-4 w-4" />
              返回我的博客
            </NuxtLink>
          </div>
        </div>

        <!-- Step Indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-center space-x-4">
            <div class="flex items-center">
              <div
                :class="[
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  step === 'input' ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'
                ]"
              >
                <Icon v-if="step !== 'input'" name="i-heroicons-check" class="h-5 w-5" />
                <span v-else>1</span>
              </div>
              <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">输入 URL</span>
            </div>
            <div class="h-px w-12 bg-gray-300 dark:bg-gray-600" />
            <div class="flex items-center">
              <div
                :class="[
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  step === 'preview'
                    ? 'bg-blue-600 text-white'
                    : step === 'saving'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                ]"
              >
                <Icon v-if="step === 'saving'" name="i-heroicons-check" class="h-5 w-5" />
                <span v-else>2</span>
              </div>
              <span
                :class="[
                  'ml-2 text-sm font-medium',
                  step === 'input'
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-white'
                ]"
              >
                预览编辑
              </span>
            </div>
            <div class="h-px w-12 bg-gray-300 dark:bg-gray-600" />
            <div class="flex items-center">
              <div
                :class="[
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  step === 'saving'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                ]"
              >
                3
              </div>
              <span
                :class="[
                  'ml-2 text-sm font-medium',
                  step === 'saving'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                ]"
              >
                保存
              </span>
            </div>
          </div>
        </div>

        <!-- Step 1: URL Input -->
        <div v-if="step === 'input'" class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">输入文章 URL</h2>
          <form @submit.prevent="handleFetch">
            <div class="flex flex-col gap-4 sm:flex-row">
              <div class="flex-1">
                <input
                  v-model="url"
                  type="url"
                  required
                  placeholder="https://blog.csdn.net/xxx/article/details/xxx"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  :disabled="loading"
                />
              </div>
              <button
                type="submit"
                :disabled="loading || !url"
                class="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon
                  v-if="loading"
                  name="i-heroicons-arrow-path"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                <Icon v-else name="i-heroicons-magnifying-glass" class="mr-2 h-4 w-4" />
                {{ loading ? '解析中...' : '解析' }}
              </button>
            </div>

            <!-- Error message -->
            <div v-if="importError" class="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div class="flex">
                <Icon name="i-heroicons-x-circle" class="h-5 w-5 text-red-400" />
                <div class="ml-3">
                  <p class="text-sm text-red-700 dark:text-red-400">
                    {{ importError }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Supported platforms hint -->
            <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>支持大多数博客网站文章导入，包括但不限于：</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="platform in supportedPlatforms"
                  :key="platform"
                  class="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  {{ platform }}
                </span>
              </div>
            </div>
          </form>
        </div>

        <!-- Step 2: Preview & Edit -->
        <div v-if="step === 'preview' && result" class="space-y-6">
          <!-- Success banner -->
          <div class="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
            <div class="flex items-center">
              <Icon name="i-heroicons-check-circle" class="h-5 w-5 text-green-400" />
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800 dark:text-green-300">
                  解析成功
                  <span class="ml-2 font-normal text-green-600 dark:text-green-400">
                    来源：{{ result.sourceSiteName }}
                  </span>
                </p>
              </div>
              <div class="ml-auto">
                <button
                  type="button"
                  class="text-sm text-green-600 hover:text-green-500 dark:text-green-400"
                  @click="reset"
                >
                  重新导入
                </button>
              </div>
            </div>
          </div>

          <!-- Metadata edit form -->
          <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">文章信息</h3>

            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  标题
                </label>
                <input
                  v-model="editForm.title"
                  type="text"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              <!-- Category & Tags row -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    分类
                  </label>
                  <input
                    v-model="editForm.category"
                    type="text"
                    placeholder="如：前端开发、后端开发"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    标签
                    <span class="text-gray-400">（逗号分隔）</span>
                  </label>
                  <input
                    v-model="tagsString"
                    type="text"
                    placeholder="如：Vue3, TypeScript, 前端"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <!-- Excerpt -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  摘要
                </label>
                <textarea
                  v-model="editForm.excerpt"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Image report -->
          <div
            v-if="result.images.total > 0"
            class="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          >
            <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">图片导入</h3>
            <div class="flex flex-wrap items-center gap-4 text-sm">
              <span class="text-gray-600 dark:text-gray-400">
                共 {{ result.images.total }} 张图片
              </span>
              <span class="text-green-600 dark:text-green-400">
                {{ result.images.success }} 张成功
              </span>
              <span v-if="result.images.duplicates > 0" class="text-blue-600 dark:text-blue-400">
                {{ result.images.duplicates }} 张去重（已存在）
              </span>
              <span v-if="result.images.failed.length > 0" class="text-red-600 dark:text-red-400">
                {{ result.images.failed.length }} 张失败
              </span>
            </div>
            <!-- Duplicate info -->
            <div
              v-if="result.images.duplicates > 0"
              class="mt-3 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20"
            >
              <p class="text-sm text-blue-800 dark:text-blue-300">
                <Icon name="i-heroicons-information-circle" class="mr-1 inline h-4 w-4" />
                检测到
                {{ result.images.duplicates }} 张重复图片，已自动使用之前上传的版本，节省存储空间。
              </p>
            </div>
            <!-- Failed images -->
            <div
              v-if="result.images.failed.length > 0"
              class="mt-3 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20"
            >
              <p class="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-300">
                以下图片下载失败，已保留原始链接：
              </p>
              <ul class="space-y-1">
                <li
                  v-for="failedUrl in result.images.failed"
                  :key="failedUrl"
                  class="truncate text-xs text-yellow-700 dark:text-yellow-400"
                >
                  {{ failedUrl }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Content Preview -->
          <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">正文预览</h3>
              <button
                type="button"
                class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                @click="showRawMarkdown = !showRawMarkdown"
              >
                {{ showRawMarkdown ? '渲染预览' : '查看 Markdown' }}
              </button>
            </div>

            <!-- Raw markdown view -->
            <div v-if="showRawMarkdown" class="max-h-96 overflow-y-auto">
              <pre
                class="whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                >{{ editForm.content }}</pre
              >
            </div>

            <!-- Rendered preview -->
            <div
              v-else
              class="prose prose-sm max-h-96 max-w-none overflow-y-auto rounded-md bg-gray-50 p-4 dark:prose-invert dark:bg-gray-900"
              v-html="renderedContent"
            />
          </div>

          <!-- Source info -->
          <div
            v-if="result.author || result.sourceUrl"
            class="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20"
          >
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p v-if="result.author">
                <span class="font-medium">原作者：</span>{{ result.author }}
              </p>
              <p v-if="result.publishedAt">
                <span class="font-medium">发布时间：</span>{{ formatDate(result.publishedAt) }}
              </p>
              <p>
                <span class="font-medium">原文链接：</span>
                <a
                  :href="result.sourceUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline hover:text-blue-600"
                >
                  {{ result.sourceUrl }}
                </a>
              </p>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-col gap-3">
            <!-- 主要操作按钮 -->
            <div class="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                :disabled="loading || !editForm.title"
                class="inline-flex flex-1 items-center justify-center rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                @click="handleSave(true)"
              >
                <Icon
                  v-if="loading"
                  name="i-heroicons-arrow-path"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                <Icon v-else name="i-heroicons-rocket-launch" class="mr-2 h-4 w-4" />
                {{ loading ? '发布中...' : '立即发布' }}
              </button>
              <button
                type="button"
                :disabled="loading || !editForm.title"
                class="inline-flex flex-1 items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                @click="handleSave(false)"
              >
                <Icon
                  v-if="loading"
                  name="i-heroicons-arrow-path"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                <Icon v-else name="i-heroicons-document" class="mr-2 h-4 w-4" />
                {{ loading ? '保存中...' : '保存为草稿' }}
              </button>
            </div>
            <!-- 次要操作按钮 -->
            <button
              type="button"
              :disabled="loading || !editForm.title"
              class="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="handleOpenInEditor"
            >
              <Icon name="i-heroicons-pencil-square" class="mr-2 h-4 w-4" />
              在编辑器中编辑
            </button>
          </div>
        </div>

        <!-- Loading overlay for saving -->
        <div
          v-if="step === 'saving' && loading"
          class="rounded-lg bg-white p-12 text-center shadow dark:bg-gray-800"
        >
          <Icon
            name="i-heroicons-arrow-path"
            class="mx-auto h-12 w-12 animate-spin text-blue-500"
          />
          <p class="mt-4 text-lg font-medium text-gray-900 dark:text-white">正在保存文章...</p>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            请稍候，正在将文章保存到数据库
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: '导入文章'
})

const toast = useToast()
const {
  loading,
  result,
  error: importError,
  step,
  fetchArticle,
  saveAsPost,
  reset: importReset
} = useImport()

// Form state
const url = ref('')
const showRawMarkdown = ref(false)

const editForm = reactive({
  title: '',
  content: '',
  excerpt: '',
  category: ''
})

const tagsString = ref('')

const supportedPlatforms = [
  'CSDN',
  '掘金',
  '知乎专栏',
  'Medium',
  '博客园',
  '简书',
  'Dev.to',
  'WordPress',
  '通用博客网站'
]

// Markdown renderer for preview
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// Computed rendered content
const renderedContent = computed(() => {
  if (!editForm.content) return ''
  return md.render(editForm.content)
})

// Computed tags array
const tagsArray = computed(() => {
  return tagsString.value
    .split(/[,，]/)
    .map(t => t.trim())
    .filter(t => t.length > 0)
})

// Watch result and populate form
watch(result, val => {
  if (val) {
    editForm.title = val.title
    editForm.content = val.content
    editForm.excerpt = val.excerpt
    editForm.category = ''
    tagsString.value = val.tags.join(', ')
  }
})

// Handle fetch
async function handleFetch() {
  if (!url.value) return
  await fetchArticle(url.value)
}

// Handle save as draft
async function handleSave(published: boolean) {
  const { slug, error } = await saveAsPost({
    title: editForm.title,
    content: editForm.content,
    excerpt: editForm.excerpt,
    category: editForm.category,
    tags: tagsArray.value,
    coverImage: result.value?.coverImage || null,
    published
  })

  if (error) {
    toast.error('保存失败', error)
    return
  }

  if (published && slug) {
    toast.success('保存成功', '文章已发布')
    await navigateTo(`/blog/${slug}`)
  } else {
    toast.success('保存成功', '文章已保存为草稿')
    await navigateTo('/my-blogs')
  }
}

// Handle open in editor (save as draft first, then redirect to editor)
async function handleOpenInEditor() {
  const { id, slug, error } = await saveAsPost({
    title: editForm.title,
    content: editForm.content,
    excerpt: editForm.excerpt,
    category: editForm.category,
    tags: tagsArray.value,
    coverImage: result.value?.coverImage || null,
    published: false
  })

  console.log('[handleOpenInEditor] saveAsPost result:', { id, slug, error })

  if (error) {
    toast.error('保存失败', error)
    return
  }

  if (!id) {
    console.error('[handleOpenInEditor] No id returned from saveAsPost, slug:', slug)
    toast.error('保存失败', '无法获取文章ID')
    return
  }

  toast.success('已保存为草稿', '正在跳转到编辑器...')
  console.log('[handleOpenInEditor] Navigating to:', `/blog/edit/${id}`)
  await navigateTo(`/blog/edit/${id}`)
}

// Reset everything
function reset() {
  importReset()
  url.value = ''
  editForm.title = ''
  editForm.content = ''
  editForm.excerpt = ''
  editForm.category = ''
  tagsString.value = ''
  showRawMarkdown.value = false
}

// Format date helper
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}
</script>
