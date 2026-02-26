<template>
  <div>
    <!-- 深色英雄区 -->
    <div class="relative overflow-hidden bg-slate-900">
      <!-- 点阵底纹 -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.18]"
        style="
          background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
          background-size: 28px 28px;
        "
      />
      <div
        class="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-600/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl"
      />
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
      />

      <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div class="flex items-center gap-4">
          <!-- 图标块 -->
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700"
          >
            <Icon name="heroicons:folder-open" class="h-6 w-6 text-primary-400" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="mb-0.5 font-mono text-xs text-primary-400">// category.posts</div>
            <h1 class="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {{ category }}
            </h1>
          </div>

          <!-- 文章计数 -->
          <div
            v-if="!pending"
            class="flex-shrink-0 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-center"
          >
            <div class="text-lg font-bold text-white">
              {{ posts?.length ?? 0 }}
            </div>
            <div class="font-mono text-[10px] text-slate-500">posts</div>
          </div>
        </div>

        <p class="mt-4 font-mono text-sm text-slate-400">
          <span class="text-emerald-400">$</span>
          <span class="ml-2">find . --category "{{ category }}" --published</span>
        </p>
      </div>
    </div>

    <!-- 主内容区 -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <!-- 面包屑导航 -->
      <nav
        class="mb-6 flex items-center gap-2 font-mono text-xs text-slate-400 dark:text-slate-500"
      >
        <NuxtLink
          to="/"
          class="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
        >
          ~
        </NuxtLink>
        <span class="text-slate-300 dark:text-slate-700">/</span>
        <NuxtLink
          to="/blog"
          class="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
        >
          blog
        </NuxtLink>
        <span class="text-slate-300 dark:text-slate-700">/</span>
        <span class="text-slate-600 dark:text-slate-400">{{ category }}</span>
      </nav>

      <!-- 加载骨架 -->
      <div v-if="pending" class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="i in 6"
          :key="i"
          class="animate-pulse overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
        >
          <!-- 骨架标题栏 -->
          <div
            class="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/40"
          >
            <div class="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div class="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div class="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div class="ml-2 h-2 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <!-- 骨架图片 -->
          <div class="h-40 bg-slate-200 dark:bg-slate-700" />
          <!-- 骨架内容 -->
          <div class="space-y-3 p-4">
            <div class="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div class="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
            <div class="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div
        v-else-if="posts && posts.length > 0"
        class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <BlogPostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center dark:border-slate-800 dark:bg-slate-900/30"
      >
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
        >
          <Icon name="heroicons:folder-open" class="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>
        <p class="font-mono text-xs text-slate-400 dark:text-slate-600">// no.posts.found</p>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">该分类下暂无文章</p>
        <NuxtLink
          to="/blog"
          class="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-500"
        >
          <Icon name="heroicons:arrow-left" class="h-4 w-4" />
          浏览所有文章
        </NuxtLink>
      </div>

      <!-- 返回导航 -->
      <div
        v-if="!pending && posts && posts.length > 0"
        class="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800"
      >
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-primary-700 dark:hover:text-primary-400"
        >
          <Icon name="heroicons:arrow-left" class="h-4 w-4" />
          所有文章
        </NuxtLink>
        <span class="font-mono text-xs text-slate-400 dark:text-slate-600">
          {{ posts.length }} posts in "{{ category }}"
        </span>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const category = computed(() => route.params.slug as string)

const { getPostsByCategory } = useBlogPosts()
const { data: posts, pending } = await useAsyncData(
  () => `posts-${category.value}`,
  () => getPostsByCategory(category.value),
  {
    default: () => [],
    server: true,
    watch: [category]
  }
)

useHead({
  title: `${category.value} — 分类文章`,
  meta: [{ name: 'description', content: `浏览 ${category.value} 分类下的所有技术文章` }]
})
</script>
