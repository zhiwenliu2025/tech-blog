<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- ═══════════ 顶部操作栏 ═══════════ -->
    <div
      class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95"
    >
      <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/my-blogs"
            class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-500 transition-all hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <Icon name="heroicons:arrow-left" class="h-3.5 w-3.5" />
            返回
          </NuxtLink>
          <span class="text-slate-300 dark:text-slate-700">/</span>
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500">blog.import</span>
        </div>
        <!-- 步骤指示器（顶栏内） -->
        <div class="hidden items-center gap-2 sm:flex">
          <template v-for="(s, i) in steps" :key="s.id">
            <div class="flex items-center gap-1.5">
              <div
                class="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold transition-all"
                :class="getStepClass(s.id)"
              >
                <Icon v-if="isStepDone(s.id)" name="i-heroicons-check" class="h-3 w-3" />
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span
                class="font-mono text-[10px] transition-colors"
                :class="
                  step === s.id
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-400 dark:text-slate-600'
                "
                >{{ s.label }}</span
              >
            </div>
            <div v-if="i < steps.length - 1" class="h-px w-6 bg-slate-200 dark:bg-slate-800" />
          </template>
        </div>
      </div>
    </div>

    <!-- ═══════════ 主内容 ═══════════ -->
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- ═══ Step 1：URL 输入 ═══ -->
      <div v-if="step === 'input'" class="space-y-5">
        <!-- 标题 -->
        <div>
          <div class="mb-1 font-mono text-xs text-primary-400">// import.article</div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">导入文章</h1>
          <p class="mt-1 font-mono text-sm text-slate-500 dark:text-slate-400">
            从其他博客平台导入文章到本系统
          </p>
        </div>

        <!-- URL 输入框卡片 -->
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <!-- 终端标题栏 -->
          <div
            class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span class="ml-2 font-mono text-xs text-slate-500">fetch.article</span>
          </div>

          <div class="p-5">
            <form @submit.prevent="handleFetch">
              <!-- URL 输入行 -->
              <div class="flex flex-col gap-3 sm:flex-row">
                <div class="relative flex-1">
                  <span
                    class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-primary-500"
                    >$</span
                  >
                  <input
                    v-model="url"
                    type="url"
                    required
                    placeholder="https://blog.csdn.net/xxx/article/..."
                    class="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3.5 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
                    :disabled="loading"
                  />
                </div>
                <button
                  type="submit"
                  :disabled="loading || !url"
                  class="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon v-if="loading" name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
                  <Icon v-else name="i-heroicons-magnifying-glass" class="h-4 w-4" />
                  {{ loading ? '解析中...' : '解析' }}
                </button>
              </div>

              <!-- 错误提示 -->
              <div
                v-if="importError"
                class="mt-4 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-800/50 dark:bg-rose-900/20"
              >
                <Icon
                  name="i-heroicons-x-circle"
                  class="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500"
                />
                <p class="font-mono text-xs text-rose-700 dark:text-rose-400">
                  {{ importError }}
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- 支持平台 -->
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
            <span class="font-mono text-[10px] text-slate-400 dark:text-slate-500"
              >// supported.platforms</span
            >
          </div>
          <div class="px-5 py-4">
            <p class="mb-3 text-xs text-slate-500 dark:text-slate-400">
              支持大多数博客网站文章导入，包括但不限于：
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="platform in supportedPlatforms"
                :key="platform"
                class="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              >
                {{ platform }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ Step 2：预览与编辑 ═══ -->
      <div v-if="step === 'preview' && result" class="space-y-5">
        <!-- 解析成功横幅 -->
        <div
          class="flex items-center justify-between rounded-xl border border-emerald-200/60 bg-emerald-50/60 px-4 py-3 dark:border-emerald-800/40 dark:bg-emerald-900/15"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40"
            >
              <Icon
                name="i-heroicons-check-circle"
                class="h-4 w-4 text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div>
              <p class="text-sm font-semibold text-emerald-800 dark:text-emerald-300">解析成功</p>
              <p class="font-mono text-[10px] text-emerald-600 dark:text-emerald-500">
                来源：{{ result.sourceSiteName }}
              </p>
            </div>
          </div>
          <button
            type="button"
            class="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 font-mono text-xs text-emerald-600 transition-all hover:bg-emerald-50 dark:border-emerald-800/50 dark:bg-slate-800 dark:text-emerald-400"
            @click="reset"
          >
            重新导入
          </button>
        </div>

        <!-- 文章信息编辑 -->
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span class="ml-2 font-mono text-xs text-slate-500">post.metadata</span>
          </div>
          <div class="space-y-4 p-5">
            <!-- 标题 -->
            <div>
              <label
                class="mb-1.5 flex items-center gap-1.5 font-mono text-xs text-slate-400 dark:text-slate-500"
              >
                <span class="text-primary-500">title</span>
                <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="editForm.title"
                type="text"
                required
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
              />
            </div>
            <!-- 分类 + 标签 -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block font-mono text-xs text-slate-400 dark:text-slate-500">
                  <span class="text-primary-500">category</span>
                </label>
                <div class="relative">
                  <Icon
                    name="heroicons:folder"
                    class="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    v-model="editForm.category"
                    type="text"
                    placeholder="前端开发"
                    class="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label
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
                    v-model="tagsString"
                    type="text"
                    placeholder="Vue3, TypeScript"
                    class="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3.5 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
                  />
                </div>
                <!-- 标签预览 -->
                <div v-if="tagsArray.length > 0" class="mt-2 flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in tagsArray"
                    :key="tag"
                    class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    >#{{ tag }}</span
                  >
                </div>
              </div>
            </div>
            <!-- 摘要 -->
            <div>
              <label
                class="mb-1.5 flex items-center gap-1.5 font-mono text-xs text-slate-400 dark:text-slate-500"
              >
                <span class="text-primary-500">excerpt</span>
              </label>
              <textarea
                v-model="editForm.excerpt"
                rows="2"
                class="block w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
              />
            </div>
          </div>
        </div>

        <!-- 图片导入报告 -->
        <div
          v-if="result.images.total > 0"
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
            <span class="font-mono text-[10px] text-slate-400 dark:text-slate-500"
              >// images.report</span
            >
          </div>
          <div class="p-5">
            <!-- 统计行 -->
            <div class="mb-3 flex flex-wrap gap-4">
              <div class="text-center">
                <div class="text-lg font-bold text-slate-900 dark:text-white">
                  {{ result.images.total }}
                </div>
                <div class="font-mono text-[10px] text-slate-400">total</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-emerald-500">
                  {{ result.images.success }}
                </div>
                <div class="font-mono text-[10px] text-slate-400">success</div>
              </div>
              <div v-if="result.images.duplicates > 0" class="text-center">
                <div class="text-lg font-bold text-primary-500">
                  {{ result.images.duplicates }}
                </div>
                <div class="font-mono text-[10px] text-slate-400">dedupe</div>
              </div>
              <div v-if="result.images.failed.length > 0" class="text-center">
                <div class="text-lg font-bold text-rose-500">
                  {{ result.images.failed.length }}
                </div>
                <div class="font-mono text-[10px] text-slate-400">failed</div>
              </div>
            </div>
            <!-- 去重提示 -->
            <div
              v-if="result.images.duplicates > 0"
              class="mb-2 flex items-start gap-2 rounded-lg border border-primary-200/50 bg-primary-50/50 px-3 py-2.5 dark:border-primary-800/30 dark:bg-primary-900/10"
            >
              <Icon
                name="i-heroicons-information-circle"
                class="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500"
              />
              <p class="font-mono text-[11px] text-primary-700 dark:text-primary-300">
                检测到 {{ result.images.duplicates }} 张重复图片，已自动使用之前上传的版本。
              </p>
            </div>
            <!-- 失败图片 -->
            <div
              v-if="result.images.failed.length > 0"
              class="rounded-lg border border-amber-200/50 bg-amber-50/50 px-3 py-2.5 dark:border-amber-800/30 dark:bg-amber-900/10"
            >
              <p
                class="mb-2 font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-400"
              >
                以下图片下载失败，已保留原始链接：
              </p>
              <ul class="max-h-28 space-y-1 overflow-y-auto">
                <li
                  v-for="failedUrl in result.images.failed"
                  :key="failedUrl"
                  class="break-all font-mono text-[10px] text-amber-600 dark:text-amber-500"
                >
                  {{ failedUrl }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 正文预览 -->
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span class="ml-2 font-mono text-xs text-slate-500">post.content.md</span>
            <div class="ml-auto">
              <button
                type="button"
                class="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] text-slate-500 transition-all hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                @click="showRawMarkdown = !showRawMarkdown"
              >
                {{ showRawMarkdown ? 'rendered' : 'raw.md' }}
              </button>
            </div>
          </div>
          <div class="p-0">
            <!-- Raw Markdown -->
            <div v-if="showRawMarkdown" class="max-h-96 overflow-y-auto">
              <pre
                class="whitespace-pre-wrap p-5 font-mono text-xs text-slate-700 dark:text-slate-300"
                >{{ editForm.content }}</pre
              >
            </div>
            <!-- 渲染预览 -->
            <!-- eslint-disable vue/no-v-html -->
            <div
              v-else
              class="prose prose-sm max-h-96 max-w-none overflow-y-auto p-5 dark:prose-invert"
              v-html="renderedContent"
            />
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>

        <!-- 原文信息 -->
        <div
          v-if="result.author || result.sourceUrl"
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
            <span class="font-mono text-[10px] text-slate-400 dark:text-slate-500"
              >// source.info</span
            >
          </div>
          <div class="space-y-2 p-5">
            <div v-if="result.author" class="flex items-center gap-2">
              <span class="w-20 flex-shrink-0 font-mono text-[10px] text-slate-400">author</span>
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ result.author }}</span>
            </div>
            <div v-if="result.publishedAt" class="flex items-center gap-2">
              <span class="w-20 flex-shrink-0 font-mono text-[10px] text-slate-400">published</span>
              <span class="font-mono text-[11px] text-slate-500">{{
                formatDate(result.publishedAt)
              }}</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="w-20 flex-shrink-0 font-mono text-[10px] text-slate-400">source</span>
              <a
                :href="result.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="break-all font-mono text-[11px] text-primary-600 underline underline-offset-2 transition-colors hover:text-primary-800 dark:text-primary-400"
                >{{ result.sourceUrl }}</a
              >
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div
          class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
            <span class="font-mono text-[10px] text-slate-400 dark:text-slate-500"
              >// save.options</span
            >
          </div>
          <div class="flex flex-col gap-3 p-5 sm:flex-row">
            <button
              type="button"
              :disabled="loading || !editForm.title"
              class="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              @click="handleSave(true)"
            >
              <Icon v-if="loading" name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
              <Icon
                v-else
                name="i-heroicons-rocket-launch"
                class="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
              />
              {{ loading ? '发布中...' : '立即发布' }}
            </button>
            <button
              type="button"
              :disabled="loading || !editForm.title"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
              @click="handleSave(false)"
            >
              <Icon v-if="loading" name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
              <Icon v-else name="i-heroicons-document" class="h-4 w-4" />
              {{ loading ? '保存中...' : '保存为草稿' }}
            </button>
            <button
              type="button"
              :disabled="loading || !editForm.title"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              @click="handleOpenInEditor"
            >
              <Icon name="i-heroicons-pencil-square" class="h-4 w-4" />
              在编辑器中编辑
            </button>
          </div>
        </div>
      </div>

      <!-- ═══ Step 3：保存中 ═══ -->
      <div
        v-if="step === 'saving' && loading"
        class="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        <div class="flex items-center gap-2 border-b border-slate-800 bg-slate-800/80 px-4 py-2.5">
          <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span class="ml-2 font-mono text-xs text-slate-500">post.save</span>
        </div>
        <div class="py-14 text-center">
          <Icon
            name="i-heroicons-arrow-path"
            class="mx-auto mb-4 h-10 w-10 animate-spin text-primary-500"
          />
          <p class="font-mono text-sm text-white">saving article...</p>
          <p class="mt-1 font-mono text-xs text-slate-500">请稍候，正在将文章保存到数据库</p>
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

const steps = [
  { id: 'input', label: 'input.url' },
  { id: 'preview', label: 'preview' },
  { id: 'saving', label: 'saving' }
]

const stepOrder = ['input', 'preview', 'saving']

function getStepClass(id: string) {
  const current = stepOrder.indexOf(step.value)
  const target = stepOrder.indexOf(id)
  if (target < current) return 'bg-emerald-500 text-white'
  if (target === current) return 'bg-primary-600 text-white'
  return 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
}

function isStepDone(id: string) {
  return stepOrder.indexOf(id) < stepOrder.indexOf(step.value)
}

const md = new MarkdownIt({ html: true, linkify: true, typographer: true, breaks: true })

const renderedContent = computed(() => {
  if (!editForm.content) return ''
  return md.render(editForm.content)
})

const tagsArray = computed(() =>
  tagsString.value
    .split(/[,，]/)
    .map(t => t.trim())
    .filter(t => t.length > 0)
)

watch(result, val => {
  if (val) {
    editForm.title = val.title
    editForm.content = val.content
    editForm.excerpt = val.excerpt
    editForm.category = ''
    tagsString.value = val.tags.join(', ')
  }
})

async function handleFetch() {
  if (!url.value) return
  await fetchArticle(url.value)
}

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
  await navigateTo(`/blog/edit/${id}`)
}

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

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}
</script>
